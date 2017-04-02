/* eslint-disable */
import { List, Map, Set } from 'immutable';
import {
  POPULATE_PRIVATE,
  INITIALIZE_PRIVATE,
  ADD_MESSAGE_PRIVATE,
  EDIT_MESSAGE_PRIVATE,
  DELETE_MESSAGE_PRIVATE,
  LIKE_MESSAGE_PRIVATE,
  RECEIVED_MESSAGE_PRIVATE,
  RECEIVED_LIKE_PRIVATE,
  RECEIVED_UPDATE_PRIVATE,
  RECEIVED_DELETE_PRIVATE,
  PRIVATE_CHAT_NOTIFY,
  CLEAR_NOTICATIONS
} from '../actions/chat';

/*** private chat default state is a map
 * where keys represent the user being chatted with
 * which map to a single List of chat history ***/

export default (state = Map(), action) => {
  const { type, payload } = action;

  switch (type) {

    case POPULATE_PRIVATE: {
      const { user, data } = payload;
      let reciepient;
      // we basically need to do some conversions to the data...
      data.map(data => {
        if (data.members[0] === user) {
          data.members.splice(0,1);
        } else {
          data.members.splice(1,1);
        }
        reciepient = data.members[0];
        state = state.set(reciepient, Map({
          notifications: data.notifications[user],
          history: List(data.history.map(h => Map(h)))
        }));
      });
      return state.updateIn([reciepient, 'history'], h => h.map(m => {
        const likes = m.get('likes');
        m = m.delete('likes');
        return m.set('likes', Set(likes));
      }));
    }

    case INITIALIZE_PRIVATE: {
      return state.has(payload) ? state : state.set(payload, Map({
        notifications: 0,
        history: List()
      }));
    }

    case ADD_MESSAGE_PRIVATE: {
      const { reciepient, message } = payload;
      return state.updateIn([reciepient, 'history'], l => l.push(message));
    }

    case EDIT_MESSAGE_PRIVATE: {
      const { id, text, reciepient } = payload;
      return state.updateIn([reciepient, 'history'], l => {
        return l.map(message => {
          if (message.get('id') === id) {
            return message.set('text', text);
          } else {
            return message;
          }
        });
      });
    }

    case LIKE_MESSAGE_PRIVATE: {
      const { messageId, liker, reciepient } = payload;
      return state.updateIn([reciepient, 'history'], l => {
        return l.map(message => {
          if (message.get('id') === messageId && !message.get('likes').has(liker)) {
              return message.update('likes', likes => likes.add(liker))
          } else {
            return message;
          }
        });
      });
    }

    case DELETE_MESSAGE_PRIVATE: {
      return state.updateIn([payload.reciepient, 'history'], l =>
        l.filter(message => message.get('id') !== payload.id));
    }

    // real-time update actions:
    case RECEIVED_MESSAGE_PRIVATE: {
      const { reciepient, message } = payload;
      return state.updateIn([message.author, 'history'], l => {
        return l.push(Map(message));
      });
    }

    case RECEIVED_UPDATE_PRIVATE: {
      const { author, reciepient, id, text } = payload;
      return state.updateIn([author, 'history'], l => {
        return l.map(message => {
          if (message.get('id') === id) {
            return message
              .set('text', text)
              .set('edited', true);
          } else {
            return message;
          }
        });
      });
    }

    case RECEIVED_LIKE_PRIVATE: {
      const { liker, reciepient, id } = payload;
      return state.updateIn([liker, 'history'], l => {
        return l.map(message => {
          if (message.get('id') === id) {
            return message.update('likes', likes => likes.add(liker));
          } else {
            return message;
          }
        });
      });
    }

    case RECEIVED_DELETE_PRIVATE: {
      const { author, reciepient, id } = payload;
      return state.updateIn([author, 'history'], l => {
        return l.filter(m => {
          return m.get('id') !== id;
        });
      });
    }

    case PRIVATE_CHAT_NOTIFY: {
      const { reciepient } = payload;
      return state.updateIn([reciepient, 'notifications'], n => n + 1);
    }

    case CLEAR_NOTICATIONS: {
      const { reciepient } = payload;
      return state.updateIn([reciepient, 'notifications'], n => 0);
    }

    default: return state;
  }
}
