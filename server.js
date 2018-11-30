var express = require("express");
var path = require("path");
var bodyParser = require('body-parser');
var session = require('express-session');
var app = express();

app.use(session({
  secret: 'keyboardkitteh',
  resave: false,
  saveUninitialized: true,
  cookie: { maxAge: 60000 }
}));

app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, "./static")));
app.set('views', path.join(__dirname, './views'));
app.set('view engine', 'ejs');

app.get('/', function(req, res) {
    console.log("Made it to '/'");
    console.log(req.session)
    if(typeof req.session.number == "undefined"){
        req.session.number = Math.floor(Math.random()* (101 - 1))
        console.log(`NEW GAME: The number for this new game is: ${req.session.number}`)
    } else {
        console.log(`The number I am thinking of is: ${req.session.number}`)
    }
    res.render("index", {session: req.session});
})

app.post('/verify', function(req, res) {
    console.log("Made it to '/verify'");
    console.log("POST DATA", req.body);
    if(req.session.number > req.body.guess){
        req.session.reply = 'low';
        req.session.color = 'danger';
        console.log("guess is too low")
    } else if (req.session.number < req.body.guess){
        req.session.reply = 'high';
        req.session.color = 'danger';
        console.log("guess is too high")
    } else if (req.session.number = req.body.guess){
        req.session.status = "gameover"
        req.session.reply = "correct"
        req.session.color = "success"
        console.log("guess is correct")
    }
    res.redirect('/');
})

app.get('/reset', function(req, res) {
    console.log("Made it to '/reset'")
    console.log("Session data is about to be reset")
    req.session.destroy();
    res.redirect('/');
})

app.listen(8000, function() {
    console.log("listening on port 8000");
});
