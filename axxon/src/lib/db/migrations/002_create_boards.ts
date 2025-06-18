import { Knex } from 'knex';

export async function up(knex: Knex): Promise<void> {
  await knex.schema.createTable('boards', (table) => {
    table.increments('id').primary();
    table.string('name').notNullable();
    table.integer('created_by').notNullable()
        .references('id')
        .inTable('users')
        .onDelete('CASCADE');
    table.timestamp('created_at').defaultTo(knex.fn.now());//shows when created 
    table.timestamp('updated_at').defaultTo(knex.fn.now());//shows timestamp of when updated
  });
}

export async function down(knex: Knex): Promise<void> {
  await knex.schema.dropTableIfExists('boards');
}