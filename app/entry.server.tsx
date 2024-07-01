import type {EntryContext} from '@netlify/remix-runtime';
import {RemixServer} from '@remix-run/react';
import isbot from 'isbot';
import {renderToReadableStream} from 'react-dom/server';
import {createContentSecurityPolicy} from '@shopify/hydrogen';

export default async function handleRequest(
  request: Request,
  responseStatusCode: number,
  responseHeaders: Headers,
  remixContext: EntryContext,
) {
  const {nonce, header, NonceProvider} = createContentSecurityPolicy({
    defaultSrc: [
      "'self'",
      'data:',
    ],
    styleSrc: [
      "'self'",
      'https://fonts.googleapis.com/',
      'https://cdnjs.cloudflare.com/',
      'https://cdn.jsdelivr.net/',
    ],
    connectSrc: [
      "'self'",
      'ws://localhost:3001/',
      'https://maps.googleapis.com/',
      'https://api.emailjs.com/',
    ],
    imgSrc: [
      "'self'",
      'data:',
      'https://assets.gorgias.chat/',
      'http://localhost:3100/',
      'https://cdn.shopify.com/',
      'http://maps.gstatic.com/',
      'https://www.google.com/',
      'https://config.gorgias.io/',
      'http://maps.googleapis.com/',
      'http://markers.storelocatorwidgets.com/',
      'https://www.googletagmanager.com/',
      'https://www.facebook.com/',
      'https://connect.facebook.net/',
      'https://cdn.cookielaw.org/',
      'https://d3k81ch9hvuctc.cloudfront.net/',
    ],
    scriptSrcElem: [
      "'self'",
      "'unsafe-inline'",
      'https://config.gorgias.chat/',
      'https://assets.gorgias.chat/',
      'https://polyfill.io/',
      'http://localhost:3100/',
      'https://www.google.com/',
      'https://cdn.shopify.com/',
      'https://www.gstatic.com/',
      'https://cdn.amplitude.com/',
      'https://cdn.storelocatorwidgets.com/',
      'http://cdn.storelocatorwidgets.com/',
      'https://ajax.googleapis.com/',
      'http://maps.googleapis.com/',
      'http://ajax.googleapis.com/',
      'http://loc.storelocatorwidgets.com/',
      'https://obrien.us6.list-manage.com/',
      'https://www.googletagmanager.com/',
      'https://googleads.g.doubleclick.net/',
      'https://acsbapp.com/',
      'https://connect.facebook.net/',
      'https://cdn.cookielaw.org/',
      'https://form.jotform.com/',
      'https://boards.greenhouse.io/',
      'https://contact.gorgias.help/',
      'http://www.storelocatorwidgets.com/',
      'https://static.klaviyo.com/',
      'https://static-tracking.klaviyo.com/',
    ],
    fontSrc: [
      "'self'",
      'https://fonts.gstatic.com/',
      'https://cdnjs.cloudflare.com/',
    ],
    frameSrc: [
      "'self'",
      'https://www.google.com/',
    ],
  });

  const body = await renderToReadableStream(
    <NonceProvider>
      <RemixServer context={remixContext} url={request.url} />
    </NonceProvider>,
    {
      nonce,
      signal: request.signal,
      onError(error) {
        // eslint-disable-next-line no-console
        console.error(error);
        responseStatusCode = 500;
      },
    },
  );

  if (isbot(request.headers.get('user-agent'))) {
    await body.allReady;
  }

  responseHeaders.set('Content-Type', 'text/html');
  responseHeaders.set('Content-Security-Policy', header);

  return new Response(body, {
    headers: responseHeaders,
    status: responseStatusCode,
  });
}
