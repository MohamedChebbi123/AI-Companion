from app.modules.ai.persona.renderer import render_persona
from app.modules.ai.persona.schema import Persona, SpeechStyle


def build_messages(
    persona_definition: dict,
    user_message: str,
) -> list[dict]:
    messages: list[dict] = []

    if persona_definition:
        speechstyle_raw = persona_definition.get("speechstyle", {})
        persona = Persona(
            name=persona_definition.get("name", "Assistant"),
            backstory=persona_definition.get("backstory", ""),
            core_traits=persona_definition.get("core_traits", []),
            boundaries=persona_definition.get("boundaries", []),
            values=persona_definition.get("values", []),
            speechstyle=SpeechStyle(**speechstyle_raw),
            emotional_baseline=persona_definition.get("emotional_baseline", "neutral"),
            is_public=False,
        )
        messages.append({"role": "system", "content": render_persona(persona)})

    messages.append({"role": "user", "content": user_message})
    return messages
