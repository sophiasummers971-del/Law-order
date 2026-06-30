import { Router } from 'express'
import { query } from '../utils/database'
import { requireRole } from '../middleware/setUserContext'

const router = Router()

router.use(requireRole('admin'))

// GET /api/admin/stats
router.get('/stats', async (req, res) => {
  try {
    const casesResult = await query(
      "SELECT status, COUNT(*) as count FROM cases GROUP BY status"
    )
    const usersResult = await query('SELECT COUNT(*) as total FROM users')
    const activeAgents = await query(
      "SELECT COUNT(*) as total FROM agent_tasks WHERE status = 'researching'"
    )
    const recentCases = await query(
      "SELECT COUNT(*) as total FROM cases WHERE created_at > NOW() - INTERVAL '24 hours'"
    )

    res.json({
      caseBreakdown: casesResult.rows,
      totalUsers: parseInt(usersResult.rows[0].total),
      activeAgents: parseInt(activeAgents.rows[0].total),
      casesLast24h: parseInt(recentCases.rows[0].total),
    })
  } catch (err) {
    res.status(500).json({ error: 'Failed to get stats' })
  }
})

// GET /api/admin/audit-log
router.get('/audit-log', async (req: any, res) => {
  try {
    const limit = parseInt(req.query.limit as string) || 100
    const offset = parseInt(req.query.offset as string) || 0

    const result = await query(
      `SELECT a.*, u.email as user_email 
       FROM audit_log a 
       LEFT JOIN users u ON a.user_id = u.id 
       ORDER BY a.timestamp DESC 
       LIMIT $1 OFFSET $2`,
      [limit, offset]
    )

    res.json(result.rows)
  } catch (err) {
    res.status(500).json({ error: 'Failed to get audit log' })
  }
})

export { router as adminRouter }
