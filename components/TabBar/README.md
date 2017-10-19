# TabBar

This component represents the tab bar displayed on the view bottom.

## Usage

The tab bar is already rendered in the `Viewport` component by default.
To control visibility of the `TabBar`, use the corresponding redux store actions
or set the components `isVisible` flag.

If you do not want to control the `TabBar` using redux then a basic
setup would look like this:

```
import TabBar from '@shopgate/theme-ios/components/TabBar';

<TabBar 
  visibleTabs={[{ type: 'myTab', label: 'My tab' }]}
  activeTab="myTab"
/>
```

### Tab bar actions

In its basic configuration the `TabBar` provides a set of predefined actions. These actions include:

Action type | description
--- | ---
`home` | Redirects the user to the home page.
`browse` | Opens the browse page of the store.
`cart` | Opens the users cart. This tab also displays the number of cart items in a badge.
`more` | Presents additional links and actions.
 
#### Custom tab bar actions

The tab bar can be configured to display custom tab actions. To create a custom tab action, create
an action component under the `components` directory of the `TabBar` bundle. You can also duplicate
and edit an existing action component such as the `HomeAction`.

After you created the action component, you need to register it in the `getTabActionComponentForType`
method. Just think of a type name and add a case for it that returns your custom action component 
type.

The following example demonstrates a simple action that shows a custom icon:  

```
import TabBarAction from '../action';

export const MyCustomAction = (props) => (
  <TabBarAction
   {...props}
   icon={MyCustomIcon}
  />
);
```

The registration of this tab action would look like this:

```
// helpers/index.js
import MyCustomAction from '../components/my-custom-action';

...

export const getTabActionComponentForType = (type) => {
  switch (type) {
    ...
    case 'mycustomaction':
      return MyCustomAction;
    ...
  }
};

```

You can now use the custom action:

```
<TabBar visibleTabs={[{ type: 'mycustomaction', label: 'My action' }]} />
```

## Methods and properties

### Properties

#### `isVisible: bool`

This property indicates whether the tab bar should be visible. By default, the value is set to `true`.

#### `visibleTabs: [{ type: string, label: string, [...customProps] }]`

An array of tabs that should be rendered inside the tab bar. Each item must at least provide
a `type` and `label` property. It is also possible to pass custom additional props to the 
corresponding `TabBarAction` component if required.

#### `activeTab: string`

The id of the tab that is currently active. Passing `null` to this property disables the active tab.

# TabBarAction

This component renders a clickable action used in the `TabBar`.

## Methods and properties

### Properties

#### `icon: func|string`

The component type used to display the tab icon.

#### `label: node`

The element to render as label. Can be either text or a react node. If plain text is passed,
the string can be a `I18n` compatible translation string (see the `I18n` component documentation
for further information).

#### `children: node`

The component children. If provided, these will be rendered after the icon and the label section of
the rendered action.

#### `isHighlighted: bool`

Indicates whether this component should be rendered as highlighted.

#### `onClick: func`

An optional callback that can be used as a click event handler.
