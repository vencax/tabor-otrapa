
Accessor = require("./accessor")
Diacritics = require('diacritics')
fs = require('fs')
path = require('path')

module.exports = (opts)->

  _strankaSchuzeRady = (url, datum, nazev) ->
    Accessor.loadHtml url, (err, $)->
      return console.log(err) if err

      slozka = path.join(opts.folder, 'zm', datum)
      fs.stat slozka, (err, stats)->
        if err && err.errno == 34
          console.log nazev
          try
            fs.mkdirSync slozka
          catch error
            console.log error

          $('#nahore a').map (i, link) ->
            fileName = Diacritics.remove($.text($(link)))
            Accessor.saveFile(opts.site + link.attribs.href, slozka, fileName)

          $('#dole a').map (i, link) ->
            Accessor.saveFile(opts.site + link.attribs.href, slozka)


  Accessor.loadHtml "#{opts.site}/dp/id_ktg=54&p1=5252", (err, $)->
    return console.log err if err
    $('.seznam strong a').map (i, link) ->
      nazev = $.text($(link))
      datum = Diacritics.remove(nazev).replace(/\s+/g, '').match(/[0-9\.]+$/)[0]
      _strankaSchuzeRady opts.site + link.attribs.href, datum, nazev
