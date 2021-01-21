import _ from 'lodash';
import Notification from './Notification';
import { create2DCanvas, loadImage, imageToDataURI, TRANSPARENT_IMAGE } from './common';

class ImageNotification extends Notification<enhanced.ImageNotificationOptions> {
  experimental = false;

  protected readonly finalType = 'image';

  protected readonly disallowOptions = [];

  private originImageUrl: string | undefined;
  private originImage: HTMLImageElement | undefined;

  protected defaultOptions: enhanced.ImageNotificationOptions = {
    type: this.finalType,
    title: '',
    message: '',
    iconUrl: Notification.DEFAULT_ICON_URL,
    imageUrl: Notification.DEFAULT_IMAGE_URL,
  };

  // eslint-disable-next-line @typescript-eslint/no-explicit-any, @typescript-eslint/no-unused-vars
  protected optionsSetter = (options: enhanced.ImageNotificationOptions, prop: string, value: any, _receiver: any): boolean => {
    let status = false;
    switch (prop) {
      case 'imageUrl':
        //! 一个图片消息 imageUrl 属性是必须的
        if (_.isString(value)) {
          options.imageUrl = value;
          status = true;
        }
        break;
      case 'defaultImageUrl':
        if (_.isString(value) || _.isUndefined(value)) {
          options.defaultImageUrl = value;
          status = true;
        }
        break;
    }

    return status;
  };

  private async scaleImage(img: HTMLImageElement): Promise<string> {
    function tryCenteringImage() {
      const { canvas, ctx } = create2DCanvas(Notification.BEST_IMAGE_WIDTH, Notification.BEST_IMAGE_HEIGHT);

      if (img.width > Notification.BEST_IMAGE_WIDTH * 2) {
        const marginTop = (Notification.BEST_IMAGE_HEIGHT - img.height) / 2;
        ctx.drawImage(img, 0, 0, canvas.width, img.height, 0, marginTop, canvas.width, canvas.height - 2 * marginTop);
      } else if (img.height > Notification.BEST_IMAGE_HEIGHT * 2) {
        const marginLeft = (Notification.BEST_IMAGE_WIDTH - img.width) / 2;
        ctx.drawImage(img, 0, 0, img.width, canvas.height, marginLeft, 0, canvas.width - 2 * marginLeft, canvas.height);
      } else {
        ctx.drawImage(img, (Notification.BEST_IMAGE_WIDTH - img.width) / 2, (Notification.BEST_IMAGE_HEIGHT - img.height) / 2);
      }

      return canvas.toDataURL();
    }

    if (img.width > Notification.BEST_IMAGE_WIDTH && img.height > Notification.BEST_IMAGE_HEIGHT) {
      if (img.width / img.height > Notification.BEST_IMAGE_RATIO * 2) {
        const { canvas, ctx } = create2DCanvas(img.height * Notification.BEST_IMAGE_RATIO, img.height);
        ctx.drawImage(img, 0, 0, img.height * Notification.BEST_IMAGE_RATIO, img.height, 0, 0, canvas.width, canvas.height);
        return canvas.toDataURL();
      } else if (img.width / img.height < Notification.BEST_IMAGE_RATIO / 2) {
        const { canvas, ctx } = create2DCanvas(img.width, img.width / Notification.BEST_IMAGE_RATIO);
        ctx.drawImage(img, 0, 0, img.width, img.width / Notification.BEST_IMAGE_RATIO, 0, 0, canvas.width, canvas.height);
        return canvas.toDataURL();
      } else {
        const { canvas, ctx } = create2DCanvas(img.width, img.height);
        ctx.drawImage(img, 0, 0);
        return canvas.toDataURL();
      }
    } else {
      return tryCenteringImage();
    }
  }

  protected async init(): Promise<void> {
    await super.init();

    if (this.options.imageUrl) {
      try {
        this.originImageUrl = this.options.imageUrl;
        this.originImage = await loadImage(this.originImageUrl);
        this.options.imageUrl = await this.scaleImage(this.originImage);
      } catch (e) {
        if (this.options.defaultImageUrl) {
          try {
            this.originImageUrl = this.options.defaultImageUrl;
            this.originImage = await loadImage(this.originImageUrl as string);
            this.options.imageUrl = imageToDataURI(this.originImage);
          } catch (e) {
            this.options.imageUrl = TRANSPARENT_IMAGE;
          }
        } else {
          this.options.imageUrl = TRANSPARENT_IMAGE;
        }
      }
    } else {
      throw new Error('No avaliable image.');
    }
  }
}

export default ImageNotification;
