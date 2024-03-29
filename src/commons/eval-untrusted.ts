/* eslint-disable @typescript-eslint/no-explicit-any */
import { createGloriaSandbox } from 'gloria-sandbox';
import store from '@/store';

function getOrigin(url: string): string {
  return new URL(url).origin;
}

function inflatedRequestHeaders(details: chrome.webRequest.WebRequestHeadersDetails): chrome.webRequest.BlockingResponse {
  const { rules } = store.state;
  const { requestHeaders = [], requestId, url, type, initiator } = details;
  let cookieIndex = -1,
    originIndex = -1,
    refererIndex = -1;

  const idName = 'request.id.' + requestId,
    inflateName = 'request.inflate.' + url,
    imageName = 'request.image.' + url;

  if (initiator && initiator.includes(chrome.i18n.getMessage('@@extension_id'))) {
    if (window.sessionStorage[idName]) {
      for (let i = 0; i < requestHeaders.length; i++) {
        const header = requestHeaders[i];
        if (header && header.name) {
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

      let data = {
        cookie: '',
        referer: '',
        origin: '',
      };
      try {
        data = JSON.parse(window.sessionStorage[idName]);
      } catch (e) {
        console.error(e);
        data = {
          cookie: '',
          referer: '',
          origin: '',
        };
      }

      if (cookieIndex === -1) {
        requestHeaders.push({
          name: 'Cookie',
          value: data.cookie || '',
        });
      }
      if (refererIndex === -1) {
        requestHeaders.push({
          name: 'Referer',
          value: data.referer || url,
        });
      }
      if (originIndex !== -1) {
        if (requestHeaders[originIndex].value === 'null') {
          requestHeaders[originIndex].value = data.origin || getOrigin(url);
        }
      } else {
        requestHeaders.push({
          name: 'Origin',
          value: data.origin || getOrigin(url),
        });
      }
    } else if (window.sessionStorage[inflateName]) {
      try {
        window.sessionStorage[idName] = window.sessionStorage[inflateName];
      } catch (e) {
        if ((e as any).name === 'QuotaExceededError') {
          Object.keys(window.sessionStorage).forEach(key => {
            if (key !== idName && key !== inflateName) {
              window.sessionStorage.removeItem(key);
            }
          });
          window.sessionStorage[idName] = window.sessionStorage[inflateName];
        } else {
          console.error(e);
        }
      }

      let isSendByGloria = false;
      for (let i = 0; i < requestHeaders.length; i++) {
        const header = requestHeaders[i];
        if (header && header.name) {
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
        let data = {
          cookie: '',
          referer: '',
          origin: '',
        };
        try {
          data = JSON.parse(window.sessionStorage[inflateName]);
        } catch (e) {
          console.error(e);
          data = {
            cookie: '',
            referer: '',
            origin: '',
          };
        }

        if (cookieIndex === -1) {
          requestHeaders.push({
            name: 'Cookie',
            value: data.cookie || '',
          });
        }
        if (refererIndex === -1) {
          requestHeaders.push({
            name: 'Referer',
            value: data.referer || url,
          });
        }
        if (originIndex !== -1) {
          if (requestHeaders[originIndex].value === 'null') {
            requestHeaders[originIndex].value = data.origin || getOrigin(url);
          }
        } else {
          requestHeaders.push({
            name: 'Origin',
            value: data.origin || getOrigin(url),
          });
        }
      }
    } else if (type === 'image' && window.sessionStorage[imageName]) {
      refererIndex = -1;
      for (let i = 0; i < requestHeaders.length; i++) {
        const header = requestHeaders[i];
        if (header && header.name && header.name.toLowerCase() === 'referer') {
          refererIndex = i;
        }
      }

      if (refererIndex === -1) {
        let data = {
          referer: '',
        };
        try {
          data = JSON.parse(window.sessionStorage[imageName]);
        } catch (e) {
          console.error(e);
          data = {
            referer: '',
          };
        }

        requestHeaders.push({
          name: 'Referer',
          value: data.referer || url,
        });
      }
    }

    //! 添加自定义清求头信息
    rules.forEach(rule => {
      const { domain, headers } = rule;
      if (url.includes(domain)) {
        headers.forEach(header => {
          const { name, value } = header;
          if (name) {
            const useName = name.replace(/\s/g, '');
            let rep = false;
            for (let i = 0; i < requestHeaders.length; i++) {
              const reqHeader = requestHeaders[i];
              if (reqHeader && reqHeader.name) {
                if (reqHeader.name.toLowerCase() === useName.toLowerCase()) {
                  requestHeaders[i].value = value;
                  rep = true;
                  break;
                }
              }
            }

            if (!rep) {
              requestHeaders.push({
                name: useName,
                value,
              });
            }
          }
        });
      }
    });
  }

  return {
    requestHeaders,
  };
}

function evalUntrusted(code: string): Promise<myStore.CommitData | myStore.CommitData[]> {
  return new Promise((resolve, reject) => {
    //? 处理当任务代码中不存在 commit 函数时，无法触发任务"完成"/"出错"的问题
    const timeout = window.setTimeout(() => {
      window.clearTimeout(timeout);
      reject('timeout');
    }, 1000 * 65);

    createGloriaSandbox().then((sandbox: any) => {
      sandbox.addEventListener('error', ({ detail }: any) => {
        window.clearTimeout(timeout);
        reject(detail);
      });
      sandbox.addEventListener('commit', ({ detail }: any) => {
        window.clearTimeout(timeout);
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
          window.clearTimeout(timeout);
          reject(err);
          sandbox.destroy();
        });
    });
  });
}

export { inflatedRequestHeaders, evalUntrusted };
