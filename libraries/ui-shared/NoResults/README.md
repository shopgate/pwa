# NoResults
---

The NoResults component can be used for situations where an arbitrary query didn't have any results. It will display a nice icon and an additional message to inform the user about the situation.

## Getting Started

```jsx
import NoResults from '../NoResults';

<NoResults
    headlineText="No results"
    bodyText="Did not find any results."
/>
```

Or, to use the component with I18n translations:

```jsx
<NoResults
    headlineText="my.noresults.translation.headline"
    bodyText="my.noresults.translation.body"
    foo={bar}
/>
```

`foo` can now be used as a translation variable inside both `headlineText` and `bodyText`.

## Props

### headlineText

_Type_: `string`  

The text that should be displayed as the headline of the no results page.

This could either be a key provided for the translation system (see the `I18n` component for further description) or a simple string.

Any additional props passed to the `NoResults` component will be available as translation keys.

###### Usage:

```jsx
<NoResults
    headlineText="My headline text displays some text."
/>
```

The same example with I18n translation key:

```jsx
<NoResults
    headlineText="my.noresults.translation.headline"
    myTranslationVar="some text"
/>
```

(Assuming `my.noresults.translation.headline` is set to `'My headline text displays {myTranslationVar}.'`).

### bodyText

_Type_: `string`  

The text that should be displayed in the body of the no results page.

This could either be a key provided for the translation system (see the `I18n` component for further description)
or a simple string.

Any additional props passed to the `NoResults` component will be available as translation keys.

###### Usage:

```jsx
<NoResults
    bodyText="My results page just displays this message."
/>
```

The same example with I18n translation key:

```jsx
<NoResults
    bodyText="my.noresults.translation.body"
    myTranslationVar="this message"
/>
```

(Assuming `my.noresults.translation.body` is set to `'My results page just displays {myTranslationVar}.'`).
