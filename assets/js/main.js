const limit = 20
const offset = 0
const url = `https://pokeapi.co/api/v2/pokemon?offset=${offset}&limit=${limit}`

function convertPokemonToList(pokemon){
    return `
    <li class="pokemon ${pokemon.primaryType}">
        <span class="number">#${pokemon.number}</span>
        <span class="name">${pokemon.name}</span>
        <div class="detail">
            <ol class="types">
                ${pokemon.allTypes.map((type) => `<li class="type ${type}">${type}</li>`).join('')}
            </ol>
            <img src="${pokemon.photo}" alt="${pokemon.name}">
        </div>
    </li>`
}

const pokemonList = document.getElementById('pokemonList')

pokeApi.getPokemons(limit, offset).then((pokemons = []) => {
    const listHtml = pokemons.map(convertPokemonToList).join(' ')
    pokemonList.innerHTML += listHtml
})