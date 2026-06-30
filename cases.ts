import { Router } from 'express'
import { z } from 'zod'
import { query } from '../utils/database'
import { logger } from '../utils/logger'

const router = Router()

const createCaseSchema = z.object({
  title: z.string().min(1),
  facts: z.string().optional(),
  offenceType: z.string().optional(),
  jurisdiction: z.string().optional(),
  priority: z.enum(['low', 'normal', 'high', 'urgent']).default('normal'),
})

// GET /api/cases - List user's cases
router.get('/', async (req: any, res) => {
  try {
    const result = await query(
      'SELECT id, title, status, progress, priority, offence_type, jurisdiction, created_at, updated_at FROM cases WHERE user_id = $1 ORDER BY created_at DESC',
      [req.user.userId]
    )
    res.json(result.rows)
  } catch (err) {
    logger.error('Failed to list cases', { error: err, userId: req.user.userId })
    res.status(500).json({ error: 'Failed to retrieve cases' })
  }
})

// POST /api/cases - Create new operation
router.post('/', async (req: any, res) => {
  try {
    const data = createCaseSchema.parse(req.body)

    const result = await query(
      `INSERT INTO cases (user_id, title, facts, offence_type, jurisdiction, priority, status)
       VALUES ($1, $2, $3, $4, $5, $6, 'pending')
       RETURNING *`,
      [req.user.userId, data.title, data.facts || null, data.offenceType || null, data.jurisdiction || null, data.priority]
    )

    const caseId = result.rows[0].id
    const agents = [
      'statute_hunter', 'case_law_miner', 'defence_architect', 'precedent_matcher',
      'jurisdiction_scout', 'procedural_checker', 'sentencing_advisor', 'appeal_strategist'
    ]

    for (const agent of agents) {
      await query(
        'INSERT INTO agent_tasks (case_id, agent_type, status) VALUES ($1, $2, $3)',
        [caseId, agent, 'waiting']
      )
    }

    // Simulate starting research after delay
    setTimeout(async () => {
      await query("UPDATE cases SET status = 'researching' WHERE id = $1", [caseId])
      await query(
        "UPDATE agent_tasks SET status = 'researching', started_at = NOW() WHERE case_id = $1 AND status = 'waiting'",
        [caseId]
      )
    }, 2000)

    logger.info('Case created', { caseId, userId: req.user.userId })
    res.status(201).json(result.rows[0])
  } catch (err) {
    if (err instanceof z.ZodError) {
      return res.status(400).json({ error: 'Invalid input', details: err.errors })
    }
    logger.error('Failed to create case', { error: err, userId: req.user.userId })
    res.status(500).json({ error: 'Failed to create case' })
  }
})

// GET /api/cases/:id - Get case with agents
router.get('/:id', async (req: any, res) => {
  try {
    const caseResult = await query(
      'SELECT * FROM cases WHERE id = $1 AND user_id = $2',
      [req.params.id, req.user.userId]
    )

    if (caseResult.rows.length === 0) {
      return res.status(404).json({ error: 'Operation not found' })
    }

    const agentsResult = await query(
      'SELECT * FROM agent_tasks WHERE case_id = $1 ORDER BY created_at',
      [req.params.id]
    )

    const docsResult = await query(
      'SELECT id, original_name, file_size, mime_type, uploaded_at FROM documents WHERE case_id = $1',
      [req.params.id]
    )

    res.json({
      ...caseResult.rows[0],
      agents: agentsResult.rows,
      documents: docsResult.rows,
    })
  } catch (err) {
    logger.error('Failed to get case', { error: err, caseId: req.params.id })
    res.status(500).json({ error: 'Failed to retrieve case' })
  }
})

// GET /api/cases/:id/status - Real-time status
router.get('/:id/status', async (req: any, res) => {
  try {
    const caseResult = await query(
      'SELECT status, progress FROM cases WHERE id = $1 AND user_id = $2',
      [req.params.id, req.user.userId]
    )

    if (caseResult.rows.length === 0) {
      return res.status(404).json({ error: 'Operation not found' })
    }

    const agentsResult = await query(
      'SELECT agent_type, status, progress, findings FROM agent_tasks WHERE case_id = $1',
      [req.params.id]
    )

    res.json({
      status: caseResult.rows[0].status,
      progress: caseResult.rows[0].progress,
      agents: agentsResult.rows,
    })
  } catch (err) {
    res.status(500).json({ error: 'Failed to get status' })
  }
})

// GET /api/cases/:id/brief - Get final brief
router.get('/:id/brief', async (req: any, res) => {
  try {
    const result = await query(
      'SELECT brief, confidence_score, win_probability FROM cases WHERE id = $1 AND user_id = $2',
      [req.params.id, req.user.userId]
    )

    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Operation not found' })
    }

    res.json(result.rows[0])
  } catch (err) {
    res.status(500).json({ error: 'Failed to retrieve brief' })
  }
})

export { router as casesRouter }
