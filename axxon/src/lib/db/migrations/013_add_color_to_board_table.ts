import type { Knex } from "knex";

export async function up(knex: Knex): Promise<void> {
    await knex.schema.alterTable('boards', (table) => {
        table.string('color').defaultTo('#ffffff'); // Default color set to white
    });
}   

export async function down(knex: Knex): Promise<void> {
    await knex.schema.alterTable('boards', (table) => {
        table.dropColumn('color');
    });
}    