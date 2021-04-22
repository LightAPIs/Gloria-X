/* eslint-disable @typescript-eslint/no-explicit-any */
import SelectionArea from '@simonwep/selection-js';
import { IS_CHROME } from '@/commons/var';

function addStyle(cssContent: string) {
  const style = document.createElement('style'),
    head = document.head || document.getElementsByTagName('head')[0];

  if (head) {
    if (typeof cssContent === 'string') {
      style.innerHTML = cssContent;
    }

    head.appendChild(style);
  }
}

function getClassList(domList: DOMTokenList) {
  const classList: string[] = [];
  domList.forEach(name => {
    if (name !== 'gloria-x-selected') {
      classList.push(name);
    }
  });
  return classList;
}

function cssPath(el: Element) {
  if (!(el instanceof Element)) {
    return '';
  }
  const path: string[] = [];

  while (el.nodeType === Node.ELEMENT_NODE) {
    const nodeName = el.nodeName.toLowerCase();
    let selector = nodeName;

    if (el.id) {
      selector += '#' + el.id;
    } else if (el.className) {
      const classList = getClassList(el.classList);
      let sib = el.previousElementSibling,
        nth = 1;
      for (; sib; sib = sib.previousElementSibling) {
        if (sib.nodeType === Node.ELEMENT_NODE) {
          if (sib.className) {
            let ct = true;
            for (const c of classList) {
              if (!sib.classList.contains(c)) {
                ct = false;
                break;
              }
            }
            ct && nth++;
          }
        }
      }

      if (nth > 1) {
        selector += `:nth-of-type(${nth})`;
      } else {
        const className = classList.length > 0 ? '.' + classList.join('.') : null;
        if (className) {
          selector += className;
        }
      }
    } else {
      let sib = el.previousElementSibling,
        nth = 1;
      for (; sib; sib = sib.previousElementSibling) {
        if (sib.nodeType === Node.ELEMENT_NODE) {
          if (sib.nodeName.toLowerCase() === nodeName) {
            nth++;
          }
        }
      }

      if (nth > 1) {
        selector += `:nth-of-type(${nth})`;
      }
    }

    path.unshift(selector);
    el = el.parentNode as Element;
  }

  return path.join(' > ');
}

function displayTips() {
  let tips = document.getElementById('gloria-x-message-alert-tips');
  if (!tips) {
    tips = document.createElement('div');
    tips.id = 'gloria-x-message-alert-tips';
    tips.textContent = chrome.i18n.getMessage('debugTestCreateTip');

    document.body.appendChild(tips);
  }
  tips.style.display = 'flex';

  window.setTimeout(() => {
    if (tips) {
      tips.style.display = 'none';
    }
  }, 2000);
}

function handler(e: Event) {
  e.stopPropagation();
  e.preventDefault();
  return false;
}

if ((window as any).gloriaXContentScriptInjected !== true) {
  (window as any).gloriaXContentScriptInjected = true;
  console.debug('Gloria-X: Inject content script.');

  if ((window as any).gloriaXAddedCss !== true) {
    addStyle(`
      .selection-area {
        background: rgba(46, 115, 252, 0.11);
        border: 2px solid rgba(98, 155, 255, 0.81);
        border-radius: 0.1em;
      }
      .gloria-x-selected {
        background: hsl(100, 80%, 65%);
        border: 2px solid rgba(0, 0, 0, 0.075);
      }
      #gloria-x-message-alert-tips {
        position: fixed;
        z-index: 10000;
        min-width: 380px;
        top: 36px;
        left: 50%;
        align-items: center;
        justify-content: center;
        text-align: center;
        color: #449a46;
        font-size: 14px;
        line-height: 1;
        background-color: #f0f9eb;
        border: 1px solid #d6e9c6;
        border-radius: 5px;
        box-sizing: border-box;
        transform: translateX(-50%);
        transition: opacity .3s,transform .4s,top .4s;
        padding: 15px 15px 15px 20px;
        overflow: hidden;
        display: none;
      }`);
    (window as any).gloriaXAddedCss = true;
  }

  const selection = new SelectionArea({
    document: window.document,
    class: 'selection-area',
    container: 'body',
    selectables: [
      'a',
      'abbr',
      'address',
      'b',
      'bdi',
      'blockquote',
      'button',
      'caption',
      'cite',
      'code',
      'col',
      'dd',
      'del',
      'dfn',
      'dialog',
      'div',
      'dl',
      'dt',
      'em',
      'h1',
      'h2',
      'h3',
      'h4',
      'h5',
      'h6',
      'i',
      'ins',
      'label',
      'legend',
      'li',
      'mark',
      'option',
      'p',
      'pre',
      'q',
      'small',
      'span',
      'strong',
      'td',
      'th',
      'tt',
    ],
    startareas: ['html'],
    boundaries: ['html'],
    startThreshold: 10,
    allowTouch: false,
    intersect: 'cover',
    overlap: 'invert',
    singleTap: {
      allow: true,
      intersect: 'native',
    },
    scrolling: {
      speedDivider: 10,
      manualSpeed: 750,
    },
  });

  selection
    .on('start', ({ store, event }) => {
      if (event && !event.ctrlKey && !event.metaKey) {
        for (const el of store.stored) {
          el.classList.remove('gloria-x-selected');
        }

        selection.clearSelection();
      }
    })
    .on(
      'move',
      ({
        store: {
          changed: { added, removed },
        },
      }) => {
        for (const el of added) {
          let sel = true;
          el.childNodes.forEach(node => {
            if (node.nodeType !== Node.TEXT_NODE) {
              sel = false;
            }
          });
          if (sel) {
            el.classList.add('gloria-x-selected');
          }
        }

        for (const el of removed) {
          el.classList.remove('gloria-x-selected');
        }
      }
    )
    .on('stop', () => {
      selection.keepSelection();
      selection.getSelection().forEach(el => {
        let sel = true;
        el.childNodes.forEach(node => {
          if (node.nodeType !== Node.TEXT_NODE) {
            sel = false;
          }
        });
        if (!sel) {
          el.classList.remove('gloria-x-selected');
          selection.deselect(el);
        }
      });

      const finalSelected = new Set(selection.getSelection());
      finalSelected.forEach(el => {
        let sel = true;
        el.childNodes.forEach(node => {
          if (node.nodeType !== Node.TEXT_NODE) {
            sel = false;
          }
        });
        if (!sel) {
          el.classList.remove('gloria-x-selected');
          selection.deselect(el);
          finalSelected.delete(el);
        }
      });

      const pathList: string[] = [];
      finalSelected.forEach(el => {
        pathList.push(cssPath(el));
      });

      if (IS_CHROME) {
        chrome.runtime.sendMessage({
          type: 'path',
          data: pathList,
        });
      } else {
        chrome.runtime.sendMessage({
          type: 'firefox-message',
          data: {
            type: 'path',
            data: pathList,
          },
        });
      }
    });

  document.addEventListener('click', handler, true);

  window.document.documentElement.setAttribute('style', 'overflow-x: scroll; margin-bottom: 300px; padding-bottom: 300px;');

  const generation = document.createElement('iframe');
  generation.id = 'gloria-x-generation-iframe';
  generation.setAttribute(
    'style',
    `border: 2px solid #1f2d48; position: fixed !important; bottom: 0px !important; right: 0px !important; z-index: 999999; height: 295px !important; width: calc(100% - 4px) !important; box-sizing: border-box;`
  );
  generation.src = chrome.runtime.getURL('generation.html');
  document.body.after(generation);

  chrome.runtime.onMessage.addListener(function listener(message, _sender, response) {
    const { type, data } = message;
    if (type === 'getPageUrl') {
      response(location.href);
    } else if (type === 'directive') {
      if (data === 'disableSelection') {
        selection.disable();
      } else if (data === 'enableSelection') {
        selection.enable();
      }
    } else if (type === 'float') {
      if (data === 'minus') {
        generation.setAttribute(
          'style',
          `border: 2px solid #1f2d48; position: fixed !important; bottom: 0px !important; right: 0px !important; z-index: 999999; height: 40px !important; width: 200px !important; box-sizing: border-box;`
        );
      } else if (data === 'plus') {
        generation.setAttribute(
          'style',
          `border: 2px solid #1f2d48; position: fixed !important; bottom: 0px !important; right: 0px !important; z-index: 999999; height: 295px !important; width: calc(100% - 4px) !important; box-sizing: border-box;`
        );
      } else if (data === 'left') {
        generation.setAttribute(
          'style',
          `border: 2px solid #1f2d48; position: fixed !important; bottom: 0px !important; left: 0px !important; z-index: 999999; height: 40px !important; width: 200px !important; box-sizing: border-box;`
        );
      } else if (data === 'right') {
        generation.setAttribute(
          'style',
          `border: 2px solid #1f2d48; position: fixed !important; bottom: 0px !important; right: 0px !important; z-index: 999999; height: 40px !important; width: 200px !important; box-sizing: border-box;`
        );
      }
    } else if (type === 'destroy' || type === 'completion') {
      document.removeEventListener('click', handler, true);
      selection.getSelection().forEach(el => {
        el.classList.remove('gloria-x-selected');
      });
      selection.destroy();
      chrome.runtime.onMessage.removeListener(listener);
      const oldIFrame = document.getElementById('gloria-x-generation-iframe');
      if (oldIFrame) {
        try {
          (oldIFrame as HTMLIFrameElement).src = 'about:blank';
          oldIFrame.remove();
          window.document.documentElement.setAttribute('style', '');
          (window as any).gloriaXContentScriptInjected = false;
        } catch (e) {
          console.error(e);
        }
      }
      if (type === 'completion') {
        displayTips();
      }
    }
  });
}
