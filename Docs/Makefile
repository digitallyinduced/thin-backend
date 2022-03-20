.PHONY: watch all clean

HTML_FILES=
HTML_FILES+= index.html
HTML_FILES+= your-first-project.html
HTML_FILES+= running.html
HTML_FILES+= clients.html

all: $(HTML_FILES) bootstrap.css instantclick.js

%.html: %.md layout.html
	mmark -i $< -o $@ --template layout.html --ext-skylighting --ext-ghc-highlighter --ext-punctuation --ext-toc 2-6

watch: all
	@echo "Server is starting at: http://localhost:3000/index.html"
	@nix-shell -p haskellPackages.wai-app-static --command "warp" &
	@ls *.md layout.html | entr make

clean:
	rm $(HTML_FILES)

bootstrap.css:
	curl https://stackpath.bootstrapcdn.com/bootstrap/4.5.0/css/bootstrap.min.css --output $@

instantclick.js:
	curl http://instantclick.io/v3.1.0/instantclick.min.js --output $@

guide.tar.gz: all
	tar -czvf guide.tar.gz *.html *.css *.js images/* images/*/*