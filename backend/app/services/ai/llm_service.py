"""
Optional LLM integration for the AI Recommendation Assistant.

This is intentionally decoupled from the core recommendation engine
(recommendation_engine.py), which is fully rule + ML-model based and works
with zero external dependencies. If ANTHROPIC_API_KEY (or OPENAI_API_KEY)
is set in the environment, this module can be used to turn structured
recommendations into conversational explanations, or to power a simple
chat-style "Ask about missions" assistant.

Usage:
    from app.services.ai.llm_service import get_completion
    text = get_completion("Explain why battery is low on SatelliteFive")
"""
import os
import logging

logger = logging.getLogger(__name__)

ANTHROPIC_API_KEY = os.getenv("ANTHROPIC_API_KEY", "")
OPENAI_API_KEY = os.getenv("OPENAI_API_KEY", "")


def _get_anthropic_client():
    import anthropic  # pip install anthropic
    return anthropic.Anthropic(api_key=ANTHROPIC_API_KEY)


def get_completion(prompt: str, system: str = None, max_tokens: int = 300) -> str:
    """Return a short natural-language completion for `prompt`.

    Raises RuntimeError if no provider is configured; callers (e.g.
    recommendation_engine.explain_with_llm) should catch this and fall
    back to their rule-based description instead.
    """
    if ANTHROPIC_API_KEY:
        client = _get_anthropic_client()
        response = client.messages.create(
            model="claude-sonnet-4-6",
            max_tokens=max_tokens,
            system=system or (
                "You are a satellite mission-control assistant. Be concise, "
                "factual, and operational."
            ),
            messages=[{"role": "user", "content": prompt}],
        )
        return "".join(block.text for block in response.content if block.type == "text")

    raise RuntimeError(
        "No LLM provider configured. Set ANTHROPIC_API_KEY in backend/.env "
        "to enable natural-language recommendation explanations and the "
        "chat assistant. The rest of the app (predictions, dashboards, "
        "rule-based recommendations) works fine without it."
    )
