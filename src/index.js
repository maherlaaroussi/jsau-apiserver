'use strict'
let express = require('express')
const morgan = require('morgan')
let bodyParser = require('body-parser')
let fs = require('fs')
const util = require('util')
const readFile = util.promisify(require('fs').readFile)
let app = express()

app.use(bodyParser.json())
app.use(morgan('dev'))
app.listen(2828)

app.get('/news/:id', (request, response) => {
    let name = 'data/' + request.params.id + '.json'
    fs.readFile(name, (err, data) => {
        if (err) {
            response.status(404)
            response.send()
        } else {
            response.status(200)
            response.send(data)
        }
    })
})

// TODO: Check if can get all news
app.get('/news', (request, response) => {
    let dir_path = 'data/'
    let ns = [];
    fs.readdir(dir_path, function (err, files) {
      if (err) response.status(404)
      files.forEach(function (file) {
        console.log(dir_path + file)
        readFile(dir_path + file, (err2, data) => {
            if (!err) {
              console.log(data)
              ns.push(data)
            }
        }).then(console.log(ns))
      });
  });
  response.send(ns)
})

app.post('/news/:id', (request, response) => {
    let data = JSON.stringify(request.body)
    let name = 'data/' + request.params.id + '.json'
    fs.writeFile(name, data, (err) => {
        if (err) response.status(409)
        else response.status(201)
    })
    response.send()
})

app.put('/news/:id', (request, response) => {
    let name = 'data/' + request.params.id + '.json'
    let updated_data = request.body
    fs.readFile(name, (err, data) => {
        if (err) {
            response.status(409)
        } else {
            let file_data = JSON.parse(data)
            for (let key in updated_data) {
                for (let kkey in file_data) {
                    if (kkey == key) {
                        file_data[key] = updated_data[key]
                    }
                }
            }
            file_data = JSON.stringify(file_data)
            fs.writeFile(name, file_data, (err) => {
                if (err) {
                    response.status(409)
                } else {
                    response.status(200)
                }
            })
        }
    })
    response.send()
})

app.delete('/news/:id', (request, response) => {
    let name = 'data/' + request.params.id + '.json'
    fs.unlink(name, (err) => {
        if (err) {
            response.status(409)
        } else {
            response.status(200)
        }
    })
    response.send()
})
