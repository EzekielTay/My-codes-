// import { getData, setData } from './dataStore';
import {
  getUserById, error, checkValidToken, identifyTargetUserbyToken,
  identifyTargetUserbyAuthUserId, checkValidEmail, arrayOfUsersReturn, checkValidUserId
} from './other';
import { initialiseData, savetoFile } from './server';
import { user, dataStore } from './dataStore';
import HTTPError from 'http-errors';

/** Obtains the workspaceStats object
 *
 * @param {string} token - attached to the user for a login
 * @returns
 */
function getUsersStats(token: string) {
  const data: dataStore = initialiseData();

  if (!checkValidToken(data.loginUsers, token)) { throw HTTPError(403, 'inv token'); }

  const workLen = data.workspaceStats.length - 1;

  let breakCheck = false;
  let count = 0;
  for (const user of data.users) {
    for (const chan of data.channels) {
      if (chan.idsOfMembers.find(i => i === user.userId)) {
        count++;
        breakCheck = true;
        break;
      }
    }
    if (breakCheck) {
      breakCheck = false;
      continue;
    }
    for (const dm of data.dms) {
      if (dm.membersId.find(i => i === user.userId)) {
        count++;
        break;
      }
    }
  }

  const userLen = count / data.users.length;

  const workspace = {
    channelsExists: data.workspaceStats[workLen].channelsExists,
    dmsExists: data.workspaceStats[workLen].dmsExists,
    messagesExists: data.workspaceStats[workLen].messagesExists,
    UtilizationRate: userLen,
  };

  return { workspaceStats: workspace };
}

/** Returns a users profile found by their userId
 * @param {integer} authUserId - id of function user to be checked if exists in data
 * @param {integer} uId - id of user to be returned
 * @return {string} error - invalid authUserId
 * @returns { user: { userId: integer,
 *                    nameFirst: string,
 *                    nameLast: string,
 *                    email: string,
 *                    handle: string,
 *                  }
 *          }
 * @return {string} error - invalid uId
 */
type returnUser = { user:{
    uId: number,
    nameFirst: string
    nameLast: string
    email: string
    handleStr: string,
  }};
function userProfileV1(token: string, uId: number): error | returnUser {
  if (!checkValidToken(initialiseData().loginUsers, token)) {
    throw HTTPError(403, 'Token is invlid');
  }

  if (getUserById(uId)) {
    const user = getUserById(uId);
    return {
      user: {
        uId: uId,
        nameFirst: user.nameFirst,
        nameLast: user.nameLast,
        email: user.email,
        handleStr: user.handle,
      }
    };
  } else {
    throw HTTPError(400, 'invalid uId passed');
  }
}

/**
 * Change the name of a user.
 * @param {string} token login user Token
 * @param {string} nameFirst User's new first name
 * @param {string} nameLast User's new last name
 * @returns {} or throw error upon unscessful change
 */
export function SetNameUserV1 (token: string, nameFirst: string, nameLast: string) {
  const data: dataStore = initialiseData();
  // check if first name in range 1 to 50
  if (nameFirst.length < 1 || nameFirst.length > 50) {
    throw HTTPError(400, 'First name is not within range of 1 to 50 characters');
  }

  // check if last name in range 1 to 50
  if (nameLast.length < 1 || nameLast.length > 50) {
    throw HTTPError(400, 'Last name is not within range of 1 to 50 characters');
  }

  // check for valid token
  if (checkValidToken(data.loginUsers, token) === false) {
    throw HTTPError(403, 'Token is invlid');
  }

  let targetUser: user = identifyTargetUserbyToken(data.loginUsers, token);
  targetUser = identifyTargetUserbyAuthUserId(data.users, targetUser.userId);

  // change the properties of user profile in the users[]
  targetUser.nameFirst = nameFirst;
  targetUser.nameLast = nameLast;
  savetoFile(data);
  return {};
}

/**
 * Change the email of a user
 * @param {string} token A login user's token
 * @param {string} email To replace a user's current email address
 * @returns {} or throw error upon unscessful change
 */
export function setEmailUserV1 (token: string, email: string) {
  const data: dataStore = initialiseData();

  const validEmailFlag = checkValidEmail(email);
  // check if email is valid email format
  if (validEmailFlag === false) {
    throw HTTPError(400, 'Invalid email entered');
  }

  // Check if email is used by other user.
  for (const user of data.users) {
    if (user.email === email) {
      throw HTTPError(400, 'Iemail address is already being used by another user');
    }
  }

  // Check for valid token
  if (checkValidToken(data.loginUsers, token) === false) {
    throw HTTPError(403, 'Token is invalid');
  }

  let targetUser: user = identifyTargetUserbyToken(data.loginUsers, token);
  targetUser = identifyTargetUserbyAuthUserId(data.users, targetUser.userId);

  targetUser.email = email;
  savetoFile(data);
  return {};
}

/**
 * Change the handle String of a User
 * @param {string} token A login user's token
 * @param {string} handleStr To replace a user's current handlestr
 * @returns {} or throw error upon unscessful change
 */
export function setHandleStrUserV1 (token: string, handleStr: string) {
  const data: dataStore = initialiseData();
  handleStr = handleStr.toLowerCase();
  // check if new handlestr within 3-20 characters inclusive
  if (handleStr.length < 3 || handleStr.length > 20) {
    throw HTTPError(400, 'handleStr is not within range of 3 to 20 characters');
  }

  // check if handlestr contains non-alphanumeric characters
  for (let index = 0; index < handleStr.length; index++) {
    if ((handleStr[index] < 'a' || handleStr[index] > 'z') && (handleStr[index] < '0' || handleStr[index] > '9')) {
      throw HTTPError(400, 'handleStr contains non-alphanumeric characters');
    }
  }

  // check if handlestr is already used by another user
  for (const user of data.users) {
    if (user.handle === handleStr) {
      throw HTTPError(400, 'handleStr is already used by another user');
    }
  }

  if (checkValidToken(data.loginUsers, token) === false) {
    throw HTTPError(403, 'Token is invlid');
  }

  let targetUser: user = identifyTargetUserbyToken(data.loginUsers, token);
  targetUser = identifyTargetUserbyAuthUserId(data.users, targetUser.userId);
  targetUser.handle = handleStr;
  savetoFile(data);
  return {};
}

/**
 * List all users registered under Beans (Excluding removed users)
 * @param {string} token A login user's token
 * @returns {Array} array of registered users
 */
export function listAllUsersV1 (token: string) {
  const data: dataStore = initialiseData();
  // check for valid token
  if (checkValidToken(data.loginUsers, token) === false) {
    throw HTTPError(403, 'Token is invalid');
  }
  const userList = arrayOfUsersReturn(data.users);
  return userList;
}

/**
 * Change User global permissions
 * @param {string} token A login user's token
 * @param {number} uId A User Id of the intended user to change global permissions
 * @param {number} permissionId Either 1 or 2 (Global or normal user)
 * @returns {} or throw error upon unscessful change
 */
export function changeUserPermission (token: string, uId: number, permissionId: number) {
  const data = initialiseData();
  if (checkValidToken(data.loginUsers, token) === false) {
    throw HTTPError(403, 'Token is invalid');
  }

  if (checkValidUserId(data, uId) === false) {
    throw HTTPError(400, 'uId is invalid');
  }

  if (permissionId !== 1 && permissionId !== 2) {
    throw HTTPError(400, 'permission Id is invalid');
  }

  let initiateUser = identifyTargetUserbyToken(data.loginUsers, token);
  initiateUser = identifyTargetUserbyAuthUserId(data.users, initiateUser.userId);
  const targetUser = identifyTargetUserbyAuthUserId(data.users, uId);

  if (initiateUser.global_permission !== 1) {
    throw HTTPError(403, 'the authorised user is not a global owner');
  }

  if (targetUser.global_permission === permissionId) {
    throw HTTPError(400, 'the user already has the permissions level of permissionId');
  }

  if (permissionId === 2 && data.globalOwnerCount === 1) {
    throw HTTPError(400, 'User is the only Global Owner.');
  }

  targetUser.global_permission = permissionId;

  if (permissionId === 1) {
    data.globalOwnerCount += 1;
  } else {
    data.globalOwnerCount -= 1;
  }

  savetoFile(data);
  return {};
}

/** returns a object that contains the stats of the user.
 *
 * @param {string} token - token of the user accessing the function
 * @returns {
 *            channelsJoined: [{
 *                              numChannelsJoined: number
 *                              timeStamp: number
 *                            }],
 *            dmsJoined: [{
  *                           numChannelsJoined: number
  *                           timeStamp: number
 *                       }],
 *            messagesSent: [{
 *                            numChannelsJoined: number
 *                            timeStamp: number
 *                         }],
 *            involvementRate: number
 * }
 */
function userStats(token: string) {
  const data = initialiseData();

  if (!checkValidToken(data.loginUsers, token)) { throw HTTPError(403, `invalid token ${token}`); }

  let user = identifyTargetUserbyToken(data.loginUsers, token);
  user = identifyTargetUserbyAuthUserId(data.users, user.userId);

  if (!user.userStats) {
    user.userStats = {
      channelsJoined: [],
      dmsJoined: [],
      messagesSent: [],
      involvementRate: 0
    };
  }

  const timeNow = Math.floor(Date.now() / 1000);
  let channelsJoined = 0;
  let dmsJoined = 0;
  let messagesSent = 0;
  let totalMessages = 0;

  for (const channel of data.channels) {
    if (channel.memberIds.some((u) => u.userId === user.userId)) { channelsJoined++; }

    for (const msg of channel.messages) {
      if (msg.uId === user.userId) { messagesSent++; }
    }

    totalMessages += channel.messages.length;
  }

  for (const dm of data.dms) {
    if (dm.membersId.includes(user.userId)) { dmsJoined++; }

    for (const msg of dm.messages) {
      if (msg.uId === user.userId) { messagesSent++; }
    }

    totalMessages += dm.messages.length;
  }

  let involvementRate: number;

  if (data.channels.length + data.dms.length + totalMessages === 0) { involvementRate = 0; } else { involvementRate = (channelsJoined + dmsJoined + messagesSent) / (data.channels.length + data.dms.length + totalMessages); }

  user.userStats.channelsJoined.push({
    numChannelsJoined: channelsJoined,
    timeStamp: timeNow
  });
  user.userStats.dmsJoined.push({
    numDmsJoined: dmsJoined,
    timeStamp: timeNow,
  });
  user.userStats.messagesSent.push({
    numMessagesSent: messagesSent,
    timeStamp: timeNow
  });
  user.userStats.involvementRate = involvementRate;

  // console.log(data);
  savetoFile(data);
  return user.userStats;
}
// admin/user/remove/v1. Remove a user from Beans
export function adminRemoveUser (token: string, uId: number) {
  const data: dataStore = initialiseData();
  if (checkValidToken(data.loginUsers, token) === false) {
    throw HTTPError(403, 'Token is invalid');
  }

  if (checkValidUserId(data, uId) === false) {
    throw HTTPError(400, 'uId is invalid');
  }

  let initiateUser = identifyTargetUserbyToken(data.loginUsers, token);
  initiateUser = identifyTargetUserbyAuthUserId(data.users, initiateUser.userId);
  // Check if the user initiating the remove is a global owner
  if (initiateUser.global_permission !== 1) {
    throw HTTPError(403, 'the authorised user is not a global owner');
  }

  const removeUser: user = identifyTargetUserbyAuthUserId(data.users, uId);
  // Check if the user to be removed is the only global owner.
  if (data.globalOwnerCount === 1 && removeUser.global_permission === 1) {
    throw HTTPError(400, 'uId refers to a user who is the only global owner');
  }

  removeUser.nameFirst = 'Removed';
  removeUser.nameLast = 'user';
  removeUser.email = '';
  removeUser.handle = '';

  // Loop through all channels & Replace messages sent by the removed user & remove user from channels
  for (const channel of data.channels) {
    // Replace all messages sent by the removed owner
    for (const message of channel.messages) {
      if (message.uId === uId) {
        message.message = 'Removed User';
      }
    }

    // Remove the user from list of channel members
    for (let index = 0; index < channel.memberIds.length; index++) {
      if (channel.memberIds[index].userId === uId) {
        channel.memberIds = channel.memberIds.splice(index, 1);
        index -= 1;
      }
    }

    // Remove the user from list of channel owners
    for (let index = 0; index < channel.adminIds.length; index++) {
      if (channel.adminIds[index].userId === uId) {
        channel.adminIds = channel.adminIds.splice(index, 1);
        index -= 1;
      }
    }
  }

  // Loop through all dms & Replace messages sent by the removed user & remove user from dms
  for (const dm of data.dms) {
    // Replace messages in dm
    for (const message of dm.messages) {
      if (message.uId === uId) {
        message.message = 'Removed User';
      }
    }

    // Remove user from dms
    for (let index = 0; index < dm.membersId.length; index++) {
      if (dm.membersId[index] === uId) {
        dm.membersId = dm.membersId.splice(index, 1);
        index -= 1;
      }
    }
  }
  savetoFile(data);
  return {};
}

export { userProfileV1, userStats, getUsersStats };
