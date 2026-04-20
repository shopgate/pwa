# Shopgate Connect - PWA Extension Kit
## .env - environment helpers
### isIOSTheme
This function checks the extension runs in an [ios theme](https://github.com/shopgate/theme-ios11).
Check if performed during the app lifetime. Every time the function is called.

#### Purpose
Most Shopgate apps are deployed with gmd and ios templates. Even though both templates are quite similar, there are some rare cases when it's needed to adjust your component in order to achieve better user experience, or avoid some pitfalls.

#### Not intended usage. When NOT to use it
It DOES NOT tests against the navigator / User Agent. Some Shopgate apps are configured in a way that in both iOS and Android same template is used.

It should not be used to obtain if current platform is either iOS or Android. To check what is the current platform please use `@shopgate/pwa-common/selectors/client` package.

#### Example usage:
```jsx
import isIOSTheme from '@shopgate-ps/pwa-extension-kit/env/helpers/isIOSTheme';
import ButtonOptimisedForIOS from '../components/iosButton';
import ButtonOptimisedForGMD from '../components/gmdButton';

function renderButton() {
  if (isIOSTheme()) {
    return <ButtonOptimisedForIOS />;
  }
  
  return <ButtonOptimisedForGMD />;
}
```
