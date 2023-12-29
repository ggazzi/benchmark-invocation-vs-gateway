.PHONY: callee
callee: dist/callee.zip

.PHONY: caller
caller: dist/caller.zip

dist/%.zip: dist/%/handler.js
	cd dist/$* && zip -r ../$*.zip .

dist/%/handler.js: src/%/index.ts
	bun build $< --outfile $@

