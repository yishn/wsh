const {search} = require('./src/tools')

module.exports = {
    g: search('http://www.google.com/search?q=%s')
}
