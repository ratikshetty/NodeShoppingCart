const { shoppingCartdb } = require('./shoppingCartDBConnect')
const jwt = require('jsonwebtoken')
const verify = require('./jwt')


function getImage(req, res) {

    let sqlQuery = `select imageId, imageURL, imageDesc from productImage where isDeleted=0;`

    shoppingCartdb.all(sqlQuery, (err, rows) => {

        if (err) {
            return res.status(400).send(err)
        }
        else {

            return res.status(200).send(rows)
        }
    })
}

function addImage(req, res) {

    jwt.verify(req.token, 'ratikssh', (err, authData) => {

        if (err) {
            return res.status(403).send(err)
        }
        else {

            if (!req.body.imageURL) return res.status(400).send("image URL missing!!!")

            let sqlQuery = `select * from product where productId = ? and isDeleted=0`

            shoppingCartdb.all(sqlQuery, [req.params.productId], (err, rows) => {

                if (err) {
                    return res.status(400).send(err)
                }
                else {

                    if (rows.length <= 0) {
                        return res.status(400).send("Product doesn't exist!!!")
                    }
                    else {

                        sqlQuery = `insert into productImage
                                    (productId,
                                    imageURL,
                                    imageDesc)
            
                                    values(?,?,?);`


                        shoppingCartdb.run(sqlQuery, [req.params.productId,
                        req.body.imageURL,
                        req.body.imageDecs || ''], (err) => {
                            if (err) {
                                return res.status(400).send(err)
                            }
                            else {
                                return res.status(200).send("Image added successfully!!!")
                            }
                        })
                    }
                }
            })
        }
    })
}

function deleteImage(req, res) {

    jwt.verify(req.token, 'ratikssh', (err, authData) => {

        if (err) {
            return res.send(403).status(err)
        }
        else {
            let sqlQuery = `update productImage
                    set isDeleted = 1
                    where imageId = ?`

            shoppingCartdb.run(sqlQuery, [req.params.imageId], (err) => {

                if (err) {
                    return res.status(400).send(err)
                }
                else {
                    return res.status(200).send("Image deleted!!!")
                }
            })
        }
    })


}

module.exports = { addImage, getImage, deleteImage }