calctorio
=============

Angular 2 rewrite of the excellent rubyruy/factorio-calc optimizing tool for the Factorio game.

# Contribute a data source #

Additional data sources are welcome - the calculator should work just fine with mods!

- Fork this repository
- Add a file containing the recipe dumps in JSON to the `app/data` folder:
    + Choose a short descriptive name without any periods (dashes are ok)
    + Concentrate all recipe files into one in the `extract` folder

      e.g. `cat factorio/data/base/prototypes/recipe/*.lua > calctorio/extract/core-2-0-0.lua`
    + Change the `doFile()` command in `extract/extract.lua` to match your dump lua file. Run `extract.lua` and save
      the output into the `data` folder

      e.g. `lua extract.lua > ../app/data/core-2-0-0.json`

- Send me a pull request form your branch, and that's it!


## Credits ##

This is a fork off of [rubyruy's](https://github.com/rubyruy) [factorio-calc](https://github.com/rubyruy/factorio-calc) project. I forked it primarily
to learn about Angular 2 but also to try to enhance the original project and add new features.


