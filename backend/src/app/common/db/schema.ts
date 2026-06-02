import { getTableColumns } from 'drizzle-orm';
import {
    pgTable,
    uuid,
    varchar,
    boolean,
    timestamp,
    pgEnum,
    text,
    jsonb,
    uniqueIndex
} from 'drizzle-orm/pg-core';

export const userRoleEnum = pgEnum('user_role', ['user', 'admin']);

export const usersTable = pgTable('users', {
    id: uuid('id').primaryKey().defaultRandom(),

    firstName: varchar('first_name', { length: 255 }).notNull(),
    lastName: varchar('last_name', { length: 255 }),

    email: varchar('email', { length: 255 }).notNull().unique(),
    emailVerified: boolean('email_verified').default(false).notNull(),

    password: varchar('password', { length: 255 }).notNull(),

    role: userRoleEnum('role').default('user').notNull(),

    refreshToken: text('refresh_token'),

    verificationToken: text('verification_token'),

    resetPasswordToken: text('reset_token'),
    resetPasswordExpiry: timestamp('reset_token_expiry', {
        withTimezone: true,
    }),

    createdAt: timestamp('created_at', { withTimezone: true })
        .defaultNow()
        .notNull(),
    updatedAt: timestamp('updated_at', { withTimezone: true }).$onUpdate(
        () => new Date(),
    ),
});

const { password, ...publicColumns } = getTableColumns(usersTable);
export const userPublicColumns = publicColumns;

export const applicationsTable = pgTable('applications', {
    id: uuid('id').primaryKey().defaultRandom(),

    name: varchar('name', { length: 255 }).notNull(),

    clientId: varchar('client_id', { length: 255 }).notNull().unique(),

    clientSecret: varchar('client_secret', { length: 255 }).notNull(),

    ownerId: uuid('owner_id')
        .references(() => usersTable.id, { onDelete: 'cascade' })
        .notNull(),

    redirectUris: text('redirect_uris').array().notNull(),

    isActive: boolean('is_active').default(true).notNull(),

    createdAt: timestamp('created_at', { withTimezone: true })
        .defaultNow()
        .notNull(),

    updatedAt: timestamp('updated_at', { withTimezone: true }).$onUpdate(
        () => new Date(),
    ),
});

export const authCodesTable = pgTable('auth_codes', {
    code: varchar('code', { length: 255 }).primaryKey(),

    userId: uuid('user_id')
        .references(() => usersTable.id, { onDelete: 'cascade' })
        .notNull(),

    clientId: varchar('client_id', { length: 255 }).notNull(),

    redirectUri: text('redirect_uri').notNull(),

    expiresAt: timestamp('expires_at', { withTimezone: true }).notNull(),

    createdAt: timestamp('created_at', { withTimezone: true })
        .defaultNow()
        .notNull(),
});

export const refreshTokensTable = pgTable('refresh_tokens', {
    id: uuid('id').primaryKey().defaultRandom(),

    token: text('token').notNull(),
    userId: uuid('user_id').notNull(),
    clientId: varchar('client_id', { length: 255 }).notNull(),

    expiresAt: timestamp('expires_at', { withTimezone: true }).notNull(),

    createdAt: timestamp('created_at', { withTimezone: true })
        .defaultNow()
        .notNull(),
});

export const userApplicationsTable = pgTable(
    'user_applications',
    {
        id: uuid('id').defaultRandom().primaryKey(),
        userId: uuid('user_id')
            .references(() => usersTable.id, { onDelete: 'cascade' })
            .notNull(),
        clientId: varchar('client_id')
            .references(() => applicationsTable.clientId, {
                onDelete: 'cascade',
            })
            .notNull(),
        firstAuthorizedAt: timestamp('first_authorized_at')
            .defaultNow()
            .notNull(),
    },
    (table) => ({
        userAppIdx: uniqueIndex('user_app_idx').on(
            table.userId,
            table.clientId,
        ),
    }),
);

export const authLogsTable = pgTable('auth_logs', {
    id: uuid('id').defaultRandom().primaryKey(),
    clientId: varchar('client_id')
        .references(() => applicationsTable.clientId, { onDelete: 'cascade' })
        .notNull(),
    action: varchar('action', { length: 50 }).notNull(),
    status: varchar('status', { length: 20 }).notNull(),
    createdAt: timestamp('created_at').defaultNow().notNull(),
    metadata: jsonb('metadata'),
});
