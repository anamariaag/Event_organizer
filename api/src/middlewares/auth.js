const model = require('./../models/user');
const jwt = require('jsonwebtoken');

module.exports = (req, res, next) => {
    //const username = 
    const token = req.body.token || req.headers['x-access-token'];

    if (!token) {
        return res.status(403).send("A token is required for authentication");
      }
    try {
        const decoded = jwt.verify(token, process.env.KEY);
        res.userName = decoded.userName;
        res.email = decoded.email;
        res.userType = decoded.userType;

    }catch (err) {
        return res.status(401).send("Invalid Token");
    }
    next();    
}
