const express = require('express');
const app = express();
const session = require('express-session');
const bodyParser = require('body-parser');

const loginRouter  = require('./routes/login');
const logoutRouter = require('./routes/logout');
const indexRouter  = require('./routes/index');
const regRouter    = require('./routes/register');
const adminRouter  = require('./routes/admin');
const dialogRouter = require('./routes/dialog');

app.locals.site = {
		title: 			 '高校问卷调查管理系统',
		description: '想了一下午也没想出来啥宣传标语来。',
};

app.set('view engine', 'ejs');
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.use(express.static('public'));
app.use(session({
	secret: 'secret',
	resave: true,
	saveUninitialized: true
}));

// make a user object avalable on all templates.
app.use((req, res, next) => {
  res.locals.user		  = req.session.user;
	res.locals.loggedin = req.session.loggedin;
  next();
});

app.use('/', indexRouter);
app.use('/login', loginRouter);
app.use('/logout', logoutRouter);
app.use('/register', regRouter);
app.use('/admin', adminRouter);
app.use('/dialog', dialogRouter);

app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).render('error', { errorCode: 500 });
});

const port = 3000;

// Function to listen on the port
app.listen(port, () => console.log(`This app is listening on port ${port}`));

module.exports = app;
