# Lesson

The CLI is only one surface. Hermes routes messages from many platforms into the same agent loop. This lesson starts with one HTTP gateway.

## What changes in this step

- The agent can run as a server.
- Session routing is keyed by request metadata.
- JSON responses expose replies and tool events.

## Key idea

Keep the transport layer thin: normalize incoming messages, call the agent, then format the response.

