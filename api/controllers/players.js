const mongoose = require('mongoose');

const Player = require('../models/player');



exports.players_create_player = (req, res, next) => {
    const player = new Player({
        _id: new mongoose.Types.ObjectId(),
        name: req.body.name,
        position: req.body.position,
    });

    player.save()
        .then(result => {
            res.status(201).json({
                message: 'Player created succesfully',
                player: {
                    _id: result._id,
                    name: result.name,
                    position: result.position
                }
            });
        })
        .catch(err => {
            console.log(err);

            res.status(500).json({error: err})
        });
};

exports.players_get_all = (req, res, next) => {
    const domain = req.protocol + '://' + req.get('host');

    Player.find()
        .select('_id name position location')
        .exec()
        .then(players => {
            res.status(200)
                .json({
                    count: players.length,
                    players: players.map(player => {
                        return {
                            _id: player._id,
                            name: player.name,
                            position: player.position,
                            location: player.location,
                            requests: [
                                {
                                    type: 'GET',
                                    url: domain + '/players/' + player._id
                                },
                                {
                                    type: 'PATCH',
                                    url: domain + '/players/' + player._id,
                                    data: [{
                                        'propName': 'String',
                                        'value': 'Any'
                                    }]
                                },
                                {
                                    type: 'DELETE',
                                    url: domain + '/players/' + player._id
                                }
                            ]
                        }
                    }),
                    requests: [
                        {
                            type: 'POST',
                            url: domain + '/players/',
                            data: {
                                name: "String",
                                position: "String"
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

exports.players_get_player = (req, res, next) => {
    const domain = req.protocol + '://' + req.get('host');

    Player.findById(req.params.playerId)
        .select('_id name position location')
        .exec()
        .then(player => {
            res.status(200)
                .json({
                    _id: player._id,
                    name: player.name,
                    location: player.location,
                    requests: [
                        {
                            type: 'POST',
                            url: domain + '/players/',
                            data: {
                                name: "String",
                                position: "String"
                            }
                        },
                        {
                            type: 'GET',
                            url: domain + '/players/' + player._id
                        },
                        {
                            type: 'PATCH',
                            url: domain + '/players/' + player._id,
                            data: [{
                                'propName': 'String',
                                'value': 'Any'
                            }]
                        },
                        {
                            type: 'DELETE',
                            url: domain + '/players/' + player._id
                        }
                    ]
                })
        })
        .catch(err => {
            console.log(err);

            res.status(500).json({
                error: err
            })
        });
}
;

exports.players_update_player = (req, res, next) => {
    const id = req.params.playerId;
    const updateOps = {};

    for (const ops of req.body) {
        updateOps[ops.propName] = ops.value;
    }

    Player.update({_id: id}, {
        $set: updateOps
    })
        .exec()
        .then(result => {
            res.status(200).json({
                message: 'Player updated',
                result: result
            });
        })
        .catch(err => {
            console.log(err);

            res.status(500).json({error: err})
        });
};

exports.players_delete_player = (req, res, next) => {
    const id = req.params.playerId;

    Player.deleteOne({
        _id: id
    }).exec()
        .then(result => {
            res.status(200).json({
                message: 'Player deleted',
                result: result
            });
        })
        .catch(err => {
            console.log(err);

            res.status(500).json({
                error: err
            })
        });
};