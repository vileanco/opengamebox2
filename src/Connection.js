import _ from 'lodash';
import io from 'socket.io-client';
import protocol from '../protocol';
import uuid from 'uuid';

export default class Connection {
  constructor(store) {
    store.on('CONNECT', () => {
      this.socket = io(`http://${window.location.hostname}:8000`);

      this.socket.on('connect', () => {
        console.log('Connected to the server!');
        store.dispatch('CONNECTED', {});

        // TODO: move this somewhere else
        if (localStorage.player) {
          this.player = JSON.parse(localStorage.player);
        } else {
          this.player = {authToken: uuid.v4()};
          localStorage.player = JSON.stringify(this.player);
        }

        store.dispatch('HANDSHAKE', {authToken: this.player.authToken});

        const name = store.getState().settings.name;
        if (name) {
          store.dispatch('PLAYER_UPDATE_REQUEST', {name});
        }
      });

      this.socket.on('disconnect', () => {
        console.log('Disconnected from the server!');
        store.dispatch('DISCONNECTED', {});
      });

      store.on(_.keys(protocol.requests), (data, type) => {
        this.socket.emit(protocol.requests[type], data);
      })

      _()
      .assign(protocol.events, protocol.replies)
      .forOwn((typeCode, type) => {
        this.socket.on(typeCode, data => {
          store.dispatch(type, data);
        });
      });
    });
  }
}
