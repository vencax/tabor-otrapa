const Accessor = require('../accessor')
// const Diacritics = require('diacritics')
// const fs = require('fs')
// const path = require('path')
// const C = require('../consts')
const parseHlasovani = require('./hlasovani')
const parseUsneseni = require('./usneseni')

function loadJednaniPage (opts, DB, url) {
  Accessor.loadHtml(opts.site + url)
  .then($ => {
    const name = $.text($('#zahlavi h2'))
    const date = name.match(/\d{2}.\d{2}.\d{4}/)[0]
    const hlasovani = $('#nahore .odkazy li a:contains("Hlasování")')[0].attribs.href
    const usneseni = $('#nahore .odkazy li a:contains("Usnesení")')[0].attribs.href
    return DB.saveJednaniZM({
      name, link: url, date, usneseni, hlasovani
    })
  })
  .then(jednani => {
    let items = null
    return Accessor.loadPDF(opts.site + jednani.hlasovani)
    .then(parts => {
      items = parseHlasovani(parts, jednani)
      return Accessor.loadPDF(opts.site + jednani.usneseni)
    })
    .then(doc => {
      const usn = parseUsneseni(doc, jednani, items)
    })
  })
  .catch(err => {
    console.log(err)
  })
}
exports.loadJednaniPage = loadJednaniPage


// module.exports = (opts) => {
//   function _strankaSchuzeRady (url, datum, nazev) {
//     return Accessor.loadHtml(url, function(err, $) {
//       var slozka
//       if (err) {
//         return console.log(err)
//       }
//       slozka = path.join(opts.folder, 'zm', datum)
//       return fs.stat(slozka, function(err, stats) {
//         var error
//         if (err && err.errno === 34) {
//           console.log(nazev)
//           try {
//             fs.mkdirSync(slozka)
//           } catch (_error) {
//             error = _error
//             console.log(error)
//           }
//           $('#nahore a').map(function(i, link) {
//             var fileName
//             fileName = Diacritics.remove($.text($(link)))
//             return Accessor.saveFile(opts.site + link.attribs.href, slozka, fileName)
//           })
//           return $('#dole a').map(function(i, link) {
//             return Accessor.saveFile(opts.site + link.attribs.href, slozka)
//           })
//         }
//       })
//     })
//   }
//
//   Accessor.loadHtml(`${opts.site}/dp/id_ktg=54&p1=5252`)
//   .then(($) => {
//     return $('.seznam strong a').map((i, link) => {
//       const nazev = $.text($(link))
//       const datum = Diacritics.remove(nazev).replace(/\s+/g, '').match(/[0-9\.]+$/)[0]
//       return _strankaSchuzeRady(opts.site + link.attribs.href, datum, nazev)
//     })
//   })
//   .catch(err => {
//     console.log(err)
//   })
// }
