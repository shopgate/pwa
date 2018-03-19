# Fix color output until TravisCI fixes https://github.com/travis-ci/travis-ci/issues/7967
export FORCE_COLOR = true

NPM_PACKAGES = commerce common core tracking tracking-core webcheckout
EXTENSIONS = @shopgate-product-reviews @shopgate-tracking-ga-native
THEMES = gmd ios11

release:
		make clean
		make pre-publish
		make bump-extensions
		make bump-themes
		make build-libraries
		make git-publish
		make npm-publish
		make clean-build

# Clean the repository before starting a release.
clean:
		find . -name "*error.log" -type f -delete
		find . -name "*debug.log" -type f -delete
		lerna clean --yes
		rm -rf ./node_modules/
		lerna bootstrap

# Lerna change all the version numbers.
pre-publish:
		lerna publish --skip-npm --skip-git

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
		$(foreach package, $(NPM_PACKAGES), $(call npm-release, $(package), $(SUBSTR)))

# Clean the builds.
clean-build:
		$(foreach package, $(NPM_PACKAGES), $(call clean-build-packages, $(package)))


# DEFINITIONS


define build-packages
		BABEL_ENV=production ./node_modules/.bin/babel ./libraries/$(strip $(1))/ --out-dir ./libraries/$(strip $(1))/dist --ignore tests,spec.js,spec.jsx,__snapshots__,.eslintrc.js,jest.config.js,dist,coverage,node_modules
		cp ./libraries/$(strip $(1))/package.json ./libraries/$(strip $(1))/dist/
		cp ./libraries/$(strip $(1))/README.md ./libraries/$(strip $(1))/dist/
		cp ./libraries/$(strip $(1))/LICENSE.md ./libraries/$(strip $(1))/dist/

endef

define bump-extension-versions
		PACKAGE_VERSION=$$(cat ./lerna.json | grep version | head -1 | awk -F: '{ print $$2 }' | sed 's/[\",]//g' | tr -d '[[:space:]]') && node ./scripts/bump-extension.js --file="./extensions/$(strip $(1))/extension-config.json" --v="$$PACKAGE_VERSION" && cd ./extensions/$(strip $(1))/ && git add -A && git commit -m "$$PACKAGE_VERSION" && git push

endef

define bump-theme-versions
		PACKAGE_VERSION=$$(cat ./lerna.json | grep version | head -1 | awk -F: '{ print $$2 }' | sed 's/[\",]//g' | tr -d '[[:space:]]') && node ./scripts/bump-extension.js --file="./themes/$(strip $(1))/extension-config.json" --v="$$PACKAGE_VERSION" && cd ./themes/$(strip $(1))/ && git add -A && git commit -m "$$PACKAGE_VERSION" && git push

endef

define push-main
		PACKAGE_VERSION=$$(cat ./lerna.json | grep version | head -1 | awk -F: '{ print $$2 }' | sed 's/[\",]//g' | tr -d '[[:space:]]') && git add -A && git commit -m "$$PACKAGE_VERSION" && git push

endef

define git-tags
		VERSION=$$(cat ./lerna.json | grep version | head -1 | awk -F: '{ print $$2 }' | sed 's/[\",]//g' | tr -d '[[:space:]]') && cd $(1) && git tag v$$VERSION -m "v$$VERSION" && git push --tags

endef

define npm-release
		@if [ "$(strip $(2))" == "beta" ]; \
			then npm publish ./libraries/$(strip $(1))/dist/ --access public --tag beta; \
			else npm publish ./libraries/$(strip $(1))/dist/ --access public; \
		fi;

endef

define clean-build-packages
		rm -rf -f ./libraries/$(strip $(1))/dist

endef
