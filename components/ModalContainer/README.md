ModalContainer
---
The ModalContainer hosts the currently active modal (dialog) component, if any has been dispatched.
In case of multiple modal dispatches the container will show one after the other, only one at a time.

The ModalContainer should be placed at a higher level in the hierarchy and since it's connected to the
modals-feature related store state, it will act and show the dispatched modals autonomously.

NOTE: The ModalContainer should always be rendered and since it utilizes a custom template component
like the Dialog, it should be placed inside a template component as well.

## Getting Started

```js
import { ModalContainer } from 'Library/components';
import { Dialog } from 'Templates/components';

<ModalContainer component={Dialog} />
```

## Props

### component (required)

_Type_: `ReactElement|ReactElementType`  

The component that will be shown whenever a modal has been dispatched.

It needs to implement the following props:

```
{string} title - The modal title
{string} children - The modal message
{string} params - The optional translation params for the message
{string} confirmLabel - The modal confirm label
{string} dismissLabel - The modal dismiss label
{Function} onConfirm - The modal confirm callback
{Function} onDismiss - The modal dismiss callback
```

## Dispatching a modal

Modals can be dispatched from within any redux thunk (or whereever you have access to `store.dispatch`).
The dispatcher will return a Promise that will get resolved when the user decided whether
he wants to confirm (or dismiss) the modal.

#### Usage:

##### With .then callback

```js
import { showModal } from 'Library/actions/modals';

const myReduxThunk = () => (dispatch) => {
  dispatch(showModal({
      title: 'My modal title',
      message: 'My important message',
    }))
      .then((confirmed) => {
        console.log('Modal has been confirmed:', confirmed);
      });
};
```

##### With async/await

```js
import { showModal } from 'Library/actions/modals';

const myReduxThunk = () => async (dispatch) => {
  const confirmed = await dispatch(showModal({
      title: 'My modal title',
      message: 'My important message',
  }));
  
  console.log('Modal has been confirmed:', confirmed);
};
```
