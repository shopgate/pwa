# Fix color output until TravisCI fixes https://github.com/travis-ci/travis-ci/issues/7967
export FORCE_COLOR = true

####################################################################################################
# NOTICE:
# -------
# If LIBRARIES or UTILS is extended and the npm packacke should not be prefixed with
# "@shopgate/pwa-", then you need to modify the "get-npm-package-name" function below as well!
LIBRARIES = engage commerce common core tracking tracking-core webcheckout ui-ios ui-material ui-shared
TRANSPILED_UTILS = benchmark
UTILS = eslint-config unit-tests e2e webpack
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

# Enable or disable timestamp log lines.
# Set TIMESTAMP_LOGS=false to keep original logs without timestamp echoes.
TIMESTAMP_LOGS = true

# Timestamp format for CI log output (example: 2026-05-15 14:37:12).
TIMESTAMP_FORMAT = +%Y-%m-%d %H:%M:%S


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
		# node ./scripts/add-remotes.js 2> /dev/null; # ignore stderr output here
		node ./scripts/add-remotes.js;



sanity-check:
		$(call log,Running sanity-check)
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
		$(call log,Starting release for $(RELEASE_NAME) from $(BRANCH_NAME))
		$(call log,Phase: setup-release)
		$(call setup-release)
		$(call log,Phase: update-versions)
		$(call update-versions)
		$(call log,Phase: release-npm-packages)
		$(call release-npm-packages)
		$(call log,Phase: publish-to-github)
		$(call make, publish-to-github)
ifeq ("$(STABLE)-$(UPDATE_MASTER)","true-true")
		$(call log,Phase: create-github-releases target=master)
		$(call create-github-releases,master)
else
		$(call log,Phase: create-github-releases target=releases/$(RELEASE_NAME))
		$(call create-github-releases,releases/$(RELEASE_NAME))
endif
		$(call finalize-release)

define NL


endef

release-dry-run:
	@echo "Purging dist"
	$(foreach library, $(LIBRARIES), $(call clean-npm-package, libraries, $(library))$(NL))
	@echo "Running babel"
	$(foreach library, $(LIBRARIES), $(call build-npm-package, libraries, $(library))$(NL))
	@echo "Normalizing dist"
	$(foreach library, $(LIBRARIES), $(call normalize-build, libraries, $(library))$(NL))
	@echo "You can check dist folder"

release-normalize:
	@echo "Normalizing dist"
	$(foreach library, $(LIBRARIES), $(call normalize-build, libraries, $(library)))

release-purge:
	@echo "Purging dist"
	$(foreach library, $(LIBRARIES), $(call clean-npm-package, libraries, $(library)))

# Clean the repository before starting a release.
clean:
		$(call log,Cleaning repository state)
		$(call make, init)
		find . -name "*error.log" -type f -delete;
		find . -name "*debug.log" -type f -delete;
		lerna clean --yes;
		rm -rf ./node_modules/;
		rm -rf ./.cache-loader/;
		node ./scripts/init-subtrees.js;
		$(call log,Running lerna bootstrap)
		lerna bootstrap;



clean-git:
		git remote prune origin;
		git branch -vv | grep 'origin/.*: gone]' | awk '{print $1}' | xargs git branch -d;



fix-remote:
		git merge -s ours --no-commit --allow-unrelated-histories $(REMOTE)/master

setup-frontend-with-current-ip:
		echo '{\n  "ip": "0.0.0.0",\n  "startpageIp": "$(shell ifconfig | grep -Eo 'inet (addr:)?([0-9]*\.){3}[0-9]*' | grep -Eo '([0-9]*\.){3}[0-9]*' | grep -v '127.0.0.1' | awk '{print $1}' | head -1)",\n  "port": 8080,\n  "apiPort": 9666,\n  "hmrPort": 3000,\n  "remotePort": 8000,\n  "sourceMapsType": "cheap-eval-source-map"\n}\n' > ./.sgcloud/frontend.json;


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

define log
	@if [ "$(TIMESTAMP_LOGS)" = "true" ]; then \
		echo ""; \
		echo "[$$(date '$(TIMESTAMP_FORMAT)')] $(strip $(1))"; \
	fi

endef

####################################################################################################
# SETUP-RELEASE

define setup-release
		$(call log,Setup release: start)
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
		$(call log,Setup release: done)

endef



define create-pwa-release-branch
		$(call log,Creating release branch out of $(BRANCH_NAME))
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
		$(call update-theme-versions)

endef

# Changes all the version numbers using lerna
define update-pwa-versions
		$(call log,Updating pwa versions to $(RELEASE_VERSION))
		@echo "======================================================================"
		@echo "| Updating pwa versions to '$(RELEASE_VERSION)'"
		@echo "======================================================================"

		# --skip-npm --skip-git: No npm publish / git commit or tag creation
		# --repo-version $(RELEASE_VERSION): Update all lerna modules to RELEASE_VERSION
		# --force-publish: Force lerna to apply version number to all packages independent if something has changed
		# --yes --exact: Skip all prompts / Apply exact version (7.0.0) instead of range (^7.0.0)
		lerna publish --skip-npm --skip-git --repo-version $(RELEASE_VERSION) --force-publish --yes --exact;

		# Checking version
		@if [ "$$(cat ./lerna.json | grep version | head -1 | awk -F: '{ print $$2 }' | sed 's/[\",]//g' | tr -d '[[:space:]]')" != "$(RELEASE_VERSION)" ]; \
			then echo "ERROR: Package version mismatch, please check your specified version ('$$(cat ./lerna.json | grep version | head -1 | awk -F: '{ print $$2 }' | sed 's/[\",]//g' | tr -d '[[:space:]]')' != '$(RELEASE_VERSION)')" && false; \
			else echo "Version check OK!"; \
		fi;

endef

# Change the version in the extension-config.json files of all themes
define update-theme-versions
		$(call log,Updating theme versions to $(RELEASE_VERSION))
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
		$(call log,Releasing library and util npm packages)
		@echo "======================================================================"
		@echo "| Releasing library and util npm packages"
		@echo "======================================================================"
		$(foreach library, $(LIBRARIES), $(call build-publish-npm-package, libraries, $(library)))
		$(foreach transpiled_util, $(TRANSPILED_UTILS), $(call build-publish-npm-package, utils, $(transpiled_util)))
		@# No build for packages in the UTILS list - publish without transpilation
		$(foreach util, $(UTILS), $(call publish-npm-package, utils, $(util)))

endef

define build-publish-npm-package
		$(call build-npm-package, $(strip $(1)), $(strip $(2)))$(NL)
		$(call normalize-build, $(strip $(1)), $(strip $(2)))$(NL)
		$(call publish-npm-package, $(strip $(1)), $(strip $(2)),dist)$(NL)
		$(call clean-npm-package, $(strip $(1)), $(strip $(2)))$(NL)
endef

define build-npm-package
	$(call log,Build npm package)
	@echo "> Building './$(strip $(1))/$(strip $(2))$(patsubst %//,%/,$(patsubst %,%/,$(strip $(3))))/dist' npm package"
	@BABEL_ENV=production ./node_modules/.bin/babel ./$(strip $(1))/$(strip $(2))/ \
		--out-dir ./$(strip $(1))/$(strip $(2))/dist \
		--extensions ".js,.jsx,.ts,.tsx" \
		--copy-files \
		--ignore "**/*.d.ts","**/*.d.tsx","**/node_modules/**",tests,spec.js,spec.jsx,spec.ts,spec.tsx,__snapshots__,.eslintrc.js,jest.config.js,dist,coverage,node_modules;
	@if [ -f "./$(strip $(1))/$(strip $(2))/tsconfig.build.json" ]; then \
		echo "> Generating types for './$(strip $(1))/$(strip $(2))' npm package"; \
		./node_modules/.bin/tsc -p "./$(strip $(1))/$(strip $(2))/tsconfig.build.json" --noCheck; \
	fi;
endef

# tests,spec.js,spec.jsx,__snapshots__,.eslintrc.js,jest.config.js,dist,coverage,node_modules;
define normalize-build
	@-find ./$(strip $(1))/$(strip $(2))/dist -type d -name '*tests*' -exec rm -Rf {} \;
	@-find ./$(strip $(1))/$(strip $(2))/dist -type d -name '*mocks*' -exec rm -Rf {} \;
	@-find ./$(strip $(1))/$(strip $(2))/dist -type d -name '*snapshots*' -exec rm -Rf {} \;
	@-find ./$(strip $(1))/$(strip $(2))/dist -type f -name '*.spec.*' -delete

endef

define publish-npm-package
		$(call log,Publish npm package)
		@echo "> Publishing './$(strip $(1))/$(strip $(2))' npm package"
		@if [ "$(STABLE)" != "true" ]; \
			then npm publish ./$(strip $(1))/$(strip $(2))/$(patsubst %//,%/,$(patsubst %,%/,$(strip $(3)))) --access public --tag beta; \
			else npm publish ./$(strip $(1))/$(strip $(2))/$(patsubst %//,%/,$(patsubst %,%/,$(strip $(3)))) --access public; \
		fi;

endef

define clean-npm-package
		$(call log,Clean npm package)
		@echo "> Cleaning './$(strip $(1))/$(strip $(2))/dist' npm package"
		-rm -rf ./$(strip $(1))/$(strip $(2))/dist;

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
		$(call log,Creating changelog)
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
		$(call log,Syncing subtrees to branch $(strip $(1)))
		$(foreach remote, $(THEMES), $(call update-subtree-remotes, themes/$(remote), $(remote), $(strip $(1))))
		$(call log,Finished syncing subtrees to branch $(strip $(1)))

endef

define update-subtree-remotes
		$(call log,Subtree pull: prefix=$(strip $(1)) remote=$(strip $(2)) branch=$(strip $(3)))
		-git subtree pull --prefix=$(strip $(1)) $(strip $(2)) $(strip $(3));
		$(call log,Subtree push: prefix=$(strip $(1)) remote=$(strip $(2)) branch=$(strip $(3)))
		git subtree push --prefix=$(strip $(1)) $(strip $(2)) $(strip $(3));
		$(call log,Subtree sync done: prefix=$(strip $(1)) remote=$(strip $(2)) branch=$(strip $(3)))

endef



####################################################################################################
# CREATE-GITHUB-RELEASEES

define create-github-releases
		$(call log,Creating GitHub releases for target $(strip $(1)))
		$(call create-github-release,$(RELEASE_NAME),$(strip $(1)),pwa)
		$(foreach theme, $(THEMES),$(call create-github-release,$(RELEASE_NAME),$(strip $(1)),$(call map-theme-to-repo-name,$(theme))))
		$(call log,Finished creating GitHub releases for target $(strip $(1)))

endef

define map-theme-to-repo-name
		$(patsubst @shopgate-%,ext-%,$(1))

endef

define finalize-release
		# Cleanup by removing alpha / beta branches via GitHub API
@# 		@echo "======================================================================"
@# 		@echo "| Cleaning up pre-release branch"
@# 		@echo "======================================================================"
@# 		@echo " "

		$(call log,Done releasing)
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
		$(call log,Create GitHub release: repo=$(strip $(3)) tag=$(strip $(1)) target=$(strip $(2)))
		curl -X POST --silent --data '{"tag_name": "$(1)","target_commitish": "$(2)","name": "$(1)","body": "","draft": $(DRAFT_RELEASE),"prerelease": $(strip $(PRE_RELEASE))}' -H "Content-Type: application/json" -H "Authorization: token $(GITHUB_AUTH_TOKEN)" https://api.github.com/repos/shopgate/$(strip $(3))/releases 2>&1 | grep '^  "id":' | cut -d' ' -f 4 | cut -d',' -f 1;
		$(call log,GitHub release request finished: repo=$(strip $(3)) tag=$(strip $(1)))

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
