import * as Sentry from '@sentry/nextjs';

export const init = () =>
  Sentry.init({
    // Should add your own dsn
    dsn: '',
    // We recommend adjusting this value in production, or using tracesSampler
    // for finer control
    tracesSampleRate: 1.0,
    environment: process.env.NEXT_PUBLIC_APP_ENV,
    // ...
    // Note: if you want to override the automatic release value, do not set a
    // `release` value here - use the environment variable `SENTRY_RELEASE`, so
    // that it will also get attached to your source maps
    beforeSend(event) {
      if (process.env.NEXT_PUBLIC_APP_ENV !== 'production') {
        return null;
      }
      return event;
    },
  });
