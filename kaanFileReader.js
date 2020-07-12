import utils from 'kaantypes';

const file = function(){

  class FileReaderError extends Error{
    constructor(message){
      super(message);
    }
  }

  let readModes = {
    'arraybuffer': 0,
    'text': 1,
    'binarystring': 2,
    'dataurl': 3
  };

  /** Converts a string to integer to use for the Read Mode flag.
   * If readMode parameter is already a valid Flag Integer, return that integer
   *
   */
  function convertReadModeStringToIntegerFlag(readMode){
    if(utils.isInteger(readMode) && readMode >= 0 && readMode < Object.keys(readModes).length){
      return readMode;
    }
    if(utils.isString(readMode.toLowerCase().trim())){
      readMode = readMode.toLowerCase().trim();
    }else{
      throw new FileReaderError("Invalid Read Mode provided");
    }
    if(utils.isObject(readModes, [readMode])){
      return readModes[readMode];
    }else{
      return -1;
    }
  }

  /** Promisified version of the flow to read a file using the FileReader
   * Object in Standard Javascript.
   *
   * @param {blob} A Blob Object to read, (File works too due to inheritence)
   * @param {any} A String or Integer representing reading mode to use.
   *
   * @return {Promise} Resolve is the onsuccess event for FileReader,
   *                   Reject is the onerror event, or a custom event thrown.
   */
  function promisifyReadFile(blob, readMode){
    return new Promise(function(resolve, reject){
      if(!utils.isObject(blob, Blob)){
        reject(new FileReaderError("Invlaid Blob Object Passed to Read File function"));
      }
      let reader = new FileReader();
      reader.onload = function(e){
        resolve(e);
      }
      reader.onerror = function(e){
        reject(e);
      }
      if(utils.isString(readMode)){
        readMode = convertReadModeStringToIntegerFlag(readMode);
      }
      switch(readMode){
        case 0:
          reader.readAsArrayBuffer(blob);
          break;
        case 1:
          reader.readAsText(blob);
          break;
        case 2:
          reader.readAsBinaryString(blob);
          break;
        case 3:
          reader.readAsDataURL(blob);
          break;
        default:
          reject(new FileReaderError("Invalid Read Mode provided"));
      }
    });

  }

  return {
    'read': promisifyReadFile,
    'mode':{
      'ArrayBuffer': readModes['arraybuffer'],
      'Text': readModes['text'],
      'BinaryString': readModes['binarystring'],
      'DataURL': readModes['dataurl']
    }
  };

}();

export default file;
