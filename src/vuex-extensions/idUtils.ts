export function genConnectId(): string {
  return `@@${Math.random().toString(36).substr(2, 9)}@@`;
}

export function checkConnectId(str: string): boolean {
  return /^@@[0-9,a-z,A_Z]{9}@@[0-9,a-z,A-Z]+/.test(str);
}

export function removeConnectId(str: string): string {
  let res = '';
  const matches = str.match(/^@@[0-9,a-z,A-Z]{9}@@([0-9,a-z,A-Z]+)/);
  if (matches) {
    res = matches[1];
  }
  return res;
}
