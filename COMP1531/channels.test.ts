import {
  channelsCreateV2, channelsListV2, channelsListAllV2, authRegister, authLogin, clearV1
} from './api';

const INPUT_ERROR = 400;
const INPUT_ERROR_TOKEN = 403;

describe('HTTP Testing with jest', () => {
  beforeEach(() => {
    clearV1();
  });
  test('Error cases Create', () => {
    authRegister('johnwick@gmail.com', 'John123', 'John', 'Wick');
    expect(channelsCreateV2('', 'Channel1', true)).toStrictEqual(INPUT_ERROR_TOKEN);
    expect(channelsCreateV2('user1.token', '', true)).toStrictEqual(INPUT_ERROR);
    expect(channelsCreateV2('user1.token', 'abcdefghijklmnopqrstz', true)).toStrictEqual(INPUT_ERROR);
  });

  test('Success cases Create', () => {
    authRegister('Benfake@gmail.com', 'password123', 'Ben', 'Fake');
    const firstLogin = authLogin('Benfake@gmail.com', 'password123');
    const channel1 = channelsCreateV2(firstLogin.token, 'John Channel', true);
    const channel2 = channelsCreateV2(firstLogin.token, 'Jame Channel', false);
    expect(channel1).toStrictEqual({ channelId: channel1.channelId });
    expect(channel2).toStrictEqual({ channelId: channel2.channelId });
  });

  test('Error cases List', () => {
    authRegister('Benfake@gmail.com', 'password123', 'Ben', 'Fake');
    expect(channelsListV2('gazza')).toStrictEqual(INPUT_ERROR_TOKEN);
    expect(channelsListV2('trazza')).toStrictEqual(INPUT_ERROR_TOKEN);
  });

  test('Success cases List', () => {
    authRegister('Benfake@gmail.com', 'password123', 'Ben', 'Fake');
    authRegister('Jonhwick@gmail.com', 'password321', 'John', 'Wick');
    const firstLogin = authLogin('Benfake@gmail.com', 'password123');
    const secondLogin = authLogin('Jonhwick@gmail.com', 'password321');
    const channelOne = channelsCreateV2(firstLogin.token, 'Ben Channel', true);
    const channelTwo = channelsCreateV2(secondLogin.token, 'John Channel', true);
    expect(channelsListV2(firstLogin.token)).toStrictEqual({
      channels: [
        { channelId: channelOne.channelId, name: 'Ben Channel' }
      ]
    });
    expect(channelsListV2(secondLogin.token)).toStrictEqual({
      channels: [
        { channelId: channelTwo.channelId, name: 'John Channel' }
      ]
    });
  });

  test('Error cases ListAll', () => {
    const user1 = authRegister('Benfake@gmail.com', 'password123', 'Ben', 'Fake');
    authRegister('Jonhwick@gmail.com', 'password321', 'John', 'Wick');
    authLogin('Benfake@gmail.com', 'password123');
    authLogin('Jonhwick@gmail.com', 'password321');
    channelsCreateV2(user1.token, 'Ben Channel', true);
    expect(channelsListAllV2('nabba')).toStrictEqual(INPUT_ERROR_TOKEN);
    expect(channelsListAllV2('gabba')).toStrictEqual(INPUT_ERROR_TOKEN);
  });

  test('Success cases ListAll', () => {
    const user1 = authRegister('johnwick@gmail.com', 'John123', 'John', 'Wick');
    const channelOne = channelsCreateV2(user1.token, 'John Channel', true);
    const channelTwo = channelsCreateV2(user1.token, 'Jake Channel', false);
    const channelThree = channelsCreateV2(user1.token, 'Jason Channel', true);
    expect(channelsListAllV2(user1.token)).toStrictEqual({
      channels: [
        { channelId: channelOne.channelId, name: 'John Channel' },
        { channelId: channelTwo.channelId, name: 'Jake Channel' },
        { channelId: channelThree.channelId, name: 'Jason Channel' }
      ]
    });
  });
});
