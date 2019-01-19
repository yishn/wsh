exports.search = (url, description = null) => ({
    description: description || `Redirects to ${url}.`,
    man({args}, out) {
        out.send(`${this.description}\n\nSYNOPSIS\n\t${args[1]} [...query]`)
    },
    run({query, args}, out) {
        let search = query.trim().slice(args[0].length).trim()
        out.redirect(url.replace(/%s/g, encodeURIComponent(search)))
    }
})
