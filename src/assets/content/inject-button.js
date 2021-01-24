'use strict';
const API_SSERVER = 'https://api.gloria.pub';

function i18n(first, sub) {
  return chrome.i18n.getMessage(first, sub);
}

class BtnManager {
  constructor(installBtn = null, uninstallBtn = null, updateBtn = null) {
    this.installBtn = installBtn;
    this.uninstallBtn = uninstallBtn;
    this.updateBtn = updateBtn;
  }

  addInstallBtn(installBtn = null) {
    this.installBtn = installBtn;
  }

  addUninstallBtn(uninstallBtn = null) {
    this.uninstallBtn = uninstallBtn;
  }

  addUpdateBtn(updateBtn = null) {
    this.updateBtn = updateBtn;
  }

  install() {
    if (this.installBtn && this.uninstallBtn && this.updateBtn) {
      this.installBtn.style.display = 'none';
      this.updateBtn.textContent = i18n('injectUpdate');
      this.updateBtn.style.display = 'inline-flex';
      this.uninstallBtn.textContent = i18n('injectInstalled');
      this.uninstallBtn.style.display = 'inline-flex';
    }
  }

  installFaild() {
    if (this.installBtn) {
      this.installBtn.textContent = i18n('injectInstallFaild');
    }
  }

  uninstall() {
    if (this.installBtn && this.uninstallBtn && this.updateBtn) {
      this.uninstallBtn.style.display = 'none';
      this.updateBtn.style.display = 'none';
      this.installBtn.textContent = i18n('injectInstall');
      this.installBtn.style.display = 'inline-flex';
    }
  }

  uninstallFaild() {
    if (this.uninstallBtn) {
      this.uninstallBtn.textContent = i18n('injectUninstallFaild');
    }
  }

  update() {
    if (this.updateBtn) {
      this.updateBtn.textContent = i18n('injectUpdated');
    }
  }

  updateFaild() {
    if (this.updateBtn) {
      this.updateBtn.textContent = i18n('injectUpdateFaild');
    }
  }
}

const btnManager = new BtnManager();

function create(tag = 'a', name = '', title = '', className = '', onClick = null, hidden = false) {
  const ele = document.createElement(tag);
  ele.textContent = name;
  ele.title = title;
  ele.className = className;
  if (hidden) {
    ele.style.display = 'none';
  }
  ele.style.marginBottom = '5px';
  ele.addEventListener('click', event => {
    typeof onClick === 'function' && onClick(event);
  });
  return ele;
}

function sendInstallTask(id = '') {
  chrome.runtime.sendMessage(
    i18n('@@extension_id'),
    {
      type: 'installTask',
      data: API_SSERVER + id,
    },
    response => {
      if (!chrome.runtime.lastError) {
        if (response.result) {
          btnManager.install();
        } else {
          btnManager.installFaild();
        }
      }
    }
  );
}

function sendUninstallTask(url = '') {
  chrome.runtime.sendMessage(
    i18n('@@extension_id'),
    {
      type: 'uninstallTask',
      data: url,
    },
    response => {
      if (!chrome.runtime.lastError) {
        if (response.result) {
          btnManager.uninstall();
        } else {
          btnManager.uninstallFaild();
        }
      }
    }
  );
}

function sendUpdateTask(id = '') {
  chrome.runtime.sendMessage(
    i18n('@@extension_id'),
    {
      type: 'updateTask',
      data: API_SSERVER + id,
    },
    response => {
      if (!chrome.runtime.lastError) {
        if (response.result) {
          btnManager.update();
        } else {
          btnManager.updateFaild();
        }
      }
    }
  );
}

function checkInstall(url = '') {
  chrome.runtime.sendMessage(
    {
      type: 'checkInstall',
      data: url,
    },
    response => {
      if (!chrome.runtime.lastError) {
        if (response.result) {
          btnManager.install();
        }
      }
    }
  );
}

function init() {
  const hreoBody = document.querySelector('.hero .hero-body');

  if (hreoBody) {
    const column = hreoBody.querySelectorAll('.column');
    if (column.length === 2) {
      const btnList = column[1];
      const { pathname, href } = location;

      const installBtn = create('a', i18n('injectInstall'), i18n('injectButtonTip'), 'button is-primary is-large', () => {
        sendInstallTask(pathname);
      });
      btnManager.addInstallBtn(installBtn);
      btnList.appendChild(installBtn);

      const uninstallBtn = create(
        'a',
        i18n('injectInstalled'),
        i18n('injectButtonTip'),
        'button is-warning is-large',
        () => {
          sendUninstallTask(href);
        },
        true
      );
      btnManager.addUninstallBtn(uninstallBtn);
      btnList.appendChild(uninstallBtn);

      const updateBtn = create(
        'a',
        i18n('injectUpdate'),
        i18n('injectButtonTip'),
        'button is-success is-large',
        () => {
          sendUpdateTask(pathname);
        },
        true
      );
      btnManager.addUpdateBtn(updateBtn);
      btnList.appendChild(updateBtn);

      checkInstall(href);
    }
  }
}

init();
