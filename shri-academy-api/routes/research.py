"""
Research mentor routes — AI-powered academic path generator.
Uses OpenAI to map a student's research interest to an ordered
learning path drawn from the MIT OCW database.
"""

from __future__ import annotations
import os
import json
import asyncio
from typing import Any
from fastapi import APIRouter, HTTPException
from pydantic import BaseModel
import httpx

router = APIRouter()

API_SERVER = os.getenv("API_SERVER_URL", "http://localhost:3000")
OPENAI_KEY = os.getenv("OPENAI_API_KEY", "")

# ─── Request / Response models ───────────────────────────────────────────────

class MentorRequest(BaseModel):
    interest: str          # free-text: "I want to research quantum error correction"
    user_email: str | None = None
    background: str | None = None  # optional: "I know calculus and basic Python"

class LearningMilestone(BaseModel):
    phase: int
    title: str
    duration_weeks: str
    courses: list[dict]
    goals: list[str]
    deliverable: str

class ResearchPlan(BaseModel):
    research_title: str
    summary: str
    discipline: str
    specialization: str
    difficulty: int
    estimated_months: int
    milestones: list[LearningMilestone]
    open_problems: list[str]
    next_step: str

# ─── Helpers ─────────────────────────────────────────────────────────────────

async def fetch_academic_context() -> dict[str, Any]:
    """Fetch disciplines, research topics, and a sample of courses from api-server."""
    async with httpx.AsyncClient(timeout=10) as client:
        discs_r, topics_r = await asyncio.gather(
            client.get(f"{API_SERVER}/api/academic/disciplines"),
            client.get(f"{API_SERVER}/api/academic/research-topics"),
        )
    disciplines = discs_r.json().get("disciplines", []) if discs_r.status_code == 200 else []
    topics      = topics_r.json().get("topics", []) if topics_r.status_code == 200 else []
    return {"disciplines": disciplines, "topics": topics}


async def fetch_courses_for_topic(topic_id: str) -> list[dict]:
    async with httpx.AsyncClient(timeout=10) as client:
        r = await client.get(f"{API_SERVER}/api/academic/research-topics/{topic_id}")
    if r.status_code != 200:
        return []
    return r.json().get("topic", {}).get("courses", [])


# ─── Main mentor endpoint ─────────────────────────────────────────────────────

@router.post("/mentor")
async def research_mentor(req: MentorRequest):
    if not req.interest.strip():
        raise HTTPException(status_code=400, detail="interest is required")

    # 1. Pull academic context from the DB
    try:
        context = await fetch_academic_context()
    except Exception:
        context = {"disciplines": [], "topics": []}

    disciplines_summary = "\n".join(
        f"- {d['name']} ({d['id']}): {d.get('description','')[:80]}"
        for d in context["disciplines"]
    )
    topics_summary = "\n".join(
        f"- [{t['id']}] {t['title']} ({t.get('discipline_name','')}) — {t.get('description','')[:100]}"
        for t in context["topics"]
    )

    background_clause = f"\nStudent background: {req.background}" if req.background else ""

    system_prompt = """You are an expert academic research advisor at a top university. 
Your job is to create a precise, actionable, personalised research mentorship plan.

You have access to MIT OpenCourseWare courses organised into disciplines and research topics.
You will:
1. Identify the most relevant research area from the student's interest
2. Map a sequenced learning path of OCW courses (with correct prerequisites)
3. Define clear milestones with specific deliverables
4. Surface real open research questions the student could tackle
5. Recommend the concrete next step for TODAY

Be honest about difficulty. Be specific — name exact course numbers, exact papers, exact techniques.
Return ONLY valid JSON matching the exact schema provided. No markdown, no extra text."""

    user_prompt = f"""Student research interest: "{req.interest}"{background_clause}

Available disciplines:
{disciplines_summary}

Available research topics:
{topics_summary}

Return a JSON object with this EXACT schema:
{{
  "research_title": "Short descriptive title for this research path",
  "summary": "2-3 sentence explanation of why this is exciting and tractable",
  "discipline": "discipline name",
  "specialization": "specialization name",
  "closest_topic_id": "one of the topic IDs above, or null",
  "difficulty": 1-5,
  "estimated_months": 6-36,
  "milestones": [
    {{
      "phase": 1,
      "title": "Phase title",
      "duration_weeks": "e.g. 8 weeks",
      "course_ids": ["list of OCW course IDs like 6006, 1806 from the database"],
      "goals": ["specific skill or knowledge to gain"],
      "deliverable": "concrete output: reproduce a paper, build a prototype, write a literature review"
    }}
  ],
  "open_problems": ["3-5 actual open research questions in this area"],
  "key_papers": ["2-3 seminal papers with authors and year"],
  "next_step": "One sentence: what should the student do TODAY to begin?"
}}

Use 3-5 milestones. Keep course_ids to real MIT OCW course IDs from our database (6006, 6046, 1806, 804, etc).
Milestone 1 should cover foundations. Last milestone should involve original research contribution."""

    if not OPENAI_KEY:
        raise HTTPException(status_code=503, detail="OpenAI API key not configured")

    # 2. Call OpenAI
    try:
        async with httpx.AsyncClient(timeout=60) as client:
            response = await client.post(
                "https://api.openai.com/v1/chat/completions",
                headers={"Authorization": f"Bearer {OPENAI_KEY}", "Content-Type": "application/json"},
                json={
                    "model": "gpt-4o",
                    "messages": [
                        {"role": "system", "content": system_prompt},
                        {"role": "user", "content": user_prompt},
                    ],
                    "temperature": 0.3,
                    "response_format": {"type": "json_object"},
                    "max_tokens": 2500,
                }
            )
        response.raise_for_status()
        raw = response.json()["choices"][0]["message"]["content"]
        plan_data = json.loads(raw)
    except httpx.HTTPError as e:
        raise HTTPException(status_code=502, detail=f"OpenAI request failed: {str(e)}")
    except json.JSONDecodeError:
        raise HTTPException(status_code=502, detail="AI returned invalid JSON")

    # 3. Enrich milestones with full course records from DB
    enriched_milestones = []
    known_course_ids = {"6042","6006","6046","6854","18404","6034","6036","6867","6s897",
                        "6004","6033","6824","6828","6858","6875","6830","6035",
                        "1801","1802","1803","1806","18100","18701","1805","1865","18335",
                        "801","802","804","805","8333","701","703","7091","901","940","9641",
                        "1401","1430","5111","560","6002","6003"}

    for ms in plan_data.get("milestones", []):
        raw_ids = ms.get("course_ids", [])
        valid_ids = [cid for cid in raw_ids if str(cid) in known_course_ids]
        courses_detail = []
        if valid_ids:
            try:
                async with httpx.AsyncClient(timeout=10) as client:
                    params = "&".join(f"ids={cid}" for cid in valid_ids)
                    r = await client.get(f"{API_SERVER}/api/academic/courses?{params}")
                if r.status_code == 200:
                    courses_detail = r.json().get("courses", [])
            except Exception:
                pass
        enriched_milestones.append({
            "phase": ms.get("phase", len(enriched_milestones) + 1),
            "title": ms.get("title", ""),
            "duration_weeks": ms.get("duration_weeks", ""),
            "courses": courses_detail,
            "course_ids_requested": valid_ids,
            "goals": ms.get("goals", []),
            "deliverable": ms.get("deliverable", ""),
        })

    # 4. Optionally save the profile
    topic_id = plan_data.get("closest_topic_id")
    if req.user_email:
        try:
            async with httpx.AsyncClient(timeout=10) as client:
                await client.post(
                    f"{API_SERVER}/api/academic/research-profile",
                    json={
                        "user_email": req.user_email,
                        "interest_text": req.interest,
                        "topic_ids": [topic_id] if topic_id else [],
                        "ai_plan": plan_data,
                    }
                )
        except Exception:
            pass  # non-fatal

    return {
        "plan": {
            **plan_data,
            "milestones": enriched_milestones,
        }
    }


# ─── Quick course/topic search endpoint ───────────────────────────────────────

@router.get("/search")
async def search_academic(q: str = "", discipline: str = ""):
    params: list[str] = []
    if q:         params.append(f"search={q}")
    if discipline:params.append(f"discipline_id={discipline}")
    query = "&".join(params)
    async with httpx.AsyncClient(timeout=10) as client:
        r = await client.get(f"{API_SERVER}/api/academic/courses?{query}&limit=20")
    if r.status_code != 200:
        raise HTTPException(status_code=r.status_code, detail="Database query failed")
    return r.json()


