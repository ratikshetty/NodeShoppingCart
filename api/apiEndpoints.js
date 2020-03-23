const express = require('express');
const jwt = require('jsonwebtoken');
const verify = require("./jwt")
const {shoppingCartdb} = require('./shoppingCartDBConnect');
const {getUser, createUser, updateUser, deleteUser} = require ('./user')
const {getProducts, addProduct, updateProduct, deleteProduct} = require('./product')


const app = express();

app.use(express.json());

// User API's --start

app.get('/user', (req, res) => {
    getUser(req, res);
});

app.post('/user', (req, res) => {
    createUser(req, res)
})

app.put('/user', verify, (req, res) => {
    updateUser(req, res)    
})

app.delete('/user', verify, (req, res) => {
    deleteUser(req, res)
})

// User API's --End


// Product API's --start

app.get('/products', (req, res) => {
    getProducts(req, res)
})

app.post('/products', verify, (req, res) => {
    addProduct(req, res)
})

app.put('/products/:productId', verify, (req, res) => {

    updateProduct(req, res)
})

app.delete('/products/:productId', verify, (req, res) => {
    deleteProduct(req, res)
})
// Product API's --end


app.listen(3003);