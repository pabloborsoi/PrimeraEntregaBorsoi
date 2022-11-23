const express = require('express');
const session = require('express-session');
const cookies = require('cookie-parser');
const path = require('path');
const app = express();

const userLoggedMiddleware = require('./middlewares/userLoggedMiddleware');

const methodOverride = require('method-override');
app.use(methodOverride('_method'));


app.use(session({
	secret: "Shhh, It's a secret",
	resave: false,
	saveUninitialized: false,
}));

app.use(cookies());

app.use(userLoggedMiddleware);

app.use(express.urlencoded({ extended: false }));

app.use(express.static('./public'));
app.listen(4000, () => console.log('Servidor levantado en el puerto 4000'));

// Template Engine
app.set('view engine', 'ejs');

// Routers
const userRoutes = require('./routes/userRoutes');
const productRouter = require ('./routes/productRouter');
const apiRouter = require("./routes/apiRouter")

app.use('/', productRouter);
app.use('/product',productRouter);
app.use('/user', userRoutes);
app.use('/api', apiRouter)
