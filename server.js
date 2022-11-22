//Importing the packages
const express = require('express');
const path = require('path');
const bodyparser = require('body-parser');
const session = require('express-session');
const {v4:uuidv4} = require('uuid');
const methodOverride = require('method-override');
const cookieparser = require('cookie-parser');
const flash = require('connect-flash');
const cors = require('cors');
const File = require("./models/invoice");
const multer = require("multer");


//Initialize express app
const app = express();

//mongoose connections
require("./database/conn");

//Route connections
const router = require('./route/routes');

//Port number
const port = process.env.PORT||3000;

//Parse JSON data
app.use(bodyparser.urlencoded({extended:true}));
app.use(express.json());
app.use(cors());
app.use(flash());
//Set cookie parser, session and flash
app.use(cookieparser('SecretStringForCookies'));
// app.use(session({
//     secret:'SecretStringForSession',
//     cookie:{maxAge:60000},
//     resave:true,
//     saveUninitialized:true
// }));

app.use(flash());
app.use(bodyparser.json());

//set view engine - ejs
app.set('view engine','ejs');

app.use('/static',express.static(path.join(__dirname,'public')));
app.use('/assets',express.static(path.join(__dirname,'public/assets')));
app.use(methodOverride("_method", {methods: ["POST", "GET"]}));


app.use(session({
    name:'sessionCookie',
    secret:uuidv4(),
    resave:false,
    saveUninitialized:false
}));

app.use('/route',router)

//GET /Home route
app.get('/',(req,res)=>{
    res.render('login',{title:'Medical Application'});
});

app.listen(port,()=>{
    console.log('Server is running on PORT: http://localhost:3000');
});
