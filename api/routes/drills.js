const express = require('express');
const router = express.Router();
const multer = require('multer');

const checkAuth = require('../middleware/check-auth');
const DrillController = require('../controllers/drills');

const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, 'uploads/');
    },
    filename: function (req, file, cb) {
        cb(null, new Date().toISOString() + file.originalname)
    }
});

const upload = multer({
    storage: storage,
    limits: {
        fileSize: 1024 * 1024 * 50
    }
});


router.get('/', DrillController.drills_get_all);

router.post(
    '/',
    checkAuth,
    upload.array('images', 10),
    DrillController.drills_create_drill
);

router.get('/:drillId', DrillController.drills_get_drill);

router.patch('/:drillId', checkAuth, DrillController.drills_update_drill);

router.delete('/:drillId', checkAuth, DrillController.drills_remove_drill);

module.exports = router;