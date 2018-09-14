# Fix color output until TravisCI fixes https://github.com/travis-ci/travis-ci/issues/7967
export FORCE_COLOR = true

NPM_PACKAGES = commerce common core tracking tracking-core webcheckout ui-ios ui-material ui-shared
EXTENSIONS = @shopgate-product-reviews @shopgate-tracking-ga-native @shopgate-user-privacy
UTILS = eslint-config unit-tests e2e
THEMES = gmd ios11
REPO_VERSION = ''

setup:
		sgconnect init
		git submodule init
		git submodule update
		make clean

checkout-develop:
		git checkout develop
		git submodule foreach --recursive git checkout develop
		git fetch --all
		git pull
		git submodule foreach --recursive git pull
		make clean

release:
		make pre-release
		make clean
		make pre-publish
		make bump-extensions
		make bump-themes
		make build-libraries
		make npm-publish
		make git-publish
		make clean-build
		make post-release
		@echo " "
		@echo " "
		@echo "Done releasing!"
		@echo " "
		@echo " "

pre-release:
ifneq ($(REPO_VERSION), '')
		@echo " "
		@echo "Releasing version $(REPO_VERSION)"
		@echo " "
		$(eval SUBSTR=$(findstring beta, $(REPO_VERSION)))
		$(call prepare-release)
		$(call merge-master, $(SUBSTR))
else
		@echo " "
		@echo "Peforming manual release process!!"
		@echo " "
endif

# Clean the repository before starting a release.
clean:
		find . -name "*error.log" -type f -delete
		find . -name "*debug.log" -type f -delete
		make clean-build
		lerna clean --yes
		rm -f ./.git/hooks/pre-commit
		rm -rf ./node_modules/
		rm -rf ./.cache-loader/
		lerna bootstrap

# Lerna change all the version numbers.
pre-publish:
ifneq ($(REPO_VERSION), '')
		@echo " "
		@echo "$(strip $(REPO_VERSION))"
		@echo " "
		lerna publish --skip-npm --skip-git --repo-version $(strip $(REPO_VERSION)) --force-publish --yes --exact
else
		lerna publish --skip-npm --skip-git --force-publish --exact
endif

# Change the version in the extensions extension-config.json
bump-extensions:
		$(foreach extension, $(EXTENSIONS), $(call bump-extension-versions, $(extension)))

# Change the version in the thems extension-config.json
bump-themes:
		$(foreach theme, $(THEMES), $(call bump-theme-versions, $(theme)))

# Pre build the libraries.
build-libraries:
		$(foreach package, $(NPM_PACKAGES), $(call build-packages, $(package)))

# Create git tags and push everything.
git-publish:
		$(call push-main)
		$(foreach theme, $(THEMES), $(call git-tags, ./themes/$(theme)/))
		$(foreach extension, $(EXTENSIONS), $(call git-tags, ./extensions/$(extension)/))
		$(call git-tags, ./)

# Publish to npm.
npm-publish:
		$(eval VERSION=$(shell cat ./lerna.json | grep version | head -1 | awk -F: '{ print $$2 }' | sed 's/[\",]//g' | tr -d '[[:space:]]'))
		$(eval SUBSTR=$(findstring beta, $(VERSION)))
		$(foreach package, $(NPM_PACKAGES), $(call npm-release-libraries, $(package), $(SUBSTR)))
		$(foreach package, $(UTILS), $(call npm-release-utils, $(package), $(SUBSTR)))

# Clean the builds.
clean-build:
		$(foreach package, $(NPM_PACKAGES), $(call clean-build-packages, $(package)))

post-release:
ifneq ($(REPO_VERSION), '')
		@echo " "
		@echo "Finishing release for version $(REPO_VERSION)"
		@echo " "
		$(eval SUBSTR=$(findstring beta, $(REPO_VERSION)))
		$(call merge-develop, $(SUBSTR))
endif

e2e-gmd:
		cd themes/gmd && yarn run e2e

e2e-ios11:
		cd themes/ios11 && yarn run e2e

e2e-checkout:
		cd themes/gmd && yarn run e2e:checkout

# DEFINITIONS

define prepare-release
		@echo " "
		@echo "Checking out develop branches ... "
		@echo " "
		git checkout develop
		git submodule foreach --recursive git checkout develop
		git fetch --all && git submodule foreach --recursive git fetch --all
		git pull && git submodule foreach --recursive git pull

endef

define merge-master
		@if [ "$(strip $(1))" != "beta" ]; \
			then \
				echo " "; \
				echo "Merging into master ... "; \
				echo " "; \
				git checkout master; \
				git submodule foreach --recursive git checkout master; \
				git merge develop && git push; \
				git submodule foreach --recursive git merge develop && git submodule foreach --recursive git push; \
			else \
				echo " "; \
				echo "Not using master: beta release!"; \
				echo " "; \
		fi;

endef

define merge-develop
		@if [ "$(strip $(1))" != "beta" ]; \
			then \
				echo " "; \
				echo "Merging back into develop ... "; \
				echo " "; \
				git checkout develop; \
				git submodule foreach --recursive git checkout develop; \
				git merge master && git push; \
				git submodule foreach --recursive git merge master && git submodule foreach --recursive git push; \
		fi;

endef

define build-packages
		BABEL_ENV=production ./node_modules/.bin/babel ./libraries/$(strip $(1))/ --out-dir ./libraries/$(strip $(1))/dist --ignore tests,spec.js,spec.jsx,__snapshots__,.eslintrc.js,jest.config.js,dist,coverage,node_modules
		cp ./libraries/$(strip $(1))/package.json ./libraries/$(strip $(1))/dist/
		cp ./libraries/$(strip $(1))/README.md ./libraries/$(strip $(1))/dist/
		cp ./libraries/$(strip $(1))/LICENSE.md ./libraries/$(strip $(1))/dist/

endef

define bump-extension-versions
		PACKAGE_VERSION=$$(cat ./lerna.json | grep version | head -1 | awk -F: '{ print $$2 }' | sed 's/[\",]//g' | tr -d '[[:space:]]') && node ./scripts/bump-extension.js --file="./extensions/$(strip $(1))/extension-config.json" --v="$$PACKAGE_VERSION" && cd ./extensions/$(strip $(1))/ && git add -A && git commit -m "$$PACKAGE_VERSION"

endef

define bump-theme-versions
		PACKAGE_VERSION=$$(cat ./lerna.json | grep version | head -1 | awk -F: '{ print $$2 }' | sed 's/[\",]//g' | tr -d '[[:space:]]') && node ./scripts/bump-extension.js --file="./themes/$(strip $(1))/extension-config.json" --v="$$PACKAGE_VERSION" && cd ./themes/$(strip $(1))/ && git add -A && git commit -m "$$PACKAGE_VERSION"

endef

define push-main
		PACKAGE_VERSION=$$(cat ./lerna.json | grep version | head -1 | awk -F: '{ print $$2 }' | sed 's/[\",]//g' | tr -d '[[:space:]]') && git add -A && git commit -m "$$PACKAGE_VERSION" && git push

endef

define git-tags
		VERSION=$$(cat ./lerna.json | grep version | head -1 | awk -F: '{ print $$2 }' | sed 's/[\",]//g' | tr -d '[[:space:]]') && cd $(1) && git tag v$$VERSION -m "v$$VERSION" && git push && git push --tags

endef

define npm-release-libraries
		@if [ "$(strip $(2))" == "beta" ]; \
			then npm publish ./libraries/$(strip $(1))/dist/ --access public --tag beta; \
			else npm publish ./libraries/$(strip $(1))/dist/ --access public; \
		fi;

endef

define npm-release-utils
		@if [ "$(strip $(2))" == "beta" ]; \
			then npm publish ./utils/$(strip $(1))/ --access public --tag beta; \
			else npm publish ./utils/$(strip $(1))/ --access public; \
		fi;

endef

define clean-build-packages
		rm -rf -f ./libraries/$(strip $(1))/dist

endef

define run-libraries-coverage
		cd ./libraries/$(strip $(1))/ && yarn run cover

endef
