#!/usr/bin/env node

const fs = require('fs')
const http = require('http')
const path = require('path')
const argvsplit = require('argv-split')
const express = require('express')
const uuid = require('uuid/v4')
const WebSocket = require('ws')

const config = require('../config')
const wsh = require('./wsh')

let app = express()
let server = http.createServer(app).listen(config.port, () => {
    console.log(`wsh listening on port ${config.port}.`)
})

let wss = new WebSocket.Server({server})
let outputTemplate = fs.readFileSync(path.join(__dirname, 'ui', 'index.html'), 'utf8')

wsh.loadCommands()

app.get('/', async (req, res) => {
    let query = req.query.q || ''
    let socketId = uuid()

    let socketPromise = new Promise((resolve, reject) => {
        setTimeout(() => {
            wss.removeListener('connection', connectionListener)
            reject()
        }, 10000)

        let connectionListener = socket => {
            socket.once('message', data => {
                if (data.toString() === socketId) {
                    resolve(socket)
                }
            })
        }

        wss.once('connection', connectionListener)
    }).catch(() => null)

    try {
        let firstOut = true

        wsh.process(query, {
            redirect: url => {
                if (firstOut) {
                    firstOut = false
                    res.redirect(url)
                }
            },
            write: async data => {
                if (firstOut) {
                    firstOut = false
                    let args = argvsplit(query)

                    res.send(outputTemplate.replace('`{{state}}`', JSON.stringify({
                        socketId,
                        query,
                        args,
                        command: ''
                    })))
                }

                let socket = await socketPromise
                if (socket && socket.readyState === WebSocket.OPEN) socket.send(data)
            },
            end: () => {}
        })
    } catch (err) {
        console.log(err.stack)

        res.send(outputTemplate.replace('`{{state}}`', JSON.stringify({
            output: err.toString()
        })))
    }
})
