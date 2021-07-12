const router = require('express').Router();
const { celebrate } = require('celebrate');
const Joi = require('joi-oid');
const { getMe, patchMe } = require('../Controllers/user');

router.get('/me', getMe);

router.patch('/me', celebrate({
  body: Joi.object().keys({
    email: Joi.string().email(),
    name: Joi.string().min(2).max(30),
  }),
}), patchMe);

module.exports = router;
