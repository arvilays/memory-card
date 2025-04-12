import { useState, useEffect } from "react";

function App() {
  const SIZE = 12;
  const [loading, setLoading] = useState(true);
  const [pokemonList, setPokemonList] = useState([]);
  const [pokemonClicked, setPokemonClicked] = useState([]);
  const [score, setScore] = useState(0);
  const [highScore, setHighScore] = useState(0);

  const shufflePokemon = () => {
    const shuffled = [...pokemonList];
    for (let i = shuffled.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
    }
    setPokemonList(shuffled);
  };

  function handlePokemonClick() {
    if (score == 10) handleResetScore();
    handleAddScore();
    shufflePokemon();
  }

  function handleAddScore(point = 1) {
    setScore(prevScore => {
      const newScore = prevScore + point;

      setHighScore(prevHigh => {
        return newScore > prevHigh ? newScore : prevHigh;
      });

      return newScore;
    });
  }

  function handleResetScore() {
    setScore(0);
  }

  // Fetch Pokemon Data
  useEffect(() => {
    const fetchRandomPokemon = async () => {
      try {
        // Get total count of Pokémon using Pokedex entries
        const countRes = await fetch(
          "https://pokeapi.co/api/v2/pokedex/national",
        );
        const countData = await countRes.json();
        const total = countData.pokemon_entries.length;

        // Generate random unique Pokemon IDs
        const randomIds = new Set();
        while (randomIds.size < SIZE) {
          const randomId = Math.floor(Math.random() * total) + 1;
          randomIds.add(randomId);
        }
        console.log(randomIds);

        // Fetch all Pokemon IDs
        const fetches = Array.from(randomIds).map((id) =>
          fetch(`https://pokeapi.co/api/v2/pokemon/${id}`).then((res) =>
            res.json(),
          ),
        );
        const pokemonData = await Promise.all(fetches);

        // Set state
        setPokemonList(pokemonData);
      } catch (err) {
        console.error("Failed to fetch Pokemon:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchRandomPokemon();
  }, []);

  /*##############################
  ||         RENDERING          ||
  ##############################*/
  if (loading) return <div className="loading">Loading Pokemon...</div>;

  return (
    <>
      <div className="score">
        <div className="current-score">Score: {score}</div>
        <div className="high-score">High Score: {highScore}</div>
      </div>
      <div className="container">
        <div className="title">Pokemon Memory Card Game</div>
        <div className="description">
          Gain points by clicking each Pokemon once, but you lose if you click
          the same Pokemon twice!
        </div>
        <div className="squares">
          {pokemonList.map((pokemon) => (
            <div className="pokemon" key={pokemon.id} onClick={handlePokemonClick}>
              <div className="pokemon-name">{pokemon.name}</div>
              <img
                src={pokemon.sprites.other["official-artwork"].front_default}
                alt={pokemon.name}
              />
            </div>
          ))}
        </div>
      </div>
    </>
  );
}

export default App;
