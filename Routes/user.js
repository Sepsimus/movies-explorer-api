const router = require('express').Router();
const { getMe, patchMe } = require('../Controllers/user');

router.get('/me', getMe);

router.patch('/me', patchMe);

module.exports = router;
