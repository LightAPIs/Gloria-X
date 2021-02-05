/* eslint-disable @typescript-eslint/no-explicit-any */
import { createGloriaSandbox } from 'gloria-sandbox';

function getOrigin(url: string) {
  return new URL(url).origin;
}

function inflatedRequestHeaders(details: chrome.webRequest.WebRequestHeadersDetails) {
  const { requestHeaders = [], requestId, url } = details;
  let cookieIndex, originIndex, refererIndex;

  if (window.sessionStorage['request.id.' + requestId]) {
    for (let i = 0; requestHeaders.length; i++) {
      const header = requestHeaders[i];
      if (header.name) {
        switch (header.name.toLowerCase()) {
          case 'cookie':
            cookieIndex = i;
            break;
          case 'origin':
            originIndex = i;
            break;
          case 'referer':
            refererIndex = i;
            break;
        }
      }
    }
    const data = JSON.parse(window.sessionStorage['request.id.' + requestId]);
    if (!cookieIndex) {
      requestHeaders.push({
        name: 'Cookie',
        value: data.cookie || '',
      });
    }
    if (!refererIndex) {
      requestHeaders.push({
        name: 'Referer',
        value: data.referer || url,
      });
    }
    if (originIndex) {
      if (requestHeaders[originIndex].value === 'null') {
        requestHeaders[originIndex].value = data.origin || getOrigin(url);
      }
    } else {
      requestHeaders.push({
        name: 'Origin',
        value: data.origin || getOrigin(url),
      });
    }
  } else if (window.sessionStorage['request.inflate.' + url]) {
    try {
      window.sessionStorage['request.id.' + requestId] = window.sessionStorage['request.inflate.' + url];
    } catch (e) {
      if (e.name === 'QuotaExceededError') {
        Object.keys(window.sessionStorage).forEach(key => {
          if (key !== 'request.id.' + requestId && key !== 'request.inflate.' + url) {
            window.sessionStorage.removeItem(key);
          }
        });
        window.sessionStorage['request.id.' + requestId] = window.sessionStorage['request.inflate.' + url];
      } else {
        console.error(e);
      }
    }

    let isSendByGloria = false;
    for (let i = 0; i < requestHeaders.length; i++) {
      const header = requestHeaders[i];
      if (header.name) {
        switch (header.name.toLowerCase()) {
          case 'send-by':
            if (header.name === 'Gloria') {
              isSendByGloria = true;
            }
            break;
          case 'cookie':
            cookieIndex = i;
            break;
          case 'origin':
            originIndex = i;
            break;
          case 'referer':
            refererIndex = i;
            break;
        }
      }
    }
    if (isSendByGloria) {
      const data = JSON.parse(window.sessionStorage['request.inflate.' + url]);
      if (!cookieIndex) {
        requestHeaders.push({
          name: 'Cookie',
          value: data.cookie || '',
        });
      }
      if (!refererIndex) {
        requestHeaders.push({
          name: 'Referer',
          value: data.referer || url,
        });
      }
      if (originIndex) {
        if (requestHeaders[originIndex].value === 'null') {
          requestHeaders[originIndex].value = data.origin || getOrigin(url);
        }
      } else {
        requestHeaders.push({
          name: 'Origin',
          value: data.origin || url,
        });
      }
    }
  }
  return {
    requestHeaders,
  };
}

function evalUntrusted(code: string) {
  return new Promise((resolve, reject) => {
    createGloriaSandbox().then((sandbox: any) => {
      sandbox.addEventListener('error', ({ detail }: any) => {
        reject(detail);
      });
      sandbox.addEventListener('commit', ({ detail }: any) => {
        resolve(detail);
        sandbox.destroy();
      });
      sandbox
        .execute(code, 1000 * 60)
        .then(() => {
          //? 若不注销，当任务代码中不存在 commit 函数时，会造成内存泄漏
          sandbox.destroy();
        })
        .catch((err: unknown) => {
          reject(err);
          sandbox.destroy();
        });
    });
  });
}

export { inflatedRequestHeaders, evalUntrusted };
