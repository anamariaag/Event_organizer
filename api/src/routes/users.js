const express = require('express');
const router = express.Router();

const usersController = require('../controllers/users.controller');
const auth = require('../middlewares/auth');
const userType = require('../middlewares/userType');
const {upload} = require('../middlewares/file');


/**
 * @swagger
 * /users:
 *   get:
 *     description: Retrieve user details
 *     tags:
 *       - users
 *     parameters:
 *       - in: header
 *         name: x-access-token
 *         required: true
 *         type: string
 *       - in: query
 *         name: email
 *         required: true
 *         type: string
 *     responses:
 *       200:
 *         description: User details retrieved
 */
router.get('', auth, usersController.show); 

/**
 * @swagger
 * /users/users:
 *   get:
 *     description: Retrieve all users (Admin only)
 *     tags:
 *       - users
 *     parameters:
 *       - in: header
 *         name: x-access-token
 *         required: true
 *         type: string
 *     responses:
 *       200:
 *         description: List of users retrieved
 */
router.get('/users', auth, userType('ADMIN'), usersController.showUsers); 

/**
 * @swagger
 * /users:
 *   post:
 *     description: Create a new user
 *     tags:
 *       - users
 *     parameters:
 *       - in: body
 *         name: user
 *         description: New user details
 *         required: true
 *         schema:
 *           type: object
 *           properties:
 *             name:
 *               type: string
 *             email:
 *               type: string
 *             password:
 *               type: string
 *     responses:
 *       201:
 *         description: User created
 */
router.post('', usersController.create); 

/**
 * @swagger
 * /users:
 *   put:
 *     description: Update a user
 *     tags:
 *       - users
 *     parameters:
 *       - in: header
 *         name: x-access-token
 *         required: true
 *         type: string
 *       - in: body
 *         name: user
 *         description: User details to update
 *         required: true
 *         schema:
 *           type: object
 *           properties:
 *             email:
 *               type: string
 *             name:
 *               type: string
 *             password:
 *               type: string
 *     responses:
 *       200:
 *         description: User updated
 */
router.put('', auth, usersController.update); 

/**
 * @swagger
 * /users:
 *   delete:
 *     description: Delete a user (Admin only)
 *     tags:
 *       - users
 *     parameters:
 *       - in: header
 *         name: x-access-token
 *         required: true
 *         type: string
 *       - in: query
 *         name: id
 *         required: true
 *         type: string
 *     responses:
 *       200:
 *         description: User deleted
 */
router.delete('',auth, userType('ADMIN'), usersController.delete); 

/**
 * @swagger
 * /{id}/upload:
 *   post:
 *     description: Upload a file for a user
 *     tags:
 *       - users
 *     consumes:
 *       - multipart/form-data
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         type: string
 *       - in: header
 *         name: x-access-token
 *         required: true
 *         type: string
 *       - in: formData
 *         name: file
 *         type: file
 *         required: true
 *     responses:
 *       200:
 *         description: File uploaded
 */
router.post('/:id/upload', auth, upload.single('file'), usersController.upload); 



module.exports = router; 