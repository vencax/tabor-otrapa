const Diacritics = require('diacritics')

module.exports = (parts, jednani, hlasovani) => {
  let foundHlas = null
  let item = {}
  let acc = []
  let phase = null
  parts.map(p => {
    if (p.match(/Č. usnesení:Č. odboru/)) {
      if (phase !== null) { // flush
        foundHlas.usneseni = acc.join(' ')
        item = {}
      }
      phase = 'loadmeta'
      acc = []
      return
    }
    if (phase === 'loadmeta') {
      item.cislo = p
      phase = 'name'
      return
    }
    if (p === 'Zastupitelstvo města Tábora') {
      const name = acc.join(' ')
      foundHlas = hlasovani.find(i => {
        const iName = Diacritics.remove(i.name).toLowerCase().replace(/\s/g, '')
        const b = Diacritics.remove(name).toLowerCase().replace(/\s/g, '')
        return iName.indexOf(b) >= 0
      })
      if (!foundHlas) {
        throw new Error('hlasovani not found')
      }
      foundHlas.name = name
      foundHlas.ident = item.cislo
      phase = 'content'
      acc = []
      return
    }
    acc.push(p)
  })
}
