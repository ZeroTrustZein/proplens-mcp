import { expect, test } from "vitest";
import { ping } from "./tools.js";

test("ping", () => expect(ping()).toBe("pong"));
