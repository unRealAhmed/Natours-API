const express = require('express')
const userController = require('../Controllers/userController')
const authController = require('../Controllers/authController')


const router = express()


router.route('/signup').post(authController.signUp)
router.route('/login').get(authController.login)

router.route('/').get(userController.getAllUsers)

router.route('/:id').
  get(userController.getUser).
  post(userController.createUser).
  patch(userController.updateUser).
  delete(userController.deleteUser)

module.exports = router