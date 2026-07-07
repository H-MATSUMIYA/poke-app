import { useState } from 'react';

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

function PokemonSpriteImage({
  pokemonId,
  alt,
  className,
  loading = 'lazy',
}: PokemonSpriteProps) {
  const [useFallback, setUseFallback] = useState(false);
  const src = useFallback ? fallbackUrl(pokemonId) : artworkUrl(pokemonId);

  return (
    <img
      src={src}
      alt={alt}
      className={className}
      loading={loading}
      onError={() => setUseFallback(true)}
    />
  );
}

export function PokemonSprite(props: PokemonSpriteProps) {
  return <PokemonSpriteImage key={props.pokemonId} {...props} />;
}
