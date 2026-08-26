# debianaire - package manager fridge poems

Fridge magnet poetry with Debian package names.

## Running

This is a purely clientside plain JS app, open `app.html` in your browser to try it out.

## Generating word lists

The Python script `scripts/generate_candidates.py` generates two word lists: `words/dictionary.js`, which contains Debian package names which are also words in the dictionary, and `words/poetry.js` which are package names that could work in a poem (short, one word, at least one vowel)

## Contributing

This project (excepting dependencies below) is coded by hand for fun, and is emphatically not an example of good coding practices.

However, contributions are welcome so long as a person signs off on them.

## Acknowledgements

* Packages the [Sortable](https://github.com/SortableJS/Sortable) library
* Inspired by a post by [izzy kestrel](https://bsky.app/profile/iznaut.com/post/3mtyka6yscc2q)
* Uses Bryc's [SplitMix32 PRNG](https://stackoverflow.com/questions/521295/seeding-the-random-number-generator-in-javascript/47593316#47593316)
