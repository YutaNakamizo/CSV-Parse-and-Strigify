const CSV = class {
  static parse(string, options) {
    if(typeof string !== "string") throw new TypeError("The argument you set isn't a string.");

    if(!options || !(typeof options==="object" && !Array.isArray(options))) options = {};
    
    const rtnArray = options.linefeed? string.split(options.linefeed) : string.replace(/\r\n/g,"\n").replace(/\r/g,"\n").split("\n"); // <- Split without thinking anything :-)
    let merge_status = {
      merge: false,
      row: -1,
      column: -1
    };

    for(let i=0; i<rtnArray.length; i++) {
      rtnArray[i] = rtnArray[i].split(options.delimiter || ","); // <- Split without thinking anything :-)
      for(let j=0; j<rtnArray[i].length; j++) { // Let's check and modify each cells.
        let cell_value = rtnArray[i][j];
        if(i===rtnArray.length-1 && j===0 && cell_value.replace(/ /g,"")==="") { // <- break; when this cell is [EOF].
          rtnArray.splice(i,1);
          break;
        }
        if(!merge_status.merge && cell_value[0]==="\"") { // Meaning the start of a Wonderful-Cell.
          if(cell_value[cell_value.length-1]!=="\"") {
            merge_status = {merge:true, row:i, column:j};
            cell_value = cell_value.slice(1);
          }
          else cell_value = cell_value.slice(1,-1);
          rtnArray[i][j] = cell_value.replace(/"{2}/g,"\""); // <- Remove \" from the head of the value and replace \"\" to \".
        }
        else if(merge_status.merge) { // Meaning [in / the end of] a Wonderful-Cell.
          cell_value = cell_value.replace(/"{2}/g,"\""); // Restorate separator and replace \"\" to \".
          //console.log(cell_value);
          if(cell_value[cell_value.length-1]==="\"") { // Meaning the end of a Wonderful-Cell.
            merge_status.merge = false;
            cell_value = cell_value.slice(0,-1); // <- Remove "\"" from the end of the value.
          }
          rtnArray[merge_status.row][merge_status.column] += (merge_status.row===i ? ",":"\n") + cell_value; // <- Now, marge.
          rtnArray[i].splice(j--,1);
          if(merge_status.row!==i) {
            rtnArray[merge_status.row] = rtnArray[merge_status.row].concat(rtnArray[i]);
            rtnArray[i] = [];
          }
        }
      }
    }
    for(let i=0; i<rtnArray.length; i++) if(rtnArray[i].length===0) rtnArray.splice(i--,1);
    return rtnArray;
  }

  static stringify(array, options) {
    if(!Array.isArray(array)) throw new TypeError("The argument you set isn't an array.");
    
    if(!options || !(typeof options==="object" && !Array.isArray(options))) options = {};

    const rtnCSV = new Array();
    for(let i=0; i<array.length; i++) {
      if(!Array.isArray(array[i])) throw new TypeError("A row of the argument you set isn't an array.");
      rtnCSV[i] = new Array();
      for(let j=0;  j<array[i].length; j++) {
        let cell_value = array[i][j] || ""; // if array[i][j] is undefined, set empty string.
        const includesNewLine = cell_value.indexOf("\r\n")>-1 || cell_value.indexOf("\r")>-1 || cell_value.indexOf("\n")>-1;
        const includesComma = cell_value.indexOf(",")>-1;
        const includesQuote = cell_value.indexOf("\"")>-1;
        if(includesQuote) cell_value = cell_value.replace(/"/g,"\"\"");
        rtnCSV[i][j] = (includesNewLine || includesComma || includesQuote) ? `"${cell_value}"`:cell_value;
      }
      rtnCSV[i] = rtnCSV[i].join(options.delimiter || ",");
    }
    return rtnCSV.join(options.linefeed || "\n");
  }
};
