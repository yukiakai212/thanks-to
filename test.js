//bruh!
import { dirname } from './src/index.js';

const failedMessage = 'FAILED: ';
if (dirname() !== import.meta.dirname) throw new Error(failedMessage + dirname());

console.log('Passed non function');
function normal() {
  if (dirname() !== import.meta.dirname) throw new Error(failedMessage + dirname());
  console.log('Passed function');
}
normal();

const arrow = () => {
  if (dirname() !== import.meta.dirname) throw new Error(failedMessage + dirname());
  console.log('Passed arrow function');
};
arrow();
setTimeout(() => {
  if (dirname() !== import.meta.dirname) throw new Error(failedMessage + dirname());
  console.log('Passed calback function');
}, 1);

(() => {
  if (dirname() !== import.meta.dirname) throw new Error(failedMessage + dirname());
  console.log('Passed anonymous function');
})();
