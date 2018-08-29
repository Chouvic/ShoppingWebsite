"use strict"
var fs = require('fs');
var https = require('https');
var path = require('path');
var privateKey = fs.readFileSync('encry/server.key', 'utf8');
var certificate = fs.readFileSync('encry/server.crt', 'utf8');
var helmet = require('helmet');
var db = require("./database/db_connection");


var credentials = {
  key: privateKey,
  cert: certificate
};
var express = require('express');
var cookieParser = require('cookie-parser');
var app = express();
var OK = 200,
  NotFound = 404,
  BadType = 415;
var session = require("express-session");
var banned = [];
var bodyParser = require("body-parser");
var util = require("util");
var otype = "text/html";
var ntype = "application/xhtml+xml";
var product_id = 0;

var options = {
  setHeaders: deliverXHTML
};


//content negotiation
app.use(function(req, res, next){
  var otype = "text/html";
  var ntype = "application/xhtml+xml";
  if(path.extname(req.url) == ".html"){
    var header = req.headers.accept;
    var accepts  = header.split(",");
    var type = accepts.indexOf(ntype)>= 0 ? ntype: otype;
    res.header("Content-Type", type);
  }
  next();
});

app.set('trust proxy', 1);
// Define the sequence of functions to be called for each request.  Make URLs
// lower case, ban upper case filenames, require authorisation for admin.html,
// and deliver static files from ./public.
app.use(express.static("public", options));
app.use(session({
  secret: "chyingJack",
  name: 'WeisonJack',
  resave: true,
  saveUninitialized: true
}));
app.use(helmet());
app.use(cookieParser('secret'));
app.use(lower);
app.use(ban);
app.use("/admin.html", auth);
app.use(bodyParser.urlencoded({
  extended: true
}));

app.get('/', function(req, res) {
  // Cookies that have not been signed
  console.log('Cookies: ', req.cookies)
  // Cookies that have been signed
  console.log('Signed Cookies: ', req.signedCookies)
})

// app.post("/admin", admin);
app.post("/login", login);
app.post("/sign", sign);
app.post("/test", test);
app.post("/productid", productid);
app.post("/buy", buy);
app.post("/basket", basket);
app.get("/detail", detail);
app.get("/product", product);
app.get('*', function(req, res) {
  res.status(404).sendFile('public/images/404page.jpg', {
    root: __dirname
  });
})

console.log("Visit https://localhost:8080/");
banUpperCase("./public/", "");

// get the product id from the html
function productid(req, res, next) {
  product_id = req.body.idp;
  res.send({
    code: OK
  });
}

// Make the URL lower case.
function lower(req, res, next) {
  req.url = req.url.toLowerCase();
  next();
}

function test(req, res, next) {
  res.redirect("/test.html");
}

// Forbid access to the URLs in the banned list.
function ban(req, res, next) {
  for (var i = 0; i < banned.length; i++) {
    var b = banned[i];
    if (req.url.startsWith(b)) {
      res.status(404).send("Filename not lower case");
      return;
    }
  }
  next();
}

// Redirect the browser to the login page.
function auth(req, res, next) {
  res.redirect("/login.html");
}

// Called by express.static.  Deliver response as XHTML.
function deliverXHTML(res, path, stat) {
  // if (path.endsWith(".html")) {
  //   res.header("Content-Type", "application/xhtml+xml");
  // }
}


// Check a folder for files/subfolders with non-lowercase names.  Add them to
// the banned list so they don't get delivered, making the site case sensitive,
// so that it can be moved from Windows to Linux, for example. Synchronous I/O
// is used because this function is only called during startup.  This avoids
// expensive file system operations during normal execution.  A file with a
// non-lowercase name added while the server is running will get delivered, but
// it will be detected and banned when the server is next restarted.
function banUpperCase(root, folder) {
  var folderBit = 1 << 14;
  var names = fs.readdirSync(root + folder);
  for (var i = 0; i < names.length; i++) {
    var name = names[i];
    var file = folder + "/" + name;
    if (name != name.toLowerCase()) banned.push(file.toLowerCase());
    var mode = fs.statSync(root + file).mode;
    if ((mode & folderBit) == 0) continue;
    banUpperCase(root, file);
  }
}


function login(req, res) {
  var username = req.body.username;
  var password = req.body.password;
  var sql1 = util.format("select * from user where username = '%s' and password = '%s'", username, password);

  db.db_connectionAll(sql1, function(err, row) {
    if (err) {
      res.send({
        code: BadType,
        msg: "This username has been taken, please use another one!"
      });
      return;
    }
    if (row.length <= 0) {
      res.send({
        code: BadType,
        msg: "There is no such username or your password is error, please try again!"
      });
      return;
    }
    req.session.login = true;
    req.session.username = username;
    res.cookie('nick', username);
    res.send({
      code: OK
    });
  });
}

function sign(req, res) {
  var sql1 = util.format("insert into user values('%s', '%s', '%s', '%s', '%s', '%s')", req.body.username, req.body.password, req.body.name, req.body.birthday, req.body.address, req.body.phone);
  db.db_connectionRun(sql1, function(err, row) {
    if (err) {
      console.log("insert error");
      res.send({
        code: BadType,
        msg: "Database insert user is error! "
      });
      return;
    } else {
      res.send({
        code: OK
      });
    }
  })
}


function detail(req, res) {
  var loginSign = req.session.login;
  if (!loginSign) {
    res.send({
      code: NotFound,
      msg: "You haven't logged in yet!"
    });
    return;
  }
  var username = req.session.username;
  var sql1 = "select * from user where username = '" + username + "'";
  db.db_connectionAll(sql1, function(err, row) {
    if (err) {
      res.send({
        code: BadType,
        msg: "The query of Database is ERROR!"
      });
      throw err;
      return;
    }
    if (row.length <= 0) {
      res.send({
        code: BadType,
        msg: "There is no information of this user"
      });
      return;
    }
    var data = row[0];
    res.send({
      code: OK,
      user: data.username,
      name: data.name,
      birt: data.birthday,
      addr: data.address,
      tele: data.phone
    });
  })
}


function product(req, res) {
  var sql1 = util.format("select * from product where id = '%d'", product_id);

  db.db_connection(sql1, function(err, row) {
    if (err) {
      res.send({
        code: BadType,
        msg: "The query of Database is ERROR!"
      });
      throw err;
      return;
    }
    if (row == null) {
      res.send({
        code: BadType,
        msg: "There is no information of this product!"
      });
      return;
    }
    var data = row;
    res.send({
      code: OK,
      id: data.id,
      title: data.title,
      brand: data.brand,
      price: data.price,
      memory: data.memory,
      storage: data.storage,
      processor: data.processor,
      screen_size: data.screen_size,
      graphics: data.graphics,
      image: data.image
    });
  })
}


function buy(req, res) {
  var loginSign = req.session.login;
  if (!loginSign) {
    res.send({
      code: NotFound,
      msg: "You haven't logged in yet! Please login in first."
    });
    return;
  }
  var sql1 = util.format("insert into basket values('%s', '%s', '%d')", req.body.productid, req.session.username, req.body.quantity);
  if (req.body.quantity == 0) {
    res.send({
      code: OK
    });
    return;
  }

  db.db_connectionRun(sql1, function(err, row) {
    if (err) {
      console.log("insert error");
      res.send({
        code: BadType,
        msg: "Database insert basket is error! "
      });
      return;
    } else {
      res.send({
        code: OK
      });
    }
  })
}

function basket(req, res) {
  var loginSign = req.session.login;
  if (!loginSign) {
    res.send({
      code: NotFound,
      msg: "You haven't logged in yet! Please login in first."
    });
    return;
  }
  var sql = util.format("SELECT * FROM (select SUM(quantity) AS sum, product_id AS pid, user_id AS uid from basket where user_id = '%s' group by product_id ) AS a JOIN product p ON a.pid = p.id JOIN user u ON u.username = a.uid", req.session.username);
  db.db_connectionAll(sql, function(err, rows) {
    if (err) {
      res.send({
        code: BadType,
        msg: "The query of Database is ERROR!"
      });
      throw err;
      return;
    }
    if (rows == null) {
      res.send({
        code: BadType,
        size: 0,
        msg: "There is no information of your basket!"
      });
      return;
    }
    var len = rows.length;
    var data = new Array(len);
    var total = new Array(len);
    for (var i = 0; i < rows.length; i++) {
      data[i] = rows[i];
      total[i] = data[i].sum * data[i].price;
    }
    res.send({
      code: OK,
      size: len,
      amount: total,
      row: data,
    });
  })
}

var httpsServer = https.createServer(credentials, app);

httpsServer.listen(8080);
