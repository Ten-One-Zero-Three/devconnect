import { describe, it, expect, vi, beforeEach } from 'vitest'

// Mock database and bcrypt/jwt before importing controller
vi.mock('../config/database.js', () => ({
  pool: { query: vi.fn() }
}))

vi.mock('bcrypt', () => ({
  default: {
    hash: vi.fn().mockResolvedValue('hashed_password'),
    compare: vi.fn()
  }
}))

vi.mock('jsonwebtoken', () => ({
  default: {
    sign: vi.fn().mockReturnValue('mock_token')
  }
}))

vi.mock('../config/dotenv.js', () => ({}))

const { pool } = await import('../config/database.js')
const { register, login } = await import('../controllers/auth.js')

const mockRes = () => {
  const res = {}
  res.status = vi.fn().mockReturnValue(res)
  res.json = vi.fn().mockReturnValue(res)
  return res
}

beforeEach(() => vi.clearAllMocks())

describe('register', () => {
  it('returns 409 if email already exists', async () => {
    pool.query.mockResolvedValueOnce({ rows: [{ id: 1 }] })

    const req = { body: { email: 'test@test.com', password: '123456' } }
    const res = mockRes()

    await register(req, res)

    expect(res.status).toHaveBeenCalledWith(409)
    expect(res.json).toHaveBeenCalledWith({ error: 'Email already in use' })
  })

  it('creates user and returns token on success', async () => {
    pool.query
      .mockResolvedValueOnce({ rows: [] })
      .mockResolvedValueOnce({ rows: [{ id: 1, username: 'test@test.com', email: 'test@test.com' }] })

    const req = { body: { email: 'test@test.com', password: '123456' } }
    const res = mockRes()

    await register(req, res)

    expect(res.status).toHaveBeenCalledWith(201)
    expect(res.json).toHaveBeenCalledWith({
      token: 'mock_token',
      user: { id: 1, username: 'test@test.com', email: 'test@test.com' }
    })
  })

  it('returns 500 if database throws', async () => {
    pool.query.mockRejectedValueOnce(new Error('DB error'))

    const req = { body: { email: 'test@test.com', password: '123456' } }
    const res = mockRes()

    await register(req, res)

    expect(res.status).toHaveBeenCalledWith(500)
    expect(res.json).toHaveBeenCalledWith({ error: 'Registration failed' })
  })
})
