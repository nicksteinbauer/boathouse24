import {json, type LoaderFunctionArgs} from '@netlify/remix-runtime';
import {useLoaderData, type MetaFunction} from '@remix-run/react';
import Footerjs from '~/components/Footerjs';

export const meta: MetaFunction<typeof loader> = ({ data }) => {
  const title = `${data?.page.title ?? ''} | Boathouse Cart and Bike Rental`;
  const description = data?.page.seo?.description ?? 'Rent golf carts at Put-in-Bay from Boathouse Cart and Bike Rental.';
  const fallbackOgImage = 'https://cdn.shopify.com/s/files/1/0717/0375/7111/files/CartRentalOGSharing.jpg?v=1752592075'; // Replace with your actual hosted OG image URL

  return [
    { title },
    { name: 'description', content: description },
    { property: 'og:title', content: title },
    { property: 'og:description', content: description },
    { property: 'og:image', content: fallbackOgImage },
    { property: 'og:type', content: 'website' },
  ];
};


export async function loader({params, context}: LoaderFunctionArgs) {
  if (!params.handle) {
    throw new Error('Missing page handle');
  }

  const {page} = await context.storefront.query(PAGE_QUERY, {
    variables: {
      handle: params.handle,
    },
  });

  if (!page) {
    throw new Response('Not Found', {status: 404});
  }

  return json({page});
}

export default function Page() {
  const {page} = useLoaderData<typeof loader>();

  return (
    <>
      <div className="page header-present">
        <div className="inside-xl">
          <header>
            <h1>{page.title}</h1>
          </header>
          <main dangerouslySetInnerHTML={{__html: page.body}} />
        </div>
      </div>
    <Footerjs />
    </>
  );
}

const PAGE_QUERY = `#graphql
  query Page(
    $language: LanguageCode,
    $country: CountryCode,
    $handle: String!
  )
  @inContext(language: $language, country: $country) {
    page(handle: $handle) {
      id
      title
      body
      seo {
        description
        title
      }
    }
  }
` as const;
