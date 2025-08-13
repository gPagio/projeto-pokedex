const pokeApi = {}

function convertPokeApiDetailToPokemon(pokeDetail) {
    const pokemon = new Pokemon();
    pokemon.number = pokeDetail.id;
    pokemon.name = pokeDetail.name;

    const types = pokeDetail.types.map((typeSlot) => typeSlot.type.name);
    const [type] = types;
    pokemon.allTypes = types;
    pokemon.primaryType = type;

    pokemon.photo = pokeDetail.sprites.other.dream_world.front_default;

    pokemon.height = pokeDetail.height;
    pokemon.weight = pokeDetail.weight;

    pokemon.abilities = pokeDetail.abilities.map((abilityInfo) => abilityInfo.ability.name);

    pokeDetail.stats.forEach((statInfo) => {
        pokemon.stats[statInfo.stat.name] = statInfo.base_stat;
    });

    return pokemon;
}

pokeApi.getPokemons = (offset = 0, limit = 5) => {
    const url = `https://pokeapi.co/api/v2/pokemon?offset=${offset}&limit=${limit}`;
    return fetch(url)
        .then((response) => {
            if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);
            return response.json();
        })
        .then((jsonBody) => jsonBody.results)
        .then((pokemons) => {
            return Promise.all(
                pokemons.map((pokemon) =>
                    fetch(pokemon.url).then((res) => {
                        if (!res.ok) throw new Error(`HTTP error! status: ${res.status}`);
                        return res.json();
                    })
                )
            );
        })
        .then((pokemonsDetails) => pokemonsDetails.map(convertPokeApiDetailToPokemon))
        .catch((error) => {
            console.error('PokeAPI request failed:', error);
            throw error;
        });
}