
const model = require('./../models/review');

module.exports = {
    showByEventId: (req, res) => {
        const idEvent = req.query.id;
        if(idEvent){
            model.find({idEvent: idEvent}).lean().then(response => {
                if(response) {
                    res.status(200).send(response);
                }else{
                    res.status(404).send('No se encontraron reseñas.')
                }
            });
        }
    },
    create: (req, res) => {
        const newReview = req.body;

        model.create(newReview).then(reviewCreated => {
            res.send(reviewCreated);
        }).catch(err => {
            res.status(500).send(err);
        });
    }, 
    update: (req, res) => {
        const updatedReview = req.body;
        const id = req.query.id;

        model.findByIdAndUpdate(id, updatedReview, {new: true}).then(reviewUpdated => {
            res.send(reviewUpdated);
        }).catch(err => {
            res.status(500).send(err);
        });
    }, 
    delete: (req, res) => {
        const id = req.query.id;
        model.findByIdAndDelete(id).then(deletedReview => {
            res.send(deletedReview);
        }).catch(err => {
            res.status(500).send(err);
        });
    }
}