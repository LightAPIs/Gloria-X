// eslint-disable-next-line @typescript-eslint/explicit-module-boundary-types
export const isBackgroundScript = (script: Window | undefined) =>
  new Promise(resolve => {
    try {
      chrome.runtime.getBackgroundPage(backgroundPage => resolve(script === backgroundPage));
    } catch (err) {
      return resolve(false);
    }

    return false;
  });

export const connectToBackground = (connectionName: string): chrome.runtime.Port =>
  chrome.runtime.connect({
    name: connectionName,
  });

export const handleConnection = (callback: (port: chrome.runtime.Port) => void): void => chrome.runtime.onConnect.addListener(callback);
