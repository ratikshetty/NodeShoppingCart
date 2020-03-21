import sqlite3;

con = sqlite3.connect('shoppingCart.db')

cursor = con.cursor()

# User Table

cursor.execute(""" CREATE TABLE user (
    userId Integer Primary Key Autoincrement,
    email text unique,
    username text unique,
    password text unique,
    isDeleted Integer Default 0,
    createdDate text,
    modifiedDate text
)
""")

# Product Type Table

cursor.execute(""" Create table productType(
    typeId INTEGER PRIMARY KEY AUTOINCREMENT,
    typeName text Unique
)
""")

# cursor.execute("Insert into productType (typeName) values('tech')")

# Product Table

cursor.execute(""" Create table product(
    productId Integer Primary Key Autoincrement,
    productName text not null,
    productDesc text,
    productTypeId Integer,
    userIdOfProductAddeBy Integer,
    userIdOfProductSoldTo Integer,
    isDeleted Integer Default 0,
    isSold Integer Default 0,
    createdDate text,
    modifiedDate text,
    Foreign Key (productTypeId) references productType(typeId),
    foreign key (userIdOfProductAddeBy) references user(userId),
    Foreign Key (userIdOfProductSoldTo) references user(userId)
)
""")

# Product Image Table

cursor.execute(""" create table productImage(
    imageId Integer Primary Key Autoincrement,
    productId Integer,
    imageURL text,
    imageDesc text,
    Foreign Key (productId) references product(productId)
)
""")


con.commit()

con.close()