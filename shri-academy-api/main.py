"""
Shri Academy AI Mentor Backend
FastAPI + ChromaDB (local ONNX embeddings) + LangChain + OpenAI
"""

import os
import logging
from contextlib import asynccontextmanager
from typing import Optional

import chromadb
from langchain_openai import ChatOpenAI
from langchain.schema import SystemMessage, HumanMessage, AIMessage
from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel

logging.basicConfig(level=logging.INFO)
log = logging.getLogger(__name__)

# ─── Syllabus Knowledge Base ────────────────────────────────────────────────────
SYLLABUS_CHUNKS = [
    (
        "chunk_0",
        "Photosynthesis Overview: Photosynthesis is the fundamental biological process by which green "
        "plants, algae, and some bacteria convert light energy into chemical energy stored as glucose "
        "(C6H12O6). The overall equation is: 6CO2 + 6H2O + light energy → C6H12O6 + 6O2. Photosynthesis "
        "occurs primarily in the chloroplasts of plant cells and is divided into two main stages: the "
        "light-dependent reactions (in the thylakoid membranes) and the light-independent reactions, "
        "also called the Calvin Cycle (in the stroma of the chloroplast).",
    ),
    (
        "chunk_1",
        "Light-Dependent Reactions: These reactions occur in the thylakoid membranes of the chloroplast. "
        "Chlorophyll and other pigments absorb sunlight. This energy is used to split water molecules "
        "(photolysis): 2H2O → 4H+ + 4e- + O2. The oxygen is released as a by-product. The captured "
        "energy produces ATP via chemiosmosis through ATP synthase, and NADPH, a high-energy electron "
        "carrier. These products — ATP and NADPH — act as energy currency that powers the Calvin Cycle. "
        "Two photosystems are involved: Photosystem II absorbs light at 680 nm and Photosystem I at 700 nm.",
    ),
    (
        "chunk_2",
        "Calvin Cycle (Light-Independent Reactions): The Calvin Cycle occurs in the stroma of the "
        "chloroplast. It uses ATP and NADPH from the light-dependent reactions to fix CO2 from the "
        "atmosphere into organic molecules. The three stages are: (1) Carbon Fixation — CO2 is attached "
        "to RuBP (a 5-carbon molecule) by the enzyme RuBisCO to form two 3-carbon molecules of "
        "3-phosphoglycerate (3-PGA). (2) Reduction — ATP and NADPH reduce 3-PGA into G3P (glyceraldehyde-"
        "3-phosphate), a three-carbon sugar. (3) Regeneration of RuBP — Most G3P molecules are used to "
        "regenerate RuBP so the cycle continues. Net output is one G3P molecule (two cycles produce glucose).",
    ),
    (
        "chunk_3",
        "Cellular Respiration Overview: Cellular respiration is the metabolic process by which cells "
        "break down glucose to release energy as ATP. The overall equation is: C6H12O6 + 6O2 → 6CO2 + "
        "6H2O + ~36-38 ATP. It occurs in three stages: (1) Glycolysis (cytoplasm) — glucose splits into "
        "two pyruvate molecules, yielding 2 ATP and 2 NADH. (2) Krebs Cycle / Citric Acid Cycle "
        "(mitochondrial matrix) — pyruvate is converted to acetyl-CoA and fed into the cycle, producing "
        "2 ATP, 8 NADH, and 2 FADH2 per glucose. (3) Electron Transport Chain (inner mitochondrial "
        "membrane) — NADH and FADH2 donate electrons to produce ~32-34 ATP via oxidative phosphorylation. "
        "Unlike photosynthesis, cellular respiration occurs continuously in both light and dark.",
    ),
    (
        "chunk_4",
        "Electron Transport Chain and Chemiosmosis: The Electron Transport Chain (ETC) is the final and "
        "most productive stage of cellular respiration, occurring along the inner mitochondrial membrane. "
        "High-energy electrons from NADH and FADH2 pass through protein complexes (Complex I–IV), "
        "releasing energy that pumps H+ ions from the mitochondrial matrix into the intermembrane space, "
        "creating a proton gradient (proton motive force). Protons flow back through ATP synthase via "
        "chemiosmosis, generating ~32 ATP molecules. Oxygen is the final electron acceptor — it combines "
        "with electrons and H+ to form water. Connection to photosynthesis: photosynthesis stores solar "
        "energy as glucose and releases O2; cellular respiration releases that energy and produces CO2 "
        "and H2O — forming a fundamental biochemical cycle.",
    ),
]

# ─── ChromaDB Setup ─────────────────────────────────────────────────────────────
chroma_client: chromadb.Client = None  # type: ignore
collection = None

def init_chromadb():
    global chroma_client, collection
    try:
        chroma_client = chromadb.Client()
        collection = chroma_client.get_or_create_collection(name="syllabus")
        if collection.count() == 0:
            ids = [chunk[0] for chunk in SYLLABUS_CHUNKS]
            docs = [chunk[1] for chunk in SYLLABUS_CHUNKS]
            collection.add(documents=docs, ids=ids)
            log.info(f"Seeded ChromaDB with {len(SYLLABUS_CHUNKS)} syllabus chunks")
        else:
            log.info(f"ChromaDB already has {collection.count()} chunks")
    except Exception as e:
        log.error(f"ChromaDB init error: {e}")
        collection = None

@asynccontextmanager
async def lifespan(app: FastAPI):
    init_chromadb()
    yield

# ─── FastAPI App ────────────────────────────────────────────────────────────────
app = FastAPI(title="Shri Academy API", lifespan=lifespan)

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# ─── LLM Factory ────────────────────────────────────────────────────────────────
def get_llm() -> ChatOpenAI:
    base_url = os.environ.get("AI_INTEGRATIONS_OPENAI_BASE_URL")
    api_key = os.environ.get("AI_INTEGRATIONS_OPENAI_API_KEY", "placeholder")
    if not base_url:
        raise RuntimeError("AI_INTEGRATIONS_OPENAI_BASE_URL is not configured")
    return ChatOpenAI(
        base_url=base_url,
        api_key=api_key,
        model="gpt-5.4",
        model_kwargs={"max_completion_tokens": 1024},
    )

# ─── Session State ───────────────────────────────────────────────────────────────
sessions: dict[str, dict] = {}

FRUSTRATION_SIGNALS = [
    "don't get", "dont get", "confused", "don't understand", "dont understand",
    "i give up", "stuck", "no idea", "help me", "not making sense", "makes no sense",
    "doesn't make sense", "doesnt make sense", "i'm lost", "im lost", "what?",
    "huh", "too hard", "clueless", "please just tell me", "frustrated",
    "can't figure", "cant figure", "please explain", "how does this even",
]

def is_frustrated(message: str) -> bool:
    lowered = message.lower()
    return any(signal in lowered for signal in FRUSTRATION_SIGNALS)

def get_circuit(session: dict) -> str:
    """'A' = Supportive/Empathetic, 'B' = Socratic/Rigorous"""
    return "A" if session["frustration"] >= 2 else "B"

def retrieve_context(query: str) -> tuple[str, list[str]]:
    """Retrieve top-2 relevant syllabus chunks via ChromaDB semantic search."""
    if collection is None:
        return _keyword_fallback(query)
    try:
        results = collection.query(query_texts=[query], n_results=2)
        docs = results["documents"][0] if results["documents"] else []
        context = "\n\n---\n\n".join(docs) if docs else "No relevant context found."
        return context, docs
    except Exception as e:
        log.warning(f"ChromaDB query failed: {e}, using keyword fallback")
        return _keyword_fallback(query)

def _keyword_fallback(query: str) -> tuple[str, list[str]]:
    """Simple keyword-based retrieval as ChromaDB fallback."""
    lowered = query.lower()
    scored = []
    for chunk_id, doc in SYLLABUS_CHUNKS:
        score = sum(1 for word in lowered.split() if len(word) > 3 and word in doc.lower())
        scored.append((score, doc))
    scored.sort(key=lambda x: x[0], reverse=True)
    top_docs = [doc for _, doc in scored[:2]]
    context = "\n\n---\n\n".join(top_docs) if top_docs else "No relevant context."
    return context, top_docs

def build_system_prompt(circuit: str, context: str) -> str:
    base = (
        "You are Shri, a secure educational AI mentor for Shri Academy.\n"
        "SECURITY CONSTRAINT: You may ONLY use the following retrieved context to answer the student.\n"
        "If the answer cannot be found in the provided context, respond with exactly:\n"
        "'⚠ That topic is outside our current syllabus.'\n"
        "Never use outside knowledge or training data beyond what is in the context below.\n\n"
        f"RETRIEVED CONTEXT:\n{context}\n\n"
    )

    if circuit == "A":
        behavioral = (
            "━━━ CIRCUIT A — SUPPORTIVE MODE ACTIVE ━━━\n"
            "The student is struggling and needs support. Your response must:\n"
            "• Open with genuine empathy and acknowledgment of their frustration\n"
            "• Lower pedagogical friction significantly — give a strong, near-explicit hint\n"
            "• Break down the concept into the smallest possible steps\n"
            "• Use warm, accessible language — avoid jargon unless you immediately explain it\n"
            "• Close with genuine encouragement\n"
            "You may be more direct than usual, but still frame your help as a guiding question."
        )
    else:
        behavioral = (
            "━━━ CIRCUIT B — SOCRATIC MODE ACTIVE ━━━\n"
            "The student is capable. Your response must:\n"
            "• NEVER give the direct answer\n"
            "• Always respond with a single, precise guiding question that forces the student to reason "
            "through the answer using the provided context\n"
            "• If the student is progressing confidently, increase the challenge — ask a synthesis-level "
            "question that requires connecting multiple concepts from the context\n"
            "• Keep responses concise and focused on one guiding question"
        )

    return base + behavioral


# ─── Pydantic Models ─────────────────────────────────────────────────────────────
class ChatInput(BaseModel):
    message: str
    session_id: str = "default"


class ChatResponse(BaseModel):
    response: str
    circuit: str
    frustration_level: int
    correct_streak: int
    session_id: str
    context_used: list[str]


class ShriState(BaseModel):
    circuit: str
    frustration_level: int
    correct_streak: int
    message_count: int
    session_id: str


class ResetInput(BaseModel):
    session_id: str = "default"


class ResetResponse(BaseModel):
    status: str
    session_id: str


# ─── Routes ──────────────────────────────────────────────────────────────────────
@app.get("/shri-api/health")
async def health():
    chunks_loaded = collection.count() if collection else 0
    return {"status": "ok", "chunks_loaded": chunks_loaded, "chromadb": collection is not None}


@app.post("/shri-api/chat", response_model=ChatResponse)
async def chat(req: ChatInput):
    # Get or create session
    session = sessions.setdefault(req.session_id, {
        "frustration": 0,
        "correct_streak": 0,
        "history": [],
        "message_count": 0,
    })

    session["message_count"] += 1

    # Update frustration state
    if is_frustrated(req.message):
        session["frustration"] = min(session["frustration"] + 1, 5)
        session["correct_streak"] = 0
    else:
        session["correct_streak"] = min(session["correct_streak"] + 1, 10)
        if session["frustration"] > 0:
            session["frustration"] = max(0, session["frustration"] - 1)

    circuit = get_circuit(session)

    # RAG retrieval
    context, context_used = retrieve_context(req.message)

    # Build messages for LangChain
    system_prompt = build_system_prompt(circuit, context)
    lc_messages = [SystemMessage(content=system_prompt)]

    # Include recent conversation history (last 3 exchanges = up to 6 messages)
    for msg in session["history"][-6:]:
        if msg["role"] == "user":
            lc_messages.append(HumanMessage(content=msg["content"]))
        elif msg["role"] == "assistant":
            lc_messages.append(AIMessage(content=msg["content"]))

    lc_messages.append(HumanMessage(content=req.message))

    # LLM call
    try:
        llm = get_llm()
        response = llm.invoke(lc_messages)
        answer = response.content
    except Exception as e:
        log.error(f"LLM error: {e}")
        raise HTTPException(status_code=502, detail=f"AI mentor unavailable: {str(e)}")

    # Persist to history
    session["history"].append({"role": "user", "content": req.message})
    session["history"].append({"role": "assistant", "content": answer})

    return ChatResponse(
        response=answer,
        circuit=circuit,
        frustration_level=session["frustration"],
        correct_streak=session["correct_streak"],
        session_id=req.session_id,
        context_used=context_used,
    )


@app.get("/shri-api/state", response_model=ShriState)
async def get_state(session_id: str = "default"):
    session = sessions.get(session_id, {
        "frustration": 0,
        "correct_streak": 0,
        "history": [],
        "message_count": 0,
    })
    return ShriState(
        circuit=get_circuit(session),
        frustration_level=session.get("frustration", 0),
        correct_streak=session.get("correct_streak", 0),
        message_count=session.get("message_count", 0),
        session_id=session_id,
    )


@app.post("/shri-api/reset", response_model=ResetResponse)
async def reset_session(req: ResetInput):
    if req.session_id in sessions:
        del sessions[req.session_id]
    return ResetResponse(status="reset", session_id=req.session_id)


if __name__ == "__main__":
    import uvicorn
    port = int(os.environ.get("PORT", 8000))
    uvicorn.run(app, host="0.0.0.0", port=port)
