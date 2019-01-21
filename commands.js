const {search} = require('./src/tools')

module.exports = {
    g: search('https://google.com/search?q=%s', 'Perform a Google search.'),
    gim: search('https://google.com/search?q=%s&um=1&ie=UTF-8&hl=en&tbm=isch', 'Perform a Google image search.'),
    gm: search('https://google.com/maps/search/%s', 'Perform a Google maps search.'),
    ddg: search('https://duckduckgo.com/?q=%s', 'Perform a DuckDuckGo search.'),
    leo: search('https://dict.leo.org/german-english/%s', "Look up a word in Leo's German/English dictionary."),
    leofr: search('https://dict.leo.org/französisch-deutsch/%s', "Look up a word in Leo's German/French dictionary."),
    cedict: search('https://www.mdbg.net/chinese/dictionary?wdqb=%s', 'Look up a word in CC-CEDICT Chinese/English dictionary.'),
    tw: search('https://twitter.com/%s', 'Show profile on Twitter.'),
    ig: search('https://instagram.com/%s', 'Show profile on Instagram.'),
    yt: search('https://www.youtube.com/results?search_query=%s', 'Search on YouTube.'),
    imdb: search('https://www.imdb.com/find?q=%s', 'Search on IMDB.'),
    ama: search('https://amazon.de/s/?field-keywords=%s', 'Search on Amazon Germany.'),
    gh: search('https://github.com/search?q=%s', 'Search on GitHub.'),
    npm: search('https://npmjs.com/package/%s', 'Go to npm package.'),
    wp: search('https://en.wikipedia.org/?search=%s', 'Search on English Wikipedia.'),
    wpde: search('https://de.wikipedia.org/?search=%s', 'Search on German Wikipedia.'),
    libgen: search('http://libgen.io/foreignfiction/index.php?s=%s&f_group=1', 'Look for a fiction book in Library Genesis.')
}
