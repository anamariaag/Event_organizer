const express = require('express');
const router = express.Router();

const eventController = require('./../controllers/events.controller');
const userController = require('./../controllers/users.controller')
const userType = require('./../middlewares/userType');
const {uploadMultiple} = require('../middlewares/file');

/**
 * @swagger
 * /events:
 *      get:
 *        description: list all events
 *        tags:
 *          - events
 *        parameters: 
 *          - in: header
 *            name: x-access-token
 *            description: Authorization token
 *            required: true
 *            schema: 
 *              type: string
 *        responses:
 *          200: 
 *            description: list all events
 * 
 */
router.get('', eventController.show);

/**
 * @swagger
 * /events/idOrg:
 *      get:
 *        description: list all events
 *        tags:
 *          - events
 *        parameters: 
 *          - in: header
 *            name: x-access-token
 *            description: Authorization token
 *            required: true
 *            schema: 
 *              type: string
 *          - in: query
 *            name: id
 *            description: id of the organization
 *            required: true
 *            schema:   
 *              type: string
 *        responses:
 *          200: 
 *            description: list all events by Org
 * 
 */
router.get('/idOrg', eventController.showEventByOrgId);

/**
 * @swagger
 * /events/idUser:
 *      get:
 *        description: list all events by userId
 *        tags:
 *          - events
 *        parameters: 
 *          - in: header
 *            name: x-access-token
 *            description: Authorization token
 *            required: true
 *            schema: 
 *              type: string
 *          - in: query
 *            name: id
 *            description: id of the user
 *            required: true
 *            schema:   
 *              type: string
 *        responses:
 *          200: 
 *            description: list all events by user
 * 
 */
router.get('/idUser/', eventController.showEventByUserId);

/**
 * @swagger
 * /events:
 *      post:
 *        description: create new events
 *        tags:
 *          - events
 *        parameters:
 *          - in: header
 *            name: x-access-token
 *            description: Authorization token
 *            required: true
 *            schema: 
 *              type: string
 *          - in: body
 *            description: The event to create
 *            schema: 
 *                type: object
 *                properties:
 *                  name:
 *                    type: string
 *                    description: Event name
 *                  description:
 *                    type: string
 *                    description: Event description
 *                  location:
 *                    type: string
 *                    description: Event location
 *                  date:
 *                    type: string
 *                    description: Event date
 *                    format: date
 *                  duration:
 *                    type: string
 *                    description: Event duration
 *                  category:
 *                    type: string
 *                    description: Event category
 *                  programs:
 *                    type: array
 *                    items:
 *                      type: string
 *                    description: Event directed to programs
 *                  relatedLinks:
 *                    type: array 
 *                    items:
 *                      type: string 
 *                    description: Event realted links      
 *        responses:
 *          200: 
 *            description: create new events   
 */
router.post('', userType('ORG'), eventController.create);

/**
 * @swagger
 * /events:
 *      put:
 *        description: update an event
 *        tags:
 *          - events
 *        parameters:
 *          - in: header
 *            name: x-access-token
 *            description: Authorization token
 *            required: true
 *            schema: 
 *              type: string
 *          - in: query
 *            name: id
 *            description: id of the event to update
 *            required: true
 *            schema:
 *              type: string
 *          - in: body
 *            description: The updates to the event 
 *            example:
 *               name: "Default Name"
 *               location: "Default Location"
 *               date: "2023-10-03"
 *               duration: "Default Duration"
 *               category: "Default Category"
 *               programs: ["Default Program"]
 *               relatedLinks: ["Default Link"]
 *               description: "Default Description"
 *            schema:
 *              type: object
 * 
 *        responses:
 *          200: 
 *            description: update and event
 *          404: 
 *            description: event not found
 */
router.put('', userType('ORG'), eventController.update);


/**
 * @swagger
 * /events/users:
 *      put:
 *        description: update the array of users attending an event
 *        tags:
 *          - events
 *        parameters:
 *          - in: header
 *            name: x-access-token
 *            description: Authorization token
 *            required: true
 *            schema: 
 *              type: string
 *          - in: query
 *            name: id
 *            description: id of the user that will be added to the event
 *            required: true
 *            schema:
 *              type: string
 *          - in: body
 *            description: The updates to the event (Can only be the idUsers Array)
 *            example:
 *               name: "Default Name"
 *               location: "Default Location"
 *               date: "2023-10-03"
 *               durationHour: "Default Duration"
 *               durationMinute: "Default Duration"
 *               category: "Default Category"
 *               programs: ["Default Program"]
 *               relatedLinks: ["Default Link"]
 *               description: "Default Description"
 *               idUsers: ["Iduser", "IdUser"]
 *            schema:
 *              type: object
 * 
 *        responses:
 *          200: 
 *            description: update and event
 *          404: 
 *            description: event not found
 */
router.put('/users', eventController.updateUser);



/**
 * @swagger
 * /events/usersCalendar:
 *      put:
 *        description: update the array of users that have added the event to google calendar
 *        tags:
 *          - events
 *        parameters:
 *          - in: header
 *            name: x-access-token
 *            description: Authorization token
 *            required: true
 *            schema: 
 *              type: string
 *          - in: query
 *            name: id
 *            description: id of the user that has added the event to its calendar
 *            required: true
 *            schema:
 *              type: string
 *          - in: body
 *            description: The updates to the event (Can only be the idUsersCalendar Array)
 *            example:
 *               name: "Default Name"
 *               location: "Default Location"
 *               date: "2023-10-03"
 *               durationHour: "Default Duration"
 *               durationMinute: "Default Duration"
 *               category: "Default Category"
 *               programs: ["Default Program"]
 *               relatedLinks: ["Default Link"]
 *               description: "Default Description"
 *               idUsersCalendar: ["idUser", "idUser"] 
 *            schema:
 *              type: object
 * 
 *        responses:
 *          200: 
 *            description: update and event
 *          404: 
 *            description: event not found
 */
router.put('/usersCalendar', eventController.updateUserCalendar);

/**
 * @swagger
 * /events/nousers:
 *      put:
 *        description: update the array pulling out a user no longer going to an event
 *        tags:
 *          - events
 *        parameters:
 *          - in: header
 *            name: x-access-token
 *            description: Authorization token
 *            required: true
 *            schema: 
 *              type: string
 *          - in: query
 *            name: id
 *            description: id of the user that has to be removed from the idUsers array
 *            required: true
 *            schema:
 *              type: string
 *          - in: body
 *            description: The updates to the event (Can only be the idUsers Array)
 *            example:
 *               name: "Default Name"
 *               location: "Default Location"
 *               date: "2023-10-03"
 *               durationHour: "Default Duration"
 *               durationMinute: "Default Duration"
 *               category: "Default Category"
 *               programs: ["Default Program"]
 *               relatedLinks: ["Default Link"]
 *               description: "Default Description"
 *               idUsers: ["idUser", "idUser"] 
 *            schema:
 *              type: object
 * 
 *        responses:
 *          200: 
 *            description: update and event
 *          404: 
 *            description: event not found
 */
router.put('/nousers', eventController.deleteUser);

/**
 * @swagger
 * /events:
 *      delete:
 *        description: list all events
 *        tags:
 *          - events
 *        parameters:
 *          - in: header
 *            name: x-access-token
 *            description: Authorization token
 *            required: true
 *            schema: 
 *              type: string
 *          - in: query
 *            name: id
 *            description: id of the evento to delete
 *            required: true
 *            schema: 
 *              type: string
 *        responses:
 *          200: 
 *            description: list all events
 *          404: 
 *            event not found
 * 
 */
router.delete('', userType('ORG'), eventController.delete);


/**
 * @swagger
 * /events/{id}/upload:
 *   post:
 *     description: Upload multiple files for a specific event
 *     tags:
 *       - events
 *     parameters:
 *       - in: header
 *         name: x-access-token
 *         description: Authorization token
 *         required: true
 *         schema: 
 *           type: string
 *       - in: path
 *         name: id
 *         required: true
 *         description: User ID associated with the event
 *         schema:
 *           type: string
 *     requestBody:
 *       description: Multiple files to be uploaded
 *       required: true
 *       content:
 *         multipart/form-data:
 *           schema:
 *             type: object
 *             properties:
 *               files:
 *                 type: array
 *                 items:
 *                   type: string
 *                   format: binary
 *     responses:
 *       200:
 *         description: Files successfully uploaded
 */
router.post('/:id/upload', uploadMultiple.array('files', 5), eventController.upload)



/**
 * @swagger
 * /events/{id}/images:
 *   get:
 *     description: get files for a specific event
 *     tags:
 *       - events
 *     parameters:
 *       - in: header
 *         name: x-access-token
 *         description: Authorization token
 *         required: true
 *         schema: 
 *           type: string
 *       - in: path
 *         name: id
 *         required: true
 *         description: User ID associated with the event
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Files of the event
 */
router.get('/:id/images', eventController.getimages);

/**
 * @swagger
 * events/scheduleEvent:
 *   post:
 *     description: Schedule an event on Google Calendar
 *     tags:
 *       - events
 *     parameters:
 *       - in: header
 *         name: x-access-token
 *         description: Authorization token
 *         required: true
 *         schema: 
 *           type: string
 *       - in: body
 *         required: true
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 tokens:
 *                   type: object
 *                   properties:
 *                     accessToken:
 *                       type: string
 *                     refreshToken:
 *                       type: string
 *                   required:
 *                     - accessToken
 *                     - refreshToken
 *                 event:
 *                   type: object
 *                   properties:
 *                     summary:
 *                       type: string
 *                     location:
 *                       type: string
 *                     description:
 *                       type: string
 *                     start:
 *                       type: string
 *                       format: date-time
 *                     end:
 *                       type: string
 *                       format: date-time
 *                   required:
 *                     - summary
 *                     - start
 *                     - end
 *     responses:
 *       200:
 *         description: Event successfully scheduled
 *       400:
 *         description: Invalid request
 */
router.post('/scheduleEvent', userController.googleScheduleEvent);


module.exports = router;


