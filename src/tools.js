exports.argsSplit = query => {
    return query.match(/("[^"]+"|'[^']+'|\S+)/g)
}

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
