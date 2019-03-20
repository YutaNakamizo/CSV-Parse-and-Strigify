const CSV = class {
  static parse(string) {
    const rtnArray = new Array();
    const first_split = string.replace(/\r\n/g,"\n").replace(/\r/g,"\n").split("\n"); // <- Split without thinking anything :-)

    const marge_status = {
      marge: false,
      row: -1,
      colmun: -1
    };

    for(let i=0; i<first_split.length; i++) {
      rtnArray[i] = first_split[i].split(","); // <- Split without thinking anything :-)

      for(let j=0; j<rtnArray[i].length; j++) { // Let's check and modify each cells.
        let cell_value = rtnArray[i][j];

        if(!marge_status.marge && cell_value[0]==="\"") { // Meaning the start of a Wonderful-Cell.
          marge_status.marge = true;
          marge_status.row = i;
          marge_status.colmun = j;

          rtnArray[i][j] = cell_value.slice(1); // <- Remove "\"" from the head of the value.
        }
        if(marge_status.marge) { // Meaning [in / the end of] a Wonderful-Cell.
          if(cell_value[cell_value.length-1]==="\"") { // Meaning the end of a Wonderful-Cell.
            marge_status.marge = false;
            cell_value = cell_value.slice(0,-1); // <- Remove "\"" from the end of the value.
          }
          rtnArray[marge_status.row][marge_status.colmun] += (marge_status.row!==i ? "\r\n":"") + cell_value; // <- Now, marge and...
          rtnArray[i].splice(j,1); // <- remove incollect cell.
        }
      }
    }

    return rtnArray;
  }

  static stringify(array, option) {
  }
};
