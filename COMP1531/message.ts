import { checkValidToken, containsDuplicates, getDmById, getElementByProperty, getMessageBuffer, getUserByToken, identifyTargetUserbyToken, removeMessageBuffer, setMessageBuffer } from './other';
import { initialiseData, savetoFile } from './server';
import { message, channel, react, dataStore } from './dataStore';
import HTTPError from 'http-errors';

type uIdsArrays = number[]

/** Creates a react to a valid message
 *
 * @param {string} token - attached to the user for a login
 * @param {number} messageId - id of a message
 * @param {number} reactId - id of a react
 * @returns
 */

function messageReact(token: string, messageId: number, reactId: number) {
  const data: dataStore = initialiseData();

  if (!checkValidToken(data.loginUsers, token)) { throw HTTPError(403, 'Invalid token'); }
  if (reactId !== 1) { throw HTTPError(400, 'reactId is not valid'); }

  let messageFrom = '';
  for (const dm of data.dms) {
    if (dm.messages.filter(find => find.messageId === messageId).length === 0) {
      throw HTTPError(400, 'messageId not dms');
    } else {
      messageFrom = 'dm';
    }
  }

  for (const channel of data.channels) {
    if (channel.messages.filter(find => find.messageId === messageId).length === 0) {
      throw HTTPError(400, 'messageId also not channels');
    } else {
      messageFrom = 'channel';
    }
  }

  const targetUser: number = identifyTargetUserbyToken(data.loginUsers, token).userId;

  for (const dm of data.dms) {
    for (const search of dm.messages) {
      if (messageId === search.messageId) {
        if (!(dm.membersId.includes(targetUser))) { throw HTTPError(400, 'bad errors'); }
      }
    }
  }

  for (const chan of data.channels) {
    for (const search of chan.messages) {
      if (messageId === search.messageId) {
        if (!(chan.idsOfMembers.includes(targetUser))) { throw HTTPError(400, 'we finished'); }
      }
    }
  }

  let uIdsArrayDms: uIdsArrays = [];
  let uIdsArrayChannels: uIdsArrays = [];

  for (const chan of data.channels) {
    for (const mess of chan.messages) {
      for (const react of mess.reacts) {
        uIdsArrayChannels = react.uIds.filter(id => id >= 0);
      }
    }
  }

  for (const dm of data.dms) {
    for (const mess of dm.messages) {
      for (const react of mess.reacts) {
        uIdsArrayDms = react.uIds.filter(id => id >= 0);
      }
    }
  }

  if (messageFrom === 'dm') {
    uIdsArrayDms.push(targetUser);
    uIdsArrayDms.sort();
    if (containsDuplicates(uIdsArrayDms)) { throw HTTPError(400, 'duplicate dm'); }
    for (const dm of data.dms) {
      for (const mess of dm.messages) {
        if (mess.messageId === messageId) {
          mess.reacts.push({
            reactId: reactId,
            uIds: uIdsArrayDms,
          });
          if (mess.reacts.length > 1) {
            mess.reacts.shift();
          }
        }
      }
    }
  }

  if (messageFrom === 'channel') {
    uIdsArrayChannels.push(targetUser);
    uIdsArrayChannels.sort();
    if (containsDuplicates(uIdsArrayChannels)) { throw HTTPError(400, 'duplicate chan'); }
    for (const chan of data.channels) {
      for (const chanMess of chan.messages) {
        if (chanMess.messageId === messageId) {
          chanMess.reacts.push({
            reactId: reactId,
            uIds: uIdsArrayChannels,
          });
          if (chanMess.reacts.length > 1) {
            chanMess.reacts.shift();
          }
        }
      }
    }
  }

  savetoFile(data);
  return {};
}

/** Given a valid react will remove it
 *
 * @param {string} token - attached to a user from login
 * @param {number} messageId - id for a message
 * @param {number} reactId - id for a react
 * @returns
 */

function messageUnreact(token: string, messageId: number, reactId: number) {
  const data: dataStore = initialiseData();
  if (!checkValidToken(data.loginUsers, token)) { throw HTTPError(403, 'Invalid token'); }
  if (reactId !== 1) { throw HTTPError(400, 'reactId is not valid'); }
  let removeFrom = '';

  for (const dm of data.dms) {
    if (dm.messages.filter(find => find.messageId === messageId).length === 0) {
      throw HTTPError(400, 'messageId not dms');
    } else {
      removeFrom = 'dm';
    }
  }

  for (const channel of data.channels) {
    if (channel.messages.filter(find => find.messageId === messageId).length === 0) {
      throw HTTPError(400, 'messageId also not channels');
    } else {
      removeFrom = 'chan';
    }
  }

  let uIdsArrayDms: uIdsArrays = [];
  let uIdsArrayChannels: uIdsArrays = [];
  const targetUser: number = identifyTargetUserbyToken(data.loginUsers, token).userId;

  for (const chan of data.channels) {
    for (const mess of chan.messages) {
      for (const react of mess.reacts) {
        uIdsArrayChannels = react.uIds.filter(id => id >= 0);
      }
    }
  }

  for (const dm of data.dms) {
    for (const mess of dm.messages) {
      for (const react of mess.reacts) {
        uIdsArrayDms = react.uIds.filter(id => id >= 0);
      }
    }
  }

  if (removeFrom === 'dm') {
    if (uIdsArrayDms.find(id => id === targetUser) === undefined) { throw HTTPError(400, 'dm error'); }
    const indexDm = uIdsArrayDms.indexOf(targetUser);
    uIdsArrayDms.splice(indexDm, 1);
  }
  if (removeFrom === 'chan') {
    if (uIdsArrayChannels.find(id => id === targetUser) === undefined) { throw HTTPError(400, 'chan error'); } else {
      const indexChan = uIdsArrayChannels.indexOf(targetUser);
      uIdsArrayChannels.splice(indexChan, 1);
    }
  }

  if (removeFrom === 'dm') {
    for (const dm of data.dms) {
      for (const mess of dm.messages) {
        if (mess.messageId === messageId) {
          for (const react of mess.reacts) {
            if (uIdsArrayDms.length === 0) {
              mess.reacts = [];
            } else {
              react.uIds = uIdsArrayDms;
            }
          }
        }
      }
    }
  }
  if (removeFrom === 'chan') {
    for (const chan of data.channels) {
      for (const mess of chan.messages) {
        if (mess.messageId === messageId) {
          for (const react of mess.reacts) {
            if (uIdsArrayChannels.length === 0) {
              mess.reacts = [];
            } else {
              react.uIds = uIdsArrayChannels;
            }
          }
        }
      }
    }
  }

  savetoFile(data);
  return {};
}

type msgArray = string[];

/** Searches for message given a queryStr
 *
 * @param {string} token - attach to the user from login
 * @param {string} queryStr - checks all against this string
 * @returns
 */
function searchMessages(token: string, queryStr: string) {
  const data: dataStore = initialiseData();
  if (!checkValidToken(data.loginUsers, token)) { throw HTTPError(403, 'Invalid token'); }
  if (queryStr.length < 1 || queryStr.length > 1000) { throw HTTPError(400, 'queryStr issue'); }

  const msgs: msgArray = [];
  const targetUser: number = identifyTargetUserbyToken(data.loginUsers, token).userId;

  for (const dm of data.dms) {
    if (dm.membersId.includes(targetUser)) {
      for (const dmMess of dm.messages) {
        if (dmMess.message.includes(queryStr)) {
          msgs.push(dmMess.message);
        }
      }
    }
  }

  for (const chan of data.channels) {
    if (chan.idsOfMembers.find(i => i === targetUser)) {
      for (const chanMess of chan.messages) {
        if (chanMess.message.includes(queryStr)) {
          msgs.push(chanMess.message);
        }
      }
    }
  }

  return { messages: msgs };
}

/** Given a valid message will share this message with its own personalised
 *  message
 *
 * @param {string} token - attach to the user from login
 * @param {number} ogMessageId - unique id of the message
 * @param {string} message - message to append
 * @param {number} channelId - unique id of the channel
 * @param {number} dmId - unique id of the dm
 * @returns
 */

function messageShare(token: string, ogMessageId: number, message: string, channelId: number, dmId: number) {
  const data: dataStore = initialiseData();
  // If the token is invalid throw 403
  if (!checkValidToken(data.loginUsers, token)) { throw HTTPError(403, 'Invalid token'); }
  // If both Ids are -1
  if ((channelId === -1) && (dmId === -1)) { throw HTTPError(400, 'Both ids are -1'); }
  // Message len exceeds 1k letters
  if (message.length > 1000) { throw HTTPError(400, 'Length of message too long'); }
  // At least one has to be -1 and one has to be a cId
  let flag = false;
  if (((channelId === -1) && !(dmId === -1)) || ((!(channelId === -1) && (dmId === -1)))) {
    flag = true;
  }
  if (flag === false) { throw HTTPError(400, 'At least one is not -1'); }

  // Checks where the message be sent to plus checks if the dmId is valid
  let messageTo = '';
  if (((channelId === -1) && !(dmId === -1))) {
    messageTo = 'dms';
    if (data.dms.find(id => id.dmId === dmId) === undefined) { throw HTTPError(400, 'dmId is invalid'); }
  }
  if (((!(channelId === -1) && (dmId === -1)))) {
    messageTo = 'chan';
    if (data.channels.find(id => id.channelId === channelId) === undefined) { throw HTTPError(400, 'chanId is invalid'); }
  }

  const targetUser: number = identifyTargetUserbyToken(data.loginUsers, token).userId;
  // Checks if the authorised message exists
  let str = '';
  let ogAuthorised = false;
  for (const dm of data.dms) {
    if (dm.membersId.filter(id => id === targetUser).length === 1) {
      for (const dmMess of dm.messages) {
        if (dmMess.messageId === ogMessageId) {
          ogAuthorised = true;
          str = dmMess.message + ' ' + message;
        }
      }
    }
  }

  for (const chan of data.channels) {
    if (chan.idsOfMembers.filter(id => id === targetUser).length === 1) {
      for (const chanMess of chan.messages) {
        if (ogMessageId === chanMess.messageId) {
          ogAuthorised = true;
          str = chanMess.message + ' ' + message;
        }
      }
    }
  }

  if (!(ogAuthorised)) {
    throw HTTPError(400, 'ogMessageId does not refer to a valid message');
  }
  const msgId = data.messageCounter++;

  let msgIncluded = false;
  if (messageTo === 'dms') {
    for (const dm of data.dms) {
      if (dmId === dm.dmId) {
        if (dm.membersId.includes(targetUser)) {
          dm.messages.push(
            {
              isPinned: false,
              message: str,
              messageId: msgId,
              reacts: [] as react[],
              timeSent: Math.floor(Date.now() / 1000),
              uId: targetUser,
            }
          );
          msgIncluded = true;
        }
      }
    }
  }

  if (messageTo === 'chan') {
    for (const chan of data.channels) {
      if (channelId === chan.channelId) {
        if (chan.idsOfMembers.includes(targetUser)) {
          chan.messages.push(
            {
              isPinned: false,
              message: str,
              messageId: msgId,
              reacts: [] as react[],
              timeSent: Math.floor(Date.now() / 1000),
              uId: targetUser,
            }
          );
          msgIncluded = true;
        }
      }
    }
  }

  if (msgIncluded === false) { throw HTTPError(403, 'Not included in where they send'); }

  const workLen = data.workspaceStats.length - 1;
  const messageLen = data.workspaceStats[workLen].messagesExists.length - 1;
  data.workspaceStats[workLen].messagesExists.push({
    numMessagesExists: data.workspaceStats[workLen].messagesExists[messageLen].numMessagesExists + 1,
    timeStamp: Math.floor((new Date()).getTime() / 1000)
  });
  savetoFile(data);
  return { sharedMessageId: msgId };
}

/** messageSend will post a message onto a specified channel determined by channelId parameter. The
  * message will be successfully sent only if it's length is between 1 ~ 1000 characters inclusive
  * TimeSent will send a delayed message at a time specified
  * @param {string} token - session token of user accessing function
  * @param {number} channelId - channel's id to post into
  * @param {string} message - message to post
  * @param {number} timeSent - time for message to be sent
  * @returns {messageId: number} - successful parameters
  * @returns {error: String} - invalid channelId
  * @returns {error: String} - message exceeds 1000 characters
  * @returns {error: String} - message below 1 character
  * @returns {error: String} - invalid token
  * @returns {error: String} - user is not apart of specified channel
  */
function messageSend(token: string, channelId: number, message: string, timeSent?: number): {messageId?: number} {
  const data = initialiseData();
  const channel = getElementByProperty(data.channels, 'channelId', channelId);

  if (!channel) { throw HTTPError(400, `invalid channelId ${channelId}`); }

  if (message.length > 1000) { throw HTTPError(400, 'message over 1000'); }

  if (message.length < 1) { throw HTTPError(400, 'message is too short'); }

  if (!checkValidToken(data.loginUsers, token)) { throw HTTPError(403, `invalid token ${token} parsed!`); }

  const user = getUserByToken(token);

  if (!getElementByProperty(channel.memberIds, 'userId', user.userId)) { throw HTTPError(403, `user ${user.userId} is not apart of channel ${channelId}`); }

  if (!data.messageCounter) { data.messageCounter = 0; }
  if (!data.messageBuffer) { data.messageBuffer = []; }

  const msgId = data.messageCounter++; // use then increment
  const timeNow = Math.floor(Date.now() / 1000);

  const msg: message = {
    messageId: msgId,
    uId: user.userId,
    message: message,
    timeSent: timeNow,
    reacts: [] as react[],
    isPinned: false
  };

  if (timeSent) {
    if (timeSent < timeNow) { throw HTTPError(400, `timeSent ${timeSent} is less than timeNow ${timeNow}`); }

    msg.timeSent = timeSent;
    setMessageBuffer(data, msg);
    setTimeout(() => {
      getMessageBuffer(msg, { channelId: channelId });
    }, (timeSent - timeNow) * 1000);
  } else {
    channel.messages.push(msg);
  }

  const workLen = data.workspaceStats.length - 1;
  const messageLen = data.workspaceStats[workLen].messagesExists.length - 1;
  data.workspaceStats[workLen].messagesExists.push({
    numMessagesExists: data.workspaceStats[workLen].messagesExists[messageLen].numMessagesExists + 1,
    timeStamp: Math.floor((new Date()).getTime() / 1000)
  });

  savetoFile(data);
  return { messageId: msgId };
}

/** messageEdit will edit a message given a valid messageId. messageEdit will edit a message if
 * the new message length is between 1 ~ 1000 inclusive. Messages with lengths under 1 will be removed
 * from their associated channel
 *
 * @param {string} token - session token of user accessing function
 * @param {number} messageId - messageId of message to alter
 * @param {string} message - new message to overwrite with
 * @returns {} - sucessful parameters
 * @returns {error: string} - message length is over 1000
 * @returns {error: string} - messageId is apart of a channel that user is not
 * @returns {error: string} - user is accessing a message they did not send
 *                            and user is not an owner
 * @returns {error: string} - token is invalid
 */
function messageEdit(token: string, messageId: number, message: string) {
  if (message.length > 1000) {
    throw HTTPError(400, 'message over 1000');
  }

  if (message.length < 1) { return messageRemove(token, messageId); }

  const editFunc = function(array: message[], index: number) {
    array[index].message = message;
    return array;
  };

  return messageChange(token, messageId, editFunc);
}

/** messageRemove will delete a message given a valid messageId
 *
 * @param {string} token - session token of user accessing function
 * @param {number} messageId - messageId of message to delete
 * @returns {} - sucessful parameters
 * @returns {error: string} - messageId is apart of a channel that user is not
 * @returns {error: string} - user is accessing a message they did not send
 *                            and user is not an owner
 * @returns {error: string} - token is invalid
 */
function messageRemove(token: string, messageId: number) {
  const data = initialiseData();
  if (!data.messageBuffer) { data.messageBuffer = []; }
  const msg = data.messageBuffer?.find(msg => msg.messageId === messageId);
  if (msg) {
    removeMessageBuffer(data, msg);
    savetoFile(data);
    return {};
  }
  const removeFunc = function(array: message[], index: number) {
    array.splice(index, 1);
    return array;
  };

  const workLen = data.workspaceStats.length - 1;
  const messageLen = data.workspaceStats[workLen].messagesExists.length - 1;
  data.workspaceStats[workLen].messagesExists.push({
    numMessagesExists: data.workspaceStats[workLen].messagesExists[messageLen].numMessagesExists - 1,
    timeStamp: Math.floor((new Date()).getTime() / 1000),
  });

  savetoFile(data);

  return messageChange(token, messageId, removeFunc);
}

// helper
type arrayModifyFn = (array: any[], index: number) => any[];

function messageChange(token: string, messageId: number, modifyMessages: arrayModifyFn) {
  const data = initialiseData();

  if (!checkValidToken(data.loginUsers, token)) { throw HTTPError(403, `invalid token ${token} parsed!`); }

  const user = getUserByToken(token);

  for (const cId of user.member_of_ch) {
    const channel: channel = getElementByProperty(data.channels, 'channelId', cId);
    for (let i = 0; i < channel.messages.length; ++i) {
      if (channel.messages[i].messageId === messageId) {
        if (!(channel.messages[i].uId === user.userId || user.admin_of_ch.includes(cId))) { throw HTTPError(403, `user ${user.userId} does not have permissions to modify message ${messageId}`); }

        // takes an array and returns the modified array, which was changed at element i
        channel.messages = modifyMessages(channel.messages, i);

        savetoFile(data);
        return {};
      }
    }
  }
  for (const dm of data.dms) {
    if (dm.membersId.includes(user.userId)) {
      for (let i = 0; i < dm.messages.length; ++i) {
        if (dm.messages[i].messageId === messageId) {
          if (!(dm.messages[i].uId === user.userId || user.handle === dm.creator)) { throw HTTPError(403, `user ${user.userId} does not have permissions to modify message ${messageId}`); }

          // takes an array and returns the modified array, which was changed at element i
          dm.messages = modifyMessages(dm.messages, i);

          savetoFile(data);
          return {};
        }
      }
    }
  }

  throw HTTPError(400, `Id ${messageId} does not refer to valid message`);
}

/** sendDm will send a message to a dm channel determined by a specified dmId. It will not accept
 * messages of lengths greater than 1000 or less than 1.
 * TimeSent will delay the message and send it at time specified
 * @param token - token of user session
 * @param dmId - Id representing the dm
 * @param message - message to be sent
 * @param {number} timeSent - time for message to be sent
 * @returns {messageId: number} - upon successful dm
 * @returns {error: String} - invalid dmId
 * @returns {error: String} - message exceeds 1000 characters
 * @returns {error: String} - message below 1 character
 * @returns {error: String} - invalid token
 * @returns {error: String} - user is not apart of specified dm
 */
function sendDm(token: string, dmId: number, message: string, timeSent?: number): {messageId?: number, error?: string} {
  const data = initialiseData();
  const dm = getElementByProperty(data.dms, 'dmId', dmId);
  if (!dm) { throw HTTPError(400, `invalid dmId ${dmId}`); }

  if (message.length > 1000) { throw HTTPError(400, 'message over 1000'); }

  if (message.length < 1) { throw HTTPError(400, 'message is too short'); }

  if (!checkValidToken(data.loginUsers, token)) { throw HTTPError(403, `invalid token ${token} parsed!`); }

  const user = getUserByToken(token);

  if (!getDmById(dmId).membersId.includes(user.userId)) { throw HTTPError(403, `user ${user.userId} is not apart of dm ${dmId}`); }

  if (!data.messageCounter) { data.messageCounter = 0; }
  // if (!data.messageBuffer) {data.messageBuffer = []; }
  const msgId = data.messageCounter++; // use then increment
  const timeNow = Math.floor(Date.now() / 1000);

  const msg: message = {
    messageId: msgId,
    uId: user.userId,
    message: message,
    timeSent: timeNow,
    reacts: [] as react[],
    isPinned: false
  };

  if (timeSent) {
    if (timeSent < timeNow) { throw HTTPError(400, `timeSent ${timeSent} is less than timeNow ${timeNow}`); }

    msg.timeSent = timeSent;
    setMessageBuffer(data, msg);
    setTimeout(() => {
      getMessageBuffer(msg, { dmId: dmId });
    }, (timeSent - timeNow) * 1000);
  } else {
    dm.messages.push(msg);
  }

  const workLen = data.workspaceStats.length - 1;
  const messageLen = data.workspaceStats[workLen].messagesExists.length - 1;
  data.workspaceStats[workLen].messagesExists.push({
    numMessagesExists: data.workspaceStats[workLen].messagesExists[messageLen].numMessagesExists + 1,
    timeStamp: Math.floor((new Date()).getTime() / 1000)
  });

  savetoFile(data);
  return { messageId: msgId };
}
/** pins a message in a channel or dm
 *
 * @param {string} token - token of user accessing function
 * @param {number} messageId - messageId to be pinned
 * @returns
 */
function messagePin(token: string, messageId: number) {
  const pin = function (array: message[], index: number) {
    if (array[index].isPinned) { throw HTTPError(400, `message ${messageId} is already pinned`); }

    array[index].isPinned = true;
    return array;
  };

  messageChange(token, messageId, pin);
  return {};
}

/** unpins a message in a channel or dm
 *
 * @param {string} token - token of user accessing function
 * @param {number} messageId - messageId to be pinned
 * @returns
 */
function messageUnpin(token: string, messageId: number) {
  const unpin = function (array: message[], index: number) {
    if (!array[index].isPinned) { throw HTTPError(400, `message ${messageId} is already unpinned`); }

    array[index].isPinned = false;
    return array;
  };

  messageChange(token, messageId, unpin);
  return {};
}

export {
  messageSend, messageEdit, messageRemove, sendDm, messagePin, messageUnpin,
  messageReact, messageUnreact, searchMessages, messageShare
};
