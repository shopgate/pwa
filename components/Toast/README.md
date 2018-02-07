# Toast
---

Toast components which is responsible for maintaining the toast messages and rendering them by using a provided compoments.

The main idea behind this component is to just provide the logic behind showing and hiding Toasts. Rendering of all elements like text and even the outer container is delegated to components which are given via props.

## Getting Started

```jsx
import { Toast } from 'Library/components/Toast';

<Toast message={Message} container={Container} />
```

When `Toast` is rendered it would always open a `Drawer`. `Drawer` would contain `Container` and rendered text in a `Message` component.

The end result would be similar to this:
```jsx
<Toast>
    <div aria-live="polite" aria-relevant="additions">
        <Drawer>
            <Container>
                <Message text={'string'} />
            </Container>
        </Drawer>
    </div>
</Toast>
``` 

When the message times out, `Drawer` is closed and message is removed from redux store.

If there are more messages in redux store, the messages would be shown one by one consecutively.

## How to show a toast message.
When `Toast` component is rendered in the app, it waits until there's a message added to a redux store.
In order to add this message, simply use an action available in `Library/actions/toast/createToast`.

## How to remove a toast message.
Toast messages should not be removed from the outside. Removed message which is a subject of current visible toast message would suddenly disappear. This component handles messages removal in a clean way.

## How to show action with a callback
Toast messages can have single action button with a callback. When the button is clicked, callback would be executed and toast would hide.

To show a message with action button simply use an action available in `Library/actions/toast/createToast` with options as follows:
```js
createToast({
  message: 'Example message',
  action: 'Click me!',
  actionOnClick: () => alert('Clicked!')
});
```
## Styling
Styling is mostly done by the `.message` and `.container` props. You can however pass `.className` prop which would be used
by a `Drawer`.

## Props

### message (required)

_Type_: `React.Component`

Component which would render the message text. It must accept and render `.text` prop. 

### container (required)

_Type_: `React.Component`

Component which would render the `Message` component. The only requirement to this component is that it has to render children.

### className (optional)

_Type_: `string`

Class name which is passed to a `Drawer` component and affect the `Drawer` styling.

### onClose (optional)

_Type_: `function`

Function which would be called every time the Drawer will close. 

## Accessibility
The `Toast` component is wrapped with a `aria-live` container. It tells the screen readers to read every incoming message in a `polite` mode.

