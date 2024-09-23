const express = require('express');
const router = express.Router();

const userController = require('../controllers/users.controller');

/**
 * @swagger
 * /login:
 *   post:
 *     description: Login for users
 *     tags:
 *       - auth
 *     parameters:
 *       - in: body
 *         name: user
 *         description: User login details
 *         required: true
 *         schema:
 *           type: object
 *           properties:
 *             email:
 *               type: string
 *             password:
 *               type: string
 *     responses:
 *       200:
 *         description: Login successful
 *       401:
 *         description: Unauthorized
 */
router.post('/login', userController.login); //requires body with new user to create

/**
 * @swagger
 * /googleApi:
 *   get:
 *     description: Initiate Google API authentication process
 *     tags:
 *       - auth
 *     responses:
 *       200:
 *         description: Google API authentication initiated
 */
router.get('/googleApi', userController.googleAPI);

/**
 * @swagger
 * /googleApi/credentials:
 *   get:
 *     description: Callback for Google API authentication
 *     tags:
 *       - auth
 *     parameters:
 *       - in: query
 *         name: code
 *         required: true
 *         type: string
 *         description: Authorization code received from Google
 *     responses:
 *       200:
 *         description: Google API authentication successful
 *       401:
 *         description: Unauthorized
 */
router.get('/googleApi/credentials', userController.googleAPIRedirect); //requires a query.code

module.exports = router; 