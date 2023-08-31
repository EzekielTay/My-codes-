import {
  authLogout, dmMessagesV1, sendDmV1, testDm, testUser,
  createDM, dmList, dmLeave, authRegister, clearV1, dmDetails, dmRemove, PERMISSION_ERROR, INPUT_ERROR
} from './api';
import { react } from './dataStore';

const AUTH_ERROR = 403;
describe('testing dm/messages', () => {
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
    expect(dm).toStrictEqual({ dmId: dm.dmId });
  });

  test('invalid dmId', () => {
    expect(dmMessagesV1(user1.token, 0, 0)).toStrictEqual(INPUT_ERROR);
  });

  test('start is greater than total messages in channel', () => {
    expect(dmMessagesV1(user1.token, dm.dmId, 1)).toStrictEqual(INPUT_ERROR);
  });

  test('dmId is valid but user is not a member of DM', () => {
    expect(dmMessagesV1(user2.token, dm.dmId, 0)).toStrictEqual(PERMISSION_ERROR);
  });

  test('invalid token', () => {
    authLogout(user1.token);
    expect(dmMessagesV1(user1.token, dm.dmId, 0)).toStrictEqual(PERMISSION_ERROR);
  });

  test('vaid arguments', () => {
    const mId = sendDmV1(user1.token, dm.dmId, 'hi');
    expect(mId).toStrictEqual({ messageId: expect.any(Number) });
    expect(dmMessagesV1(user1.token, dm.dmId, 0)).toStrictEqual({
      messages: [
        {
          messageId: mId.messageId,
          uId: user1.authUserId,
          message: 'hi',
          timeSent: expect.any(Number),
          reacts: [] as react[],
          isPinned: false
        }
      ],
      start: 0,
      end: -1
    });
  });
  test('Valid arguments 50 messages case', () => {
    const mId = sendDmV1(user1.token, dm.dmId, 'hi');
    expect(mId).toStrictEqual({ messageId: expect.any(Number) });

    for (let i = 0; i < 50; i++) {
      sendDmV1(user1.token, dm.dmId, 'forcing 50 messages');
    }
    const dmdisplay = dmMessagesV1(user1.token, dm.dmId, 0);
    expect(dmdisplay.messages.length).toStrictEqual(50);
    expect(dmdisplay.start).toStrictEqual(0);
    expect(dmdisplay.end).toStrictEqual(50);
  });

  test('vaid arguments 2 users', () => {
    const dm2: testDm = createDM(user1.token, [user2.authUserId]);
    const mId = sendDmV1(user1.token, dm2.dmId, 'hi');
    const mId2 = sendDmV1(user2.token, dm2.dmId, 'bye');
    expect(mId).toStrictEqual({ messageId: expect.any(Number) });
    expect(mId2).toStrictEqual({ messageId: expect.any(Number) });
    expect(dmMessagesV1(user1.token, dm2.dmId, 0)).toStrictEqual({
      messages: [
        {
          messageId: mId.messageId,
          uId: user1.authUserId,
          message: 'hi',
          timeSent: expect.any(Number),
          reacts: [] as react[],
          isPinned: false
        },
        {
          messageId: mId2.messageId,
          uId: user2.authUserId,
          message: 'bye',
          timeSent: expect.any(Number),
          reacts: [] as react[],
          isPinned: false
        }
      ],
      start: 0,
      end: -1
    });
  });
});

describe('Testing dm functions', () => {
  beforeEach(() => {
    clearV1();
  });

  test('Error case uIds does not refer to a valid user', () => {
    const user1 = authRegister('Benfake@gmail.com', 'password123', 'Ben', 'Fake');
    authRegister('Johnwick@gmail.com', 'password321', 'John', 'Wick');
    expect(createDM(user1.token, [20231, 31234])).toStrictEqual(INPUT_ERROR);
  });

  test('Error case if token is invalid', () => {
    authRegister('Benfake@gmail.com', 'password123', 'Ben', 'Fake');
    authRegister('Johnwick@gmail.com', 'password321', 'John', 'Wick');
    expect(createDM('James Charles 33', [1, 2])).toStrictEqual(PERMISSION_ERROR);
  });

  test('Error case if uIds contains duplicate values', () => {
    authRegister('Benfake@gmail.com', 'password123', 'Ben', 'Fake');
    authRegister('Johnwick@gmail.com', 'password321', 'John', 'Wick');
    const user3 = authRegister('jamescharles@gmail.com', 'passcode123', 'james', 'charles');
    expect(createDM(user3.token, [1, 1, 1, 1, 1, 2])).toStrictEqual(INPUT_ERROR);
  });

  test('Success no errors for Creating a dm', () => {
    const user1 = authRegister('Benfake@gmail.com', 'password123', 'Ben', 'Fake');
    const user2 = authRegister('Johnwick@gmail.com', 'password321', 'John', 'Wick');
    authRegister('Jamescharles@gmail.com', 'passcode123', 'James', 'Charles');
    authRegister('zebraguy@gmail.com', 'pass123', 'zebra', 'brother');
    const directMessage = createDM(user1.token, [2, 4, 3]);
    const directMessage2 = createDM(user2.token, [1, 3]);
    expect(directMessage)
      .toStrictEqual({ dmId: directMessage.dmId });
    expect(directMessage2)
      .toStrictEqual({ dmId: directMessage2.dmId });
  });

  test('Error invalid token for dmList', () => {
    authRegister('Benfake@gmail.com', 'password123', 'Ben', 'Fake');
    authRegister('Johnwick@gmail.com', 'password321', 'John', 'Wick');
    expect(dmList('yoghurt12')).toStrictEqual(PERMISSION_ERROR);
  });

  test('Successful implementation for dmList', () => {
    const user1 = authRegister('Benfake@gmail.com', 'password123', 'Ben', 'Fake');
    const user2 = authRegister('Johnwick@gmail.com', 'password321', 'John', 'Wick');
    const user3 = authRegister('Jamescharles@gmail.com', 'passcode123', 'James', 'Charles');
    authRegister('zebraguy@gmail.com', 'pass123', 'zebra', 'brother');
    const directMessage = createDM(user1.token, [2, 3]);
    createDM(user2.token, [1, 4]);
    const directMessage3 = createDM(user2.token, [3]);

    expect(dmList(user3.token)).toStrictEqual({
      dms: [
        { dmId: directMessage.dmId, name: ['benfake', 'jamescharles', 'johnwick'] },
        { dmId: directMessage3.dmId, name: ['jamescharles', 'johnwick'] }
      ]
    });
  });

  test('Error invalid dmId for dmLeave', () => {
    const user1 = authRegister('Benfake@gmail.com', 'password123', 'Ben', 'Fake');
    const user2 = authRegister('Johnwick@gmail.com', 'password321', 'John', 'Wick');
    authRegister('Jamescharles@gmail.com', 'passcode123', 'James', 'Charles');
    authRegister('zebraguy@gmail.com', 'pass123', 'zebra', 'brother');
    createDM(user1.token, [2, 3]);
    createDM(user2.token, [1, 4]);
    createDM(user2.token, [3]);
    expect(dmLeave(user1.token, 90213)).toStrictEqual(INPUT_ERROR);
  });

  test('Error validdmId not a valid token', () => {
    const user1 = authRegister('Benfake@gmail.com', 'password123', 'Ben', 'Fake');
    const user2 = authRegister('Johnwick@gmail.com', 'password321', 'John', 'Wick');
    authRegister('Jamescharles@gmail.com', 'passcode123', 'James', 'Charles');
    authRegister('zebraguy@gmail.com', 'pass123', 'zebra', 'brother');
    createDM(user1.token, [2, 3]);
    const directMessage2 = createDM(user2.token, [1, 4]);
    createDM(user2.token, [3]);
    expect(dmLeave('randomtoken', directMessage2.dmId)).toStrictEqual(PERMISSION_ERROR);
  });

  test('Error validdmId not valid authId', () => {
    const user1 = authRegister('Benfake@gmail.com', 'password123', 'Ben', 'Fake');
    const user2 = authRegister('Johnwick@gmail.com', 'password321', 'John', 'Wick');
    authRegister('Jamescharles@gmail.com', 'passcode123', 'James', 'Charles');
    authRegister('zebraguy@gmail.com', 'pass123', 'zebra', 'brother');
    createDM(user1.token, [2, 3]);
    createDM(user2.token, [1, 4]);
    const directMessage3 = createDM(user2.token, [3]);
    expect(dmLeave(user1.token, directMessage3.dmId))
      .toStrictEqual(PERMISSION_ERROR);
  });

  test('Success case valid removal', () => {
    const user1 = authRegister('Benfake@gmail.com', 'password123', 'Ben', 'Fake');
    const user2 = authRegister('Johnwick@gmail.com', 'password321', 'John', 'Wick');
    authRegister('Jamescharles@gmail.com', 'passcode123', 'James', 'Charles');
    authRegister('zebraguy@gmail.com', 'pass123', 'zebra', 'brother');
    const directMessage = createDM(user1.token, [2, 3]);
    createDM(user2.token, [1, 4]);
    createDM(user2.token, [3]);
    expect(dmLeave(user2.token, directMessage.dmId)).toStrictEqual({});
    expect(dmDetails(user2.token, directMessage.dmId)).toStrictEqual(AUTH_ERROR);
  });
});

describe('Testing dm details', () => {
  beforeEach(() => {
    clearV1();
  });

  test('invalid dmId', () => {
    const user1 = authRegister('abcd@gmail.com', 'basic123', 'abc', 'cde');
    const user2 = authRegister('abced@gmail.com', 'password123', 'ancde', 'efg');
    createDM(user1.token, [user2.authUserId]);
    expect(dmDetails(user1.token, -1)).toStrictEqual(INPUT_ERROR);
  });

  test('invalid token', () => {
    const user1 = authRegister('abcd@gmail.com', 'basic123', 'abc', 'cde');
    const user2 = authRegister('abcde@gmail.com', 'password123', 'ancde', 'efg');
    const dm = createDM(user1.token, [user2.authUserId]);

    expect(dmDetails('-2', dm.dmId)).toStrictEqual(AUTH_ERROR);
  });

  test('user not in channel', () => {
    const user1 = authRegister('abcd@gmail.com', 'basic123', 'abc', 'cde');
    const user2 = authRegister('abcde@gmail.com', 'password123', 'ancde', 'efg');
    const dm = createDM(user1.token, [user2.authUserId]);
    expect(dmDetails('-2', dm.dmId)).toStrictEqual(AUTH_ERROR);
  });

  test('1 to 1 dm: owner', () => {
    const user1 = authRegister('abcd@gmail.com', 'basic123', 'abc', 'cde');
    const user2 = authRegister('abcde@gmail.com', 'password123', 'ancde', 'efg');
    const dm = createDM(user1.token, [user2.authUserId]);
    createDM(user1.token, [user2.authUserId]);
    expect(dmDetails(user1.token, dm.dmId)).toStrictEqual({
      name: [
        'abccde',
        'ancdeefg'
      ],
      members: [
        {
          uId: user1.authUserId,
          email: 'abcd@gmail.com',
          nameFirst: 'abc',
          nameLast: 'cde',
          handleStr: 'abccde'
        },
        {
          uId: user2.authUserId,
          email: 'abcde@gmail.com',
          nameFirst: 'ancde',
          nameLast: 'efg',
          handleStr: 'ancdeefg'
        }
      ]
    });
  });

  test('1 to 1 dm: user', () => {
    const user1 = authRegister('abcd@gmail.com', 'basic123', 'abc', 'cde');
    const user2 = authRegister('abcde@gmail.com', 'password123', 'ancde', 'efg');
    const dm = createDM(user1.token, [user2.authUserId]);
    expect(dmDetails(user2.token, dm.dmId)).toStrictEqual({
      name: [
        'abccde',
        'ancdeefg'
      ],
      members: [
        {
          uId: user1.authUserId,
          email: 'abcd@gmail.com',
          nameFirst: 'abc',
          nameLast: 'cde',
          handleStr: 'abccde'
        },
        {
          uId: user2.authUserId,
          email: 'abcde@gmail.com',
          nameFirst: 'ancde',
          nameLast: 'efg',
          handleStr: 'ancdeefg'
        }
      ]
    });
  });

  test('1 to 1 dm: owner', () => {
    const user1 = authRegister('abcd@gmail.com', 'basic123', 'abc', 'cde');
    const user2 = authRegister('abcde@gmail.com', 'password123', 'ancde', 'efg');
    const user3 = authRegister('bcdef@gmail.com', 'lastingabc123', 'bcde', 'fgh');
    const dm = createDM(user1.token, [user2.authUserId, user3.authUserId]);
    expect(dmDetails(user1.token, dm.dmId)).toStrictEqual({
      name: [
        'abccde',
        'ancdeefg',
        'bcdefgh'
      ],
      members: [
        {
          uId: user1.authUserId,
          email: 'abcd@gmail.com',
          nameFirst: 'abc',
          nameLast: 'cde',
          handleStr: 'abccde'
        },
        {
          uId: user2.authUserId,
          email: 'abcde@gmail.com',
          nameFirst: 'ancde',
          nameLast: 'efg',
          handleStr: 'ancdeefg'
        },
        {
          uId: user3.authUserId,
          email: 'bcdef@gmail.com',
          nameFirst: 'bcde',
          nameLast: 'fgh',
          handleStr: 'bcdefgh'
        }
      ]
    });
  });

  test('1 to 1 dm: user1', () => {
    const user1 = authRegister('abcd@gmail.com', 'basic123', 'abc', 'cde');
    const user2 = authRegister('abcde@gmail.com', 'password123', 'ancde', 'efg');
    const user3 = authRegister('bcdef@gmail.com', 'lastingabc123', 'bcde', 'fgh');
    const dm = createDM(user1.token, [user2.authUserId, user3.authUserId]);
    expect(dmDetails(user2.token, dm.dmId)).toStrictEqual({
      name: [
        'abccde',
        'ancdeefg',
        'bcdefgh'
      ],
      members: [
        {
          uId: user1.authUserId,
          email: 'abcd@gmail.com',
          nameFirst: 'abc',
          nameLast: 'cde',
          handleStr: 'abccde'
        },
        {
          uId: user2.authUserId,
          email: 'abcde@gmail.com',
          nameFirst: 'ancde',
          nameLast: 'efg',
          handleStr: 'ancdeefg'
        },
        {
          uId: user3.authUserId,
          email: 'bcdef@gmail.com',
          nameFirst: 'bcde',
          nameLast: 'fgh',
          handleStr: 'bcdefgh'
        }
      ]
    });
  });

  test('1 to 1 dm: user2', () => {
    const user1 = authRegister('abcd@gmail.com', 'basic123', 'abc', 'cde');
    const user2 = authRegister('abcde@gmail.com', 'password123', 'ancde', 'efg');
    const user3 = authRegister('bcdef@gmail.com', 'lastingabc123', 'bcde', 'fgh');
    const dm = createDM(user1.token, [user2.authUserId, user3.authUserId]);
    expect(dmDetails(user3.token, dm.dmId)).toStrictEqual({
      name: [
        'abccde',
        'ancdeefg',
        'bcdefgh'
      ],
      members: [
        {
          uId: user1.authUserId,
          email: 'abcd@gmail.com',
          nameFirst: 'abc',
          nameLast: 'cde',
          handleStr: 'abccde'
        },
        {
          uId: user2.authUserId,
          email: 'abcde@gmail.com',
          nameFirst: 'ancde',
          nameLast: 'efg',
          handleStr: 'ancdeefg'
        },
        {
          uId: user3.authUserId,
          email: 'bcdef@gmail.com',
          nameFirst: 'bcde',
          nameLast: 'fgh',
          handleStr: 'bcdefgh'
        }
      ]
    });
  });

  test('invalid dmId', () => {
    const user1 = authRegister('abcd@gmail.com', 'basic123', 'abc', 'cde');
    const user2 = authRegister('abced@gmail.com', 'password123', 'ancde', 'efg');
    createDM(user1.token, [user2.authUserId]);
    expect(dmRemove(user1.token, -1)).toStrictEqual(INPUT_ERROR);
  });

  test('invalid token', () => {
    const user1 = authRegister('abcd@gmail.com', 'basic123', 'abc', 'cde');
    const user2 = authRegister('abced@gmail.com', 'password123', 'ancde', 'efg');
    const dm = createDM(user1.token, [user2.authUserId]);
    expect(dmRemove('99', dm.dmId)).toStrictEqual(INPUT_ERROR);
  });

  test('user left', () => {
    const user1 = authRegister('abcd@gmail.com', 'basic123', 'abc', 'cde');
    const user2 = authRegister('abcde@gmail.com', 'password123', 'ancde', 'efg');
    const dm = createDM(user1.token, [user2.authUserId]);
    dmLeave(user1.token, dm.dmId);
    expect(dmRemove(user1.token, dm.dmId)).toStrictEqual(AUTH_ERROR);
  });

  test('not creator', () => {
    const user1 = authRegister('abcd@gmail.com', 'basic123', 'abc', 'cde');
    const user2 = authRegister('abced@gmail.com', 'password123', 'ancde', 'efg');
    const dm = createDM(user1.token, [user2.authUserId]);

    expect(dmRemove(user2.token, dm.dmId)).toStrictEqual(AUTH_ERROR);
  });

  test('normal', () => {
    const user1 = authRegister('abcd@gmail.com', 'basic123', 'abc', 'cde');
    const user2 = authRegister('abced@gmail.com', 'password123', 'ancde', 'efg');
    const dm = createDM(user1.token, [user2.authUserId]);
    createDM(user1.token, [user2.authUserId]);
    expect(dmRemove(user1.token, dm.dmId)).toStrictEqual({});
    expect(dmDetails(user1.token, dm.dmId)).toStrictEqual(AUTH_ERROR);
  });

  test('normal: userside', () => {
    const user1 = authRegister('abcd@gmail.com', 'basic123', 'abc', 'cde');
    const user2 = authRegister('abced@gmail.com', 'password123', 'ancde', 'efg');
    const dm = createDM(user1.token, [user2.authUserId]);
    expect(dmRemove(user1.token, dm.dmId)).toStrictEqual({});
    expect(dmDetails(user2.token, dm.dmId)).toStrictEqual(AUTH_ERROR);
  });

  test('normal: more poeple', () => {
    const user1 = authRegister('abcd@gmail.com', 'basic123', 'abc', 'cde');
    const user2 = authRegister('abced@gmail.com', 'password123', 'ancde', 'efg');
    const user3 = authRegister('abcedd@gmail.com', 'password123', 'andcde', 'efg');
    const dm = createDM(user1.token, [user2.authUserId, user3.authUserId]);
    expect(dmRemove(user1.token, dm.dmId)).toStrictEqual({});
    expect(dmDetails(user1.token, dm.dmId)).toStrictEqual(AUTH_ERROR);
  });

  test('normal: more poeple user1 check', () => {
    const user1 = authRegister('abcd@gmail.com', 'basic123', 'abc', 'cde');
    const user2 = authRegister('abced@gmail.com', 'password123', 'ancde', 'efg');
    const user3 = authRegister('abcedd@gmail.com', 'password123', 'andcde', 'efg');
    const dm = createDM(user1.token, [user2.authUserId, user3.authUserId]);
    expect(dmRemove(user1.token, dm.dmId)).toStrictEqual({});
    expect(dmDetails(user2.token, dm.dmId)).toStrictEqual(AUTH_ERROR);
  });

  test('normal: more poeple user2 check', () => {
    const user1 = authRegister('abcd@gmail.com', 'basic123', 'abc', 'cde');
    const user2 = authRegister('abced@gmail.com', 'password123', 'ancde', 'efg');
    const user3 = authRegister('abcedd@gmail.com', 'password123', 'andcde', 'efg');
    const dm = createDM(user1.token, [user2.authUserId, user3.authUserId]);
    expect(dmRemove(user1.token, dm.dmId)).toStrictEqual({});
    expect(dmDetails(user3.token, dm.dmId)).toStrictEqual(AUTH_ERROR);
  });
});
