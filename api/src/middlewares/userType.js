const model = require('./../models/user');
const jwt = require('jsonwebtoken');

module.exports = (userType) => {
    // console.log(userType);

    return (req, res, next) => {
        //const username = 
        const token =
        req.body.token || req.headers['x-access-token'];
    
        if (!token) {
            return res.status(403).send("A token is required for authentication");
        }

        try {
            const decoded = jwt.verify(token, process.env.KEY);
            res.userType = decoded.userType;
            // console.log("Dentro:", userType)

            if(userType == decoded.userType){
                // console.log("Sí son iguales");
                next();
            }else{
                return res.status(401).send("Invalid token. UnAuthorized");
            }
    
        }catch (err) {
            return res.status(401).send("Invalid Token");
        }
    };
};
