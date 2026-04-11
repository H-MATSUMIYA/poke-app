import type { PokemonListResponse, PokemonDetail, GenerationResponse, TypeResponse, PokemonSpecies } from '../types/pokemon';

const BASE_URL = 'https://pokeapi.co/api/v2';

export const fetchPokemonList = async (limit = 10000, offset = 0): Promise<PokemonListResponse> => {
  const res = await fetch(`${BASE_URL}/pokemon?limit=${limit}&offset=${offset}`);
  if (!res.ok) throw new Error('Failed to fetch pokemon list');
  return res.json();
};

export const fetchPokemonDetail = async (name: string): Promise<PokemonDetail> => {
  const res = await fetch(`${BASE_URL}/pokemon/${name}`);
  if (!res.ok) throw new Error(`Failed to fetch details for ${name}`);
  return res.json();
};

export const fetchGeneration = async (idOrName: string | number): Promise<GenerationResponse> => {
  const res = await fetch(`${BASE_URL}/generation/${idOrName}`);
  if (!res.ok) throw new Error(`Failed to fetch generation ${idOrName}`);
  return res.json();
};

export const fetchType = async (type: string): Promise<TypeResponse> => {
  const res = await fetch(`${BASE_URL}/type/${type}`);
  if (!res.ok) throw new Error(`Failed to fetch type ${type}`);
  return res.json();
};

export const fetchPokemonSpecies = async (nameOrId: string | number): Promise<PokemonSpecies> => {
  const res = await fetch(`${BASE_URL}/pokemon-species/${nameOrId}`);
  if (!res.ok) throw new Error(`Failed to fetch species for ${nameOrId}`);
  return res.json();
};

/**
 * URLを指定して種族データを取得する（フォルム違いの取得404エラー回避用）
 */
export const fetchSpeciesByUrl = async (url: string): Promise<PokemonSpecies> => {
  const res = await fetch(url);
  if (!res.ok) throw new Error(`Failed to fetch species from ${url}`);
  return res.json();
};

/**
 * 日本語検索用：全ポケモンの多言語名マッピングは外部アセットがないため、
 * 日本語版の種族リストをバッチ取得して構築するための型定義
 */
export interface LocalizedName {
  id: number;
  en: string;
  ja: string;
}
