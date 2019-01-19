#!/usr/bin/env node

const express = require('express')
const app = express()
const port = 3000

app.get('/', (req, res) => {
    let query = req.query.q

    if (query == null || query.trim() === '') {
        res.sendStatus(400)
        return
    }

    res.send(query)
})

app.listen(port, () => {
    console.log(`wsh listening on port ${port}.`)
})
