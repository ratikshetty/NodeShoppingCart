const express = require('express');
const jwt = require('jsonwebtoken');
const {verify} = require("./jwt")
const {shoppingCartdb} = require('./shoppingCartDBConnect');
const {getUser, createUser, updateUser, deleteUser} = require ('./user')
const {getProducts, addProduct, updateProduct, deleteProduct} = require('./product')
const {addImage, getImage, deleteImage} = require('./productImage')
const {getBids, addBid, deleteBid} = require('./bid')
const {getTypes} = require('./types')

const app = express();

app.use(express.json());

// User APIs --start

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

// User APIs --End


// Product APIs --start

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
// Product APIs --end

// Product Image APIs --start

app.get('/productImage/:productId', (req, res) => {
    getImage(req, res)
})

app.post('/productImage/:productId', verify, (req, res) => {
    addImage(req, res)
})

app.delete('/productImage/:imageId', verify, (req, res) => {
    deleteImage(req, res)
})

// Product Image APIs --end

// Bid APIs --start

app.get('/bid/:productId', (req, res) => {
    getBids(req, res)
})

app.post('/bid/:productId', verify, (req, res) => {
    addBid(req, res)
})

app.delete('/bid/:productId/:bidId', verify, (req, res) => {
    deleteBid(req, res)
})

// Bid APIs --end

// Product Type APIs --start
app.get('/type', (req, res) => {
    getTypes(req, res)
})
// Product Type APIs --end
app.listen(3003);