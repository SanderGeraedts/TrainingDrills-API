const mongoose = require('mongoose');

exports.drills_get_all = (req, res, next) => {
    return res.status(200).json({
        message: "Get all hook works"
    });
};

exports.drills_get_drill = (req, res, next) => {
    return res.status(200).json({
        message: "Get drill hook works"
    });
};

exports.drills_create_drill = (req, res, next) => {
    return res.status(201).json({
        message: "Create Drill hook works"
    });
};

exports.drills_remove_drill = (req, res, next) => {
    return res.status(200).json({
        message: "Remove Drill hook works"
    });
};

exports.drills_update_drill = (req, res, next) => {
    return res.status(200).json({
        message: "Update Drill hook works"
    });
};