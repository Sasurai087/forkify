import { async } from 'regenerator-runtime';
import { TIMEOUT_SECONDS } from './config.js';

let timeoutId;
const timeout = function (s) {
  return new Promise(function (_, reject) {
    timeoutId = setTimeout(function () {
      reject(new Error(`Request took too long! Timeout after ${s} seconds`));
    }, s * 1000);
  });
};

export const getJSON = async function(url){
  try {
    const fetchPromise = fetch(url);
    const res = await Promise.race([fetchPromise, timeout(TIMEOUT_SECONDS)]);
    // If we are here then fetch won the race so cancel the timeout
    clearTimeout(timeoutId);

    const data = await res.json();

    if (!res.ok) throw new Error(`${data.message} (${res.status})`);
    return data;
  } catch (error) {
    throw error;
  }
};