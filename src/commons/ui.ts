// Syntactic sugar

function i18n(first: string, sub?: string[]): string {
  return chrome.i18n.getMessage(first, sub);
}

function n2br(val: string): string | undefined {
  return val ? val.replace(/\n/g, '<br>') : undefined;
}

function nbsp(val: string): string | undefined {
  return val ? val.replace(/\s/g, '&nbsp;') : undefined;
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

export { i18n, n2br, nbsp, isLink, asteriskLink as asLink, copyToClip };
