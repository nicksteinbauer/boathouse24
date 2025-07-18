import { json, type LoaderFunctionArgs } from '@netlify/remix-runtime';
import { useLoaderData, type MetaFunction } from '@remix-run/react';
import { GoogleMap, LoadScript } from '@react-google-maps/api';
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

export async function loader({ context }: LoaderFunctionArgs) {
  const { page } = await context.storefront.query(PAGE_QUERY);

  if (!page) {
    throw new Response('Not Found', { status: 404 });
  }

  const apiKey = process.env.GOOGLE_MAPS_API_KEY;

  if (!apiKey) {
    throw new Error('Missing GOOGLE_MAPS_API_KEY in environment variables.');
  }

  return json({
    page,
    googleMapsApiKey: apiKey,
  });
}

export default function Page() {
  const { page, googleMapsApiKey } = useLoaderData<typeof loader>();

  return (
    <>
      <div className="page header-present">
        <div className="inside-xl">
          <header>
            <h1>{page.title}</h1>
          </header>
          <main dangerouslySetInnerHTML={{ __html: page.body }} />
          <MapsComponent googleMapsApiKey={googleMapsApiKey} />
        </div>
      </div>
      <Footerjs />
    </>
  );
}

const containerStyle = {
  width: '100%',
  height: '500px',
};

const center = {
  lat: 41.653624,
  lng: -82.815565,
};

function MapsComponent({ googleMapsApiKey }: { googleMapsApiKey: string }) {
  if (!googleMapsApiKey) return null; // prevent error if key is missing

  return (
    <LoadScript googleMapsApiKey={googleMapsApiKey}>
      <GoogleMap mapContainerStyle={containerStyle} center={center} zoom={18}>
        {/* You can add markers/info windows here */}
      </GoogleMap>
    </LoadScript>
  );
}

const PAGE_QUERY = `#graphql
  query PageLocation(
    $language: LanguageCode,
    $country: CountryCode
  )
  @inContext(language: $language, country: $country) {
    page(handle: "location") {
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
