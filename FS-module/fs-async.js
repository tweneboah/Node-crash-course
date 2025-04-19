const fs = require('fs').promises
const path = require('path')

//Define a folder and file path
const folderPath = path.join(__dirname,'products')
const filePath = path.join(folderPath,'products.pdf')

//1. Create a directory if it doesn't exists
async function createFolder(){
    try {
        await fs.access(folderPath)
    } catch  {
        await fs.mkdir(folderPath)
        console.log('Folder created');
        
    }
}
 createFolder()

async function writefile(){
    try {
        await fs.writeFile(filePath,'This is for products lists.\n')
        console.log('File created successfully');
        
    } catch (error) {
        console.log(error);
        
    }
}
 writefile()


async function appendToFile(){
    try {
        await fs.appendFile(filePath,'Goods sold.\n')
        console.log('File created successfully');
        
    } catch (error) {
        console.log(error);
        
    }
}

appendToFile()


async function readfile(){
    try {
     const content =   await fs.readFile(filePath, 'utf-8');
        console.log(content);
        
    } catch (error) {
        console.log(error);
        
    }
}

readfile()


async function deleteFile(){
    try {
       await fs.unlink(filePath, );
        console.log('File deleted');
        
    } catch (error) {
        console.log(error);
        
    }
}

//deleteFile()