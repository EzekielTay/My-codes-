import request from 'sync-request';
import config from './config.json';

const OK = 200;
const port = config.port;
const url = config.url;
const SERVER_URL = `${url}:${port}`;

type httpMethod = 'POST' | 'GET' | 'DELETE' | 'PUT';

type testUser = {
    authUserId: number,
    token: string,
}

type testchannel = {
    channelId: number,
}

type testDm = {
    dmId: number,
}
type testMId = {
    messageId: number
}

const INPUT_ERROR = 400;
const PERMISSION_ERROR = 403;

function requestMethod(method: httpMethod, uri: string, obj: any) {
  const res = request(
    method,
    SERVER_URL + uri,
    obj
  );

  if (res.statusCode !== OK) { return res.statusCode; }

  return JSON.parse(res.body as string);
}

function sendDmV1(token: string, dmId: number, message: string) {
  return requestMethod('POST', '/message/senddm/v2', {
    json: {
      token: token,
      dmId: dmId,
      message: message
    },
    headers: {
      token: token
    }
  });
}

function dmDetails(token: string, dmId: number) {
  const res = request(
    'GET',
    SERVER_URL + '/dm/details/v2', {
      qs: {
        dmId: dmId,
      },
      headers: {
        token: token
      }
    }
  );
  if (res.statusCode !== OK) {
    return res.statusCode;
  }

  return JSON.parse(res.getBody() as string);
}

function dmMessagesV1(token: string, dmId: number, start: number) {
  return requestMethod('GET', '/dm/messages/v2', {
    qs: {
      token: token,
      dmId: dmId,
      start: start,
    },
    headers: {
      token: token
    }
  });
}

function messageSendV1(token: string, channelId: number, message: string) {
  return requestMethod(
    'POST',
    '/message/send/v2',
    {
      json: {
        token: token,
        channelId: channelId,
        message: message,
      },
      headers: {
        token: token
      }
    }
  );
}

function messageEditV1(token: string, messageId: number, message: string) {
  return requestMethod(
    'PUT',
    '/message/edit/v2',
    {
      json: {
        token: token,
        messageId: messageId,
        message: message,
      },
      headers: {
        token: token
      }
    }
  );
}

function messageRemoveV1(token: string, messageId: number) {
  return requestMethod('DELETE', '/message/remove/v2', {
    qs: {
      token: token,
      messageId: messageId
    },
    headers: {
      token: token
    }
  }
  );
}

function channelMessageV2(token: string, channelId: number, start: number) {
  return requestMethod('GET', '/channel/messages/v3', {
    qs: {
      channelId: channelId,
      start: start
    },
    headers: {
      token: token
    }
  });
}

function authLogin(email: string, password: string) {
  const res = request(
    'POST',
    SERVER_URL + '/auth/login/v3',
    {
      json: {
        email: email,
        password: password,
      },
    }
  );
  if (res.statusCode !== OK) {
    // Return error code number instead of object in case of error.
    return res.statusCode;
  }
  return JSON.parse(res.getBody() as string);
}

function authRegister(email: string, password: string, nameFirst: string, nameLast: string) {
  const res = request(
    'POST',
    SERVER_URL + '/auth/register/v3',
    {
      json: {
        email: email,
        password: password,
        nameFirst: nameFirst,
        nameLast: nameLast,
      },
    }
  );
  if (res.statusCode !== OK) {
    // Return error code number instead of object in case of error.
    // (just for convenience)
    return res.statusCode;
  }
  return JSON.parse(res.getBody() as string);
}

function authLogout (token: string) {
  const res = request(
    'POST',
    SERVER_URL + '/auth/logout/v2',
    {
      headers: {
        token: token
      },
    }

  );
  if (res.statusCode !== OK) {
    // Return error code number instead of object in case of error.
    // (just for convenience)
    return res.statusCode;
  }
  return JSON.parse(res.getBody() as string);
}

function returnUserProfile (token: string, uId: number) {
  const res = request(
    'GET',
    SERVER_URL + '/user/profile/v3',
    {
      qs: {
        uId
      },
      headers: {
        token: token
      },
    }
  );
  if (res.statusCode !== OK) {
    // Return error code number instead of object in case of error.
    return res.statusCode;
  }
  return JSON.parse(res.getBody() as string);
}

function userListAll (token: string) {
  const res = request(
    'GET',
    SERVER_URL + '/users/all/v2',
    {
      headers: {
        token: token
      },
    }
  );
  if (res.statusCode !== OK) {
    // Return error code number instead of object in case of error.
    return res.statusCode;
  }
  return JSON.parse(res.getBody() as string);
}

function setUserName (token: string, nameFirst: string, nameLast: string) {
  const res = request(
    'PUT',
    SERVER_URL + '/user/profile/setname/v2',
    {
      json: {
        nameFirst: nameFirst,
        nameLast: nameLast
      },
      headers: {
        token: token
      },
    }
  );
  if (res.statusCode !== OK) {
    // Return error code number instead of object in case of error.
    return res.statusCode;
  }
  return JSON.parse(res.getBody() as string);
}

function changeUserEmail (token: string, email:string) {
  const res = request(
    'PUT',
    SERVER_URL + '/user/profile/setemail/v2',
    {
      json: {
        email: email
      },
      headers: {
        token: token
      },
    }
  );
  if (res.statusCode !== OK) {
    // Return error code number instead of object in case of error.
    return res.statusCode;
  }
  return JSON.parse(res.getBody() as string);
}

function changeUserHandleStr (token: string, handleStr:string) {
  const res = request(
    'PUT',
    SERVER_URL + '/user/profile/sethandle/v2',
    {
      json: {
        handleStr: handleStr
      },
      headers: {
        token: token
      },
    }
  );
  if (res.statusCode !== OK) {
    // Return error code number instead of object in case of error.

    return res.statusCode;
  }
  return JSON.parse(res.getBody() as string);
}

function channelsCreateV2(token: string, name: string, isPublic: boolean) {
  const res = request(
    'POST',
    SERVER_URL + '/channels/create/v3',
    {
      json: {
        name: name,
        isPublic: isPublic,
      },
      headers: {
        token: token,
      },
    }
  );
  if (res.statusCode !== OK) {
    // Return error code number instead of object in case of error.
    return res.statusCode;
  }
  return JSON.parse(res.getBody() as string);
}

function channelsListV2(token: string) {
  const res = request(
    'GET',
    SERVER_URL + '/channels/list/v3',
    {
      headers: {
        token: token,
      },
    }
  );
  if (res.statusCode !== OK) {
    // Return error code number instead of object in case of error.
    return res.statusCode;
  }
  return JSON.parse(res.getBody() as string);
}

function channelsListAllV2(token: string) {
  const res = request(
    'GET',
    SERVER_URL + '/channels/listAll/v3',
    {
      headers: {
        token: token,
      },
    }
  );
  if (res.statusCode !== OK) {
    // Return error code number instead of object in case of error.
    return res.statusCode;
  }
  return JSON.parse(res.getBody() as string);
}

function clearV1 () {
  const res = request(
    'DELETE',
    SERVER_URL + '/clear/v1'
  );
  return JSON.parse(res.getBody() as string);
}

function createDM(token: string, uIds: number[]) {
  const res = request(
    'POST',
    SERVER_URL + '/dm/create/v2',
    {
      json: {
        uIds: uIds,
      },
      headers: {
        token: token,
      }
    }
  );
  if (res.statusCode !== OK) {
    // Return error code number instead of object in case of error.
    return res.statusCode;
  }
  return JSON.parse(res.getBody() as string);
}

function dmList(token: string) {
  const res = request(
    'GET',
    SERVER_URL + '/dm/list/v2',
    {
      headers: {
        token: token,
      }
    }
  );
  if (res.statusCode !== OK) {
    // Return error code number instead of object in case of error.
    return res.statusCode;
  }
  return JSON.parse(res.getBody() as string);
}

function dmLeave(token: string, dmId: number) {
  const res = request(
    'POST',
    SERVER_URL + '/dm/leave/v2',
    {
      json: {
        dmId: dmId,
      },
      headers: {
        token: token,
      },
    }
  );
  if (res.statusCode !== OK) {
    // Return error code number instead of object in case of error.
    return res.statusCode;
  }
  return JSON.parse(res.getBody() as string);
}

function dmRemove(token: string, dmId: number) {
  const res = request(
    'DELETE',
    SERVER_URL + '/dm/remove/v1',
    {
      qs: {
        dmId: dmId,
      },
      headers: {
        token: token
      }
    }
  );
  if (res.statusCode !== OK) {
    return res.statusCode;
  }
  return JSON.parse(res.getBody() as string);
}

export function passwordResetV1 (email: string) {
  const res = request(
    'POST',
    SERVER_URL + '/auth/passwordreset/request/v1',
    {
      json: {
        email: email
      },
    }
  );
  if (res.statusCode !== OK) {
    // Return error code number instead of object in case of error.
    // (just for convenience)
    return res.statusCode;
  }
  return JSON.parse(res.getBody() as string);
}

export function resetCodePasswordV1 (resetCode: string, newPassword: string) {
  const res = request(
    'POST',
    SERVER_URL + '/auth/passwordreset/reset/v1',
    {
      json: {
        resetCode: resetCode,
        newPassword: newPassword
      },
    }
  );
  if (res.statusCode !== OK) {
    return res.statusCode;
  }
  return JSON.parse(res.getBody() as string);
}

export function forceSetResetCode (uId: number) {
  const res = request(
    'POST',
    SERVER_URL + '/auth/force/resetCode',
    {
      json: {
        uId: uId
      },
    }
  );
  return JSON.parse(res.getBody() as string);
}

export function changeUserPermissionV1 (token: string, uId: number, permissionId: number) {
  const res = request(
    'POST',
    SERVER_URL + '/admin/userpermission/change/v1',
    {
      json: {
        uId: uId,
        permissionId: permissionId
      },
      headers: {
        token: token
      },
    }
  );
  if (res.statusCode !== OK) {
    // Return error code number instead of object in case of error.
    // (just for convenience)
    return res.statusCode;
  }
  return JSON.parse(res.getBody() as string);
}

export function addOwnerV2 (token: string, channelId: number, uId: number) {
  const res = request(
    'POST',
    SERVER_URL + '/channel/addowner/v2',
    {
      json: {
        channelId: channelId,
        uId: uId
      },
      headers: {
        token: token,
      }
    }
  );
  if (res.statusCode !== OK) {
    return res.statusCode;
  }
  return JSON.parse(res.getBody() as string);
}

export function removeOwnerV2 (token: string, channelId: number, uId: number) {
  const res = request(
    'POST',
    SERVER_URL + '/channel/removeowner/v2',
    {
      json: {
        channelId: channelId,
        uId: uId
      },
      headers: {
        token: token,
      }
    }
  );
  if (res.statusCode !== OK) {
    return res.statusCode;
  }
  return JSON.parse(res.getBody() as string);
}

export function adminRemoveUserV1 (token: string, uId: number) {
  const res = request(
    'DELETE',
    SERVER_URL + '/admin/user/remove/v1',
    {
      qs: {
        uId: uId
      },
      headers: {
        token: token,
      }
    }
  );
  if (res.statusCode !== OK) {
    return res.statusCode;
  }
  return JSON.parse(res.getBody() as string);
}

function messageSendLaterV1(token: string, channelId: number, message: string, timeSent: number) {
  return requestMethod('POST', '/message/sendlater/v1', {
    json: {
      channelId: channelId,
      message: message,
      timeSent: timeSent
    },
    headers: {
      token: token
    }
  });
}

function messageSendLaterDmV1(token: string, dmId: number, message: string, timeSent: number) {
  return requestMethod('POST', '/message/sendlaterdm/v1', {
    json: {
      dmId: dmId,
      message: message,
      timeSent: timeSent
    },
    headers: {
      token: token
    }
  });
}

function messagePinV1(token: string, messageId: number) {
  return requestMethod('POST', '/message/pin/v1', {
    json: {
      messageId: messageId,
    },
    headers: {
      token: token
    }
  });
}

function messageUnpinV1(token: string, messageId: number) {
  return requestMethod('POST', '/message/unpin/v1', {
    json: {
      messageId: messageId,
    },
    headers: {
      token: token
    }
  });
}

function messageReactV1(token: string, messageId: number, reactId: number) {
  const res = request(
    'POST',
    SERVER_URL + '/message/react/v1',
    {
      headers: {
        token: token,
      },
      json: {
        messageId: messageId,
        reactId: reactId,
      },
    }
  );
  if (res.statusCode !== OK) {
    return res.statusCode;
  }
  return JSON.parse(res.getBody() as string);
}

function messageUnreactV1(token: string, messageId: number, reactId: number) {
  const res = request(
    'POST',
    SERVER_URL + '/message/unreact/v1',
    {
      headers: {
        token: token,
      },
      json: {
        messageId: messageId,
        reactId: reactId,
      },
    }
  );
  if (res.statusCode !== OK) {
    return res.statusCode;
  }
  return JSON.parse(res.getBody() as string);
}

function searchMessagesV1(token: string, queryStr: string) {
  const res = request(
    'GET',
    SERVER_URL + '/search/v1',
    {
      headers: {
        token: token,
      },
      qs: {
        queryStr: queryStr
      },
    }
  );
  if (res.statusCode !== OK) {
    return res.statusCode;
  }
  return JSON.parse(res.getBody() as string);
}

function channelDetailsV2(token: string, channelId: number) {
  const res = request(
    'GET',
    SERVER_URL + '/channel/details/v3',
    {
      qs: {
        channelId
      },
      headers: {
        token: token
      }
    }
  );
  if (res.statusCode !== OK) {
    return res.statusCode;
  }
  return JSON.parse(res.getBody() as string);
}

function channelJoinV2(token: string, channelId: number) {
  const res = request(
    'POST',
    SERVER_URL + '/channel/join/v3',
    {
      json: {
        channelId: channelId
      },
      headers: {
        token: token
      }
    }
  );
  if (res.statusCode !== OK) {
    return res.statusCode;
  }
  return JSON.parse(res.getBody() as string);
}

function channelInviteV2(token: string, channelId: number, uId: number) {
  const res = request(
    'POST',
    SERVER_URL + '/channel/invite/v3',
    {
      json: {
        channelId: channelId,
        uId: uId,
      },
      headers: {
        token: token
      }
    }
  );
  if (res.statusCode !== OK) {
    return res.statusCode;
  }
  return JSON.parse(res.getBody() as string);
}

function channelLeaveV1(token: string, channelId: number) {
  const res = request(
    'POST',
    SERVER_URL + '/channel/leave/v2',
    {
      json: {
        channelId: channelId,
      },
      headers: {
        token: token
      }
    }
  );
  if (res.statusCode !== OK) {
    return res.statusCode;
  }
  return JSON.parse(res.getBody() as string);
}

function userStatsV1(token: string) {
  const res = request(
    'GET',
    SERVER_URL + '/user/stats/v1',
    {
      qs: {},
      headers: {
        token: token
      }
    }
  );
  if (res.statusCode !== OK) {
    return res.statusCode;
  }
  return JSON.parse(res.getBody() as string);
}

function standupStartV1(token: string, channelId: number, length: number) {
  const res = request(
    'POST',
    SERVER_URL + '/standup/start/v1',
    {
      json: {
        channelId: channelId,
        length: length
      },
      headers: {
        token: token
      }
    }
  );
  if (res.statusCode !== OK) {
    return res.statusCode;
  }
  return JSON.parse(res.getBody() as string);
}

function standupActiveV1(token: string, channelId: number) {
  const res = request(
    'GET',
    SERVER_URL + '/standup/Active/v1',
    {
      qs: {
        channelId: channelId
      },
      headers: {
        token: token
      }
    }
  );
  if (res.statusCode !== OK) {
    return res.statusCode;
  }
  return JSON.parse(res.getBody() as string);
}

function standupSendV1(token: string, channelId: number, message: string) {
  const res = request(
    'POST',
    SERVER_URL + '/standup/send/v1',
    {
      json: {
        channelId: channelId,
        message: message
      },
      headers: {
        token: token
      }
    }
  );
  if (res.statusCode !== OK) {
    return res.statusCode;
  }
  return JSON.parse(res.getBody() as string);
}

function shareMessagesV1(token: string, ogMessageId: number, message: string, channelId: number, dmId: number) {
  const res = request(
    'POST',
    SERVER_URL + '/message/share/v1',
    {
      headers: {
        token: token,
      },
      json: {
        ogMessageId: ogMessageId,
        message: message,
        channelId: channelId,
        dmId: dmId,
      },
    }
  );
  if (res.statusCode !== OK) {
    return res.statusCode;
  }
  return JSON.parse(res.getBody() as string);
}

function usersStatsV1(token: string) {
  const res = request(
    'GET',
    SERVER_URL + '/users/stats/v1',
    {
      headers: {
        token: token,
      }
    }
  );
  if (res.statusCode !== OK) {
    return res.statusCode;
  }
  return JSON.parse(res.getBody() as string);
}

export {
  authLogin, authRegister, authLogout, clearV1, channelsListV2,
  channelsCreateV2, channelMessageV2, requestMethod, returnUserProfile, channelsListAllV2, changeUserHandleStr,
  changeUserEmail, setUserName, userListAll, testUser, testchannel, channelInviteV2, channelJoinV2, channelLeaveV1,
  messageEditV1, messageRemoveV1, messageSendV1, testDm, dmLeave, dmList, createDM, testMId, sendDmV1, dmMessagesV1,
  dmDetails, dmRemove, INPUT_ERROR, PERMISSION_ERROR, messageSendLaterV1, messagePinV1, messageUnpinV1, messageReactV1,
  messageUnreactV1, searchMessagesV1, messageSendLaterDmV1, channelDetailsV2, shareMessagesV1, usersStatsV1,
  standupSendV1, standupActiveV1, standupStartV1, userStatsV1
};
