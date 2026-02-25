/**
 * Global HTTP middleware — applies to public REST API routes (/api/...) only.
 * Content-manager routes (/content-manager/...) bypass this middleware in Strapi 5;
 * those are handled by the document-service middleware in src/index.ts.
 *
 * Coerces empty/null/undefined `rsvpStatus` to 'pending' before Strapi validates
 * the enum field, preventing validation errors on guest create/update via the REST API.
 */

const VALID_RSVP_STATUSES = new Set(['pending', 'attending', 'declining']);

function isGuestApiPath(path: string): boolean {
  return path.startsWith('/api/guests');
}

function sanitizeRsvpStatus(target: any) {
  if (!target || typeof target !== 'object') return;

  const raw = target.rsvpStatus;

  if (raw === '' || raw === null || raw === undefined) {
    target.rsvpStatus = 'pending';
    return;
  }

  if (typeof raw === 'string') {
    const trimmed = raw.trim();
    if (!trimmed) {
      target.rsvpStatus = 'pending';
      return;
    }
    const lower = trimmed.toLowerCase();
    target.rsvpStatus = VALID_RSVP_STATUSES.has(lower) ? lower : 'pending';
  }
}

export default () => {
  return async (ctx: any, next: () => Promise<void>) => {
    const method = String(ctx.method || '').toUpperCase();

    if (
      ['POST', 'PUT', 'PATCH'].includes(method) &&
      isGuestApiPath(ctx.path || '')
    ) {
      const body = ctx.request?.body;
      if (body) {
        const target =
          body.data && typeof body.data === 'object' ? body.data : body;
        sanitizeRsvpStatus(target);
      }
    }

    await next();
  };
};
