'use strict';

async function up(knex) {
    const hasWeddingsTable = await knex.schema.hasTable('weddings');
    if (!hasWeddingsTable) return;

    const client = knex?.client?.config?.client || '';

    if (await knex.schema.hasColumn('weddings', 'date')) {
        if (client.includes('pg')) {
            await knex.raw(
                'ALTER TABLE "weddings" ALTER COLUMN "date" TYPE date USING "date"::date'
            );
        } else if (client.includes('mysql')) {
            await knex.raw('ALTER TABLE `weddings` MODIFY `date` DATE NOT NULL');
        }
    }

    if (await knex.schema.hasColumn('weddings', 'venue')) {
        await knex.schema.alterTable('weddings', (table) => {
            table.dropColumn('venue');
        });
    }

    if (await knex.schema.hasColumn('weddings', 'venueAddress')) {
        await knex.schema.alterTable('weddings', (table) => {
            table.dropColumn('venueAddress');
        });
    }

    if (await knex.schema.hasColumn('weddings', 'organizerEmail')) {
        await knex.schema.alterTable('weddings', (table) => {
            table.dropColumn('organizerEmail');
        });
    }
}

module.exports = { up };