import {useNonce} from '@shopify/hydrogen';
import {json} from '@netlify/remix-runtime';

import {
  defer,
  type SerializeFrom,
  type LoaderFunctionArgs,
} from '@netlify/remix-runtime';
import {
  Links,
  Meta,
  Outlet,
  Scripts,
  LiveReload,
  useMatches,
  useRouteError,
  useLoaderData,
  ScrollRestoration,
  isRouteErrorResponse,
  type ShouldRevalidateFunction,
  useLocation,
} from '@remix-run/react';
import {useEffect} from 'react';
import type {CustomerAccessToken} from '@shopify/hydrogen/storefront-api-types';
import favicon from '../public/favicon.svg';
import resetStyles from './styles/reset.css';
import appStyles from './styles/app.css';
import {Layout} from '~/components/Layout';
import FacebookPixel from './components/FacebookPixel';

/** --- GA4 window typings to avoid TS errors --- */
declare global {
  interface Window {
    dataLayer: any[];
    gtag: (...args: any[]) => void;
  }
}

/** --- Small component to inject GA4 with nonce --- */
function GoogleAnalytics({gaId, nonce}: {gaId?: string; nonce?: string}) {
  if (!gaId || process.env.NODE_ENV !== 'production') return null;
  return (
    <>
      <script async src={`https://www.googletagmanager.com/gtag/js?id=${gaId}`} />
      <script
        nonce={nonce}
        dangerouslySetInnerHTML={{
          __html: `
            window.dataLayer = window.dataLayer || [];
            function gtag(){dataLayer.push(arguments);}
            window.gtag = gtag;
            gtag('js', new Date());
            // We'll send page views manually on route changes:
            gtag('config', '${gaId}', { send_page_view: false });
          `,
        }}
      />
    </>
  );
}

/**
 * This is important to avoid re-fetching root queries on sub-navigations
 */
export const shouldRevalidate: ShouldRevalidateFunction = ({
  formMethod,
  currentUrl,
  nextUrl,
}) => {
  if (formMethod && formMethod !== 'GET') return true;
  if (currentUrl.toString() === nextUrl.toString()) return true;
  return false;
};

export function links() {
  return [
    {rel: 'stylesheet', href: resetStyles},
    {rel: 'stylesheet', href: appStyles},
    {rel: 'preconnect', href: 'https://cdn.shopify.com'},
    {rel: 'preconnect', href: 'https://shop.app'},
    {rel: 'icon', type: 'image/svg+xml', href: favicon},
  ];
}

export const useRootLoaderData = () => {
  const [root] = useMatches();
  return root?.data as SerializeFrom<typeof loader>;
};

export async function loader({context}: LoaderFunctionArgs) {
  const {storefront, session, cart} = context;
  const customerAccessToken = await session.get('customerAccessToken');
  const publicStoreDomain = context.env.PUBLIC_STORE_DOMAIN;

  // ✅ GA ID pulled from env
  const gaId = context.env.GA_MEASUREMENT_ID || '';

  const {isLoggedIn, headers} = await validateCustomerAccessToken(
    session,
    customerAccessToken,
  );

  const cartPromise = cart.get();

  const footerPromise = storefront.query(FOOTER_QUERY, {
    cache: storefront.CacheLong(),
    variables: {footerMenuHandle: 'footer'},
  });

  const headerPromise = storefront.query(HEADER_QUERY, {
    cache: storefront.CacheLong(),
    variables: {headerMenuHandle: 'main-menu'},
  });

  return defer(
    {
      gaId, // ✅ exposed to client
      cart: cartPromise,
      footer: footerPromise,
      header: await headerPromise,
      isLoggedIn,
      publicStoreDomain,
    },
    {headers},
  );
}

export default function App() {
  const nonce = useNonce();
  const data = useLoaderData<typeof loader>();
  const {gaId} = data;
  const location = useLocation();

  // ✅ Send GA page_view on every navigation
  useEffect(() => {
    if (!gaId || typeof window.gtag !== 'function') return;
    window.gtag('config', gaId, {
      page_path: location.pathname + location.search,
      page_title: document.title,
    });
  }, [gaId, location.pathname, location.search]);

  return (
    <html lang="en">
      <head>
        <meta charSet="utf-8" />
        <meta name="viewport" content="width=device-width,initial-scale=1" />
        <Meta />
        <Links />
        {/* ✅ GA scripts with CSP nonce */}
        <GoogleAnalytics gaId={gaId} nonce={nonce} />
      </head>
      <body>
        <Layout {...data}>
          <Outlet />
          <FacebookPixel />
        </Layout>
        <ScrollRestoration nonce={nonce} />
        <Scripts nonce={nonce} />
        <LiveReload nonce={nonce} />
      </body>
    </html>
  );
}

export function ErrorBoundary() {
  const error = useRouteError();
  const rootData = useRootLoaderData();
  const nonce = useNonce();
  let errorMessage = 'Unknown error';
  let errorStatus = 500;

  if (isRouteErrorResponse(error)) {
    errorMessage = error?.data?.message ?? error.data;
    errorStatus = error.status;
  } else if (error instanceof Error) {
    errorMessage = error.message;
  }

  return (
    <html lang="en">
      <head>
        <meta charSet="utf-8" />
        <meta name="viewport" content="width=device-width,initial-scale=1" />
        <Meta />
        <Links />
      </head>
      <body>
        <Layout {...rootData}>
          <div className="route-error">
            <h1>Oops</h1>
            <h2>{errorStatus}</h2>
            {errorMessage && (
              <fieldset>
                <pre>{errorMessage}</pre>
              </fieldset>
            )}
          </div>
        </Layout>
        <ScrollRestoration nonce={nonce} />
        <Scripts nonce={nonce} />
        <LiveReload nonce={nonce} />
      </body>
    </html>
  );
}

/**
 * Validates the customer access token and returns a boolean and headers
 * @see https://shopify.dev/docs/api/storefront/latest/objects/CustomerAccessToken
 */
async function validateCustomerAccessToken(
  session: LoaderFunctionArgs['context']['session'],
  customerAccessToken?: CustomerAccessToken,
) {
  let isLoggedIn = false;
  const headers = new Headers();
  if (!customerAccessToken?.accessToken || !customerAccessToken?.expiresAt) {
    return {isLoggedIn, headers};
  }

  const expiresAt = new Date(customerAccessToken.expiresAt).getTime();
  const dateNow = Date.now();
  const customerAccessTokenExpired = expiresAt < dateNow;

  if (customerAccessTokenExpired) {
    session.unset('customerAccessToken');
    headers.append('Set-Cookie', await session.commit());
  } else {
    isLoggedIn = true;
  }

  return {isLoggedIn, headers};
}

const MENU_FRAGMENT = `#graphql
  fragment MenuItem on MenuItem {
    id
    resourceId
    tags
    title
    type
    url
  }
  fragment ChildMenuItem on MenuItem {
    ...MenuItem
  }
  fragment ParentMenuItem on MenuItem {
    ...MenuItem
    items {
      ...ChildMenuItem
    }
  }
  fragment Menu on Menu {
    id
    items {
      ...ParentMenuItem
    }
  }
` as const;

const HEADER_QUERY = `#graphql
  fragment Shop on Shop {
    id
    name
    description
    primaryDomain {
      url
    }
    brand {
      logo {
        image {
          url
        }
      }
    }
  }
  query Header(
    $country: CountryCode
    $headerMenuHandle: String!
    $language: LanguageCode
  ) @inContext(language: $language, country: $country) {
    shop {
      ...Shop
    }
    menu(handle: $headerMenuHandle) {
      ...Menu
    }
  }
  ${MENU_FRAGMENT}
` as const;

const FOOTER_QUERY = `#graphql
  query Footer(
    $country: CountryCode
    $footerMenuHandle: String!
    $language: LanguageCode
  ) @inContext(language: $language, country: $country) {
    menu(handle: $footerMenuHandle) {
      ...Menu
    }
  }
  ${MENU_FRAGMENT}
` as const;
