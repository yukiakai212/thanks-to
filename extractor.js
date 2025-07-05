'use strict';

const esm = (str) => {
  const regex = /(file:\/\/\/?.*?):\d+:\d+/;
  const file = str.match(regex)?.[2];
  return file;
};
const cjs = (str) => {
  const regex = /\((.*?):\d+:\d+\)/;
  const file = str.match(regex)?.[1];
  return file;
};
const cjsNon = (str) => {
  const regex = /at (.*?):\d+:\d+/;
  const file = str.match(regex)?.[1];
  return file;
};
export { esm, cjs, cjsNon };
