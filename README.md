# bellink-mcp

Connect AI assistants to 30+ business tools through one MCP server.

**Gmail, Google Calendar, Sheets, Docs, Drive, Mindbody, Meta Ads, Linear, Airtable, Notion, Stripe, Slack, and more** — all accessible from Claude, ChatGPT, Cursor, Perplexity, or OpenClaw.

## Quick start

```bash
BELLINK_URL=your-bellink-url npx bellink-mcp
```

1. **Sign up** at [bellink.io](https://www.bellink.io) (14-day free trial, no credit card)
2. **Connect your apps** — Gmail, Mindbody, Meta, whatever you use
3. **Copy your Bellink URL** from the dashboard
4. **Run it:**

```bash
BELLINK_URL=https://app.bellink.io/api/mcp/server?apiKey=YOUR_KEY npx bellink-mcp
```

## Add to your AI client

### Claude Desktop / Claude Code

```json
{
  "mcpServers": {
    "bellink": {
      "command": "npx",
      "args": ["bellink-mcp"],
      "env": {
        "BELLINK_URL": "your-bellink-url"
      }
    }
  }
}
```

### Cursor

Settings → MCP → Add Server → paste the config above.

### OpenClaw

Add to `~/.openclaw/workspace/config/mcporter.json`:

```json
{
  "mcpServers": {
    "bellink": {
      "command": "npx",
      "args": ["bellink-mcp"],
      "env": {
        "BELLINK_URL": "your-bellink-url"
      }
    }
  }
}
```

### Direct SSE (any MCP client)

Skip the npm package entirely — just point your client to your Bellink URL:

```
https://app.bellink.io/api/mcp/server?apiKey=YOUR_KEY
```

## What you can do

Once connected, your AI can:

- **Email**: Read inbox, send emails, create drafts, manage labels
- **Calendar**: Check schedule, create events, find meeting times
- **Sheets**: Read/write data, run queries, create spreadsheets
- **Mindbody**: Book clients, check attendance, pull revenue, manage staff (87 tools)
- **Meta Ads**: Create campaigns, manage audiences, pull insights
- **Linear**: Create issues, manage projects, track sprints
- **Airtable**: Query bases, create records, manage tables
- **And 20+ more** — Notion, Stripe, Slack, Drive, Docs, Analytics...

All by asking in plain English. No code. No APIs to learn.

## How it works

This package is a thin MCP transport layer. Your Bellink account holds the connections to your apps. When your AI calls a tool, it goes:

```
AI → bellink-mcp (stdio) → Bellink server (SSE) → Your app (Gmail, Mindbody, etc.)
```

Your credentials are encrypted with AES-256. Bellink uses OAuth — we never see your passwords. Disconnect any app anytime.

## Pricing

- **14-day free trial** — no credit card required
- **Personal**: $29/mo — all apps, 1,000 requests/month
- **Team**: $79/mo — multiple users, 5,000 requests/month

## Links

- [Website](https://www.bellink.io)
- [Dashboard](https://app.bellink.io)
- [Blog](https://www.bellink.io/blog)
- [About](https://www.bellink.io/about)
