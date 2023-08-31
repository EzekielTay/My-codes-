// // Test files for auth
// import { clearV1 } from './other';
// import { authLoginV1, authRegisterV1 } from './auth';

// describe('Test auth functions', () => {
//   beforeEach(() => {
//     clearV1();
//   });

//   test('failed user registration', () => {
//     authRegisterV1('adalim@gmail.com', 'basic123', 'Ada1234567890abcdefghi', 'Lim');
//     authRegisterV1('adalim1@gmail.com', 'basic123', 'Ada1234567890abcdefghi', 'Lim'); // To test final number added to string
//     authRegisterV1('adalim2@gmail.com', 'basic123', 'Ada1234567890abcdefghi', 'Lim'); // To test final number added to string
//     expect(authRegisterV1('Benfake', 'password123', 'Ben', 'Fake')).toStrictEqual({ error: expect.any(String) }); // invalid email
//     expect(authRegisterV1('adalim@gmail.com', 'password123', 'Ben', 'Fake')).toStrictEqual({ error: expect.any(String) }); // existing email in database
//     expect(authRegisterV1('Benfake@gmail.com', 'notgd', 'Ben', 'Fake')).toStrictEqual({ error: expect.any(String) }); // password less than 6 characters
//     expect(authRegisterV1('Benfake@gmail.com', 'password123', '', 'Fake')).toStrictEqual({ error: expect.any(String) }); // first namet less than 1 character
//     expect(authRegisterV1('Benfake@gmail.com', 'password123', 'Ben', '')).toStrictEqual({ error: expect.any(String) }); // last name less than 1 character
//     expect(authRegisterV1('Benfake@gmail.com', 'password123', 'Ben1234567890123456789012345678901234567890123456789012345678901234567890abcdefghijklmnop', 'Fake')).toStrictEqual({ error: expect.any(String) }); // first name more than 50 characters
//     expect(authRegisterV1('Benfake@gmail.com', 'password123', 'Ben', 'Fake1234567890123456789012345678901234567890123456789012345678901234567890abcdefghijklmnop')).toStrictEqual({ error: expect.any(String) }); // last name more than 50 characters
//   });

//   test('successful user registration', () => {
//     expect(authRegisterV1('Benfake@gmail.com', 'password123', 'Ben', 'Fake')).toStrictEqual({
//       token: expect.any(String),
//       authUserId: expect.any(Number)
//     });
//     expect(authRegisterV1('adalim@gmail.com', 'basic123', 'Ada', 'Lim')).toStrictEqual({
//       token: expect.any(String),
//       authUserId: expect.any(Number)
//     });
//   });

//   test('failed user login', () => {
//     authRegisterV1('adalim@gmail.com', 'basic123', 'Ada', 'Lim');
//     expect(authLoginV1('Benfake@gmail.com', 'basic123')).toStrictEqual({ error: expect.any(String) }); // email entered does not belong to a user
//     expect(authLoginV1('adalim', 'basic123')).toStrictEqual({ error: expect.any(String) }); // email entered does not belong to a user
//     expect(authLoginV1('adalim@gmail.com', 'wrongpassword123')).toStrictEqual({ error: expect.any(String) }); // Password incorrect.
//   });

//   test('successful; user login', () => {
//     const firstUser = authRegisterV1('adalim@gmail.com', 'basic123', 'Ada', 'Lim');
//     const secondUser = authRegisterV1('Benfake@gmail.com', 'password123', 'Ben', 'Fake');
//     expect(authLoginV1('adalim@gmail.com', 'basic123')).toStrictEqual({
//       token: expect.any(String),
//       authUserId: firstUser.authUserId
//     });
//     expect(authLoginV1('Benfake@gmail.com', 'password123')).toStrictEqual({
//       token: expect.any(String),
//       authUserId: secondUser.authUserId
//     });
//   });
// });
