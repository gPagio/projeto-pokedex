const pokemonList = document.getElementById('pokemonList');
const loadMoreButton = document.getElementById('loadMoreButton');
const modal = document.getElementById('pokemonModal');
const closeModalButton = document.querySelector('.close-button');
const modalContent = document.getElementById('modal-pokemon-content');
const loader = document.getElementById('loader');

const maxRecords = 151;
const limit = 10;
let offset = 0;
let allPokemons = []; // To store all loaded pokemons

function convertPokemonToLi(pokemon) {
    return `
        <li class="pokemon ${pokemon.primaryType}" data-id="${pokemon.number}">
            <span class="number">#${pokemon.number}</span>
            <span class="name">${pokemon.name}</span>
            <div class="detail">
                <ol class="types">
                    ${pokemon.allTypes.map((type) => `<li class="type ${type}">${type}</li>`).join('')}
                </ol>
                <img src="${pokemon.photo}" alt="${pokemon.name}">
            </div>
        </li>
    `;
}

function loadPokemonItens(offset, limit) {
    loader.style.display = 'flex';
    pokeApi.getPokemons(offset, limit).then((pokemons = []) => {
        allPokemons.push(...pokemons);
        const newHtml = pokemons.map(convertPokemonToLi).join('');
        pokemonList.innerHTML += newHtml;
    }).catch(error => {
        console.error(error);
        alert('Failed to load Pokémon. Please try again later.');
    }).finally(() => {
        loader.style.display = 'none';
    });
}

function showPokemonDetails(pokemonId) {
    const pokemon = allPokemons.find(p => p.number == pokemonId);
    if (!pokemon) return;

    const modalHtml = `
        <div class="modal-header ${pokemon.primaryType}">
            <h2 class="name">${pokemon.name}</h2>
            <span class="number">#${pokemon.number}</span>
            <img src="${pokemon.photo}" alt="${pokemon.name}">
            <ol class="types">
                ${pokemon.allTypes.map((type) => `<li class="type ${type}">${type}</li>`).join('')}
            </ol>
        </div>
        <div class="modal-body">
            <table class="details-table">
                <tr><th>Height</th><td>${pokemon.height / 10} m</td></tr>
                <tr><th>Weight</th><td>${pokemon.weight / 10} kg</td></tr>
                <tr><th>Abilities</th><td>${pokemon.abilities.join(', ')}</td></tr>
                <tr><th colspan="2">Stats</th></tr>
                ${Object.entries(pokemon.stats).map(([statName, statValue]) => `
                    <tr>
                        <td>${statName}</td>
                        <td>${statValue}</td>
                    </tr>
                `).join('')}
            </table>
        </div>
    `;
    modalContent.innerHTML = modalHtml;
    modal.style.display = 'block';
}

loadPokemonItens(offset, limit);

loadMoreButton.addEventListener('click', () => {
    offset += limit;
    const amountRecordsNextPage = offset + limit;

    if (amountRecordsNextPage >= maxRecords) {
        const newLimit = maxRecords - offset;
        loadPokemonItens(offset, newLimit);
        loadMoreButton.parentElement.removeChild(loadMoreButton);
    } else {
        loadPokemonItens(offset, limit);
    }
});

pokemonList.addEventListener('click', (event) => {
    const pokemonLi = event.target.closest('.pokemon');
    if (pokemonLi) {
        const pokemonId = pokemonLi.dataset.id;
        showPokemonDetails(pokemonId);
    }
});

closeModalButton.addEventListener('click', () => {
    modal.style.display = 'none';
});

window.addEventListener('click', (event) => {
    if (event.target == modal) {
        modal.style.display = 'none';
    }
});