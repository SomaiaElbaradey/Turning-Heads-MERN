require('express-async-errors');
const express = require('express');
const app = express();
const config = require('config');
const error = require('./middlewares/error');

require('./dbConnection');
const userRouter = require('./routes/user');
const cors = require('cors')

if (!config.get('jwtKey')) {
    console.log("FATAL ERROR: jwtKey is not defined.")
    process.exit(1);
}
app.use(express.json());
app.use(express.json({ limit: "50mb" }));

app.use(cors())

app.use(function (req, res, next) {
    res.header("Access-Control-Allow-Origin", "*");
    res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
    res.header("Access-Control-Allow-Methods", "*");
    next();
});

//middleware that logs the request url, method, and current time 
let logs = (req, res, next) => {
    console.log('the request url:', req.url);
    console.log('the request method:', req.method);
    console.log('the current time:', new Date());
    next();
};
app.use(logs);

app.use('/api/user', userRouter);

app.use(error);

app.listen(process.env.PORT || 2919, () => {
    console.info(`server listening on port 2919`);
});