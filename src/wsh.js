const argvsplit = require('argv-split')
const userCommands = require('../commands')

const metaCommands = {
    ls: {
        description: 'Lists all commands.',
        help(_, out) {
            out.send(`${this.description}\n\nSYNOPSIS\n\tls`)
        },
        run(_, out) {
            out.send(
                Object.keys(allCommands)
                .sort()
                .map(command => `${command}\t${allCommands[command].description}`)
                .join('\n')
            )
        }
    },
    help: {
        description: 'Displays more information about a command.',
        help(_, out) {
            out.send(`${this.description}\n\nSYNOPSIS\n\tman [command-name]`)
        },
        run(input, out) {
            let command = input.args[1]

            return command == null ? out.send('Missing command-name argument.')
                : allCommands[command] == null ? out.send(`Command '${command}' not found.`)
                : allCommands[command].help(input, out)
        }
    }
}

const allCommands = Object.assign({}, userCommands, metaCommands)

exports.process = async query => {
    let args = []
    try { args = argvsplit(query.trim()) } catch (err) { }
    if (args.length === 0) throw new Error('Badly formed query.')

    let command = allCommands[args[0]]
    if (command == null) throw new Error(`Command '${args[0]}' not found.`)

    return new Promise(resolve => {
        command.run({query, args}, {
            redirect: url => resolve({
                type: 'redirect',
                data: url
            }),
            send: content => resolve({
                type: 'send',
                data: content
            })
        })
    })
}
