// Syntactic sugar

function i18n(first: string, sub?: string[]) {
  return chrome.i18n.getMessage(first, sub);
}

function n2br(val: string) {
  return val ? val.replace(/\n/g, '<br>') : undefined;
}

function nbsp(val: string) {
  return val ? val.replace(/\s/g, '&nbsp;') : undefined;
}

function isLink(url: string) {
  return /^(?:https?|ftp):/i.test(url);
}

function asteriskLink(url: string) {
  let tempUrl = url.replace(/^(?:https?|ftp)/i, '*');
  if (/^\*:\/\/[^/]*$/i.test(tempUrl)) {
    tempUrl += '/';
  }
  return tempUrl;
}

/**
 * Tab 键转化为双空格
 * - 参考：https://segmentfault.com/q/1010000019091279
 * @param element input 元素
 * @param event 按键事件
 */
function textareaTab(element: HTMLInputElement, event: KeyboardEvent) {
  if (event && event.code === 'Tab') {
    event.preventDefault();

    try {
      const tabStr = '  ';
      const start = element.selectionStart;
      const end = element.selectionEnd;

      if (start === end) {
        document.execCommand('insertText', false, tabStr);
      } else {
        const text = element.value;
        const tabLen = tabStr.length;
        let insertStr = tabStr;
        let newEnd = (end || 0) + tabLen;

        insertStr += text.slice(start || 0, end || 0).replace(/\n/g, function() {
          newEnd += tabLen;
          return '\n' + tabStr;
        });

        document.execCommand('insertText', false, insertStr);

        element.setSelectionRange(start || 0, newEnd);
      }
    } catch (e) {
      console.error(e);
    }
  }
}

function copyToClip(content: string, copyCompleted?: () => void, copyError?: () => void) {
  navigator.clipboard
    .writeText(content)
    .then(() => {
      typeof copyCompleted === 'function' && copyCompleted();
    })
    .catch(err => {
      typeof copyError === 'function' && copyError();
      console.error('Failed to copy: ', err);
    });
}

export { i18n, n2br, nbsp, isLink, asteriskLink as asLink, textareaTab, copyToClip };
