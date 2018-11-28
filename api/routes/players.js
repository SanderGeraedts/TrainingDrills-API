const express = require('express');
const router = express.Router();
const checkAuth = require('../middleware/check-auth');

const PlayerController = require('../controllers/players');

router.post('/', checkAuth, PlayerController.players_create_player);
router.get('/', PlayerController.players_get_all);
router.get('/:playerId', PlayerController.players_get_player);
router.patch('/:playerId', checkAuth, PlayerController.players_update_player);
router.delete('/:playerId', checkAuth, PlayerController.players_delete_player);

module.exports = router;