Guitar tab player. See https://darthvanger.github.io/guitar-tab-player/

Paste any tab and you have a good chance it will play it :)

The sound is synthesized using the [Karplus-Strong algorithm](https://en.wikipedia.org/wiki/Karplus%E2%80%93Strong_string_synthesis) - see the `src/GuitarString.js` file.

The code to analyze the tab text and figure out which notes to play is in `src/index.js`. It is not really well-thought, so it doesn't work for some tabs, depending on the tab format (syntax).
