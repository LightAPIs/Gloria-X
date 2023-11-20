export function exportFile(content: string, filename: string, completed?: () => void): void {
  const exportBlob = new Blob([content]);
  const saveLink = document.createElement('a');
  saveLink.href = URL.createObjectURL(exportBlob);
  saveLink.download = filename;

  /** MouseEvent 鼠标事件构造器 */
  const ev = new MouseEvent('click', {
    bubbles: true,
    cancelable: false,
    screenX: 0,
    screenY: 0,
    clientX: 0,
    clientY: 0,
    ctrlKey: false,
    altKey: false,
    shiftKey: false,
    metaKey: false,
    button: 0,
    relatedTarget: null,
  });
  saveLink.dispatchEvent(ev);

  typeof completed === 'function' && completed();
}

export function importFile(callback: (status: boolean, content: string) => void): void {
  const fileInput = document.createElement('input');
  fileInput.type = 'file';
  fileInput.accept = '.txt, .text, .json, .conf, .config';
  fileInput.style.display = 'none';

  fileInput.addEventListener('change', () => {
    if (!fileInput.value) {
      callback(false, 'no file');
      return;
    }

    if (fileInput.files) {
      const file = fileInput.files[0];
      const { type } = file;

      if (type !== 'application/json' && type !== 'application/xml' && type !== 'text/plain') {
        callback(false, 'invalid');
        return;
      }

      const reader = new FileReader();
      reader.onload = function (e) {
        const { target } = e;
        if (target) {
          const data = target.result;
          callback(true, data as string);
        }
        return;
      };

      reader.readAsText(file);
    }
  });

  fileInput.click();
}
