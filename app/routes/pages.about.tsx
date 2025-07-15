import {json, type LoaderFunctionArgs} from '@netlify/remix-runtime';
import {useLoaderData, type MetaFunction} from '@remix-run/react';
import About from '~/components/About';
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

  const {page} = await context.storefront.query(PAGE_QUERY);


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
        <About />
      </div>
      <Footerjs />
    </>
  );
}

const PAGE_QUERY = `#graphql
  query PageAbout(
    $language: LanguageCode,
    $country: CountryCode
  )
  @inContext(language: $language, country: $country) {
    page(handle: "about") {
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
