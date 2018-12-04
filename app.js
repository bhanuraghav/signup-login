const express = require('express');
const port = process.env.PORT || 3000;
const bodyParser=require("body-parser"),
	  mongoose= require("mongoose"),
	  passport = require("passport"),
      LocalStrategy = require("passport-local"),
	  methodOverride = require("method-override"),
      flash = require("connect-flash");

const app = express();
const User= require('./models/user');

mongoose.connect("mongodb://bhanu:bhanu1234@ds119688.mlab.com:19688/login-signup", { useNewUrlParser: true });  
app.use(bodyParser.urlencoded({extended : true}));
app.set("view engine","ejs");

app.use(express.static(__dirname + "/public"));
app.use(methodOverride("_method"));
app.use(flash()); 
//Routes
const authRoutes = require('./routes/authenticate')


//Passport Config
app.use(require("express-session")({
	secret:"Hello secret",
	resave: false,
	saveUninitialized: false
}));

app.use(passport.initialize());
app.use(passport.session());
passport.use(new LocalStrategy(User.authenticate()));
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

app.use(function(req,res,next){
	res.locals.currentUser = req.user;
	res.locals.success = req.flash("success");
	res.locals.error = req.flash("error");
	next();
});
app.use("/",authRoutes);


app.listen(port,function(){
    console.log('Server Started on 3000');
})