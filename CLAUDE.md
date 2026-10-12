## Advisor
Consult the advisor before locking a plan, after the same error twice, and before calling a task done.

## JEV hints
Hooks in `.claude/hooks/jev.py` call the JEV decision model. If a "JEV check" says the same error repeated, consult the advisor before retrying. A "JEV suggestion" naming a helper subagent is advisory: use it when it fits.
