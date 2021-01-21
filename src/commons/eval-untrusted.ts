import { each, toLower } from 'lodash';
import GloriaSandbox from 'gloria-sandbox';

function getOrigin(url: string) {
  return new URL(url).origin;
}

function inflatedRequestHeaders(details: chrome.webRequest.WebRequestHeadersDetails) {
  const { requestHeaders = [], requestId, url } = details;
  let cookieIndex, originIndex, refererIndex;

  if (window.sessionStorage['request.id.' + requestId]) {
    for (let i = 0; requestHeaders.length; i++) {
      switch (toLower(requestHeaders[i].name)) {
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
        each(Object.keys(window.sessionStorage), (key: string) => {
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
      switch (toLower(header.name)) {
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
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    return new GloriaSandbox().then((sandbox: any) => {
      sandbox.once('commit', (details: object) => {
        resolve(details);
        sandbox.destroy();
      });
      sandbox.eval(code).catch((err: unknown) => {
        reject(err);
        sandbox.destroy();
      });
    });
  });
}

export { inflatedRequestHeaders, evalUntrusted };
