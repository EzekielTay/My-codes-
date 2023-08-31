const INPUT_ERROR = 400;
const PERMISSION_ERROR = 403;
const ISOWNER = 1;
const NORMALUSER = 2;

import {
  authRegister, clearV1, returnUserProfile, userListAll, setUserName, changeUserEmail,
  changeUserHandleStr, changeUserPermissionV1, adminRemoveUserV1, channelsCreateV2, channelJoinV2, messageSendV1,
  createDM, sendDmV1, addOwnerV2, testUser, testchannel, userStatsV1, authLogout, testDm, usersStatsV1, dmRemove, messageRemoveV1
} from './api';

describe('Testing Users Stats', () => {
  beforeEach(() => {
    clearV1();
  });
  test('Invalid token for users stats', () => {
    authRegister('adalim@gmail.com', 'basic123', 'Ada', 'Lim');
    authRegister('johnwick@gmail.com', 'john123', 'John', 'Wick');
    expect(usersStatsV1('token')).toStrictEqual(PERMISSION_ERROR);
  });
  test('Users stats prints out empty', () => {
    const firstUser = authRegister('adalim@gmail.com', 'basic123', 'Ada', 'Lim');
    const stats = usersStatsV1(firstUser.token).workspaceStats;
    expect(stats.channelsExists)
      .toStrictEqual([
        {
          numChannelsExists: 0,
          timeStamp: expect.any(Number),
        },
      ]);
    expect(stats.dmsExists)
      .toStrictEqual([{
        numDmsExists: 0,
        timeStamp: expect.any(Number),
      }]);
    expect(stats.messagesExists)
      .toStrictEqual([{
        numMessagesExists: 0,
        timeStamp: expect.any(Number),
      }]);
    expect(stats.UtilizationRate)
      .toStrictEqual(0);
  });
  test('User stats increments', () => {
    const firstUser = authRegister('adalim@gmail.com', 'basic123', 'Ada', 'Lim');
    channelsCreateV2(firstUser.token, 'John Channel', true);
    const stats = usersStatsV1(firstUser.token).workspaceStats;
    expect(stats.channelsExists)
      .toStrictEqual([
        {
          numChannelsExists: 0,
          timeStamp: expect.any(Number),
        },
        {
          numChannelsExists: 1,
          timeStamp: expect.any(Number),
        },
      ]);
    expect(stats.dmsExists)
      .toStrictEqual([{
        numDmsExists: 0,
        timeStamp: expect.any(Number),
      }]);
    expect(stats.messagesExists)
      .toStrictEqual([{
        numMessagesExists: 0,
        timeStamp: expect.any(Number),
      }]);
    expect(stats.UtilizationRate)
      .toStrictEqual(1);
  });
  test('User stats increments dms', () => {
    const firstUser = authRegister('adalim@gmail.com', 'basic123', 'Ada', 'Lim');
    const secondUser = authRegister('Johnwick@gmail.com', 'password321', 'John', 'Wick');
    authRegister('Jamescharles@gmail.com', 'passcode123', 'James', 'Charles');
    const dm = createDM(firstUser.token, []);
    dmRemove(firstUser.token, dm.dmId);
    createDM(firstUser.token, []);
    const yoga = createDM(secondUser.token, []);
    sendDmV1(secondUser.token, yoga.dmId, 'ya');
    channelsCreateV2(firstUser.token, 'John Channel', true);
    const chan = channelsCreateV2(firstUser.token, 'Jame Channel', true);
    const hello = messageSendV1(firstUser.token, chan.channelId, 'hi');
    messageRemoveV1(firstUser.token, hello.messageId);
    const stats = usersStatsV1(firstUser.token).workspaceStats;
    expect(stats.channelsExists)
      .toStrictEqual([
        {
          numChannelsExists: 0,
          timeStamp: expect.any(Number),
        },
        {
          numChannelsExists: 1,
          timeStamp: expect.any(Number),
        },
        {
          numChannelsExists: 2,
          timeStamp: expect.any(Number),
        },
      ]);
    expect(stats.dmsExists)
      .toStrictEqual([{
        numDmsExists: 0,
        timeStamp: expect.any(Number),
      },
      {
        numDmsExists: 1,
        timeStamp: expect.any(Number),
      },
      {
        numDmsExists: 0,
        timeStamp: expect.any(Number),
      },
      {
        numDmsExists: 1,
        timeStamp: expect.any(Number),
      },
      {
        numDmsExists: 2,
        timeStamp: expect.any(Number),
      }
      ]);
    expect(stats.messagesExists)
      .toStrictEqual([{
        numMessagesExists: 0,
        timeStamp: expect.any(Number),
      },
      {
        numMessagesExists: 1,
        timeStamp: expect.any(Number),
      },
      {
        numMessagesExists: 2,
        timeStamp: expect.any(Number),
      },
      {
        numMessagesExists: 1,
        timeStamp: expect.any(Number),
      }
      ]);
    expect(stats.UtilizationRate)
      .toStrictEqual(2 / 3);
  });
});

describe('HTTP users tests using Jest', () => {
  beforeEach(() => {
    clearV1();
  });

  test('Failed to return user profile ', () => {
    const firstUser = authRegister('adalim@gmail.com', 'basic123', 'Ada', 'Lim');
    expect(returnUserProfile(firstUser.token + 'hi', firstUser.authUserId)).toStrictEqual(PERMISSION_ERROR);
    expect(returnUserProfile(firstUser.token, firstUser.authUserId + 1)).toStrictEqual(INPUT_ERROR);
  });

  test('Succesfully returned user profile ', () => {
    const firstUser = authRegister('adalim@gmail.com', 'basic123', 'Ada', 'Lim');
    const secondUser = authRegister('Benfake@gmail.com', 'password123', 'Ben', 'Fake');

    expect(returnUserProfile(firstUser.token, firstUser.authUserId)).toStrictEqual({
      user: {
        uId: firstUser.authUserId,
        email: 'adalim@gmail.com',
        nameFirst: 'Ada',
        nameLast: 'Lim',
        handleStr: 'adalim'
      }
    });

    expect(returnUserProfile(secondUser.token, firstUser.authUserId)).toStrictEqual({
      user: {
        uId: firstUser.authUserId,
        email: 'adalim@gmail.com',
        nameFirst: 'Ada',
        nameLast: 'Lim',
        handleStr: 'adalim'
      }
    });

    expect(returnUserProfile(firstUser.token, secondUser.authUserId)).toStrictEqual({
      user: {
        uId: secondUser.authUserId,
        email: 'Benfake@gmail.com',
        nameFirst: 'Ben',
        nameLast: 'Fake',
        handleStr: 'benfake'
      }
    });
  });

  test('Failed to return list of all users ', () => {
    const firstUser = authRegister('adalim@gmail.com', 'basic123', 'Ada', 'Lim');
    expect(userListAll(firstUser.token + 'fail')).toStrictEqual(PERMISSION_ERROR);
  });

  test('Successfully return list of all users ', () => {
    const firstUser = authRegister('adalim@gmail.com', 'basic123', 'Ada', 'Lim');
    const secondUser = authRegister('Benfake@gmail.com', 'password123', 'Ben', 'Fake');
    expect(userListAll(firstUser.token)).toStrictEqual([
      {
        uId: firstUser.authUserId,
        email: 'adalim@gmail.com',
        nameFirst: 'Ada',
        nameLast: 'Lim',
        handleStr: 'adalim',
      },

      {
        uId: secondUser.authUserId,
        email: 'Benfake@gmail.com',
        nameFirst: 'Ben',
        nameLast: 'Fake',
        handleStr: 'benfake',
      },
    ]);
  });

  test('Failed to set new user name', () => {
    const firstUser = authRegister('adalim@gmail.com', 'basic123', 'Ada', 'Lim');
    expect(setUserName(firstUser.token, 'fail', '')).toStrictEqual(INPUT_ERROR);
    expect(setUserName(firstUser.token, '', 'fail')).toStrictEqual(INPUT_ERROR);
    expect(setUserName(firstUser.token, 'I am more than 50 characters long I am more than 50 characters long', '')).toStrictEqual(INPUT_ERROR);
    expect(setUserName(firstUser.token, '', 'I am more than 50 characters long I am more than 50 characters long')).toStrictEqual(INPUT_ERROR);
    expect(setUserName(firstUser.token + 'hi', 'Adam', 'lee')).toStrictEqual(PERMISSION_ERROR);
  });

  test('Successfully set new user name', () => {
    const firstUser = authRegister('adalim@gmail.com', 'basic123', 'Ada', 'Lim');
    const secondUser = authRegister('bentan@gmail.com', 'basic12345', 'ben', 'tan');
    expect(setUserName(firstUser.token, 'Adelle', 'Lee')).toStrictEqual({});
    expect(setUserName(firstUser.token, 'Cat', 'fake')).toStrictEqual({});
    expect(setUserName(secondUser.token, 'great', 'name')).toStrictEqual({});
  });

  test('Failed to change user email', () => {
    const firstUser = authRegister('adalim@gmail.com', 'basic123', 'Ada', 'Lim');
    authRegister('bentan@gmail.com', 'basic12345', 'ben', 'tan');
    expect(changeUserEmail(firstUser.token, 'notanemmail')).toStrictEqual(INPUT_ERROR);
    expect(changeUserEmail(firstUser.token, 'bentan@gmail.com')).toStrictEqual(INPUT_ERROR);
    expect(changeUserEmail(firstUser.token + 'hi', 'validemail@gmail.com')).toStrictEqual(PERMISSION_ERROR);
  });

  test('Sucessfully changed user email', () => {
    const firstUser = authRegister('adalim@gmail.com', 'basic123', 'Ada', 'Lim');
    const secondUser = authRegister('bentan@gmail.com', 'basic12345', 'ben', 'tan');
    expect(changeUserEmail(firstUser.token, 'validemail@gmail.com')).toStrictEqual({});
    expect(changeUserEmail(secondUser.token, 'valid2email@gmail.com')).toStrictEqual({});
  });

  test('Failed to change user handlestr', () => {
    const firstUser = authRegister('adalim@gmail.com', 'basic123', 'Ada', 'Lim');
    const secondUser = authRegister('bentan@gmail.com', 'basic12345', 'ben', 'tan');
    expect(changeUserHandleStr(firstUser.token, 'Morethan20characterslong')).toStrictEqual(INPUT_ERROR);
    expect(changeUserHandleStr(firstUser.token, 'bl')).toStrictEqual(INPUT_ERROR);
    expect(changeUserHandleStr(firstUser.token, 'Bentan')).toStrictEqual(INPUT_ERROR);
    expect(changeUserHandleStr(secondUser.token, 'blah)')).toStrictEqual(INPUT_ERROR);
    expect(changeUserHandleStr(firstUser.token, 'blah,')).toStrictEqual(INPUT_ERROR);
    expect(changeUserHandleStr(firstUser.token, 'blah#')).toStrictEqual(INPUT_ERROR);
    expect(changeUserHandleStr(firstUser.token, 'blah%')).toStrictEqual(INPUT_ERROR);
    expect(changeUserHandleStr(firstUser.token + 'hi', 'adadadada')).toStrictEqual(PERMISSION_ERROR);
  });

  test('Successfully changed user handlestr', () => {
    const firstUser = authRegister('adalim@gmail.com', 'basic123', 'Ada', 'Lim');
    const secondUser = authRegister('bentan@gmail.com', 'basic12345', 'ben', 'tan');
    expect(changeUserHandleStr(firstUser.token, 'adadadada')).toStrictEqual({});
    expect(changeUserHandleStr(secondUser.token, 'benny')).toStrictEqual({});
    expect(changeUserHandleStr(secondUser.token, 'benny123')).toStrictEqual({});
    clearV1();
  });
});

describe('HTTP change user Permissions', () => {
  beforeEach(() => {
    clearV1();
  });

  test('Failed to change user permissions', () => {
    const firstUser = authRegister('adalim@gmail.com', 'basic123', 'Ada', 'Lim');
    const secondUser = authRegister('Benfake@gmail.com', 'password123', 'Ben', 'Fake');
    const thirdUser = authRegister('Catlim@gmail.com', 'password12345', 'cat', 'lim');
    expect(changeUserPermissionV1(firstUser.token + 'hi', secondUser.authUserId, ISOWNER)).toStrictEqual(PERMISSION_ERROR); // invalid token
    expect(changeUserPermissionV1(firstUser.token, secondUser.authUserId + 3, ISOWNER)).toStrictEqual(INPUT_ERROR); // invalid uId
    expect(changeUserPermissionV1(firstUser.token, firstUser.authUserId, NORMALUSER)).toStrictEqual(INPUT_ERROR); // User is the only global owner
    expect(changeUserPermissionV1(firstUser.token, secondUser.authUserId, 3)).toStrictEqual(INPUT_ERROR); // permission Id is incorrect
    expect(changeUserPermissionV1(firstUser.token, secondUser.authUserId, 0)).toStrictEqual(INPUT_ERROR); // permission Id is incorrect
    expect(changeUserPermissionV1(firstUser.token, secondUser.authUserId, NORMALUSER)).toStrictEqual(INPUT_ERROR); // permission Id of user is already as specified
    expect(changeUserPermissionV1(firstUser.token, firstUser.authUserId, ISOWNER)).toStrictEqual(INPUT_ERROR); // permission Id of user is already as specified
    expect(changeUserPermissionV1(thirdUser.token, secondUser.authUserId, ISOWNER)).toStrictEqual(PERMISSION_ERROR); // Authorised user is not a global owner
  });

  test('Successfully change user permissions', () => {
    const firstUser = authRegister('adalim@gmail.com', 'basic123', 'Ada', 'Lim');
    const secondUser = authRegister('Benfake@gmail.com', 'password123', 'Ben', 'Fake');
    const thirdUser = authRegister('Catlim@gmail.com', 'password12345', 'cat', 'lim');
    expect(changeUserPermissionV1(firstUser.token, secondUser.authUserId, ISOWNER)).toStrictEqual({});
    expect(changeUserPermissionV1(firstUser.token, thirdUser.authUserId, ISOWNER)).toStrictEqual({});
    expect(changeUserPermissionV1(thirdUser.token, firstUser.authUserId, NORMALUSER)).toStrictEqual({});
    expect(changeUserPermissionV1(thirdUser.token, secondUser.authUserId, NORMALUSER)).toStrictEqual({});
  });
});

describe('HTTP admin remove user from Beans', () => {
  beforeEach(() => {
    clearV1();
  });

  test('Failed to remove user from Beans', () => {
    const firstUser = authRegister('adalim@gmail.com', 'basic123', 'Ada', 'Lim');
    const secondUser = authRegister('Benfake@gmail.com', 'password123', 'Ben', 'Fake');
    const channelOne = channelsCreateV2(firstUser.token, 'Ada Channel', true);
    expect(channelJoinV2(secondUser.token, channelOne.channelId)).toStrictEqual({});
    expect(adminRemoveUserV1(firstUser.token + 'fail', secondUser.authUserId)).toStrictEqual(PERMISSION_ERROR); // invalid token
    expect(adminRemoveUserV1(firstUser.token, secondUser.authUserId + 3)).toStrictEqual(INPUT_ERROR); // invalid uid
    expect(adminRemoveUserV1(firstUser.token, firstUser.authUserId)).toStrictEqual(INPUT_ERROR); // uId belongs to the only Global owner
    expect(adminRemoveUserV1(secondUser.token, secondUser.authUserId)).toStrictEqual(PERMISSION_ERROR); // Authorise User is not global owner
  });

  test('Successfully remove user from Beans', () => {
    const firstUser = authRegister('adalim@gmail.com', 'basic123', 'Ada', 'Lim');
    const secondUser = authRegister('Benfake@gmail.com', 'password123', 'Ben', 'Fake');
    expect(userListAll(firstUser.token)).toStrictEqual([
      {
        uId: firstUser.authUserId,
        email: 'adalim@gmail.com',
        nameFirst: 'Ada',
        nameLast: 'Lim',
        handleStr: 'adalim',
      },
      {
        uId: secondUser.authUserId,
        email: 'Benfake@gmail.com',
        nameFirst: 'Ben',
        nameLast: 'Fake',
        handleStr: 'benfake',
      },
    ]);
    const channelOne = channelsCreateV2(firstUser.token, 'Ada Channel', true);
    expect(channelJoinV2(secondUser.token, channelOne.channelId)).toStrictEqual({});
    expect(addOwnerV2(firstUser.token, channelOne.channelId, secondUser.authUserId)).toStrictEqual({});
    const firstdm = createDM(firstUser.token, [firstUser.authUserId, secondUser.authUserId]);
    expect(firstdm).toStrictEqual({ dmId: expect.any(Number) });
    expect(messageSendV1(secondUser.token, channelOne.channelId, 'hi!')).toStrictEqual({ messageId: expect.any(Number) });
    expect(messageSendV1(firstUser.token, channelOne.channelId, 'hello!')).toStrictEqual({ messageId: expect.any(Number) });
    expect(sendDmV1(secondUser.token, firstdm.dmId, 'hi')).toStrictEqual({ messageId: expect.any(Number) });
    expect(sendDmV1(secondUser.token, firstdm.dmId, 'bye')).toStrictEqual({ messageId: expect.any(Number) });
    expect(sendDmV1(firstUser.token, firstdm.dmId, 'Hello!')).toStrictEqual({ messageId: expect.any(Number) });
    expect(adminRemoveUserV1(firstUser.token, secondUser.authUserId)).toStrictEqual({});
    expect(returnUserProfile(firstUser.token, secondUser.authUserId)).toStrictEqual({
      user: {
        uId: secondUser.authUserId,
        email: '',
        nameFirst: 'Removed',
        nameLast: 'user',
        handleStr: ''
      }
    });
    expect(userListAll(firstUser.token)).toStrictEqual([
      {
        uId: firstUser.authUserId,
        email: 'adalim@gmail.com',
        nameFirst: 'Ada',
        nameLast: 'Lim',
        handleStr: 'adalim',
      },
    ]);
  });
});

describe('testing userStats', () => {
  let user1 : testUser;
  beforeEach(() => {
    clearV1();
    user1 = authRegister('adalim@gmail.com', 'basic123', 'Ada', 'Lim');
    expect(user1).toStrictEqual({
      authUserId: user1.authUserId,
      token: user1.token,
    });
  });

  test('invalid token', () => {
    authLogout(user1.token);
    expect(userStatsV1(user1.token)).toStrictEqual(PERMISSION_ERROR);
  });

  test('user stats called over 1 second interval', async () => {
    const channel: testchannel = channelsCreateV2(user1.token, 'cat', true);
    expect(channel).toStrictEqual({ channelId: channel.channelId });
    expect(userStatsV1(user1.token)).toStrictEqual({
      channelsJoined: [
        {
          numChannelsJoined: 1,
          timeStamp: expect.any(Number)
        }
      ],
      dmsJoined: [
        {
          numDmsJoined: 0,
          timeStamp: expect.any(Number)
        }
      ],
      messagesSent: [
        {
          numMessagesSent: 0,
          timeStamp: expect.any(Number)
        }
      ],
      involvementRate: 1,
    });

    await new Promise((r) => setTimeout(r, 1000));
    const dm1:testDm = createDM(user1.token, []);
    expect(dm1).toStrictEqual({ dmId: expect.any(Number) });
    sendDmV1(user1.token, dm1.dmId, 'hello');
    channelsCreateV2(user1.token, 'cat2', true);
    expect(userStatsV1(user1.token)).toStrictEqual({
      channelsJoined: [
        {
          numChannelsJoined: 1,
          timeStamp: expect.any(Number)
        },
        {
          numChannelsJoined: 2,
          timeStamp: expect.any(Number)
        }
      ],
      dmsJoined: [
        {
          numDmsJoined: 0,
          timeStamp: expect.any(Number)
        },
        {
          numDmsJoined: 1,
          timeStamp: expect.any(Number)
        }
      ],
      messagesSent: [
        {
          numMessagesSent: 0,
          timeStamp: expect.any(Number)
        },
        {
          numMessagesSent: 1,
          timeStamp: expect.any(Number)
        }
      ],
      involvementRate: 1,
    });
  });

  test('involvement rate denominator is 0', () => {
    expect(userStatsV1(user1.token)).toStrictEqual({
      channelsJoined: [
        {
          numChannelsJoined: 0,
          timeStamp: expect.any(Number)
        }
      ],
      dmsJoined: [
        {
          numDmsJoined: 0,
          timeStamp: expect.any(Number)
        }
      ],
      messagesSent: [
        {
          numMessagesSent: 0,
          timeStamp: expect.any(Number)
        }
      ],
      involvementRate: 0,
    });
  });
});
