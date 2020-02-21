const express = require('express');
const nunjucks = require('nunjucks')
const donors = require('./data')

const server = express()



server.use(express.static('public'))//configurar o servidor para apresentar arquivos extras


server.use(express.urlencoded({extended: true}))//habilitar o corpo do formulario body


//template engine
server.set('view engine', 'njk') //configurando a templare engine
nunjucks.configure('views',{
    express:server,
    autoescape: false, // - pegando formatação html 
    noCache: true // - tirando o cache

})


server.get('/', function (req, res) {//rotas configuração de apresentação da páginas

    return res.render('index',{items:donors})
})

server.post('/', function(req, res){ // -> pegando dados via post do formulario
    const name = req.body.name
    const email = req.body.email
    const blood = req.body.blood

    donors.push({ // colocando valor dentro array
        name:name,
        blood:blood
    })

    return res.redirect('/')
})


//servidor e porta
server.listen('3000', function () {
    console.log('server is running')
})