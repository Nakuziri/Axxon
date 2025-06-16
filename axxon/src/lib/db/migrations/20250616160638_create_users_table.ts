import { Knex } from 'knex';

export async function up(knex: Knex): Promise<void> {
  await knex.schema.createTable('users', (table) => {
    table.increments('id').primary();
    table.string('email').unique().notNullable();
    table.string('username', 100).notNullable().index();
    table.string('first_name').notNullable();
    table.string('last_name').notNullable();
    table.string('image');
  });
}

export async function down(knex: Knex): Promise<void> {
  await knex.schema.dropTableIfExists('user');
}
