const express = require('express');
const session = require('express-session');
const router = express.Router();
const mysql = require('mysql');

let connection = mysql.createConnection({
	host     : 'localhost',
	user     : 'starrys',
	password : 'testpassword',
    database : 'survey',
});

connection.connect((err) => {
    if (err) throw err;
    console.log(`Database connect successfully.`);
});

router.use((req, res, next) => {
    next();
});

router.get('/', (req, res) => {
	let loggedin = req.session.loggedin;
	res.locals.loggedin = loggedin;
    if (!loggedin) {
        res.locals.pageTitle = "请登录";
        res.render('login');
    }
    else {
        res.locals.pageTitle = "欢迎回来";
        res.redirect('/');
    }
});

router.post('/auth', (req, res) => {
  let name = req.body.username;
  let pwd  = req.body.password;
  let type = req.body.type;

  if (name && pwd) {
		connection.query(
            `select id from admin where name="${name}" and password="${pwd}"`,
            (error, results, fields) => {
            if (error) console.error(error);
			if (results && results.length > 0) {
				req.session.loggedin = true;
				req.session.username = name;
				res.redirect('/');
			} else {
				res.locals.pageTitle = "登录失败";
				res.locals.errorMessage = "用户名或密码错误";
				res.render('login');
			}
			res.end();
		});
	} else {
		res.locals.pageTitle = "登录失败";
		res.locals.errorMessage = "请输入用户名和密码";
		res.render('login');
		res.end();
	}
});

module.exports = router;
