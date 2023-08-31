import { authRegister, authLogout, authLogin, clearV1, passwordResetV1, resetCodePasswordV1, forceSetResetCode } from './api';

const INPUT_ERROR = 400;

describe('HTTP authtests using Jest', () => {
  beforeEach(() => {
    clearV1();
  });

  test('Failed auth register', () => {
    authRegister('adalim@gmail.com', 'basic123', 'Ada1234567890%abcdefghi', 'Lim');
    authRegister('adalim1@gmail.com', 'basic123', 'Ada123#4567890abcdefghi', 'Lim'); // To test final number added to string
    authRegister('adalim2@gmail.com', 'basic123', 'Ada1234567:890abcdefghi', 'Lim'); // To test final number added to string
    expect(authRegister('Benfake', 'password123', 'Ben', 'Fake')).toStrictEqual(INPUT_ERROR); // invalid email
    expect(authRegister('adalim@gmail.com', 'password123', 'Ben', 'Fake')).toStrictEqual(INPUT_ERROR); // existing email in database
    expect(authRegister('Benfake@gmail.com', 'notgd', 'Ben', 'Fake')).toStrictEqual(INPUT_ERROR); // password less than 6 characters
    expect(authRegister('Benfake@gmail.com', 'password123', '', 'Fake')).toStrictEqual(INPUT_ERROR); // first namet less than 1 character
    expect(authRegister('Benfake@gmail.com', 'password123', 'Ben', '')).toStrictEqual(INPUT_ERROR); // last name less than 1 character
    expect(authRegister('Benfake@gmail.com', 'password123', 'Ben1234567890123456789012345678901234567890123456789012345678901234567890abcdefghijklmnop', 'Fake')).toStrictEqual(INPUT_ERROR); // first name more than 50 characters
    expect(authRegister('Benfake@gmail.com', 'password123', 'Ben', 'Fake1234567890123456789012345678901234567890123456789012345678901234567890abcdefghijklmnop')).toStrictEqual(INPUT_ERROR); // last name more than 50 characters
  });

  test('Successful auth register', () => {
    expect(authRegister('Benfake@gmail.com', 'password123', 'Ben', 'Fake')).toStrictEqual({
      token: expect.any(String),
      authUserId: expect.any(Number),
    });
    expect(authRegister('adalim@gmail.com', 'basic123', 'Ada', 'Lim')).toStrictEqual({
      token: expect.any(String),
      authUserId: expect.any(Number),
    });
  });

  test('Failed auth login', () => {
    authRegister('adalim@gmail.com', 'basic123', 'Ada', 'Lim');
    expect(authLogin('Benfake@gmail.com', 'basic123')).toStrictEqual(INPUT_ERROR); // email entered does not belong to a user
    expect(authLogin('adalim', 'basic123')).toStrictEqual(INPUT_ERROR); // email entered does not belong to a user
    expect(authLogin('adalim@gmail.com', 'wrongpassword123')).toStrictEqual(INPUT_ERROR); // Password incorrect.
  });

  test('Successful auth login', () => {
    const firstUser = authRegister('adalim@gmail.com', 'basic123', 'Ada', 'Lim');
    const secondUser = authRegister('Benfake@gmail.com', 'password123', 'Ben', 'Fake');
    expect(authLogin('adalim@gmail.com', 'basic123')).toStrictEqual({
      token: expect.any(String),
      authUserId: firstUser.authUserId,
    });
    expect(authLogin('Benfake@gmail.com', 'password123')).toStrictEqual({
      token: expect.any(String),
      authUserId: secondUser.authUserId,
    });
  });

  test('Failed logout', () => {
    authRegister('adalim@gmail.com', 'basic123', 'Ada', 'Lim');
    const firstUserLogin = authLogin('adalim@gmail.com', 'basic123');
    expect(authLogout(firstUserLogin.token + 'fail')).toStrictEqual(INPUT_ERROR);
  });

  test('Successful logout', () => {
    authRegister('adalim@gmail.com', 'basic123', 'Ada', 'Lim');
    authRegister('Benfake@gmail.com', 'password123', 'Ben', 'Fake');
    const firstUserLogin = authLogin('adalim@gmail.com', 'basic123');
    const secondUserLogin = authLogin('Benfake@gmail.com', 'password123');
    const thirdUserLogin = authLogin('adalim@gmail.com', 'basic123');
    const fourthUserLogin = authLogin('Benfake@gmail.com', 'password123');
    const fifthUserLogin = authLogin('adalim@gmail.com', 'basic123');
    expect(authLogout(firstUserLogin.token)).toStrictEqual({});
    expect(authLogout(secondUserLogin.token)).toStrictEqual({});
    expect(authLogout(thirdUserLogin.token)).toStrictEqual({});
    expect(authLogout(fourthUserLogin.token)).toStrictEqual({});
    expect(authLogout(fifthUserLogin.token)).toStrictEqual({});
  });
});

describe('HTTP authtests using Jest iter 3 new requests', () => {
  beforeEach(() => {
    clearV1();
  });

  test('Auth Password reset request', () => {
    authRegister('receivercomp1531@gmail.com', 'basic123', 'Ada1234567890%abcdefghi', 'Lim');
    expect(passwordResetV1('receivercomp1531@gmail.com')).toStrictEqual({});
    expect(passwordResetV1('nobodyhere@gmail.com')).toStrictEqual({});
  });

  test('Failed authpassword reset code', () => {
    authRegister('adalim@gmail.com', 'basic123', 'Ada', 'Lim');
    expect(passwordResetV1('adalim@gmail.com')).toStrictEqual({});
    expect(resetCodePasswordV1('abcde12345', 'abcde')).toStrictEqual(INPUT_ERROR);
    expect(resetCodePasswordV1('abcde12345', 'ABCDEFG12345')).toStrictEqual(INPUT_ERROR);
  });

  // White-box testing
  test('Successful authpassword reset code', () => {
    const firstUser = authRegister('adalim@gmail.com', 'basic123', 'Ada', 'Lim');
    authRegister('Benfake@gmail.com', 'password123', 'Ben', 'Fake');
    const firstLogin = authLogin('adalim@gmail.com', 'basic123');
    authLogin('Benfake@gmail.com', 'password123');
    passwordResetV1('adalim@gmail.com');
    expect(authLogout(firstUser.token)).toStrictEqual(INPUT_ERROR);
    expect(authLogout(firstLogin.token)).toStrictEqual(INPUT_ERROR);
    expect(forceSetResetCode(firstUser.authUserId)).toStrictEqual('abcdefg');
    expect(resetCodePasswordV1('abcdefg', 'abcde12345')).toStrictEqual({});
  });
});
