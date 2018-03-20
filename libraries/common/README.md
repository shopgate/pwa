# Common library for the Shopgate Connect PWA

This library handles the basic application environment for a
[PWA](https://developers.google.com/web/progressive-web-apps/) in the **Shopgate Connect**.

It holds everything that is needed for data storage via [Redux](http://redux.js.org),
observable streams via [RxJS](https://github.com/ReactiveX/rxjs), and it serves with a variety of
pre-defined Redux actions, reselect selectors and RxJS streams and subscriptions.

It also provides you a variety of ready to go React Components that you can use inside your
Shopgate Connect PWA theme.

## Installation

```sh
npm i @shopgate/pwa-common --save
```

## What's inside

### Redux

- [Action Creators](./action-creators)
- [Actions](./actions)
- [Reducers](./reducers)

### Reselect

- [Selectors](./selectors)

### React

- [Components](./components)

### RxJS

- [Streams](./streams)
- [Subscriptions](./subscriptions)

### Miscellaneous

- [CSS Reset](./styles)
- [Helper Functions](./helpers)

## About Shopgate

Shopgate is the leading mobile commerce platform.

Shopgate offers everything online retailers need to be successful in mobile. Our leading
software-as-a-service (SaaS) enables online stores to easily create, maintain and optimize native
apps and mobile websites for the iPhone, iPad, Android smartphones and tablets.

## License

Common library for the Shopgate Connect PWA is available under the Apache License, Version 2.0.

See the [LICENSE.md](./LICENSE.md) file for more information.
