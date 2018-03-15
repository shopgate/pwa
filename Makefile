# Fix color output until TravisCI fixes https://github.com/travis-ci/travis-ci/issues/7967
export FORCE_COLOR = true

NPM_PACKAGES = commerce common core tracking tracking-core webcheckout
EXTENSIONS = @shopgate-product-reviews @shopgate-tracking-ga-native
THEMES = gmd ios11

release:
		make clean
		make pre-publish
		make build-libraries
		make bump-extensions
		make bump-themes
		make git-publish
		make npm-publish
		make clean-build

clean:
		find . -name "*error.log" -type f -delete
		find . -name "*debug.log" -type f -delete

pre-publish:
		lerna publish --skip-npm --skip-git

build-libraries:
		$(foreach package, $(NPM_PACKAGES), $(call build-packages, $(package)))

bump-extensions:
		$(foreach extension, $(EXTENSIONS), $(call bump-extension-versions, $(extension)))

bump-themes:
		$(foreach theme, $(THEMES), $(call bump-theme-versions, $(theme)))

clean-build:
		$(foreach package, $(NPM_PACKAGES), $(call clean-build-packages, $(package)))

git-publish:
		$(foreach theme, $(THEMES), $(call git-tags, ./themes/$(theme)/))
		$(foreach extension, $(EXTENSIONS), $(call git-tags, ./extensions/$(extension)/))
		$(call git-tags, ./)

npm-publish:
		$(foreach package, $(NPM_PACKAGES), $(call npm-release, $(package)))

define build-packages
		BABEL_ENV=production ./node_modules/.bin/babel ./libraries/$(strip $(1))/ --out-dir ./libraries/$(strip $(1))/dist --ignore tests,spec.js,spec.jsx,__snapshots__,.eslintrc.js,jest.config.js,dist,coverage,node_modules
		cp ./libraries/$(strip $(1))/package.json ./libraries/$(strip $(1))/dist/
		cp ./libraries/$(strip $(1))/README.md ./libraries/$(strip $(1))/dist/
		cp ./libraries/$(strip $(1))/LICENSE.md ./libraries/$(strip $(1))/dist/

endef

define clean-build-packages
		rm -rf -f ./libraries/$(strip $(1))/dist

endef

define bump-extension-versions
		PACKAGE_VERSION=$$(cat ./extensions/$(strip $(1))/frontend/package.json | grep version | head -1 | awk -F: '{ print $$2 }' | sed 's/[\",]//g' | tr -d '[[:space:]]') && ./node_modules/.bin/bump ./extensions/$(strip $(1))/extension-config.json -v $$PACKAGE_VERSION -y && cd ./extensions/$(strip $(1)) && git add -A && git commit -m "$$PACKAGE_VERSION" && git push
endef

define bump-theme-versions
		PACKAGE_VERSION=$$(cat ./themes/$(strip $(1))/package.json | grep version | head -1 | awk -F: '{ print $$2 }' | sed 's/[\",]//g' | tr -d '[[:space:]]') && ./node_modules/.bin/bump ./themes/$(strip $(1))/extension-config.json -v $$PACKAGE_VERSION -y && ./node_modules/.bin/bump ./themes/$(strip $(1))/npm-shrinkwrap.json -v $$PACKAGE_VERSION -y && cd ./themes/$(strip $(1))/ && git add -A && git commit -m "$$PACKAGE_VERSION" && git push

endef

define git-tags
		VERSION=$$(cat ./lerna.json | grep version | head -1 | awk -F: '{ print $$2 }' | sed 's/[\",]//g' | tr -d '[[:space:]]') && cd $(1) && git tag v$$VERSION -m "v$$VERSION" && git push --tags

endef

define npm-release
		npm publish ./libraries/$(strip $(1))/dist/ --access public

endef
