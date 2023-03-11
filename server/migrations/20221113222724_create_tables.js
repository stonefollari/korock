exports.up = async (knex) => {
  
  await knex.raw(`
    CREATE TABLE IF NOT EXISTS "Users" (
      "id" SERIAL PRIMARY KEY,
      "name" VARCHAR(255),
      "email" VARCHAR(255) NOT NULL,
      "phone" VARCHAR(255) NOT NULL DEFAULT '',
      "nickname" VARCHAR(255) NOT NULL DEFAULT '',
      "biography" VARCHAR(10000) NOT NULL DEFAULT '',
      "password" VARCHAR(255) NOT NULL,
      "salt" VARCHAR(255) NOT NULL,
      "active" BOOLEAN NOT NULL DEFAULT TRUE,
      "createdAt" TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
      "updatedAt" TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP
    );
  `)

  await knex.raw(`
    CREATE TABLE IF NOT EXISTS "Groups" (
      "id" SERIAL PRIMARY KEY,
      "name" VARCHAR(255) NOT NULL,
      "userId" INTEGER REFERENCES "Users" ("id"),
      "parentGroupId" INTEGER REFERENCES "Groups" ("id"),
      "displayName" VARCHAR(255),
      "details" VARCHAR(10000) NOT NULL DEFAULT '',
      "date" TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
      "active" BOOLEAN NOT NULL DEFAULT TRUE,
      "createdAt" TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
      "updatedAt" TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
      UNIQUE("name", "userId")
    );
  `)

  await knex.raw(`
    CREATE TABLE IF NOT EXISTS "Members" (
      "id" SERIAL PRIMARY KEY,
      "userId" INTEGER NOT NULL REFERENCES "Users" ("id") ON DELETE CASCADE,
      "groupId" INTEGER NOT NULL REFERENCES "Groups" ("id") ON DELETE CASCADE,
      "roleId" INTEGER NOT NULL,
      "confirmed" BOOLEAN NOT NULL DEFAULT FALSE,
      "token" VARCHAR(255),
      "email" VARCHAR(255),
      "invited" TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
      "joined" TIMESTAMP,
      "active" BOOLEAN NOT NULL DEFAULT TRUE,
      "createdAt" TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
      "updatedAt" TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
      UNIQUE("userId", "groupId", "roleId")
    );
  `)

  await knex.raw(`
    CREATE TABLE IF NOT EXISTS "Invites" (
      "id" SERIAL PRIMARY KEY,
      "email" VARCHAR NOT NULL,
      "groupId" INTEGER NOT NULL REFERENCES "Groups" ("id") ON DELETE CASCADE,
      "roleId" INTEGER NOT NULL,
      "token" VARCHAR(255) NOT NULL,
      "active" BOOLEAN NOT NULL DEFAULT TRUE,
      "createdAt" TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
      "updatedAt" TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP
    );
  `)

  await knex.raw(`
    CREATE TABLE IF NOT EXISTS "Modules" (
      "id" SERIAL PRIMARY KEY,
      "userId" INTEGER  NOT NULL REFERENCES "Users" ("id") ON DELETE CASCADE,
      "groupId" INTEGER  NOT NULL REFERENCES "Groups" ("id") ON DELETE CASCADE,
      "memberId" INTEGER  NOT NULL REFERENCES "Members" ("id") ON DELETE CASCADE,
      "name" VARCHAR(255) NOT NULL,
      "details" VARCHAR(10000),

      "day" TIMESTAMP,
      "time" TIMESTAMP,
      "index" INTEGER,
      "isResource" BOOLEAN,

      "active" BOOLEAN NOT NULL DEFAULT TRUE,
      "createdAt" TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
      "updatedAt" TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
      UNIQUE("name", "groupId")
    );
  `)

  await knex.raw(`
    CREATE TABLE IF NOT EXISTS "Blocks" (
      "id" SERIAL PRIMARY KEY,
      "userId" INTEGER  NOT NULL REFERENCES "Users" ("id") ON DELETE CASCADE,
      "groupId" INTEGER  NOT NULL REFERENCES "Groups" ("id") ON DELETE CASCADE,
      "memberId" INTEGER REFERENCES "Members" ("id") ON DELETE CASCADE,
      "name" VARCHAR(255) NOT NULL,
      "details" VARCHAR(10000),

      "meetingUrl" VARCHAR(2055),
      "videoUrl" VARCHAR(2055),
      "imageUrl" VARCHAR(2055),

      "date" TIMESTAMP,
      "index" INTEGER,
      "moduleId" INTEGER REFERENCES "Modules" ("id") ON DELETE CASCADE,
      "isPublic" BOOLEAN,
      "isResource" BOOLEAN,

      "allowSubmission" BOOLEAN,
      "allowComment" BOOLEAN,
      "allowAnonymous" BOOLEAN,

      "submissionDate" TIMESTAMP,

      "active" BOOLEAN NOT NULL DEFAULT TRUE,
      "createdAt" TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
      "updatedAt" TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
      UNIQUE("groupId")
    );
  `)

  await knex.raw(`
    CREATE TABLE IF NOT EXISTS "BlockMembers" (
      "id" SERIAL PRIMARY KEY,
      "userId" INTEGER NOT NULL REFERENCES "Users" ("id") ON DELETE CASCADE,
      "groupId" INTEGER NOT NULL REFERENCES "Groups" ("id") ON DELETE CASCADE,
      "blockId" INTEGER NOT NULL REFERENCES "Blocks" ("id") ON DELETE CASCADE,
      "active" BOOLEAN NOT NULL DEFAULT TRUE,
      "createdAt" TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
      "updatedAt" TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
      UNIQUE("userId", "groupId", "blockId")
    );
  `)

  await knex.raw(`
    CREATE TABLE IF NOT EXISTS "Submissions" (
      "id" SERIAL PRIMARY KEY,
      "userId" INTEGER  NOT NULL REFERENCES "Users" ("id") ON DELETE CASCADE,
      "memberId" INTEGER  NOT NULL REFERENCES "Members" ("id") ON DELETE CASCADE,
      "groupId" INTEGER  NOT NULL REFERENCES "Groups" ("id") ON DELETE CASCADE,
      "blockId" INTEGER  NOT NULL REFERENCES "Blocks" ("id") ON DELETE CASCADE,
      "name" VARCHAR(255),
      "data" TEXT,
      "dataType" VARCHAR(255),
      "active" BOOLEAN NOT NULL DEFAULT TRUE,
      "createdAt" TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
      "updatedAt" TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP
    );
  `)

  await knex.raw(`
    CREATE TABLE IF NOT EXISTS "Comments" (
      "id" SERIAL PRIMARY KEY,
      "userId" INTEGER  NOT NULL REFERENCES "Users" ("id") ON DELETE CASCADE,
      "memberId" INTEGER  NOT NULL REFERENCES "Members" ("id") ON DELETE CASCADE,
      "groupId" INTEGER  NOT NULL REFERENCES "Groups" ("id") ON DELETE CASCADE,
      "blockId" INTEGER  NOT NULL REFERENCES "Blocks" ("id") ON DELETE CASCADE,
      "submissionId" INTEGER  NOT NULL REFERENCES "Submissions" ("id") ON DELETE CASCADE,
      "replyId" INTEGER  REFERENCES "Comments" ("id") ON DELETE CASCADE,
      "name" VARCHAR(255),
      "message" TEXT,
      "messageType" VARCHAR(255),
      "anonymous" BOOLEAN,
      "active" BOOLEAN NOT NULL DEFAULT TRUE,
      "createdAt" TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
      "updatedAt" TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP
    );
  `)
}

exports.down = async (knex) => {
  await knex.raw('DROP TABLE IF EXISTS "Comments";')
  await knex.raw('DROP TABLE IF EXISTS "Submissions";')
  await knex.raw('DROP TABLE IF EXISTS "BlockMembers";')
  await knex.raw('DROP TABLE IF EXISTS "Blocks";')
  await knex.raw('DROP TABLE IF EXISTS "Modules";')
  await knex.raw('DROP TABLE IF EXISTS "Members";')
  await knex.raw('DROP TABLE IF EXISTS "Invites";')
  await knex.raw('DROP TABLE IF EXISTS "Groups";')
  await knex.raw('DROP TABLE IF EXISTS "Users";')
}
