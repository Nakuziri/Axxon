import type { Knex } from "knex";

export async function up(knex: Knex): Promise<void> {
    await knex.schema.createTable('messages', (table) =>{
        table.increments('id').primary();

        table.integer('conversation_id').notNullable()
            .references('id')
            .inTable('conversations')
            .onDelete('CASCADE');

        table.integer('user_id').notNullable()
            .references('id')
            .inTable('users')
            .onDelete('CASCADE');
        
        table.text('message').notNullable();
        table.timestamp('created_at').defaultTo(knex.fn.now());
        table.timestamp('updated_at').defaultTo(knex.fn.now());
        table.boolean('is_edited').defaultTo(false);
    })
}

export async function down(knex: Knex): Promise<void> {
    await knex.schema.dropTableIfExists('messages');
}

