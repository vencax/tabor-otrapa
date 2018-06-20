require('dotenv').config({path: process.env.DOTENV_CONFIG || '.env'})
const DB = require('./db')
const ZM = require('./lib/zm/zm')
const opts = {
  site: 'http://www.taborcz.eu',
  folder: process.env.STORAGE_FOLDER || '.storage'
}

DB()
.then(db => {
  ZM.loadJednaniPage(opts, db, '/20-zasedani-zastupitelstva-mesta-tabora-konane-15-12-2008/d-1627/p1=66319')
})
.catch(err => console.log(err))
