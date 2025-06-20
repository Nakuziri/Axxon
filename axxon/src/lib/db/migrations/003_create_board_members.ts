import type { Knex } from "knex";

export async function up(knex: Knex): Promise<void> {
    await knex.schema.createTable('board_members', (table) =>{
        
        table.integer('user_id').unsigned().notNullable()
            .references('id')
            .inTable('users')
            .onDelete('CASCADE');

        table.integer('board_id').unsigned().notNullable()
            .references('id')
            .inTable('boards')
            .onDelete('CASCADE');

        table.primary(['user_id','board_id']);
    })
}

export async function down(knex: Knex): Promise<void> {
    await knex.schema.dropTableIfExists('board_members');
}