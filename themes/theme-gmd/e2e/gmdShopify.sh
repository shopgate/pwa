#!/bin/bash

spec_string="themes/theme-gmd/e2e/integration/consistency/CartPage.js,\
themes/theme-gmd/e2e/integration/consistency/CategoryPage.js,\
themes/theme-gmd/e2e/integration/consistency/FavoritesPage.js,\
themes/theme-gmd/e2e/integration/consistency/FilterPage.js,\
themes/theme-gmd/e2e/integration/consistency/LoginPage.js,\
themes/theme-gmd/e2e/integration/consistency/NavDrawer.js,\
themes/theme-gmd/e2e/integration/consistency/ProductPage.js,\
themes/theme-gmd/e2e/integration/consistency/ReviewsPage.js,\
themes/theme-gmd/e2e/integration/consistency/SearchPage.js,\
themes/theme-gmd/e2e/integration/consistency/StartPage.js,\
themes/theme-gmd/e2e/integration/functional/CartPage.js,\
themes/theme-gmd/e2e/integration/functional/CategoryPage.js,\
themes/theme-gmd/e2e/integration/functional/FavoritesPage.js,\
themes/theme-gmd/e2e/integration/functional/FilterPage.js,\
themes/theme-gmd/e2e/integration/functional/LoginPage.js,\
themes/theme-gmd/e2e/integration/functional/ProductPage.js,\
themes/theme-gmd/e2e/integration/functional/SearchPage.js,\
themes/theme-gmd/e2e/integration/functional/StartPage.js"

cypress run  \
--project './themes/theme-gmd/e2e/'  \
--spec "$spec_string" \
--reporter junit
