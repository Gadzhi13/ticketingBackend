const express = require('express')
var cors = require('cors')
const { Client } = require('pg')
var bodyParser = require('body-parser')
const app = express()
const insertTicket = 'INSERT INTO tickets(priority, impact, requestType, submitDate, id, title, description, status, link, product, SAID, modificationDate, statusNextStep, solution, solutionDescription, changeID, workflowStatus, changeNote) VALUES($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14, $15, $16, $17, $18) RETURNING *';
const selectAll = 'SELECT * FROM tickets'
const pgOptions = {
    user: 'webuser',
    host: 'localhost',
    database: 'ticketing',
    password: '',
    port: 5432
}

var corsOptions = {
    origin: 'http://localhost:4200'
}

app.use(cors(corsOptions))
app.use(bodyParser.text())
app.use(bodyParser.json())

app.options('/', () => {
    console.log("got an OPTIONS request")
})

app.post('/', function (req, res, next) {
    res.set({'Content-Type': 'text/plain'})
    if (typeof req.body === 'string') {
        console.log(req.body)
        res.end('true')
    } else {
        next()
    }
}, async function (req, res) {
    if (req.body.isTicket == true) {
        var values = parseTicket(req.body)
        const client = new Client(pgOptions)
        await client.connect()
        await client.query(insertTicket, values)
            .then((result) => {
                console.log("res")
                console.log(result.rows[0])
            }).catch(err => {
                console.log("err")
                console.log(err)
            })
        await client.end()
    }
    res.end()
})

 app.get('/', async function (req, res) {
    if (true) {
    const client = new Client(pgOptions)
    await client.connect()
    await client.query(selectAll)
        .then((result) => {
            console.log("res")
            console.log(result.rows)
            res.send(result.rows)
        }).catch(err => {
            console.log("err")
            console.log(err)
        })
    await client.end()
    }
    res.end()
})

app.listen(5433, () => console.log('listening on port 5433'))

function parseTicket(ticket) {
    let values = []
    Object.keys(ticket.data).forEach(key => {
        values.push(ticket.data[key])
    })
    return values;
}