import {defer, type LoaderFunctionArgs} from '@netlify/remix-runtime';
import {Await, useLoaderData, Link, type MetaFunction} from '@remix-run/react';
import {Suspense} from 'react';
import {Image, Money} from '@shopify/hydrogen';
import type {
  FeaturedCollectionFragment,
  RecommendedProductsQuery,
} from 'storefrontapi.generated';
import Hero from '~/components/Hero';
import About from '~/components/About';
import Routes from '~/components/Routes';
import Footerjs from '~/components/Footerjs';

export const meta: MetaFunction = () => {
  return [
    { title: 'Put-in-Bay Golf Cart Rental | Boathouse Cart and Bike Rental' },
    { name: 'description', content: 'Boathouse Cart and Bike Rental offers convenient and affordable Put-in-Bay golf cart rentals. Explore South Bass Island with our 2, 4, and 6 passenger golf carts.' },
    { name: 'keywords', content: 'put in bay golf cart rental, Put-in-Bay bike rental, South Bass Island, golf cart rental, bike rental, Boathouse Cart and Bike Rental' }
  ];
};


export async function loader({context}: LoaderFunctionArgs) {
  const {storefront} = context;
  const {collections} = await storefront.query(FEATURED_COLLECTION_QUERY);
  const featuredCollection = collections.nodes[0];
  const recommendedProducts = storefront.query(RECOMMENDED_PRODUCTS_QUERY);

  return defer({featuredCollection, recommendedProducts});
}

export default function Homepage() {
  const data = useLoaderData<typeof loader>();
  return (
    <div className="home">
      <Hero />
      <div className="imHomeUnder">
        <section className="about inside-md text-center">
          <p>Welcome to Boathouse Cart and Bike Rental, your premier destination for Put-in-Bay golf cart rentals! We offer a variety of golf carts to suit your needs, whether you're exploring for a few hours or staying for a few days. Our fleet includes both gasoline and electric carts, available in 2, 4, and 6 passenger options.</p>
          <p>Rent your golf cart online or visit our rental booth on Hartford Avenue, conveniently located near the Jet Express dock. Enjoy competitive rates and the flexibility of hourly or full-day rentals. Must be at least 18 with a valid driver's license to rent.</p>
        </section>  
        <About />
        <Routes />
        <Footerjs />
      </div>
    </div>
  );
}


const FEATURED_COLLECTION_QUERY = `#graphql
  fragment FeaturedCollection on Collection {
    id
    title
    image {
      id
      url
      altText
      width
      height
    }
    handle
  }
  query FeaturedCollection($country: CountryCode, $language: LanguageCode)
    @inContext(country: $country, language: $language) {
    collections(first: 1, sortKey: UPDATED_AT, reverse: true) {
      nodes {
        ...FeaturedCollection
      }
    }
  }
` as const;

const RECOMMENDED_PRODUCTS_QUERY = `#graphql
  fragment RecommendedProduct on Product {
    id
    title
    handle
    priceRange {
      minVariantPrice {
        amount
        currencyCode
      }
    }
    images(first: 1) {
      nodes {
        id
        url
        altText
        width
        height
      }
    }
  }
  query RecommendedProducts ($country: CountryCode, $language: LanguageCode)
    @inContext(country: $country, language: $language) {
    products(first: 4, sortKey: UPDATED_AT, reverse: true) {
      nodes {
        ...RecommendedProduct
      }
    }
  }
` as const;
