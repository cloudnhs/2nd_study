const express = require('express');
const bodyParser = require('body-parser');
const logger = require('morgan');
const mongoose = require('mongoose');

const app = express();

const orderRouter = require('./api/routes/orders');
const productRouter = require('./api/routes/products');
const userRouter = require('./api/routes/users');

// dB 연결
const dbAddress = "mongodb+srv://test:UVgYhxt5L4qU5jMB@cluster0-2ksti.mongodb.net/test?retryWrites=true&w=majority"

mongoose
    .connect(dbAddress, { useNewUrlParser: true, useUnifiedTopology: true})
    .then(() => console.log("MONGODB connected..."))
    .catch(err => console.log(err.message));

//미들웨어

app.use(logger("dev"));

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: false}));

app.use('/order', orderRouter);
app.use('/product', productRouter);
app.use('/user',userRouter);

const PORT = 6000;

app.listen(PORT, console.log('server start'));