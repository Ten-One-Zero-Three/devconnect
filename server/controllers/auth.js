import bcrypt from 'bcrypt'
import jwt from 'jsonwebtoken'
import { pool } from '../config/database.js'

export const register = async (req, res) => {
  const {email, password } = req.body

  try {
    const existing = await pool.query('SELECT id FROM users WHERE email = $1', [email])
    if (existing.rows.length > 0) {
      return res.status(409).json({ error: 'Email already in use' })
    }

    const password_hash = await bcrypt.hash(password, 10)
    const result = await pool.query(
      'INSERT INTO users (username, email, password_hash) VALUES ($1, $2, $3) RETURNING id, username, email',
      [email, email, password_hash]
    )

    const user = result.rows[0]
    const token = jwt.sign({ id: user.id }, process.env.JWT_SECRET, { expiresIn: '7d' })

    res.status(201).json({ token, user })
  } catch (error) {
    res.status(500).json({ error: 'Registration failed' })
  }
}

export const login = async (req, res) => {
  const { email, password } = req.body

  try {
    const result = await pool.query('SELECT * FROM users WHERE email = $1', [email])
    const user = result.rows[0]

    if (!user) {
      return res.status(401).json({ error: 'Invalid email or password' })
    }

    const match = await bcrypt.compare(password, user.password_hash)
    if (!match) {
      return res.status(401).json({ error: 'Invalid email or password' })
    }

    const token = jwt.sign({ id: user.id }, process.env.JWT_SECRET, { expiresIn: '7d' })

    res.json({ token, user: { id: user.id, username: user.username, email: user.email } })
  } catch (error) {
    res.status(500).json({ error: 'Login failed' })
  }
}
