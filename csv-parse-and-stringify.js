const CSV = class {
  static parse(string) {
    if(typeof string !== "string") {
      console.error("Type Error: The argument you set isn't string.");
      return [[]];
    }

    const rtnArray = string.replace(/\r\n/g,"\n").replace(/\r/g,"\n").split("\n"); // <- Split without thinking anything :-)
    const marge_status = {
      marge: false,
      row: -1,
      colmun: -1
    };

    for(let i=0; i<rtnArray.length; i++) {
      rtnArray[i] = rtnArray[i].split(","); // <- Split without thinking anything :-)
      for(let j=0; j<rtnArray[i].length; j++) { // Let's check and modify each cells.
        let cell_value = rtnArray[i][j];
        if(i===rtnArray.length-1 && j===0 && cell_value==="") { // <- break; when this cell is [EOF].
          rtnArray.splice(i,1);
          break;
        }
        if(!marge_status.marge && cell_value[0]==="\"") { // Meaning the start of a Wonderful-Cell.
          if(cell_value[cell_value.length-1]!=="\"") {
            marge_status.marge = true;
            marge_status.row = i;
            marge_status.colmun = j;
            cell_value = cell_value.slice(1);
          }
          else cell_value = cell_value.slice(1,-1);
          rtnArray[i][j] = cell_value.replace(/"{2}/g,"\""); // <- Remove \" from the head of the value and replace \"\" to \".
        }
        else if(marge_status.marge) { // Meaning [in / the end of] a Wonderful-Cell.
          cell_value = cell_value.replace(/"{2}/g,"\""); // Restorate separator and replace \"\" to \".
          //console.log(cell_value);
          if(cell_value[cell_value.length-1]==="\"") { // Meaning the end of a Wonderful-Cell.
            marge_status.marge = false;
            cell_value = cell_value.slice(0,-1); // <- Remove "\"" from the end of the value.
          }
          rtnArray[marge_status.row][marge_status.colmun] += (marge_status.row===i ? ",":"\r\n") + cell_value; // <- Now, marge.
          rtnArray[i].splice(j--,1);
          if(marge_status.row!==i) {
            rtnArray[marge_status.row] = rtnArray[marge_status.row].concat(rtnArray[i]);
            rtnArray[i] = [];
          }
        }
      }
    }
    for(let i=0; i<rtnArray.length; i++) if(rtnArray[i].length===0) rtnArray.splice(i--,1);
    return rtnArray;
  }

  static stringify(array) {
    if(!Array.isArray(array)) {
      console.error("Type Error: The argument you set isn't array.");
      return "";
    }

    const rtnCSV = new Array();
    for(let i=0; i<array.length; i++) {
      if(!Array.isArray(array[i])) {
        console.error("Type Error: A row of the argument you set isn't array.");
        return "";
      }
      rtnCSV[i] = new Array();
      for(let j=0; j<array[i].length; j++) {
        let cell_value = array[i][j] || ""; // if array[i][j] is undefined, set empty string.
        const includesNewLine = cell_value.indexOf("\r\n")>-1 || cell_value.indexOf("\r")>-1 || cell_value.indexOf("\n")>-1;
        const includesComma = cell_value.indexOf(",")>-1;
        const includesQuote = cell_value.indexOf("\"")>-1;
        if(includesQuote) cell_value = cell_value.replace(/"/g,"\"\"");
        rtnCSV[i][j] = (includesNewLine || includesComma || includesQuote) ? `"${cell_value}"`:cell_value;
      }
      rtnCSV[i] = rtnCSV[i].join(",");
    }
    return rtnCSV.join("\r\n");
  }
};
