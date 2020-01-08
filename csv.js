const CSV = class {
  static parse(_string, _options) {
    // Validate the arguments.
    if(typeof _string !== "string") throw new TypeError("You must give a string as a first argument.");
    const string = _string;
    const options = (!_options || !(typeof _options==="object"))? {} : _options;

    // data holders
    const converted = [];
    let target_row = [];
    let target_cell = "";

    // status holders
    let isInsideOfSpecialCell = false;
    let isExpectedEndOfSpecialCell = false;
    let isExpectedCRLFAtEndOfCell = false;

    // Check CSV per each character.
    for(let c of string) {
      switch(c) {
        case options.delimiter || ',':
          if(isInsideOfSpecialCell) {
            if(!isExpectedEndOfSpecialCell) {
              target_cell += c;
              break;
            }
            else { // <- It was end of special cell.
              isInsideOfSpecialCell = false;
              isExpectedEndOfSpecialCell = false;
            }
          }
          target_row.push(target_cell); // <-- Complete current cell.
          target_cell = "";
          break;
        case '\r':
          isExpectedCRLFAtEndOfCell = true;
        case '\n':
          if(isInsideOfSpecialCell) {
            if(!isExpectedEndOfSpecialCell) {
              target_cell += c;
              break;
            }
            else { // <- It was end of special cell.
              isInsideOfSpecialCell = false;
              isExpectedEndOfSpecialCell = false;
            }
          }
          if(!isExpectedCRLFAtEndOfCell) {
            target_row.push(target_cell); // <- Complete current cell.
            target_cell = "";
            converted.push(target_row); // <- Complete current row.
            target_row = [];
          }
          else isExpectedCRLFAtEndOfCell = false;
          break;
        case '\"':
          if(!isInsideOfSpecialCell) {
            isInsideOfSpecialCell = true; // <- Update status.
            break;
          }
          else {
            if(isExpectedEndOfSpecialCell) target_cell += '\"'; // <- It was NOT end of special cell.
            isExpectedEndOfSpecialCell = !isExpectedEndOfSpecialCell;
            break;
          }
        default:
          target_cell += c;
          break;
      }
    }
    if(converted[0] && (target_row.length === converted[0].length-1)) {
      target_row.push(target_cell);
      converted.push(target_row);
    }

    return converted;
  }


  static stringify(_table, _options) {
    // Validate the arguments.
    if(!Array.isArray(_table)) throw new TypeError("You must give a array at 1st argument.");
    const table = _table
    
    const options = (!_options || !(typeof _options==="object"))? {} : _options;

    const converted = [];
    for(let row of table) {
      if(!Array.isArray(row)) throw new TypeError("You must give a 2-dimentional array at 1st argument.");
      const converted_row = [];
      for(let cell of row) {
        const cell_value = cell || ""; // if cell is undefined, set empty string.
        const includesNewLine = cell_value.includes("\r\n") || cell_value.includes('\r') || cell_value.includes('\n');
        const includesDelimiter = cell_value.includes(options.delimiter || ',');
        const includesQuote = cell_value.includes("\"");
        if(includesQuote) cell_value = cell_value.replace(/"/g,"\"\"");
        converted_row.push((includesNewLine || includesDelimiter || includesQuote)? `"${cell_value}"` : cell_value);
      }
      converted.push(converted_row.join(options.delimiter || ','));
    }
    return converted.join(options.linefeed || '\n');
  }
};



export default CSV;

