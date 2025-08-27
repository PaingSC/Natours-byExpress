// 3.2 |Users Routes
const express = require('express');
const userController = require('../controllers/userController');
const authController = require('../controllers/authController');

const router = express.Router();

// Sign up & Login
router.post('/signup', authController.signup);
router.post('/login', authController.login);

// Password
router.post('/forgotPassword', authController.forgotPassword);
router.patch('/resetPassword/:token', authController.resetPassword);

// Updating User
router.patch(
  '/updateMyPassword',
  authController.protect,
  authController.updatePassword,
);
router.get(
  '/me',
  authController.protect,
  userController.getMe,
  userController.getAUser,
);
router.patch('/updateMe', authController.protect, userController.updateMe);
router.delete('/deleteMe', authController.protect, userController.deleteMe);

router
  .route('/')
  .get(userController.getAllUsers)
  .post(userController.createUser);
router
  .route('/:id')
  .get(userController.getAUser)
  .patch(userController.updateUser)
  .delete(userController.deleteAUser);

module.exports = router;
