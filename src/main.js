#!/usr/bin/env node

const fs = require('fs')
const http = require('http')
const path = require('path')
const express = require('express')
const uuid = require('uuid/v4')
const WebSocket = require('ws')

const config = require('../config')
const {argsSplit} = require('./tools')
const wsh = require('./wsh')

let app = express()
let server = http.createServer(app).listen(config.port, () => {
    console.log(`wsh listening on port ${config.port}.`)
})

let wss = new WebSocket.Server({server})
let outputTemplate = fs.readFileSync(path.join(__dirname, 'ui', 'index.html'), 'utf8')

wsh.loadCommands()

function renderTemplate(template, state) {
    return template.replace('`{{state}}`', JSON.stringify(state))
}

app.get('/', async (req, res) => {
    let query = req.query.q || ''
    let socketId = uuid()

    try {
        let socketPromise
        let firstWrite = true
        let output = ''

        wsh.process(query, {
            redirect(url) {
                if (firstWrite) res.redirect(url)
            },
            write(data) {
                if (firstWrite && config.websockets) {
                    socketPromise = new Promise((resolve, reject) => {
                        setTimeout(() => {
                            wss.removeListener('connection', connectionListener)
                            reject()
                        }, 10000)

                        let args = argsSplit(query)

                        res.send(renderTemplate(outputTemplate, {
                            socketId,
                            query,
                            args
                        }))

                        let connectionListener = socket => {
                            socket.once('message', data => {
                                if (data.toString() === socketId) {
                                    resolve(socket)
                                }
                            })
                        }

                        wss.once('connection', connectionListener)
                    }).catch(() => null)
                }

                firstWrite = false

                if (!config.websockets) {
                    output += data
                } else {
                    socketPromise.then(socket => {
                        if (socket && socket.readyState === WebSocket.OPEN) {
                            socket.send(data)
                        }
                    })
                }
            },
            end() {
                if (firstWrite || !config.websockets) {
                    let args = argsSplit(query)

                    res.send(renderTemplate(outputTemplate, {
                        query,
                        args,
                        output
                    }))
                }
            }
        })
    } catch (err) {
        console.log(err.stack)

        res.send(renderTemplate(outputTemplate, {
            output: err.toString()
        }))
    }
})
