import { getData, user, dataStore, channel, dm, message, react } from './dataStore';

import validator from 'validator';

import { initialiseData, savetoFile } from './server';

const secret = 'secret';

type error = {error: string};

type channelMessages = {
    messages: message[],
    start: number,
    end: number,
}

/**
 *
 * @returns {dataStore} data
 */
function clearV1 () {
  let data: dataStore = initialiseData();
  data = {
    users: [],
    channels: [],
    loginUsers: [],
    dms: [],
    messageBuffer: [],
    workspaceStats: [],
  };

  savetoFile(data);
  return data;
}

function removeMessageBuffer(data: dataStore, msg: message) {
  data.messageBuffer.splice(data.messageBuffer.indexOf(msg), 1);
}

function setMessageBuffer(data: dataStore, msg: message) {
  if (!data.messageBuffer) { data.messageBuffer = []; }
  data.messageBuffer.push(msg);
  savetoFile(data);
}

function getMessageBuffer(msg: message, obj: {channelId?: number, dmId?: number}) {
  const data = initialiseData();
  if (!data.messageBuffer) { data.messageBuffer = []; }
  if (getElementByProperty(data.messageBuffer, 'messageId', msg.messageId)) {
    removeMessageBuffer(data, msg);
    if (obj.dmId) { getElementByProperty(data.dms, 'dmId', obj.dmId).messages.push(msg); } else if (obj.channelId) { getElementByProperty(data.channels, 'channelId', obj.channelId).messages.push(msg); } else { console.log(`something went wrong with ${obj.dmId} and ${obj.channelId}`); }
  }
  savetoFile(data);
}

/** sets isThisUserReacted array and returns the array
 *
 * @param reacts - array of reacts
 * @param uId - uId of user using the function
 * @returns react[]
 */

function setUserReacted(reacts: react[], uId: number) {
  for (const react of reacts) {
    if (react.uIds.includes(uId)) {
      react.isThisUserReacted = true;
    }
  }
  return reacts;
}

/** returns user object given a userId
 *
 * @param uId - the Id representing a user
 * @returns {user} - returns a user object
 */
function getUserById(uId: number): user {
  return getElementByProperty(initialiseData().users as user[], 'userId', uId);
}

/** returns channel object given a channelId
 *
 * @param cId - the Id representing a channel
 * @returns {channel} - returns a channel object or
 */

function getChannelById(cId: number): channel {
  return getElementByProperty(initialiseData().channels as channel[], 'channelId', cId);
}

/** returns object of given array or undefined if not found
 *
 * @param array - array containing objects with properties
 * @param property -property to check
 * @param value -value to be match
 * @returns {any} - returns object if property matches value
 * @returns {undefined} - when element of array is not found
 */

function getElementByProperty(array: any[], property: string, value: any) {
  return array.find(element => element[property] === value);
}

/** returns a user object given a token
 *
 * @param token - user token session
 * @returns {user} - returns a user object
 */

function getUserByToken(token: string) {
  return getUserById(identifyTargetUserbyToken(getData().loginUsers as user[], token).userId);
}

/** returns a Dm object given a dmId

 *

 * @param dmId - the Id representing a dm

 * @returns {dm} - returns a dm object

 */

function getDmById(dmId: number): dm {
  return getElementByProperty(getData().dms as dm[], 'dmId', dmId);
}

/** function that checks if a userId is valid

 *

 * @param {dataStore} data

 * @param {number} authUserId

 * @returns {boolean} validUserFlag

 */

function checkValidUserId(data: dataStore, authUserId: number): boolean {
  let validUserFlag = false;

  for (const user of data.users) {
    if (user.userId === authUserId) {
      validUserFlag = true;
    }
  }

  return validUserFlag;
}

/** function that checks if a ChannelId is valid

 *

 * @param {datastore} data

 * @param {number} channelId

 * @returns {boolean} validChannelFlag

 */

function checkValidChannelId(data: dataStore, channelId: number): boolean {
  let validChannelFlag = false;

  for (const channel of data.channels) {
    if (channel.channelId === channelId) {
      validChannelFlag = true;
    }
  }

  return validChannelFlag;
}

/** function that checks if an email is a valid email format

 *

 * @param {string} email

 * @returns {boolean} validEmailFlag

 */

function checkValidEmail(email: string): boolean {
  const validEmailFlag = validator.isEmail(email);

  // check if email is valid email format

  return validEmailFlag;
}

/** function that checks if a User token is valid

 *

 * @param {user[]} array

 * @param {string} token

 * @returns {boolean} validTokenFlag

 */

function checkValidToken(array: user[], token: string): boolean {
  // obtain original token string

  const decryptToken = hashOfDecrypt(token);

  let validTokenFlag = false;

  for (const user of array) {
    if (user.token === decryptToken) {
      validTokenFlag = true;
    }
  }

  return validTokenFlag;
}

/** function that checks if a User is part of a channel

 *

 * @param {channel} channel

 * @param {number} authUserId

 * @returns {boolean} validUserFlag

 */

function checkUserpartofChannel(channel: channel, authUserId: number): boolean {
  let validUserFlag = false;

  for (const user of channel.memberIds) {
    if (user.userId === authUserId) {
      validUserFlag = true;
    }
  }

  return validUserFlag;
}

/** function that checks if a User is an existing owner of a channel

 *

 * @param {channel} channel

 * @param {number} authUserId

 * @returns {boolean} isOwnerflag

 */

function checkUserisExistingOwnerofChannel(channel: channel, authUserId: number): boolean {
  let isOwnerflag = false;

  for (const user of channel.adminIds) {
    if (user.userId === authUserId) {
      isOwnerflag = true;
    }
  }

  return isOwnerflag;
}

export function checkValidHandle(users: user[], handle: string): boolean {
  let valid = false;

  for (const use of users) {
    if (use.handle === handle) {
      valid = true;
    }
  }

  return valid;
}

export function getUserByHandle(users: user[], handle: string) {
  let uId = -9;

  for (const use of users) {
    if (use.handle === handle) {
      uId = use.userId;
    }
  }
  return uId;
}

/** Function that loops through an array of users and returns a target user based on the user token

 *

 * @param {user[]} array

 * @param {string} token

 * @returns {user} targetUser

 */

function identifyTargetUserbyToken (array: user[], token: string): user {
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

  // obtain original token string

  const decryptToken = hashOfDecrypt(token);

  for (const user of array) {
    if (user.token === decryptToken) {
      targetUser = user;
    }
  }

  return targetUser;
}

/** Function that loops through an array of users and returns a target user based on the userId

 *

 * @param {user[]} array

 * @param {number} authUserId

 * @returns {user} targetUser

 */

function identifyTargetUserbyAuthUserId (array: user[], authUserId: number): user {
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

  for (const user of array) {
    if (user.userId === authUserId) {
      targetUser = user;
    }
  }

  return targetUser;
}

/** Function that loops through an array of channels and returns a target channel based on the channelId
 *
 * @param {channel[]} array
 * @param {number} channelId
 * @returns {channel} targetChannel
 */

function identifyTargetChannelbyChannelId (array: channel[], channelId: number): channel {
  let targetChannel: channel = {
    channelId: 0,
    name: 'string',
    messages: [],
    isPublic: true,
    memberIds: [],
    adminIds: [],
    idsOfMembers: [],
    isstandup: false,
    standupfinish: -99,
    standupbuffer: []
  };

  for (const channel of array) {
    if (channel.channelId === channelId) {
      targetChannel = channel;
    }
  }
  return targetChannel;
}

/** Function that returns the desired output for users in the specs
 *
 * @param {user} user
 * @returns {object}
 */

function specsUserReturn (user: user) {
  return {
    uId: user.userId,
    email: user.email,
    nameFirst: user.nameFirst,
    nameLast: user.nameLast,
    handleStr: user.handle
  };
}

/** Function that returns an array of users in the format desired by the specs
 *
 * @param {user[]} array
 * @returns {object[]}
 */

function arrayOfUsersReturn (array: user[]) {
  const listOfUsers = [];
  for (const user of array) {
    // return all users except removed users
    if (user.nameFirst !== 'removed' && user.nameLast !== 'user') {
      listOfUsers.push(specsUserReturn(user));
    }
  }
  return listOfUsers;
}

/** Function that checks an array for duplicate values
 *
 * @param { Array[] } uIds
 * @returns { boolean }
 */

function containsDuplicates(uIds: number []) {
  for (let i = 0; i < uIds.length; i++) {
    if (uIds.indexOf(uIds[i]) !== uIds.lastIndexOf(uIds[i])) {
      return true;
    }
  }
  return false;
}

/**
 * Encrypts a string sent as a parameter to the function
 * @param {string} string
 * @returns {string} encrypted string
 */

export function encryption(string: string): string {
  let encryptedStr = '';
  for (let index = 0; index < string.length; index++) {
    const newAsciiValue = string.charCodeAt(index) + 1;
    encryptedStr += String.fromCharCode(newAsciiValue);
  }
  return encryptedStr;
}

/**
 * Decrypts a string sent as a parameter to the function
 * @param {string} string
 * @returns {string} decrypted string
 */

export function decryption(string: string): string {
  let decryptedStr = '';
  for (let index = 0; index < string.length; index++) {
    const newAsciiValue = string.charCodeAt(index) - 1;
    decryptedStr += String.fromCharCode(newAsciiValue);
  }
  return decryptedStr;
}

/**
 * Hash a token
 * @param {string} string
 * @returns {string} hash token encrypt
 */

export function hashOfEncrypt (string: string) {
  const stringReturn = string + secret;
  return (encryption(stringReturn));
}

/**
 * Unhash a token
 * @param {string} string
 * @returns {string} hash token encrypt
 */

export function hashOfDecrypt (string: string) {
  const stringReturn = string.slice(0, -secret.length);
  return (decryption(stringReturn));
}

export {
  clearV1, getUserById, getChannelById, getElementByProperty, checkValidUserId,
  checkValidChannelId, checkValidEmail, checkValidToken, checkUserpartofChannel, containsDuplicates,
  checkUserisExistingOwnerofChannel, identifyTargetUserbyToken, identifyTargetChannelbyChannelId,
  identifyTargetUserbyAuthUserId, specsUserReturn, arrayOfUsersReturn, getUserByToken, getDmById, setUserReacted,
  setMessageBuffer, removeMessageBuffer, getMessageBuffer,
};

export { error, channelMessages };
