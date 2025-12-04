import * as Sentry from '@sentry/nextjs';

export const init = () =>
  Sentry.init({
    // Should add your own dsn
    dsn: 'https://d4cd70db107c4fa5b5f1dfda9dccebfd@o4505006413840384.ingest.sentry.io/4505192412741632',
    // We recommend adjusting this value in production, or using tracesSampler
    // for finer control
    tracesSampleRate: 1.0,
    environment: process.env.NEXT_PUBLIC_APP_ENV,
    // ...
    // Note: if you want to override the automatic release value, do not set a
    // `release` value here - use the environment variable `SENTRY_RELEASE`, so
    // that it will also get attached to your source maps
    beforeSend(event) {
      console.log(
        'before send Event',
        process.env.NEXT_PUBLIC_APP_ENV,
        process.env.NEXT_PUBLIC_APP_ENV !== 'production',
      );
      if (process.env.NEXT_PUBLIC_APP_ENV !== 'production') {
        return null;
      }
      return event;
    },
    // e,
  });
