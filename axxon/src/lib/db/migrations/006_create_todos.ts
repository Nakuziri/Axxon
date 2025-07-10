import type { Knex } from "knex";

export async function up(knex: Knex): Promise<void> {
    await knex.schema.createTable('todos', (table) =>{
        table.increments('id').primary();

        table.integer('board_id').notNullable()
            .references('id')
            .inTable('boards')
            .onDelete('CASCADE');

        table.string('title').notNullable().index();
        table.text('description');
        table.date('due_date');

        table.integer('assignee_id')
            .references('id')
            .inTable('users')
            .onDelete('CASCADE');

        table.integer('priority');

        table.integer('category_id').notNullable()
            .references('id')
            .inTable('categories')
            .onDelete('CASCADE');

        table.boolean('is_complete').defaultTo(false)

        table.timestamp('created_at').defaultTo(knex.fn.now());
        table.timestamp('updated_at').defaultTo(knex.fn.now());
    })
}

export async function down(knex: Knex): Promise<void> {
    await knex.schema.dropTableIfExists('todos');
}