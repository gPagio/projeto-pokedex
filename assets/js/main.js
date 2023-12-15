const pokemonList = document.getElementById('pokemonList')
const loadMoreButton = document.getElementById('loadMoreButton')

const maxRecords = 151
const limit = 10
let offset = 0

function loadPokemonItens(offset, limit) {
    pokeApi.getPokemons(offset, limit).then((pokemons = []) => {
        const listHtml = pokemons
                                .map((pokemon) => `<li class="pokemon ${pokemon.primaryType}">
                                                        <span class="number">#${pokemon.number}</span>
                                                        <span class="name">${pokemon.name}</span>
                                                        <div class="detail">
                                                            <ol class="types">
                                                                ${pokemon.allTypes.map((type) => `<li class="type ${type}">${type}</li>`).join('')}
                                                            </ol>
                                                            <img src="${pokemon.photo}" alt="${pokemon.name}">
                                                        </div>
                                                    </li>`)
                                .join(' ')
        pokemonList.innerHTML += listHtml
    })
}

loadPokemonItens(offset, limit)

loadMoreButton.addEventListener('click', () => {
    offset += limit
    
    const amountRecordsNextPage = offset + limit
    if (amountRecordsNextPage >= maxRecords){
        const newLimitRecords = maxRecords - offset
        loadPokemonItens(offset, newLimitRecords)

        loadMoreButton.parentElement.removeChild(loadMoreButton)
    } else {
        loadPokemonItens(offset, limit)
    }

})