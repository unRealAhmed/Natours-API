const express = require('express');
const {
  getMe,
  getUser,
  uploadUserPhoto,
  resizeUserPhoto,
  updateMe,
  deleteMe,
  getAllUsers,
  createUser,
  updateUser,
  deleteUser,
} = require('../Controllers/userController');

const {
  signup,
  login,
  logout,
  forgetPassword,
  resetPassword,
  protect,
  restrictTo,
  updatePassword,
} = require('../Controllers/authController');

const router = express.Router();
// Authentication routes
router.post('/signup', signup);
router.post('/login', login);
router.get('/logout', logout);
router.post('/forgotPassword', forgetPassword);
router.patch('/resetPassword/:token', resetPassword);

// Protect all routes after this middleware
router.use(protect);

// User routes
router.get('/me', getMe, getUser);
router.patch('/updateMyPassword', updatePassword);
router.patch('/updateMe', uploadUserPhoto, resizeUserPhoto, updateMe);
router.delete('/deleteMe', deleteMe);

// Admin-restricted routes
router.use(restrictTo('admin'));

// User management routes
router.route('/').get(getAllUsers).post(createUser);
router.route('/:id').get(getUser).patch(updateUser).delete(deleteUser);

module.exports = router;
