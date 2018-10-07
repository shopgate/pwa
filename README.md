# Shopgate Connect PWA

[![Build Status](https://travis-ci.org/shopgate/pwa.svg?branch=develop)](https://travis-ci.org/shopgate/pwa)
[![Coverage Status](https://coveralls.io/repos/github/shopgate/pwa/badge.svg?branch=develop)](https://coveralls.io/github/shopgate/pwa?branch=develop)
[![GitHub (pre-)release](https://img.shields.io/github/release/shopgate/pwa/all.svg)](https://github.com/shopgate/pwa/releases)
[![lerna](https://img.shields.io/badge/maintained%20with-lerna-cc00ff.svg)](https://lernajs.io/)
[![License](https://img.shields.io/badge/License-Apache%202.0-blue.svg)](https://opensource.org/licenses/Apache-2.0)

## Setting up new core extensions

To set up a new core extension you need to perform the following steps:
* Add an exception into the `.gitignore` file as it was done with `@shopgate-product-reviews`.
* Open the file `repos.json` and add the repository to include there as a subtree.
* Add the new extensions into the `Makefile` as an additional value for the `EXTENSIONS` variable.
  * If it's not an extension, then use the apropriate variable in the `Makefile`.

## About Shopgate

Shopgate is the leading mobile commerce platform.

Shopgate offers everything online retailers need to be successful in mobile. Our leading
software-as-a-service (SaaS) enables online stores to easily create, maintain and optimize
native apps and mobile websites for the iPhone, iPad, Android smartphones and tablets.

## License

Shopgate's GMD theme is available under the Apache License, Version 2.0.

See the [LICENSE.md](./LICENSE.md) file for more information.
