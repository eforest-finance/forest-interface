import { initializeApp } from 'firebase/app';
import { getAnalytics } from 'firebase/analytics';
import * as Sentry from '@sentry/nextjs';

const app = initializeApp({
  apiKey: 'AIzaSyC4TsdKHkcTpzN9-PlehlzhaeEkRZE18z4',
  authDomain: 'forest-f3fbe.firebaseapp.com',
  projectId: 'forest-f3fbe',
  storageBucket: 'forest-f3fbe.appspot.com',
  messagingSenderId: '1009731043324',
  appId: '1:1009731043324:web:fd18e2451456346283bc79',
  measurementId: 'G-NB0MR3EESH',
});
getAnalytics(app);

const reportError = Sentry.captureException;

export { reportError };
