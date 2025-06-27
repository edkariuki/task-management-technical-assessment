import { Request, Response } from 'express';
import bcrypt from 'bcrypt';
import pool from '../utils/db';
import jwt from 'jsonwebtoken';
import { AuthRequest } from '../middleware/auth.middleware';

export const registerUser = async (req: Request, res: Response) => {
  const { email, password, name } = req.body;

  if (!email || !password || !name) {
    return res.status(400).json({ error: 'All fields are required' });
  }

  try {
    const existing = await pool.query('SELECT * FROM users WHERE email = $1', [email]);
    if (existing.rows.length > 0) {
      return res.status(409).json({ error: 'User already exists' });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const result = await pool.query(
      `INSERT INTO users (email, password, name)
       VALUES ($1, $2, $3) RETURNING id, email, name, created_at`,
      [email, hashedPassword, name],
    );

    return res.status(201).json(result.rows[0]);
  } catch (err) {
    console.error('Registration error:', err);
    return res.status(500).json({ error: 'Server error' });
  }
};

export const loginUser = async (req: Request, res: Response) => {
  const { email, password } = req.body;

  if (!email || !password) {
    return res.status(400).json({ error: 'Email and password required' });
  }

  try {
    const result = await pool.query('SELECT * FROM users WHERE email = $1', [email]);
    const user = result.rows[0];

    if (!user) {
      return res.status(401).json({ error: 'Invalid credentials' });
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(401).json({ error: 'Invalid credentials' });
    }

    const token = jwt.sign({ userId: user.id }, process.env.JWT_SECRET as string, {
      expiresIn: 60 * 60 * 24,
    });

    return res.json({
      token,
      user: {
        id: user.id,
        email: user.email,
        name: user.name,
      },
    });
  } catch (err) {
    console.error('Login error:', err);
    return res.status(500).json({ error: 'Server error' });
  }
};

export const getProfile = async (req: AuthRequest, res: Response) => {
  const { userId } = req;
  if (!userId) return res.sendStatus(401);

  try {
    const result = await pool.query('SELECT id, email, name, created_at FROM users WHERE id = $1', [
      userId,
    ]);
    if (result.rowCount === 0) return res.sendStatus(404);

    return res.json(result.rows[0]);
  } catch (err) {
    console.error('Profile error:', err);
    return res.status(500).json({ error: 'Server error' });
  }
};
