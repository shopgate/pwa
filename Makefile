# Fix color output until TravisCI fixes https://github.com/travis-ci/travis-ci/issues/7967
export FORCE_COLOR = true

RECURSIVE_MAKEFILE_NAME = Makefile

LIBRARIES = commerce common core tracking tracking-core webcheckout ui-ios ui-material ui-shared
EXTENSIONS = @shopgate-product-reviews @shopgate-tracking-ga-native @shopgate-user-privacy
UTILS = eslint-config unit-tests e2e benchmark
THEMES = theme-gmd theme-ios11

GITHUB_AUTH_KEY =
GITHUB_AUTH_TOKEN =

REPO_VERSION =

RELEASE_VERSION = $(patsubst v%,%,$(strip $(REPO_VERSION)))

# Branch name to start the release from; "develop" by default
BRANCH_NAME = develop

ifneq ("$(findstring -rc, $(BRANCH_NAME))","")
	IS_RC_BRANCH_NAME = true
else
	IS_RC_BRANCH_NAME = false
endif

# Make sure the release name starts with a "v" and the release version does not
RELEASE_NAME = v$(patsubst v%,%,$(strip $(RELEASE_VERSION)))


# Set up pre-release state flags to be "true" or "false"

ALPHA = $(findstring -alpha., $(RELEASE_NAME))
ifneq ("$(ALPHA)","")
	ALPHA = true
else
	ALPHA = false
endif

BETA = $(findstring -beta, $(RELEASE_NAME))
ifneq ("$(BETA)","")
	BETA = true
else
	BETA = false
endif

RC = $(findstring -rc, $(RELEASE_NAME))
ifneq ("$(RC)","")
	RC = true
else
	RC = false
endif

# Set STABLE and PRE_RELEASE variables accordingly
ifeq ("$(ALPHA)-$(BETA)-$(RC)","false-false-false")
	STABLE = true
	PRE_RELEASE = false
else
	STABLE = false
	PRE_RELEASE = true
endif

# Causes a STABLE release not to update master if not set to true
UPDATE_MASTER = true

# This causes the Github-API to create draft releases only, without creating tags
DRAFT_RELEASE = true



####################################################################################################
# MAIN MAKEFILE COMMANDS
####################################################################################################

checkout-develop:
		git checkout origin/develop;
		git fetch --all;
		git pull origin develop;
		$(call make, clean)



init:
		git submodule deinit --all;
		rm -rf .git/modules/*;



add-remotes:
		node ./scripts/add-remotes.js 2> /dev/null; # ignore stderr output here



sanity-check:
		npm install --no-package-lock --no-save yargs && \
			node ./scripts/check-release-version.js -v="$(RELEASE_VERSION)";

		@if [[ "$(BRANCH_NAME)" = "" ]]; then \
			echo "ERROR:  No BRANCH was provided!" && false; \
		fi;
		@if [[ "$(STABLE)" == "true" ]] && [[ "$(IS_RC_BRANCH_NAME)" != "true" ]]; then \
			echo "ERROR: STABLE releases can only be created from 'rc' branches" && false; \
		fi;

		@echo "Sanity check OK!"



release:
		$(call setup-release)
		$(call update-versions)
		$(call build-npm-packages)
		$(call publish-npm-packages)
		$(call make, publish-to-github)
		$(call create-github-releases)
		$(call finalize-release)



# Clean the repository before starting a release.
clean:
		$(call make, init)
		find . -name "*error.log" -type f -delete;
		find . -name "*debug.log" -type f -delete;
		lerna clean --yes;
		rm -rf ./node_modules/;
		node ./scripts/init-subtrees.js;
		lerna bootstrap;



clean-git:
		git remote prune origin;
		git branch -vv | grep 'origin/.*: gone]' | awk '{print $1}' | xargs git branch -d;



fix-remote:
		git merge -s ours --no-commit --allow-unrelated-histories $(REMOTE)/master

setup-frontend-with-current-ip:
		echo '{\n  "ip": "$(shell ifconfig | grep -Eo 'inet (addr:)?([0-9]*\.){3}[0-9]*' | grep -Eo '([0-9]*\.){3}[0-9]*' | grep -v '127.0.0.1' | awk '{print $1}')",\n  "port": 8080,\n  "apiPort": 9666,\n  "hmrPort": 3000,\n  "remotePort": 8000,\n  "sourceMapsType": "cheap-module-eval-source-map"\n}\n' > ./.sgcloud/frontend.json;


e2e-gmd:
		cd themes/theme-gmd && yarn run e2e;

e2e-ios11:
		cd themes/theme-ios11 && yarn run e2e;

e2e-checkout:
		cd themes/theme-gmd && yarn run e2e:checkout;

e2e-user:
		cd themes/theme-gmd && yarn run e2e:user;



####################################################################################################
# MAKE HELPER WHICH USES THE CORRECT MAKEFILE TO RUN (local or another one predefined by Jenkins)
####################################################################################################

define make
	make -f $(strip $(RECURSIVE_MAKEFILE_NAME)) $(strip $(1));

endef

####################################################################################################
# SETUP-RELEASE

define setup-release
		# Perform "sanity check" before doing anything else
		$(call make, sanity-check)

		@echo "======================================================================"
		@echo "| Releasing version '$(RELEASE_VERSION)' on branch '$(BRANCH_NAME)'"
		@echo "======================================================================"

		# Remotes are required to push subtrees later
		$(call make, add-remotes)

		# Create a release branch to work with
		$(call create-pwa-release-branch)

		# Set up dependencies (lerna) and subtrees
		$(call make, clean)

endef



define create-pwa-release-branch
		@echo "======================================================================"
		@echo "| Creating release branch out of '$(BRANCH_NAME)' ... "
		@echo "======================================================================"
		git checkout "origin/$(BRANCH_NAME)"
		git fetch --all
		git pull origin "$(BRANCH_NAME)"
		git checkout -b "releases/$(RELEASE_NAME)"

endef



####################################################################################################
# UPDATE-VERSIONS

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
		lerna publish --skip-npm --skip-git --repo-version $(RELEASE_VERSION) --force-publish --yes --exact;

		# Checking version
		@if [ "$$(cat ./lerna.json | grep version | head -1 | awk -F: '{ print $$2 }' | sed 's/[\",]//g' | tr -d '[[:space:]]')" != "$(RELEASE_VERSION)" ]; \
			then echo "ERROR: Package version mismatch, please check your specified version ('$$(cat ./lerna.json | grep version | head -1 | awk -F: '{ print $$2 }' | sed 's/[\",]//g' | tr -d '[[:space:]]')' != '$(RELEASE_VERSION)')" && false; \
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
		node ./scripts/bump-extension.js --file="./extensions/$(strip $(1))/extension-config.json" --v="$(RELEASE_VERSION)";

endef

# Change the version in the extension-config.json files of all themes
define update-theme-versions
		@echo "======================================================================"
		@echo "| Updating theme versions to '$(RELEASE_VERSION)'"
		@echo "======================================================================"
		$(foreach theme, $(THEMES), $(call update-theme-version, $(theme)))

endef

define update-theme-version
		node ./scripts/bump-extension.js --file="./themes/$(strip $(1))/extension-config.json" --v="$(RELEASE_VERSION)";

endef



####################################################################################################
# BUILD-NPM-PACKAGES

define build-npm-packages
		@echo "======================================================================"
		@echo "| Building library npm packages"
		@echo "======================================================================"
		$(foreach library, $(LIBRARIES), $(call build-library, $(library)))

endef

define build-library
		BABEL_ENV=production ./node_modules/.bin/babel ./libraries/$(strip $(1))/ --out-dir ./libraries/$(strip $(1))/dist --ignore tests,spec.js,spec.jsx,__snapshots__,.eslintrc.js,jest.config.js,dist,coverage,node_modules;
		cp ./libraries/$(strip $(1))/package.json ./libraries/$(strip $(1))/dist/;
		cp ./libraries/$(strip $(1))/README.md ./libraries/$(strip $(1))/dist/;
		cp ./libraries/$(strip $(1))/LICENSE.md ./libraries/$(strip $(1))/dist/;

endef



####################################################################################################
# PUBLISH-NPM-PACKAGES

# Publish all library and utils npm packages to npm
define publish-npm-packages
		$(foreach package, $(LIBRARIES), $(call npm-release-libraries, $(package)))
		$(foreach package, $(UTILS), $(call npm-release-utils, $(package)))
		$(call clean-library-packages)

endef

define npm-release-libraries
		@if [ "$(STABLE)" != "true" ]; \
			then npm publish ./libraries/$(strip $(1))/dist/ --access public --tag beta; \
			else npm publish ./libraries/$(strip $(1))/dist/ --access public; \
		fi;

endef

define npm-release-utils
		@if [ "$(STABLE)" != "true" ]; \
			then npm publish ./utils/$(strip $(1))/ --access public --tag beta; \
			else npm publish ./utils/$(strip $(1))/ --access public; \
		fi;

endef

# Clean the builds.
define clean-library-packages
		$(foreach package, $(LIBRARIES), $(call clean-library-package, $(package)))

endef

define clean-library-package
		rm -rf -f ./libraries/$(strip $(1))/dist;

endef



####################################################################################################
# PUBLISH-TO-GITHUB

# Push everything to github and create releases including tags
publish-to-github:
		# Commit local changes to the repository (should be performed while being on a release branch)
		git add -A && git commit -m "Released $(RELEASE_VERSION)";
		# Update remotes and push changes into dedicated release branches
		git fetch --all;
		git push origin "releases/$(RELEASE_NAME)";
ifeq ("$(STABLE)","true")
		# STABLE RELEASE
		$(call build-changelog)
endif
ifeq ("$(STABLE)-$(UPDATE_MASTER)","true-true")
		# UPDATING MASTER FOR STABLE RELEASE
		$(call push-subtrees-to-git, master)
		git merge origin/master
		git push origin "releases/$(RELEASE_NAME)"
		git push origin "releases/$(RELEASE_NAME)":master;
else
		# PRE-RELEASE (alpha, beta, rc) or STABLE (without changing master branches)
		$(call push-subtrees-to-git, releases/$(RELEASE_NAME))
endif

define build-changelog
		@echo "======================================================================"
		@echo "| Creating changelog ..."
		@echo "======================================================================"
		# Create a dummy tag for the changelog creation tool
		git tag "$(RELEASE_NAME)" && git push origin "releases/$(RELEASE_NAME)" --tags;
		github_changelog_generator shopgate/pwa --token $(GITHUB_AUTH_TOKEN) --header-label "# Changelog" --exclude-tags-regex ".*\b(alpha|beta|rc)\b\.+\d{1,}" --bugs-label ":bug: **Fixed bugs:**" --pr-label ":nail_care: **Others:**" --enhancement-label ":rocket: **Enhancements:**" --release-branch "develop" --no-unreleased --no-compare-link --issue-line-labels "All" --since-tag "v2.8.1";
		# Remove the dummy tag again, so it can be properly created with the changelog file inside
		git push -d origin "refs/tags/$(RELEASE_NAME)";
		git tag -d "$(RELEASE_NAME)";
		git fetch origin;
		# Push the new changelog to GitHub (into the STABLE release branch)
		git add "CHANGELOG.md";
		git commit -m "Created changelog for version '$(RELEASE_NAME)'.";
		git push origin "releases/$(RELEASE_NAME)" --tags;
		# Recreate the tag with the changelog inside and push it to remote (origin)
		git tag "$(RELEASE_NAME)" && git push origin "refs/tags/$(RELEASE_NAME)";

endef

define push-subtrees-to-git
		$(foreach remote, $(THEMES), $(call update-subtree-remotes, themes/$(remote), $(remote), $(strip $(1))))
		$(foreach remote, $(EXTENSIONS), $(call update-subtree-remotes, extensions/$(remote), $(patsubst @shopgate-%,ext-%,$(remote)), $(strip $(1))))

endef

define update-subtree-remotes
		-git subtree pull --prefix=$(strip $(1)) $(strip $(2)) $(strip $(3));
		git subtree push --prefix=$(strip $(1)) $(strip $(2)) $(strip $(3));

endef



####################################################################################################
# CREATE-GITHUB-RELEASEES

define create-github-releases
		$(call create-github-release,$(RELEASE_NAME),releases/$(RELEASE_NAME),pwa)
		$(foreach theme, $(THEMES),$(call create-github-release,$(RELEASE_NAME),releases/$(RELEASE_NAME),$(call map-theme-to-repo-name,$(theme))))
		$(foreach extension, $(EXTENSIONS), $(call create-github-release,$(RELEASE_NAME),releases/$(RELEASE_NAME),$(call map-extension-to-repo-name,$(extension))))

endef

define map-theme-to-repo-name
		$(patsubst @shopgate-%,ext-%,$(1))

endef

define map-extension-to-repo-name
		$(patsubst ext-tracking-ga-native,tracking-ga-native,$(patsubst @shopgate-%,ext-%,$(1)))

endef



define finalize-release
		# Cleanup by removing alpha / beta branches via GitHub API
@# 		@echo "======================================================================"
@# 		@echo "| Cleaning up pre-release branch"
@# 		@echo "======================================================================"
@# 		@echo " "

		@echo " "
		@echo "======================================================================"
		@echo "| Done releasing!"
		@echo "======================================================================"
		@echo " "

endef



####################################################################################################
# GITHUB API HELPER FUNCTIONS
####################################################################################################

define create-github-release
		curl -X POST --silent --data '{"tag_name": "$(1)","target_commitish": "$(2)","name": "$(1)","body": "","draft": $(DRAFT_RELEASE),"prerelease": $(strip $(PRE_RELEASE))}' -H "Content-Type: application/json" -H "Authorization: token $(GITHUB_AUTH_TOKEN)" https://api.github.com/repos/shopgate/$(strip $(3))/releases 2>&1 | grep '^  "id":' | cut -d' ' -f 4 | cut -d',' -f 1;

endef

define delete-github-release
		curl -X DELETE --silent -H "Authorization: token $(GITHUB_AUTH_TOKEN)" https://api.github.com/repos/shopgate/$(strip $(1))/releases/$(strip $(2)) 2>&1 | cat;

endef

define delete-github-branch
		curl -X DELETE --silent -H "Authorization: token $(GITHUB_AUTH_TOKEN)" https://api.github.com/repos/shopgate/$(strip $(1))/git/refs/heads/$(strip $(2)) 2>&1 | cat;

endef

define delete-github-tag
		curl -X DELETE --silent -H "Authorization: token $(GITHUB_AUTH_TOKEN)" https://api.github.com/repos/shopgate/$(strip $(1))/git/refs/tags/$(strip $(2)) 2>&1 | cat;

endef
