
const express = require('express');
const router = require('./src/routes');
const cors = require("cors");
const dotenv = require('dotenv');
const moongose = require('mongoose');
const { default: mongoose } = require('mongoose');
const path = require('path');

//recognize .env file for environment variables
dotenv.config();

//Swagger
const swaggerConfig = require('./swagger');
const swaggerUI = require('swagger-ui-express');
const swaggerJSDoc = require('swagger-jsdoc');

//create app
const app = express();
const socketIo = require('socket.io');

app.use(
    cors({
        methods: ["GET", "POST", "DELETE", "UPDATE", "PUT", "PATCH"]
    })
);

app.use('/assets', express.static(path.join(__dirname, 'uploads')));
const port = process.env.PORT || 3001;

//pull all the routes condensed in the router file
app.use(router);

//create swagger documentation
const swaggerDoc = swaggerJSDoc(swaggerConfig);
app.use('/swagger', swaggerUI.serve, swaggerUI.setup(swaggerDoc));

//database connection and app run
mongoose.connect(process.env.DB, {useNewUrlParser: true}).then(() => {
    console.log('Successfully connected to DB.');
    
}).catch(err => {
    console.log('Failes to connect to MongoDB: ', err);
});

const server = app.listen(port, () =>{
    console.log(`App is running in port ${port}`);
});

//configurando sockets
const io = socketIo(server, {
    cors: {
        origin: '*',
        methods: ['GET', 'POST']
        }
});

io.on('connection', (socket) => {
    //console.log('alguien se conecto');
    socket.on('userAttendEvent', (data) => {
        //aqui se guardaria en la base de datos
        //console.log('Llego una notificacion', data);
        socket.broadcast.emit('notifUser', data);
    });

    socket.on('userCommentEvent', (data) => {
        //aqui se guardaria en la base de datos
        //console.log('Llego una notificacion', data);
        socket.broadcast.emit('notifComment', data);
    });
});

