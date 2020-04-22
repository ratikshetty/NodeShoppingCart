const { shoppingCartdb } = require('./shoppingCartDBConnect');

function getTypes(req, res) {

    let sqlQuery = `select * from productType`

    shoppingCartdb.all(sqlQuery, (err, rows) => {

        if (err) {
            return res.status(500).send(err)
        }
        else {
            return res.status(200).send(rows)
        }
    })
}

module.exports={getTypes}