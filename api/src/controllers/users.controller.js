const { OAuth2Client } = require('google-auth-library');
const googleClient = new OAuth2Client(process.env.GOOGLE_CLIENT_ID);
const bcrypt = require('bcrypt');
const model = require('./../models/user');
const jwt = require('jsonwebtoken')
const fileModel = require('../models/file');
const fs = require('fs');
const path = require('path');
const {auth2Client} = require('../../googleapis.config');
const {calendar} = require('../../googleapis.config');
const { error } = require('console');
const axios = require('axios');


function getUserInfo(accessToken) {
    const url = `https://www.googleapis.com/oauth2/v3/userinfo?access_token=${accessToken}`;
    return axios.get(url);
}



module.exports = {
    login: (req, res) => {
        //console.log(req.body)
        model.findOne({
            email: req.body.email
        }).lean().then(response => {
            if(response){ 
                if(bcrypt.compareSync(req.body.password, response.password)){
                    //if user is found and password is correct then create token
                    const token = jwt.sign(
                        {
                            id: response._id,
                            userName: response.userName,
                            email: response.email,
                            userType: response.userType
                        },
                        process.env.KEY
                    );
                    res.send({ token: token});
                }else {
                    res.status(400).send("Contraseña incorrecta intentalo de nuevo.");
                }
            }else{
                //console.log(response);
                res.status(400).send("No se ha encontrado ningún usuario registrado.");
            }            
        }).catch(response => {
            res.status(400).send("Algo ocurrió, por favor intenta de nuevo.");
        });
    },

    //todo corregir para que regrese solo un usuario
    show: (req, res) => {
        const email = req.query.email;
        if(email){
            model.find({email: email}).lean().then(response => {
                //console.log(response);
                res.send(response[0]);
            });
        }else {
            res.status(401).send('Ocurrió un error')
        }
    },
    showUsers: (req, res) => {
        model.find({}).lean().then(response => {
            //console.log(response);
            res.send(response);
        });
    },
    create: (req, res) => {
        //console.log(req.body);
        const newUser = req.body.user;
        const password = req.body.user.password ? bcrypt.hashSync(req.body.user.password, 10) : res.status(400).send("No tienes contraseña.");  
        newUser.password = password;
        
        model.findOne({
            email: newUser.email
        }).lean().then(response => {
            if(response){
                //usuario ya existe
                res.status(404).send('Usuario ya existe.')
            }else{
                //usuario no existe entonces lo crea
                model.create(newUser).then(userCreated => {
                    const token = jwt.sign(
                        {
                            id: userCreated._id,
                            userName: userCreated.userName,
                            email: userCreated.email,
                            userType: userCreated.userType
                        },
                        process.env.KEY
                    );
                    res.status(200).send({token: token });
                }).catch(err => {
                    //console.log(err);
                    res.status(400).send("No se pudo crear el usuario.");
                });   
            }
        });
    }, 
    
    update: (req, res) => {
        const updatedUser = req.body;
        if(req.body.password){

            if(req.body.newpassword && req.body.currentpassword){
                console.log('Entre a que trae las 3 contras');
                const password = req.body.password; //esta viene encripatada
                const currentpassword = req.body.currentpassword;
                const newpassword = bcrypt.hashSync(req.body.newpassword, 10);

                if(bcrypt.compareSync(currentpassword, password)){
                    updatedUser.password = newpassword;
                    delete updatedUser.currentpassword;
                    delete updatedUser.newpassword;
                    delete updatedUser._id;
                }else{
                    console.log("Entré a que no coinciden las contras");
                    return res.status(400).json({message: 'Current password is incorrect'});
                }
            }
                     
        }   

        console.log('Aquí no llegué solo cuando las password coincidan o cuando sea edit profile');
        console.log(updatedUser);
        
        const id = req.query.id;
        console.log(id);
        model.findByIdAndUpdate(id, updatedUser, {new: true}).then(userUpdated => {
            res.send(userUpdated);
        }).catch(err => {
            res.status(500).send(err);
        });
    }, 


    delete: (req, res) => {
        const id = req.query.id

        model.findByIdAndDelete(id).then(deletedUser => {
            res.send(deletedUser);
        }).catch(err => {
            res.status(500).send(err);
        });
    },
    
    upload(req, res){
        if(!req.file){
            res.status(400).send({message: "File not supported"});
            return;
        }else{
            const fileDetails = {
                originalName : req.file.originalName,
                bucket : req.file.bucket,
                key: req.file.key,
                location: req.file.location
            }

            const userId = req.params.id;

            model.findByIdAndUpdate(userId, {photo : fileDetails.location}, {new: true}).then(userUpdated => {
                res.send(userUpdated);
            }).catch(err => {
                res.status(500).send(err);
            });
        }


    },

    googleAPI(req, res){

        const scopes = ['https://www.googleapis.com/auth/calendar', 'https://www.googleapis.com/auth/userinfo.email', 'https://www.googleapis.com/auth/userinfo.profile'];

        const url = auth2Client.generateAuthUrl({
            access_type: "offline",
            scope: scopes
        });

        res.redirect(url);
    },

    googleAPIRedirect(req, res) {
        const code = req.query.code;
        let savedTokens = null; 
        
        auth2Client.getToken(code).then(response => {
            savedTokens = response.tokens;
            const tokens = response.tokens;
            auth2Client.setCredentials(tokens);

            return getUserInfo(tokens.access_token);

        }).then((userInfo)=> {
            const userEmail = userInfo.data.email;            

            //Generate own token with jwt
            model.findOne({
                email: userEmail
            }).lean().then(response => {
                if(response){ 
                    //if user is found and password is correct then create token
                    const token = jwt.sign(
                        {
                            id: response._id,
                            userName: response.userName,
                            email: response.email,
                            userType: response.userType
                        },
                        process.env.KEY
                    );

                    res.send({ token: token, idToken: savedTokens, userEmail: userEmail });
                    
                }else{
                    const action = req.query.action
                    console.log('Action: ', action);

                    if(action == 'LOGIN'){
                        res.status(404).send("Usuario no registrado.");
                    }else{
                        const newUser = {
                            userName: userInfo.data.name,
                            name: userInfo.data.given_name,
                            lastName: userInfo.data.family_name,
                            email: userInfo.data.email,
                            userType: 'USER',
                            password: savedTokens.access_token,
                            photo: userInfo.data.picture
                        };
    
                        model.create(newUser).then(userCreated => {
                            const token = jwt.sign(
                                {
                                    id: userCreated._id,
                                    userName: userCreated.userName,
                                    email: userCreated.email,
                                    userType: userCreated.userType
                                },
                                process.env.KEY
                            );                            
                            res.status(200).send({token: token, idToken: savedTokens, userEmail: userEmail });                        
                        }
                        ).catch(err => {
                            res.status(404).send("No se pudo crear el usuario.");
                        });                         
                    };                    
                };       
            }).catch(response => {
                res.status(400).send("No se ha podido iniciar sesion.");
            });           

        }).catch(error => {
            // Handle error
            console.error('Error getting tokens:', error);
            res.status(500).send({error: 'Failed to athenticate' + error});
        });
        
    },

    googleScheduleEvent (req, res){
        const tokens = JSON.parse(req.body.tokens);
        const event = req.body.event;

        auth2Client.setCredentials(tokens);
        
        const [month, day, year, time, amPm] = event.date.split(/, | /);
        const reformattedDateStr = `${month} ${day} ${year} ${time} ${amPm}`;
        
        const dateObjBegin = new Date(reformattedDateStr);
        const dateObjEnd = new Date(reformattedDateStr);
    
        dateObjEnd.setHours(dateObjEnd.getHours() + event.durationHour);
        dateObjEnd.setMinutes(dateObjEnd.getMinutes() + event.durationMinut);

        // res.status(200).send({message: 'smn sí jaló'});    

        calendar.events.insert({
            calendarId: "primary",
            auth: auth2Client,
            requestBody: {
                summary: event.name,
                description: event.description,
                start: {
                    dateTime: dateObjBegin,
                    timeZone: "America/Mexico_City"
                },
                end: {
                    dateTime: dateObjEnd,
                    timeZone: "America/Mexico_City"

                },
                location: event.location
            }
        }).then(() => {
            res.status(200).send({message: "Successfull event setting"});
        }).catch(() => {
            res.status(400).send({message: "There was an error. Try Again"});
        })
       
    }


}