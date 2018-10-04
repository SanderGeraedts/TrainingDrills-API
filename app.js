const express = require('express');
const app = express();
const morgan = require('morgan');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');

const userRoutes = require('./api/routes/users');
const drillRoutes = require('./api/routes/drills');

// Connect to MongoDB
mongoose.connect('mongodb+srv://sandergeraedts:' + process.env.MONGO_ATLAS_PW + '@primary-cluster-ppwsd.mongodb.net/test?retryWrites=true',
    {
        useNewUrlParser: true
    }
);

// Setup morgan for logging
app.use(morgan('dev'));

// Setup static folder, making '/uploads' publically accessible
app.use('/uploads', express.static('uploads'));

// Setup BodyParser
app.use(bodyParser.urlencoded({extended: true, limit: '50mb'}));
app.use(bodyParser.json({
    limit: '50mb'
}));

// CORS middleware
app.use((req, res, next) => {
    res.header('Access-Control-Allow-Origin', '*');
    res.header('Access-Control-Allow-Headers',
        'Origin, X-Requested-With, Content-Type, Accept, Authorization'
    );

    if (req.method === 'OPTIONS') {
        res.header('Access-Control-Allow-Methods',
            'PUT, POST, PATCH, DELETE, GET'
        );
        return res.status(200).json({});
    }

    next();
});

// Routes go here
app.use('/drills', drillRoutes);
app.use('/users', userRoutes);

// If Route is not found, throw 404
app.use((req, res, next) => {
    const error = new Error('Not Found');
    error.status = 404;
    next(error);
});

// If an error is thrown, throw error and 500
app.use((error, req, res, next) => {
    res.status(error.status || 500)
        .json({
            error: {
                message: error.message
            }
        });
});

// Export app.js
module.exports = app;