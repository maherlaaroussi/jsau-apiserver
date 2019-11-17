'use strict'
let express = require('express')
const morgan = require('morgan')
let bodyParser = require('body-parser')
let fs = require('fs')
const fsPromises = fs.promises
let app = express()

app.use(bodyParser.json())
app.use(morgan('dev'))
app.listen(2828)

app.get('/news/:id', (request, response) => {
    let name = 'data/' + request.params.id + '.json'
    fs.readFile(name, 'utf8', (err, data) => {
        if (err) {
            response.status(404).end()
        } else {
            response.status(200).json(JSON.parse(data))
        }
    })
})

app.get('/news', (request, response) => {
    let dir_path = 'data/'
    const readF = (filenames) => {
        return Promise.all(
            filenames.map((f) => fsPromises.readFile(dir_path + f, 'utf8').then((res) => {
                res = JSON.parse(res)
                res.id = f.split('.')[0]
                return res
            }))
        )
    }
    fs.readdir(dir_path, (err, files) => {
        if (err) {
            response.status(404).end()
        }
        readF(files)
            .then((res) => {
                response.status(200).json(res)
            })
    })
})

app.post('/news(/:id)?', (request, response) => {
    fsPromises.readdir('data/', (err, files) => {
    }).then((res) => {
        let data = JSON.stringify(request.body)
        let name = (request.params.id) ? request.params.id : (res[res.length - 1]) ? (parseInt(res[res.length - 1].split('.')[0]) + 1) : 1
        name = 'data/' + name + '.json'
        fs.writeFile(name, data, (err) => {
            if (err) {
                response.status(409)
            } else {
                response.status(201)
            }
        })
        response.send()
    })
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
