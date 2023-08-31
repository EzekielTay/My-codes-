import {
  clearV1, channelsCreateV2, channelDetailsV2, channelJoinV2, channelInviteV2, channelLeaveV1,
  authLogin, authRegister, standupSendV1, standupActiveV1, standupStartV1, channelMessageV2
} from './api';

const INPUT_ERROR = 400;
const AUTH_ERROR = 403;

describe('Test Channel functions with HTTP', () => {
  beforeEach(() => {
    clearV1();
  });

  test('details Error case: invalid usertoken', () => {
    authRegister('abcd@gmail.com', 'asdfasdf', 'sadkf', 'asd');
    const log1 = authLogin('abcd@gmail.com', 'asdfasdf');
    const channel1 = channelsCreateV2(log1.token, 'askldf', true);
    expect(channelDetailsV2('9tfdsfu', channel1.channelId)).toStrictEqual(
      AUTH_ERROR
    );
  });

  test('details Error case: invalid channelId', () => {
    authRegister('abcd@gmail.com', 'asdfasdf', 'sadkf', 'asd');
    const log1 = authLogin('abcd@gmail.com', 'asdfasdf');
    const channel = channelsCreateV2(log1.token, 'askldf', true);
    expect(channelDetailsV2(log1.token, channel.channelId - 23)).toStrictEqual(
      INPUT_ERROR
    );
  });

  test('details Error case: user not in channel', () => {
    authRegister('abcd@gmail.com', 'asdfasdf', 'sadkf', 'asd');
    const log1 = authLogin('abcd@gmail.com', 'asdfasdf');
    const channel1 = channelsCreateV2(log1.token, 'askldf', true);
    authRegister('abcde@gmail.com', 'asdfasdfasdf', 'sadkfa', 'asde');
    const log2 = authLogin('abcde@gmail.com', 'asdfasdfasdf');
    expect(channelDetailsV2(log2.token, channel1.channelId)).toStrictEqual(
      AUTH_ERROR
    );
  });

  test('details Error case: invalid usertoken', () => {
    authRegister('abcd@gmail.com', 'asdfasdf', 'sadkf', 'asd');
    const log1 = authLogin('abcd@gmail.com', 'asdfasdf');
    const channel1 = channelsCreateV2(log1.token, 'askldf', true);
    expect(channelDetailsV2('23tsdfsu', channel1.channelId)).toStrictEqual(
      AUTH_ERROR
    );
  });

  test('details Normal case: creater inspection', () => {
    const user1 = authRegister('abcd@gmail.com', 'asdfasdf', 'sadkf', 'asd');
    const log1 = authLogin('abcd@gmail.com', 'asdfasdf');
    const channel1 = channelsCreateV2(log1.token, 'askldf', true);
    expect(channelDetailsV2(log1.token, channel1.channelId)).toStrictEqual(
      {
        isPublic: true,
        name: 'askldf',
        ownerMembers: [
          {
            uId: user1.authUserId,
            email: 'abcd@gmail.com',
            nameFirst: 'sadkf',
            nameLast: 'asd',
            handleStr: 'sadkfasd',
          }
        ],
        allMembers: [
          {
            uId: user1.authUserId,
            email: 'abcd@gmail.com',
            nameFirst: 'sadkf',
            nameLast: 'asd',
            handleStr: 'sadkfasd',
          }
        ]
      }
    );
  });

  test('Join Error case: invalid channelId', () => {
    authRegister('abcd@gmail.com', 'asdfasdf', 'sadkf', 'asd');
    authRegister('abcde@gmail.com', 'asdfasdfa', 'first', 'last');
    const log1 = authLogin('abcd@gmail.com', 'asdfasdf');

    channelsCreateV2(log1.token, 'askldf', true);

    const log2 = authLogin('abcde@gmail.com', 'asdfasdfa');

    expect(channelJoinV2(log2.token, -99)).toStrictEqual(
      INPUT_ERROR
    );
  });

  test('Join Error case: invalid token', () => {
    authRegister('abcd@gmail.com', 'asdfasdf', 'sadkf', 'asd');
    authRegister('abcde@gmail.com', 'asdfasdfa', 'first', 'last');
    const log1 = authLogin('abcd@gmail.com', 'asdfasdf');

    const channel1 = channelsCreateV2(log1.token, 'askldf', true);

    authLogin('abcde@gmail.com', 'asdfasdfa');

    expect(channelJoinV2('9tfdsfud', channel1.channelId)).toStrictEqual(
      AUTH_ERROR
    );
  });

  test('Join Error case: user already member', () => {
    authRegister('abcd@gmail.com', 'asdfasdf', 'sadkf', 'asd');
    authRegister('abcde@gmail.com', 'asdfasdfa', 'first', 'last');
    const log1 = authLogin('abcd@gmail.com', 'asdfasdf');

    const channel1 = channelsCreateV2(log1.token, 'askldf', true);

    const log2 = authLogin('abcde@gmail.com', 'asdfasdfa');
    channelJoinV2(log2.token, channel1.channelId);

    expect(channelJoinV2(log2.token, channel1.channelId)).toStrictEqual(
      INPUT_ERROR
    );
  });

  test('Join Error case: user joining private', () => {
    authRegister('abcd@gmail.com', 'asdfasdf', 'sadkf', 'asd');
    authRegister('abcde@gmail.com', 'asdfasdfa', 'first', 'last');
    const log1 = authLogin('abcd@gmail.com', 'asdfasdf');

    const channel1 = channelsCreateV2(log1.token, 'askldf', false);

    const log2 = authLogin('abcde@gmail.com', 'asdfasdfa');

    expect(channelJoinV2(log2.token, channel1.channelId)).toStrictEqual(
      AUTH_ERROR
    );
  });

  test('Join case: user join', () => {
    const user1 = authRegister('abcd@gmail.com', 'asdfasdf', 'sadkf', 'asd');
    const user2 = authRegister('abcde@gmail.com', 'asdfasdfa', 'first', 'last');
    const log1 = authLogin('abcd@gmail.com', 'asdfasdf');

    const channel1 = channelsCreateV2(log1.token, 'askldf', true);

    const log2 = authLogin('abcde@gmail.com', 'asdfasdfa');

    expect(channelJoinV2(log2.token, channel1.channelId)).toStrictEqual(
      {}
    );

    expect(channelDetailsV2(log1.token, channel1.channelId)).toStrictEqual(
      {
        isPublic: true,
        name: 'askldf',
        ownerMembers: [
          {
            uId: user1.authUserId,
            email: 'abcd@gmail.com',
            nameFirst: 'sadkf',
            nameLast: 'asd',
            handleStr: 'sadkfasd',
          }
        ],
        allMembers: [
          {
            uId: user1.authUserId,
            email: 'abcd@gmail.com',
            nameFirst: 'sadkf',
            nameLast: 'asd',
            handleStr: 'sadkfasd',
          },
          {
            uId: user2.authUserId,
            email: 'abcde@gmail.com',
            nameFirst: 'first',
            nameLast: 'last',
            handleStr: 'firstlast',
          }
        ]
      }
    );
  });

  test('Join case: perm 1 user join', () => {
    const user1 = authRegister('abcd@gmail.com', 'asdfasdf', 'sadkf', 'asd');
    const user2 = authRegister('abcde@gmail.com', 'asdfasdfa', 'first', 'last');
    const log2 = authLogin('abcde@gmail.com', 'asdfasdfa');

    const channel1 = channelsCreateV2(log2.token, 'askldf', false);
    const log1 = authLogin('abcd@gmail.com', 'asdfasdf');

    expect(channelJoinV2(log1.token, channel1.channelId)).toStrictEqual(
      {}
    );

    expect(channelDetailsV2(log1.token, channel1.channelId)).toStrictEqual(
      {
        isPublic: false,
        name: 'askldf',
        ownerMembers: [
          {
            uId: user2.authUserId,
            email: 'abcde@gmail.com',
            nameFirst: 'first',
            nameLast: 'last',
            handleStr: 'firstlast',
          }
        ],
        allMembers: [
          {
            uId: user2.authUserId,
            email: 'abcde@gmail.com',
            nameFirst: 'first',
            nameLast: 'last',
            handleStr: 'firstlast',
          },
          {
            uId: user1.authUserId,
            email: 'abcd@gmail.com',
            nameFirst: 'sadkf',
            nameLast: 'asd',
            handleStr: 'sadkfasd',
          }
        ]
      }
    );
  });

  test('invite Error case: invalid channelId', () => {
    authRegister('abcd@gmail.com', 'asdfasdf', 'sadkf', 'asd');
    authRegister('abcde@gmail.com', 'asdfasdfa', 'first', 'last');
    const log1 = authLogin('abcd@gmail.com', 'asdfasdf');

    channelsCreateV2(log1.token, 'askldf', true);

    const log2 = authLogin('abcde@gmail.com', 'asdfasdfa');

    expect(channelInviteV2(log1.token, -9, log2.authUserId)).toStrictEqual(
      INPUT_ERROR
    );
  });

  test('invite Error case: invalid token', () => {
    authRegister('abcd@gmail.com', 'asdfasdf', 'sadkf', 'asd');
    authRegister('abcde@gmail.com', 'asdfasdfa', 'first', 'last');
    const log1 = authLogin('abcd@gmail.com', 'asdfasdf');

    const channel1 = channelsCreateV2(log1.token, 'askldf', true);

    const log2 = authLogin('abcde@gmail.com', 'asdfasdfa');

    expect(channelInviteV2('0tdsadfsd', channel1.channelId, log2.authUserId)).toStrictEqual(
      AUTH_ERROR
    );
  });

  test('invite Error case: invalid uId', () => {
    authRegister('abcd@gmail.com', 'asdfasdf', 'sadkf', 'asd');
    authRegister('abcde@gmail.com', 'asdfasdfa', 'first', 'last');
    const log1 = authLogin('abcd@gmail.com', 'asdfasdf');

    const channel1 = channelsCreateV2(log1.token, 'askldf', true);

    authLogin('abcde@gmail.com', 'asdfasdfa');

    expect(channelInviteV2(log1.token, channel1.channelId, 234)).toStrictEqual(
      INPUT_ERROR
    );
  });

  test('invite Error case: authuser not in channel', () => {
    authRegister('abcd@gmail.com', 'asdfasdf', 'sadkf', 'asd');
    authRegister('abcde@gmail.com', 'asdfasdfa', 'first', 'last');
    const log1 = authLogin('abcd@gmail.com', 'asdfasdf');

    const channel1 = channelsCreateV2(log1.token, 'askldf', true);

    const log2 = authLogin('abcde@gmail.com', 'asdfasdfa');
    const user3 = authRegister('sdfsd@gmail.com', 'asdfasdfad', 'sad', 'dolphin');
    expect(channelInviteV2(user3.token, channel1.channelId, log2.authUserId)).toStrictEqual(
      AUTH_ERROR
    );
  });

  test('invite Error case: user already in channel', () => {
    authRegister('abcd@gmail.com', 'asdfasdf', 'sadkf', 'asd');
    authRegister('abcde@gmail.com', 'asdfasdfa', 'first', 'last');
    const log1 = authLogin('abcd@gmail.com', 'asdfasdf');
    const channel1 = channelsCreateV2(log1.token, 'askldf', true);
    const log2 = authLogin('abcde@gmail.com', 'asdfasdfa');
    channelJoinV2(log2.token, channel1.channelId);
    expect(channelInviteV2(log1.token, channel1.channelId, log2.authUserId)).toStrictEqual(
      INPUT_ERROR
    );
  });

  test('invite case: normal public', () => {
    const user1 = authRegister('abcd@gmail.com', 'asdfasdf', 'sadkf', 'asd');
    const user2 = authRegister('abcde@gmail.com', 'asdfasdfa', 'first', 'last');
    const log1 = authLogin('abcd@gmail.com', 'asdfasdf');
    const channel1 = channelsCreateV2(log1.token, 'askldf', true);
    channelsCreateV2(log1.token, 'askldfg', true);
    const log2 = authLogin('abcde@gmail.com', 'asdfasdfa');
    expect(channelInviteV2(log1.token, channel1.channelId, log2.authUserId)).toStrictEqual(
      {}
    );

    expect(channelDetailsV2(log1.token, channel1.channelId)).toStrictEqual(
      {
        isPublic: true,
        name: 'askldf',
        ownerMembers: [
          {
            uId: user1.authUserId,
            email: 'abcd@gmail.com',
            nameFirst: 'sadkf',
            nameLast: 'asd',
            handleStr: 'sadkfasd',
          }
        ],
        allMembers: [
          {
            uId: user1.authUserId,
            email: 'abcd@gmail.com',
            nameFirst: 'sadkf',
            nameLast: 'asd',
            handleStr: 'sadkfasd',
          },
          {
            uId: user2.authUserId,
            email: 'abcde@gmail.com',
            nameFirst: 'first',
            nameLast: 'last',
            handleStr: 'firstlast',
          }
        ]
      }
    );
  });

  test('invite case: normal private', () => {
    const user1 = authRegister('abcd@gmail.com', 'asdfasdf', 'sadkf', 'asd');
    const user2 = authRegister('abcde@gmail.com', 'asdfasdfa', 'first', 'last');
    const log1 = authLogin('abcd@gmail.com', 'asdfasdf');
    const channel1 = channelsCreateV2(log1.token, 'askldf', false);
    const log2 = authLogin('abcde@gmail.com', 'asdfasdfa');
    expect(channelInviteV2(log1.token, channel1.channelId, log2.authUserId)).toStrictEqual(
      {}
    );

    expect(channelDetailsV2(log1.token, channel1.channelId)).toStrictEqual(
      {
        isPublic: false,
        name: 'askldf',
        ownerMembers: [
          {
            uId: user1.authUserId,
            email: 'abcd@gmail.com',
            nameFirst: 'sadkf',
            nameLast: 'asd',
            handleStr: 'sadkfasd',
          }
        ],
        allMembers: [
          {
            uId: user1.authUserId,
            email: 'abcd@gmail.com',
            nameFirst: 'sadkf',
            nameLast: 'asd',
            handleStr: 'sadkfasd',
          },
          {
            uId: user2.authUserId,
            email: 'abcde@gmail.com',
            nameFirst: 'first',
            nameLast: 'last',
            handleStr: 'firstlast',
          }
        ]
      }
    );
  });

  test('Leave Error case: invalid channelId', () => {
    authRegister('abcd@gmail.com', 'asdfasdf', 'sadkf', 'asd');
    const log1 = authLogin('abcd@gmail.com', 'asdfasdf');
    const channel = channelsCreateV2(log1.token, 'askldf', true);
    expect(channelJoinV2(log1.token, channel.channelId - 99)).toStrictEqual(INPUT_ERROR);
  });

  test('Leave Error case: invalid token', () => {
    authRegister('abcd@gmail.com', 'asdfasdf', 'sadkf', 'asd');
    const log1 = authLogin('abcd@gmail.com', 'asdfasdf');
    const channel1 = channelsCreateV2(log1.token, 'askldf', true);
    expect(channelLeaveV1('-99tfdsfa', channel1.channelId)).toStrictEqual(
      AUTH_ERROR
    );
  });
  test('Leave Error case: channelId does not exist', () => {
    authRegister('abcd@gmail.com', 'asdfasdf', 'sadkf', 'asd');
    const log1 = authLogin('abcd@gmail.com', 'asdfasdf');

    const channel1 = channelsCreateV2(log1.token, 'askldf', true);
    expect(channelLeaveV1(log1.token, channel1.channelId - 99)).toStrictEqual(
      INPUT_ERROR
    );
  });

  test('Leave Error case:  user not in channel', () => {
    authRegister('abcd@gmail.com', 'asdfasdf', 'sadkf', 'asd');
    const log1 = authLogin('abcd@gmail.com', 'asdfasdf');

    const channel1 = channelsCreateV2(log1.token, 'askldf', true);
    authRegister('abcde@gmail.com', 'asdfasdfa', 'sakf', 'asd');
    const log2 = authLogin('abcde@gmail.com', 'asdfasdfa');

    expect(channelLeaveV1(log2.token, channel1.channelId)).toStrictEqual(
      AUTH_ERROR
    );
  });

  test('Leave case: user leave', () => {
    const user1 = authRegister('abcd@gmail.com', 'asdfasdf', 'sadkf', 'asd');
    const user2 = authRegister('abcde@gmail.com', 'asdfasdfa', 'first', 'last');
    const log1 = authLogin('abcd@gmail.com', 'asdfasdf');

    const channel1 = channelsCreateV2(log1.token, 'askldf', true);
    channelsCreateV2(log1.token, 'askldf', true);
    channelsCreateV2(user2.token, 'askldf', true);

    const log2 = authLogin('abcde@gmail.com', 'asdfasdfa');

    expect(channelJoinV2(log2.token, channel1.channelId)).toStrictEqual(
      {}
    );

    expect(channelDetailsV2(log1.token, channel1.channelId)).toStrictEqual(
      {
        isPublic: true,
        name: 'askldf',
        ownerMembers: [
          {
            uId: user1.authUserId,
            email: 'abcd@gmail.com',
            nameFirst: 'sadkf',
            nameLast: 'asd',
            handleStr: 'sadkfasd',
          }
        ],
        allMembers: [
          {
            uId: user1.authUserId,
            email: 'abcd@gmail.com',
            nameFirst: 'sadkf',
            nameLast: 'asd',
            handleStr: 'sadkfasd',
          },
          {
            uId: user2.authUserId,
            email: 'abcde@gmail.com',
            nameFirst: 'first',
            nameLast: 'last',
            handleStr: 'firstlast',
          }
        ]
      }
    );

    expect(channelLeaveV1(log2.token, channel1.channelId)).toStrictEqual(
      {}
    );

    expect(channelDetailsV2(log1.token, channel1.channelId)).toStrictEqual(
      {
        isPublic: true,
        name: 'askldf',
        ownerMembers: [
          {
            uId: user1.authUserId,
            email: 'abcd@gmail.com',
            nameFirst: 'sadkf',
            nameLast: 'asd',
            handleStr: 'sadkfasd',
          }
        ],
        allMembers: [
          {
            uId: user1.authUserId,
            email: 'abcd@gmail.com',
            nameFirst: 'sadkf',
            nameLast: 'asd',
            handleStr: 'sadkfasd',
          },
        ]
      }
    );
  });

  test('Leave case: owner leave', () => {
    const user1 = authRegister('abcd@gmail.com', 'asdfasdf', 'sadkf', 'asd');
    const user2 = authRegister('abcde@gmail.com', 'asdfasdfa', 'first', 'last');
    const log1 = authLogin('abcd@gmail.com', 'asdfasdf');
    const log2 = authLogin('abcde@gmail.com', 'asdfasdfa');

    const channel1 = channelsCreateV2(log2.token, 'askldf', true);
    channelsCreateV2(log2.token, 'askldfh', true);
    channelsCreateV2(log1.token, 'askldfh', true);
    channelJoinV2(log2.token, channel1.channelId);

    expect(channelJoinV2(log1.token, channel1.channelId)).toStrictEqual(
      {}
    );

    expect(channelDetailsV2(log1.token, channel1.channelId)).toStrictEqual(
      {
        isPublic: true,
        name: 'askldf',
        ownerMembers: [
          {
            uId: user2.authUserId,
            email: 'abcde@gmail.com',
            nameFirst: 'first',
            nameLast: 'last',
            handleStr: 'firstlast',
          }
        ],
        allMembers: [
          {
            uId: user2.authUserId,
            email: 'abcde@gmail.com',
            nameFirst: 'first',
            nameLast: 'last',
            handleStr: 'firstlast',
          },
          {
            uId: user1.authUserId,
            email: 'abcd@gmail.com',
            nameFirst: 'sadkf',
            nameLast: 'asd',
            handleStr: 'sadkfasd',
          }
        ]
      }
    );

    expect(channelLeaveV1(log2.token, channel1.channelId)).toStrictEqual(
      {}
    );

    expect(channelDetailsV2(log1.token, channel1.channelId)).toStrictEqual(
      {
        isPublic: true,
        name: 'askldf',
        ownerMembers: [],
        allMembers: [
          {
            uId: user1.authUserId,
            email: 'abcd@gmail.com',
            nameFirst: 'sadkf',
            nameLast: 'asd',
            handleStr: 'sadkfasd',
          }
        ]
      }
    );
  });
});

describe('Test standup functions with HTTP', () => {
  beforeEach(() => {
    clearV1();
  });

  test('standup start error case: invalid length', () => {
    const user1 = authRegister('abcd@gmail.com', 'asdfasdf', 'sadkf', 'asd');
    const channel1 = channelsCreateV2(user1.token, 'askldf', true);
    expect(standupStartV1(user1.token, channel1.channelId, -99)).toStrictEqual(INPUT_ERROR);
  });

  test('standup start error case: invalid channelId', () => {
    const user1 = authRegister('abcd@gmail.com', 'asdfasdf', 'sadkf', 'asd');

    channelsCreateV2(user1.token, 'askldf', true);
    expect(standupStartV1(user1.token, -92, 1)).toStrictEqual(INPUT_ERROR);
  });

  test('standup start error case: invalid token', () => {
    const user1 = authRegister('abcd@gmail.com', 'asdfasdf', 'sadkf', 'asd');
    const channel1 = channelsCreateV2(user1.token, 'askldf', true);
    expect(standupStartV1('-9tfdsfu', channel1.channelId, 1)).toStrictEqual(AUTH_ERROR);
  });

  test('standup start error case: standup already in place', () => {
    const user1 = authRegister('abcd@gmail.com', 'asdfasdf', 'sadkf', 'asd');

    const channel1 = channelsCreateV2(user1.token, 'askldf', true);
    standupStartV1(user1.token, channel1.channelId, 10);
    expect(standupStartV1(user1.token, channel1.channelId, 1)).toStrictEqual(INPUT_ERROR);
  });

  test('standup case: normal standups', () => {
    const user1 = authRegister('abcd@gmail.com', 'asdfasdf', 'sadkf', 'asd');

    const channel1 = channelsCreateV2(user1.token, 'askldf', true);
    const timeFinish = Math.floor(Date.now() / 1500) + 2;
    expect(standupStartV1(user1.token, channel1.channelId, 2).timeFinish).toBeCloseTo(timeFinish, 2);
  });

  test('standup active error case: invalid channelId', () => {
    const user1 = authRegister('abcd@gmail.com', 'asdfasdf', 'sadkf', 'asd');

    channelsCreateV2(user1.token, 'askldf', true);
    expect(standupActiveV1(user1.token, -99)).toStrictEqual(INPUT_ERROR);
  });

  test('standup active error case: user not in', () => {
    const user1 = authRegister('abcd@gmail.com', 'asdfasdf', 'sadkf', 'asd');
    const user2 = authRegister('abcde@gmail.com', 'asdfasdf', 'sadkfe', 'asde');
    const channelse = channelsCreateV2(user1.token, 'askldfe', true);
    expect(standupActiveV1(user2.token, channelse.channelId)).toStrictEqual(AUTH_ERROR);
    expect(standupActiveV1(user1.token + 'fail', channelse.channelId)).toStrictEqual(AUTH_ERROR);
  });

  test('standup active case: no active standups', () => {
    const user1 = authRegister('abcd@gmail.com', 'asdfasdf', 'sadkf', 'asd');

    const channelse = channelsCreateV2(user1.token, 'askldfe', true);

    expect(standupActiveV1(user1.token, channelse.channelId)).toStrictEqual({
      isActive: false,
      timeFinish: null
    });
  });

  test('standup active case: active standups', async() => {
    const user1 = authRegister('abcd@gmail.com', 'asdfasdf', 'sadkf', 'asd');
    const channelse = channelsCreateV2(user1.token, 'askldfe', true);
    const timeFinish = standupStartV1(user1.token, channelse.channelId, 2);
    expect(standupActiveV1(user1.token, channelse.channelId)).toStrictEqual({
      isActive: true,
      timeFinish: timeFinish.timeFinish
    });
    await new Promise((r) => setTimeout(r, 1500));
  }, 6000);

  test('standup send error case: invalid token', async() => {
    const user1 = authRegister('abcd@gmail.com', 'asdfasdf', 'sadkf', 'asd');
    const channelse = channelsCreateV2(user1.token, 'askldfe', true);
    standupStartV1(user1.token, channelse.channelId, 1);
    expect(standupSendV1('-9tfdsfu', channelse.channelId, 'hi')).toStrictEqual(AUTH_ERROR);
    await new Promise((r) => setTimeout(r, 500));
  }, 6000);

  test('standup send error case: invalid channelId', async() => {
    const user1 = authRegister('abcd@gmail.com', 'asdfasdf', 'sadkf', 'asd');
    const channelse = channelsCreateV2(user1.token, 'askldfe', true);
    standupStartV1(user1.token, channelse.channelId, 0);
    expect(standupSendV1(user1.token, -99, 'hi')).toStrictEqual(INPUT_ERROR);
    await new Promise((r) => setTimeout(r, 500));
  }, 7000);

  test('standup send error case: super long message', async() => {
    const user1 = authRegister('abcd@gmail.com', 'asdfasdf', 'sadkf', 'asd');
    const channelse = channelsCreateV2(user1.token, 'askldfe', true);
    standupStartV1(user1.token, channelse.channelId, 0);
    expect(standupSendV1(user1.token, channelse.channelId, 'a'.repeat(1001))).toStrictEqual(INPUT_ERROR);
    await new Promise((r) => setTimeout(r, 500));
  });

  test('standup send error case: no active standup', () => {
    const user1 = authRegister('abcd@gmail.com', 'asdfasdf', 'sadkf', 'asd');
    const channelse = channelsCreateV2(user1.token, 'askldfe', true);

    expect(standupSendV1(user1.token, channelse.channelId, 'a'.repeat(10))).toStrictEqual(INPUT_ERROR);
  });

  test('standup send error case: user not in channel', async() => {
    const user1 = authRegister('abcd@gmail.com', 'asdfasdf', 'sadkf', 'asd');
    const channelse = channelsCreateV2(user1.token, 'askldfe', true);
    const user2 = authRegister('abcde@gmail.com', 'asdfasdfe', 'sadkfe', 'asde');

    expect(standupSendV1(user2.token, channelse.channelId, 'a'.repeat(10))).toStrictEqual(AUTH_ERROR);
    await new Promise((r) => setTimeout(r, 2000));
  }, 10000);

  test('standup send case: normal 1 msg', async() => {
    const user1 = authRegister('abcd@gmail.com', 'asdfasdf', 'sadkf', 'asd');
    const channelse = channelsCreateV2(user1.token, 'askldfe', true);
    const timeFinish = standupStartV1(user1.token, channelse.channelId, 2);
    expect(standupSendV1(user1.token, channelse.channelId, 'a'.repeat(10))).toStrictEqual({});
    await new Promise((r) => setTimeout(r, 2500));
    expect(channelMessageV2(user1.token, channelse.channelId, 0).messages[0].timeSent).toBeCloseTo(

      timeFinish.timeFinish, -2
    );
    await new Promise((r) => setTimeout(r, 1000));
  }, 10000);

  test('standup send case: normal 2 ppl msg', async() => {
    const user1 = authRegister('abcd@gmail.com', 'asdfasdf', 'sadkf', 'asd');
    const user2 = authRegister('abcde@gmail.com', 'asdfasdf', 'sadkfe', 'asde');
    const channelse = channelsCreateV2(user1.token, 'askldfe', true);
    channelJoinV2(user2.token, channelse.channelId);
    const timeFinish = standupStartV1(user1.token, channelse.channelId, 3);
    expect(standupSendV1(user1.token, channelse.channelId, 'a'.repeat(10))).toStrictEqual({});
    expect(standupSendV1(user2.token, channelse.channelId, 'b'.repeat(10))).toStrictEqual({});
    await new Promise((r) => setTimeout(r, 3000));
    expect(channelMessageV2(user1.token, channelse.channelId, 0)).toEqual(
      {
        start: 0,
        end: -1,
        messages: [{
          messageId: 0,
          uId: 1,
          timeSent: timeFinish.timeFinish,
          message: 'sadkfasd : aaaaaaaaaa\nsadkfeasde : bbbbbbbbbb\n',
          reacts: [],
          isPinned: false
        }]
      });
    await new Promise((r) => setTimeout(r, 1000));
  }, 10000);

  test('standup send case: normal 2 ppl msg more', async() => {
    jest.setTimeout(10000);
    const user1 = authRegister('abcd@gmail.com', 'asdfasdf', 'sadkf', 'asd');
    const user2 = authRegister('abcde@gmail.com', 'asdfasdf', 'sadkfe', 'asde');
    const channelse = channelsCreateV2(user1.token, 'askldfe', true);
    channelJoinV2(user2.token, channelse.channelId);
    const timeFinish = standupStartV1(user1.token, channelse.channelId, 2);
    expect(standupSendV1(user1.token, channelse.channelId, 'a'.repeat(10))).toStrictEqual({});
    expect(standupSendV1(user2.token, channelse.channelId, 'b'.repeat(10))).toStrictEqual({});
    expect(standupSendV1(user2.token, channelse.channelId, 'c'.repeat(2))).toStrictEqual({});
    expect(standupSendV1(user1.token, channelse.channelId, 'd'.repeat(2))).toStrictEqual({});
    await new Promise((r) => setTimeout(r, 3000));

    expect(channelMessageV2(user1.token, channelse.channelId, 0)).toEqual(
      {
        start: 0,
        end: -1,
        messages: [{
          messageId: 0,
          uId: 1,
          timeSent: timeFinish.timeFinish,
          message: 'sadkfasd : aaaaaaaaaa\nsadkfeasde : bbbbbbbbbb\nsadkfeasde : cc\nsadkfasd : dd\n',
          reacts: [],
          isPinned: false
        }]
      });
  }, 10000);
});

export { channelJoinV2 };
