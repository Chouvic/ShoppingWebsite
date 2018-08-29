"use strict"
var sql = require("sqlite3");
var db = new sql.Database("web.db");

db.serialize(create);

function create() {
  db.run("drop table if exists user");
  db.run("create table user (username PRIMARY KEY NOT NULL, password CHAR(16) NOT NULL, name CHAR(16), birthday , address, phone)");
  db.run("insert into user values('jz17501', '17501', 'Jun Zhou', '1991-06-06', 'Flat 307 Chantry Court Bristol', 8887912797)");
  db.run("insert into user values('wei', '001', 'Wei Sen', '1990-09-09', 'Flat 508 Chantry Court Bristol', 7077912797)");
  db.run("insert into user values('wl17865', '17865', 'Wei Sen', '1990-09-09', 'Flat 508 Court Oxford', 7777912797)");

  db.run("drop table if exists product");
  db.run("create table product (id PRIMARY KEY NOT NULL, title, brand, price, memory, storage, processor, screen_size, graphics, image)");
  db.run("insert into product values('0', 'MacBook Pro', 'Apple', 1699.99,'4GB DDR3 RAM','256GB', 'Intel Core i5', '13.3 inches', 'Intel HD Graphics 4000', 'images/products/macpro01.png')");
  db.run("insert into product values('1', 'HP Pavilion Full HD', 'HP', 1500,'8GB DDR3 RAM','1TB', 'Intel Core i7', '23.8 inches', 'Intel HD Graphics 530', 'images/products/hp01.png')");
  db.run("insert into product values('2', 'Lenovo ThinkPad T480 Laptop', 'Lenovo', 1308,'8GB DDR3 RAM','256GB', 'Intel Core i5', '14.0 inches', 'Intel HD Graphics 400', 'images/products/lenovo01.png')");
  db.run("insert into product values('3', 'Google Pixelbook', 'Google', 1549.99,'16GB RAM','512GB', 'Intel Core i7', '12.3 inches', 'Intel HD Graphics 615', 'images/products/google01.png')");
  db.run("insert into product values('4', 'Dell Inspiron 5000 ', 'Dell', 749.99,'8GB DDR4 RAM','1TB HDD + 256GB SSD', 'Intel i5-8250U', '15.6 inches', 'integrated_graphics', 'images/products/dell01.png')");
  db.run("insert into product values('5', 'ASUS Chromebook Flip', 'ASUS', 599.99,'4GB DDR3 RAM','64GB Flash Storage', 'Intel Core m5', '12.5 inches', 'Intel HD Graphics', 'images/products/asus01.png')");
  db.run("insert into product values('6', 'ROG STRIX GL502VT', 'ASUS', 700.50,'8GB DDR4 RAM','1TB Flash Storage', 'Intel Core i7', '15.6 inches', 'GTX970M 3G GDDR5 VRAM', 'images/products/asus02.png')");
  db.run("insert into product values('7', 'Swift 5', 'ACER', 450.99,'8GB LPDDR3 RAM','512GB SSD', 'Intel Core i7', '14 inches', 'UHD Graphics 620', 'images/products/acer01.png')");
  db.run("insert into product values('8', 'Razer Blade', 'Razer', 800.99,'8GB DDR3 RAM','128GB Flash Storage', 'Intel Core i7', '14 inches', 'GTX 765M', 'images/products/razer01.png')");
  db.run("insert into product values('9', 'ZenBook Flip S', 'ASUS', 399.99,'4GB DDR3 RAM','256GB Flash Storage', 'Intel Core m5', '13.3 inches', 'HD Graphics 620', 'images/products/asus03.png')");

  db.run("drop table if exists basket");
  db.run("create table basket(product_id , user_id, quantity)");

}
