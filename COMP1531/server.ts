import express, { json, Request, Response } from 'express';
import { echo } from './echo';
import morgan from 'morgan';
import config from './config.json';
import cors from 'cors';
import errorHandler from 'middleware-http-errors';

import fs from 'fs';
import { authLoginV1, authRegisterV1, authlogoutV1, resetPasswordRequest, authPasswordReset, setResetCode } from './auth';
import { channelMessagesV1, channelInviteV1, channelDetailsV1, channelJoinV1, addOwnerV1, removerOwnerV1, detail, channelLeaveV1, standupStartV1, standupActiveV1, standupSendV1 } from './channel';
import { getData, setData, dataStore } from './dataStore';
import { createDM, dmList, dmLeave, dmMessages, dmDetails, dmRemove } from './dm';
import { messageEdit, messagePin, messageRemove, messageSend, messageUnpin, sendDm, messageReact, messageUnreact, searchMessages, messageShare } from './message';
import { userProfileV1, SetNameUserV1, setEmailUserV1, setHandleStrUserV1, listAllUsersV1, changeUserPermission, adminRemoveUser, getUsersStats, userStats } from './users';
import { channelsCreateV1, channelsListV1, channelsListAllV1 } from './channels';
import {
  clearV1, error
} from './other';

// Set up web app
const app = express();
// Use middleware that allows us to access the JSON body of requests
app.use(json());
// Use middleware that allows for access from other domains
app.use(cors());

const PORT: number = parseInt(process.env.PORT || config.port);
const HOST: string = process.env.IP || 'localhost';

const initialiseData = () => {
  let data = getData();
  if (fs.existsSync('./database.json')) {
    const dbstr = fs.readFileSync('./database.json');
    data = JSON.parse(String(dbstr));
  }
  return data;
};

const savetoFile = (data: dataStore) => {
  setData(data);
  const jsonStr = JSON.stringify(data);
  fs.writeFileSync('./database.json', jsonStr);
};

// Example get request
app.get('/echo', (req: Request, res: Response, next) => {
  try {
    const data = req.query.echo as string;
    return res.json(echo(data));
  } catch (err) {
    next(err);
  }
});

app.post('/auth/login/v3', (req: Request, res: Response, next) => {
  try {
    const { email, password } = req.body;
    const result = authLoginV1(email, password);
    return res.json(result);
  } catch (err) {
    next(err);
  }
});

app.post('/auth/register/v3', (req: Request, res: Response, next) => {
  try {
    const { email, password, nameFirst, nameLast } = req.body;
    const result = authRegisterV1(email, password, nameFirst, nameLast);
    return res.json(result);
  } catch (err) {
    next(err);
  }
});

app.post('/auth/logout/v2', (req: Request, res: Response, next) => {
  try {
    const token = req.header('token');
    const result = authlogoutV1(token);
    return res.json(result);
  } catch (err) {
    next(err);
  }
});

app.get('/users/all/v2', (req: Request, res: Response, next) => {
  try {
    const token = req.header('token');
    const result = listAllUsersV1(token);
    return res.json(result);
  } catch (err) {
    next(err);
  }
});

app.put('/user/profile/setname/v2', (req: Request, res: Response, next) => {
  try {
    const token = req.header('token');
    const { nameFirst, nameLast } = req.body;
    const result = SetNameUserV1(token, nameFirst, nameLast);
    return res.json(result);
  } catch (err) {
    next(err);
  }
});

app.put('/user/profile/setemail/v2', (req: Request, res: Response, next) => {
  try {
    const token = req.header('token');
    const { email } = req.body;
    const result = setEmailUserV1(token, email);
    return res.json(result);
  } catch (err) {
    next(err);
  }
});

app.put('/user/profile/sethandle/v2', (req: Request, res: Response, next) => {
  try {
    const token = req.header('token');
    const { handleStr } = req.body;
    const result = setHandleStrUserV1(token, handleStr);
    return res.json(result);
  } catch (err) {
    next(err);
  }
});

app.get('/user/profile/v3', (req: Request, res: Response, next) => {
  try {
    const token = req.header('token');
    const uId = parseInt(req.query.uId as string);
    return res.json(userProfileV1(token, uId));
  } catch (err) {
    next(err);
  }
});

app.delete('/clear/v1', (req: Request, res: Response) => {
  const data: dataStore = clearV1();
  savetoFile(data);
  return res.json({});
});

app.post('/channels/create/v3', (req: Request, res: Response, next) => {
  try {
    const token = req.header('token');
    const { name, isPublic } = req.body;
    const result = channelsCreateV1(token, name, isPublic);
    return res.json(result);
  } catch (err) {
    next(err);
  }
});

app.get('/channels/list/v3', (req: Request, res: Response, next) => {
  try {
    const token = req.header('token');
    const result = channelsListV1(token);
    return res.json(result);
  } catch (err) {
    next(err);
  }
});

app.get('/channels/listAll/v3', (req: Request, res: Response, next) => {
  try {
    const token = req.header('token');
    const result = channelsListAllV1(token);
    return res.json(result);
  } catch (err) {
    next(err);
  }
});

app.post('/channel/addowner/v2', (req: Request, res: Response, next) => {
  try {
    const { channelId, uId } = req.body;
    const token = req.header('token');
    const result = addOwnerV1(token, channelId, uId);
    return res.json(result);
  } catch (err) {
    next(err);
  }
});

app.post('/channel/removeowner/v2', (req: Request, res: Response, next) => {
  try {
    const { channelId, uId } = req.body;
    const token = req.header('token');
    const result = removerOwnerV1(token, channelId, uId);
    return res.json(result);
  } catch (err) {
    next(err);
  }
});

app.get('/channel/details/v3', (req: Request, res: Response, next) => {
  try {
    const token = req.header('token');
    console.log(token);
    const channelId = req.query.channelId as string;
    const chanid = parseInt(channelId);

    const detail: detail | error = channelDetailsV1(token, chanid);
    return res.json(detail);
  } catch (err) {
    next(err);
  }
});

app.post('/channel/join/v3', (req: Request, res: Response, next) => {
  try {
    const token = req.header('token');
    const { channelId } = req.body;
    const chanid = parseInt(channelId);
    const joined = channelJoinV1(token, chanid);
    return res.json(joined);
  } catch (err) {
    next(err);
  }
});

app.post('/channel/leave/v2', (req: Request, res: Response, next) => {
  try {
    const token = req.header('token');
    const { channelId } = req.body;
    const chanid = parseInt(channelId);

    const left = channelLeaveV1(token, chanid);
    return res.json(left);
  } catch (err) {
    next(err);
  }
});

app.post('/channel/invite/v3', (req: Request, res: Response, next) => {
  try {
    const token = req.header('token');
    const { channelId, uId } = req.body;
    const uid = parseInt(uId);
    const chanid = parseInt(channelId);
    const invite = channelInviteV1(token, chanid, uid);
    return res.json(invite);
  } catch (err) {
    next(err);
  }
});

app.get('/channel/messages/v3', (req: Request, res: Response, next) => {
  try {
  // const token = req.query.token as string;
    const token = req.header('token');
    const channelId = parseInt(req.query.channelId as string);
    const start = parseInt(req.query.start as string);

    return res.json(channelMessagesV1(token, channelId, start));
  } catch (err) {
    next(err);
  }
});

app.post('/message/send/v2', (req: Request, res: Response, next) => {
  try {
    const token = req.header('token');
    const { channelId, message } = req.body;
    return res.json(messageSend(token, channelId, message));
  } catch (err) {
    next(err);
  }
});

app.put('/message/edit/v2', (req: Request, res: Response, next) => {
  try {
    const token = req.header('token');
    const { messageId, message } = req.body;
    return res.json(messageEdit(token, messageId, message));
  } catch (err) {
    next(err);
  }
});

app.delete('/message/remove/v2', (req: Request, res: Response, next) => {
  try {
    return res.json(messageRemove(req.header('token'), parseInt(req.query.messageId as string)));
  } catch (err) {
    next(err);
  }
});

app.post('/dm/create/v2', (req: Request, res: Response, next) => {
  try {
    const token = req.header('token');
    const { uIds } = req.body;
    return res.json(createDM(token, uIds));
  } catch (err) {
    next(err);
  }
});

app.get('/dm/list/v2', (req: Request, res: Response, next) => {
  try {
    const token = req.header('token');
    const result = dmList(token);
    return res.json(result);
  } catch (err) {
    next(err);
  }
});

app.get('/dm/details/v2', (req: Request, res: Response) => {
  const token = req.header('token');
  const dmId = parseInt(req.query.dmId as string);

  return res.json(dmDetails(token, dmId));
});

app.delete('/dm/remove/v1', (req: Request, res: Response) => {
  const token = req.header('token');
  const dmId = parseInt(req.query.dmId as string);

  return res.json(dmRemove(token, dmId));
});

app.post('/dm/leave/v2', (req: Request, res: Response, next) => {
  try {
    const token = req.header('token');
    const { dmId } = req.body;
    return res.json(dmLeave(token, dmId));
  } catch (err) {
    next(err);
  }
});

app.get('/dm/messages/v2', (req: Request, res: Response, next) => {
  try {
    const token = req.header('token');
    const dmId = parseInt(req.query.dmId as string);
    const start = parseInt(req.query.start as string);
    return res.json(dmMessages(token, dmId, start));
  } catch (err) {
    next(err);
  }
});

app.post('/message/senddm/v2', (req: Request, res: Response, next) => {
  try {
    const token = req.header('token');
    const { dmId, message } = req.body;
    return res.json(sendDm(token, dmId, message));
  } catch (err) {
    next(err);
  }
});

app.post('/auth/passwordreset/request/v1', (req: Request, res: Response) => {
  const { email } = req.body;
  const result = resetPasswordRequest(email);
  return res.json(result);
});

app.post('/auth/passwordreset/reset/v1', (req: Request, res: Response, next) => {
  try {
    const { resetCode, newPassword } = req.body;
    const result = authPasswordReset(resetCode, newPassword);
    return res.json(result);
  } catch (err) {
    next(err);
  }
});

app.post('/auth/force/resetCode', (req: Request, res: Response) => {
  const { uId } = req.body;
  const result = setResetCode(uId);
  return res.json(result);
});

app.delete('/admin/user/remove/v1', (req: Request, res: Response, next) => {
  try {
    const token = req.header('token');
    const uId = parseInt(req.query.uId as string);
    const result = adminRemoveUser(token, uId);
    return res.json(result);
  } catch (err) {
    next(err);
  }
});

app.post('/admin/userpermission/change/v1', (req: Request, res: Response, next) => {
  try {
    const { uId, permissionId } = req.body;
    const token = req.header('token');
    const result = changeUserPermission(token, uId, permissionId);
    return res.json(result);
  } catch (err) {
    next(err);
  }
});

app.post('/message/sendlater/v1', (req: Request, res: Response, next) => {
  try {
    const token = req.header('token');
    const { channelId, message, timeSent } = req.body;
    return res.json(messageSend(token, channelId, message, timeSent));
  } catch (err) {
    next(err);
  }
});

app.post('/message/sendlaterdm/v1', (req: Request, res: Response, next) => {
  try {
    const token = req.header('token');
    const { dmId, message, timeSent } = req.body;
    return res.json(sendDm(token, dmId, message, timeSent));
  } catch (err) {
    next(err);
  }
});

app.post('/message/pin/v1', (req: Request, res: Response, next) => {
  try {
    const token = req.header('token');
    return res.json(messagePin(token, req.body.messageId));
  } catch (err) {
    next(err);
  }
});

app.post('/message/unpin/v1', (req: Request, res: Response, next) => {
  try {
    const token = req.header('token');
    return res.json(messageUnpin(token, req.body.messageId));
  } catch (err) {
    next(err);
  }
});

app.post('/message/react/v1', (req: Request, res: Response, next) => {
  try {
    const token = req.header('token');
    const { messageId, reactId } = req.body;
    return res.json(messageReact(token, messageId, reactId));
  } catch (err) {
    next(err);
  }
});

app.post('/message/unreact/v1', (req: Request, res: Response, next) => {
  try {
    const token = req.header('token');
    const { messageId, reactId } = req.body;
    return res.json(messageUnreact(token, messageId, reactId));
  } catch (err) {
    next(err);
  }
});

app.get('/user/stats/v1', (req: Request, res: Response, next) => {
  try {
    const token = req.header('token');
    return res.json(userStats(token));
  } catch (err) {
    next(err);
  }
});

app.get('/search/v1', (req: Request, res: Response, next) => {
  try {
    const token = req.header('token');
    const queryStr = req.query.queryStr as string;
    return res.json(searchMessages(token, queryStr));
  } catch (err) {
    next(err);
  }
});

app.post('/message/share/v1', (req: Request, res: Response, next) => {
  try {
    const token = req.header('token');
    const { ogMessageId, message, channelId, dmId } = req.body;
    return res.json(messageShare(token, ogMessageId, message, channelId, dmId));
  } catch (err) {
    next(err);
  }
});
app.post('/standup/start/v1', (req: Request, res: Response, next) => {
  try {
    const token = req.header('token');
    const { channelId, length } = req.body;
    return res.json(standupStartV1(token, channelId, length));
  } catch (err) {
    next(err);
  }
});

app.get('/standup/active/v1', (req: Request, res: Response, next) => {
  try {
    const token = req.header('token');
    const channelId = parseInt(req.query.channelId as string);
    return res.json(standupActiveV1(token, channelId));
  } catch (err) {
    next(err);
  }
});

app.post('/standup/send/v1', (req: Request, res: Response, next) => {
  try {
    const token = req.header('token');
    const { channelId, message } = req.body;
    return res.json(standupSendV1(token, channelId, message));
  } catch (err) {
    next(err);
  }
});

app.get('/users/stats/v1', (req: Request, res: Response, next) => {
  try {
    const token = req.header('token');
    return res.json(getUsersStats(token));
  } catch (err) {
    next(err);
  }
});

// for logging errors (print to terminal)
app.use(morgan('dev'));

// handles errors nicely
app.use(errorHandler());

// start server
const server = app.listen(PORT, HOST, () => {
  // DO NOT CHANGE THIS LINE
  console.log(`⚡️ Server listening on port ${PORT} at ${HOST}`);
});

// For coverage, handle Ctrl+C gracefully
process.on('SIGINT', () => {
  server.close(() => console.log('Shutting down server gracefully.'));
});

export { initialiseData, savetoFile };
