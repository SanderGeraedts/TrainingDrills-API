const mongoose = require('mongoose');
const fs = require('fs');

const Drill = require('../models/drill');
const User = require('../models/user');

exports.drills_get_all = (req, res, next) => {
    const domain = req.protocol + '://' + req.get('host');

    Drill.find()
        .select('_id name description author images tags minParticipants maxParticipants')
        .populate('author', '_id name email')
        .exec()
        .then(drills => {
            res.status(200)
                .json({
                    count: drills.length,
                    drills: drills.map(drill => {
                        return {
                            _id: drill._id,
                            name: drill.name,
                            description: drill.description,
                            author: drill.author,
                            featuredImage: drill.images[0],
                            tags: drill.tags,
                            minParticipants: drill.minParticipants,
                            maxParticipants: drill.maxParticipants,
                            requests: [
                                {
                                    type: 'GET',
                                    url: domain + '/drills/' + drill._id
                                },
                                {
                                    type: 'PATCH',
                                    url: domain + '/drills/' + drill._id,
                                    data: [{
                                        'propName': 'String',
                                        'value': 'Any'
                                    }]
                                },
                                {
                                    type: 'DELETE',
                                    url: domain + '/drills/' + drill._id
                                }
                            ]
                        }
                    }),
                    requests: [
                        {
                            type: 'POST',
                            url: domain + '/drills/',
                            data: {
                                name: "String",
                                description: "String",
                                image: "File",
                                minParticipants: "Number",
                                maxParticipants: "Number"
                            }
                        }
                    ]
                });
        })
        .catch(err => {
            console.log(err);

            res.status(500).json({
                error: err
            })
        });
};

exports.drills_get_drill = (req, res, next) => {
    const domain = req.protocol + '://' + req.get('host');

    Drill.findById(req.params.drillId)
        .select('_id name description author images tags minParticipants maxParticipants')
        .populate('author', '_id name email')
        .then(drill => {
            res.status(200)
                .json({
                    _id: drill._id,
                    name: drill.name,
                    description: drill.description,
                    author: drill.author,
                    images: drill.images,
                    tags: drill.tags,
                    minParticipants: drill.minParticipants,
                    maxParticipants: drill.maxParticipants,
                    requests: [
                        {
                            type: 'GET',
                            url: domain + '/drills/'
                        },
                        {
                            type: 'PATCH',
                            url: domain + '/drills/' + drill._id,
                            data: [{
                                'propName': 'String',
                                'value': 'Any'
                            }]
                        },
                        {
                            type: 'DELETE',
                            url: domain + '/drills/' + drill._id
                        }
                    ]
                });
        })
        .catch(err => {
            console.log(err);

            res.status(500).json({
                error: err
            })
        });
};

exports.drills_create_drill = (req, res, next) => {
    const domain = req.protocol + '://' + req.get('host');

    console.log(req.files);

    User.findById(req.userData.userId)
        .then(user => {
            if (!user) {
                return res.status(401).json({
                    message: 'Auth failed'
                })
            }

            const drill = new Drill({
                _id: mongoose.Types.ObjectId(),
                name: req.body.name,
                description: req.body.description,
                author: user,
                images: req.files.map(file => {
                    return domain + '/' + file.path
                }),
                tags: req.body.tags,
                minParticipants: req.body.minParticipants,
                maxParticipants: req.body.maxParticipants
            });

            drill.save()
                .then(result => {
                    if (result) {
                        res.status(201).json({
                            message: "Drill saved",
                            drill: result
                        });
                    } else {
                        res.status(404).json({
                            message: "Object not found"
                        })
                    }
                })
                .catch(err => {
                    console.log(err);

                    res.status(500).json({
                        error: err
                    })
                });
        })
        .catch(err => {
            console.log(err);

            res.status(500).json({
                error: err
            })
        });
};

exports.drills_remove_drill = (req, res, next) => {
    const domain = req.protocol + '://' + req.get('host');
    const drillId = req.params.drillId;

    Drill.findById(drillId)
        .then(drill => {
            for (const image of drill.images) {
                const path = image.replace(domain, "");

                fs.unlink('.' + path)
            }

            Drill.deleteOne({
                _id: drillId
            }).exec()
                .then(result => {
                    res.status(200).json({
                        message: 'Drill deleted',
                        result: result
                    });
                })
                .catch(err => {
                    console.log(err);

                    res.status(500).json({
                        error: err
                    })
                });
        })
        .catch(err => {
            console.log(err);

            res.status(500).json({
                error: err
            })
        });
};

exports.drills_update_drill = (req, res, next) => {
    const id = req.params.drillId;
    const updateOps = {};

    for (const ops of req.body) {
        updateOps[ops.propName] = ops.value;
    }

    Drill.update({_id: id}, {
        $set: updateOps
    })
        .exec()
        .then(result => {
            res.status(200).json({
                message: 'Drill updated',
                result: result
            });
        })
        .catch(err => {
            console.log(err);

            res.status(500).json({error: err})
        });
};