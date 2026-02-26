/**
 * guest controller
 */

import { factories } from '@strapi/strapi';

type UID = 'api::guest.guest';
const UID: UID = 'api::guest.guest';

// eslint-disable-next-line @typescript-eslint/no-explicit-any
type AnyStrapi = any;

// Strip empty-string enum values before Strapi validation runs
function sanitizeGuestBody(ctx: AnyStrapi) {
  if (ctx.request.body?.data) {
    const data = ctx.request.body.data;

    // Backward-compat: if something still sends `status`, map it to the new field.
    if (data.rsvpStatus === undefined && data.status !== undefined) {
      data.rsvpStatus = data.status;
      delete data.status;
    }

    if (data.rsvpStatus === '' || data.rsvpStatus === null || data.rsvpStatus === undefined) {
      data.rsvpStatus = 'pending';
    }
  }
}

export default factories.createCoreController(UID as AnyStrapi, ({ strapi }: { strapi: AnyStrapi }) => ({
  async create(ctx: AnyStrapi) {
    sanitizeGuestBody(ctx);
    return super.create(ctx);
  },

  async update(ctx: AnyStrapi) {
    sanitizeGuestBody(ctx);
    return super.update(ctx);
  },

  /**
   * GET /guests/by-token/:token
   * Returns guest + wedding info for the invitation page (public)
   */
  async findByToken(ctx: AnyStrapi) {
    const { token } = ctx.params;

    if (!token || typeof token !== 'string') {
      return ctx.badRequest('Token invalide');
    }

    const guests = await strapi.entityService.findMany('api::guest.guest', {
      filters: { token },
      populate: { wedding: true },
      limit: 1,
    });

    if (!guests || guests.length === 0) {
      return ctx.notFound('Invitation introuvable');
    }

    const guest = guests[0];

    // Sanitize: don't leak other guests data
    return ctx.send({
      data: {
        id: guest.id,
        name1: guest.name1,
        name2: guest.name2,
        gender: guest.gender ?? null,
        greeting: guest.greeting ?? null,
        coverMessage: guest.coverMessage ?? null,
        status: guest.rsvpStatus,
        askPartnerAttendance: guest.askPartnerAttendance ?? false,
        partnerAttending: guest.partnerAttending ?? null,
        confirmAttendingSoloTitle: guest.confirmAttendingSoloTitle ?? null,
        confirmAttendingSoloBody: guest.confirmAttendingSoloBody ?? null,
        confirmAttendingWithPartnerTitle: guest.confirmAttendingWithPartnerTitle ?? null,
        confirmAttendingWithPartnerBody: guest.confirmAttendingWithPartnerBody ?? null,
        confirmDecliningTitle: guest.confirmDecliningTitle ?? null,
        confirmDecliningBody: guest.confirmDecliningBody ?? null,
        message: guest.message,
        respondedAt: guest.respondedAt,
        wedding: guest.wedding
          ? {
              eventName: guest.wedding.eventName,
              date: guest.wedding.date,
              coverMessage: guest.wedding.coverMessage,
            }
          : null,
      },
    });
  },

  /**
   * PUT /guests/by-token/:token/rsvp
   * Public RSVP submission endpoint
   */
  async rsvpByToken(ctx: AnyStrapi) {
    const { token } = ctx.params;
    const body = ctx.request.body;

    if (!token || typeof token !== 'string') {
      return ctx.badRequest('Token invalide');
    }

    // Validate status
    const validStatuses = ['attending', 'declining'];
    if (!body.status || !validStatuses.includes(body.status)) {
      return ctx.badRequest('Statut invalide. Valeurs acceptées : attending, declining');
    }

    // Find guest
    const guests = await strapi.entityService.findMany('api::guest.guest', {
      filters: { token },
      limit: 1,
    });

    if (!guests || guests.length === 0) {
      return ctx.notFound('Invitation introuvable');
    }

    const guest = guests[0];

    // Sanitize message
    const message =
      typeof body.message === 'string' ? body.message.slice(0, 1000).trim() : '';

    // Update guest
    const updated = await strapi.entityService.update('api::guest.guest', guest.id, {
      data: {
        rsvpStatus: body.status,
        partnerAttending: body.partnerAttending !== undefined ? Boolean(body.partnerAttending) : null,
        message: message || null,
        respondedAt: new Date().toISOString(),
      },
    });

    return ctx.send({ data: { id: updated.id, status: updated.rsvpStatus } });
  },
}));
