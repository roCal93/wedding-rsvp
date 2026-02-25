/**
 * work-item router (portfolio-item)
 */

import { factories } from '@strapi/strapi';
type CreateCoreRouterArg = Parameters<typeof factories.createCoreRouter>[0];

export default factories.createCoreRouter('api::work-item.work-item' as CreateCoreRouterArg);
