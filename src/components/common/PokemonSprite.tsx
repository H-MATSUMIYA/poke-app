import { useEffect, useState } from 'react';

const SPRITE_BASE = 'https://cdn.jsdelivr.net/gh/PokeAPI/sprites@master/sprites/';

function artworkUrl(id: number) {
  return `${SPRITE_BASE}pokemon/other/official-artwork/${id}.png`;
}

function fallbackUrl(id: number) {
  return `${SPRITE_BASE}pokemon/${id}.png`;
}

interface PokemonSpriteProps {
  pokemonId: number;
  alt: string;
  className?: string;
  loading?: 'lazy' | 'eager';
}

export function PokemonSprite({
  pokemonId,
  alt,
  className,
  loading = 'lazy',
}: PokemonSpriteProps) {
  const [src, setSrc] = useState(() => artworkUrl(pokemonId));

  useEffect(() => {
    setSrc(artworkUrl(pokemonId));
  }, [pokemonId]);

  return (
    <img
      src={src}
      alt={alt}
      className={className}
      loading={loading}
      onError={() => {
        setSrc((current) => (current !== fallbackUrl(pokemonId) ? fallbackUrl(pokemonId) : current));
      }}
    />
  );
}
