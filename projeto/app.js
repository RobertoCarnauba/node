//Carregando módulos
const express = require('express')
const handlebars = require('express-handlebars')
const bodyParse =  require('body-parser')
const mongoose = require('Mongoose')
const session =  require('express-session')
const flash =  require('connect-flash')
const admin = require('./routes/admin')
const app = express()
const path = require('path')

//configurações
app.use(session({
    secret: "cursodenode", //Pode ser qualquer nome aqui
    resave: true,
    saveUninitialized: true
}))
app.use(flash())

//Middleware
app.use((req, res, next) => {
    res.locals.success_msg = req.flash("success_msg")
    res.locals.error_msg = req.flash("error_msg")
    next()
})

//Body parse
app.use(bodyParse.urlencoded({extended: true}))
app.use(bodyParse.json())

//Handlebars
app.engine('handlebars', handlebars({defaultLayout: 'main'}))
app.set('view engine', 'handlebars')
app.set('view engine','handlebars')
app.set('views', path.join(__dirname, 'views'))

//mongoose
mongoose.connect("mongodb://localhost/blogapp").then(()=>{
    console.log("Conectado ao Mongo pela aplicação")
}).catch((err)=>{
    console.log("Erro ao se conectar: "+err)
})

//Public (onde fica todo as pastas e diretorios publicos)
//app.use(express.static(path.join(__dirname,"public")))
app.use(express.static('public'));


//Rotas
app.get('/',(req, res)=>{
    res.send('Rota principal')
  })

app.use('/admin', admin)

app.get('/posts', (req, res)=>{
    res.send('Rota para os posts: ')
})


//Outros
const PORT = 8081
app.listen(PORT, ()=>{
    console.log('Server run!')
})