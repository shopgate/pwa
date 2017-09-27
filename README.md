# Shopgate's PWA commerce library

[![Travis CI Build](https://travis-ci.org/shopgate/pwa-common-commerce.svg?branch=development)](https://travis-ci.org/shopgate/pwa-common-commerce)
[![GitHub release](https://img.shields.io/github/release/shopgate/pwa-common-commerce.svg)]()
[![Coverage Status](https://coveralls.io/repos/github/shopgate/pwa-common-commerce/badge.svg?branch=development)](https://coveralls.io/github/shopgate/pwa-common-commerce?branch=development)
[![License](https://img.shields.io/badge/License-Apache%202.0-blue.svg)](https://opensource.org/licenses/Apache-2.0)

This library contains commerce modules for a shopping
[PWA](https://developers.google.com/web/progressive-web-apps/) in the **Shopgate Cloud**.

It contains everything necessary for the redux data storage to deal with products, categories,
search results, filters, orders, the cart and the checkout.

## Installation

```
npm i @shopgate/pwa-common-commerce --save
```

Installing this package will automatically bring the
[@shopgate/pwa-core](https://github.com/shopgate/pwa-core) and the
[@shopgate/pwa-common](https://github.com/shopgate/pwa-core) into your project. If you are not
planing to work on these as well, you don't need to install them separately inside your theme.

## What is inside?

  * [Cart](./cart)
  * [Category](./category)
  * [Checkout](./checkout)
  * [Filter](./filter)
  * [Orders](./orders)
  * [Product](./product)
  * [Search](./search)

## About Shopgate

Shopgate is the leading mobile commerce platform.

Shopgate offers everything online retailers need to be successful in mobile. Our leading
software-as-a-service (SaaS) enables online stores to easily create, maintain and optimize native
apps and mobile websites for the iPhone, iPad, Android smartphones and tablets.

## License

Shopgate's PWA commerce library is available under the Apache License, Version 2.0.

See the [LICENSE.md](./LICENSE.md) file for more information.
