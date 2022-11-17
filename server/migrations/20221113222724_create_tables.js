exports.up = async (knex) => {
  
  await knex.raw(`
    CREATE TABLE IF NOT EXISTS "Users" (
      "id" SERIAL PRIMARY KEY,
      "name" VARCHAR(255) NOT NULL,
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
      "parentGroup" INTEGER REFERENCES "Groups" ("id"),
      "name" VARCHAR(255) NOT NULL,
      "details" VARCHAR(10000) NOT NULL DEFAULT '',
      "active" BOOLEAN NOT NULL DEFAULT TRUE,
      "createdAt" TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
      "updatedAt" TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP
    );
  `)

  await knex.raw(`
    CREATE TABLE IF NOT EXISTS "Members" (
      "id" SERIAL PRIMARY KEY,
      "userId" INTEGER NOT NULL REFERENCES "Users" ("id") ON DELETE CASCADE,
      "groupId" INTEGER NOT NULL REFERENCES "Groups" ("id") ON DELETE CASCADE,
      "roleId" INTEGER NOT NULL,
      "active" BOOLEAN NOT NULL DEFAULT TRUE,
      "createdAt" TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
      "updatedAt" TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP
    );
  `)

  await knex.raw(`
    CREATE TABLE IF NOT EXISTS "Blocks" (
      "id" SERIAL PRIMARY KEY,
      "userId" INTEGER  NOT NULL REFERENCES "Users" ("id") ON DELETE CASCADE,
      "groupId" INTEGER  NOT NULL REFERENCES "Groups" ("id") ON DELETE CASCADE,
      "name" VARCHAR(255) NOT NULL,
      "details" VARCHAR(10000),
      "meetingUrl" VARCHAR(2055),
      "videoUrl" VARCHAR(2055),
      "imageUrl" VARCHAR(2055),
      "submission" BOOLEAN,
      "submissionDate" TIMESTAMP,
      "comments" BOOLEAN,
      "allowAnonymous" BOOLEAN,
      "active" BOOLEAN NOT NULL DEFAULT TRUE,
      "createdAt" TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
      "updatedAt" TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP
    );
  `)

  await knex.raw(`
    CREATE TABLE IF NOT EXISTS "Submissions" (
      "id" SERIAL PRIMARY KEY,
      "userId" INTEGER  NOT NULL REFERENCES "Users" ("id") ON DELETE CASCADE,
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
  await knex.raw('DROP TABLE IF EXISTS "Blocks";')
  await knex.raw('DROP TABLE IF EXISTS "Members";')
  await knex.raw('DROP TABLE IF EXISTS "Groups";')
  await knex.raw('DROP TABLE IF EXISTS "Users";')
}
