const {shoppingCartdb} = require('./shoppingCartDBConnect')
const jwt = require('jsonwebtoken');

function getUser(req, res){

    let username = req.headers.username;
    let password = req.headers.password;

    let dbPassword = null;

    // console.log(username)

    let sqlQuery = `select * from user
                    where username = ? and
                    isDeleted = 0`;

    shoppingCartdb.all(sqlQuery, [username], (err, rows) =>{
        if(err){
            res.send(err).status(404);
        }
        else{
            user = rows[0];

            if(user && user.password === password){
                jwt.sign({user}, 'ratikssh', (err, token) => {
                    if(err){
                        return res.send(err);
                    }
                    else{
                        return res.status(200).json({token});
                    }
                })
            }
            else{
                return res.status(401).send('Invalid Credentials');
            }
        }
    })
}

function createUser(req, res){
    if(!req.body.username) return res.sendStatus(400).send('username field missing!!!');
    if(!req.body.password) return res.sendStatus(400).send('password field is missing!!!');
    if(!req.body.email) return res.sendStatus(400).send('email id is missing!!!')

    let sqlQuery = `insert into user (email, username, password, createdDate, modifiedDate)
                    values(?, ?, ?, ?, ?)`;

    
    shoppingCartdb.run(sqlQuery, [req.body.email, req.body.username, req.body.password, new Date().toString(), new Date().toString()], err => {

        if(err){
            return res.status(400).send(err);
        }
        else{
            return res.sendStatus(201);
        } 
    } )
}

function updateUser(req, res){

    jwt.verify(req.token, 'ratikssh', (err, authData) => {
        if(err){
            return res.sendStatus(403);
        }
        else{

            if(!req.body.password) return res.status(400).send('New password missing!!');

            let sqlQuery = `update user 
                            set password = ?,
                            modifiedDate = ?
                            where username = ?`

            shoppingCartdb.run(sqlQuery, [req.body.password, new Date().toString(), authData.user.username], (err) => {
                if(err){
                    return res.status(400).send(err)
                }
                else{
                   
                    return res.status(200).send('password updated!!!')

                }
            })
        }
    })
}

function deleteUser(req, res){
    jwt.verify(req.token, 'ratikssh', (err, authData) => {
        if(err){
            return res.sendStatus(403);
        }
        else{

            let sqlQuery = `update user
                            set isDeleted = 1
                            where username = ?;`

            shoppingCartdb.run(sqlQuery, [authData.user.username], err => {
                if(err){
                    return res.status(400).send(err)
                }
                else{
                    return res.status(200).send('User Deleted!!!')
                }
            })
                
        }
    })
}

module.exports = {getUser, createUser, updateUser, deleteUser}