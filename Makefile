BITBUCKET_REPO_SLUG := html-theme-seaharvest
BITBUCKET_WORKSPACE := byteb4rb1e
GPG_SIGNER_FINGERPRINT := "91CD826E74B0174D181903DEF97C70941CD8C4EF"

PACKAGE_NAME = $(shell node <<< "console.log(require('./package.json').name)")
PACKAGE_VERSION = $(shell node <<< "console.log(require('./package.json').version)")
PACKAGE_ID := $(PACKAGE_NAME)-$(PACKAGE_VERSION)


define bitbucket-upload
curl \
    --request POST \
    --header "Authorization: Bearer $$BITBUCKET_ACCESS_TOKEN" \
    --form "files=@$(1);filename=$$(basename "$(1)")" \
    --fail \
    https://api.bitbucket.org/2.0/repositories/$(BITBUCKET_WORKSPACE)/$(BITBUCKET_REPO_SLUG)/downloads
endef

define dfile
$(1) $(1)/
endef


.all: dist

.archive: dist $(if $(SIGN),dist/$(PACKAGE_ID).tar.gz.asc,)
ifndef BITBUCKET_REPO_SLUG
	$(error BITBUCKET_REPO_SLUG environment variable not set)
else ifndef BITBUCKET_WORKSPACE
	$(error BITBUCKET_WORKSPACE environment variable not set)
else ifndef BITBUCKET_ACCESS_TOKEN
	$(error BITBUCKET_ACCESS_TOKEN environment variable not set)
endif
	$(call bitbucket-upload,dist/$(PACKAGE_ID).tar.sha256)
	$(call bitbucket-upload,dist/$(PACKAGE_ID).tar.gz)
	$(call bitbucket-upload,dist/$(PACKAGE_ID).tar.gz.sha256)
ifdef SIGN
	$(call bitbucket-upload,dist/$(PACKAGE_ID).tar.gz.asc)
endif

.clean:
	rm -rvf build/ autom4te.cache/ dist test-reports/ config.log config.status

.chore: .clean package-lock.json configure

.publish: .archive

.sanitize: .clean
	rm -rvf node_modules tags

.user-acceptance: src/ | package.json webpack.config.doc.mjs
	npm run $@

$(call dfile,build/debug) \
$(call dfile,build/doc/script) \
$(call dfile,build/doc/style) \
$(call dfile,build/release): src/ | package.json
ifeq ($(shell test -z "$(WATCH)$(BUILDDIR)"; echo $$?) , 1)
	@# $(@:/=) removes the last character of the recipe name, should it be a
	@# forwards slash
	npm run $(@:/=) -- \
		$(if $(WATCH),--watch,) \
		$(if $(BUILDDIR),--output-path $(BUILDDIR),)
else
	npm run $(@:/=)
endif

tags:
	# create a ctags file
	ctags -R --exclude=node_modules --exclude=vendor --exclude=docs \
	--exclude=*.js --exclude=*.htm* --exclude=*.json --exclude=src/style

$(call dfile,build/doc): build/doc/script build/doc/style

configure: configure.ac
	# generate GNU Autoconf script
	autoconf

$(call dfile,dist): dist/$(PACKAGE_ID).tar.gz $(if $(SIGN),dist/$(PACKAGE_ID).tar.gz.asc,)

$(addprefix dist/$(PACKAGE_ID),.tar.sha256 .tar.gz .tar.gz.sha256):  package.json build/release
	# package BUILDDIR (and optionals) as a software distribution
ifeq ($(shell test -z "$(DOCSDIR)$(TESTREPORTSDIR)"; echo $$?) , 1)
	npm run dist -- $(if $(DISTDIR),--pack-destination=$(DISTDIR)) \
		$(if $(DOCSDIR),--input-docs $(DOCSDIR),) \
		$(if $(TESTREPORTSDIR),--input-test-reports $(TESTREPORTSDIR),)
else
	npm run dist
endif

dist/$(PACKAGE_ID).tar.gz.asc: dist/$(PACKAGE_ID).tar.gz
	gpg --detach-sign --local-user $(GPG_SIGNER_FINGERPRINT) -v -a --yes $<

package-lock.json: package.json
	# remove the current package.lock, in case a non-default registry is used
	rm -rf package-lock.json
	# recreate package-lock.json pointing to default registry
	npm install --registry=https://registry.npmjs.org

$(call dfile,test-reports): $(addprefix test-reports/,lint/script lint/style unit/script)

test-reports/lint/script: eslint.config.mjs 
	npm run $(@:/=) || exit 0
	@node -p "console.log(require('fs').readFileSync('test-reports/lint/script',{encoding: 'utf-8'}))"

test-reports/lint/style: .stylelintrc.json jest.config.sass-true.mjs
	npm run $(@:/=) || exit 0

test-reports/unit/script: jest.config.mjs
	# patch for eslint redirecting stdout, instead of dedicated write to file
	# TODO: move this to scripts/
	npm run $(@:/=) $(if $(WATCH), --watch,) || exit 0
