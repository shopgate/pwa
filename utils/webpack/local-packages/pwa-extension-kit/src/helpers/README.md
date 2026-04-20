# Shopgate Connect - PWA Extension Kit
## .helpers
### TaggedLogger
This class is handy for printing tagged logs in an extension or module. We encourage to use tagged logs since it helps everyone in case of debugging (also on production) by showing explicitly which extension/module prints the log. 

#### Usage
To instantiate the `TaggedLogger` simply create new by adding a tag name: `new TaggedLogger('MyTagName')`.

`TaggedLogger` is a wrapper around `console` which works both in the node.js and browser environment in a similar way.

Currently supported methods are:
- `.log` - prints decorated `console.log`
- `.warn` - prints decorated `console.warn`
- `.error` - prints decorated `console.error`

#### Example usage:
```jsx
import { TaggedLogger} from '@shopgate-ps/pwa-extension-kit/helpers'

function veryComplexFunctionOrClass() {
  const logger = new TaggedLogger('MyVeryComplexFunctionOrClass');
  
  // Will result in console.log("[MyVeryComplexFunctionOrClass] Starting my complex procedure")
  logger.log('Starting my complex procedure'); 
  
  const response = {foo: 'bar'};
  // Will result in console.error("[MyVeryComplexFunctionOrClass] Unexpected response", response)
  logger.error('Unexpected response', response); 
}
```
