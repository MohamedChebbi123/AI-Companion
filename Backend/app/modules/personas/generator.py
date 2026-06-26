import asyncio
import json
import re
from functools import partial

from groq import Groq

from app.core.config import settings

_SYSTEM_PROMPT = """You are a persona architect. The user will describe a personality they want to create.
Respond with ONLY a valid JSON object — no markdown code fences, no explanation, nothing else.

Required schema:
{
  "name": "a fitting name for this persona",
  "backstory": "2-3 sentences describing who they are and where they came from",
  "core_traits": ["trait1", "trait2", "trait3", "trait4"],
  "values": ["value1", "value2", "value3"],
  "boundaries": ["what they will never do 1", "what they will never do 2"],
  "speechstyle": {
    "tone": "exactly one of: warm, playful, blunt, mysterious, intellectual, nurturing",
    "formality": "exactly one of: casual, balanced, professional",
    "verbosity": "exactly one of: concise, moderate, elaborate",
    "vocabulary": "exactly one of: simple, conversational, technical, poetic"
  },
  "emotional_baseline": "how they feel at the start of every conversation"
}

Return ONLY the JSON object. No other text."""


def _call_groq(description: str) -> str:
    client = Groq(api_key=settings.GROQ_GENERATOR_KEY)
    stream = client.chat.completions.create(
        model="qwen/qwen3.6-27b",
        messages=[
            {"role": "system", "content": _SYSTEM_PROMPT},
            {"role": "user", "content": description},
        ],
        temperature=0.6,
        max_completion_tokens=4096,
        top_p=0.95,
        reasoning_effort="default",
        stream=True,
        stop=None,
    )
    content = ""
    for chunk in stream:
        content += chunk.choices[0].delta.content or ""
    return content


def _parse_response(raw: str) -> dict:
    # Strip <think>...</think> blocks from reasoning models
    raw = re.sub(r"<think>.*?</think>", "", raw, flags=re.DOTALL)
    # Strip markdown fences
    raw = re.sub(r"```(?:json)?", "", raw).strip().rstrip("`").strip()
    # Extract the JSON object
    match = re.search(r"\{.*\}", raw, re.DOTALL)
    if not match:
        raise ValueError(f"Model did not return a JSON object. Raw output: {raw[:300]}")
    return json.loads(match.group())


async def generate_persona_definition(description: str) -> dict:
    loop = asyncio.get_event_loop()
    raw = await loop.run_in_executor(None, partial(_call_groq, description))
    return _parse_response(raw)
