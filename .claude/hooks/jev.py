#!/usr/bin/env python3
"""JEV hooks for Claude Code.

  jev.py retry  (PostToolUseFailure): if the same error shows up twice in a
                row, tell Claude to consult the advisor before trying again.
  jev.py route  (UserPromptSubmit):   suggest which read-only helper subagent
                (search / grep / docs) fits the prompt.

JEV is called through OpenRouter. The key is never read here: the cloud
environment's network secret adds the Authorization header to requests to
openrouter.ai. Any failure exits silently so a hook can never block work.
"""
import json
import os
import sys
import tempfile
import urllib.request

URL = "https://openrouter.ai/api/alpha/decisions"
MODEL = "~typesafe/jev-latest"
SAME_ERROR_MIN = 0.80   # noul at or above this = "same error"
ROUTE_MIN = 0.60        # probability needed to suggest a helper
MAX_CHARS = 1500


def ask(state, questions):
    body = json.dumps({"model": MODEL, "state": state, "questions": questions}).encode()
    req = urllib.request.Request(URL, body, {"Content-Type": "application/json"})
    key = os.environ.get("OPENROUTER_API_KEY")
    if key:  # optional: local use outside the cloud environment
        req.add_header("Authorization", "Bearer " + key)
    with urllib.request.urlopen(req, timeout=8) as r:
        return json.load(r)["answers"]


def emit(event, text):
    print(json.dumps({"hookSpecificOutput": {"hookEventName": event, "additionalContext": text}}))


def retry(data):
    if data.get("is_interrupt"):
        return
    error = (data.get("error") or "")[:MAX_CHARS]
    if not error:
        return
    path = os.path.join(tempfile.gettempdir(), "jev-retry-%s.json" % data.get("session_id", "x"))
    try:
        with open(path) as f:
            last = json.load(f)
    except Exception:
        last = {"error": None, "count": 0}
    count = 1
    if last["error"]:
        same = ask(
            "Previous error:\n%s\n\nNew error:\n%s" % (last["error"], error),
            {"same": {"type": "noul", "instructions": "Is the new error essentially the same failure as the previous error?"}},
        )["same"]["noul"]
        if same >= SAME_ERROR_MIN:
            count = last["count"] + 1
    with open(path, "w") as f:
        json.dump({"error": error, "count": count}, f)
    if count >= 2:
        emit("PostToolUseFailure",
             "JEV check: this same error has now happened %d times in a row. "
             "Per CLAUDE.md, consult the advisor before the next attempt." % count)


def route(data):
    prompt = (data.get("prompt") or "").strip()
    if len(prompt) < 25 or prompt.startswith("/"):
        return
    a = ask(
        prompt[:MAX_CHARS * 2],
        {"helper": {
            "type": "choice",
            "instructions": "Which read-only helper subagent should do the first step of this request?",
            "criteria": {
                "search": "map the repository structure, find where things live",
                "grep": "find every call site or usage of a function, symbol or string",
                "docs": "look up API reference or library documentation",
                "none": "no helper needed, e.g. a direct edit, a question, or a chat",
            }}},
    )["helper"]
    helper = a["choice"]
    if helper != "none" and a["probabilities"].get(helper, 0) >= ROUTE_MIN:
        emit("UserPromptSubmit",
             "JEV suggestion (advisory): the `%s` helper subagent fits the first step of this request." % helper)


def main():
    try:
        data = json.load(sys.stdin)
        {"retry": retry, "route": route}[sys.argv[1]](data)
    except Exception:
        pass


main()
