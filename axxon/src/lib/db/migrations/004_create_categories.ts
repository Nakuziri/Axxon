import type { Knex } from "knex";

export async function up(knex: Knex): Promise<void> {
    await knex.schema.createTable('categories', (table) =>{
        table.increments('id').primary();
        
        table.integer('board_id').notNullable()
            .references('id')
            .inTable('boards')
            .onDelete('CASCADE');

        table.string('name').notNullable();
        table.string('color');
        table.timestamp('created_at').defaultTo(knex.fn.now());//shows when created 
        table.timestamp('updated_at').defaultTo(knex.fn.now());//shows timestamp of when updated
    })
}

export async function down(knex: Knex): Promise<void> {
    await knex.schema.dropTableIfExists('categories');
}