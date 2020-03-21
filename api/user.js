const express = require('express');
const jwt = require('jsonwebtoken');
const sqlite3 = require("sqlite3").verbose();

const app = express();

app.use(express.json());

// JWT verify function --start

function verify(req, res, next){

    let auth = req.headers.authorization

    // console.log(auth)
    if(!auth){
        return res.sendStatus(401);
    }
    else{
        auth = auth.split(' ');
        let token = auth[1]
        req.token = token

        next()
    }
}

// JWT verify function --End

const shoppingCartdb = new sqlite3.Database('../database/shoppingCart.db', sqlite3.OPEN_READWRITE, err => {
    if(err){
        console.error(err.message);
    }
    else{
        console.log('Successfully connected to ShoppingCartDB!!!')
    }
})

// app.get('/', (req, res) => {
//     res.send('hiii')
// })

// Authenticate user method --start
app.get('/user', (req, res) => {

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
})


// Authenticate user method --end

// Create user --start

app.post('/user', (req, res) => {

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
})

// create user --ends

// update password --starts

app.put('/user', verify, (req, res) => {

    // console.log(req.token)
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
})

// update password --ends

// delete user --start

app.delete('/user', verify, (req, res) => {

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
})

// delete user --ends


app.listen(3001);