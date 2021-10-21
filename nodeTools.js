const fs = require('fs').promises
const fsSync = require('fs')


exports.readFile = async (filePath) =>{
    try {
        const data = await fs.readFile(filePath);
        console.log(data.toString());
        return data
      } catch (error) {
        console.error(`Got an error trying to read the file: ${error.message}`);
      }
}


exports.deleteFile = async (filePath) =>{
  try {
    await fs.unlink(filePath);
    console.log(`Deleted ${filePath}`);
  } catch (error) {
    console.error(`Got an error trying to delete the file: ${error.message}`);
  }
  /*  Warning: When you delete the file with the unlink() function, it is not sent to your recycle bin or trash can 
           but permanently removed from your filesystem. This action is not reversible, so please be certain that 
           you want to remove the file before executing your code. */
}


exports.moveFile = async (source, destination) =>{  
  try {
    await fs.rename(source, destination);
    console.log(`Moved file from ${source} to ${destination}`);
  } catch (error) {
    console.error(`Got an error trying to move the file: ${error.message}`);
  }
  // filename must be included in destination as rename is supported   TODO:  ptete mettre filename comme parametre a la function
}


exports.saveFile = async (source, destination) =>{  
  try {
    await fs.writeFile(destination, source);
    console.log(`Saved file to ${destination}`);
  } catch (error) {
    console.error(`Got an error trying to move the file: ${error.message}`);
  }
}


// Check is path or file is valid
exports.isExisting = async (path) => {
  if(fsSync.existsSync(path))    return true
  else return false
}



exports.isObjEmpty =  (obj) => {
  for(let i in obj) return false
  return true
}