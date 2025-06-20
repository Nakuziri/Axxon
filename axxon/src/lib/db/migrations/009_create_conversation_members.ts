import type { Knex } from "knex";

export async function up(knex: Knex): Promise<void> {
    await knex.schema.createTable('conversation_members', (table) =>{
        table.integer('conversation_id').notNullable()
            .references('id')
            .inTable('conversations')
            .onDelete('CASCADE');
        
        table.integer('user_id').notNullable()
            .references('id')
            .inTable('users')
            .onDelete('CASCADE')
        
        table.timestamp('created_at').defaultTo(knex.fn.now());
        table.primary(['conversation_id','user_id']);
    })
}

export async function down(knex: Knex): Promise<void> {
    await knex.schema.dropTableIfExists('conversation_members');
}