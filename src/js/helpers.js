import { async } from 'regenerator-runtime';
import { TIMEOUT_SECONDS } from './config.js';

let timeoutId = '';
const timeout = function (s) {
  return new Promise(function (_, reject) {
    timeoutId = setTimeout(function () {
      reject(new Error(`Request took too long! Timeout after ${s} seconds`));
    }, s * 1000);
  });
};

export const AJAX = async function(url, uploadData = undefined) {
  try {
    const fetchPromise = uploadData 
    ? fetch(url, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(uploadData),
        }) 
    : fetch(url);

        const res = await Promise.race([fetchPromise, timeout(TIMEOUT_SECONDS)]);
        // If we are here then fetch won the race so cancel the timeout
        clearTimeout(timeoutId);
    
        const data = await res.json();
        if (!res.ok) throw new Error(`${data.message} (${res.status})`);
        return data;

      } catch (error) {
        throw error;
      }
}

/*
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

export const sendJSON = async function(url, uploadData){
  try {
    const fetchPromise = fetch(url, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(uploadData),
    });

    const res = await Promise.race([fetchPromise, timeout(TIMEOUT_SECONDS)]);
    clearTimeout(timeoutId);

    const data = await res.json();
    if (!res.ok) throw new Error(`${data.message} (${res.status})`);
    return data;
  } catch (error) {
    throw error;
  }
};
*/