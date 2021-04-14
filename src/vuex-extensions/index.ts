import BackgroundScript from './backgroundScript';
import { isBackgroundScript } from './chromeUtils';
import ContentScript from './contentScript';

export default function () {
  // eslint-disable-next-line @typescript-eslint/explicit-module-boundary-types, @typescript-eslint/no-explicit-any
  return (store: any): void => {
    isBackgroundScript(window).then(isBackground => {
      if (isBackground) {
        return new BackgroundScript(store);
      }
      return new ContentScript(store);
    });
  };
}
