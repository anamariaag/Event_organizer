const express = require('express');
const router = express.Router();

const reviewsController = require('../controllers/reviews.controller');
const userType = require('./../middlewares/userType');

/**
 * @swagger
 * /reviews:
 *   get:
 *     description: Retrieve reviews by Event ID
 *     tags:
 *       - reviews
 *     parameters:
 *       - in: header
 *         name: x-access-token
 *         required: true
 *         type: string
 *       - in: query
 *         name: id
 *         required: true
 *         type: string
 *         description: Event ID to get reviews for
 *     responses:
 *       200:
 *         description: Reviews retrieved successfully
 */
router.get('', reviewsController.showByEventId); //require header x-access-token and the req.query id of the event

/**
 * @swagger
 * /reviews:
 *   post:
 *     description: Create a new review
 *     tags:
 *       - reviews
 *     parameters:
 *       - in: header
 *         name: x-access-token
 *         required: true
 *         type: string
 *       - in: body
 *         name: review
 *         description: Review details
 *         required: true
 *         schema:
 *           type: object
 *           properties:
 *             eventId:
 *               type: string
 *             rating:
 *               type: integer
 *             comment:
 *               type: string
 *     responses:
 *       201:
 *         description: Review created successfully
 */
router.post('', reviewsController.create); //require header x-access-token and the body of the review to be created

/**
 * @swagger
 * /reviews:
 *   put:
 *     description: Update a review
 *     tags:
 *       - reviews
 *     parameters:
 *       - in: header
 *         name: x-access-token
 *         required: true
 *         type: string
 *       - in: body
 *         name: review
 *         description: Updated review details
 *         required: true
 *         schema:
 *           type: object
 *           properties:
 *             user:
 *               type: string
 *             comment:
 *               type: string
 *       - in: query
 *         name: id
 *         required: true
 *         type: string
 *         description: ID of the review to be updated
 *     responses:
 *       200:
 *         description: Review updated successfully
 */
router.put('',reviewsController.update); //require header x-access-token and the body of the updated review and the req.query id

/**
 * @swagger
 * /reviews:
 *   delete:
 *     description: Delete a review
 *     tags:
 *       - reviews
 *     parameters:
 *       - in: header
 *         name: x-access-token
 *         required: true
 *         type: string
 *       - in: query
 *         name: id
 *         required: true
 *         type: string
 *         description: ID of the review to be deleted
 *     responses:
 *       200:
 *         description: Review deleted successfully
 */
router.delete('', reviewsController.delete); //require header x-access-token and the req.query id of the review to be deleted

module.exports = router;