import { user, dataStore, getData } from './dataStore';
import { checkValidEmail, checkValidToken, identifyTargetUserbyToken, identifyTargetUserbyAuthUserId, encryption, hashOfEncrypt } from './other';
import { initialiseData, savetoFile } from './server';
import HTTPError from 'http-errors';
const randomstring = require('randomstring');
const nodemailer = require('nodemailer');

// Generate a unique token for each user register or login.
function generateTokenV2(data: dataStore) {
  let tokenNumber = 1;
  let tokenStr = '1';
  for (let count = 0; count < Object.entries(data.loginUsers).length; count++) {
    if (tokenStr === data.loginUsers[count].token) {
      tokenNumber += 1;
      tokenStr = tokenNumber.toString();
      count = 0;
    }
  }
  return tokenStr;
}

/** authLoginV1 check if entered email and password
 * match a user stored in the system, and return their id
 * if successful.
 * @param {string} email - string to contain an email address
 * @param {string} password - string to contain a password
 * @return {{integer}} authUserId - Returns upon successful login
 * @return {{String}} Token - Returns upon successful login
 * @return {{Object}} error - Returns upon failed user login
 */
export function authLoginV1(email: string, password: string) {
  const data: dataStore = initialiseData();
  // console.log(data);
  let validUserFlag = false;

  let targetUser: user = {
    userId: 0,
    nameFirst: 'string',
    nameLast: 'string',
    email: 'string',
    password: 'string',
    handle: 'string',
    member_of_ch: [],
    admin_of_ch: [],
    global_permission: 0,
    token: 'string'
  };

  for (const user of data.users) {
    if (user.email === email) {
      validUserFlag = true;
      targetUser = JSON.parse(JSON.stringify(user));
    }
  }

  if (validUserFlag === false) {
    throw HTTPError(400, 'email entered does not belong to a user');
  }

  const encryptedPassword = encryption(password);
  if (targetUser.password !== encryptedPassword) {
    throw HTTPError(400, 'password is not correct');
  }

  const newToken = generateTokenV2(data);
  const hashToken = hashOfEncrypt(newToken);

  const newLoginUser: user = {
    userId: targetUser.userId,
    token: newToken
  };
  data.loginUsers.push(newLoginUser);
  // console.log(data.loginUsers);
  // console.log(data.users);
  savetoFile(data);
  return {
    token: hashToken,
    authUserId: targetUser.userId,
  };
}

/** authRegisterV1 will create a new user in the system
 * with a unique handle that is their first and last name
 * cast to lowercase with only alphanumerics
 * and concatenated together. handles longer than 20 will
 * be cut off at the 20th symbol.If a handle already exists,
 * a number is appended that increments from 0.
 * The 20 character limit is only exceeded if appending numbers
 *
 * @param {string} email - string to contain an email address
 * @param {string} password - string to contain a password
 * @param {string} nameFirst - string to contain user first name
 * @param {string} nameLast - string to contain user last name
 * @return {{integer}} authUserId - Returns upon successful user registered
 * @return {{String}} Token - Returns upon successful user registered
 * @return {{Object}} error - Returns upon failed user registration
 */
// function to allow user registrations
export function authRegisterV1(email: string, password: string, nameFirst: string, nameLast: string) {
  const validEmailFlag = checkValidEmail(email);
  // check if email is valid email format
  if (validEmailFlag === false) {
    throw HTTPError(400, 'email entered is not a valid email');
  }

  // check if password meets min 6 characters requirement
  if (password.length < 6) {
    throw HTTPError(400, 'length of password is less than 6 characters');
  }

  // check if first name in range 1 to 50
  if (nameFirst.length < 1 || nameFirst.length > 50) {
    throw HTTPError(400, 'length of nameFirst is not between 1 and 50 characters inclusive');
  }

  // check if last name in range 1 to 50
  if (nameLast.length < 1 || nameLast.length > 50) {
    throw HTTPError(400, 'length of nameLast is not between 1 and 50 characters inclusive');
  }

  // retreive data from dataStore
  // const data: dataStore = initialiseData();
  const data: dataStore = getData();

  // if data.user array is not created yet, create it.
  if (data.globalOwnerCount === undefined) {
    data.globalOwnerCount = 0;
  }

  // loop through existing list of users to determine if email is repeated
  for (const user of data.users) {
    if (user.email === email) {
      throw HTTPError(400, 'email address is already being used by another user');
    }
  }

  // From this point, user has been successfully registered
  let idGenerated = 1;
  idGenerated += Object.entries(data.users).length;

  let userHandleStr = nameFirst + nameLast;
  userHandleStr = userHandleStr.toLowerCase();
  let tempHandleStr = '';
  // console.log(`before`, userHandleStr);

  // Remove non-alphanumeric characters
  for (let index = 0; index < userHandleStr.length; index++) {
    if ((userHandleStr[index] >= 'a' && userHandleStr[index] <= 'z') || (userHandleStr[index] >= '0' && userHandleStr[index] <= '9')) {
      tempHandleStr += userHandleStr[index];
    }
  }
  userHandleStr = tempHandleStr;
  const maxSize = 20;

  // limit handle len to max 20 characters.
  userHandleStr = userHandleStr.substring(0, maxSize);

  const numOfUsers = Object.entries(data.users).length;
  let finalNumber = 0;
  for (let i = 0; i < numOfUsers; i++) {
    const currUser = data.users[i];
    // check for duplicate and add final number to the end.
    if (currUser.handle === userHandleStr) {
      userHandleStr = userHandleStr.substring(0, maxSize);
      userHandleStr = userHandleStr + finalNumber;
      finalNumber += 1;
      i = 0;
    }
  }

  // console.log(`after`, userHandleStr);
  let userPermission = 2;
  if (idGenerated === 1) {
    userPermission = 1;
    data.globalOwnerCount += 1;
  }

  const newToken = generateTokenV2(data);
  const hashToken = hashOfEncrypt(newToken);
  const encryptedPassword = encryption(password);

  const newUserDatabase: user = {
    userId: idGenerated,
    nameFirst: nameFirst,
    nameLast: nameLast,
    email: email,
    password: encryptedPassword,
    handle: userHandleStr,
    member_of_ch: [],
    admin_of_ch: [],
    global_permission: userPermission
  };

  const newUserLogin: user = {
    userId: idGenerated,
    token: newToken
  };

  const workspace = {
    channelsExists: [{ numChannelsExists: 0, timeStamp: Math.floor((new Date()).getTime() / 1000) }],
    dmsExists: [{ numDmsExists: 0, timeStamp: Math.floor((new Date()).getTime() / 1000) }],
    messagesExists: [{ numMessagesExists: 0, timeStamp: Math.floor((new Date()).getTime() / 1000) }],
    UtilizationRate: 0,
  };

  if (data.workspaceStats.length === 0) {
    data.workspaceStats.push(workspace);
  }

  data.users.push(JSON.parse(JSON.stringify(newUserDatabase)));
  data.loginUsers.push(JSON.parse(JSON.stringify(newUserLogin)));
  // console.log(newUserDatabase);
  savetoFile(data);

  return {
    token: hashToken,
    authUserId: idGenerated,
  };
}

/**
 * Function to logout a user session
 * @param {string} token login user Token
 * @returns {} or throws error upon unsuccessful logout
 */
export function authlogoutV1(token: string) {
  const data: dataStore = initialiseData();
  // check for valid token
  if (checkValidToken(data.loginUsers, token) === false) {
    throw HTTPError(400, 'email entered is not a valid email');
  }

  const targetUser: user = identifyTargetUserbyToken(data.loginUsers, token);
  let count = 0;
  for (const user of data.loginUsers) {
    // remove the target user from loginUsers array.
    if (user.token === targetUser.token) {
      data.loginUsers.splice(count, 1);
    }
    count += 1;
  }
  savetoFile(data);
  return {};
}

/**
 * Send out a reset password request via email.
 * All current sessions of the user is terminated (Logout)
 * @param {string} email user email
 * @returns {} no error thrown to avoid security issue
 */
export function resetPasswordRequest (email: string) {
  const data: dataStore = initialiseData();
  let validUserFlag = false;
  let targetUser: user = {
    userId: 0,
    nameFirst: 'string',
    nameLast: 'string',
    email: 'string',
    password: 'string',
    handle: 'string',
    member_of_ch: [],
    admin_of_ch: [],
    global_permission: 0,
    token: 'string'
  };

  for (const user of data.users) {
    if (user.email === email) {
      validUserFlag = true;
      targetUser = JSON.parse(JSON.stringify(user));
    }
  }

  if (validUserFlag === true) {
    targetUser.resetCode = randomstring.generate(16);
    // console.log(targetUser.resetCode);
    sendEmailtoUser(targetUser).catch(console.error);

    // log user out of all sessions
    for (let index = 0; index < data.loginUsers.length; index++) {
      if (data.loginUsers[index].userId === targetUser.userId) {
        data.loginUsers.splice(index, 1);
        index -= 1;
      }
    }
  }
  savetoFile(data);
  return {};
}

/**
 * Function to send resetCode to user via email
 * @param {user} targetUser a target registered user
 */
async function sendEmailtoUser(targetUser: user) {
  // Generate test SMTP service account from ethereal.email
  const testAccount = await nodemailer.createTestAccount();
  const emailText = `Your password reset code is: ${targetUser.resetCode}`;

  // create reusable transporter object using the default SMTP transport
  const transporter = nodemailer.createTransport({
    host: 'smtp.ethereal.email',
    port: 587,
    secure: false, // true for 465, false for other ports
    auth: {
      user: testAccount.user, // generated ethereal user
      pass: testAccount.pass, // generated ethereal password
    },
  });

  // send mail with defined transport object
  const info = await transporter.sendMail({
    from: '"helloandhi.alwaysdata.net/wed09BAERO-beans" <sendercomp1531@gmail.com>', // sender address (may give error)
    to: targetUser.email, // list of receivers
    subject: 'COMP1531 Password reset Code', // Subject line
    text: emailText, // plain text body
  });

  console.log('Message sent: %s', info.messageId);
  // Message sent: <b658f8ca-6296-ccf4-8306-87d57a0b4321@example.com>

  // Preview only available when sending through an Ethereal account
  console.log('Preview URL: %s', nodemailer.getTestMessageUrl(info));
  // Preview URL: https://ethereal.email/message/WaQKMgKddxQDoou...
}

/**
 * Function for whitebox testing of authPasswordReset
 * @param {number} uid A User's userId
 * @returns {string} targetuser reset code. always be "abcdefg"
 */
export function setResetCode(uid: number) {
  const data: dataStore = initialiseData();
  const targetUser: user = identifyTargetUserbyAuthUserId(data.users, uid);
  targetUser.resetCode = 'abcdefg';
  savetoFile(data);
  return targetUser.resetCode;
}

/**
 * Reset an auth Password & invalidate resetCode upon successful password reset.
 * @param {string} resetCode A reset code that was generated and sent to the user's email address
 * @param {string} newPassword A string that replaces the existing password.
 * @returns {} or throw an error for unsuccessful password reset.
 */
export function authPasswordReset(resetCode: string, newPassword: string) {
  const data = initialiseData();
  if (newPassword.length < 6) {
    throw HTTPError(400, 'New Password must be at least 6 characters long');
  }

  let validCodeFlag = false;
  let targetUser: user = {
    userId: 0,
    nameFirst: 'string',
    nameLast: 'string',
    email: 'string',
    password: 'string',
    handle: 'string',
    global_permission: 0,
    token: 'string',
    resetCode: ''
  };

  for (const user of data.users) {
    if (user.resetCode === resetCode) {
      validCodeFlag = true;
      targetUser = user;
    }
  }

  if (validCodeFlag === false) {
    throw HTTPError(400, 'ResetCode is not valid.');
  }

  targetUser.password = encryption(newPassword);
  targetUser.resetCode = '';
  savetoFile(data);
  return {};
}
