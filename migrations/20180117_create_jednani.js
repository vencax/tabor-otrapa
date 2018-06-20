const C = require('../consts')

exports.up = (knex, Promise) => {
  return knex.schema.createTable(C.TABLENAMES.JEDNANIZM, (table) => {
    table.increments('id').primary()
    table.string('name', 512).notNullable()
    table.string('link', 512).notNullable()
    table.date('datum').notNullable()
    table.string('usneseni', 512).notNullable()
    table.string('hlasovani', 512).notNullable()
    table.timestamp('created').notNullable().defaultTo(knex.fn.now())
    table.unique(['datum'])
  })
}

exports.down = (knex, Promise) => {
  return knex.schema.dropTable(C.TABLENAMES.JEDNANIZM)
}
