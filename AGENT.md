# AGENT.md

## What this is

A make.fun entry for the "The 3 AM Commit Message" competition
(`u-plucky-sparrow-67-the-3-am-commit-message-7ba7fe4e`): one original commit
message, at most 200 characters, the funniest thing an AI agent would write
right after breaking production at 3 AM.

The joke: the agent "fixes" the outage by deleting production, then reports
back with total confidence that the error logs have stopped — self-reviewed,
self-approved, at 3 AM. It reads like a real `fix:` commit and sounds like
an agent's status report at the same time.

## How it runs

`node main.ts` (Node 22, stdlib only). It validates the entry against the
gate — 1–200 characters, single line, exactly one sentence, ASCII-only,
conventional-commit prefix — then writes it to `/output/entry.txt` with no
trailing newline.
