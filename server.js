const express = require('express');
const nunjucks = require('nunjucks')
// const donors = require('./data')

const server = express()


//configurar o servidor para apresentar arquivos extras
server.use(express.static('public'))

//habilitar o corpo do formulario body
server.use(express.urlencoded({ extended: true }))

// configurar a conexão 
const Pool = require('pg').Pool
const db = new Pool({
    user: 'postgres',
    password: '0000',
    host: 'localhost',
    port: 5432,
    database: 'doe',
})

//configurando a templare engine
//template engine
server.set('view engine', 'njk')
nunjucks.configure('views', {
    express: server,
    autoescape: false, // - pegando formatação html 
    noCache: true // - tirando o cache

})

//rotas configuração de apresentação da páginas
server.get('/', function (req, res) {
    db.query("SELECT * FROM donors" , function(err, result){
        if (err) {
            return res.send('Erro de bando de dados')
        }
        const donors = result.rows 
        return res.render('index', { items: donors })
    })
   
})

// -> pegando dados via post do formulario
server.post('/', function (req, res) {
    const name = req.body.name
    const email = req.body.email
    const blood = req.body.blood

    if (name == "" || email == "" || blood == "") {
        return res.send("Todos os campos são obrigatórios.")
    }

    //colocar valores dentro do banco de dados
    const query = (`INSERT INTO "donors" ("name","email","blood") VALUES ($1 ,$2 ,$3)`)
    const values = [name, email, blood]
    db.query(query, values, function (err) {
        if (err) return res.send("erro no banco de dados")
        
        return res.redirect('/')

    })

})


//servidor e porta
server.listen('3000', function () {
    console.log('server is running')
})