const jwt = require('jsonwebtoken');

// JWT verify function --start
function verify (req, res, next){

    let auth = req.headers.authorization;

    if(!auth){
        return res.sendStatus(401)
    }
    else{

        auth = auth.split(' ');
        let token = auth[1];
        req.token = token;

        next()
    }
}

const encryptionKey = "ratikssh"
// JWT verify function --End

module.exports = {verify, encryptionKey}