import type { Property, SearchFilters } from "./types.js";

export const ping = () => "pong";

export const searchProperties = (props: Property[], f: SearchFilters = {}): Property[] =>
  props.filter(
    (p) =>
      (!f.city || p.address.city.toLowerCase() === f.city.toLowerCase()) &&
      (!f.type || p.type === f.type) &&
      (!f.listingType || p.listingType === f.listingType) &&
      (f.minPrice === undefined || p.price.amount >= f.minPrice) &&
      (f.maxPrice === undefined || p.price.amount <= f.maxPrice) &&
      (f.minBedrooms === undefined || (p.bedrooms ?? 0) >= f.minBedrooms),
  );

export const getProperty = (props: Property[], id: string): Property | undefined =>
  props.find((p) => p.id === id);
