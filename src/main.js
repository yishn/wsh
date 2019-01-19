#!/usr/bin/env node

const express = require('express')
const config = require('../config')
const wsh = require('./wsh')

const app = express()

app.get('/', async (req, res) => {
    let query = req.query.q

    try {
        let result = await wsh.process(query)

        if (result.type === 'redirect') {
            res.redirect(result.data)
        } else if (result.type === 'send') {
            res.type('text/plain').send(`wsh $ ${query}\n\n${result.data}`)
        }
    } catch (err) {
        console.log(err.stack)
        res.type('text/plain').send(`wsh $ ${query}\n\n${err}`)
    }
})

app.listen(config.port, () => {
    console.log(`wsh listening on port ${config.port}.`)
})
