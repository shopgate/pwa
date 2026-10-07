<p align="center">
  <a href="https://www.shopgate.com/en/solutions/engage-mobile-app/" rel="noopener" target="_blank">
    <img width="250" src="https://d2ytbdjodkazy3.cloudfront.net/wp-content/uploads/2019/01/Logo_engage.svg.gzip" alt="Shopgate Logo">
  </a>
</p>

<h1 align="center">Shopgate's ENGAGE</h1>

<div align="center">

[![GitHub (pre-)release](https://img.shields.io/github/release/shopgate/pwa/all.svg)](https://github.com/shopgate/pwa/releases)
[![License](https://img.shields.io/badge/License-Apache%202.0-blue.svg)](https://opensource.org/licenses/Apache-2.0)

</div>

## Documentation

Check out our [documentation website](https://developer.shopgate.com/guides)!

## PWA 7 specialities
PWA 7 supports a special mode to run in browsers instead of the native app. Pipeline requests (that are an app concept originally) are transformed to AJAX requests which are send to a special proxy which is called "web bridge".

To enable the bridge, frontend needs to be started with a special environment parameter.

```shell
WEB_BRIDGE=1 sgconnect frontend start
```

## Type checking during development
The development server transpiles TypeScript without checking the types. To see type errors while developing, start the frontend with the `TYPE_CHECK` environment parameter.

```shell
TYPE_CHECK=1 sgconnect frontend start
```

The theme and every attached extension with a `frontend/tsconfig.json` are then checked on each change, with the TypeScript version that is installed there. The errors are printed to the terminal and don't stop the build.

To also see the errors in the browser, use the value `overlay`. An error then covers the app until it is fixed or the overlay is closed.

```shell
TYPE_CHECK=overlay sgconnect frontend start
```

## About Shopgate

Shopgate is the leading mobile commerce platform.

Shopgate offers everything online retailers need to be successful in mobile. Our leading
software-as-a-service (SaaS) enables online stores to easily create, maintain and optimize
native apps and mobile websites for the iPhone, iPad, Android smartphones and tablets.

## License

Shopgate's ENGAGE is available under the Apache License, Version 2.0.

See the [LICENSE.md](./LICENSE.md) file for more information.
