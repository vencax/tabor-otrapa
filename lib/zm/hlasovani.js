
module.exports = (parts, jednani) => {
  // transaction?
  const items = []
  let item = {}
  let acc = []
  let phase = null
  const setList = () => {
    if (acc.length > 0) {
      item[phase] = acc.join('|')
    }
    acc = []
  }
  parts.map(p => {
    if (p.match(/Číslo hlasování: \d+/)) {
      if (item.cislo !== undefined) { // flush
        setList()
        items.push(item)
        item = {}
      }
      item.cislo = p.match(/Číslo hlasování: (\d+)/)[1]
      acc = []
      return
    }
    if (p.match(/hlasovali následovně:/)) {
      item.name = acc.join(' ')
      return
    }
    if (p.match(/Pro: \d+/)) {
      item.propocet = p.match(/Pro: (\d+)/)[1]
      return
    }
    if (p.match(/Proti: \d+/)) {
      item.protipocet = p.match(/Proti: (\d+)/)[1]
      return
    }
    if (p.match(/Zdrželo se: \d+/)) {
      item.zdrzelopocet = p.match(/Zdrželo se: (\d+)/)[1]
      return
    }
    if (p.match(/Přítomni: \d+/)) {
      item.total = p.match(/Přítomni: (\d+)/)[1]
      return
    }
    if (p.match(/Nehlasovali: \d+/)) {
      item.nehlasovalipocet = p.match(/Nehlasovali: (\d+)/)[1]
      return
    }
    if (p === 'Pro:') {
      phase = 'pro'
      acc = []
      return
    }
    if (p === 'Proti:') {
      setList()
      phase = 'proti'
      return
    }
    if (p === 'Nehlasovalo:') {
      setList()
      phase = 'nehlasovalo'
      return
    }

    if (p === 'Zdrželo se:') {
      setList()
      phase = 'zdrzelo'
      return
    }
    acc.push(p)
  })
  return items
}
