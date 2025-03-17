.PHONY: dist publish test lint build/debug build/production build/doc build

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
