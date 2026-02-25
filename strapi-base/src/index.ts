// import type { Core } from '@strapi/strapi';

export default {
  /**
   * Register runs before the application is initialized.
   * We use it to register a document service middleware that coerces
   * empty-string enum values to their defaults BEFORE Strapi validation.
   *
   * NOTE: Strapi v5 reserves the top-level name `status` for document publication
   * status (draft/published). Guest RSVP status must therefore use another field
   * name (we use `rsvpStatus`).
   */
  register({ strapi }: { strapi: any }) {
    strapi.documents.use(async (context: any, next: () => Promise<any>) => {
      if (
        context.uid === 'api::guest.guest' &&
        (context.action === 'create' || context.action === 'update') &&
        context.params?.data
      ) {
        const data = context.params.data;

        // Backward-compat: if something still sends `status` in the entity payload,
        // map it to the new attribute.
        if (data.rsvpStatus === undefined && data.status !== undefined) {
          data.rsvpStatus = data.status;
          delete data.status;
        }

        if (data.rsvpStatus === '' || data.rsvpStatus === null || data.rsvpStatus === undefined) {
          data.rsvpStatus = 'pending';
        }
      }

      return next();
    });
  },

  /**
   * An asynchronous bootstrap function that runs before
   * your application gets started.
   *
   * This gives you an opportunity to set up your data model,
   * run jobs, or perform some special logic.
   */
  async bootstrap({ strapi }: { strapi: any }) {
    // Data migration: after renaming Guest `status` -> `rsvpStatus`, the DB may
    // contain both columns. Copy values across so existing guests keep their RSVP.
    try {
      const knex = strapi.db.connection;

      const hasTable = await knex.schema.hasTable('guests');
      if (!hasTable) return;

      const hasOld = await knex.schema.hasColumn('guests', 'status');
      const hasNew = await knex.schema.hasColumn('guests', 'rsvp_status');
      if (!hasOld || !hasNew) return;

      const affected = await knex('guests')
        .whereNull('rsvp_status')
        .whereNotNull('status')
        .update({ rsvp_status: knex.ref('status') });

      if (affected > 0) {
        strapi.log.info(`[migration] guests.status -> guests.rsvp_status: ${affected} row(s) migrated`);
      }
    } catch (err: any) {
      strapi.log.warn('[migration] guests.status -> guests.rsvp_status failed', err?.message ?? err);
    }
  },
};
