.PHONY: dist publish build/debug package-lock.json tags clean \
        test-reports/script test-reports/style

all: dist

tags:
	ctags -R --exclude=node_modules --exclude=vendor --exclude=docs \
	--exclude=*.js --exclude=*.htm* --exclude=*.json --exclude=src/style

test-reports/script: eslint.config.mjs jest.config.js
	npm run lint:script || exit 0
	# patch for eslint redirecting stdout, instead of dedicated write to file
	# TODO: move this to scripts/
	@node -p "console.log(require('fs').readFileSync('test-reports/script/lint',{encoding: 'utf-8'}))"
	npm run test:script || exit 0

test-reports/style: .stylelintrc.json jest.config.sass-true.js
	npm run lint:style || exit 0

test-reports: test-reports/script test-reports/style

clean:
	rm -rvf tags build/ autom4te.cache/ dist test-reports

build/doc: package.json webpack.config.doc.js src/
	npm run doc

# overriding the output path allows for wrapping by another project
# it can be used like `make build/release OUTPUT_PATH=<path-override>`
build/release: package.json webpack.config.js src/ $(if $(CI),,test-reports)
ifdef CI
	$(warning CI set, tests skipped and requiring manual execution)
endif
ifdef OUTPUT_PATH
	$(warning OUTPUT_PATH set, overriding output path)
endif
	npm run build:release $(if $(OUTPUT_PATH),-- --output-path=$(OUTPUT_PATH))

build/debug: package.json webpack.config.debug.js src/
ifdef OUTPUT_PATH
	$(warning OUTPUT_PATH set, overriding output path)
endif
	npm run build:debug $(if $(OUTPUT_PATH),-- --output-path=$(OUTPUT_PATH))

publish: package.json dist
	$(error publishing not allowed, as the output is not a real npm package)
	npm run publish_

archive: package.json dist
ifndef BITBUCKET_REPO_SLUG
	$(error BITBUCKET_REPO_SLUG environment variable not set)
else ifndef BITBUCKET_WORKSPACE
	$(error BITBUCKET_WORKSPACE environment variable not set)
else ifndef BITBUCKET_ACCESS_TOKEN
	$(error BITBUCKET_ACCESS_TOKEN environment variable not set)
endif
	# BITBUCKET_ACCESSS_TOKEN is picked up through the environment
	npm run archive -- --repo-slug $($BITBUCKET_REPO_SLUG) \
                       --workspace $(BITBUCKET_WORKSPACE) \
                       dist/*

dist: package.json build/release $(if $(NO_DOCS),, build/doc)
ifdef NO_DOCS
	$(warning NO_DOCS set, docs excluded from distribution)
endif
	npm run dist $(if $(NO_DOCS),, -- build/doc)

# user acceptance testing
uat: package.json webpack.config.doc.js src/
	npm run uat

configure: configure.ac
	autoconf

# necessary when using a local npm mirror/proxy
package-lock.json: package.json
	rm -rf package-lock.json
	npm install --registry=https://registry.npmjs.org

# can be used for a cascaded development environment, e.g. having a Sphinx theme
# with sphinx-autobuild running in parallel with this target
watch: src/ package.json webpack.config.debug.js
ifdef OUTPUT_PATH
	$(warning OUTPUT_PATH set, overriding output path)
endif
	npm run watch $(if $(OUTPUT_PATH),-- --output-path=$(OUTPUT_PATH))
