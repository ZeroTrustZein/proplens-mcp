import { z } from "zod";

export const Money = z.object({ amount: z.number().nonnegative(), currency: z.string().length(3) });
export type Money = z.infer<typeof Money>;

export const Address = z.object({
  street: z.string().optional(),
  city: z.string(),
  region: z.string().optional(),
  postalCode: z.string().optional(),
  country: z.string(),
});
export type Address = z.infer<typeof Address>;

export const Property = z.object({
  id: z.string(),
  title: z.string(),
  type: z.enum(["apartment", "house", "land", "commercial"]),
  listingType: z.enum(["sale", "rent"]),
  price: Money,
  bedrooms: z.number().int().nonnegative().optional(),
  bathrooms: z.number().int().nonnegative().optional(),
  areaSqm: z.number().positive().optional(),
  address: Address,
});
export type Property = z.infer<typeof Property>;

export const SearchFilters = z.object({
  city: z.string().optional(),
  type: Property.shape.type.optional(),
  listingType: Property.shape.listingType.optional(),
  minPrice: z.number().nonnegative().optional(),
  maxPrice: z.number().nonnegative().optional(),
  minBedrooms: z.number().int().nonnegative().optional(),
});
export type SearchFilters = z.infer<typeof SearchFilters>;
