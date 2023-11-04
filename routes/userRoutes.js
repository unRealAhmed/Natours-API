const express = require('express')
const userController = require('../Controllers/userController')
const authController = require('../Controllers/authController')

const router = express()


router.route('/signup').post(authController.signUp)
router.route('/login').post(authController.login)
router.route('/forgetPassword').post(authController.forgetPassword)
router.route('/resetPassword/:token').patch(authController.resetPassword)
router.route('/updateMyPassword').patch(authController.protect, authController.updatePassword)

router.route('/').get(userController.getAllUsers)

router.route('/:id')
  .get(authController.protect, userController.getUser)
  .post(userController.createUser)
  .patch(userController.updateUser)
  .delete(userController.deleteUser)

module.exports = router