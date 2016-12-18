import { expect } from 'chai';
import {
  populateChatsWithPeerId,
} from './utils';


describe('Chat model utils', () => {
  describe('#populateChatsWithPeerId', () => {
    it('should populate every chat with peerId', () => {
      const userId = '1';
      const chats = [
        { userIds: ['1', '2'] },
        { userIds: ['3', '1'] },
        { userIds: ['1', '4'] },
      ];

      const result = populateChatsWithPeerId(userId)(chats);

      expect(result).to.deep.equal([
        { userIds: ['1', '2'], peerId: '2' },
        { userIds: ['3', '1'], peerId: '3' },
        { userIds: ['1', '4'], peerId: '4' },
      ]);
    });
  });
});
