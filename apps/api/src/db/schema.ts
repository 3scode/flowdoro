import { pgTable, uuid, text, varchar, integer, boolean, smallint, timestamp, jsonb, index, uniqueIndex } from 'drizzle-orm/pg-core'
import { relations } from 'drizzle-orm'

export const users = pgTable('users', {
  id: uuid('id').primaryKey().defaultRandom(),
  email: varchar('email', { length: 255 }).notNull().unique(),
  passwordHash: text('password_hash'),
  name: varchar('name', { length: 120 }).notNull(),
  avatarUrl: text('avatar_url'),
  restRatio: smallint('rest_ratio').notNull().default(5),
  theme: varchar('theme', { length: 10 }).notNull().default('system'),
  notificationsEnabled: boolean('notifications_enabled').notNull().default(false),
  soundEnabled: boolean('sound_enabled').notNull().default(false),
  googleId: varchar('google_id', { length: 100 }).unique(),
  createdAt: timestamp('created_at', { withTimezone: true }).notNull().defaultNow(),
  updatedAt: timestamp('updated_at', { withTimezone: true }).notNull().defaultNow(),
  deletedAt: timestamp('deleted_at', { withTimezone: true }),
})

export const tasks = pgTable('tasks', {
  id: uuid('id').primaryKey().defaultRandom(),
  userId: uuid('user_id').notNull().references(() => users.id, { onDelete: 'cascade' }),
  name: varchar('name', { length: 120 }).notNull(),
  createdAt: timestamp('created_at', { withTimezone: true }).notNull().defaultNow(),
}, (t) => [index('tasks_user_id_idx').on(t.userId)])

export const sessions = pgTable('sessions', {
  id: uuid('id').primaryKey().defaultRandom(),
  userId: uuid('user_id').notNull().references(() => users.id, { onDelete: 'cascade' }),
  taskId: uuid('task_id').references(() => tasks.id, { onDelete: 'set null' }),
  status: varchar('status', { length: 20 }).notNull().default('active'),
  durationSeconds: integer('duration_seconds').notNull().default(0),
  restEarnedSeconds: integer('rest_earned_seconds').notNull().default(0),
  restTakenSeconds: integer('rest_taken_seconds').notNull().default(0),
  startedAt: timestamp('started_at', { withTimezone: true }).notNull(),
  endedAt: timestamp('ended_at', { withTimezone: true }),
  createdAt: timestamp('created_at', { withTimezone: true }).notNull().defaultNow(),
}, (t) => [
  index('sessions_user_id_idx').on(t.userId),
  index('sessions_user_started_idx').on(t.userId, t.startedAt),
  index('sessions_status_idx').on(t.status),
])

export const sessionEvents = pgTable('session_events', {
  id: uuid('id').primaryKey().defaultRandom(),
  sessionId: uuid('session_id').notNull().references(() => sessions.id, { onDelete: 'cascade' }),
  eventType: varchar('event_type', { length: 30 }).notNull(),
  timestamp: timestamp('timestamp', { withTimezone: true }).notNull(),
  payload: jsonb('payload'),
}, (t) => [index('session_events_session_id_idx').on(t.sessionId)])

// Relations
export const usersRelations = relations(users, ({ many }) => ({
  sessions: many(sessions),
  tasks: many(tasks),
}))

export const tasksRelations = relations(tasks, ({ one, many }) => ({
  user: one(users, { fields: [tasks.userId], references: [users.id] }),
  sessions: many(sessions),
}))

export const sessionsRelations = relations(sessions, ({ one, many }) => ({
  user: one(users, { fields: [sessions.userId], references: [users.id] }),
  task: one(tasks, { fields: [sessions.taskId], references: [tasks.id] }),
  events: many(sessionEvents),
}))

export const sessionEventsRelations = relations(sessionEvents, ({ one }) => ({
  session: one(sessions, { fields: [sessionEvents.sessionId], references: [sessions.id] }),
}))

export type User = typeof users.$inferSelect
export type NewUser = typeof users.$inferInsert
export type Session = typeof sessions.$inferSelect
export type NewSession = typeof sessions.$inferInsert
export type Task = typeof tasks.$inferSelect
export type SessionEvent = typeof sessionEvents.$inferSelect
