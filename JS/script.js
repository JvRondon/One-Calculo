// Configurações da API
const API_KEY = '9dc4fbf1b311b95209a262062220cca2'; // Chave API v3
const API_TOKEN = 'eyJhbGciOiJIUzI1NiJ9.eyJhdWQiOiI5ZGM0ZmJmMWIzMTFiOTUyMDlhMjYyMDYyMjIwY2NhMiIsInN1YiI6IjY4ODQzMzZmNmEzODA0YzIwZTE2YjllZiIsInNjb3BlcyI6WyJhcGlfcmVhZCJdLCJ2ZXJzaW9uIjoxfQ._wsj-xGue5fRNzh7iAcVIi1O01K5vPTawM-0bVHJSy4'; // Token de acesso v4

// Elementos do DOM
const searchButton = document.getElementById('searchButton');
const movieSearch = document.getElementById('movieSearch');
const resultsDiv = document.getElementById('results');

// Função principal de busca
async function searchMovies(query) {
    try {
        // Mostra estado de carregamento
        showLoadingState(query);

        // Busca os dados do filme
        const movie = await fetchMovieData(query);
        
        // Exibe os resultados
        showResults(movie);
    } catch (error) {
        // Trata erros
        showErrorState(error);
    }
}

// Função para buscar dados do filme
async function fetchMovieData(query) {
    const options = {
        method: 'GET',
        headers: {
            accept: 'application/json',
            Authorization: `Bearer ${API_TOKEN}`
        }
    };

    // Primeiro busca o ID do filme
    const searchUrl = `https://api.themoviedb.org/3/search/movie?query=${encodeURIComponent(query)}&language=pt-BR&page=1`;
    const searchResponse = await fetch(searchUrl, options);
    
    if (!searchResponse.ok) {
        throw new Error(`Erro na busca: ${searchResponse.status}`);
    }
    
    const searchData = await searchResponse.json();
    
    if (!searchData.results || searchData.results.length === 0) {
        throw new Error('Nenhum filme encontrado');
    }
    
    // Depois busca os detalhes completos
    const movieId = searchData.results[0].id;
    const detailsUrl = `https://api.themoviedb.org/3/movie/${movieId}?language=pt-BR`;
    const detailsResponse = await fetch(detailsUrl, options);
    
    if (!detailsResponse.ok) {
        throw new Error(`Erro nos detalhes: ${detailsResponse.status}`);
    }
    
    return await detailsResponse.json();
}

// Função para mostrar estado de carregamento
function showLoadingState(query) {
    resultsDiv.innerHTML = `
        <div class="loading">
            <i class="fas fa-spinner fa-spin"></i>
            <p>Procurando "${query}"...</p>
        </div>
    `;
}

// Função para mostrar resultados
function showResults(movie) {
    const duration = movie.runtime || 120; // Fallback se não tiver duração
    const episodes = (duration / 24).toFixed(1);
    const fullEpisodes = Math.floor(duration / 24);
    const remainingMinutes = Math.round(duration % 24);

    resultsDiv.innerHTML = `
        <div class="movie-result">
            <img src="${movie.poster_path ? `https://image.tmdb.org/t/p/w300${movie.poster_path}` : 'https://i.imgur.com/JuMqQEg.png'}" 
                 alt="${movie.title}" 
                 class="movie-poster"
                 onerror="this.src='https://i.imgur.com/JuMqQEg.png'">
            <h2>${movie.title}</h2>
            <p><i class="fas fa-clock"></i> ${duration} minutos</p>
            
            <div class="comparison">
                <p><i class="fas fa-skull-crossbones"></i> <strong>${episodes}</strong> episódios de One Piece!</p>
                <div class="episodes-container">
                    ${Array(fullEpisodes).fill().map((_, i) => `<div class="episode">${i+1}</div>`).join('')}
                </div>
                <small>(${fullEpisodes} completos + ${remainingMinutes} min do próximo)</small>
            </div>
        </div>
    `;
}

// Função para mostrar erros
function showErrorState(error) {
    console.error("Erro completo:", error);
    resultsDiv.innerHTML = `
        <div class="error">
            <i class="fas fa-exclamation-triangle"></i>
            <h3>Erro!</h3>
            <p>${error.message}</p>
            <small>Tente filmes como: "Vingadores", "Titanic"</small>
            <button onclick="window.location.reload()">Tentar novamente</button>
        </div>
    `;
}

// Event Listener para o botão de busca
searchButton.addEventListener('click', () => {
    const query = movieSearch.value.trim();
    if (query) {
        searchMovies(query);
    } else {
        alert("Por favor, digite um filme!");
    }
});

// Event Listener para a tecla Enter
movieSearch.addEventListener('keypress', (e) => {
    if (e.key === 'Enter') {
        const query = movieSearch.value.trim();
        if (query) {
            searchMovies(query);
        } else {
            alert("Por favor, digite um filme!");
        }
    }
});
