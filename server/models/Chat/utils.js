import find from 'lodash/find';

export const populateChatsWithPeerId = id => chats => chats.map(chat => ({
  ...chat,
  peerId: chat.userIds.filter(userId => id !== userId)[0],
}));
