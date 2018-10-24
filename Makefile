# Fix color output until TravisCI fixes https://github.com/travis-ci/travis-ci/issues/7967
export FORCE_COLOR = true

#test

LIBRARIES = commerce common core tracking tracking-core webcheckout ui-ios ui-material ui-shared
EXTENSIONS = @shopgate-product-reviews @shopgate-tracking-ga-native
UTILS = eslint-config unit-tests e2e benchmark
THEMES = theme-gmd theme-ios11

GITHUB_AUTH_KEY =
GITHUB_AUTH_TOKEN =

# deprecated; use RELEASE_VERSION
REPO_VERSION =

RELEASE_VERSION = $(strip $(REPO_VERSION))
# Branch name to start the release from; "develop" by default
BRANCH_NAME = develop

# Make sure the release name starts with a "v"
RELEASE_NAME = v$(patsubst v%,%, $(strip $(RELEASE_VERSION)))

# Set up BETA flag to be "true" or "false"
BETA = $(findstring beta, $(RELEASE_NAME))
ifeq ("$(BETA)", "beta")
	BETA = "true"
else
	BETA = "false"
endif

# This causes the Github-API to create draft releases only, without creating tags
DRAFT_RELEASE = true

setup:
		sgconnect init
		make clean

checkout-develop:
		git checkout origin/develop
		git fetch --all
		git pull origin develop
		make clean



init:
		git submodule deinit --all
		rm -rf .git/modules/*



add-remotes:
		node ./scripts/add-remotes.js 2> /dev/null # ignore stderr output here



sanity-check:
		@if [ "$(RELEASE_VERSION)" = "" ]; then \
			echo "ERROR:  No VERSION was provided!" && false; \
		fi;
		@if [ "$(BRANCH_NAME)" = "" ]; then \
			echo "ERROR:  No BRANCH was provided!" && false; \
		fi;
		@if [ "$(BETA)" != "true" ] && [ "$(BRANCH_NAME)" != "develop" ]; then \
			echo "ERROR: Stable releases can only be created on 'develop' branch" && false; \
		fi;
		@echo "Sanity check OK!"



release:
		$(call setup-release)
		$(call update-versions)
		$(call build-library-packages)
		$(call publish-npm-packages)
		make publish-to-github
		#(call finalize-release)



# Clean the repository before starting a release.
clean:
		make init
		find . -name "*error.log" -type f -delete
		find . -name "*debug.log" -type f -delete
		lerna clean --yes
		rm -f ./.git/hooks/pre-commit
		rm -rf ./node_modules/
		node ./scripts/init-subtrees.js # try to set up new git subtree entries.
		rm -rf ./.cache-loader/
		lerna bootstrap



clean-git:
		git remote prune origin
		git branch -vv | grep 'origin/.*: gone]' | awk '{print $1}' | xargs git branch -d



e2e-gmd:
		cd themes/theme-gmd && yarn run e2e

e2e-ios11:
		cd themes/theme-ios11 && yarn run e2e

e2e-checkout:
		cd themes/theme-gmd && yarn run e2e:checkout

e2e-user:
		cd themes/theme-gmd && yarn run e2e:user



# SETUP-RELEASE ####################################################################################

define setup-release
		# Perform "sanity check" before doing anything else
		make sanity-check

		@echo "======================================================================"
		@echo "| Releasing version $(RELEASE_VERSION) on branch '$(BRANCH_NAME)'"
		@echo "======================================================================"

		# Remotes are required to push subtrees later
		make add-remotes

		# Create a release branch to work with
		$(call create-pwa-release-branch)

		# Set up dependencies (lerna) and subtrees
		make clean

endef



define create-pwa-release-branch
		@echo "======================================================================"
		@echo "| Checking out '$(BRANCH_NAME)' branch ... "
		@echo "======================================================================"
		git checkout "origin/$(BRANCH_NAME)"
		git fetch --all
		git pull origin "$(BRANCH_NAME)"
		git checkout -b "releases/$(RELEASE_NAME)"

endef



# UPDATE-VERSIONS ##################################################################################

define update-versions
		$(call update-pwa-versions)
		$(call update-extension-versions)
		$(call update-theme-versions)

endef

# Changes all the version numbers using lerna
define update-pwa-versions
		@echo "======================================================================"
		@echo "| Updating pwa versions to '$(RELEASE_VERSION))'"
		@echo "======================================================================"
		lerna publish --skip-npm --skip-git --repo-version $(RELEASE_VERSION) --force-publish --yes --exact

		# Checking version
		@if [ "$$(cat ./lerna.json | grep version | head -1 | awk -F: '{ print $$2 }' | sed 's/[\",]//g' | tr -d '[[:space:]]')" != "$(RELEASE_VERSION)" ]; \
			then echo "ERROR: Package version mismatch, please theck your given version ('$$(cat ./lerna.json | grep version | head -1 | awk -F: '{ print $$2 }' | sed 's/[\",]//g' | tr -d '[[:space:]]')' != '$(RELEASE_VERSION)')" && false; \
			else echo "Version check OK!"; \
		fi;
endef

# Change the version in the extension-config.json file of all extensions
define update-extension-versions
		@echo "======================================================================"
		@echo "| Updating extension versions to '$(RELEASE_VERSION))'"
		@echo "======================================================================"
		$(foreach extension, $(EXTENSIONS), $(call update-extension-version, $(extension)))

endef

define update-extension-version
		node ./scripts/bump-extension.js --file="./extensions/$(strip $(1))/extension-config.json" --v="$(RELEASE_VERSION)" && git add -A && git commit -m "Updated extension '$(strip $(1))' version to '$(RELEASE_VERSION)'"

endef

# Change the version in the extension-config.json files of all themes
define update-theme-versions
		@echo "======================================================================"
		@echo "| Updating theme versions to '$(RELEASE_VERSION))'"
		@echo "======================================================================"
		$(foreach theme, $(THEMES), $(call update-theme-version, $(theme)))

endef

define update-theme-version
		node ./scripts/bump-extension.js --file="./themes/$(strip $(1))/extension-config.json" --v="$(RELEASE_VERSION)" && git add -A && git commit -m "Updated theme '$(strip $(1))' version to '$(RELEASE_VERSION)'"

endef



# UPDATE-LIBRARY-PACKAGES ##########################################################################

define build-library-packages
		@echo "======================================================================"
		@echo "| Building library npm packages"
		@echo "======================================================================"
		$(foreach library, $(LIBRARIES), $(call build-library, $(library)))

endef

define build-library
		BABEL_ENV=production ./node_modules/.bin/babel ./libraries/$(strip $(1))/ --out-dir ./libraries/$(strip $(1))/dist --ignore tests,spec.js,spec.jsx,__snapshots__,.eslintrc.js,jest.config.js,dist,coverage,node_modules
		cp ./libraries/$(strip $(1))/package.json ./libraries/$(strip $(1))/dist/
		cp ./libraries/$(strip $(1))/README.md ./libraries/$(strip $(1))/dist/
		cp ./libraries/$(strip $(1))/LICENSE.md ./libraries/$(strip $(1))/dist/

endef



# PUBLISH-NPM-PACKAGES #############################################################################

# Publish all library and utils npm packages to npm
define publish-npm-packages
		$(foreach package, $(LIBRARIES), $(call npm-release-libraries, $(package)))
		$(foreach package, $(UTILS), $(call npm-release-utils, $(package)))
		$(call clean-library-packages)

endef

define npm-release-libraries
		@if [ "$(BETA)" != "false" ]; \
			then npm publish ./libraries/$(strip $(1))/dist/ --access public --tag beta; \
			else npm publish ./libraries/$(strip $(1))/dist/ --access public; \
		fi;

endef

define npm-release-utils
		@if [ "$(BETA)" != "false" ]; \
			then npm publish ./utils/$(strip $(1))/ --access public --tag beta; \
			else npm publish ./utils/$(strip $(1))/ --access public; \
		fi;

endef

# Clean the builds.
define clean-library-packages
		$(foreach package, $(LIBRARIES), $(call clean-library-package, $(package)))

endef

define clean-library-package
		rm -rf -f ./libraries/$(strip $(1))/dist

endef



# PUBLISH-TO-GITHUB ################################################################################
debug0:
		make publish-to-github

# Push everything to github and create releases including tags
publish-to-github:
		# Update remotes and push changes into dedicated release branches
		git fetch --all
		git push origin "releases/$(RELEASE_NAME)";
ifeq ($(BETA), "false")
		# STABLE RELEASE
		# git push origin "develop"; # TODO: UNCOMMENT THIS
		# git push origin "master"; # TODO: UNCOMMENT THIS
		#(call push-subtrees-to-git, master) # TODO ####
else
		# BETA RELEASE
		$(call push-subtrees-to-git, releases/$(RELEASE_NAME))
endif
		# Create release drafts

define push-subtrees-to-git
		$(foreach remote, $(THEMES), $(call update-subtree-remotes, themes/$(remote), $(remote), $(strip $(1))))
		$(foreach remote, $(EXTENSIONS), $(call update-subtree-remotes, extensions/$(remote), $(patsubst @shopgate-%,ext-%,$(remote)), $(strip $(1))))

endef

define update-subtree-remotes
		git subtree push --prefix=$(strip $(1)) $(strip $(2)) $(strip $(3))

endef



# define changelog
# 		@echo "============================================================"
# 		@echo "| Creating changelog ..."
# 		@echo "============================================================"
#
# 		GITHUB_AUTH=$(GITHUB_AUTH_KEY) ./node_modules/.bin/lerna-changelog
#
# 		@echo "============================================================"
# 		@echo "| ... done."
# 		@echo "============================================================"
#
# endef

#
# define finalize-release
# 		@echo "============================================================"
# 		@echo "| Finishing release of version $(RELEASE_VERSION)"
# 		@echo "============================================================"
# 		@echo " "
#
## 		# Cleanup by removing beta branches via github api
#
# 		@echo " "
# 		@echo "============================================================"
# 		@echo "| Done releasing!"
# 		@echo "============================================================"
# 		@echo " "
#
# endef



# GITHUB API HELPER FUNCTIONS ######################################################################

create-github-release:
ifeq ($(BETA), "false")
		curl -X POST --silent --data '{"tag_name": "$(1)","target_commitish": "$(2)","name": "","body": "","draft": $(DRAFT_RELEASE),"prerelease": true}' -H "Content-Type: application/json" -H "Authorization: token $(GITHUB_AUTH_TOKEN)" https://api.github.com/repos/shopgate/$(strip $(3))/releases 2>&1 | grep '^  "id":' | cut -d' ' -f 4 | cut -d',' -f 1
else
		curl -X POST --silent --data '{"tag_name": "$(1)","target_commitish": "$(2)","name": "","body": "","draft": $(DRAFT_RELEASE),"prerelease": false}' -H "Content-Type: application/json" -H "Authorization: token $(GITHUB_AUTH_TOKEN)" https://api.github.com/repos/shopgate/$(strip $(3))/releases 2>&1 | grep '^  "id":' | cut -d' ' -f 4 | cut -d',' -f 1
endif

# define delete-github-release
# 		curl -X DELETE --silent -H "Authorization: token $(GITHUB_AUTH_TOKEN)" https://api.github.com/repos/shopgate/$(strip $(1))/releases/$(strip $(2)) 2>&1 | cat
#
# endef
#
# define delete-github-branch
# 		curl -X DELETE --silent -H "Authorization: token $(GITHUB_AUTH_TOKEN)" https://api.github.com/repos/shopgate/$(strip $(1))/git/refs/heads/$(strip $(2)) 2>&1 | cat
#
# endef
#
# define delete-github-tag
# 		curl -X DELETE --silent -H "Authorization: token $(GITHUB_AUTH_TOKEN)" https://api.github.com/repos/shopgate/$(strip $(1))/git/refs/tags/$(strip $(2)) 2>&1 | cat
#
# endef
