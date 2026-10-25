import { expect, test } from "vitest";
import { getProperty, ping, searchProperties } from "./tools.js";
import type { Property } from "./types.js";

const mk = (id: string, city: string, amount: number, bedrooms?: number): Property => ({
  id, title: id, type: "apartment", listingType: "sale",
  price: { amount, currency: "USD" }, bedrooms, address: { city, country: "US" },
});
const data = [mk("a", "Austin", 100, 2), mk("b", "Dallas", 200, 3), mk("c", "austin", 300)];

test("search city case-insens", () => expect(searchProperties(data, { city: "AUSTIN" }).map((p) => p.id)).toEqual(["a", "c"]));
test("search price+beds", () => expect(searchProperties(data, { minPrice: 150, minBedrooms: 3 }).map((p) => p.id)).toEqual(["b"]));
test("search maxPrice", () => expect(searchProperties(data, { maxPrice: 200 }).map((p) => p.id)).toEqual(["a", "b"]));
test("search type+listingType", () => {
  const d = [...data, { ...mk("d", "Austin", 50), type: "house" as const, listingType: "rent" as const }];
  expect(searchProperties(d, { type: "house" }).map((p) => p.id)).toEqual(["d"]);
  expect(searchProperties(d, { listingType: "rent" }).map((p) => p.id)).toEqual(["d"]);
});
test("minBedrooms excludes undefined beds", () => expect(searchProperties(data, { minBedrooms: 1 }).map((p) => p.id)).toEqual(["a", "b"]));
test("search no filters", () => expect(searchProperties(data)).toHaveLength(3));
test("get", () => { expect(getProperty(data, "b")?.id).toBe("b"); expect(getProperty(data, "x")).toBeUndefined(); });

test("ping", () => expect(ping()).toBe("pong"));
