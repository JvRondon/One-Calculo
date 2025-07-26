const API_KEY = '9dc4fbf1b311b95209a262062220cca2'; 
const searchButton = document.getElementById('searchButton');
const movieInput = document.getElementById('movieSearch');
const resultsDiv = document.getElementById('results');
const suggestionsList = document.getElementById('suggestions');

const TEMPO_EPISODIO_ONE_PIECE = 23; // minutos

searchButton.addEventListener('click', () => {
    const query = movieInput.value.trim();
    if (query === '') {
        alert('Digite o nome de um filme!');
        return;
    }

    buscarFilme(query);
});

movieInput.addEventListener('input', async () => {
    const query = movieInput.value.trim();

    if (query.length < 2) {
        suggestionsList.innerHTML = '';
        return;
    }

    try {
        const url = `https://api.themoviedb.org/3/search/movie?api_key=${API_KEY}&query=${encodeURIComponent(query)}&language=pt-BR`;
        const resposta = await fetch(url);
        const dados = await resposta.json();

        suggestionsList.innerHTML = '';

        dados.results.slice(0, 5).forEach(filme => {
            const li = document.createElement('li');
            const poster = filme.poster_path ? `https://image.tmdb.org/t/p/w92${filme.poster_path}` : '';
            li.innerHTML = `
                <img src="${poster}" alt="${filme.title}">
                <span>${filme.title}</span>
            `;
            li.addEventListener('click', () => {
                movieInput.value = filme.title;
                suggestionsList.innerHTML = '';
                buscarFilme(filme.title);
            });
            suggestionsList.appendChild(li);
        });

    } catch (erro) {
        console.error('Erro ao buscar sugestões:', erro);
        suggestionsList.innerHTML = '';
    }
});

document.addEventListener('click', (e) => {
    if (!e.target.closest('.search-box')) {
        suggestionsList.innerHTML = '';
    }
});

async function buscarFilme(nome) {
    try {
        const url = `https://api.themoviedb.org/3/search/movie?api_key=${API_KEY}&query=${encodeURIComponent(nome)}&language=pt-BR`;
        const resposta = await fetch(url);
        const dados = await resposta.json();

        if (!dados.results || dados.results.length === 0) {
            mostrarErro("Filme não encontrado!");
            return;
        }

        const filme = dados.results[0];
        const detalhes = await buscarDetalhesFilme(filme.id);
        mostrarResultado(filme, detalhes);
    } catch (erro) {
        console.error("Erro na busca:", erro);
        mostrarErro("Erro ao buscar o filme.");
    }
}

async function buscarDetalhesFilme(id) {
    const url = `https://api.themoviedb.org/3/movie/${id}?api_key=${API_KEY}&language=pt-BR`;
    const resposta = await fetch(url);
    return await resposta.json();
}

function mostrarResultado(filme, detalhes) {
    const duracao = detalhes.runtime;
    const qtdEpisodios = Math.floor(duracao / TEMPO_EPISODIO_ONE_PIECE);

    const posterUrl = filme.poster_path
        ? `https://image.tmdb.org/t/p/w300${filme.poster_path}`
        : '';

    resultsDiv.innerHTML = `
        <div class="movie-result" style="display: block; text-align: center;">
            <h2>${filme.title}</h2>
            ${posterUrl ? `<img src="${posterUrl}" class="movie-poster" alt="${filme.title}">` : ''}
            <p><strong>Duração:</strong> ${duracao} minutos</p>
            <div class="comparison-result">
                <p>Com esse tempo, daria para assistir <strong>${qtdEpisodios}</strong> episódio(s) de One Piece!</p>
                <div class="episodes-container">
                    ${gerarBolinhasEpisodios(qtdEpisodios)}
                </div>
            </div>
        </div>
    `;
}

function gerarBolinhasEpisodios(qtd) {
    let html = '';
    for (let i = 1; i <= qtd; i++) {
        html += `<div class="episode">${i}</div>`;
    }
    return html;
}

function mostrarErro(msg) {
    resultsDiv.innerHTML = `
        <div class="initial-state">
            <img src="https://logos-world.net/wp-content/uploads/2023/03/Straw-Hat-Logo.png" class="luffy-img" alt="Luffy">
            <p>${msg}</p>
        </div>
    `;
}
