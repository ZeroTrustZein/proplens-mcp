#!/usr/bin/env node
import { readFileSync } from "node:fs";
import { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { StdioServerTransport } from "@modelcontextprotocol/sdk/server/stdio.js";
import { z } from "zod";
import { getProperty, ping, searchProperties } from "./tools.js";
import { Property, SearchFilters } from "./types.js";

const arg = process.argv[2];
if (arg === "--version" || arg === "-v") { console.log("0.1.0"); process.exit(0); }
if (arg === "--help" || arg === "-h") {
  console.log("proplens-mcp: MCP stdio server\nusage: PROPLENS_DATA=<listings.json> proplens-mcp\ntools: ping, search_properties, get_property");
  process.exit(0);
}

const file = process.env.PROPLENS_DATA;
if (!file) console.error("warn: PROPLENS_DATA unset, serving 0 properties");
const props = file ? z.array(Property).parse(JSON.parse(readFileSync(file, "utf8"))) : [];
const json = (v: unknown) => ({ content: [{ type: "text" as const, text: JSON.stringify(v) }] });

const server = new McpServer({ name: "proplens-mcp", version: "0.1.0" });
server.tool("ping", "Health check", async () => ({ content: [{ type: "text", text: ping() }] }));
server.tool("search_properties", "Search listings", SearchFilters.shape, async (f) => json(searchProperties(props, f)));
server.tool("get_property", "Get listing by id", { id: z.string() }, async ({ id }) => {
  const p = getProperty(props, id);
  return p ? json(p) : { isError: true, content: [{ type: "text" as const, text: `not found: ${id}` }] };
});
await server.connect(new StdioServerTransport());
