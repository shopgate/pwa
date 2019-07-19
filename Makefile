# Fix color output until TravisCI fixes https://github.com/travis-ci/travis-ci/issues/7967
export FORCE_COLOR = true

####################################################################################################
# NOTICE:
# -------
# If LIBRARIES, EXTENSIONS or UTILS is extended and the npm packacke should not be prefixed with
# "@shopgate/pwa-", then you need to modify the "get-npm-package-name" function below as well!
LIBRARIES = engage commerce common core tracking tracking-core webcheckout ui-ios ui-material ui-shared
EXTENSIONS = @shopgate-product-reviews @shopgate-tracking-ga-native @shopgate-user-privacy
TRANSPILED_UTILS = benchmark
UTILS = eslint-config unit-tests e2e
THEMES = theme-gmd theme-ios11

# Adds "@shopgate/pwa-" in front of all package names except "@shopgate/eslint-config" and "@shopgate/tracking-core".
# Optionally takes a version number as second parameter.
# Example: echo $(call get-package-name,common-core)
define get-npm-package-name
$(patsubst %@,%, $(patsubst %,%@$(strip $(2)),$(patsubst %,@shopgate/%,$(patsubst pwa-eslint-config,eslint-config,$(patsubst pwa-tracking-core,tracking-core,$(patsubst pwa-pwa-%,pwa-%,$(patsubst %,pwa-%,$(strip $(1)))))))))


endef
####################################################################################################

# This is required, so the Jenkins can change branches without changing the makefile
RECURSIVE_MAKEFILE_NAME = Makefile

GITHUB_AUTH_KEY =
GITHUB_AUTH_TOKEN =

# This is basically a feature version
REPO_VERSION =

# Required for versioning and npm (without the "v" prefix)
RELEASE_VERSION = $(patsubst v%,%,$(strip $(REPO_VERSION)))

# Branch name to start the release from; "develop" by default
BRANCH_NAME = develop

ifneq ("$(findstring -rc, $(BRANCH_NAME))","")
	IS_RC_BRANCH_NAME = true
else
	IS_RC_BRANCH_NAME = false
endif

# Make sure the release name starts with a "v"
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

# Causes a STABLE release to update master if set to true
UPDATE_MASTER = true

# This causes the Github-API to create draft releases only, without creating tags
DRAFT_RELEASE = true

SKIP_RC = false


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
			if [[ "$(SKIP_RC)" != "true" ]]; then \
				echo "ERROR: STABLE releases can only be created from 'rc' branches, unless it's skipped by setting!" && false; \
			fi; \
		fi;

		@echo "Sanity check OK!"



release:
		$(call setup-release)
		$(call update-versions)
		$(call release-npm-packages)
		$(call make, publish-to-github)
ifeq ("$(STABLE)-$(UPDATE_MASTER)","true-true")
		$(call create-github-releases,master)
else
		$(call create-github-releases,releases/$(RELEASE_NAME))
endif
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
		echo '{\n  "ip": "0.0.0.0",\n  "startpageIp": "$(shell ifconfig | grep -Eo 'inet (addr:)?([0-9]*\.){3}[0-9]*' | grep -Eo '([0-9]*\.){3}[0-9]*' | grep -v '127.0.0.1' | awk '{print $1}' | head -1)",\n  "port": 8080,\n  "apiPort": 9666,\n  "hmrPort": 3000,\n  "remotePort": 8000,\n  "sourceMapsType": "source-map"\n}\n' > ./.sgcloud/frontend.json;


# Open cypress UI for GMD theme
e2e-gmd:
	cd themes/theme-gmd && yarn run e2e;

# Open cypress UI for IOS theme
e2e-ios11:
	cd themes/theme-ios11 && yarn run e2e;

# Run GMD legacy tests
e2e-gmd-legacy:
	npx cypress run -P ./themes/theme-gmd/e2e -s 'themes/theme-gmd/e2e/integration/specFiles/consistency/legacy.js,themes/theme-gmd/e2e/integration/specFiles/functional/legacy.js'

# Run IOS legacy tests
e2e-ios11-legacy:
	npx cypress run -P ./themes/theme-ios11/e2e -s 'themes/theme-ios11/e2e/integration/specFiles/consistency/legacy.js,themes/theme-ios11/e2e/integration/specFiles/functional/legacy.js'

e2e-checkout:
	cd themes/theme-gmd && yarn run e2e:checkout;

e2e-user:
	cd themes/theme-gmd && yarn run e2e:user;

e2e-install:
	# Symlinking support, plugins, fixtures
	npx symlink-dir ./utils/e2e/support ./themes/theme-gmd/e2e/cypress/support
	npx symlink-dir ./utils/e2e/fixtures ./themes/theme-gmd/e2e/cypress/fixtures
	npx symlink-dir ./utils/e2e/plugins ./themes/theme-gmd/e2e/cypress/plugins
	npx symlink-dir ./utils/e2e/support ./themes/theme-ios11/e2e/cypress/support
	npx symlink-dir ./utils/e2e/fixtures ./themes/theme-ios11/e2e/cypress/fixtures
	npx symlink-dir ./utils/e2e/plugins ./themes/theme-ios11/e2e/cypress/plugins

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
		@echo "| Updating pwa versions to '$(RELEASE_VERSION)'"
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
# RELEASE-NPM-PACKAGES

define release-npm-packages
		@echo "======================================================================"
		@echo "| Releasing library and util npm packages"
		@echo "======================================================================"
		$(foreach library, $(LIBRARIES), $(call build-publish-npm-package, libraries, $(library)))
		$(foreach transpiled_util, $(TRANSPILED_UTILS), $(call build-publish-npm-package, utils, $(transpiled_util)))
		@# No build for packages in the UTILS list - publish without transpilation
		$(foreach util, $(UTILS), $(call publish-npm-package, utils, $(util)))

endef

define build-publish-npm-package
		$(call build-npm-package, $(strip $(1)), $(strip $(2)))
		$(call publish-npm-package, $(strip $(1)), $(strip $(2)), dist)
		$(call clean-npm-package, $(strip $(1)), $(strip $(2)))
endef

define build-npm-package
		@echo "> Building './$(strip $(1))/$(strip $(2))$(patsubst %//,%/,$(patsubst %,%/,$(strip $(3))))/dist' npm package"
		BABEL_ENV=production ./node_modules/.bin/babel ./$(strip $(1))/$(strip $(2))/ --out-dir ./$(strip $(1))/$(strip $(2))/dist --ignore tests,spec.js,spec.jsx,__snapshots__,.eslintrc.js,jest.config.js,dist,coverage,node_modules;
		cp ./$(strip $(1))/$(strip $(2))/package.json ./$(strip $(1))/$(strip $(2))/dist/;
		cp ./$(strip $(1))/$(strip $(2))/README.md ./$(strip $(1))/$(strip $(2))/dist/;
		cp ./$(strip $(1))/$(strip $(2))/LICENSE.md ./$(strip $(1))/$(strip $(2))/dist/;

endef

define publish-npm-package
		@echo "> Publishing './$(strip $(1))/$(strip $(2))' npm package"
		@if [ "$(STABLE)" != "true" ]; \
			then npm publish ./$(strip $(1))/$(strip $(2))/$(patsubst %//,%/,$(patsubst %,%/,$(strip $(3)))) --access public --tag beta; \
			else npm publish ./$(strip $(1))/$(strip $(2))/$(patsubst %//,%/,$(patsubst %,%/,$(strip $(3)))) --access public; \
		fi;

endef

define clean-npm-package
		@echo "> Cleaning './$(strip $(1))/$(strip $(2))/dist' npm package"
		rm -rf -f ./$(strip $(1))/$(strip $(2))/dist;

endef



####################################################################################################
# PUBLISH-TO-GITHUB

# Push everything to github and create releases including tags
publish-to-github:
		# Commit local changes to the repository (should be performed while being on a release branch)
		git add -A && git commit -m "Released $(RELEASE_VERSION)";
		# Update remotes and push changes into dedicated release branches
		git fetch --all;
		$(call build-changelog)
		git push origin "releases/$(RELEASE_NAME)";
ifeq ("$(STABLE)-$(UPDATE_MASTER)","true-true")
		# UPDATING MASTER FOR STABLE RELEASE
		$(call push-subtrees-to-git, master)
		git reset --hard;
		git merge origin/master
		git push origin "releases/$(RELEASE_NAME)"
		git push origin "releases/$(RELEASE_NAME)":"refs/heads/$(RELEASE_NAME)";
		git push origin "releases/$(RELEASE_NAME)":master;
		git status;
else
		# PRE-RELEASE (alpha, beta, rc) or STABLE (without changing master branch)
		$(call push-subtrees-to-git, releases/$(RELEASE_NAME))
endif

define build-changelog
		@echo "======================================================================"
		@echo "| Creating changelog ..."
		@echo "======================================================================"
		touch CHANGELOG.md;
		GITHUB_AUTH=$(GITHUB_AUTH_TOKEN) node ./scripts/build-changelog.js --release-name="$(RELEASE_NAME)" --tagTo=HEAD --appendPreviousChangelog=true > CHANGELOG_NEW.md;
		mv CHANGELOG_NEW.md CHANGELOG.md;
		$(foreach theme, $(THEMES), cp CHANGELOG.md themes/$(theme)/CHANGELOG.md;)
		# Push the new changelog to GitHub (into the STABLE release branch)
		git add CHANGELOG.md;
		$(foreach theme, $(THEMES), git add themes/$(theme)/CHANGELOG.md;)
		-git commit -m "Created changelog for version '$(RELEASE_NAME)'.";

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
		$(call create-github-release,$(RELEASE_NAME),$(strip $(1)),pwa)
		$(foreach theme, $(THEMES),$(call create-github-release,$(RELEASE_NAME),$(strip $(1)),$(call map-theme-to-repo-name,$(theme))))
		$(foreach extension, $(EXTENSIONS), $(call create-github-release,$(RELEASE_NAME),$(strip $(1)),$(call map-extension-to-repo-name,$(extension))))

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
