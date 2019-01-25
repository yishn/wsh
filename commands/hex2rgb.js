module.exports = {
    description: 'Turns a hex color value into rgb notation.',
    help({args}, out) {
        out.write(`${this.description}\n\nSYNOPSIS\n\t${args[1]} <hex>`)
        out.end()
    },
    run({args}, out) {
        if ((args[1] || '').match(/^#?([0-9a-f]{3}|[0-9a-f]{6}([0-9a-f]{2})?)$/i) == null) {
            out.write('Invalid hex value.')
            out.end()
            return
        }

        let hex = args[1].replace(/#/g, '')
        if (hex.length === 3) hex = [...hex].map(x => [x, x].join('')).join('')

        let rgb = [...Array(hex.length / 2)]
            .map((_, i) => hex.slice(i * 2, (i + 1) * 2))
            .map(hex => parseInt(hex, 16))

        if (rgb.length === 3) out.write(`rgb(${rgb.join(', ')})`)
        else if (rgb.length === 4) out.write(`rgba(${rgb.join(', ')})`)

        out.end()
    }
}
