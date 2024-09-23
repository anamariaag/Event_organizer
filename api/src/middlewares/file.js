
const multer = require('multer');
const multerS3 = require('multer-s3')
const s3 = require('../../aws.config');

const validExtensions = ['jpg', 'jpeg', 'png'];

const storageS3 = multerS3({
    s3: s3,
    bucket: 'eventorganizeriteso',
    acl: 'public-read', // Remove this line if ACLs are not allowed
    contentType: multerS3.AUTO_CONTENT_TYPE,
    contentDisposition: 'inline',

    metadata: (req, file, cb) => {
        cb(null, { originalname: file.originalname });        
    },
    key: (req, file, cb) => {
        const ext = file.originalname.split('.').pop();
        const name = `users/${req.params.id}/profile_${req.params.id}`;
        cb(null, name);
    }
})

const multipleStorageS3 = multerS3({
    s3: s3, 
    bucket: 'eventorganizeriteso',
    acl: 'public-read',
    contentType: multerS3.AUTO_CONTENT_TYPE,
    contentDisposition: 'inline',
    metadata: (req, file, cb) => {
        cb(null, { originalname: file.originalname });        
    },
    key:(req, file, cb) => {
        const ext = file.originalname.split('.').pop();
        const name = `events/${req.params.id}/${file.originalname}-${new Date().getTime()}.${ext}`;
        cb(null, name);
    }

})

const fileFilter = (req, file, cb) => {
    const ext = file.originalname.split('.').pop();
    const isValid = validExtensions.includes(ext);
    cb(null, isValid);

}

const upload = multer({storage: storageS3, fileFilter});
const uploadMultiple = multer({storage: multipleStorageS3, fileFilter});

module.exports = {
    upload, 
    uploadMultiple
}