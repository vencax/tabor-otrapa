const C = require('../consts')

exports.up = (knex, Promise) => {
  return knex.schema.createTable(C.TABLENAMES.BODYJEDNANIZM, (table) => {
    table.increments('id').primary()
    table.integer('jednani_fk').notNullable()
    table.string('name', 1024).notNullable()
    table.string('ident', 64)
    table.integer('cislo').notNullable()
    table.text('usneseni')
    table.text('pro')
    table.text('proti')
    table.text('zdrzelo')
    table.text('nehlasovalo')

    table.integer('propocet')
    table.integer('protipocet')
    table.integer('nehlasovalipocet')
    table.integer('zdrzelopocet')
    table.integer('total')

    table.timestamp('created').notNullable().defaultTo(knex.fn.now())
    table.unique(['cislo', 'jednani_fk'])
  })
}

exports.down = (knex, Promise) => {
  return knex.schema.dropTable(C.TABLENAMES.BODYJEDNANIZM)
}
