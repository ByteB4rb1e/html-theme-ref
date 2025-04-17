.PHONY: dist publish build/debug package-lock.json tags clean \
		test-reports/script test-reports/style

all: dist

tags:
	ctags -R --exclude=node_modules --exclude=vendor --exclude=docs \
	--exclude=*.js --exclude=*.htm* --exclude=*.json --exclude=src/style

test-reports/script: eslint.config.mjs jest.config.js
	npm run lint:script || exit 0
	npm run test:script || exit 0

test-reports/style: .stylelintrc.json jest.config.sass-true.js
	npm run lint:style

test-reports: test-reports/script test-reports/style

clean:
	rm -rvf tags build/ autom4te.cache/ dist test-reports

build/doc: package.json webpack.config.doc.js src/
	npm run doc

# overriding the output path allows for wrapping by another project
# it can be used like `make build/release OUTPUT_PATH=<path-override>`
build/release: package.json webpack.config.js src/ test-reports
	@test -z "$(OUTPUT_PATH)" || echo "overriding output path: $(OUTPUT_PATH)"
	npm run build:release $(if $(OUTPUT_PATH),-- --output-path=$(OUTPUT_PATH))

build/debug: package.json webpack.config.debug.js src/
	@test -z "$(OUTPUT_PATH)" || echo "overriding output path: $(OUTPUT_PATH)"
	npm run build:debug $(if $(OUTPUT_PATH),-- --output-path=$(OUTPUT_PATH))

publish: package.json dist
	npm run publish_

archive: package.json dist
	npm run archive

dist: package.json build/release build/doc
	npm run dist -- build/doc

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
	@test -z "$(OUTPUT_PATH)" || echo "overriding output path: $(OUTPUT_PATH)"
	npm run watch $(if $(OUTPUT_PATH),-- --output-path=$(OUTPUT_PATH))
