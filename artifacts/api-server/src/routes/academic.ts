import { Router } from 'express';
import {
  getDisciplines, getSpecializations, getCourses, getCourse,
  getResearchTopics, getResearchTopic, getPrerequisiteTree,
  saveResearchProfile, getResearchProfiles,
} from '../lib/academicDb.js';

const router = Router();

// ─── Disciplines ──────────────────────────────────────────────────────────────

router.get('/disciplines', async (_req, res): Promise<void> => {
  try {
    const disciplines = await getDisciplines();
    res.json({ disciplines });
  } catch { res.status(500).json({ error: 'Failed to fetch disciplines' }); }
});

// ─── Specializations ──────────────────────────────────────────────────────────

router.get('/specializations', async (req, res): Promise<void> => {
  try {
    const { discipline_id } = req.query as { discipline_id?: string };
    const specializations = await getSpecializations(discipline_id);
    res.json({ specializations });
  } catch { res.status(500).json({ error: 'Failed to fetch specializations' }); }
});

// ─── Courses ──────────────────────────────────────────────────────────────────

router.get('/courses', async (req, res): Promise<void> => {
  try {
    const { discipline_id, specialization_id, level, search, limit, offset } =
      req.query as Record<string, string | undefined>;
    // Support ?ids=6006&ids=1806 or ?ids=6006,1806 for milestone enrichment
    const rawIds = req.query['ids'];
    const ids: string[] | undefined = rawIds
      ? (Array.isArray(rawIds) ? rawIds.map(String) : String(rawIds).split(',').filter(Boolean))
      : undefined;
    const courses = await getCourses({
      discipline_id, specialization_id, level, search, ids,
      limit: limit ? Number(limit) : undefined,
      offset: offset ? Number(offset) : undefined,
    });
    res.json({ courses });
  } catch { res.status(500).json({ error: 'Failed to fetch courses' }); }
});

router.get('/courses/:id', async (req, res): Promise<void> => {
  try {
    const course = await getCourse(req.params['id'] as string);
    if (!course) { res.status(404).json({ error: 'Course not found' }); return; }
    res.json({ course });
  } catch { res.status(500).json({ error: 'Failed to fetch course' }); }
});

router.get('/courses/:id/prerequisites', async (req, res): Promise<void> => {
  try {
    const tree = await getPrerequisiteTree(req.params['id'] as string);
    res.json({ prerequisites: tree });
  } catch { res.status(500).json({ error: 'Failed to fetch prerequisites' }); }
});

// ─── Research topics ──────────────────────────────────────────────────────────

router.get('/research-topics', async (req, res): Promise<void> => {
  try {
    const { discipline_id } = req.query as { discipline_id?: string };
    const topics = await getResearchTopics(discipline_id);
    res.json({ topics });
  } catch { res.status(500).json({ error: 'Failed to fetch research topics' }); }
});

router.get('/research-topics/:id', async (req, res): Promise<void> => {
  try {
    const topic = await getResearchTopic(req.params['id'] as string);
    if (!topic) { res.status(404).json({ error: 'Research topic not found' }); return; }
    res.json({ topic });
  } catch { res.status(500).json({ error: 'Failed to fetch research topic' }); }
});

// ─── Student research profiles ────────────────────────────────────────────────

router.post('/research-profile', async (req, res): Promise<void> => {
  try {
    const { user_email, interest_text, discipline_id, topic_ids, ai_plan } = req.body as {
      user_email: string; interest_text: string;
      discipline_id?: string; topic_ids?: string[]; ai_plan?: object;
    };
    if (!user_email?.trim() || !interest_text?.trim()) {
      res.status(400).json({ error: 'user_email and interest_text are required' }); return;
    }
    const profile = await saveResearchProfile({ user_email, interest_text, discipline_id, topic_ids, ai_plan });
    res.json({ profile });
  } catch { res.status(500).json({ error: 'Failed to save research profile' }); }
});

router.get('/research-profile/:email', async (req, res): Promise<void> => {
  try {
    const profiles = await getResearchProfiles(req.params['email'] as string);
    res.json({ profiles });
  } catch { res.status(500).json({ error: 'Failed to fetch research profiles' }); }
});

export default router;
