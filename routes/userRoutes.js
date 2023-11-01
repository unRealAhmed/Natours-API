const express = require('express')
const userController = require('../Controllers/userController')

const router = express()

router.route('/').get(userController.getAllUsers)

router.route('/:id').
  get(userController.getUser).
  post(userController.createUser).
  patch(userController.updateUser).
  delete(userController.deleteUser)

module.exports = router