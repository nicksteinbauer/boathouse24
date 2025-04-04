import {defer, type LoaderFunctionArgs} from '@netlify/remix-runtime';
import {Await, useLoaderData, Link, type MetaFunction} from '@remix-run/react';
//import {Suspense} from 'react';
import {Image, Money} from '@shopify/hydrogen';
// import type {
//   FeaturedCollectionFragment,
//   RecommendedProductsQuery,
// } from 'storefrontapi.generated';
import Hero from '~/components/Hero';
import About from '~/components/About';
import Routes from '~/components/Routes';
import Footerjs from '~/components/Footerjs';
import { PinLogo } from '~/components/PinLogo';
import {RichTextRenderer} from '@novatize-mattheri/shopify-richtext-renderer';

export const meta: MetaFunction = () => {
  return [
    { title: 'Put-in-Bay Golf Cart Rental | Boathouse Cart and Bike Rental' },
    { name: 'description', content: 'Boathouse Cart and Bike Rental offers convenient and affordable Put-in-Bay golf cart rentals. Explore South Bass Island with our 2, 4, and 6 passenger golf carts.' },
    { name: 'keywords', content: 'put in bay golf cart rental, Put-in-Bay bike rental, South Bass Island, golf cart rental, bike rental, Boathouse Cart and Bike Rental' }
  ];
};

/**
 * @param {LoaderFunctionArgs}
 */
export async function loader({context}: LoaderFunctionArgs) {
  return await context.storefront.query(HOME_QUERY);
}


export default function Homepage() {
  const data = useLoaderData<typeof loader>();
  return (
    <div className="home">
      <Hero />
      <div className="imHomeUnder">
        {/* Display Products */}
        <section className="featured-products inside-xxl">
          <h2 className="text-center"><span><PinLogo /></span>Upcoming Golf Cart Rentals</h2>
          <p className="text-center larger">The 2025 Season starts May 2nd</p>
          <ul className="auto-grid-rates">
          {data.collection?.products.nodes
            .filter((product: any) => {
              const expiration = product.newexpiration?.value;
              if (!expiration) return true;
              return new Date(expiration) > new Date();
            })
            .slice(0, 3) // Limit to first 3 valid products
            .map((product: {
              id: string;
              handle: string;
              title: string;
              featuredImage?: {
                id: string;
                altText?: string;
                url: string;
                width: number;
                height: number;
              };
              extraDescription?: string;
              priceRange: {
                minVariantPrice: {
                  amount: string;
                  currencyCode: string;
                };
              };
            }) => {
              const variantUrl = `/products/${product.handle}`;
              return (
                <li key={product.id}>
                  <Link
                    className="product-item"
                    prefetch="intent"
                    to={variantUrl}
                  >
                    {product.featuredImage && (
                      <div className="productImageContainer">
                        <Image
                          alt={product.featuredImage.altText || product.title}
                          //aspectRatio="1/1"
                          data={product.featuredImage}
                          loading="lazy"
                          sizes="(min-width: 45em) 400px, 100vw"
                        />
                      </div>
                    )}
                    <h4 className="always-flex justify">
                      <div className="flex-vertical"><span>{product.title}</span></div>
                      <small>
                        <div className="smaller">Starts at</div> <Money data={product.priceRange.minVariantPrice} />
                      </small>
                    </h4>
                    {product.extraDescription && (
                      <RichTextRenderer
                        data={product.extraDescription.value}
                        h3={{ as: 'h3' }}
                      />
                    )}
                  </Link>
                </li>
              );
            })}
          </ul>
        </section>
        <section className="about aboveAbout">
          <div className="inside-md text-center">
            <h2>Golf Cart Rental Put in Bay Ohio</h2>
            <p>Welcome to Boathouse Cart and Bike Rental, your premier destination for Put-in-Bay golf cart rentals! We offer a variety of golf carts to suit your needs, whether you're exploring for a few hours or staying for a few days. Our fleet includes both gasoline and electric carts, available in 2, 4, and 6 passenger options.</p>
            <p>Rent your golf cart online or visit our rental booth on Hartford Avenue, conveniently located near the Jet Express dock. Enjoy competitive rates and the flexibility of hourly or full-day rentals. Must be at least 18 with a valid driver's license to rent.</p>
          </div>
        </section>  
        <About />
        <Routes />
        <Footerjs />
      </div>
    </div>
  );
}




const HOME_QUERY = `#graphql
  query FeaturedProducts {
    collection(handle: "golf-cart-rentals") {
        products(first: 100) {
          nodes {
            id
            handle
            title
            featuredImage {
              id
              altText
              url
              width
              height
            }
            priceRange {
              minVariantPrice {
                amount
                currencyCode
              }
              maxVariantPrice {
                amount
                currencyCode
              }
            }
            variants(first: 1) {
              nodes {
                selectedOptions {
                  name
                  value
                }
              }
            }
            newexpiration: metafield(namespace: "custom", key: "new_expiration_date") {
              value
            }
            extraDescription: metafield(key: "extra_description", namespace: "custom") {
              value
            }
          }
        }
      }
    }
`;
