const mongoose = require('mongoose');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

const User = require('../models/user');

exports.users_create_user = (req, res, next) => {
    bcrypt.hash(req.body.password, 10, function (err, hash) {

        User.find({email: req.body.email})
            .exec()
            .then(user => {
                if (user.length >= 1) {
                    res.status(409).json(
                        {
                            message: "Email already exists"
                        }
                    );
                } else {

                    if (err) {
                        console.log(err);

                        return res.status(500).json({
                            error: err
                        });
                    } else {
                        const user = new User({
                            _id: new mongoose.Types.ObjectId(),
                            email: req.body.email,
                            password: hash
                        });

                        user.save()
                            .then(result => {
                                res.status(201).json({
                                    message: 'User created succesfully',
                                    user: {
                                        _id: result._id,
                                        email: result.email
                                    }
                                });
                            })
                            .catch(err => {
                                console.log(err);

                                res.status(500).json({error: err})
                            });
                    }
                }
            });
    });
};

exports.users_login_user = (req, res, next) => {
    User.findOne({email: req.body.email}).exec()
        .then(user => {
            if (!user) {
                return res.status(401).json({
                    message: 'Auth failed'
                });
            }

            bcrypt.compare(req.body.password, user.password, (err, result) => {
                if (err) {
                    return res.status(401).json({
                        message: 'Auth failed'
                    });
                }

                if (result) {
                    const token = jwt.sign(
                        {
                            email: user.email,
                            userId: user._id
                        },
                        process.env.JWT_KEY,
                        {
                            expiresIn: '1h'
                        }
                    );

                    return res.status(200).json({
                        message: 'Auth successful',
                        token: token
                    });
                }

                return res.status(401).json({
                    message: 'Auth Failed'
                });
            });
        })
        .catch(err => {
            console.log(err);

            res.status(500).json({error: err})
        });
};

exports.users_remove_user = (req, res, next) => {
    User.remove({_id: req.params.userId})
        .exec()
        .then(result => {
            res.status(200).json({
                message: "User successfully deleted",
                result: result
            })
        })
        .catch(err => {
            console.log(err);

            res.status(500).json({error: err})
        });
};