import { pool } from './database.js'
import './dotenv.js'
import { fileURLToPath } from 'url'
import path, { dirname } from 'path'
import fs from 'fs'

const currentPath = fileURLToPath(import.meta.url)
const { users, posts, tags, post_tags, comments, upvotes } = JSON.parse(
  fs.readFileSync(path.join(dirname(currentPath), 'data/data.json'))
)

const setup = async () => {
  try {
    // Drop all tables in reverse dependency order
    await pool.query(`
      DROP TABLE IF EXISTS upvotes;
      DROP TABLE IF EXISTS post_tags;
      DROP TABLE IF EXISTS comments;
      DROP TABLE IF EXISTS posts;
      DROP TABLE IF EXISTS tags;
      DROP TABLE IF EXISTS users;
    `)
    console.log('🗑️  Tables dropped')

    // Create tables
    await pool.query(`
      CREATE TABLE users (
        id            serial PRIMARY KEY,
        username      text NOT NULL UNIQUE,
        email         text NOT NULL UNIQUE,
        password_hash text NOT NULL,
        created_at    timestamp DEFAULT now()
      );

      CREATE TABLE posts (
        id         serial PRIMARY KEY,
        title      text NOT NULL,
        content    text NOT NULL,
        user_id    integer NOT NULL REFERENCES users(id) ON DELETE CASCADE,
        created_at timestamp DEFAULT now()
      );

      CREATE TABLE comments (
        id         serial PRIMARY KEY,
        content    text NOT NULL,
        user_id    integer NOT NULL REFERENCES users(id) ON DELETE CASCADE,
        post_id    integer NOT NULL REFERENCES posts(id) ON DELETE CASCADE,
        parent_id  integer REFERENCES comments(id) ON DELETE CASCADE,
        created_at timestamp DEFAULT now()
      );

      CREATE TABLE tags (
        id   serial PRIMARY KEY,
        name text NOT NULL UNIQUE
      );

      CREATE TABLE post_tags (
        post_id integer NOT NULL REFERENCES posts(id) ON DELETE CASCADE,
        tag_id  integer NOT NULL REFERENCES tags(id) ON DELETE CASCADE,
        PRIMARY KEY (post_id, tag_id)
      );

      CREATE TABLE upvotes (
        post_id integer NOT NULL REFERENCES posts(id) ON DELETE CASCADE,
        user_id integer NOT NULL REFERENCES users(id) ON DELETE CASCADE,
        PRIMARY KEY (post_id, user_id)
      );
    `)
    console.log('✅ Tables created')

    // Seed users
    for (const user of users) {
      await pool.query(
        'INSERT INTO users (username, email, password_hash) VALUES ($1, $2, $3)',
        [user.username, user.email, user.password_hash]
      )
    }
    console.log('✅ Users seeded')

    // Seed posts
    for (const post of posts) {
      await pool.query(
        'INSERT INTO posts (title, content, user_id) VALUES ($1, $2, $3)',
        [post.title, post.content, post.user_id]
      )
    }
    console.log('✅ Posts seeded')

    // Seed tags
    for (const tag of tags) {
      await pool.query('INSERT INTO tags (name) VALUES ($1)', [tag.name])
    }
    console.log('✅ Tags seeded')

    // Seed post_tags
    for (const pt of post_tags) {
      await pool.query(
        'INSERT INTO post_tags (post_id, tag_id) VALUES ($1, $2)',
        [pt.post_id, pt.tag_id]
      )
    }
    console.log('✅ Post tags seeded')

    // Seed comments
    for (const comment of comments) {
      await pool.query(
        'INSERT INTO comments (content, user_id, post_id) VALUES ($1, $2, $3)',
        [comment.content, comment.user_id, comment.post_id]
      )
    }
    console.log('✅ Comments seeded')

    // Seed upvotes
    for (const upvote of upvotes) {
      await pool.query(
        'INSERT INTO upvotes (post_id, user_id) VALUES ($1, $2)',
        [upvote.post_id, upvote.user_id]
      )
    }
    console.log('✅ Upvotes seeded')

    console.log('🎉 Database reset complete')
  } catch (error) {
    console.error('⚠️ Error resetting database:', error)
  } finally {
    pool.end()
  }
}

setup()
