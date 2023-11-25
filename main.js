require('dotenv').config()
require('./database/db')
const express = require('express')
const mongoose = require('mongoose')
const session = require('express-session')

const app = express()
const PORT =  process.env.PORT || 5000

// Middlewares
app.use(express.urlencoded({extended : false}))
app.use(express.json())

// Static files
app.use(express.static('uploads'))
app.use(express.static('adminImg'))

app.use(session({
    secret: 'My secret key',
    saveUninitialized : true,
    resave : false
})) 

app.use((req,res,next) => {
    res.locals.message = req.session.message
    delete req.session.message
    next()
})

//set template engine
app.set('view engine', 'ejs') 

// Router middleware
app.use("",require('./Routes/routes'))

app.listen(PORT,() => {
    console.log(`server started at port http://localhost:${PORT}`)
})      