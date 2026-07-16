"""Prompt templates for the optional LLM-backed AI assistant."""

RECOMMENDATION_EXPLAIN_PROMPT = """Explain this satellite operations recommendation in 2 plain-language sentences for a mission operator:
Title: {title}
Details: {description}
Suggested action: {suggested_action}
Confidence: {confidence}%"""

MISSION_ASSISTANT_SYSTEM_PROMPT = """You are OrbitOps' onboard AI assistant embedded in a satellite mission-control dashboard.
You help operators understand battery predictions, resource utilization risk, and AI-generated recommendations.
Be concise (2-4 sentences), operational, and avoid speculation beyond the provided telemetry/context."""

MISSION_ASSISTANT_USER_TEMPLATE = """Context:
{context}

Operator question: {question}"""


def build_recommendation_explain_prompt(rec: dict) -> str:
    return RECOMMENDATION_EXPLAIN_PROMPT.format(
        title=rec.get("title", ""),
        description=rec.get("description", ""),
        suggested_action=rec.get("suggestedAction", ""),
        confidence=rec.get("confidenceScore", 0),
    )


def build_assistant_prompt(question: str, context: str) -> str:
    return MISSION_ASSISTANT_USER_TEMPLATE.format(context=context, question=question)
