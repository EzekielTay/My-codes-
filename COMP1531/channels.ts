import { dataStore, user } from './dataStore';
import { checkValidToken } from './other';
import { initialiseData, savetoFile } from './server';
import { identifyTargetUserbyToken, identifyTargetUserbyAuthUserId } from './other';
import HTTPError from 'http-errors';

/** ChannelCreate creates a channel with a specified name
 * of minimum length 1 and maximum 20, as well as if it is public
 * or private. authUserId must be valid.
 * @param {string} token - string for the user's login session
 * @param {string} name - string that contains the channel's name
 * @param {boolean} isPublic - boolean that classifies whether channel is public/private
 * @returns {channelId: integer} - object containing the channel's Id if succesfully created
 * @returns {{Object}} - if authUser Id is not valid, returns an error message
 */

function channelsCreateV1(token: string, name: string, isPublic: boolean) {
  const data: dataStore = initialiseData();
  console.log(token);
  // Error cases
  if (name.length < 1 || name.length > 20) {
    throw HTTPError(400, 'Naming Issues');
  }
  if (!(checkValidToken(data.loginUsers, token))) {
    throw HTTPError(403, 'Invalid Token');
  }

  let idGenerated = 1;
  idGenerated += Object.entries(data.channels).length;

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

  const targetUserToken = identifyTargetUserbyToken(data.loginUsers, token);
  targetUser = identifyTargetUserbyAuthUserId(data.users, targetUserToken.userId);

  data.channels.push({
    channelId: idGenerated,
    name: name,
    messages: [],
    isPublic: isPublic,
    memberIds: [targetUser],
    adminIds: [targetUser],
    idsOfMembers: [targetUserToken.userId],
    isstandup: false,
    standupfinish: -99,
    standupbuffer: []
  });

  for (const user of data.users) {
    if (targetUserToken.userId === user.userId) {
      user.member_of_ch.push(idGenerated);
      user.admin_of_ch.push(idGenerated);
    }
  }

  const workLen = data.workspaceStats.length - 1;
  const channelsLen = data.workspaceStats[workLen].channelsExists.length - 1;
  data.workspaceStats[workLen].channelsExists.push({
    numChannelsExists: data.workspaceStats[workLen].channelsExists[channelsLen]
      .numChannelsExists + 1,
    timeStamp: Math.floor((new Date()).getTime() / 1000)
  });

  savetoFile(data);
  return {
    channelId: idGenerated,
  };
}

/** ChannelList will list all the channels that the valid
 * authUserId is apart of whether public or private.
 * @param {string} token - string for the user's login session
 * @returns {channels: [{channelId: integer, name: string}]} - Object containing
 * possibly multiple channelIds and channelNames
 * @returns {{Object}} - if authUser Id is not valid, returns an error message
*/
type channelList = {
    channelId: number,
    name: string,
}

function channelsListV1(token: string) {
  const data: dataStore = initialiseData();

  if (!checkValidToken(data.loginUsers, token)) {
    throw HTTPError(403, 'Invalid Token');
  }

  const channelList: channelList[] = [];

  const targetUser: user = identifyTargetUserbyToken(data.loginUsers, token);

  for (const channel of data.channels) {
    for (const user of channel.memberIds) {
      if (user.userId === targetUser.userId) {
        channelList.push({
          channelId: channel.channelId,
          name: channel.name
        });
      }
    }
  }

  return {
    channels: channelList,
  };
}

/** channelListAllV1 will list all channels as long as
 * authUserId is valid, whether public or private.
 * @param {string} token - string for the user's login session
 * @returns {channels: [{channelId: integer, name: string}]} - Object containing all channelIds and channelNames
 * @returns {{Object}} - if authUser Id is not valid, returns an error message
 */

function channelsListAllV1(token: string) {
  const allChannels = [];
  const data: dataStore = initialiseData();

  if (!(checkValidToken(data.loginUsers, token))) {
    throw HTTPError(403, 'Invalid Token');
  }

  for (const channel of data.channels) {
    allChannels.push({
      channelId: channel.channelId,
      name: channel.name,
    });
  }

  return {
    channels: allChannels,
  };
}

export { channelsCreateV1, channelsListAllV1, channelsListV1 };
