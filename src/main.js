#!/usr/bin/env node

const express = require('express')
const config = require('../config')
const wsh = require('./wsh')

const app = express()
wsh.loadCommands()

app.get('/', async (req, res) => {
    let query = req.query.q || ''

    try {
        let firstOut = true

        wsh.process(query, {
            redirect: url => {
                if (firstOut) {
                    res.redirect(url)
                } else {
                    res.write(`\n\nwsh $ Redirect to ${url}.`)
                }
            },
            write: data => {
                if (firstOut) {
                    res.type('text/plain').write(`wsh $ ${query}\n\n`)
                }

                firstOut = false
                res.write(data)
            },
            end: () => res.end()
        })
    } catch (err) {
        console.log(err.stack)
        res.type('text/plain').send(`wsh $ ${query}\n\n${err}`)
    }
})

app.listen(config.port, () => {
    console.log(`wsh listening on port ${config.port}.`)
})
