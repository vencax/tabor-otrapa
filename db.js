const Knex = require('knex')
const path = require('path')
const C = require('./consts')
const DB_URL = process.env.DATABASE_URL || 'db.sqlite'

const commonOpts = {
  migrations: {
    directory: path.join(__dirname, 'migrations')
  },
  seeds: {
    directory: path.join(__dirname, 'seeds')
  }
}
const debugOpts = () => ({
  client: 'sqlite3',
  connection: {
    filename: DB_URL === undefined ? ':memory:' : DB_URL
  },
  useNullAsDefault: true,
  debug: true,
  pool: { min: 0, max: 7 }
})
const productionOpts = () => ({
  client: DB_URL.indexOf('postgres') >= 0 ? 'pg' : 'mysql',
  connection: DB_URL
})
let opts = process.env.NODE_ENV === 'production'
  ? productionOpts()
  : debugOpts()
opts = Object.assign(commonOpts, opts)

const knex = Knex(opts)

class DB {
  saveJednaniZM (data) {
    return knex(C.TABLENAMES.JEDNANIZM).insert(data)
    .then(ids => {
      return Object.assign(data, {id: ids[0]})
    })
  }

  saveBodJednaniZM (data) {
    return knex(C.TABLENAMES.BODJEDNANIZM).insert(data)
    .then(ids => {
      return Object.assign(data, {id: ids[0]})
    })
  }
}

module.exports = () => {
  return knex.migrate.latest()
  .then(() => new DB())
}
