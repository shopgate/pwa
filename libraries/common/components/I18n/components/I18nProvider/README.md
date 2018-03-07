# I18nProvider
---
The I18nProvider component provides access to i18n functionalities via `context.i18n()`
to all child components.

## Getting Started
```markup
import { I18nProvider } from 'Library/components';

<I18nProvider
  lang="en_US"
  locales={languageLocales}
>
  <MyAppComponent />
</I18nProvider>
```

## Props

### lang (required)

_Type_: `string`

A string representing the current language code.

E.g. "de_DE", "de_AT", "en_US", ...

###### Usage:

```
<I18nProvider lang="de_DE" ... />
```

### locales (required)

_Type_: `Object`

An object containing the locale information for a specific language.

###### Usage:

```
const locales = {
  en_US: {
    greeting: 'Hello {name}',
  },
};

<I18nProvider locales={locales} ... />
```

### children (optional)

_Type_: `ReactElement`

Only a single child is supported to be passed as `children`.

## Context

### i18n

_Type_: `Function`

A function that returns an object with access to translation functionality
for the currently set language and locales.

The returned object contains the following functions:

- `__(translationKey: string, params: Object)`  
can be used for text translations.

- `_p(price: number, currency: string)`  
can be used for price formatting.

- `_d(timestamp: number, format: string)`  
can be used for date formatting.

- `_t(timestamp: number, format: string)`  
can be used for time formatting.


###### Usage:

```
const MyComponent = (props, context) => {
  const { __ } = context.i18n();
  
  return <div>{__('translationKey')}</div>;
};

<I18nProvider ... />
  <MyComponent />
</I18nProvider>
```
