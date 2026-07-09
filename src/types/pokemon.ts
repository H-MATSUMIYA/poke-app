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

export interface PokemonMoveVersionDetail {
  level_learned_at: number;
  move_learn_method: NamedAPIResource;
  version_group: NamedAPIResource;
}

export interface PokemonMove {
  move: NamedAPIResource;
  version_group_details: PokemonMoveVersionDetail[];
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
  species: NamedAPIResource;
  stats: {
    base_stat: number;
    stat: NamedAPIResource;
  }[];
  moves: PokemonMove[];
}

export interface VersionResponse {
  id: number;
  name: string;
  version_group: NamedAPIResource;
}

export interface MoveDetail {
  id: number;
  name: string;
  power: number | null;
  accuracy: number | null;
  type: NamedAPIResource;
  damage_class: NamedAPIResource;
  names: {
    name: string;
    language: NamedAPIResource;
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
  version: NamedAPIResource;
}

export interface PokemonSpecies {
  id: number;
  name: string;
  names: {
    name: string;
    language: NamedAPIResource;
  }[];
  genera: {
    genus: string;
    language: NamedAPIResource;
  }[];
  flavor_text_entries: FlavorTextEntry[];
}
