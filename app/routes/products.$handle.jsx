import { Suspense, useState } from 'react';
import { defer, redirect } from '@netlify/remix-runtime';
import { Await, Link, useLoaderData } from '@remix-run/react';
import { Image, Money, VariantSelector, getSelectedProductOptions, CartForm } from '@shopify/hydrogen';
import { getVariantUrl } from '~/utils';

import Footerjs from '~/components/Footerjs';
import Modal from 'react-bootstrap/Modal';

export const meta = ({ data }) => {
  return [{ title: `${data?.product.title ?? ''} | Boathouse Cart and Bike Rental'` }];
};

export async function loader({ params, request, context }) {
  const { handle } = params;
  const { storefront } = context;

  const selectedOptions = getSelectedProductOptions(request).filter(
    (option) =>
      // Filter out Shopify predictive search query params
      !option.name.startsWith('_sid') &&
      !option.name.startsWith('_pos') &&
      !option.name.startsWith('_psq') &&
      !option.name.startsWith('_ss') &&
      !option.name.startsWith('_v') &&
      // Filter out third party tracking params
      !option.name.startsWith('fbclid'),
  );

  if (!handle) {
    throw new Error('Expected product handle to be defined');
  }

  const { product } = await storefront.query(PRODUCT_QUERY, {
    variables: { handle, selectedOptions },
  });

  if (!product?.id) {
    throw new Response(null, { status: 404 });
  }

  const firstVariant = product.variants.nodes[0];
  const firstVariantIsDefault = Boolean(
    firstVariant.selectedOptions.find(
      (option) =>
        option.name === 'Title' && option.value === 'Default Title',
    ),
  );

  if (firstVariantIsDefault) {
    product.selectedVariant = firstVariant;
  } else {
    if (!product.selectedVariant) {
      throw redirectToFirstVariant({ product, request });
    }
  }

  const variants = storefront.query(VARIANTS_QUERY, {
    variables: { handle },
  });

  return defer({ product, variants });
}

function redirectToFirstVariant({ product, request }) {
  const url = new URL(request.url);
  const firstVariant = product.variants.nodes[0];

  return redirect(
    getVariantUrl({
      pathname: url.pathname,
      handle: product.handle,
      selectedOptions: firstVariant.selectedOptions,
      searchParams: new URLSearchParams(url.search),
    }),
    {
      status: 302,
    },
  );
}

export default function Product() {
  const { product, variants } = useLoaderData();
  const { selectedVariant } = product;
  return (
    <>
      <div className="newProduct header-present">
        <section className="noPadding flex-md inside-lg">
          <ProductImage image={selectedVariant?.image} />
          <ProductMain
            selectedVariant={selectedVariant}
            product={product}
            variants={variants}
          />
        </section>
      </div>
      <Footerjs />
    </>
  );
}

function ProductImage({ image }) {
  if (!image) {
    return <div className="product-image" />;
  }
  return (
    <div className="forty galleryContainer">
      <Image
        alt={image.altText || 'Product Image'}
        data={image}
        key={image.id}
        sizes="(min-width: 45em) 50vw, 100vw"
      />
    </div>
  );
}

function ProductMain({ selectedVariant, product, variants }) {
  const {
    title, 
    descriptionHtml
  } = product;

  return (
    <div className="buybox sixty flex-vertical padding-20">
      <div>
        <h1 className="flex-md justify">{title}<ProductPrice selectedVariant={selectedVariant} /></h1>
        <div className="bigger" dangerouslySetInnerHTML={{__html: descriptionHtml}} />
        <Suspense
          fallback={
            <ProductForm
              product={product}
              selectedVariant={selectedVariant}
              variants={[]}
            />
          }
        >
          <Await
            errorElement="There was a problem loading product variants"
            resolve={variants}
          >
            {(data) => (
              <ProductForm
                product={product}
                selectedVariant={selectedVariant}
                variants={data.product?.variants.nodes || []}
              />
            )}
          </Await>
        </Suspense>
      </div>
    </div>
  );
}

function ProductPrice({ selectedVariant }) {
  return (
    <div className="product-price flex-vertical">
      {selectedVariant?.compareAtPrice ? (
        <>
          <p>Sale</p>
          <div className="product-price-on-sale">
            {selectedVariant ? <Money data={selectedVariant.price} /> : null}
            <s>
              <Money data={selectedVariant.compareAtPrice} />
            </s>
          </div>
        </>
      ) : (
        selectedVariant?.price && <Money data={selectedVariant?.price} />
      )}
    </div>
  );
}

function ProductForm({ product, selectedVariant, variants }) {
    const {
        relatedtitle1,
        relatedlink1,
        expiration
    } = product;
    const rtitle1 = relatedtitle1?.value ? relatedtitle1?.value : null;
    const rlink1 = relatedlink1?.value ? relatedlink1?.value : null;
    const expirationDate = expiration?.value ? expiration?.value : null;

    const [show, setShow] = useState(false);

    const handleClose = () => setShow(false);
    const handleShow = () => setShow(true);

    const todaysDate = new Date();

    const now = new Intl.DateTimeFormat('en-CA', {
      month: '2-digit',
      day: '2-digit',
      year: 'numeric'
    }).format(todaysDate).replace(",", "");
    
    const expired = now >= expirationDate;
  return (
    <>
        <div className="product-form">
        <VariantSelector
            handle={product.handle}
            options={product.options}
            variants={variants}
        >
            {({ option }) => <ProductOptions key={option.name} option={option} />}
        </VariantSelector>
        <AddToCartButton
            disabled={!selectedVariant || !selectedVariant.availableForSale || expired}
            onClick={handleShow}
            lines={
            selectedVariant
                ? [
                    {
                    merchandiseId: selectedVariant.id,
                    quantity: 1,
                    },
                ]
                : []
            }
        >
            {selectedVariant?.availableForSale && !expired ? 'Add to cart' : 'Sold out'}
        </AddToCartButton>
        </div>
        <Modal show={show} onHide={handleClose} className="recommendModal">
            <Modal.Header closeButton>
            <Modal.Title>Product added to Cart</Modal.Title>
            </Modal.Header>
            <Modal.Body>
            {rlink1 !== null && (
                <>
                <p>Would you like to rent an additional day? Click on the product below.</p>
                <Link to={`/products/${rlink1}`} onClick={handleClose} className="always-flex">
                <img id="gid://shopify/ImageSource/33484292096311" alt="Boathouse Cart Rental 2 Person Cart" loading="lazy" className="media miniImage" src="https://cdn.shopify.com/s/files/1/0717/0375/7111/files/BoathouseCartRental2Person.jpg?v=1683905041" decoding="async"></img>
                <h3 className="flex-vertical"><span>{rtitle1}</span></h3>
                </Link>
                </>
            )}
            
            <Link className="button" to="/cart">View Cart</Link>
            
            </Modal.Body>
        </Modal>
    </>
  );
}

function ProductOptions({ option }) {
  return (
    <div className="productForm" key={option.name}>
      <h5>{option.name}</h5>
      <div className="always-flex flex-gap-6">
        {option.values.map(({ value, isAvailable, isActive, to }) => {
          return (
            <Link
              className="product-options-item"
              key={option.name + value}
              prefetch="intent"
              preventScrollReset
              replace
              to={to}
              style={{
                background: isActive ? '#de6e4b' : 'transparent',
                color: isActive ? '#ffffff' : '#828f9e',
                opacity: isAvailable ? 1 : 0.3,
              }}
            >
              {value}
            </Link>
          );
        })}
      </div>
    </div>
  );
}

function AddToCartButton({ analytics, children, disabled, lines, onClick }) {
  return (
    <CartForm route="/cart" inputs={{ lines }} action={CartForm.ACTIONS.LinesAdd}>
      {(fetcher) => (
        <div className="buyNow flex-xs justify">
          <input
            name="analytics"
            type="hidden"
            value={JSON.stringify(analytics)}
          />
          <button
            type="submit"
            className="addButton"
            onClick={onClick}
            disabled={disabled ?? fetcher.state !== 'idle'}
          >
            {children}
          </button>
        </div>
      )}
    </CartForm>
  );
}

const PRODUCT_VARIANT_FRAGMENT = `#graphql
  fragment ProductVariant on ProductVariant {
    availableForSale
    compareAtPrice {
      amount
      currencyCode
    }
    id
    image {
      __typename
      id
      url
      altText
      width
      height
    }
    price {
      amount
      currencyCode
    }
    product {
      title
      handle
    }
    selectedOptions {
      name
      value
    }
    sku
    title
    unitPrice {
      amount
      currencyCode
    }
  }
`;

const PRODUCT_FRAGMENT = `#graphql
  fragment Product on Product {
    id
    title
    vendor
    handle
    descriptionHtml
    description
    relatedtitle1: metafield(namespace: "custom", key: "related_title_1") {
      value
    }
    relatedlink1: metafield(namespace: "custom", key: "related_link_1") {
      value
    }
    expiration: metafield(namespace: "custom", key: "expiration_date") {
      value
    }
    options {
      name
      values
    }
    selectedVariant: variantBySelectedOptions(selectedOptions: $selectedOptions) {
      ...ProductVariant
    }
    variants(first: 1) {
      nodes {
        ...ProductVariant
      }
    }
    seo {
      description
      title
    }
  }
  ${PRODUCT_VARIANT_FRAGMENT}
`;

const PRODUCT_QUERY = `#graphql
  query Product(
    $country: CountryCode
    $handle: String!
    $language: LanguageCode
    $selectedOptions: [SelectedOptionInput!]!
  ) @inContext(country: $country, language: $language) {
    product(handle: $handle) {
      ...Product
    }
  }
  ${PRODUCT_FRAGMENT}
`;

const PRODUCT_VARIANTS_FRAGMENT = `#graphql
  fragment ProductVariants on Product {
    variants(first: 250) {
      nodes {
        ...ProductVariant
      }
    }
  }
  ${PRODUCT_VARIANT_FRAGMENT}
`;

const VARIANTS_QUERY = `#graphql
  ${PRODUCT_VARIANTS_FRAGMENT}
  query ProductVariants(
    $country: CountryCode
    $language: LanguageCode
    $handle: String!
  ) @inContext(country: $country, language: $language) {
    product(handle: $handle) {
      ...ProductVariants
    }
  }
`;
