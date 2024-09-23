const {calendar_v3} = require('googleapis');
const google = require('googleapis');
const dotenv = require('dotenv');

dotenv.config()

const calendar = new calendar_v3.Calendar({
    version: "v3",
    auth: process.env.API_KEY 

});

const auth2Client = new google.Auth.OAuth2Client(
    process.env.CLIENT_ID,
    process.env.CLIENT_SECRET,
    process.env.REDIRECT_URL
);

const auth2ClientRegister = new google.Auth.OAuth2Client(
    process.env.CLIENT_ID,
    process.env.CLIENT_SECRET,
    process.env.REDIRECT_URL_REGISTER
);

module.exports = {
    calendar,
    auth2Client,
    auth2ClientRegister
};