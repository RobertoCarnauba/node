//Carregando módulos
const express = require('express')
const handlebars = require('express-handlebars')
const bodyParse = require('body-parser')
const mongoose = require('Mongoose')
const session = require('express-session')
const flash = require('connect-flash')
const admin = require('./routes/admin')
const app = express()
const path = require('path')
require("./models/Postagem")
require("./models/Categoria")
const Postagem = mongoose.model("postagens")
const Categoria = mongoose.model("categorias")
// const passport = require("passport-local")
// require("./config/auth")(passport)

//configurações
app.use(session({
    secret: "cursodenode", //Pode ser qualquer nome aqui
    resave: true,
    saveUninitialized: true
}))
// app.use(passport.initialize())
// app.use(passport.session())
app.use(flash())

//Middleware
app.use((req, res, next) => {
    res.locals.success_msg = req.flash("success_msg")
    res.locals.error_msg = req.flash("error_msg")
    next()
})

//Body parse
app.use(bodyParse.urlencoded({ extended: true }))
app.use(bodyParse.json())

//Handlebars
app.engine('handlebars', handlebars({ defaultLayout: 'main' }))
// app.set('view engine', 'handlebars')
app.set('view engine', 'handlebars')
app.set('views', path.join(__dirname, 'views'))

//mongoose
mongoose.connect("mongodb://localhost/blogapp").then(() => {
    console.log("Conectado ao Mongo pela aplicação")
}).catch((err) => {
    console.log("Erro ao se conectar: " + err)
})

//Public (onde fica todo as pastas e diretorios publicos)
//app.use(express.static(path.join(__dirname,"public")))
app.use(express.static('public'));


//Rotas
app.get('/', (req, res) => {
    Postagem.find().populate("categoria").sort({ data: "desc" }).then((postagens) => {
        res.render("index", { postagens: postagens })
    }).catch((err) => {
        req.flash("error_msg", "Houve um erro interno")
        res.redirect("/404")
    })
})

app.get("/postagem/:slug", (req, res) => {
    Postagem.findOne({ slug: req.params.slug }).then((postagem) => {
        if (postagem) {
            res.render("postagem/index", { postagem: postagem })
        } else {
            req.flash("error_msg", "Esta postagem não existe")
            res.redirect("/")
        }
    }).catch((err) => {
        req.flash("error_msg", "Houve um erro interno")
        res.redirect("/")
    })
})

app.get("/categorias", (req, res) => {
    Categoria.find().then((categorias) => {
        res.render("categorias/index", { categorias: categorias })
    }).catch((err) => {
        req.flash("error_msg", "Houve um erro ao lista a categoria")
        res.redirect("/")
    })
})

app.get("/categorias/:slug", (req, res) => {
    Categoria.findOne({ slug: req.params.slug }).then((categoria) => {
        if (categoria) {
         
            Postagem.find({categoria: categoria._id}).then((postagens)=>{
               res.render("categorias/postagens", {postagens:postagens,categoria:categoria})
            }).catch((err)=>{
               req.flash("error_msg", "Houve um erro ao listar o Post")
               res.redirect("/")
            })

        } else {
            req.flash("error_msg", "Esta categoria não existe")
            res.redirect("/")
        }

    }).catch((err)=>{

    })

})

app.get("/404", (req, res) => {
    res.send('Erro 404!')
})


app.use('/admin', admin)

app.get('/posts', (req, res) => {
    res.send('Rota para os posts: ')
})


//Outros
const PORT = 8081
app.listen(PORT, () => {
    console.log('Server run!')
})