module.exports = {
    description: 'Turns rgb colors into their hex representation.',
    help({args}, out) {
        out.write(`${this.description}\n\nSYNOPSIS\n\t${args[1]} <r> <g> <b> [a]`)
        out.end()
    },
    run({args}, out) {
        if (args.slice(1).some(x => x.match(/^\d+$/) == null || +x > 255)) {
            out.write('Arguments must be integers not greater than 255.')
            out.end()
        }

        let hex = args.slice(1)
            .map(x => (+x).toString(16))
            .map(x => x.length < 2 ? `0${x}` : x)
            .join('')

        out.write(`#${hex}`)
        out.end()
    }
}
