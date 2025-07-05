//bruh!
import 'dotenv/config';
import fs from 'node:fs';
import path from 'node:path';
import module from 'node:module';
const require = module.createRequire(import.meta.url);
const source = './test.js';
const dataSource = fs.readFileSync(source).toString();
const dataMap = dataSource.split('\n');
const fileEMS = './temp_test.js';
const fileCJS = './temp_test.cjs';
let dataCJS = [...dataMap];
let dataESM = [...dataMap];
for (let i = 0; i < dataMap.length; i++) {
  if (dataMap[i].trim().startsWith('import')) {
    dataESM[i] = dataMap[i].replace('./src/index.js', './dist/index.js');
    dataCJS[i] = 'const {dirname} = require("./dist/index.cjs");';
  }
}
fs.writeFileSync(fileCJS, dataCJS.join('\n').replaceAll('import.meta.dirname', '__dirname'));
fs.writeFileSync(fileEMS, dataESM.join('\n'));
console.log('start testing.....');
console.log('TESTING CJS.....');
require(fileCJS);
console.log('PASSED CJS');
console.log('TESTING ESM CORE');
await import(source);
console.log('PASSED ESM CORE');
console.log('TESTING ESM BUILD');
await import(fileEMS);
console.log('PASSED ESM BUILD');

console.log('Clean');
fs.unlinkSync(fileEMS);
fs.unlinkSync(fileCJS);
console.log(`
  ******       ******
 ********     ********
**********   **********
***********************
***********************
***********************
 *****  Chino  *****  
  *****************
    *************
      *******
        ***
         *
`);
