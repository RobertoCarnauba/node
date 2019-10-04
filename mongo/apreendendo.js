const moogoose = require("mongoose")

//Configuração do mongooose
moogoose.Promise =  global.Promise;
moogoose.connect("mongodb://localhost/apreendendo", {
    useNewUrlParser: true 
}).then(()=>{
    console.log("MongoDB conectado");
}).catch(()=>{
    console.log("Erro na conexao: "+err)
})

//Definindo o model
const UsusarioSchema = moogoose.Schema({

  nome: {
      type: String,
      require: true
  },
  sobreNome: {
      type: String,
      require: false
  },
  email: {
      type: String,
      require: true
  },
  idade: {
      type: Number,
      require: true
  },
  pais: {
      type: String
  }
})

//Defininod a collection(tabela)
moogoose.model('usuarios', UsusarioSchema )

const userNew = moogoose.model('usuarios')
new userNew({
    nome:"Marcela",
    sobreNome:" Dias",
    email:"Marcelaluiz@hotmail.com",
    idade: 2,
    pais:"America"
}).save().then(()=>{
    console.log('User cadastrado com sucesso')
}).catch(()=>{
    console.log('Same erro is happing: '+ err)
})
