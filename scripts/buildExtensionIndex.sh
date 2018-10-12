#!/bin/bash

cd themes/theme-gmd
/bin/mkdir extensions
cd extensions
/bin/touch reducers.js
/bin/cat 'export default null;' > reducers.js
cd ../..
cd theme-ios11
/bin/mkdir extensions
cd extensions
/bin/touch reducers.js
/bin/cat 'export default null;' > reducers.js
cd ../../..