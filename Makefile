.PHONY: dist publish test lint build/debug build/release build/doc build \
		package-lock.json tags clean

all: build/release

tags:
	ctags -R --exclude=node_modules --exclude=vendor --exclude=docs \
	--exclude=*.js --exclude=*.htm* --exclude=*.json --exclude=src/style

clean:
	rm -rvf tags build/ autom4te.cache/

build/doc:
	npm run doc

# overriding the output path allows for wrapping by another project
# it can be used like `make build/release OUTPUT_PATH=<path-override>`
build/release:
	@test -z "$(OUTPUT_PATH)" || echo "overriding output path: $(OUTPUT_PATH)"
	npm run production $(if $(OUTPUT_PATH),-- --output-path=$(OUTPUT_PATH))

build/debug:
	@test -z "$(OUTPUT_PATH)" || echo "overriding output path: $(OUTPUT_PATH)"
	npm run debug $(if $(OUTPUT_PATH),-- --output-path=$(OUTPUT_PATH))

publish:
	npm run mypublish

dist:
	npm run dist

# user acceptance testing
uat:
	npm run uat

configure:
	autoconf

package-lock.json:
	rm -rf package-lock.json node_modules
	npm install --registry=https://registry.npmjs.org

watch:
	@test -z "$(OUTPUT_PATH)" || echo "overriding output path: $(OUTPUT_PATH)"
	npm run watch $(if $(OUTPUT_PATH),-- --output-path=$(OUTPUT_PATH))
