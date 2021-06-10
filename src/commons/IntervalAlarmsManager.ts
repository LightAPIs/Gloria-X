import { isAfterInterval } from './calc';

class IntervalAlarmsManager {
  jobs: myCommons.Jobs;
  constructor() {
    this.jobs = {};
    chrome.alarms.onAlarm.addListener(({ name, scheduledTime }) => {
      const period = 1;
      //! 处理当浏览器冷启动过慢时可能会出现的计算的 scheduledTime 时间不正确(以上一次关闭浏览器时间为基准)，从而导致 onAlarm 意外事件触发的问题
      //? 这是 Chromium 内核本身的一个问题
      if (!isAfterInterval(scheduledTime, period)) {
        try {
          typeof this.jobs[name] === 'function' && this.jobs[name]();
        } catch (e) {
          console.error(e);
        }
      }
    });
  }
  addJob(name: string, job: myCommons.Job): void {
    this.jobs[name] = job;
  }
  removeJob(name: string): void {
    delete this.jobs[name];
  }
  add(name: string, delayInMinutes: number | undefined, periodInMinutes: number, job: myCommons.Job): void {
    if (delayInMinutes) {
      if (delayInMinutes <= 0) {
        delayInMinutes = undefined;
      } else if (delayInMinutes < 1) {
        delayInMinutes = 1;
      }
    }

    if (periodInMinutes < 1) {
      periodInMinutes = 1;
    }

    this.addJob(name, job);
    chrome.alarms.create(name, {
      delayInMinutes,
      periodInMinutes,
    });
  }
  remove(name: string, callback?: () => void): void {
    chrome.alarms.clear(name, () => {
      chrome.runtime.lastError && console.error(chrome.runtime.lastError);
      this.removeJob(name);
      typeof callback === 'function' && callback();
    });
  }
}

export default IntervalAlarmsManager;
