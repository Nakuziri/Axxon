import type { Knex } from "knex";

export async function up(knex: Knex): Promise<void> {
    await knex.schema.createTable('todo_labels', (table) => {
        table.integer('todo_id').notNullable()
            .references('id')
            .inTable('todos')
            .onDelete('CASCADE');

        table.integer('label_id').notNullable()
            .references('id')
            .inTable('labels')
            .onDelete('CASCADE');

        table.primary(['todo_id','label_id']);
    })    
}

export async function down(knex: Knex): Promise<void> {
    await knex.schema.dropTableIfExists('todo_labels');
}

