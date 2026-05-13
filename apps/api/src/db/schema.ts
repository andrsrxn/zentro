import { createId } from '@paralleldrive/cuid2'
import { AUTH, type AuthProvider } from '@zentro/constants/auth'
import type { CountryCode, TimeZone } from '@zentro/constants/countries'
import type { NoteBackgroundColor } from '@zentro/constants/notes'
import { USERS, type UserRole, type UserState } from '@zentro/constants/users'
import { relations } from 'drizzle-orm'
import { index, pgEnum, pgTable, timestamp, varchar } from 'drizzle-orm/pg-core'

// Enums
const authProviderList = Object.values(AUTH.providers) as [AuthProvider, ...AuthProvider[]]
export const authProviderEnum = pgEnum('auth_provider', authProviderList)

const userStateList = Object.values(USERS.state) as [UserState, ...UserState[]]
export const userStateEnum = pgEnum('user_state', userStateList)

const userRoleList = Object.values(USERS.role) as [UserRole, ...UserRole[]]
export const userRoleEnum = pgEnum('user_role', userRoleList)

// Common columns
const timestampConfig = { withTimezone: true, precision: 3, mode: 'date' } as const
const createdAt = timestamp(timestampConfig).defaultNow().notNull()
const updatedAt = timestamp(timestampConfig)
  .$onUpdateFn(() => new Date())
  .defaultNow()
  .notNull()
// const consecutiveId = integer().generatedAlwaysAsIdentity().notNull()
export const generateUniqueId = () =>
  varchar('id', { length: 256 })
    .$defaultFn(() => createId())
    .notNull()

// Tables
export const users = pgTable('users', t => ({
  id: generateUniqueId(),
  name: t.text('full_name').notNull(),
  email: t.text().notNull().unique(),
  emailVerified: t.boolean().default(false).notNull(),
  image: t.text(),
  countryCode: t.text().$type<CountryCode>(),
  timeZone: t.text().$type<TimeZone>().default('UTC'),
  createdAt,
  updatedAt,
}))

export const sessions = pgTable(
  'sessions',
  t => ({
    id: generateUniqueId(),
    expiresAt: t.timestamp(timestampConfig).notNull(),
    token: t.text().notNull().unique(),
    ipAddress: t.text(),
    userAgent: t.text(),
    userId: t
      .text()
      .notNull()
      .references(() => users.id, { onDelete: 'cascade' }),
    createdAt,
    updatedAt,
  }),
  table => [index('sessions_userId_idx').on(table.userId)]
)

export const accounts = pgTable(
  'accounts',
  t => ({
    id: generateUniqueId(),
    accountId: t.text().notNull(),
    providerId: t.text().notNull(),
    userId: t
      .text()
      .notNull()
      .references(() => users.id, { onDelete: 'cascade' }),
    accessToken: t.text(),
    refreshToken: t.text(),
    idToken: t.text(),
    accessTokenExpiresAt: t.timestamp(),
    refreshTokenExpiresAt: t.timestamp(),
    scope: t.text(),
    password: t.text(),
    createdAt,
    updatedAt,
  }),
  table => [index('accounts_userId_idx').on(table.userId)]
)

export const verifications = pgTable(
  'verifications',
  t => ({
    id: generateUniqueId(),
    identifier: t.text().notNull(),
    value: t.text().notNull(),
    expiresAt: t.timestamp().notNull(),
    createdAt,
    updatedAt,
  }),
  table => [index('verifications_identifier_idx').on(table.identifier)]
)

export const notes = pgTable('notes', t => ({
  id: generateUniqueId(),
  title: t.varchar({ length: 100 }).notNull(),
  content: t.text(),
  color: t.varchar({ length: 7 }).$type<NoteBackgroundColor>().notNull(),
  positionX: t.integer().default(0).notNull(),
  positionY: t.integer().default(0).notNull(),
  userId: t
    .text()
    .notNull()
    .references(() => users.id, { onDelete: 'cascade' }),
  createdAt,
  updatedAt,
}))

export const usersRelations = relations(users, ({ many }) => ({
  sessions: many(sessions),
  accounts: many(accounts),
  notes: many(notes),
}))

export const sessionsRelations = relations(sessions, ({ one }) => ({
  users: one(users, {
    fields: [sessions.userId],
    references: [users.id],
  }),
}))

export const accountsRelations = relations(accounts, ({ one }) => ({
  users: one(users, {
    fields: [accounts.userId],
    references: [users.id],
  }),
}))

export const notesRelations = relations(notes, ({ one }) => ({
  users: one(users, {
    fields: [notes.userId],
    references: [users.id],
  }),
}))

// export const users = pgTable(
//   'users',
//   t => ({
//     id: consecutiveId,
//     userId: uniqueId.primaryKey(),
//     firstName: t.varchar({ length: 50 }).notNull(),
//     lastName: t.varchar({ length: 50 }),
//     email: t.varchar({ length: 256 }).unique().notNull(),
//     password: t.text(),
//     authProvider: authProviderEnum().$type<AuthProvider>().notNull(),
//     avatarUrl: t.text(),
//     countryCode: t.varchar({ length: 2 }),
//     timeZone: t.varchar({ length: 50 }).notNull().default('UTC'),
//     lastSignInAt: t.timestamp(timestampConfig).notNull(),
//     state: userStateEnum().$type<UserState>().default(USERS.state.active).notNull(),
//     role: userRoleEnum().$type<UserRole>().default(USERS.role.user).notNull(),
//     createdAt,
//     updatedAt,
//   }),
//   table => [
//     check(
//       'password_and_provider_check',
//       sql`(${table.authProvider} = 'local' AND ${table.password} IS NOT NULL) OR (${table.authProvider} != 'local' AND ${table.password} IS NULL)`
//     ),
//   ]
// )

// export const notes = pgTable('notes', t => ({
//   id: consecutiveId,
//   noteId: uniqueId.primaryKey(),
//   title: t.text().notNull(),
//   content: t.text().notNull(),
//   userId: t.varchar({ length: 256 }).references(() => users.userId, {
//     onDelete: 'cascade',
//   }),
//   createdAt,
//   updatedAt,
// }))

// // Relations
// export const userRelations = relations(users, ({ many }) => ({
//   notes: many(notes),
// }))

// export const notesRelations = relations(notes, ({ one }) => ({
//   user: one(users, {
//     fields: [notes.userId],
//     references: [users.userId],
//   }),
// }))
