document.addEventListener("DOMContentLoaded", () => {
    const showCharactersBtn = document.getElementById("show-characters-btn");
    const searchInput = document.getElementById("search-input");

    showCharactersBtn.addEventListener("click", fetchCharacters);
    searchInput.addEventListener("input", filterCharacters);

    let characters = [];

    function fetchCharacters() {
        fetch('db.json')
            .then(response => response.json())
            .then(data => {
                characters = data.characters;
                renderCharacters(characters);
                const homeworldsRaw = characters.map(character => character.homeworld ?? "other");
                const homeworlds = [...new Set(homeworldsRaw.map(hw => hw.toLowerCase()))];
                renderFilters(homeworlds);
            })
            .catch(error => console.error('Error fetching the JSON data:', error));
    }

    function renderCharacters(charactersToRender) {
        const charactersContainer = document.getElementById("characters-container");
        charactersContainer.innerHTML = ''; // Mevcut içeriği temizle

        charactersToRender.forEach(character => {
            const characterCard = `
                <div class="card mb-4" data-toggle="modal" data-target="#characterModal" data-name="${character.name}" data-homeworld="${character.homeworld}" data-pic="${character.pic}" style="width: 18rem; margin: 10px;">
                    <img src="${character.pic}" class="card-img-top" alt="${character.name}">
                    <div class="card-body">
                        <h5 class="card-title">${character.name}</h5>
                        <p class="card-text">Homeworld: ${character.homeworld}</p>
                    </div>
                </div>
            `;
            charactersContainer.innerHTML += characterCard;
        });

        addCardEventListeners();
    }

    function filterCharacters() {
        const searchTerm = searchInput.value.toLowerCase();
        const filteredCharacters = characters.filter(character => character.name.toLowerCase().includes(searchTerm));
        renderCharacters(filteredCharacters);
    }

    function filterCharactersByHomeworld(event) {
        const selectedHomeworld = event.target.value;
        console.log("Selected Homeworld:", selectedHomeworld);
        const filteredCharacters = characters.filter(character => {
            const homeworld = character.homeworld ? character.homeworld.toLowerCase() : "other";
            return homeworld === selectedHomeworld;
        });
        renderCharacters(filteredCharacters);
    }

    function renderFilters(homeworlds) {
        const filterContainer = document.getElementById("filter-container");
        filterContainer.innerHTML = ''; // Mevcut içeriği temizle

        homeworlds.forEach(homeworld => {
            const filterOption = `
                <button type="button" class="btn btn-outline-primary mx-2" value="${homeworld}">
                    ${homeworld.charAt(0).toUpperCase() + homeworld.slice(1)}
                </button>
            `;
            filterContainer.innerHTML += filterOption;
        });

        const buttons = filterContainer.querySelectorAll('button');
        buttons.forEach(button => {
            button.addEventListener("click", filterCharactersByHomeworld);
        });
    }

    function addCardEventListeners() {
        const characterCards = document.querySelectorAll('.card');
        characterCards.forEach(card => {
            card.addEventListener('click', function() {
                const name = this.getAttribute('data-name');
                const homeworld = this.getAttribute('data-homeworld');
                const pic = this.getAttribute('data-pic');

                document.getElementById('characterModalLabel').textContent = name;
                document.getElementById('characterModalImage').src = pic;
                document.getElementById('characterModalImage').alt = name;
                document.getElementById('characterModalName').textContent = `Name: ${name}`;
                document.getElementById('characterModalHomeworld').textContent = `Homeworld: ${homeworld}`;
            });
        });
    }
});
