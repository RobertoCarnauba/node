//Carregando módulos
const express = require('express')
const handlebars = require('express-handlebars')
const bodyParse =  require('body-parser')
//const mongoose = require('mongoose')
const admin = require('./routes/admin')
const app = express()
const path = require('path')

//configurações
//Body parse
app.use(bodyParse.urlencoded({extended: true}))
app.use(bodyParse.json())

//Handlebars
//app.engine('handlebars', handlebars({defaultLayout: 'main'}))
app.engine('handlebars', handlebars({defaultlayout: 'main'}))
app.set('view engine', 'handlebars')
app.set('views', path.join(__dirname, 'views'))

//mongoose

//Public
app.use(express.static(path.join(__dirname,"public")))


//Rotas
app.use('/admin', admin)


//Outros
const PORT = 8081
app.listen(PORT, ()=>{
    console.log('Server run!')
})