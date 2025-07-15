import type { Knex } from "knex";

export async function up(knex: Knex): Promise<void> {
  await knex.schema.createTable('categories', (table) =>{
    table.increments('id').primary();

    table.integer('board_id').notNullable()
      .references('id')
      .inTable('boards')
      .onDelete('CASCADE')
      .index();//indexing makes indexing faster

    table.string('name').notNullable();
    table.string('color').notNullable();
    table.integer('position').notNullable(); // position for drag-and-drop ordering
    table.unique(['board_id', 'position']); // checks that no catogories in a board share a position
    table.boolean('is_done').defaultTo(false); //allows multiple completion categories

    table.timestamp('created_at').defaultTo(knex.fn.now());
    table.timestamp('updated_at').defaultTo(knex.fn.now());
  });
}

export async function down(knex: Knex): Promise<void> {
  await knex.schema.dropTableIfExists('categories');
}