//fetcher.js
const url = process.argv[2];
const filePath = process.argv[3];
const request = require('request');
const fs = require('fs');
const readline = require('readline');

if (!filePath) { //filepath is empty, exit
  console.log("Filepath is invalid!");
  process.exit(1);
}
// check whether filePath is writable,if not, exit
fs.access(filePath,fs.constants.W_OK,(err)=>{
  if (err) {
    console.log(`${filePath} is invalid!`);
    process.exit(1);
  }
});

request(url, (error,response,body) => {

  if (error) { //Invalid URL, exit
    console.error(`Invalid URL: ${url}`);
    process.exit(1);
  }

  fs.access(filePath,fs.constants.F_OK,(err) =>{
    if (!err) {//if file exists, ask user overwrite or not
        
      const r1 = readline.createInterface({
        input:process.stdin,
        output: process.stdout
      });

      r1.question(`${filePath} already exists. Do you want to overwrite it? (Y/n)`,(answer)=>{
        if (answer.trim().toLowerCase() !== 'y') {
          console.log('Aborting download.');
          r1.close();
          return;
        }
        downloadFile(filePath,body);
        r1.close();
      });

    } else { //if file doesn't exist, download it directly
      downloadFile(filePath,body);
    }
  });
});

//Function: write file to assigned filePath
const downloadFile = (filePath, body)=>{
  fs.writeFile(filePath, body, err =>{
    if (err) {
      console.error(err);
    }
    console.log(`Downloaded and saved ${body.length} bytes to ${filePath}`);
  });

};






