export interface PokemonDetailMoveView {
  slug: string;
  displayName: string;
  type: string;
  damageClass: string;
  power: number | null;
  accuracy: number | null;
  levelLearnedAt: number;
}

export interface PokemonDetailMoveGroupView {
  learnMethod: string;
  moves: PokemonDetailMoveView[];
}

export interface PokemonDetailView {
  id: number;
  name: string;
  localizedName: string;
  genus: string;
  types: string[];
  height: number;
  weight: number;
  stats: { name: string; baseStat: number }[];
  availableVersions: string[];
  activeVersion: string;
  flavorText: string;
  moveGroups: PokemonDetailMoveGroupView[];
}
