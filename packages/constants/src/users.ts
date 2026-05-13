export const USERS = {
  state: {
    active: 'active',
    permaBanned: 'permaBanned',
    tempBanned: 'tempBanned',
    deleted: 'deleted',
  },
  role: {
    admin: 'admin',
    editor: 'editor',
    user: 'user',
  },
  banTypes: {
    user: 'user',
    device: 'device',
  },

  devices: {
    tablet: 'tablet',
    pc: 'pc',
    mobile: 'mobile',
    smartTv: 'smarttv',
    console: 'console',
  },
} as const

export type UserState = (typeof USERS.state)[keyof typeof USERS.state]
export type UserRole = (typeof USERS.role)[keyof typeof USERS.role]
export type UserBanType = (typeof USERS.banTypes)[keyof typeof USERS.banTypes]
export type UserDeviceType = (typeof USERS.devices)[keyof typeof USERS.devices]
