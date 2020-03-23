const { shoppingCartdb } = require('./shoppingCartDBConnect')
const {encryptionKey} = require('./jwt')
const jwt = require('jsonwebtoken')

function getBids(req, res) {

    let sqlQuery = `select * from bid
                    where productId = ?
                    and isDeleted = 0`

    shoppingCartdb.all(sqlQuery, [req.params.productId], (err, rows) => {

        if (err) {
            return res.send(err)
        }
        else {

            return res.status(200).send(rows)
        }
    })
}

function addBid(req, res) {

    jwt.verify(req.token, encryptionKey, (err, authData) => {

        if (err) {
            return res.status(403)
        }
        else {


            let sqlQuery = `select * from product where productId = ? and isDeleted=0`

            shoppingCartdb.all(sqlQuery, [req.params.productId], (err, rows) => {

                if (err) {
                    return res.send(err)
                }
                else {

                    if (rows.length > 0) {

                        if (!req.body.bidAmount) return res.status(400).send("Please Enter Bid Amount!!!")

                        sqlQuery = `insert into bid(
                            productId,
                            bidAmount,
                            bidUserId)
                            
                            values(?,?,?)`

                        shoppingCartdb.run(sqlQuery, [req.params.productId,
                        req.body.bidAmount,
                        authData.user.userId], err => {

                            if (err) {
                                return res.send(err)
                            }
                            else {
                                return res.status(201).send("Bid generated!!!")
                            }
                        })
                    }
                    else{
                        return res.status(400).send('Product doesn\'t exist!!!');
                    }
                }
            })




        }

    })
}

function deleteBid(req, res) {

    jwt.verify(req.token, encryptionKey, (err, authData) => {

        if(err){
            return res.sendStatus(403)
        }
        else{

            let sqlQuery = `update bid
                            set isDeleted = 1
                            where bidId = ?`

            shoppingCartdb.run(sqlQuery, [req.params.bidId], err => {

                if(err){
                    return res.status(400).send(err)
                }
                else{
                    return res.status(200).send("Bid Deleted!!!")
                }
            })
        }
      
    })
}

module.exports = { getBids, addBid, deleteBid }