# CSV-Parse-and-Strigify

## Quick Start
Load to your HTML.
```html
<script src="https://www.ggtk.app/CSV-Parse-and-Stringify/csv-parse-and-stringify.min.js"></script>
```

`CSV.parse(string)` can be used for convert a csv string to a 2-dimensional array.
```javascript
// const csv <- CSV String that was read from <input type="file"> and File API.

const table = CSV.parse(csv);
```

`CSV.stringify(array)` can be used for convert a 2-dimensional array to a csv string.
```javascript
// const arr <- 2-dimensional Array that was created in your program or was received from a server such as Google Apps Script.

const csv = CSV.stringify(table);
```


## Contact
Email: [yuta.nakamizo@ggtk.app](mailto:yuta.nakamizo@ggtk.app)  
Twitter: [@NakamizoYuta](https://mobile.twitter.com/NakamizoYuta)
