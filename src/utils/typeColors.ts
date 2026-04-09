export const typeColors: Record<string, string> = {
  normal: 'bg-stone-400 text-stone-900',
  fire: 'bg-red-500 text-white',
  water: 'bg-blue-500 text-white',
  electric: 'bg-yellow-400 text-yellow-900',
  grass: 'bg-green-500 text-white',
  ice: 'bg-cyan-300 text-cyan-900',
  fighting: 'bg-orange-600 text-white',
  poison: 'bg-purple-500 text-white',
  ground: 'bg-yellow-600 text-white',
  flying: 'bg-indigo-300 text-indigo-900',
  psychic: 'bg-pink-500 text-white',
  bug: 'bg-lime-500 text-lime-900',
  rock: 'bg-yellow-700 text-white',
  ghost: 'bg-indigo-700 text-white',
  dragon: 'bg-indigo-600 text-white',
  dark: 'bg-slate-800 text-white',
  steel: 'bg-slate-500 text-white',
  fairy: 'bg-pink-300 text-pink-900',
};

export const getTypeColor = (type: string) => {
  return typeColors[type] || 'bg-slate-200 text-slate-800';
};
