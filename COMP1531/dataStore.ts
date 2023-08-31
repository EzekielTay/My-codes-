// YOU SHOULD MODIFY THIS OBJECT BELOW

export interface react {
  reactId: number
  uIds: number[]
  isThisUserReacted?: boolean
}

export interface message {
  messageId: number
  uId: number
  message: string
  timeSent: number
  isPinned: boolean
  reacts: react[]
}

export interface userStats {
  channelsJoined: {numChannelsJoined: number, timeStamp: number}[],
  dmsJoined: {numDmsJoined: number, timeStamp: number}[],
  messagesSent: {numMessagesSent: number, timeStamp: number}[],
  involvementRate: number
}
export interface user {
  userId: number
  nameFirst?: string
  nameLast?: string
  email?: string
  password?: string
  handle?: string
  member_of_ch?: number[]
  admin_of_ch?: number[]
  global_permission?: number // 1 or 2
  token?: string
  resetCode?: string
  userStats?: userStats
}

export interface channel {
  channelId: number
  name: string
  messages: message[]
  isPublic: boolean
  memberIds: user[]
  adminIds: user[]
  idsOfMembers: number[]
  isstandup: boolean
  standupfinish: number
  standupbuffer: string[]
}

export interface notifications {
  channelId: number
  dmId: number
  notificationMessage: string
}

export interface dm {
  creator: string
  membersId: number[]
  dmId: number
  dmName: string[]
  messages?: message[]
}

export interface workspaceStats {
  channelsExists: { numChannelsExists: number, timeStamp: number }[],
  dmsExists: { numDmsExists: number, timeStamp: number }[],
  messagesExists: { numMessagesExists: number, timeStamp: number }[],
  UtilizationRate: number,
}

export interface dataStore {
  users?: user[]
  channels?: channel[]
  loginUsers?: user[]
  messageCounter?: number
  dms?: dm[]
  globalOwnerCount?: number
  messageBuffer?: message[]
  workspaceStats?: workspaceStats[]
}

let data: dataStore = {
  users: [],
  channels: [],
  loginUsers: [],
  messageCounter: 0,
  dms: [],
  globalOwnerCount: 0,
  messageBuffer: [],
  workspaceStats: [],
};

// YOU SHOULDNT NEED TO MODIFY THE FUNCTIONS BELOW IN ITERATION 1

/*
Example usage
    let store = getData()
    console.log(store) # Prints { 'names': ['Hayden', 'Tam', 'Rani', 'Giuliana', 'Rando'] }

    names = store.names

    names.pop()
    names.push('Jake')

    console.log(store) # Prints { 'names': ['Hayden', 'Tam', 'Rani', 'Giuliana', 'Jake'] }
    setData(store)
*/

// Use get() to access the data
function getData() {
  return data;
}

// Use set(newData) to pass in the entire data object, with modifications made
function setData(newData: dataStore) {
  data = newData;
}

export { getData, setData };
