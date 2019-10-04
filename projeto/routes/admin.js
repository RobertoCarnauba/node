const express = require("express")
const router = express.Router()

router.get("/", (req, res) => {
    res.send("Pagina Adminstrativa")
})

router.get("/post", (req, res)=>{
   res.send('Pagina Posts')
})

router.get("/categoria", (req, res)=>{
  res.send('Pagina Categoria')
})

router.get("/teste", (req, res)=>{
    res.get("isso é um teste")
})

module.exports = router