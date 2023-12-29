.PHONY: callee
callee: dist/callee.zip

dist/%.zip: dist/%/handler.js
	cd dist/$* && zip -r ../$*.zip .

dist/%/handler.js: src/%/index.ts
	bun build $< --outfile $@

