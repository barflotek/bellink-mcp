#!/usr/bin/env node

/**
 * bellink-mcp — Connect AI assistants to 30+ business tools.
 *
 * This is a thin proxy that connects your AI (Claude, ChatGPT, Cursor, OpenClaw)
 * to your Bellink account. All tools run on Bellink's hosted server — this package
 * handles the MCP transport layer (SSE remote → stdio local).
 *
 * Usage:
 *   BELLINK_URL=https://app.bellink.io/api/mcp/server?apiKey=xxx npx bellink-mcp
 *
 * Or add to your MCP config:
 *   {
 *     "mcpServers": {
 *       "bellink": {
 *         "command": "npx",
 *         "args": ["bellink-mcp"],
 *         "env": { "BELLINK_URL": "your-bellink-url" }
 *       }
 *     }
 *   }
 *
 * Get your URL at: https://app.bellink.io (free trial, no credit card)
 */

import { Server } from "@modelcontextprotocol/sdk/server/index.js";
import { StdioServerTransport } from "@modelcontextprotocol/sdk/server/stdio.js";
import { SSEClientTransport } from "@modelcontextprotocol/sdk/client/sse.js";
import { Client } from "@modelcontextprotocol/sdk/client/index.js";
import {
  ListToolsRequestSchema,
  CallToolRequestSchema,
} from "@modelcontextprotocol/sdk/types.js";

const BELLINK_URL = process.env.BELLINK_URL || "";

if (!BELLINK_URL) {
  console.error(`
bellink-mcp — AI gateway to your business tools

  Missing BELLINK_URL environment variable.

  1. Sign up at https://app.bellink.io (free trial)
  2. Connect your apps (Gmail, Mindbody, etc.)
  3. Copy your Bellink URL from the dashboard
  4. Set it:

     BELLINK_URL=your-url npx bellink-mcp

  30+ apps. One URL. Every AI platform.
`);
  process.exit(1);
}

async function main() {
  // Connect to the remote Bellink MCP server via SSE
  const remoteClient = new Client(
    { name: "bellink-mcp-proxy", version: "1.0.0" },
    { capabilities: {} }
  );

  const url = new URL(BELLINK_URL);
  const sseTransport = new SSEClientTransport(url);

  try {
    await remoteClient.connect(sseTransport);
  } catch (err: any) {
    console.error("Failed to connect to Bellink. Check your BELLINK_URL.");
    console.error(err?.message || err);
    process.exit(1);
  }

  // Fetch available tools from remote
  const { tools } = await remoteClient.listTools();
  console.error(`bellink-mcp: ${tools.length} tools loaded`);

  // Create local stdio server that proxies to remote
  const localServer = new Server(
    { name: "bellink", version: "1.0.0" },
    { capabilities: { tools: {} } }
  );

  // Forward tools/list — return the remote tool catalog
  localServer.setRequestHandler(ListToolsRequestSchema, async () => ({
    tools,
  }));

  // Forward tools/call — proxy every call to the remote Bellink server
  localServer.setRequestHandler(CallToolRequestSchema, async (request) => {
    const result = await remoteClient.callTool({
      name: request.params.name,
      arguments: request.params.arguments || {},
    });
    return result as any;
  });

  // Start stdio transport
  const stdioTransport = new StdioServerTransport();
  await localServer.connect(stdioTransport);
}

main().catch((err) => {
  console.error("Fatal error:", err);
  process.exit(1);
});
