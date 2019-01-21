const argvsplit = require('argv-split')
const userCommands = require('../commands')

const metaCommands = {
    ls: {
        description: 'Lists all commands.',
        help(_, out) {
            out.write(`${this.description}\n\nSYNOPSIS\n\tls`)
            out.end()
        },
        run(_, out) {
            let lines = Object.keys(allCommands)
                .sort()
                .map(command => `${command}\t${allCommands[command].description}`)

            for (let line of lines) {
                out.write(line)
                out.write('\n')
            }

            out.end()
        }
    },
    help: {
        description: 'Displays more information about a command.',
        help(_, out) {
            out.write(`${this.description}\n\nSYNOPSIS\n\tman [command-name]`)
            out.end()
        },
        run(input, out) {
            let command = input.args[1]

            command == null ? out.write('Missing command-name argument.')
                : allCommands[command] == null ? out.write(`Command '${command}' not found.`)
                : allCommands[command].help(input, out)

            out.end()
        }
    }
}

const allCommands = Object.assign({}, userCommands, metaCommands)

exports.process = (query, out) => {
    let args = []
    try { args = argvsplit(query.trim()) } catch (err) { }
    if (args.length === 0) throw new Error('Badly formed query.')

    let command = allCommands[args[0]]
    if (command == null) throw new Error(`Command '${args[0]}' not found.`)

    command.run({query, args}, out)
}
