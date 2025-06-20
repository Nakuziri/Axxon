import type { Knex } from "knex";

export async function up(knex: Knex): Promise<void> {
    await knex.schema.createTable('message_attachments', (table) => {
    table.increments('id').primary();
    table.integer('message_id').notNullable()
        .references('id')
        .inTable('messages')
        .onDelete('CASCADE');
    table.string('file_url').notNullable();   // link to S3 file
    table.string('file_name').notNullable();  // original name (for downloads)
    table.string('file_type');                // e.g., image/png, application/pdf
    table.timestamp('created_at').defaultTo(knex.fn.now());
    });
}

export async function down(knex: Knex): Promise<void> {
    await knex.schema.dropTableIfExists('message_attachments');
}