import {
  authLogout, channelMessageV2, testchannel, testUser, clearV1, authRegister,
  channelsCreateV2, channelJoinV2, addOwnerV2, removeOwnerV2
} from './api';
// import config from './config.json';

const INPUT_ERROR = 400;
const PERMISSION_ERROR = 403;

// const port = config.port;
// const url = config.url;
// const SERVER_URL = `${url}:${port}`;

describe('testing channelMessage', () => {
  let user1: testUser;
  let user2: testUser;
  let channel: testchannel;
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
    channel = channelsCreateV2(user1.token, 'cat', true);
    expect(channel).toStrictEqual({ channelId: channel.channelId });
  });
  test('invalid user token', () => {
    authLogout(user1.token);
    expect(channelMessageV2(user1.token, channel.channelId, 0)).toStrictEqual(PERMISSION_ERROR);
  });
  test('invalid channel id', () => {
    clearV1();
    const u1 = authRegister('adalim@gmail.com', 'basic123', 'Ada', 'Lim');
    expect(u1).toStrictEqual({
      authUserId: user1.authUserId,
      token: user1.token,
    });
    expect(channelMessageV2(u1.token, 0, 0)).toStrictEqual(INPUT_ERROR);
  });
  test('userId not apart of channel', () => {
    expect(channelMessageV2(user2.token, channel.channelId, 0)).toStrictEqual(PERMISSION_ERROR);
  });
  test('start is greater than end', () => {
    expect(channelMessageV2(user1.token, channel.channelId, 2)).toStrictEqual(INPUT_ERROR);
  });
  test('channel with 0 messages', () => {
    expect(channelMessageV2(user1.token, channel.channelId, 0)).toStrictEqual({
      messages: [],
      start: 0,
      end: -1,
    });
  });
});

describe('HTTP addOwner & Remove Owner tests using Jest', () => {
  beforeEach(() => {
    clearV1();
  });
  test('Failed to make User channel Owner ', () => {
    const firstUser = authRegister('adalim@gmail.com', 'basic123', 'Ada', 'Lim');
    const secondUser = authRegister('Benfake@gmail.com', 'password123', 'Ben', 'Fake');
    const thirdUser = authRegister('catlee@gmail.com', 'password123', 'Cat', 'Lee');
    const channelOne = channelsCreateV2(firstUser.token, 'Ben Channel', true);
    channelJoinV2(secondUser.token, channelOne.channelId);
    expect(addOwnerV2(firstUser.token + 'hi', channelOne.channelId, secondUser.authUserId)).toStrictEqual(PERMISSION_ERROR);
    expect(addOwnerV2(firstUser.token, channelOne.channelId + 1, secondUser.authUserId)).toStrictEqual(INPUT_ERROR);
    expect(addOwnerV2(firstUser.token, channelOne.channelId, secondUser.authUserId + 4)).toStrictEqual(INPUT_ERROR);
    expect(addOwnerV2(firstUser.token, channelOne.channelId, thirdUser.authUserId)).toStrictEqual(INPUT_ERROR);
    expect(addOwnerV2(secondUser.token, channelOne.channelId, secondUser.authUserId)).toStrictEqual(PERMISSION_ERROR);
    addOwnerV2(firstUser.token, channelOne.channelId, secondUser.authUserId);
    expect(addOwnerV2(firstUser.token, channelOne.channelId, firstUser.authUserId)).toStrictEqual(INPUT_ERROR);
    expect(addOwnerV2(firstUser.token, channelOne.channelId, secondUser.authUserId)).toStrictEqual(INPUT_ERROR);
  });
  test('Successfully made User channel Owner ', () => {
    const firstUser = authRegister('adalim@gmail.com', 'basic123', 'Ada', 'Lim');
    const secondUser = authRegister('Benfake@gmail.com', 'password123', 'Ben', 'Fake');
    const thirdUser = authRegister('catlee@gmail.com', 'password12345', 'Cat', 'Lee');
    const channelOne = channelsCreateV2(firstUser.token, 'Ben Channel', true);
    const channelTwo = channelsCreateV2(secondUser.token, 'John Channel', true);
    expect(channelJoinV2(secondUser.token, channelOne.channelId)).toStrictEqual({});
    expect(channelJoinV2(thirdUser.token, channelOne.channelId)).toStrictEqual({});
    expect(channelJoinV2(firstUser.token, channelTwo.channelId)).toStrictEqual({});
    expect(channelJoinV2(thirdUser.token, channelTwo.channelId)).toStrictEqual({});
    expect(addOwnerV2(firstUser.token, channelOne.channelId, secondUser.authUserId)).toStrictEqual({});
    expect(addOwnerV2(firstUser.token, channelOne.channelId, thirdUser.authUserId)).toStrictEqual({});
    expect(addOwnerV2(secondUser.token, channelTwo.channelId, firstUser.authUserId)).toStrictEqual({});
    expect(addOwnerV2(secondUser.token, channelTwo.channelId, thirdUser.authUserId)).toStrictEqual({});
  });
  test('Failed to remove channel Owner ', () => {
    const firstUser = authRegister('adalim@gmail.com', 'basic123', 'Ada', 'Lim');
    const secondUser = authRegister('Benfake@gmail.com', 'password123', 'Ben', 'Fake');
    const thirdUser = authRegister('catlee@gmail.com', 'password123', 'Cat', 'Lee');
    const channelOne = channelsCreateV2(firstUser.token, 'Ben Channel', true);
    const channelTwo = channelsCreateV2(secondUser.token, 'John Channel', true);
    channelJoinV2(secondUser.token, channelOne.channelId);
    channelJoinV2(thirdUser.token, channelOne.channelId);
    addOwnerV2(firstUser.token, channelOne.channelId, secondUser.authUserId);
    // all 1st and 2nd users are owners of channel one at this point.
    expect(removeOwnerV2(firstUser.token + 'hi', channelOne.channelId, secondUser.token)).toStrictEqual(PERMISSION_ERROR); // token is invalid
    expect(removeOwnerV2(firstUser.token, channelOne.channelId + 3, secondUser.token)).toStrictEqual(INPUT_ERROR); // channelId does not refer to a valid channel
    expect(removeOwnerV2(firstUser.token, channelOne.channelId, secondUser.authUserId + 3)).toStrictEqual(INPUT_ERROR); // uId does not refer to a valid user
    expect(removeOwnerV2(firstUser.token, channelOne.channelId, thirdUser.authUserId)).toStrictEqual(INPUT_ERROR); // uId refers to a user who is not an owner of the channel
    expect(removeOwnerV2(secondUser.token, channelTwo.channelId, secondUser.authUserId)).toStrictEqual(INPUT_ERROR); // uId refers to a user who is currently the only owner of the channel
    expect(removeOwnerV2(thirdUser.token, channelOne.channelId, secondUser.authUserId)).toStrictEqual(PERMISSION_ERROR); // channelId is valid and the authorised user does not have owner permissions in the channel
  });
  test('Successfully removed channel Owner ', () => {
    const firstUser = authRegister('adalim@gmail.com', 'basic123', 'Ada', 'Lim');
    const secondUser = authRegister('Benfake@gmail.com', 'password123', 'Ben', 'Fake');
    const thirdUser = authRegister('catlee@gmail.com', 'password123', 'Cat', 'Lee');
    const channelOne = channelsCreateV2(firstUser.token, '1st Channel', true);
    channelsCreateV2(firstUser.token, '2nd Channel', true);
    channelJoinV2(secondUser.token, channelOne.channelId);
    channelJoinV2(thirdUser.token, channelOne.channelId);
    expect(addOwnerV2(firstUser.token, channelOne.channelId, secondUser.authUserId)).toStrictEqual({});
    expect(addOwnerV2(firstUser.token, channelOne.channelId, thirdUser.authUserId)).toStrictEqual({});
    expect(removeOwnerV2(firstUser.token, channelOne.channelId, firstUser.authUserId)).toStrictEqual({});
    expect(removeOwnerV2(thirdUser.token, channelOne.channelId, secondUser.authUserId)).toStrictEqual({});
  });
});
