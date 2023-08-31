import { getData, channel, user, message, dataStore, react } from './dataStore';
import { initialiseData, savetoFile } from './server';

import {
  getUserById, getChannelById, error, checkValidUserId, checkValidToken, checkValidChannelId,
  identifyTargetUserbyToken, identifyTargetUserbyAuthUserId, identifyTargetChannelbyChannelId,
  checkUserpartofChannel, checkUserisExistingOwnerofChannel, getUserByToken, channelMessages, setUserReacted, getElementByProperty
} from './other';
import HTTPError from 'http-errors';

/**
 * Make a user an owner of the channel.
 * @param {string} token A login User's token
 * @param {number} channelId A channel Id to add a channel owner
 * @param {number} uId A User Id to make the user a channel owner
 * @returns {} or throw error upon unsuccessful change of permissions
 */
function addOwnerV1(token: string, channelId: number, uId: number) {
  const data: dataStore = initialiseData();

  // check for valid token
  if (checkValidToken(data.loginUsers, token) === false) {
    throw HTTPError(403, 'invalid token');
  }

  // check for valid channel
  if (checkValidChannelId(data, channelId) === false) {
    throw HTTPError(400, 'invalid Channel Id');
  }

  // check for valid User Id
  if (checkValidUserId(data, uId) === false) {
    throw HTTPError(400, 'invalid User Id');
  }

  const targetChannel: channel = identifyTargetChannelbyChannelId(data.channels, channelId);

  // check if User part of channel
  if (checkUserpartofChannel(targetChannel, uId) === false) {
    throw HTTPError(400, 'User is not part of channel');
  }

  // check if IdUser already a channel Owner
  if (checkUserisExistingOwnerofChannel(targetChannel, uId) === true) {
    throw HTTPError(400, 'User is already a channel owner');
  }

  let tokenUser: user = identifyTargetUserbyToken(data.loginUsers, token);
  tokenUser = identifyTargetUserbyAuthUserId(data.users, tokenUser.userId);

  // check if Token User is a channel Owner
  if (checkUserisExistingOwnerofChannel(targetChannel, tokenUser.userId) === false) {
    throw HTTPError(403, 'Token has no permission to add others');
  }

  const targetUser: user = identifyTargetUserbyAuthUserId(data.users, uId);

  // Add targetUser to list of channel Owners in channels database
  targetChannel.adminIds.push(targetUser);

  // Add targetUser to list of channel Owners in users database
  targetUser.admin_of_ch.push(channelId);

  savetoFile(data);
  return {};
}

/**
 * Remove a user from list of channel owners.
 * @param {string} token A login User's token
 * @param {number} channelId A channel Id to remove a channel owner
 * @param {number} uId A User Id to remove channel owner rights
 * @returns {} or throw error upon unsuccessful change of permissions
 */
function removerOwnerV1 (token: string, channelId: number, uId: number) {
  const data: dataStore = initialiseData();
  // check for valid token
  if (checkValidToken(data.loginUsers, token) === false) {
    throw HTTPError(403, 'invalid User token');
  }

  // check for valid channel
  if (checkValidChannelId(data, channelId) === false) {
    throw HTTPError(400, 'invalid Channel Id');
  }

  // check for valid User Id
  if (checkValidUserId(data, uId) === false) {
    throw HTTPError(400, 'invalid User Id');
  }

  const targetChannel: channel = identifyTargetChannelbyChannelId(data.channels, channelId);

  // check if IdUser is a channel Owner
  if (checkUserisExistingOwnerofChannel(targetChannel, uId) === false) {
    throw HTTPError(400, 'User is already not a channel Owner');
  }

  // check if there is more than one channel owners
  if (targetChannel.adminIds.length === 1) {
    throw HTTPError(400, 'User is the only channel Owner');
  }

  let tokenUser: user = identifyTargetUserbyToken(data.loginUsers, token);
  tokenUser = identifyTargetUserbyAuthUserId(data.users, tokenUser.userId);

  const targetUser: user = identifyTargetUserbyAuthUserId(data.users, uId);

  // check if Token User is a channel Owner
  if (checkUserisExistingOwnerofChannel(targetChannel, tokenUser.userId) === false) {
    throw HTTPError(403, 'TokenUser has no permissions to remove other user owner rights');
  }

  // Remove User from channel Owners in Channels database
  for (let index = 0; index < targetChannel.adminIds.length; index++) {
    if (targetChannel.adminIds[index].userId === uId) {
      targetChannel.adminIds.splice(index, 1);
      index -= 1;
    }
  }

  // Remove User from channel Owners in Users database
  for (let index = 0; index < targetUser.admin_of_ch.length; index++) {
    if (targetUser.admin_of_ch[index] === channelId) {
      targetUser.admin_of_ch.splice(index, 1);
      index -= 1;
    }
  }

  savetoFile(data);
  return {};
}

export interface detail {
  name: string,
  isPublic: boolean,
  ownerMembers: {
    uId: number,
    email: string,
    nameFirst: string,
    nameLast: string,
    handleStr: string
  }[],
  allMembers: {
    uId: number,
    email: string,
    nameFirst: string,
    nameLast: string,
    handleStr: string
  }[]
}

/** channelInvite will add a user with uId into a channel
 *  whether it is public or not, as long as authUserId is
 *  part of the specified channel already
 * @param {number} authUserId
 * @param {number} channelId
 * @param {number} uId
 * @return {error: 'string'} if channelId does not refer to a valid channel
 * @return {error: 'string'} if uId does not refer to a valid user
 * @return {error: 'string'} if uId refers to a user already in the channel
 * @return {error: 'string'} if channelId is valid, authuser is not in channel
 * @return {error: 'string'} authUserId is invalid
 * @return {{}} if authUserId is a member of the channel with Id channelId
 *              and uId refers to a valid user that's not in the channel
 */
function channelInviteV1(token: string, channelId: number, uId: number) {
  const data: dataStore = initialiseData();

  if (!checkValidToken(data.loginUsers, token)) {
    throw HTTPError(403, 'invalid token');
  }
  const channeldetail: any = getChannelById(channelId);
  const authUid: number = identifyTargetUserbyToken(data.loginUsers, token).userId;
  const authdetails: any = identifyTargetUserbyAuthUserId(data.users, authUid);

  if (!channeldetail) {
    throw HTTPError(400, 'invalid channelId');
  }

  if (authdetails.member_of_ch.includes(channelId) === false) {
    throw HTTPError(403, 'you are not in this channel');
  }

  const invitedetail: any = getUserById(uId);

  if (!invitedetail) {
    throw HTTPError(400, 'invalid invitee');
    // return { error: 'invalid invitee' };
  }

  if (invitedetail.member_of_ch.includes(channelId) === true) {
    throw HTTPError(400, 'they are already in this channel');
  }

  for (const channel of data.channels) {
    if (channel.channelId === channelId) {
      channel.memberIds.push(invitedetail);
    }
  }

  for (const member of data.users) {
    if (member.userId === uId) {
      member.member_of_ch.push(channelId);
    }
  }

  savetoFile(data);

  return {};
}

// const sleep = async (milliseconds) => {
//   await new Promise(resolve => {
//       return setTimeout(resolve, milliseconds)
//   });
// };

// const testSleep = async () => {
//   console.log('Step 1 - Called');
//   await sleep(5000);
//   console.log('Step 2 - Called');
// }

// testSleep();

/** ChannelMessagesV1 returns an array of the next 50 messages
 *  (inclusive of starting message) of a channel
 * specified from a position by start, return start itself and an endpoint
 *  If there are less than 50 messages returned, end is set to -1
 *
 * @param {string} token - token of user to be checked if exists in channel
 * @param {number} channelId - id of a channel to be found
 * @param {number} start - starting messageId
 * @return {string} error - invalid token
 * @return {string} error - invalid channelId
 * @return {string} error - authUserId not apart of channel
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

function channelMessagesV1(token: string, channelId: number, start: number): error | channelMessages {
  const data = initialiseData();
  const messages: message[] = [];
  const channel: channel = getElementByProperty(data.channels, 'channelId', channelId);

  // check if id of function user is valid
  if (!checkValidToken(getData().loginUsers, token)) {
    throw HTTPError(403, `invalid token ${token} accessing channelMessagesV1`);
  }

  // check if channel id exists in data
  if (!channel) {
    throw HTTPError(400, `invalid channel ${channelId} in channelMessagesV1`);
  }

  // check if channel includes id of function user

  const functionUser: user = getUserByToken(token);
  const channelMembers: user[] = channel.memberIds;
  let validUserFlag = false;
  for (const user of channelMembers) {
    if (user.userId === functionUser.userId) {
      validUserFlag = true;
    }
  }

  if (!validUserFlag) {
    throw HTTPError(403, `token ${token} is not apart of channel ${channelId}`);
  }

  // check if start is greater than number of messages in channel
  if (start > channel.messages.length) {
    throw HTTPError(400, `starting point ${start} is greater than channel messages length ${channel.messages.length}`);
  }

  // writes channel messages into array messages
  for (let i = start; i < start + 50 && i < channel.messages.length; ++i) {
    messages.push({
      messageId: channel.messages[i].messageId,
      uId: channel.messages[i].uId,
      message: channel.messages[i].message,
      timeSent: channel.messages[i].timeSent,
      isPinned: channel.messages[i].isPinned,
      reacts: setUserReacted(channel.messages[i].reacts, functionUser.userId)
    });
  }

  return {
    messages: messages,
    start: start,
    end: start + 50 < channel.messages.length ? start + 50 : -1,
  };
}

/** channelDetails returns the details of a channel as long as
 * authUserId is already apart of specified channel
 * @param {number} authUserId
 * @param {number} channelId
 * @return {error: 'string'} if channelId does not refer to a valid channel
 * @return {error: 'string'} if channelId is valid, authUser is not in channel
 * @return {error: 'string'} if authUserId is invalid
 * @return {{name: [{string}],
 *            ownerMembers: {
 *              uId: {integer}
 *              email: {string}
 *              nameFirst: {string}
 *              nameLast: {string}
 *              handleStr: {string}
 *            }
 *            allMembers: {
 *              uId: {integer}
 *              email: {string}
 *              nameFirst: {string}
 *              nameLast: {string}
 *              handleStr: {string}
 *            }
 *          }
 *}
 */

function channelDetailsV1(token: string, channelId: number): detail|error {
  const data: dataStore = initialiseData();
  const channeldetail: any = getChannelById(channelId);

  if (!channeldetail) {
    throw HTTPError(400, 'invalid channelId');
  }

  if (!checkValidToken(data.loginUsers, token)) {
    throw HTTPError(403, 'invalid token');
  }

  const uId: number = identifyTargetUserbyToken(data.loginUsers, token).userId;
  const userdetail: user = identifyTargetUserbyAuthUserId(data.users, uId);

  if (userdetail.member_of_ch.includes(channelId) === false) {
    throw HTTPError(403, 'you are not in this channel');
  }

  const owners = [];
  const members = [];

  for (const owner of channeldetail.adminIds) {
    owners.push(
      {
        uId: owner.userId,
        email: owner.email,
        nameFirst: owner.nameFirst,
        nameLast: owner.nameLast,
        handleStr: owner.handle
      }
    );
  }

  for (const user of channeldetail.memberIds) {
    members.push(
      {
        uId: user.userId,
        email: user.email,
        nameFirst: user.nameFirst,
        nameLast: user.nameLast,
        handleStr: user.handle
      }
    );
  }

  const detail = {
    name: channeldetail.name,
    isPublic: channeldetail.isPublic,
    ownerMembers: owners,
    allMembers: members
  };

  return detail;
}

/** channelJoin allows a user to join a specified channel
 *  as long as that channel is public. A user with owner permissions
 *  however, can join any channel public or private and will
 *  automatically become an owner of that channel
 * @param {number} authUserId
 * @param {number} channelId
 * @return {error: 'string'} if channelId does not refer to a valid channel
 * @return {error: 'string'} if authUserId does not refer to a valid user
 * @return {error: 'string'} if authUserId if  user is already in channel
 * @return {error: 'string'} if channelId is private, and authUserId is not global owner
 * @return {error: 'string'} if authUserId is invalid
 * @return {{}}
 */

function channelJoinV1(token: string, channelId: number): error|object {
  const data: dataStore = initialiseData();
  const channeldetail: any = getChannelById(channelId);

  if (!channeldetail) {
    throw HTTPError(400, 'invalid channelId');
    // return { error: 'invalid channelId' };
  }

  if (!checkValidToken(data.loginUsers, token)) {
    throw HTTPError(403, 'invalid token');
  }

  const uId: number = identifyTargetUserbyToken(data.loginUsers, token).userId;
  const userdetail: user = identifyTargetUserbyAuthUserId(data.users, uId);

  for (const memb of channeldetail.memberIds) {
    if (memb.userId === uId) {
      throw HTTPError(400, 'you are already in this channel');
    }
  }

  if (channeldetail.isPublic === false && userdetail.global_permission !== 1) {
    throw HTTPError(403, 'this channel is not public');
  }

  /// /////////////////

  for (const channel of data.channels) {
    if (channel.channelId === channelId) {
      channel.memberIds.push(userdetail);
      channel.idsOfMembers.push(uId);
    }
  }

  for (const member of data.users) {
    if (member.userId === uId) {
      member.member_of_ch.push(channelId);
    }
  }

  savetoFile(data);

  return {};
}

function channelLeaveV1(token: string, channelId: number): error|object {
  const data: dataStore = initialiseData();
  const channeldetail: any = getChannelById(channelId);

  if (!channeldetail) {
    throw HTTPError(400, 'invalid channelId');
  }

  if (!checkValidToken(data.loginUsers, token)) {
    throw HTTPError(403, 'invalid token');
  }

  const uId: number = identifyTargetUserbyToken(data.loginUsers, token).userId;
  const userdetail: user = identifyTargetUserbyAuthUserId(data.users, uId);

  if (userdetail.member_of_ch.includes(channelId) === false) {
    throw HTTPError(403, 'you are not in this channel');
  }

  let isadmin = false;

  for (const admin of channeldetail.adminIds) {
    if (admin.userId === uId) {
      isadmin = true;
    }
  }

  if (isadmin === false) {
    for (const cid in data.channels) {
      if (data.channels[cid].channelId === channelId) {
        for (const members in data.channels[cid].memberIds) {
          if (data.channels[cid].memberIds[members].userId === uId) {
            let memberssplice = parseInt(members);
            data.channels[cid].memberIds.splice(memberssplice, 1);
            data.channels[cid].idsOfMembers.splice(memberssplice, 1);
            memberssplice -= 1;
          }
        }
      }
    }

    for (const member in data.users) {
      if (data.users[member].userId === uId) {
        for (const mof in data.users[member].member_of_ch) {
          if (data.users[member].member_of_ch[mof] === channelId) {
            let mofsplice = parseInt(mof);
            data.users[member].member_of_ch.splice(mofsplice, 1);
            mofsplice -= 1;
          }
        }
      }
    }
  }

  if (isadmin === true) {
    for (const cid in data.channels) {
      if (data.channels[cid].channelId === channelId) {
        for (const members in data.channels[cid].memberIds) {
          if (data.channels[cid].memberIds[members].userId === uId) {
            let membersplice = parseInt(members);
            data.channels[cid].memberIds.splice(membersplice, 1);
            membersplice -= 1;
          }
        }
      }
    }

    for (const cid1 in data.channels) {
      if (data.channels[cid1].channelId === channelId) {
        for (const admins in data.channels[cid1].adminIds) {
          if (data.channels[cid1].adminIds[admins].userId === uId) {
            let adminsplice = parseInt(admins);
            data.channels[cid1].adminIds.splice(adminsplice, 1);
            adminsplice -= 1;
          }
        }
      }
    }

    for (const member in data.users) {
      if (data.users[member].userId === uId) {
        for (const mof in data.users[member].member_of_ch) {
          if (data.users[member].member_of_ch[mof] === channelId) {
            let mofssplice = parseInt(mof);
            data.users[member].member_of_ch.splice(mofssplice, 1);
            mofssplice -= 1;
          }
        }
      }
    }

    for (const member1 in data.users) {
      if (data.users[member1].userId === uId) {
        for (const mof1 in data.users[member1].admin_of_ch) {
          if (data.users[member1].admin_of_ch[mof1] === channelId) {
            let mof1splice = parseInt(mof1);
            data.users[member1].admin_of_ch.splice(mof1splice, 1);
            mof1splice -= 1;
          }
        }
      }
    }
  }

  savetoFile(data);

  return {};
}

export interface standupstat {
  isActive: boolean,
  timeFinish: number
}

function standupStartV1(token: string, channelId: number, length: number) {
  const data: dataStore = initialiseData();
  const channeldetail: any = getChannelById(channelId);
  const nowtime = Math.floor(Date.now() / 1500);
  const timeFinishs = nowtime + length;
  if (!checkValidToken(data.loginUsers, token)) {
    throw HTTPError(403, 'invalid token');
  }

  if (!channeldetail) {
    throw HTTPError(400, 'invalid channelId');
  }

  if (length < 0) {
    throw HTTPError(400, 'length cannot be negative');
  }

  // const uId: number = identifyTargetUserbyToken(data.loginUsers, token).userId;
  // const userdetail: user = identifyTargetUserbyAuthUserId(data.users, uId);

  if (standupActiveV1(token, channelId).isActive === true) {
    throw HTTPError(400, 'another standup is still active');
  }

  for (const cid in data.channels) {
    if (data.channels[cid].channelId === channelId) {
      data.channels[cid].isstandup = true;
      data.channels[cid].standupfinish = nowtime + length;
      data.channels[cid].standupbuffer = [];
    }
  }

  standupTime(token, channelId, timeFinishs, length);
  savetoFile(data);

  return {
    timeFinish: timeFinishs
  };
}

function standupTime(token: string, channelId: number, finishTime: number, length: number) {
  const id = setTimeout(() => { standupFinish(token, channelId, finishTime); }, length * 1000);
  setTimeout(() => { standupClear(channelId, id); }, length * 1100);
}

function standupFinish(token: string, channelId: number, finishTime: number) {
  const data = initialiseData();
  const channel = getChannelById(channelId);
  const user = getUserByToken(token);

  let messages = '';
  for (const message of channel.standupbuffer) {
    messages += message;
    messages += '\n';
  }
  console.log(messages);

  const standupmsg = {
    messageId: 0,
    uId: user.userId,
    message: messages,
    timeSent: finishTime,
    isPinned: false,
    reacts: [] as react[],
  };

  if (messages !== '') {
    for (const channel of data.channels) {
      if (channel.channelId === channelId) {
        channel.messages.push(standupmsg);
        break;
      }
    }
  }
  //
  // standupClear(channelId);
  savetoFile(data);
}

function standupClear(channelId: number, id: any) {
  const data = initialiseData();
  // const channel = getElementByProperty(data.channels, 'channelId', channelId);
  for (const chan of data.channels) {
    if (chan.channelId === channelId) {
      chan.isstandup = false;
      chan.standupfinish = -99;
      chan.standupbuffer = [];
    }
  }
  clearTimeout(id);
  savetoFile(data);
}

function standupActiveV1(token: string, channelId: number) {
  const data: dataStore = initialiseData();
  const channeldetail: any = getChannelById(channelId);

  if (!checkValidToken(data.loginUsers, token)) {
    throw HTTPError(403, 'invalid token');
  }

  if (!channeldetail) {
    throw HTTPError(400, 'invalid channelId');
  }

  const uId: number = identifyTargetUserbyToken(data.loginUsers, token).userId;
  const userdetail: user = identifyTargetUserbyAuthUserId(data.users, uId);

  if (userdetail.member_of_ch.includes(channelId) === false) {
    throw HTTPError(403, 'you are not in this channel');
  }

  let standupstats: standupstat = {
    isActive: false,
    timeFinish: -99
  };

  if (channeldetail.isstandup === false) {
    standupstats = {
      isActive: false,
      timeFinish: null
    };
  } else {
    standupstats = {
      isActive: true,
      timeFinish: channeldetail.standupfinish
    };
  }

  return standupstats;
}

function standupSendV1(token: string, channelId: number, message: string) {
  const data: dataStore = initialiseData();
  const channeldetail: any = getChannelById(channelId);

  if (!checkValidToken(data.loginUsers, token)) {
    throw HTTPError(403, 'invalid token');
  }

  if (!channeldetail) {
    throw HTTPError(400, 'invalid channelId');
  }

  if (message.length > 1000) {
    throw HTTPError(400, 'message is tooo long');
  }

  const uId: number = identifyTargetUserbyToken(data.loginUsers, token).userId;
  const userdetail: user = identifyTargetUserbyAuthUserId(data.users, uId);

  if (userdetail.member_of_ch.includes(channelId) === false) {
    throw HTTPError(403, 'you are not in this channel');
  }

  if (standupActiveV1(token, channelId).isActive === false) {
    throw HTTPError(400, 'there are no standups active rn');
  }

  const userhandle: string = userdetail.handle;

  for (const cid in data.channels) {
    if (data.channels[cid].channelId === channelId) {
      data.channels[cid].standupbuffer.push(userhandle + ' : ' + message);
    }
  }

  savetoFile(data);
  return {};
}

export { channelMessagesV1, channelInviteV1, channelDetailsV1, channelJoinV1, addOwnerV1, removerOwnerV1, channelLeaveV1, standupStartV1, standupActiveV1, standupSendV1 };
