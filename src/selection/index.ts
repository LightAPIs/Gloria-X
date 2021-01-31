/* eslint-disable @typescript-eslint/no-explicit-any */
import SelectionArea from '@simonwep/selection-js';

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

      chrome.runtime.sendMessage(chrome.i18n.getMessage('@@extension_id'), {
        type: 'path',
        data: pathList,
      });
    });

  document.addEventListener('click', handler, true);

  window.document.documentElement.setAttribute('style', 'overflow-x: scroll; margin-bottom: 300px; padding-bottom: 300px;');

  const generation = document.createElement('iframe');
  generation.id = 'gloria-x-generation-iframe';
  generation.setAttribute(
    'style',
    `border: 2px solid #1f2d48; position: fixed !important; bottom: 0px !important; right: 0px !important; z-index: 999999; height: 300px !important; width: calc(100% - 4px) !important;`
  );
  generation.src = chrome.extension.getURL('generation.html');
  document.body.after(generation);

  chrome.runtime.onMessage.addListener(function listener(message, _sender, response) {
    if (message.type === 'getPageUrl') {
      response(location.href);
    } else if (message.type === 'directive') {
      if (message.data === 'disableSelection') {
        selection.disable();
      } else if (message.data === 'enableSelection') {
        selection.enable();
      }
    } else if (message.type === 'minus') {
      generation.setAttribute(
        'style',
        `border: 2px solid #1f2d48; position: fixed !important; bottom: 0px !important; right: 0px !important; z-index: 999999; height: 42px !important; width: 200px !important;`
      );
    } else if (message.type === 'plus') {
      generation.setAttribute(
        'style',
        `border: 2px solid #1f2d48; position: fixed !important; bottom: 0px !important; right: 0px !important; z-index: 999999; height: 300px !important; width: calc(100% - 4px) !important;`
      );
    } else if (message.type === 'left') {
      generation.setAttribute(
        'style',
        `border: 2px solid #1f2d48; position: fixed !important; bottom: 0px !important; left: 0px !important; z-index: 999999; height: 42px !important; width: 200px !important;`
      );
    } else if (message.type === 'right') {
      generation.setAttribute(
        'style',
        `border: 2px solid #1f2d48; position: fixed !important; bottom: 0px !important; right: 0px !important; z-index: 999999; height: 42px !important; width: 200px !important;`
      );
    } else if (message.type === 'destroy') {
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
    }
  });
}
