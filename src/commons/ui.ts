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
  return url.replace(/^(?:https?|ftp)/i, '*');
}

export { i18n, n2br, nbsp, isLink, asteriskLink as asLink };
