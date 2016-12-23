import find from 'lodash/find';

export const populateChatWithPeerId = userId => chat => ({
  ...chat,
  peerId: chat.userIds.filter(id => userId !== id)[0],
});

export const populateChatsWithPeerId = userId => chats => chats.map(populateChatWithPeerId(userId));
