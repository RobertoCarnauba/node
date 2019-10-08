const express = require("express")
const router = express.Router()
const mongoose = require('Mongoose')
require("../models/Categoria")
const Categoria = mongoose.model("categorias")
require("../models/Postagem")
const Postagem = mongoose.model("postagens")



router.get("/", (req, res) => {
   // res.send("Pagina Adminstrativa")
   res.render('admin/index')
})

router.get("/post", (req, res) => {
   res.send('Pagina Posts')
})

router.get("/categorias", (req, res) => {
  Categoria.find().sort({date: 'desc'}).then((categorias) => {
     res.render("./admin/categorias", {categorias: categorias})
  }).catch((err)=>{
     req.flash("error_msg", "Houve um erro ao lista as categorias")
     req.redirect("/admin")
  })
})

router.get("/categorias/add", (req, res) => {
   res.render('admin/addcategorias')
})

router.post("/categorias/nova", (req, res) => {

   //validação manual
   var erros = []
   if (!req.body.nome || typeof req.body.nome == undefined || req.body.nome == null) {
      erros.push({ texto: " Nome Invalido " })
   }

   if (!req.body.slug || typeof req.body.slug == undefined || req.body.slug == null) {
      erros.push({ texto: "Slug invalido" })
   }

   if (req.body.nome.length < 2) {
      erros.push({ texto: "Nome muito pequeno" })
   }

   if (erros.length > 0) {
      res.render("admin/addcategorias", { erros: erros })
   } else {
      const novaCategoria = {
         nome: req.body.nome,
         slug: req.body.slug
      }
      new Categoria(novaCategoria).save().then(() => {
         req.flash("success_msg", "Categoria criada com sucesso!")
         res.redirect('/admin/categorias')
      }).catch((err) => {
         req.flash("error", "Houve um erro")
         res.redirect('/admin/categorias')
      })

   }
})
//Lista uma categoria
router.get("/categorias/edit/:id", (req, res) => {
   Categoria.findOne({_id:req.params.id}).then((categoria) => {
    res.render("admin/editcategorias", {categoria: categoria})
   }).catch((err) => {
    req.flash("error_msg", "Esta categoria não existe")
    res.redirect("/admin/categorias")
   })
})
//Edita uma categoria
router.post("/categorias/edit", (req, res) => {
   Categoria.findOne({_id:req.body.id}).then((categoria)=>{
      categoria.nome =  req.body.nome
      categoria.slug =  req.body.slug

      categoria.save().then(()=>{
         req.flash("success_msg", "Categoria editada com sucesso")
         res.redirect("/admin/categorias")
      }).catch((err) =>{
         req.flash("error_msg", "Houve um erro interno ao salvar a edição da categoria")
         res.redirect("/admin/categorias")
      })
   }).catch((err)=>{
      req.flash("error_msg", "Hove um error ao editar a categoria")
      res.redirect("/admin/categorias")
   })
})
//Deleta Categoria
router.post("/categorias/deletar", (req, res) => {
   Categoria.remove({_id: req.body.id}).then(() => {
      req.flash("success_msg", "Categoria removido com sucesso!")
      res.redirect("/admin/categorias")
   }).catch((err) => {
      req.flash("error_msg", "Houve um erro ao deletar a categoria")
      res.redirect("/admin/categorias")
   })
})
//Lista de Post
router.get("/postagens", (req,res) => {
   Postagem.find().populate("categoria").sort({data:"desc"}).then((postagens)=>{
      res.render("admin/postagens", {postagens: postagens})
   }).catch((err) =>{
      req.flash("error_msg", "Houve um erro ao lista as postagens")
      res.redirect("/admin")
   })
})
//Adciona um new post
router.get("/postagens/add", (req, res) => {
   Categoria.find().then((categorias) => {
      res.render("admin/addpostagens", {categorias: categorias})
   }).catch((err) => {
      req.flash("error_msg", "Houve um erro ao carregar o formulário")
      res.redirect("/admin")
   })
})

//New post
router.post("/postagens/nova", (req, res) => {

   var erros = []
   if(req.body.categorias == "0"){
      erros.push({texto: "Categoria inválida, registe uma categoria"})
   }
   if(erros.length > 0){
      res.render("admin/addpostagens", {erros: erros})
   }else{

      const novaPostagem = {
         titulo: req.body.titulo,
         descricao: req.body.descricao,
         conteudo: req.body.conteudo,
         categoria: req.body.categoria,
         slug: req.body.slug
      }

      new Postagem(novaPostagem).save().then(()=>{
         req.flash("success_msg", "Post criado com sucesso!")
         res.redirect("/admin/postagens")
      }).catch((err)=>{
         req.flash("error_msg", "Erro ao salvar o post!")
         res.redirect("/admin/postagens")
      })
   }
})
//Edit posts
router.get("/postagens/edit/:id", (req, res) => {

   Postagem.findOne({_id: req.params.id}).then((postagens) =>{
      Categoria.find().then((categorias)=>{
         res.render("admin/editpostagens",{categorias:categorias, postagens:postagens})
      }).catch((err)=>{
         req.flash("error_msg", "Houve um erro ao lista as categorias")
         res.redirect("/admin/postagens")
      })

   }).catch((err) =>{
      req.flash("error_msg","Houve um erro ao carrgar o formulario de edição")
      res.redirect("/admin/postagens")
   })
})
//Save post edit
router.post("/postagem/edit", (req, res)=>{
   Postagem.findOne({_id: req.body.id}).then((postagens)=>{
      postagens.titulo =  req.body.titulo
      postagens.slug = req.body.slug
      postagens.descricao = req.body.descricao
      postagens.conteudo = req.body.conteudo
      postagens.categoria = req.body.categoria

      postagens.save().then(()=>{
         req.flash("success_msg", "Postagem editada com sucesso")
         res.redirect("/admin/postagens")
      }).catch((err)=>{
         req.flash("error_msg", "Houce um erro ao editar o post")
         res.redirect("/admin/postagens")
      })

   }).catch((err)=>{
      req.flash("error_msg", "Houve um erro ao salvar a edição")
      res.redirect("/admin/postagens")
   })
})

router.get("/postagens/deletar/:id", (req, res)=>{
   Postagem.remove({_id: req.params.id}).then(()=>{
      res.redirect("/admin/postagens")
   }).catch((err)=>{
      red.flash("error_msg", "Houve um erro interno")
      res.redirect("/admin/postagens")
   })
})

module.exports = router