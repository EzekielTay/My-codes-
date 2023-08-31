
import { user, dm, message, dataStore } from './dataStore';
import {
  checkValidToken, getUserByToken, identifyTargetUserbyToken,
  checkValidUserId, error, channelMessages, getUserById, containsDuplicates, hashOfDecrypt, setUserReacted
} from './other';
import { initialiseData, savetoFile } from './server';
import HTTPError from 'http-errors';

/** This function create a direct message in the dataStore
 *
 * @param {string} token - essentially attached to the user for a login
 * @param {number[]} uIds - carries all of the users who are to join the dm session
 * @returns { dmId: number } - a unique identfier
 * @returns {string} error - any Uids in Uids array does not refer to a valid user
 * @returns {string} error - there are duplicate uIds in uIds
 * @returns {string} error - token is invalid
 */

export function createDM(token: string, uIds: number[]) {
  const data: dataStore = initialiseData();

  // Error cases 1 - checks valid authUserId
  for (const id of uIds) {
    if (!(checkValidUserId(data, id))) {
      throw HTTPError(400, 'Invalid authUserId');
    }
  }
  // Error case 2 - checks for a valid token
  if (!(checkValidToken(data.loginUsers, token))) {
    throw HTTPError(403, 'Invalid token');
  }

  // Error case 3 - duplicates within the array
  if (containsDuplicates(uIds)) {
    throw HTTPError(400, 'Duplicate values');
  }

  // Grab all names of members and place it into an array
  const listOfMembers = [];
  for (const user of data.users) {
    for (const x of uIds) {
      if (x === user.userId) {
        listOfMembers.push(user.handle);
      }
    }
  }

  let creatorId = 0;
  for (const user of data.loginUsers) {
    if (hashOfDecrypt(token) === user.token) {
      creatorId = user.userId;
    }
  }
  uIds.push(creatorId);
  uIds.sort();

  let creatorName = '';
  for (const creator of data.users) {
    if (creatorId === creator.userId) {
      creatorName = creator.handle;
    }
  }

  let idGenerated = 1;
  idGenerated += Object.entries(data.dms).length;
  listOfMembers.push(creatorName);
  listOfMembers.sort();

  data.dms.push({
    creator: creatorName,
    membersId: uIds,
    dmId: idGenerated,
    dmName: listOfMembers,
    messages: []
  });

  const workLen = data.workspaceStats.length - 1;
  const dmsLen = data.workspaceStats[workLen].dmsExists.length - 1;
  data.workspaceStats[workLen].dmsExists.push({
    numDmsExists: data.workspaceStats[workLen].dmsExists[dmsLen]
      .numDmsExists + 1,
    timeStamp: Math.floor((new Date()).getTime() / 1000)
  });

  savetoFile(data);

  return {
    dmId: idGenerated,
  };
}

type returnUser = {
  uId: number,
  nameFirst: string
  nameLast: string
  email: string
  handleStr: string,
};

/**
 *
 * @param {string} token - essentially attached to the user for a login
 * @returns {dms: [ {dmId: number, dmName: string[]} ]}  - displays a list of dms
 * @returns {string} error - token is invalid
 */

export function dmList(token: string) {
  const data: dataStore = initialiseData();

  if (!(checkValidToken(data.loginUsers, token))) {
    throw HTTPError(403, 'Invalid token');
  }

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
    token: 'string',
  };

  targetUser = identifyTargetUserbyToken(data.loginUsers, token);

  const dmList = [];

  // pushes the dms  of the user

  for (const dm of data.dms) {
    for (const id of dm.membersId) {
      if (id === targetUser.userId) {
        dmList.push({
          dmId: dm.dmId,
          name: dm.dmName
        });
      }
    }
  }

  return {
    dms: dmList,
  };
}

type dmdetails = {
  name: string[],
  members: returnUser[]
}

/**
 *
 * @param {string} token - unique identifier for the user
 * @param {dmId} number - specific number associated to the dm
 * @returns {  details: [
 *                        {
 *                          uId: number,
 *                          nameFirst: string,
 *                          nameLast: string,
 *                          email: string,
 *                          handleStr: string,
 *                        }
 *            ]} - an object containing details of a dm
 * details of a dm
 * @returns {string} error - dmId does not refer to a valid dm
 * @returns {string} error - dmId is valid and the auth user is not in the dm
 * @returns {string} error - token is invalid
 */

export function dmDetails(token:string, dmId: number) {
  const data: dataStore = initialiseData();

  if (!(checkValidToken(data.loginUsers, token))) {
    throw HTTPError(403, 'invalid token');
  }

  let dmexist = false;
  for (const dmessage of data.dms) {
    if (dmessage.dmId === dmId) {
      dmexist = true;
    }
  }

  if (dmexist === false) {
    throw HTTPError(400, 'dm with this ID does not exist');
  }

  let userin = false;
  const userdetail: user = identifyTargetUserbyToken(data.loginUsers, token);
  for (const dmessages of data.dms) {
    if (dmId === dmessages.dmId) {
      for (const ids of dmessages.membersId) {
        if (userdetail.userId === ids) {
          userin = true;
        }
      }
    }
  }

  if (userin === false) {
    throw HTTPError(403, 'you are not in this channel');
  }

  const details: dmdetails = {
    name: [],
    members: []
  };

  for (const dmess of data.dms) {
    if (dmId === dmess.dmId) {
      for (const n of dmess.dmName) {
        details.name.push(n);
      }
    }
  }

  for (const dmess of data.dms) {
    if (dmId === dmess.dmId) {
      for (const uId of dmess.membersId) {
        const detail: user = getUserById(uId);
        details.members.push({
          uId: detail.userId,
          nameFirst: detail.nameFirst,
          nameLast: detail.nameLast,
          email: detail.email,
          handleStr: detail.handle,
        });
      }
    }
  }

  return details;
}

/**
 *
 * @param {string} token - unique identifier associated to the login
 * @param {number} dmId - specific dm
 * @returns {} - successful will remove a whole dm
 */

export function dmRemove(token:string, dmId: number) {
  const data: dataStore = initialiseData();

  if (!(checkValidToken(data.loginUsers, token))) {
    throw HTTPError(400, 'Invalid token');
  }
  let dmexist = false;
  for (const dmessage of data.dms) {
    if (dmessage.dmId === dmId) {
      dmexist = true;
    }
  }

  if (dmexist === false) {
    throw HTTPError(400, 'dm with this ID does not exist');
  }

  const uId: number = identifyTargetUserbyToken(data.loginUsers, token).userId;
  const userdetail: user = getUserById(uId);

  let dmdetail: dm;

  for (const dmess of data.dms) {
    if (dmess.dmId === dmId) {
      dmdetail = dmess;
    }
  }

  if (userdetail.handle !== dmdetail.creator) {
    throw HTTPError(403, 'you are not the creator');
  }

  if (dmdetail.membersId.includes(uId) === false) {
    throw HTTPError(403, 'you are no longer in the dm');
  }

  // remove from membersId
  for (const dmember of data.dms) {
    if (dmember.dmId === dmId) {
      dmember.membersId = [];
    }
  }
  // remove from dmName
  for (const dmember of data.dms) {
    if (dmember.dmId === dmId) {
      dmember.dmName = [];
    }
  }

  // if you remove a dm then you need to decrement from len
  const workLen = data.workspaceStats.length - 1;
  const dmsLen = data.workspaceStats[workLen].dmsExists.length - 1;
  data.workspaceStats[workLen].dmsExists.push({
    numDmsExists: data.workspaceStats[workLen].dmsExists[dmsLen].numDmsExists - 1,
    timeStamp: Math.floor((new Date()).getTime() / 1000),
  });

  savetoFile(data);
  return {};
}

/**
 *
 * @param {string} token - unique identifier for the user
 * @param {dmId} - specific number associated to the dm
 * @returns {object} - {} if successful returns a null object
 * @returns {string} error - dmId does not refer to a valid dm
 * @returns {string} error - dm id Valid and the authorsied user is not the original dm creator
 * @returns {string} error - dmId is valid however, authId is not in DM
 * @returns {string} error - token is invalid
 */

export function dmLeave(token: string, dmId: number) {
  const data: dataStore = initialiseData();

  // first case passes
  if (!(checkValidToken(data.loginUsers, token))) {
    throw HTTPError(403, 'Invalid Token');
  }
  // second case passes
  const dmFind = data.dms.find(dm => dm.dmId === dmId);
  if (dmFind === undefined) {
    throw HTTPError(400, 'dmId does not exist');
  }

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
    token: 'string',
  };

  targetUser = identifyTargetUserbyToken(data.loginUsers, token);
  let truthVar2 = false;
  for (const dm of data.dms) {
    if (dmId === dm.dmId) {
      for (const id of dm.membersId) {
        if (targetUser.userId === id) {
          truthVar2 = true;
        }
      }
    }
  }

  if (truthVar2 === false) {
    throw HTTPError(403, 'authUserId doesnt exist in dm');
  }

  // Will splice out the member who wants to leave

  for (const dm of data.dms) {
    if (dmId === dm.dmId) {
      for (const id of dm.membersId) {
        if (targetUser.userId === id) {
          dm.membersId.splice(dm.membersId.indexOf(id), 1);
        }
      }
    }
  }
  savetoFile(data);
  return {};
}

/** dmMessages returns an array of the next 50 messages
 *  (inclusive of starting message) of a dm
 * specified from a position by start, return start itself and an endpoint
 *  If there are less than 50 messages returned, end is set to -1
 *
 * @param {number} token - id of user to be checked if exists in channel
 * @param {number} dmId - id of a channel to be found
 * @param {number} start - starting message number in channel
 * @return {string} error - invalid token
 * @return {string} error - invalid dmId
 * @return {string} error - user not apart of channel
 * @return {string} error - start is greater than channel length
 * @return {{messages: [
 *                      {
 *                       messageId: integer,
 *                       uId: integer,
 *                       message: string,
 *                       timeSent: integer,
 *                      }
 *                     ],
 *         start: number,
 *         end: number
 *        }} - returns on valid arguments
 */
function dmMessages(token: string, dmId: number, start: number): channelMessages | error {
  const data = initialiseData();
  let dm: dm;
  for (const _dm of data.dms) {
    if (_dm.dmId === dmId) { dm = _dm; }
  }

  if (!dm) { throw HTTPError(400, `invalid dmId ${dmId}`); }

  if (dm.messages.length < start) { throw HTTPError(400, `start ${start} is greater than messages length ${dm.messages.length}`); }

  if (!checkValidToken(data.loginUsers, token)) { throw HTTPError(403, `invalid token ${token} parsed!`); }

  if (!dm.membersId.includes(getUserByToken(token).userId)) { throw HTTPError(403, `user ${getUserByToken(token).userId} is not apart of dm ${dmId}`); }

  const messages: message[] = [];

  for (let i = start; i < start + 50 && i < dm.messages.length; ++i) {
    messages.push({
      messageId: dm.messages[i].messageId,
      uId: dm.messages[i].uId,
      message: dm.messages[i].message,
      timeSent: dm.messages[i].timeSent,
      reacts: setUserReacted(dm.messages[i].reacts, getUserByToken(token).userId),
      isPinned: false
    });
  }

  return {
    messages: messages,
    start: start,
    end: start + 50 < dm.messages.length ? start + 50 : -1,
  };
}

export { dmMessages };
