# Fix color output until TravisCI fixes https://github.com/travis-ci/travis-ci/issues/7967
export FORCE_COLOR = true

NPM_PACKAGES = commerce common core tracking tracking-core webcheckout

release:
		make clean
		make build
		make pre-publish
		make clean-build

clean:
		find . -name "*error.log" -type f -delete
		find . -name "*debug.log" -type f -delete

build:
		$(foreach package, $(NPM_PACKAGES), \
				$(call build-packages, $(package)))

pre-publish:
		lerna publish --skip-npm --skip-git

clean-build:
		$(foreach package, $(NPM_PACKAGES), \
				$(call clean-build-packages, $(package)))

define build-packages
		BABEL_ENV=production ./node_modules/.bin/babel ./libraries/$(strip $(1))/ --out-dir ./libraries/$(strip $(1))/dist --ignore tests,spec.js,spec.jsx,__snapshots__,.eslintrc.js,jest.config.js,dist,coverage,node_modules

endef

define clean-build-packages
		rm -rf -f ./libraries/$(strip $(1))/dist

endef
