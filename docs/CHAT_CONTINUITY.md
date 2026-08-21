# Chat continuity runbook

The repository, not a single chat, is the durable project memory.

Use one ChatGPT Project for Perfumetr and a separate chat for each major task or
deployment. Start a new task chat before the previous conversation becomes
slow. ChatGPT Projects keep related chats and files together:
https://learn.chatgpt.com/docs/projects

## Before a chat becomes long

After every important deployment or major investigation:

1. update `PROJECT_STATE.md`;
2. record the exact GitHub commit and workflow URL;
3. record the exact Sites version and deployment ID;
4. list verified source counts with timestamps;
5. list unfinished items and the next safe action;
6. state what must not yet be claimed;
7. send the numbered deployment report required by the user.

Do not wait for ChatGPT to display a conversation-length warning.

## Starting a new chat

Give the new chat this instruction:

```text
Continue the Perfumetr project. First read AGENTS.md, PROJECT_STATE.md,
docs/ARCHITECTURE.md and docs/CHAT_CONTINUITY.md in GADOMM/Index. Verify the
current GitHub master commit, the last Actions run and the current Sites
deployment before changing anything. Treat PROJECT_STATE.md as a dated handoff,
not as proof that external state is still current. Never request or expose
affiliate credentials in chat.
```

Then provide only the current task. There is no need to paste the entire old
conversation.

## Recommended chat split

Keep these as separate chats inside the same Project:

1. importer and affiliate networks;
2. homepage and beta product work;
3. catalog quality and matching;
4. social media and brand assets;
5. reports and operational follow-up.

The repository files remain the common handoff between them.

## Handoff checklist

A useful handoff answers all of these questions:

1. What is currently live?
2. What was directly verified and when?
3. Which commit and Sites version produced it?
4. What remains only a local draft?
5. What external quota or permission may block the next action?
6. What is the next reversible step?
7. Which action would be unsafe or premature?
8. Was the numbered email report sent?

## Information that must never enter the handoff

Never store tokens, passwords, OIDC values, provider redirect URLs, bridge
tickets, cookies, private provider responses or copied mailbox content.

Use safe error codes and links to authorized dashboards instead.

## When GitHub and Sites disagree

Stop before deployment. Verify both sides directly. A GitHub script can be
correct while the required Sites endpoint is absent, and a successful import
can still be hidden by separate public-catalog rules. Update
`PROJECT_STATE.md` only after the mismatch is understood.
