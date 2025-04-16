.PHONY: dist publish test lint build/debug \
		package-lock.json tags clean

all: dist

tags:
	ctags -R --exclude=node_modules --exclude=vendor --exclude=docs \
	--exclude=*.js --exclude=*.htm* --exclude=*.json --exclude=src/style

clean:
	rm -rvf tags build/ autom4te.cache/ dist

build/doc: package.json webpack.config.doc.js
	npm run doc

# overriding the output path allows for wrapping by another project
# it can be used like `make build/release OUTPUT_PATH=<path-override>`
build/release: package.json webpack.config.js
	@test -z "$(OUTPUT_PATH)" || echo "overriding output path: $(OUTPUT_PATH)"
	npm run build:release $(if $(OUTPUT_PATH),-- --output-path=$(OUTPUT_PATH))

build/debug: package.json webpack.config.debug.js
	@test -z "$(OUTPUT_PATH)" || echo "overriding output path: $(OUTPUT_PATH)"
	npm run build:debug $(if $(OUTPUT_PATH),-- --output-path=$(OUTPUT_PATH))

publish: package.json dist
	npm run publish_

archive: package.json dist
	npm run archive

dist: package.json build/release build/doc
	npm run dist -- build/doc

# user acceptance testing
uat: package.json webpack.config.doc.js
	npm run uat

configure: configure.ac
	autoconf

# necessary when using a local npm mirror/proxy
package-lock.json: package.json
	rm -rf package-lock.json
	npm install --registry=https://registry.npmjs.org

watch:
	@test -z "$(OUTPUT_PATH)" || echo "overriding output path: $(OUTPUT_PATH)"
	npm run watch $(if $(OUTPUT_PATH),-- --output-path=$(OUTPUT_PATH))
