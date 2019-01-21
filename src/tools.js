let {QrCode} = require('javascript-qrcode')

exports.search = (url, description = null) => ({
    description: description || `Redirects to ${url}.`,
    help({args}, out) {
        out.write(`${this.description}\n\nSYNOPSIS\n\t${args[1]} [...query]`)
        out.end()
    },
    run({query, args}, out) {
        let search = query.trim().slice(args[0].length).trim()
        out.redirect(url.replace(/%s/g, encodeURIComponent(search)))
    }
})

exports.qr = () => ({
    description: 'Get a QR code.',
    help({args}, out) {
        out.write(`${this.description}\n\nSYNOPSIS\n\t${args[1]} [...content]`)
        out.end()
    },
    run({query, args}, out) {
        let content = query.trim().slice(args[0].length).trim()
        let mat = new QrCode(content).getData()

        if (mat.length % 2 !== 0) mat.push(mat[0].map(_ => 0))

        for (let y = 0; y < mat.length; y += 2) {
            for (let x = 0; x < mat[y].length; x++) {
                let [a, b] = [mat[y][x], mat[y + 1][x]]

                if (a && !b) out.write('▀')
                else if (!a && b) out.write('▄')
                else if (a && b) out.write('█')
                else if (!a && !b) out.write(' ')
            }

            out.write('\n')
        }

        out.end()
    }
})
