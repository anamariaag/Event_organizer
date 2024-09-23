
const event = require('./../models/event');
const model = require('./../models/event');
const s3 = require('../../aws.config');
const { ListObjectsV2Command } = require('@aws-sdk/client-s3');

module.exports = {
    show: (req, res) => {
        model.find({}).lean().then(response => {
            //console.log('todos');
            res.send(response);
        })
    }, 
    showEventByOrgId: (req, res) => {
        const idOrganizer = req.query.id;
        if(idOrganizer){
            model.find({idOrganizer: idOrganizer}).lean().then(response =>{
                if(response){
                    //console.log('por organizador');
                    res.status(200).send(response);
                } else {
                    res.status(404).send('No se encontraron eventos de esa organización.')
                }
            })
        } else {
            res.status(401).send('Ocurrió un error con el id.')
        }
    },
    showEventByUserId: (req, res) => {
        const idUser = req.query.id;
        if(idUser){
            model.find({idUsers: idUser}).lean().then(response =>{
                if(response){
                    //console.log(response);
                    res.status(200).send(response);
                } else {
                    res.status(404).send('No se encontraron eventos de ese usuario.')
                }
            })
        } else {
            res.status(401).send('Ocurrió un error con el id.')
        }
    },
    create: (req, res) => {
        const newEvent = req.body;

        model.create(newEvent).then(eventCreated => {
            res.send(eventCreated);
        }).catch(err => {
            res.status(500).send(err);
        });
    }, 
    update: (req, res) => {
        const updatedEvent = req.body;
        const id = req.query.id;

        model.findByIdAndUpdate(id, updatedEvent, {new: true}).then(eventUpdated => {
            res.status(200).send(eventUpdated);
        }).catch(err => {
            res.status(500).send(err);
        });
    },
    updateUser: (req, res) => {
        const newUser = req.query.id;
        //console.log(req.body);
        const eventId = req.body._id;

        model.findByIdAndUpdate(eventId,
            {$push: {idUsers: newUser}},
            {new: true},
        ).then(
            eventUpdated => {
                //eventUpdated.idUsers.push(newUser);
                //console.log(eventUpdated);
                res.status(200).send(eventUpdated);
            }
        ).catch( err => {
            //console.log(err);
            res.status(400).send('No se pudo agregar el usuario.');
        });

    },
    updateUserCalendar: (req, res) => {
        const newUser = req.query.id;
        //console.log(req.body);
        const eventId = req.body._id;

        model.findByIdAndUpdate(eventId,
            {$push: {idUsersCalendar: newUser}},
            {new: true},
        ).then(
            eventUpdated => {
                //eventUpdated.idUsers.push(newUser);
                //console.log(eventUpdated);
                res.status(200).send(eventUpdated);
            }
        ).catch( err => {
            //console.log(err);
            res.status(400).send('No se pudo agregar el usuario.');
        });

    },
    deleteUser: (req, res) => {
        const newUser = req.query.id;
        const eventId = req.body._id;
        
        //console.log(eventId);
        model.findOneAndUpdate({_id: eventId},
            {$pull: {idUsers: newUser}},
            {new: true}
        ).then(
            eventUpdated => {
                //console.log(eventUpdated);
                res.status(200).send(eventUpdated);
            }
        ).catch( err => {
            //console.log(err);
            res.status(400).send('No se pudo eliminar el usuario.');
        });
    },
    delete: (req, res) => {
        //console.log('llego');
        const id = req.query.id;
        model.findByIdAndDelete(id).then(deletedEvent => {
            //console.log(deletedEvent);
            res.send(deletedEvent);
        }).catch(err => {
            res.status(400).send(err);
        });
    },
    upload(req, res){
        if(!req.files || req.files.length === 0){
            res.status(400).send({message: "No files uploades"});
        }else{
            res.status(200).send({message: 'Files uploaded successfully', files: req.files });
        }         
    },

    getimages(req, res){
        
        const folderPath = `events/${req.params.id}/`;
        const bucket = 'eventorganizeriteso'
        const command = new ListObjectsV2Command({
            Bucket: bucket,
            Prefix: folderPath
        });

        s3.send(command).then(data => {
            const urls = data.Contents.map((item) => {
                return `https://${bucket}.s3.${process.env.AWS_REGION}.amazonaws.com/${item.Key}`;
            });

            return urls;
        }).then(urls => {
            res.status(200).send(urls);

        }).catch(err => {
            //console.log("Error in listing the s3 objects");
            res.status(500).send({message: 'Error retreiving images', error: err});
        })
    }
}

