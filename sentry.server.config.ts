import * as Sentry from '@sentry/nextjs';

Sentry.init({
  dsn: 'https://d4cd70db107c4fa5b5f1dfda9dccebfd@o4505006413840384.ingest.sentry.io/4505192412741632',

  // Set tracesSampleRate to 1.0 to capture 100%
  // of transactions for performance monitoring.
  // We recommend adjusting this value in production
  tracesSampleRate: 1.0,

  // ...

  // Note: if you want to override the automatic release value, do not set a
  // `release` value here - use the environment variable `SENTRY_RELEASE`, so
  // that it will also get attached to your source maps
});
