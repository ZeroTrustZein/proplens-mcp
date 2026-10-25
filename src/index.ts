#!/usr/bin/env node
import { readFileSync } from "node:fs";
import { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { StdioServerTransport } from "@modelcontextprotocol/sdk/server/stdio.js";
import { z } from "zod";
import { getProperty, ping, searchProperties } from "./tools.js";
import { Property, SearchFilters } from "./types.js";

const file = process.env.PROPLENS_DATA;
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
