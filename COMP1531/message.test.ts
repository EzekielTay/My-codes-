
import {
  clearV1, authRegister, channelsCreateV2,
  channelMessageV2, channelJoinV2, authLogout, testUser, shareMessagesV1,
  testchannel, messageSendV1, messageEditV1, messageRemoveV1, messageReactV1, messageUnreactV1, searchMessagesV1,
  testDm, createDM, sendDmV1, dmMessagesV1, testMId, PERMISSION_ERROR, INPUT_ERROR, messagePinV1, messageUnpinV1, messageSendLaterDmV1, messageSendLaterV1
} from './api';
describe('Testing messageShare', () => {
  beforeEach(() => {
    clearV1();
  });
  test('Invalid token share Messages', () => {
    const user1 = authRegister('Benfake@gmail.com', 'password123', 'Ben', 'Fake');
    authRegister('Johnwick@gmail.com', 'password321', 'John', 'Wick');
    authRegister('Jamescharles@gmail.com', 'passcode123', 'James', 'Charles');
    const dmId = createDM(user1.token, [2, 3]);
    const msgId = sendDmV1(user1.token, dmId.dmId as number, 'hi!');
    const channel = channelsCreateV2(user1.token, 'John Channel', true);
    expect(shareMessagesV1('john123tokes', msgId.messageId, 'Hello', channel.channelId, -1)).toStrictEqual(PERMISSION_ERROR);
  });
  test('Both of the ids are -1', () => {
    const user1 = authRegister('Benfake@gmail.com', 'password123', 'Ben', 'Fake');
    authRegister('Johnwick@gmail.com', 'password321', 'John', 'Wick');
    authRegister('Jamescharles@gmail.com', 'passcode123', 'James', 'Charles');
    const dmId = createDM(user1.token, [2, 3]);
    const msgId = sendDmV1(user1.token, dmId.dmId as number, 'hi!');
    channelsCreateV2(user1.token, 'John Channel', true);
    expect(shareMessagesV1(user1.token, msgId.messageId, 'Hello', -1, -1)).toStrictEqual(INPUT_ERROR);
  });
  // });
  test('At least one Id is -1', () => {
    const user1 = authRegister('Benfake@gmail.com', 'password123', 'Ben', 'Fake');
    authRegister('Johnwick@gmail.com', 'password321', 'John', 'Wick');
    authRegister('Jamescharles@gmail.com', 'passcode123', 'James', 'Charles');
    const dmId = createDM(user1.token, [2, 3]);
    const msgId = sendDmV1(user1.token, dmId.dmId as number, 'hi!');
    const channel = channelsCreateV2(user1.token, 'John Channel', true);
    expect(shareMessagesV1(user1.token, msgId.messageId, 'Hello', channel.channelId, dmId.dmId)).toStrictEqual(INPUT_ERROR);
  });
  test('channelId is invalid', () => {
    const user1 = authRegister('Benfake@gmail.com', 'password123', 'Ben', 'Fake');
    authRegister('Johnwick@gmail.com', 'password321', 'John', 'Wick');
    authRegister('Jamescharles@gmail.com', 'passcode123', 'James', 'Charles');
    const dmId = createDM(user1.token, [2, 3]);
    const msgId = sendDmV1(user1.token, dmId.dmId as number, 'hi!');
    const channel = channelsCreateV2(user1.token, 'John Channel', true);
    expect(shareMessagesV1(user1.token, msgId.messageId, 'Hello', channel.channelId + 2323, -1))
      .toStrictEqual(INPUT_ERROR);
  });
  test('dmId is invalid', () => {
    const user1 = authRegister('Benfake@gmail.com', 'password123', 'Ben', 'Fake');
    authRegister('Johnwick@gmail.com', 'password321', 'John', 'Wick');
    authRegister('Jamescharles@gmail.com', 'passcode123', 'James', 'Charles');
    const dmId = createDM(user1.token, [2, 3]);
    const msgId = sendDmV1(user1.token, dmId.dmId as number, 'hi!');
    channelsCreateV2(user1.token, 'John Channel', true);
    expect(shareMessagesV1(user1.token, msgId.messageId, 'Hello', -1, dmId.dmId + 2030))
      .toStrictEqual(INPUT_ERROR);
  });

  test('length of message too long', () => {
    const user1 = authRegister('Benfake@gmail.com', 'password123', 'Ben', 'Fake');
    authRegister('Johnwick@gmail.com', 'password321', 'John', 'Wick');
    authRegister('Jamescharles@gmail.com', 'passcode123', 'James', 'Charles');
    const dmId = createDM(user1.token, [2, 3]);
    const msgId = sendDmV1(user1.token, dmId.dmId as number, 'hi!');
    const channel = channelsCreateV2(user1.token, 'John Channel', true);
    const str = 'a';
    expect(shareMessagesV1(user1.token, msgId.messageId, str.repeat(1001), channel.channelId, -1))
      .toStrictEqual(INPUT_ERROR);
  });
  test('Invalid Message Id', () => {
    const user1 = authRegister('Benfake@gmail.com', 'password123', 'Ben', 'Fake');
    authRegister('Johnwick@gmail.com', 'password321', 'John', 'Wick');
    authRegister('Jamescharles@gmail.com', 'passcode123', 'James', 'Charles');
    const user4 = authRegister('briantran@gmail.com', 'pasdsdasda123', 'gabba', 'trabba');
    const dmId = createDM(user1.token, [2, 3, 4]);
    const dmIds = createDM(user1.token, [2, 3]);
    const msgId = sendDmV1(user1.token, dmIds.dmId as number, 'hi!');
    expect(shareMessagesV1(user4.token, msgId.messageId, 'Hello', -1, dmId.dmId))
      .toStrictEqual(INPUT_ERROR);
  });
  test('Invalid Message Id', () => {
    const user1 = authRegister('Benfake@gmail.com', 'password123', 'Ben', 'Fake');
    authRegister('Johnwick@gmail.com', 'password321', 'John', 'Wick');
    authRegister('Jamescharles@gmail.com', 'passcode123', 'James', 'Charles');
    const user4 = authRegister('briantran@gmail.com', 'pasdsdasda123', 'gabba', 'trabba');
    const dmId = createDM(user1.token, [2, 3, 4]);
    const cId = channelsCreateV2(user4.token, 'gamma channel', true);
    const msnId = messageSendV1(user4.token, cId.channelId as number, 'hi i really like jumaji');
    messageSendV1(user1.token, cId.channelId as number, 'hi i really');
    expect(shareMessagesV1(user1.token, msnId.messageId, 'Hello', -1, dmId.dmId))
      .toStrictEqual(INPUT_ERROR);
  });

  test('person is not within the chat so cannot send to lola', () => {
    const user1 = authRegister('Benfake@gmail.com', 'password123', 'Ben', 'Fake');
    authRegister('Johnwick@gmail.com', 'password321', 'John', 'Wick');
    authRegister('Jamescharles@gmail.com', 'passcode123', 'James', 'Charles');
    const user4 = authRegister('briantran@gmail.com', 'pasdsdasda123', 'gabba', 'trabba');
    const dmId = createDM(user1.token, [2, 3, 4]);
    createDM(user1.token, [2, 3]);
    const msgId = sendDmV1(user1.token, dmId.dmId as number, 'hi!');
    const cId = channelsCreateV2(user1.token, 'gamma channel', true);
    expect(shareMessagesV1(user4.token, msgId.messageId, 'This was funny', cId.channelId, -1))
      .toStrictEqual(PERMISSION_ERROR);
  });
  test('person is not within the chat so cannot send to dm', () => {
    const user1 = authRegister('Benfake@gmail.com', 'password123', 'Ben', 'Fake');
    authRegister('Johnwick@gmail.com', 'password321', 'John', 'Wick');
    authRegister('Jamescharles@gmail.com', 'passcode123', 'James', 'Charles');
    const user4 = authRegister('briantran@gmail.com', 'pasdsdasda123', 'gabba', 'trabba');
    const dmId = createDM(user1.token, [2, 3, 4]);
    const dmIds = createDM(user1.token, [2, 3]);
    const msgId = sendDmV1(user1.token, dmId.dmId as number, 'hi!');
    channelsCreateV2(user1.token, 'gamma channel', true);
    expect(shareMessagesV1(user4.token, msgId.messageId, 'This was funny', -1, dmIds.dmId))
      .toStrictEqual(PERMISSION_ERROR);
  });
  test('og message two channelmsgs case', () => {
    const user1 = authRegister('Benfake@gmail.com', 'password123', 'Ben', 'Fake');
    authRegister('Johnwick@gmail.com', 'password321', 'John', 'Wick');
    authRegister('Jamescharles@gmail.com', 'passcode123', 'James', 'Charles');
    const user4 = authRegister('briantran@gmail.com', 'pasdsdasda123', 'gabba', 'trabba');
    const dmId = createDM(user1.token, [2, 3, 4]);
    const cId = channelsCreateV2(user4.token, 'gamma channel', true);
    channelJoinV2(user1.token, cId.channelId);
    messageSendV1(user4.token, cId.channelId as number, 'hi i really like jumaji');
    const msgId = messageSendV1(user1.token, cId.channelId as number, 'hi i really');
    const share = shareMessagesV1(user1.token, msgId.messageId, 'Hello', -1, dmId.dmId);
    expect(share)
      .toStrictEqual({ sharedMessageId: share.sharedMessageId });
  });
  test('Sends to channels', () => {
    const user1 = authRegister('Benfake@gmail.com', 'password123', 'Ben', 'Fake');
    const user2 = authRegister('Johnwick@gmail.com', 'password321', 'John', 'Wick');
    authRegister('Jamescharles@gmail.com', 'passcode123', 'James', 'Charles');
    const user4 = authRegister('briantran@gmail.com', 'pasdsdasda123', 'gabba', 'trabba');
    const dmId = createDM(user1.token, [2, 3, 4]);
    createDM(user1.token, [2, 3]);
    const msgId = sendDmV1(user1.token, dmId.dmId as number, 'hi!');
    const cId = channelsCreateV2(user1.token, 'gamma channel', true);
    channelsCreateV2(user2.token, 'gamma channel', true);
    channelJoinV2(user4.token, cId.channelId);
    const share = shareMessagesV1(user4.token, msgId.messageId, 'This was funny', cId.channelId, -1);
    expect(share).toStrictEqual({ sharedMessageId: share.sharedMessageId });
    expect(dmMessagesV1(user4.token, dmId.dmId, 0)).toStrictEqual({
      end: -1,
      messages: [
        {
          isPinned: false,
          message: 'hi!',
          messageId: msgId.messageId,
          reacts: [],
          timeSent: expect.any(Number),
          uId: user1.authUserId,
        },
      ],
      start: 0,
    });
    expect(channelMessageV2(user4.token, cId.channelId, 0)).toStrictEqual({
      end: -1,
      messages: [
        {
          isPinned: false,
          messageId: share.sharedMessageId,
          message: 'hi! This was funny',
          reacts: [],
          timeSent: expect.any(Number),
          uId: user4.authUserId,
        },
      ],
      start: 0
    });
  });

  test('Sends to dms', () => {
    const user1 = authRegister('Benfake@gmail.com', 'password123', 'Ben', 'Fake');
    const user2 = authRegister('Johnwick@gmail.com', 'password321', 'John', 'Wick');
    authRegister('Jamescharles@gmail.com', 'passcode123', 'James', 'Charles');
    const user4 = authRegister('briantran@gmail.com', 'pasdsdasda123', 'gabba', 'trabba');
    const dmId = createDM(user1.token, [2, 3, 4]);
    createDM(user1.token, [2, 3]);
    const hi = sendDmV1(user1.token, dmId.dmId as number, 'hi!');
    const cId = channelsCreateV2(user4.token, 'gamma channel', true);
    channelJoinV2(user2.token, cId.channelId);
    channelJoinV2(user1.token, cId.channelId);
    // messageId here is one
    const msg = messageSendV1(user4.token, cId.channelId as number, 'hi i really like jumaji');
    const share = shareMessagesV1(user4.token, msg.messageId, 'Lol', -1, dmId.dmId);
    expect(share).toStrictEqual({ sharedMessageId: share.sharedMessageId });
    expect(dmMessagesV1(user4.token, dmId.dmId, 0)).toStrictEqual({
      end: -1,
      messages: [
        {
          isPinned: false,
          message: 'hi!',
          messageId: hi.messageId,
          reacts: [],
          timeSent: expect.any(Number),
          uId: user1.authUserId,
        },
        {
          isPinned: false,
          messageId: share.sharedMessageId,
          message: 'hi i really like jumaji Lol',
          reacts: [],
          timeSent: expect.any(Number),
          uId: user4.authUserId,
        },
      ],
      start: 0,
    });
  });
});

describe('Testing messageSearch', () => {
  beforeEach(() => {
    clearV1();
  });
  test('Error case invalid token', () => {
    const user1 = authRegister('Benfake@gmail.com', 'password123', 'Ben', 'Fake');
    const user2 = authRegister('Johnwick@gmail.com', 'password321', 'John', 'Wick');
    const user3 = authRegister('Jamescharles@gmail.com', 'passcode123', 'James', 'Charles');
    const dmId = createDM(user1.token, [2, 3]);
    const dm = sendDmV1(user1.token, dmId.dmId as number, 'hi!');
    const channel = channelsCreateV2(user1.token, 'John Channel', true);
    channelJoinV2(user2.token, channel.channelId);
    channelJoinV2(user3.token, channel.channelId);
    messageSendV1(user2.token, channel.channelId as number, 'hi!');
    messageSendV1(user2.token, channel.channelId as number, 'bye!');
    expect(searchMessagesV1('invalidtokenlol', dm.messageId)).toStrictEqual(PERMISSION_ERROR);
  });
  test('Error case valid token however, queryStr too short', () => {
    const user1 = authRegister('Benfake@gmail.com', 'password123', 'Ben', 'Fake');
    authRegister('Johnwick@gmail.com', 'password321', 'John', 'Wick');
    authRegister('Jamescharles@gmail.com', 'passcode123', 'James', 'Charles');
    const dmId = createDM(user1.token, [2, 3]);
    sendDmV1(user1.token, dmId.dmId as number, 'hi!');
    expect(searchMessagesV1(user1.token, '')).toStrictEqual(INPUT_ERROR);
  });
  test('Error case valid token however, queryStr is now too long', () => {
    const user1 = authRegister('Benfake@gmail.com', 'password123', 'Ben', 'Fake');
    authRegister('Johnwick@gmail.com', 'password321', 'John', 'Wick');
    authRegister('Jamescharles@gmail.com', 'passcode123', 'James', 'Charles');
    const dmId = createDM(user1.token, [2, 3]);
    sendDmV1(user1.token, dmId.dmId as number, 'hi!');
    const str = 'a';
    expect(searchMessagesV1(user1.token, str.repeat(1001))).toStrictEqual(INPUT_ERROR);
  });

  test('Searchmessages success case', () => {
    const user1 = authRegister('Benfake@gmail.com', 'password123', 'Ben', 'Fake');
    authRegister('Johnwick@gmail.com', 'password321', 'John', 'Wick');
    authRegister('Jamescharles@gmail.com', 'passcode123', 'James', 'Charles');
    const cId = channelsCreateV2(user1.token, 'gamma channel', true);
    messageSendV1(user1.token, cId.channelId as number, 'hi i really like jumaji i think!');
    messageSendV1(user1.token, cId.channelId as number, 'hi i really');
    expect(searchMessagesV1(user1.token, 'jumaji')).toStrictEqual({
      messages:
      [
        'hi i really like jumaji i think!'
      ]
    });
  });

  test('Searchmessages success case', () => {
    const user1 = authRegister('Benfake@gmail.com', 'password123', 'Ben', 'Fake');
    const user2 = authRegister('Johnwick@gmail.com', 'password321', 'John', 'Wick');
    const user3 = authRegister('Jamescharles@gmail.com', 'passcode123', 'James', 'Charles');
    const dmId = createDM(user1.token, [2, 3]);
    const dm2 = createDM(user2.token, [3]);
    sendDmV1(user2.token, dm2.dmId as number, 'hi what is going on?');
    sendDmV1(user1.token, dmId.dmId as number, 'hi!');
    sendDmV1(user1.token, dmId.dmId as number, 'hi i am doing good!');
    sendDmV1(user1.token, dmId.dmId as number, 'its pretty cool hi!');
    sendDmV1(user1.token, dmId.dmId as number, 'hi i love coding omg!');
    sendDmV1(user1.token, dmId.dmId as number, 'james 123');
    const channel = channelsCreateV2(user2.token, 'John Channel', true);
    const cId = channelsCreateV2(user1.token, 'gamma channel', true);
    channelJoinV2(user3.token, channel.channelId);
    messageSendV1(user1.token, cId.channelId as number, 'hi i really like jumaji i think!');
    messageSendV1(user2.token, channel.channelId as number, 'hi i am very cool');
    expect(searchMessagesV1(user1.token, 'hi')).toStrictEqual({
      messages:
      [
        'hi!',
        'hi i am doing good!',
        'its pretty cool hi!',
        'hi i love coding omg!',
        'hi i really like jumaji i think!'
      ]
    });
  });
});

describe('testing message react', () => {
  beforeEach(() => {
    clearV1();
  });
  test('Testing Invalid Token Message React', () => {
    const user1 = authRegister('Benfake@gmail.com', 'password123', 'Ben', 'Fake');
    authRegister('Johnwick@gmail.com', 'password321', 'John', 'Wick');
    authRegister('Jamescharles@gmail.com', 'passcode123', 'James', 'Charles');
    const dmId = createDM(user1.token, [2, 3]);
    const dm1 = sendDmV1(user1.token, dmId.dmId as number, 'hi!');
    expect(messageReactV1('doasjmdksa', dm1.messageId, 1)).toStrictEqual(PERMISSION_ERROR);
  });
  test('Testing messageId is not a valid message', () => {
    const user1 = authRegister('Benfake@gmail.com', 'password123', 'Ben', 'Fake');
    authRegister('Johnwick@gmail.com', 'password321', 'John', 'Wick');
    authRegister('Jamescharles@gmail.com', 'passcode123', 'James', 'Charles');
    const dmId = createDM(user1.token, [2, 3]);
    sendDmV1(user1.token, dmId.dmId as number, 'hi!');
    expect(messageReactV1(user1.token, 41213312, 1)).toStrictEqual(INPUT_ERROR);
  });
  test('Testing reactId is not valid', () => {
    const user1 = authRegister('Benfake@gmail.com', 'password123', 'Ben', 'Fake');
    authRegister('Johnwick@gmail.com', 'password321', 'John', 'Wick');
    authRegister('Jamescharles@gmail.com', 'passcode123', 'James', 'Charles');
    const dmId = createDM(user1.token, [2, 3]);
    const dm1 = sendDmV1(user1.token, dmId.dmId as number, 'hi!');
    expect(messageReactV1(user1.token, dm1.messageId, 312312)).toStrictEqual(INPUT_ERROR);
  });
  test('Testing already reacted message by user', () => {
    const user1 = authRegister('Benfake@gmail.com', 'password123', 'Ben', 'Fake');
    const user2 = authRegister('Johnwick@gmail.com', 'password321', 'John', 'Wick');
    authRegister('Jamescharles@gmail.com', 'passcode123', 'James', 'Charles');
    const dmId = createDM(user1.token, [2, 3]);
    const dm = sendDmV1(user1.token, dmId.dmId as number, 'hi!');
    messageReactV1(user2.token, dm.messageId, 1);
    expect(messageReactV1(user2.token, dm.messageId, 1)).toStrictEqual(INPUT_ERROR);
  });
  test('Testing user not in createDm array', () => {
    const user1 = authRegister('Benfake@gmail.com', 'password123', 'Ben', 'Fake');
    const user2 = authRegister('Johnwick@gmail.com', 'password321', 'John', 'Wick');
    authRegister('Jamescharles@gmail.com', 'passcode123', 'James', 'Charles');
    const user4 = authRegister('Jamescharls@gmail.com', 'passcoe123', 'Jame', 'Charle');
    const dmId = createDM(user1.token, [2, 3]);
    const dm = sendDmV1(user1.token, dmId.dmId as number, 'hi!');
    sendDmV1(user1.token, dmId.dmId as number, 'john!');
    messageReactV1(user2.token, dm.messageId, 1);
    expect(messageReactV1(user4.token, dm.messageId, 1)).toStrictEqual(INPUT_ERROR);
  });

  test('Testing already reacted message by user', () => {
    const user1 = authRegister('Benfake@gmail.com', 'password123', 'Ben', 'Fake');
    const user2 = authRegister('Johnwick@gmail.com', 'password321', 'John', 'Wick');
    const user3 = authRegister('Jamescharles@gmail.com', 'passcode123', 'James', 'Charles');
    authRegister('Jamescharls@gmail.com', 'passcoe123', 'Jame', 'Charle');
    const channel = channelsCreateV2(user1.token, 'John Channel', true);
    channelJoinV2(user2.token, channel.channelId);
    channelJoinV2(user3.token, channel.channelId);
    messageSendV1(user2.token, channel.channelId as number, 'hi!');
    const msgId2 = messageSendV1(user2.token, channel.channelId as number, 'bye!');
    messageReactV1(user1.token, msgId2.messageId, 1);
    expect(messageReactV1(user1.token, msgId2.messageId, 1)).toStrictEqual(INPUT_ERROR);
  });
  test('Testing not within channel trying to react', () => {
    const user1 = authRegister('Benfake@gmail.com', 'password123', 'Ben', 'Fake');
    const user2 = authRegister('Johnwick@gmail.com', 'password321', 'John', 'Wick');
    const user3 = authRegister('Jamescharles@gmail.com', 'passcode123', 'James', 'Charles');
    const user4 = authRegister('Jamescharls@gmail.com', 'passcoe123', 'Jame', 'Charle');
    const channel = channelsCreateV2(user1.token, 'John Channel', true);
    channelJoinV2(user2.token, channel.channelId);
    channelJoinV2(user3.token, channel.channelId);
    messageSendV1(user2.token, channel.channelId as number, 'hi!');
    const msgId2 = messageSendV1(user2.token, channel.channelId as number, 'bye!');
    messageReactV1(user1.token, msgId2.messageId, 1);
    expect(messageReactV1(user4.token, msgId2.messageId, 1)).toStrictEqual(INPUT_ERROR);
  });

  test('Testing react doesnt exist cannot react channel', () => {
    const user1 = authRegister('Benfake@gmail.com', 'password123', 'Ben', 'Fake');
    const user2 = authRegister('Johnwick@gmail.com', 'password321', 'John', 'Wick');
    const user3 = authRegister('Jamescharles@gmail.com', 'passcode123', 'James', 'Charles');
    const channel = channelsCreateV2(user1.token, 'John Channel', true);
    channelJoinV2(user2.token, channel.channelId);
    channelJoinV2(user3.token, channel.channelId);
    messageSendV1(user1.token, channel.channelId as number, 'hi!');
    expect(messageReactV1(user1.token, 3123123, 1)).toStrictEqual(INPUT_ERROR);
  });

  test('Testing reacting a message in dm success!', () => {
    const user1 = authRegister('Benfake@gmail.com', 'password123', 'Ben', 'Fake');
    const user2 = authRegister('Johnwick@gmail.com', 'password321', 'John', 'Wick');
    authRegister('Jamescharles@gmail.com', 'passcode123', 'James', 'Charles');
    const dmId = createDM(user1.token, [2, 3]);
    const dm = sendDmV1(user1.token, dmId.dmId as number, 'hi!');
    messageReactV1(user2.token, dm.messageId, 1);
    expect(messageReactV1(user1.token, dm.messageId, 1)).toStrictEqual({});
    expect(dmMessagesV1(user1.token, dmId.dmId, 0)).toStrictEqual({
      end: -1,
      messages: [
        {
          isPinned: false,
          message: 'hi!',
          messageId: dm.messageId,
          reacts: [
            {
              reactId: 1,
              uIds: [
                user1.authUserId,
                user2.authUserId,
              ],
              isThisUserReacted: true
            },
          ],
          timeSent: expect.any(Number),
          uId: user1.authUserId,
        },
      ],
      start: 0,
    });
  });
  test('Testing reacting a message in channel success!', () => {
    const user1 = authRegister('Benfake@gmail.com', 'password123', 'Ben', 'Fake');
    const user2 = authRegister('Johnwick@gmail.com', 'password321', 'John', 'Wick');
    const user3 = authRegister('Jamescharles@gmail.com', 'passcode123', 'James', 'Charles');
    const channel = channelsCreateV2(user1.token, 'John Channel', true);
    channelJoinV2(user2.token, channel.channelId);
    channelJoinV2(user3.token, channel.channelId);
    const msg = messageSendV1(user2.token, channel.channelId as number, 'bye!');
    messageReactV1(user2.token, msg.messageId, 1);
    expect(messageReactV1(user1.token, msg.messageId, 1)).toStrictEqual({});
    expect(channelMessageV2(user1.token, channel.channelId, 0)).toStrictEqual({
      end: -1,
      messages: [
        {
          isPinned: false,
          message: 'bye!',
          messageId: msg.messageId,
          reacts: [
            {
              reactId: 1,
              uIds: [
                user1.authUserId,
                user2.authUserId,
              ],
              isThisUserReacted: true
            },
          ],
          timeSent: expect.any(Number),
          uId: user2.authUserId,
        },
      ],
      start: 0,
    });
  });
});

describe('Testing message unReact', () => {
  beforeEach(() => {
    clearV1();
  });
  test('Testing Invalid Token Message React', () => {
    const user1 = authRegister('Benfake@gmail.com', 'password123', 'Ben', 'Fake');
    authRegister('Johnwick@gmail.com', 'password321', 'John', 'Wick');
    authRegister('Jamescharles@gmail.com', 'passcode123', 'James', 'Charles');
    const dmId = createDM(user1.token, [2, 3]);
    const dm1 = sendDmV1(user1.token, dmId.dmId as number, 'hi!');
    expect(messageUnreactV1('doasjmdksa', dm1.messageId, 1)).toStrictEqual(PERMISSION_ERROR);
  });
  test('Testing not in messageId', () => {
    const user1 = authRegister('Benfake@gmail.com', 'password123', 'Ben', 'Fake');
    authRegister('Johnwick@gmail.com', 'password321', 'John', 'Wick');
    authRegister('Jamescharles@gmail.com', 'passcode123', 'James', 'Charles');
    const dmId = createDM(user1.token, [2, 3]);
    sendDmV1(user1.token, dmId.dmId as number, 'hi!');
    expect(messageUnreactV1(user1.token, 41213312, 1)).toStrictEqual(INPUT_ERROR);
  });
  test('Testing Invalid reactId', () => {
    const user1 = authRegister('Benfake@gmail.com', 'password123', 'Ben', 'Fake');
    authRegister('Johnwick@gmail.com', 'password321', 'John', 'Wick');
    authRegister('Jamescharles@gmail.com', 'passcode123', 'James', 'Charles');
    const dmId = createDM(user1.token, [2, 3]);
    const dm1 = sendDmV1(user1.token, dmId.dmId as number, 'hi!');
    expect(messageUnreactV1(user1.token, dm1.messageId, 312312)).toStrictEqual(INPUT_ERROR);
  });

  test('Testing channel msgID doesnt exist', () => {
    const user1 = authRegister('Benfake@gmail.com', 'password123', 'Ben', 'Fake');
    const user2 = authRegister('Johnwick@gmail.com', 'password321', 'John', 'Wick');
    const user3 = authRegister('Jamescharles@gmail.com', 'passcode123', 'James', 'Charles');
    const channel = channelsCreateV2(user1.token, 'John Channel', true);
    channelJoinV2(user2.token, channel.channelId);
    channelJoinV2(user3.token, channel.channelId);
    const dm = messageSendV1(user1.token, channel.channelId as number, 'hi!');
    messageReactV1(user2.token, dm.messageId, 1);
    expect(messageUnreactV1(user1.token, 3123123, 1)).toStrictEqual(INPUT_ERROR);
  });
  test('Testing channel msgID doesnt exist', () => {
    const user1 = authRegister('Benfake@gmail.com', 'password123', 'Ben', 'Fake');
    const user2 = authRegister('Johnwick@gmail.com', 'password321', 'John', 'Wick');
    const user3 = authRegister('Jamescharles@gmail.com', 'passcode123', 'James', 'Charles');
    const channel = channelsCreateV2(user1.token, 'John Channel', true);
    channelJoinV2(user2.token, channel.channelId);
    channelJoinV2(user3.token, channel.channelId);
    const dm = messageSendV1(user1.token, channel.channelId as number, 'hi!');
    messageReactV1(user2.token, dm.messageId, 1);
    expect(messageUnreactV1(user1.token, dm.messageId, 1)).toStrictEqual(INPUT_ERROR);
  });

  test('Testing react doesnt exist cannot react', () => {
    const user1 = authRegister('Benfake@gmail.com', 'password123', 'Ben', 'Fake');
    const user2 = authRegister('Johnwick@gmail.com', 'password321', 'John', 'Wick');
    authRegister('Jamescharles@gmail.com', 'passcode123', 'James', 'Charles');
    const dmId = createDM(user1.token, [2, 3]);
    const dm = sendDmV1(user1.token, dmId.dmId as number, 'hi!');
    messageReactV1(user2.token, dm.messageId, 1);
    expect(messageUnreactV1(user1.token, dm.messageId, 1)).toStrictEqual(INPUT_ERROR);
  });
  test('Testing unreact success in Dms', () => {
    const user1 = authRegister('Benfake@gmail.com', 'password123', 'Ben', 'Fake');
    const user2 = authRegister('Johnwick@gmail.com', 'password321', 'John', 'Wick');
    const user3 = authRegister('Jamescharles@gmail.com', 'passcode123', 'James', 'Charles');
    const dmId = createDM(user1.token, [2, 3]);
    const dm = sendDmV1(user1.token, dmId.dmId as number, 'hi!');
    const dm2 = sendDmV1(user1.token, dmId.dmId as number, 'guy!');
    messageReactV1(user2.token, dm.messageId, 1);
    messageReactV1(user3.token, dm.messageId, 1);
    expect(messageUnreactV1(user2.token, dm.messageId, 1)).toStrictEqual({});
    expect(messageUnreactV1(user3.token, dm.messageId, 1)).toStrictEqual({});
    expect(dmMessagesV1(user1.token, dmId.dmId, 0)).toStrictEqual({
      end: -1,
      messages: [
        {
          isPinned: false,
          message: 'hi!',
          messageId: dm.messageId,
          reacts: [],
          timeSent: expect.any(Number),
          uId: user1.authUserId,
        },
        {
          isPinned: false,
          message: 'guy!',
          messageId: dm2.messageId,
          reacts: [],
          timeSent: expect.any(Number),
          uId: user1.authUserId,
        },
      ],
      start: 0,
    });
  });
  test('Testing unreacting a message in channel success!', () => {
    const user1 = authRegister('Benfake@gmail.com', 'password123', 'Ben', 'Fake');
    const user2 = authRegister('Johnwick@gmail.com', 'password321', 'John', 'Wick');
    const user3 = authRegister('Jamescharles@gmail.com', 'passcode123', 'James', 'Charles');
    const channel = channelsCreateV2(user1.token, 'John Channel', true);
    channelJoinV2(user2.token, channel.channelId);
    channelJoinV2(user3.token, channel.channelId);
    const msg = messageSendV1(user2.token, channel.channelId as number, 'bye!');
    const msg1 = messageSendV1(user2.token, channel.channelId as number, 'byes!');
    messageReactV1(user2.token, msg.messageId, 1);
    expect(messageReactV1(user1.token, msg.messageId, 1)).toStrictEqual({});
    expect(messageUnreactV1(user1.token, msg.messageId, 1)).toStrictEqual({});
    expect(messageUnreactV1(user2.token, msg.messageId, 1)).toStrictEqual({});
    expect(channelMessageV2(user1.token, channel.channelId, 0)).toStrictEqual({
      end: -1,
      messages: [
        {
          isPinned: false,
          message: 'bye!',
          messageId: msg.messageId,
          reacts: [],
          timeSent: expect.any(Number),
          uId: user2.authUserId,
        },
        {
          isPinned: false,
          message: 'byes!',
          messageId: msg1.messageId,
          reacts: [],
          timeSent: expect.any(Number),
          uId: user2.authUserId,
        },
      ],
      start: 0,
    });
  });
});

describe('testing message send', () => {
  let user1: testUser;
  beforeEach(() => {
    clearV1();
    user1 = authRegister('adalim@gmail.com', 'basic123', 'Ada', 'Lim');
    expect(user1).toStrictEqual({
      authUserId: user1.authUserId,
      token: user1.token,
    });
  });

  test('invalid channelId', () => {
    expect(messageSendV1(user1.token, 0, 'string')).toStrictEqual(INPUT_ERROR);
  });

  test('invalid token', () => {
    const channel: testchannel = channelsCreateV2(user1.token, 'cat', true);
    authLogout(user1.token);
    expect(messageSendV1(user1.token, channel.channelId as number, 'string')).toStrictEqual(PERMISSION_ERROR);
  });

  describe('testing with channel and member(s)', () => {
    let user1: testUser;
    let user2: testUser;
    let channel: testchannel;
    beforeEach(() => {
      clearV1();
      user1 = authRegister('adalim@gmail.com', 'basic123', 'Ada', 'Lim');
      expect(user1).toStrictEqual({
        authUserId: user1.authUserId,
        token: user1.token,
      });

      user2 = authRegister('benbob@gmail.com', 'hi1234', 'ben', 'bob');
      expect(user2).toStrictEqual({
        authUserId: user2.authUserId,
        token: user2.token,

      });

      channel = channelsCreateV2(user1.token, 'cat', true);
      expect(channel).toStrictEqual({ channelId: channel.channelId });
    });

    test('message length over 1000', () => {
      expect(messageSendV1(user1.token, channel.channelId as number, 'a'.repeat(1001))).toStrictEqual(INPUT_ERROR);
    });

    test('message length less than 1', () => {
      expect(messageSendV1(user1.token, channel.channelId as number, '')).toStrictEqual(INPUT_ERROR);
    });

    test('valid channelId, user not a member', () => {
      expect(messageSendV1(user2.token, channel.channelId as number, 'hi')).toStrictEqual(PERMISSION_ERROR);
    });
    test('valid arguments, new message sent', () => {
      const msgId = messageSendV1(user1.token, channel.channelId as number, 'hi!');
      expect(msgId).toStrictEqual({ messageId: msgId.messageId });
      expect(channelMessageV2(user1.token, channel.channelId, 0)).toStrictEqual({
        messages: [
          {
            messageId: msgId.messageId,
            uId: user1.authUserId,
            message: 'hi!',
            timeSent: expect.any(Number),
            isPinned: false,
            reacts: []
          }
        ],
        start: 0,
        end: -1
      });
    });
  });
});

describe('testing message edit', () => {
  let user1: testUser;
  let user2: testUser;
  let channel: testchannel;
  beforeEach(() => {
    clearV1();
    user1 = authRegister('adalim@gmail.com', 'basic123', 'Ada', 'Lim');
    expect(user1).toStrictEqual({
      authUserId: user1.authUserId,
      token: user1.token,
    });
    user2 = authRegister('benbob@gmail.com', 'hi1234', 'ben', 'bob');
    expect(user2).toStrictEqual({
      authUserId: user2.authUserId,
      token: user2.token,
    });

    channel = channelsCreateV2(user1.token, 'cat', true);
    expect(channel).toStrictEqual({ channelId: channel.channelId });
  });

  test('messageId invalid within user channels/dms', () => {
    expect(messageEditV1(user1.token, 0, 'hello again')).toStrictEqual(INPUT_ERROR);
  });

  test('message not sent by user, user has NO perms', () => {
    const msgId = messageSendV1(user1.token, channel.channelId, 'cats');
    expect(msgId).toStrictEqual({ messageId: expect.any(Number) });
    channelJoinV2(user2.token, channel.channelId);
    expect(messageEditV1(user2.token, msgId.messageId, 'fat cat')).toStrictEqual(PERMISSION_ERROR);
  });

  test('message not sent by user, user HAS OWNER perms', () => {
    channelJoinV2(user2.token, channel.channelId);
    const msgId = messageSendV1(user2.token, channel.channelId, 'cats');
    expect(messageEditV1(user1.token, msgId.messageId, 'fat cat')).toStrictEqual({});
  });

  test('invalid token', () => {
    const msgId = messageSendV1(user1.token, channel.channelId, 'cats');
    authLogout(user1.token);
    expect(messageEditV1(user1.token, msgId.messageId, 'fat cat')).toStrictEqual(PERMISSION_ERROR);
  });

  test('message over 1000', () => {
    const msgId = messageSendV1(user1.token, channel.channelId, 'cats');
    expect(messageEditV1(user1.token, msgId.messageId, 'a'.repeat(1001))).toStrictEqual(INPUT_ERROR);
  });

  test('message less than 1', () => {
    const msgId = messageSendV1(user1.token, channel.channelId, 'cats');
    expect(messageEditV1(user1.token, msgId.messageId, '')).toStrictEqual({});
    expect(channelMessageV2(user1.token, channel.channelId, 0)).toStrictEqual({
      messages: [],
      start: 0,
      end: -1
    });
  });

  test('valid edit', () => {
    const msgId = messageSendV1(user1.token, channel.channelId, 'cats');
    expect(messageEditV1(user1.token, msgId.messageId, 'fat cat')).toStrictEqual({});
    expect(channelMessageV2(user1.token, channel.channelId, 0)).toStrictEqual({
      messages: [
        {
          messageId: msgId.messageId,
          uId: user1.authUserId,
          message: 'fat cat',
          timeSent: expect.any(Number),
          isPinned: false,
          reacts: []
        }
      ],
      start: 0,
      end: -1
    });
  });

  test('valid edit dm', () => {
    const dm = createDM(user1.token, []);
    expect(dm).toStrictEqual({ dmId: dm.dmId });
    const msgId = sendDmV1(user1.token, dm.dmId, 'cats');
    expect(messageEditV1(user1.token, msgId.messageId, 'fat cat')).toStrictEqual({});
    expect(dmMessagesV1(user1.token, channel.channelId, 0)).toStrictEqual({
      messages: [
        {
          messageId: msgId.messageId,
          uId: user1.authUserId,
          message: 'fat cat',
          timeSent: expect.any(Number),
          isPinned: false,
          reacts: []
        }
      ],
      start: 0,
      end: -1
    });
  });
});

describe('testing message remove', () => {
  let user1: testUser;
  let user2: testUser;
  let channel: testchannel;
  beforeEach(() => {
    clearV1();
    user1 = authRegister('adalim@gmail.com', 'basic123', 'Ada', 'Lim');
    expect(user1).toStrictEqual({
      authUserId: user1.authUserId,
      token: user1.token,
    });
    user2 = authRegister('benbob@gmail.com', 'hi1234', 'ben', 'bob');
    expect(user2).toStrictEqual({
      authUserId: user2.authUserId,
      token: user2.token,
    });

    channel = channelsCreateV2(user1.token, 'cat', true);
    expect(channel).toStrictEqual({ channelId: channel.channelId });
  });

  test('messageId invalid within user channels/dms', () => {
    expect(messageRemoveV1(user1.token, 0)).toStrictEqual(INPUT_ERROR);
  });

  test('message not sent by user, user has NO perms', () => {
    const msgId = messageSendV1(user1.token, channel.channelId, 'cats');
    channelJoinV2(user2.token, channel.channelId);
    expect(messageRemoveV1(user2.token, msgId.messageId)).toStrictEqual(PERMISSION_ERROR);
  });

  test('message not sent by user, user HAS OWNER perms', () => {
    channelJoinV2(user2.token, channel.channelId);
    const msgId = messageSendV1(user2.token, channel.channelId, 'cats');
    expect(messageRemoveV1(user1.token, msgId.messageId)).toStrictEqual({});
    expect(channelMessageV2(user1.token, channel.channelId, 0)).toStrictEqual({
      messages: [],
      start: 0,
      end: -1
    });
  });

  test('invalid token', () => {
    const msgId = messageSendV1(user1.token, channel.channelId, 'cats');
    authLogout(user1.token);
    expect(messageRemoveV1(user1.token, msgId.messageId)).toStrictEqual(PERMISSION_ERROR);
  });

  test('valid arguments', () => {
    const msgId = messageSendV1(user1.token, channel.channelId, 'cats');
    expect(messageRemoveV1(user1.token, msgId.messageId)).toStrictEqual({});
    expect(channelMessageV2(user1.token, channel.channelId, 0)).toStrictEqual({
      messages: [],
      start: 0,
      end: -1
    });
  });

  test('removed dm sent later', async () => {
    const dm = createDM(user1.token, []);
    const msgId: testMId = messageSendLaterDmV1(user1.token, dm.dmId, 'hi!', timeNow(1));
    expect(msgId).toStrictEqual({ messageId: msgId.messageId });
    expect(dmMessagesV1(user1.token, dm.dmId, 0)).toStrictEqual({
      messages: [],
      start: 0,
      end: -1
    });
    expect(messageRemoveV1(user1.token, msgId.messageId)).toStrictEqual({});

    await new Promise((r) => setTimeout(r, 1001));

    expect(dmMessagesV1(user1.token, dm.dmId, 0)).toStrictEqual({
      messages: [
      ],
      start: 0,
      end: -1
    });
  });
});

describe('testing message/dm', () => {
  let user1: testUser;
  let user2: testUser;
  let dm: testDm;

  beforeEach(() => {
    clearV1();
    user1 = authRegister('adalim@gmail.com', 'basic123', 'Ada', 'Lim');
    user2 = authRegister('Benfake@gmail.com', 'password123', 'Ben', 'Fake');
    expect(user1).toStrictEqual({
      authUserId: user1.authUserId,
      token: user1.token,
    });
    expect(user2).toStrictEqual({
      authUserId: user2.authUserId,
      token: user2.token,
    });
    dm = createDM(user1.token, []);
    // expect(user1.token).toStrictEqual(0);
    expect(dm).toStrictEqual({ dmId: dm.dmId });
  });

  test('invalid dmId', () => {
    expect(sendDmV1(user1.token, 0, 'hi')).toStrictEqual(INPUT_ERROR);
  });

  test('message over 1000 characters', () => {
    expect(sendDmV1(user1.token, dm.dmId, 'a'.repeat(10001))).toStrictEqual(INPUT_ERROR);
  });

  test('message under 1 character', () => {
    expect(sendDmV1(user1.token, dm.dmId, '')).toStrictEqual(INPUT_ERROR);
  });

  test('dmId is valid but user is not a member of DM', () => {
    expect(sendDmV1(user2.token, dm.dmId, 'hello again')).toStrictEqual(PERMISSION_ERROR);
  });

  test('invalid token', () => {
    authLogout(user1.token);
    expect(sendDmV1(user1.token, dm.dmId, 'hello')).toStrictEqual(PERMISSION_ERROR);
  });

  test('vaid arguments', () => {
    const mId: testMId = sendDmV1(user1.token, dm.dmId, 'hi');
    expect(mId).toStrictEqual({ messageId: expect.any(Number) });
    expect(dmMessagesV1(user1.token, dm.dmId, 0)).toStrictEqual({
      messages: [
        {
          messageId: mId.messageId,
          uId: user1.authUserId,
          message: 'hi',
          timeSent: expect.any(Number),
          isPinned: false,
          reacts: []
        }
      ],
      start: 0,
      end: -1
    });
  });
});

function timeNow(modifier?: number) {
  if (modifier) { return Math.floor((Date.now()) / 1000 + modifier); } else { return Math.floor(Date.now() / 1000); }
}

describe('testing pin', () => {
  let user1: testUser;
  let channel: testchannel;
  beforeEach(() => {
    clearV1();
    user1 = authRegister('adalim@gmail.com', 'basic123', 'Ada', 'Lim');
    expect(user1).toStrictEqual({
      authUserId: user1.authUserId,
      token: user1.token,
    });
    channel = channelsCreateV2(user1.token, 'channel', true);
    expect(channel).toStrictEqual({ channelId: expect.any(Number) });
  });

  test('invalid messageId', () => {
    expect(messagePinV1(user1.token, 0)).toStrictEqual(INPUT_ERROR);
  });

  test('invalid token', () => {
    authLogout(user1.token);
    expect(messagePinV1(user1.token, 0)).toStrictEqual(PERMISSION_ERROR);
  });

  test('message pin success', () => {
    const msgId = messageSendV1(user1.token, channel.channelId as number, 'hi!');
    expect(msgId).toStrictEqual({ messageId: msgId.messageId });
    expect(messagePinV1(user1.token, 0)).toStrictEqual({});
    expect(channelMessageV2(user1.token, channel.channelId, 0)).toStrictEqual({
      messages: [
        {
          messageId: msgId.messageId,
          uId: user1.authUserId,
          message: 'hi!',
          timeSent: expect.any(Number),
          isPinned: true,
          reacts: []
        }
      ],
      start: 0,
      end: -1
    });
  });

  test('message already pinned', () => {
    const msgId = messageSendV1(user1.token, channel.channelId as number, 'hi!');
    expect(msgId).toStrictEqual({ messageId: msgId.messageId });
    expect(messagePinV1(user1.token, msgId.messageId)).toStrictEqual({});
    expect(messagePinV1(user1.token, msgId.messageId)).toStrictEqual(INPUT_ERROR);
  });
});

describe('testing unpin', () => {
  let user1: testUser;
  let channel: testchannel;
  beforeEach(() => {
    clearV1();
    user1 = authRegister('adalim@gmail.com', 'basic123', 'Ada', 'Lim');
    expect(user1).toStrictEqual({
      authUserId: user1.authUserId,
      token: user1.token,
    });
    channel = channelsCreateV2(user1.token, 'channel', true);
    expect(channel).toStrictEqual({ channelId: expect.any(Number) });
  });

  test('invalid messageId', () => {
    expect(messageUnpinV1(user1.token, 0)).toStrictEqual(INPUT_ERROR);
  });

  test('invalid token', () => {
    authLogout(user1.token);
    expect(messageUnpinV1(user1.token, 0)).toStrictEqual(PERMISSION_ERROR);
  });

  test('message unpin success', () => {
    const msgId = messageSendV1(user1.token, channel.channelId as number, 'hi!');
    expect(msgId).toStrictEqual({ messageId: msgId.messageId });
    expect(messagePinV1(user1.token, msgId.messageId)).toStrictEqual({});
    expect(messageUnpinV1(user1.token, msgId.messageId)).toStrictEqual({});
    expect(channelMessageV2(user1.token, channel.channelId, 0)).toStrictEqual({
      messages: [
        {
          messageId: msgId.messageId,
          uId: user1.authUserId,
          message: 'hi!',
          timeSent: expect.any(Number),
          isPinned: false,
          reacts: []
        }
      ],
      start: 0,
      end: -1
    });
  });

  test('message already pinned', () => {
    const msgId = messageSendV1(user1.token, channel.channelId as number, 'hi!');
    expect(msgId).toStrictEqual({ messageId: msgId.messageId });
    expect(messageUnpinV1(user1.token, msgId.messageId)).toStrictEqual(INPUT_ERROR);
  });
});

describe('testing sendlaterDm', () => {
  let user1: testUser;
  let user2: testUser;
  let dm: testDm;

  beforeEach(() => {
    clearV1();
    user1 = authRegister('adalim@gmail.com', 'basic123', 'Ada', 'Lim');
    user2 = authRegister('Benfake@gmail.com', 'password123', 'Ben', 'Fake');
    expect(user1).toStrictEqual({
      authUserId: user1.authUserId,
      token: user1.token,
    });
    expect(user2).toStrictEqual({
      authUserId: user2.authUserId,
      token: user2.token,
    });
    dm = createDM(user1.token, []);
    // expect(user1.token).toStrictEqual(0);
    expect(dm).toStrictEqual({ dmId: dm.dmId });
  });

  test('message sent in the past', () => {
    expect(messageSendLaterDmV1(user1.token, dm.dmId, 'abc', timeNow(-3))).toStrictEqual(INPUT_ERROR);
  });

  test('invalid token', () => {
    authLogout(user1.token);
    expect(messageSendLaterDmV1(user1.token, dm.dmId, 'hello', timeNow(0))).toStrictEqual(PERMISSION_ERROR);
  });

  test('vaid arguments, dm sent 1 seconds to the future', async () => {
    const msgId:testMId = messageSendLaterDmV1(user1.token, dm.dmId, 'hi!', timeNow(1));
    expect(msgId).toStrictEqual({ messageId: msgId.messageId });
    await new Promise((r) => setTimeout(r, 1000));
    expect(dmMessagesV1(user1.token, dm.dmId, 0)).toStrictEqual({
      messages: [
        {
          messageId: msgId.messageId,
          uId: user1.authUserId,
          message: 'hi!',
          timeSent: expect.any(Number),
          isPinned: false,
          reacts: []
        }
      ],
      start: 0,
      end: -1

    });
  });
});

describe('testing sendlater', () => {
  let user1: testUser;
  beforeEach(() => {
    clearV1();
    user1 = authRegister('adalim@gmail.com', 'basic123', 'Ada', 'Lim');
    expect(user1).toStrictEqual({
      authUserId: user1.authUserId,
      token: user1.token,
    });
  });

  test('invalid channelId', () => {
    expect(messageSendLaterV1(user1.token, 0, 'string', timeNow())).toStrictEqual(INPUT_ERROR);
  });

  test('invalid token', () => {
    const channel: testchannel = channelsCreateV2(user1.token, 'cat', true);
    authLogout(user1.token);
    expect(messageSendLaterV1(user1.token, channel.channelId as number, 'string', timeNow())).toStrictEqual(PERMISSION_ERROR);
  });

  describe('testing with channel and member(s)', () => {
    let user1: testUser;
    let user2: testUser;
    let channel: testchannel;
    beforeEach(() => {
      clearV1();
      user1 = authRegister('adalim@gmail.com', 'basic123', 'Ada', 'Lim');
      expect(user1).toStrictEqual({
        authUserId: user1.authUserId,
        token: user1.token,
      });

      user2 = authRegister('benbob@gmail.com', 'hi1234', 'ben', 'bob');
      expect(user2).toStrictEqual({
        authUserId: user2.authUserId,
        token: user2.token,

      });

      channel = channelsCreateV2(user1.token, 'cat', true);
      expect(channel).toStrictEqual({ channelId: channel.channelId });
    });

    test('timeSent is in the past', () => {
      expect(messageSendLaterV1(user1.token, channel.channelId, 'hi', timeNow(-10))).toStrictEqual(INPUT_ERROR);
    });
    test('valid arguments, new message sent 1 seconds in the future', async () => {
      const msgId: testMId = messageSendLaterV1(user1.token, channel.channelId, 'hi!', timeNow(1));
      expect(msgId).toStrictEqual({ messageId: msgId.messageId });
      await new Promise((r) => setTimeout(r, 1000));
      expect(channelMessageV2(user1.token, channel.channelId, 0)).toStrictEqual({
        messages: [
          {
            messageId: msgId.messageId,
            uId: user1.authUserId,
            message: 'hi!',
            timeSent: expect.any(Number),
            isPinned: false,
            reacts: []
          }
        ],
        start: 0,
        end: -1
      });
    });
  });
});
