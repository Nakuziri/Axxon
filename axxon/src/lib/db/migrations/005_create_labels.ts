import type { Knex } from "knex";

export async function up(knex: Knex): Promise<void> {
    await knex.schema.createTable('labels', (table) => {
        table.increments('id').primary();

        table.integer('board_id').notNullable()
            .references('id')
            .inTable('boards')
            .onDelete('CASCADE');

        table.string('name').notNullable();
        table.string('color');
    })
}

export async function down(knex: Knex): Promise<void> {
    await knex.schema.dropTableIfExists('labels')
}