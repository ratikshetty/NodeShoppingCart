const { shoppingCartdb } = require('./shoppingCartDBConnect');
const jwt = require('jsonwebtoken');
const verify = require('./jwt')


function getProducts(req, res) {

    let sqlQuery = `select * from product
                    where isDeleted = 0
                    and isSold = 0`

    shoppingCartdb.all(sqlQuery, (err, rows) => {

        if (err) {
            return res.status(500).send(err)
        }
        else {
            return res.status(200).send(rows)
        }
    })
}


function addProduct(req, res) {

    jwt.verify(req.token, 'ratikssh', (err, authData) => {

        if (err) {
            return res.sendStatus(403);
        }
        else {

            if (!req.body.productName) return res.status(400).send("Product Name Missing!!!");
            if (!req.body.productTypeId) return res.status(400).send("Product Type Missing!!!");

            let sqlQuery = `select * from productType where typeId=?`


            shoppingCartdb.all(sqlQuery, [req.body.productTypeId], (err, rows) => {
                if (err) {
                    return res.status(400).send(err)
                }
                else {

                    if (rows.length < 1) {

                        return res.status(400).send('Product Type doesn\'t esist');
                    }
                    else {

                        sqlQuery = `Insert into product
                            (productName,
                                productDesc,
                                productTypeId,
                                userIdOfProductAddeBy,
                                createdDate,
                                modifiedDate)
                            
                            values(?,?,?,?,?,?)`


                        shoppingCartdb.run(sqlQuery, [req.body.productName,
                        req.body.productDesc || "",
                        req.body.productTypeId,
                        authData.user.userId,
                        new Date().toString(),
                        new Date().toString()],
                            (err) => {

                                if (err) {
                                    return res.status(400).send(err);
                                }
                                else {
                                    return res.sendStatus(201);
                                }


                            });
                    }

                }
            })
        }
    })
}

function updateProduct(req, res) {

    jwt.verify(req.token, 'ratikssh', (err, authData) => {

        if (err) {
            return res.status(403).send(err);
        }
        else {

            if (!req.params.productId) return res.status(400).send("product Id is missing")
            if (!req.body.productName) return res.status(400).send("Product Name Missing!!!");
            if (!req.body.productTypeId) return res.status(400).send("Product Type Missing!!!");

            let sqlQuery = `select * from productType where typeId=?`


            shoppingCartdb.all(sqlQuery, [req.body.productTypeId], (err, rows) => {
                if (err) {
                    return res.status(400).send(err)
                }
                else {

                    if (rows.length < 1) {

                        return res.status(400).send('Product Type doesn\'t esist');
                    }
                    else {

                        sqlQuery = `update product
                            set productName = ?,
                                productDesc = ?,
                                productTypeId = ?,
                                modifiedDate= ?
                                where productId = ?`

                        shoppingCartdb.run(sqlQuery, [req.body.productName,
                        req.body.productDesc || "",
                        req.body.productTypeId,
                        new Date().toString(),
                        req.params.productId],
                            (err) => {

                                if (err) {
                                    return res.status(400).send(err);
                                }
                                else {
                                    return res.sendStatus(200);
                                }
                            });
                    }

                }
            })
        }
    })
}

function deleteProduct(req, res) {

    jwt.verify(req.token, 'ratikssh', (err, authData) => {

        if (err) {
            res.status(403).send(err);
        }
        else {

            let sqlQuery = `update product
                            set isDeleted = 1
                            where productId = ?`

            shoppingCartdb.run(sqlQuery, [req.params.productId], (err) => {
                if (err) {
                    return res.status(400).send(err)
                }
                else {

                    return res.status(200).send('Product Deleted!!!')
                }
            })
        }
    })
}



module.exports = { getProducts, addProduct, updateProduct, deleteProduct }