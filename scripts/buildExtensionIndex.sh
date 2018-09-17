#!/bin/bash

cd themes/gmd
/bin/mkdir extensions
cd extensions
/bin/touch reducers.js
/bin/cat 'export default null;' > reducers.js
cd ../..
cd ios11
/bin/mkdir extensions
cd extensions
/bin/touch reducers.js
/bin/cat 'export default null;' > reducers.js
cd ../../..