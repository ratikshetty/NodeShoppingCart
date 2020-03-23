const sqlite3 = require('sqlite3').verbose();


const shoppingCartdb = new sqlite3.Database('../database/shoppingCart.db', sqlite3.OPEN_READWRITE, err => {
    if(err){
        console.error(err.message);
    }
    else{
        console.log('[shoppingCartDBConnect.js] Successfully connected to ShoppingCartDB!!!')
    }
})

module.exports = {shoppingCartdb}