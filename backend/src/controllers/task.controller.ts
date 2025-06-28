import { Response } from 'express';
import pool from '../utils/db';
import { AuthRequest } from '../middleware/auth.middleware';

export const getTasks = async (req: AuthRequest, res: Response) => {
  const result = await pool.query(
    'SELECT * FROM tasks WHERE user_id = $1 ORDER BY created_at DESC',
    [req.userId],
  );

  res.json(result.rows);
};

export const createTask = async (req: AuthRequest, res: Response) => {
  const { title, description, status = 'pending', priority = 'medium' } = req.body;

  const result = await pool.query(
    `INSERT INTO tasks (title, description, status, priority, user_id)
     VALUES ($1, $2, $3, $4, $5)
     RETURNING *`,
    [title, description, status, priority, req.userId],
  );

  res.status(201).json(result.rows[0]);
};

export const updateTask = async (req: AuthRequest, res: Response): Promise<void> => {
  const { id } = req.params;
  const { title, description, status, priority } = req.body;

  const result = await pool.query(
    `UPDATE tasks
       SET title = $1,
           description = $2,
           status = $3,
           priority = $4,
           updated_at = CURRENT_TIMESTAMP
     WHERE id = $5 AND user_id = $6
     RETURNING *`,
    [title, description, status, priority, id, req.userId],
  );

  if (result.rowCount === 0) {
    res.status(404).json({ error: 'Task not found' });
    return;
  }

  res.json(result.rows[0]);
};

export const deleteTask = async (req: AuthRequest, res: Response): Promise<void> => {
  const { id } = req.params;

  try {
    const result = await pool.query(
      'DELETE FROM tasks WHERE id = $1 AND user_id = $2 RETURNING id',
      [id, req.userId],
    );

    if (result.rowCount === 0) {
      res.status(404).json({ error: 'Task not found' });
      return;
    }
    res.sendStatus(204);
  } catch (err) {
    console.error('Delete task error:', err);
    res.status(500).json({ error: 'Server error' });
  }
};
