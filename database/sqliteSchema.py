import sqlite3;

con = sqlite3.connect('shoppingCart.db')

cursor = con.cursor()

cursor.execute('PRAGMA foreign_keys = ON;')

# User Table


cursor.execute(""" CREATE TABLE user (
    userId Integer Primary Key Autoincrement,
    email text unique,
    username text unique,
    password text,
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
    FOREIGN KEY (productTypeId) REFERENCES productType(typeId),
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
    isDeleted Integer Default 0,
    Foreign Key (productId) references product(productId)
)
""")

# Bid table

cursor.execute(""" create table bid(
                bidId Integer Primary Key Autoincrement,
                productId Integer,
                bidAmount Integer,
                bidUserId Integer,
                SoldtoThisBid Integer Default 0,
                isDeleted Default 0,
                Foreign Key (productId) references product(productId),
                Foreign Key (bidUserId) references user(userId)
)
""")



cursor.execute("Insert into productType (typeName) values('Gadegts')")
cursor.execute("Insert into productType (typeName) values('Toys')")
cursor.execute("Insert into productType (typeName) values('Cars')")
cursor.execute("Insert into productType (typeName) values('Real Estate')")
cursor.execute("Insert into productType (typeName) values('Clothes')")


con.commit()

con.close()