.PHONY: dist publish test lint build/debug build/production build/doc build package-lock.json

build:
	npm run build

build/doc:
	npm run build:doc

build/production:
	npm run build:production

build/debug:
	npm run build:production

lint:
	npm run lint:style

test:
	npm run test:script

publish:
	npm run mypublish

dist:
	npm run dist

configure:
	autoconf

package-lock.json:
	rm -rf package-lock.json node_modules
	npm install --registry=https://registry.npmjs.org
