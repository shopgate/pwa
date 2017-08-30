Dialog
-----------

The `Dialog` component renders a modal dialog and blocks any user
input until it has been closed again.

It is advised not to use `Dialog` manually, but rather dispatch
a `showModal` action along with the desired modal type and custom parameters.

The dialog may either show a generic information consisting of title and message text
or use a custom component to render its contents. Because of this rendering of dialogs 
is split into various components. The `Dialog` component by itself is not responsible 
for rendering contents, but chooses an appropriate component based on the modal 
parameters the `showModal` action receives when dispatched.

> **Note:**  Custom dialogs should use the `BasicDialog` component for a consistent
look and feel. 

## Quick start

#### Showing a text message

Do display a dialog a `showModal` redux action should be dispatched:

```
dispatch( showModal({ custom modal parameters }) );
```

To display a simple message it is sufficient to add a `message` and `title`
 parameter:
 
```
store.dispatch( showModal({ 
  title: 'My modal dialog',
  message: 'My modal message',
  confirm: null, // Do not display a confirm action.
  dismiss: 'Exit dialog' // Display a dismiss action with a custom label.
}) );
```

#### Showing a custom dialog

To show a custom dialog the `type` parameter has to be passed when dispatching
 the `showTab` action. For example, to display a pipeline error dialog you would 
 dispatch the action like this:
 
```
import { MODAL_PIPELINE_ERROR } from 'Library/constants/ModalTypes';

store.dispatch( showModal({ 
  type: MODAL_PIPELINE_ERROR,
  params: { ... } // Typically, a custom dialog requires additional parameters.
}) );
```

As shown above, custom dialogs commonly require additional parameters to 
render their contents. You can pass those parameters by using the `params`
property.

#### Creating custom dialogs

To create a custom dialog, you first need to implement a component that uses
`BasicDialog` to render its contents and place it in 
`Templates/components/dialog/your-custom-dialog/`. You may prefer to choose any other
 location, but for this example we'll use relative paths that match the above directory.

In the very familiar _Hello World_ scenario the component would look like this:

```
import { BasicDialog } from '../BasicDialog';

export const HelloWorldDialog = props => (
  <BasicDialog title="Hello World" actions={props.actions}>
    Hello, World!
  </BasicDialog>
);
```

Next, the dialog needs to be handled in `DialogTypes.js`:

```
import HelloWorldDialog from '../hello-world-dialog';

// Add all the custom template dialog types here.
...
export const DIALOG_HELLO_WORLD = 'DIALOG_HELLO_WORLD';
...
// Add the custom template dialogs here, with their corresponding type as key.
export default {
  ...
  [DIALOG_HELLO_WORLD]: HelloWorldDialog,
  ...
};
```
 
Now the `Hello World` dialog is ready to be used like any other custom dialog:

```
import DialogTypes from 'Templates/components/dialog/DialogTypes';
...
store.dispatch( showModal({ 
  type: DialogTypes.DIALOG_HELLO_WORLD
}) );
```

## Props

### modal

_Type_: `Object`<br>

The custom modal parameters passed to a dispatched `showModal` redux action:

##### modal.title

_Type_: `string`<br>

The title of the dialog. This should always be passed when dispatching the action.

##### modal.message (optional)

_Type_: `string`<br>

The text message to display. It is up to the implementation of any custom dialog
type if it requires a message body, so this may or may not be used by the dialog
that is about to be displayed. 

##### modal.params (optional)

_Type_: `Object`<br>

A custom dialog may require additional parameters to render their contents. 
You can pass those parameters by using the `params` property.

### onConfirm (optional)

_Type_: `function`<br>

A callback that is triggerd when the confirm action of the the dialog has been
submitted.

### onDismiss (optional)

_Type_: `function`<br>

A callback that is triggerd when the dismiss action of the the dialog has been
submitted.

