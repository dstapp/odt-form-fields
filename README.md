# odt-form-fields

NodeJS module (tested with v7) to manipulate form fields in *.odt (OpenDocument Text Document) documents.

## Node version

* >= 7

## Example

```
const OdtFormFields = require('./index.js');
const fs = require('fs');
const path = require('path');

let content = fs.readFileSync(path.resolve(__dirname, 'example.odt'), 'binary');

let odtff = new OdtFormFields();
odtff.load(content)
    .then(() => {
        return odtff
            .setTextbox('Textfeld 1', 'this is generated')
            .setCheckbox('Markierfeld 1', true)
            .apply()
    })
    .then(() => {
        odtff.getStream()
            .pipe(fs.createWriteStream('./result.odt'))
            .on('finish', function () {
                console.log('result.odt written.');
            });
    });

```

## Limitations

The library currently can manipulate:

* Textbox
* Checkbox

## License

```
MIT License

Copyright (c) 2017 David Prandzioch

Permission is hereby granted, free of charge, to any person obtaining a copy
of this software and associated documentation files (the "Software"), to deal
in the Software without restriction, including without limitation the rights
to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
copies of the Software, and to permit persons to whom the Software is
furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all
copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
SOFTWARE.
```
