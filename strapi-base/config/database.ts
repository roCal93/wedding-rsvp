export default ({ env }) => {
  const client = env('DATABASE_CLIENT', 'sqlite')

  if (client === 'sqlite') {
    return {
      connection: {
        client: 'sqlite',
        connection: {
          filename: env('DATABASE_FILENAME', '.tmp/data.db'),
        },
        useNullAsDefault: true,
      },
    }
  }

  // Configuration PostgreSQL pour Railway
  const connection = env('DATABASE_URL')
    ? {
        // Railway fournit DATABASE_URL avec SSL activé
        connectionString: env('DATABASE_URL'),
        // Railway (and some other PaaS providers) use a self-signed certificate
        // in their PostgreSQL TLS chain. rejectUnauthorized must be false to
        // allow the connection. This is intentional and acceptable because the
        // traffic is still encrypted — only certificate chain verification is
        // skipped. If your provider supplies a trusted CA cert, set
        // DATABASE_SSL_REJECT_UNAUTHORIZED=true and provide DATABASE_CA_CERT.
        ssl: env('NODE_ENV') === 'production'
          ? { rejectUnauthorized: env.bool('DATABASE_SSL_REJECT_UNAUTHORIZED', false) }
          : false,
      }
    : {
        // Configuration manuelle
        host: env('DATABASE_HOST', 'localhost'),
        port: env.int('DATABASE_PORT', 5432),
        database: env('DATABASE_NAME', 'strapi'),
        user: env('DATABASE_USERNAME', 'strapi'),
        password: env('DATABASE_PASSWORD', 'strapi'),
        ssl: env.bool('DATABASE_SSL', false) && {
          rejectUnauthorized: env.bool('DATABASE_SSL_SELF', false),
        },
      }

  return {
    connection: {
      client: 'postgres',
      connection,
      debug: false,
    },
  }
}
