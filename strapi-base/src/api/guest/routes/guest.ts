/**
 * guest router — custom routes + core CRUD
 */

export default {
  routes: [
    // Custom: find guest by token (public — used by invitation page)
    {
      method: 'GET',
      path: '/guests/by-token/:token',
      handler: 'guest.findByToken',
      config: {
        auth: false,
        policies: [],
        middlewares: [],
      },
    },
    // Custom: RSVP update by token (public — used by invitation form)
    {
      method: 'PUT',
      path: '/guests/by-token/:token/rsvp',
      handler: 'guest.rsvpByToken',
      config: {
        auth: false,
        policies: [],
        middlewares: [],
      },
    },
    // Core CRUD (protected by Strapi auth)
    {
      method: 'GET',
      path: '/guests',
      handler: 'guest.find',
    },
    {
      method: 'GET',
      path: '/guests/:id',
      handler: 'guest.findOne',
    },
    {
      method: 'POST',
      path: '/guests',
      handler: 'guest.create',
    },
    {
      method: 'PUT',
      path: '/guests/:id',
      handler: 'guest.update',
    },
    {
      method: 'DELETE',
      path: '/guests/:id',
      handler: 'guest.delete',
    },
  ],
};
