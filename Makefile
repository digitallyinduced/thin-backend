ifneq ($(wildcard IHP/.*),)
IHP = IHP/lib/IHP
else
ifneq ($(wildcard build/ihp-lib),)
IHP = build/ihp-lib
else
ifneq ($(shell which RunDevServer),)
IHP = $(shell dirname $$(which RunDevServer))/../lib/IHP
else
IHP = $(error IHP not found! Run the following command to fix this:    nix-shell --run 'make .envrc'    )
endif
endif
endif

CSS_FILES += ${IHP}/static/vendor/bootstrap.min.css
CSS_FILES += ${IHP}/static/vendor/flatpickr.min.css
CSS_FILES += static/app.css

JS_FILES += ${IHP}/static/vendor/jquery-3.6.0.slim.min.js
JS_FILES += ${IHP}/static/vendor/timeago.js
JS_FILES += ${IHP}/static/vendor/popper.min.js
JS_FILES += ${IHP}/static/vendor/bootstrap.min.js
JS_FILES += ${IHP}/static/vendor/flatpickr.js
JS_FILES += ${IHP}/static/helpers.js
JS_FILES += ${IHP}/static/vendor/morphdom-umd.min.js
JS_FILES += ${IHP}/static/vendor/turbolinks.js
JS_FILES += ${IHP}/static/vendor/turbolinksInstantClick.js
JS_FILES += ${IHP}/static/vendor/turbolinksMorphdom.js

Frontend/node_modules:
	cd Frontend && npm install

static/app.js: Frontend/node_modules Frontend/app.jsx
	cd Frontend && ./node_modules/.bin/esbuild app.jsx --bundle --outfile=../static/app.js ${ESBUILD_FLAGS}

watch-frontend:
	touch Frontend/app.jsx # Force rebuild
	$(MAKE) static/app.js ESBUILD_FLAGS="--watch"

build/thin-dev.tar.gz: build
	nix-build Config/nix/docker/thin-dev.nix -o build/thin-dev.tar.gz

build/thin-prod.tar.gz: build
	nix-build Config/nix/docker/thin-prod.nix -o build/thin-prod.tar.gz

build/bin/RunDevServer: DevServerMain.hs build/bin static/prod.js static/prod.css build/Generated/Types.hs
	mkdir -p build/RunDevServer build/bin
	ghc -O0 ${GHC_OPTIONS} $< -o $@ -odir build/RunDevServer -hidir build/RunDevServer
	chmod +x $<

include ${IHP}/Makefile.dist