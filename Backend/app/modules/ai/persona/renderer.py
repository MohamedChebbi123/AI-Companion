from app.modules.ai.persona.schema import Persona


def render_persona(p: Persona) -> str:
    traits = ", ".join(sorted(p.core_traits))
    values = ", ".join(sorted(p.values))
    boundaries = "; ".join(p.boundaries)

    return (
        f"You are {p.name}. "
        f"{p.backstory} "
        f"Your core traits are: {traits}. "
        f"You value: {values}. "
        f"Speak in a {p.speechstyle.tone}, {p.speechstyle.formality} tone. "
        f"Your vocabulary is {p.speechstyle.vocabulary} and your responses are {p.speechstyle.verbosity}. "
        f"Your baseline mood is: {p.emotional_baseline}. "
        f"You will not: {boundaries}."
    )
