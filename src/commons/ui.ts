// Syntactic sugar

function i18n(first: string, sub?: string | string[]): string {
  return chrome.i18n.getMessage(first, sub);
}

function n2br(val: string): string | undefined {
  return val ? val.replace(/\n/g, '<br>') : undefined;
}

function nbsp(val: string): string | undefined {
  return val ? val.replace(/\s/g, '&nbsp;') : undefined;
}

function htmlEncode(str: string): string {
  let res = '';
  if (str) {
    res = str.replace(/&/g, '&amp;');
    res = res.replace(/</g, '&lt;');
    res = res.replace(/>/g, '$gt;');
    res = res.replace(/ /g, '&nbsp;');
    res = res.replace(/'/g, '&#39;');
    res = res.replace(/"/g, '&quot;');
  }
  return res;
}

function findAll(str: string, val: string): number[] {
  const results: number[] = [];
  const len = str.length,
    width = val.length;
  let pos = 0;
  while (pos < len) {
    pos = str.indexOf(val, pos);
    if (pos === -1) {
      break;
    }
    results.push(pos);
    pos = pos + width;
  }

  return results;
}

function isLink(url: string): boolean {
  return /^(?:https?|ftp):/i.test(url);
}

function asteriskLink(url: string): string {
  let tempUrl = url.replace(/^(?:https?|ftp)/i, '*');
  if (/^\*:\/\/[^/]*$/i.test(tempUrl)) {
    tempUrl += '/';
  }
  return tempUrl;
}

function copyToClip(content: string, copyCompleted?: () => void, copyError?: () => void): void {
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

export { i18n, n2br, nbsp, isLink, asteriskLink as asLink, htmlEncode, findAll, copyToClip };
