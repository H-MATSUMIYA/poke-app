export interface NamedAPIResource {
  name: string;
  url: string;
}

export interface PokemonListResponse {
  count: number;
  next: string | null;
  previous: string | null;
  results: NamedAPIResource[];
}

export interface PokemonType {
  slot: number;
  type: NamedAPIResource;
}

export interface PokemonDetail {
  id: number;
  name: string;
  types: PokemonType[];
  sprites: {
    other: {
      'official-artwork': {
        front_default: string;
      };
    };
  };
  weight: number;
  height: number;
  stats: {
    base_stat: number;
    stat: NamedAPIResource;
  }[];
}

export interface GenerationResponse {
  id: number;
  name: string;
  pokemon_species: NamedAPIResource[];
}

export interface TypeResponse {
  id: number;
  name: string;
  pokemon: {
    pokemon: NamedAPIResource;
  }[];
}

export interface FlavorTextEntry {
  flavor_text: string;
  language: NamedAPIResource;
}

export interface PokemonSpecies {
  id: number;
  name: string;
  genera: {
    genus: string;
    language: NamedAPIResource;
  }[];
  flavor_text_entries: FlavorTextEntry[];
}
