import mongoose from 'mongoose';
import { expect } from 'chai';

const Chat = mongoose.model('Chat');

describe('Chat model', () => {
  it('shouldn\'t be valid if userIds contains more then two ids', done => {
    const chat = new Chat({
      userIds: ['123', '234', '345'],
    });

    chat.validate(err => {
      expect(err.errors.userIds).to.exist;
      done();
    });
  });

  it('should be valid if userIds contains two ids', done => {
    const chat = new Chat({
      userIds: ['123', '234'],
    });

    chat.validate(err => {
      expect(err).to.not.exist;
      done();
    });
  });
});
