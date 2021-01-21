class IntervalAlarmsManager {
  jobs: commons.Jobs;
  constructor() {
    this.jobs = {};
    chrome.alarms.onAlarm.addListener(({ name }) => {
      try {
        typeof this.jobs[name] === 'function' && this.jobs[name]();
      } catch (e) {
        console.error(e);
      }
    });
  }
  addJob(name: string, job: commons.Job) {
    this.jobs[name] = job;
  }
  removeJob(name: string) {
    delete this.jobs[name];
  }
  add(name: string, delayInMinutes: number | undefined, periodInMinutes: number, job: commons.Job) {
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
  remove(name: string, callback?: () => void) {
    chrome.alarms.clear(name, () => {
      chrome.runtime.lastError && console.error(chrome.runtime.lastError);
      this.removeJob(name);
      typeof callback === 'function' && callback();
    });
  }
}

export default IntervalAlarmsManager;
