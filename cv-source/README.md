# CV source

The CV retains the supplied `resume-openfont` template and its Lato and Raleway
fonts. The class, styles and template licence accompany `resume.tex`.

Use XeLaTeX with the original `fonts/Lato/` and `fonts/Raleway/` directories from
the author's Overleaf project. Font files and build intermediates are not
published in this repository. The TeX distribution must provide `fontawesome`,
`fontspec`, `xltxtra`, `xunicode` and the packages required by the class.

From this directory:

```sh
mkdir -p build
xelatex -interaction=nonstopmode -halt-on-error -output-directory=build build.tex
xelatex -interaction=nonstopmode -halt-on-error -output-directory=build build.tex
```

`build.tex` resolves the TeX-distributed FontAwesome OpenType file by filename;
it does not change the template's typography or require a system font install.
Inspect every page before copying `build/build.pdf` to
`../files/cv/CV_Jose_Ignacio_Gonzalez_Rojas.pdf` and updating its website URL.
