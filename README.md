![](https://travis-ci.org/shopgate/pwa-core.svg?branch=master)
[![GitHub release](https://img.shields.io/github/release/shopgate/pwa-core.svg)]()
[![Coverage Status](https://coveralls.io/repos/github/shopgate/pwa-core/badge.svg?branch=master)](https://coveralls.io/github/shopgate/pwa-core?branch=master)
[![License](https://img.shields.io/badge/License-Apache%202.0-blue.svg)](https://opensource.org/licenses/Apache-2.0)

# Shopgate's PWA core library

This is Shopgate's PWA core library that handles pipeline requests and app commands.
These are needed to run a mobile app in the Shopgate Cloud.

## Installation

```sh
npm i @shopgate/pwa-core --save
```

## What is inside?

### Classes

  * [AppCommand](./classes/AppCommand)
  * [DataRequest](./classes/DataRequest)
  * [Event](./classes/Event)
  * [PipelineManagers](./classes/PipelineManagers)
  * [PipelineRequest](./classes/PipelineRequest)
  * [Request](./classes/Request)
  * [RequestBuffer](./classes/RequestBuffer)
  * [RequestManager](./classes/RequestManager)
  * [WebStorageRequest](./classes/WebStorageRequest)

### Commands

  * [broadcastEvent](./commands/README.md#broadcastevent)
  * [flushTab](./commands/README.md#flushtab)
  * [hideMenuBar](./commands/README.md#hidemenubar)
  * [hideNavigationBar](./commands/README.md#hidenavigationbar)
  * [onload](./commands/README.md#onload)
  * [openCart](./commands/README.md#opencart)
  * [openPage](./commands/README.md#openpage)
  * [openSearch](./commands/README.md#opensearch)
  * [popTabToRoot](./commands/README.md#poptabtoroot)
  * [registerEvents](./commands/README.md#registerevents)
  * [setDebugLoggingEnabled](./commands/README.md#setdebugLoggingenabled)
  * [showNavigationBar](./commands/README.md#shownavigationbar)
  * [showTab](./commands/README.md#showtab)
  * [unifiedTracking](./commands/README.md#unifiedtracking)
  * [webStorage](./commands/README.md#webstorage)

### Helpers

  * [logger](./helpers/README.md#logger)
  * [ajaxUrl](./helpers/README.md#ajaxurl)
  * [hasSGJavaScriptBridge](./helpers/README.md#hassgjavascriptbridge)

## About Shopgate

Shopgate is the leading mobile commerce platform.

Shopgate offers everything online retailers need to be successful in mobile. Our leading software-as-a-service (SaaS) enables online stores to easily create, maintain and optimize native apps and mobile websites for the iPhone, iPad, Android smartphones and tablets.

## License

Shopgate's PWA core library is available under the Apache License, Version 2.0.

See the [LICENSE.md](./LICENSE.md) file for more information.
