/* eslint-disable @typescript-eslint/no-explicit-any */
import { handleConnection } from './chromeUtils';
import { checkConnectId, removeConnectId } from './idUtils';
import { bgPrefix } from './const';
import { Store, MutationTree } from 'vuex';

declare interface chromeStore extends Store<myData> {
  type: string;
  _mutations: MutationTree<myData>;
}

class BackgroundScript {
  private store: chromeStore;
  private connections: Array<chrome.runtime.Port>;

  constructor(store: chromeStore) {
    this.store = store;
    this.connections = [];

    this.store.subscribe(mutation => {
      for (let i = 0; i < this.connections.length; i++) {
        const connection = this.connections[i];
        let mutationType = mutation.type;
        if (mutationType.indexOf(connection.name) === 0) {
          continue;
        }

        if (checkConnectId(mutationType)) {
          mutationType = removeConnectId(mutationType);
        }

        this.sendMutation(connection, { ...mutation, type: bgPrefix + mutationType });
      }
    });

    handleConnection(connection => {
      this.onConnection(connection);
    });
  }

  onConnection(connection: chrome.runtime.Port): void {
    this.bindMutation(connection);

    connection.onDisconnect.addListener(conn => {
      this.onDisconnect(conn);
      this.unbindMutation(connection);
    });

    connection.onMessage.addListener(message => {
      this.onMessage(connection, message);
    });

    this.connections.push(connection);

    connection.postMessage({
      type: '@@STORE_INITIAL_STATE',
      data: this.store.state,
    });
  }

  bindMutation(connection: chrome.runtime.Port): void {
    const connectName = connection.name;
    const { _mutations: mutations } = this.store;
    Object.entries(mutations).forEach(([type, funcList]) => {
      const isF = this.connections.some(conn => {
        return type.indexOf(conn.name) === 0;
      });

      if (!isF) {
        mutations[connectName + type] = funcList;
      }
    });
  }

  unbindMutation(connection: chrome.runtime.Port): void {
    const connectName = connection.name;
    const { _mutations: mutations } = this.store;
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    Object.entries(mutations).forEach(([type, _funcList]) => {
      if (type.indexOf(connectName) === 0) {
        delete mutations[type];
      }
    });
  }

  onDisconnect(connection: chrome.runtime.Port): void {
    for (let i = this.connections.length - 1; i >= 0; i--) {
      if (this.connections[i].name === connection.name) {
        this.connections.splice(i, 1);
        console.log('disconnect', connection.name);
      }
    }
  }

  onMessage(_connection: chrome.runtime.Port, message: myMessage): void {
    if (message.type !== '@@STORE_SYNC_MUTATION') {
      return;
    }
    this.store.commit(message.data.type, message.data.payload);
  }

  sendMutation(connection: chrome.runtime.Port, mutation: myData): void {
    connection.postMessage({
      type: '@@STORE_SYNC_MUTATION',
      data: mutation,
    });
  }
}

export default BackgroundScript;
