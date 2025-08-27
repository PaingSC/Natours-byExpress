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

// Authenticated (Protected) Routes
router.use(authController.protect);
router.patch(
  '/updateMyPassword',

  authController.updatePassword,
);
router.get(
  '/me',

  userController.getMe,
  userController.getAUser,
);
router.patch('/updateMe', userController.updateMe);
router.delete('/deleteMe', userController.deleteMe);

router.use(authController.restrictTo('admin'));

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
