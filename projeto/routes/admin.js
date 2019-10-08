const express = require("express")
const router = express.Router()
const mongoose = require('Mongoose')
require("../models/Categoria")
const Categoria = mongoose.model("categorias")



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

router.get("/categorias/edit/:id", (req, res) => {
   Categoria.findOne({_id:req.params.id}).then((categoria) => {
    res.render("admin/editcategorias", {categoria: categoria})
   }).catch((err) => {
    req.flash("error_msg", "Esta categoria não existe")
    res.redirect("/admin/categorias")
   })
})

router.post("/categorias/edit" , (req, res) => {
   Categoria.findOne({_id: req.params.id}).then((categoria)=>{
      categoria.nome = req.body.nome
      categoria.slug = req.body.slug

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

router.get("/teste", (req, res) => {
   res.get("isso é um teste")
})

module.exports = router