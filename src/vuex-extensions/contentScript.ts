/* eslint-disable @typescript-eslint/no-explicit-any */
import { connectToBackground } from './chromeUtils';
import { genConnectId } from './idUtils';
import { bgPrefix } from './const';
import { Store, MutationTree } from 'vuex';

declare interface chromeStore extends Store<myData> {
  type: string;
  _mutations: MutationTree<myData>;
}

class ContentScript {
  private store: chromeStore;
  private scriptId: string;
  private connection: null | chrome.runtime.Port;
  private initialized: boolean;
  private pendingMutations: Array<{ type: string; payload: any }>;

  constructor(store: chromeStore) {
    this.store = store;
    this.scriptId = genConnectId();
    this.connection = null;
    this.initialized = false;
    this.pendingMutations = [];

    this.bindMutation();

    this.connection = connectToBackground(`${this.scriptId}`);

    this.connection.onMessage.addListener(message => {
      this.onMessage(message);
    });

    this.store.subscribe(mutation => {
      if (!this.initialized) {
        this.pendingMutations.push(mutation);
        return;
      }
      if (mutation.type.indexOf(bgPrefix) > -1) {
        return;
      }
      this.sendMutation({ ...mutation, type: this.scriptId + mutation.type });
    });
  }

  bindMutation(): void {
    const { _mutations: mutations } = this.store;
    Object.entries(mutations).forEach(([type, funcList]) => {
      mutations[bgPrefix + type] = funcList;
    });
  }

  onMessage(message: { type: string; data: myData }): void {
    if (message.type === '@@STORE_INITIAL_STATE') {
      this.store.replaceState(message.data);
      this.initialized = true;
      this.processPendingMutations();
    } else if (message.type === '@@STORE_SYNC_MUTATION') {
      // Don't commit any mutation from other contexts before the initial state sync
      if (!this.initialized) {
        return;
      }

      if (Reflect.has(this.store._mutations, message.data.type)) {
        this.store.commit(message.data.type, message.data.payload);
      }
    }
  }

  sendMutation(mutation: { type: string; payload: any }): void {
    this.connection &&
      this.connection.postMessage({
        type: '@@STORE_SYNC_MUTATION',
        data: mutation,
      });
  }

  processPendingMutations(): void {
    if (!this.pendingMutations.length) {
      return;
    }

    for (let i = 0; i < this.pendingMutations.length; i++) {
      this.store.commit(this.pendingMutations[i].type, this.pendingMutations[i].payload);
      this.pendingMutations.splice(i, 1);
    }
  }
}

export default ContentScript;
