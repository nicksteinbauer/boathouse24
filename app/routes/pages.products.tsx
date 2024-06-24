import {json, type LoaderFunctionArgs} from '@netlify/remix-runtime';
import {useLoaderData, type MetaFunction} from '@remix-run/react';
import Routes from '~/components/Routes';
import Footerjs from '~/components/Footerjs';

export const meta: MetaFunction<typeof loader> = ({data}) => {
  return [{title: `${data?.page.title ?? ''} | Boathouse Cart and Bike Rental`}];
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
        <Routes />
      </div>
      <Footerjs />
    </>
  );
}

const PAGE_QUERY = `#graphql
  query PageProducts(
    $language: LanguageCode,
    $country: CountryCode
  )
  @inContext(language: $language, country: $country) {
    page(handle: "products") {
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
