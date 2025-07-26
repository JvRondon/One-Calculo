// Configuração da API TMDB
const API_KEY = 'SUA_CHAVE_API_TMDB'; // Substitua pela sua chave!
const API_URL = 'https://api.themoviedb.org/3';

// Elementos DOM
const searchButton = document.getElementById('searchButton');
const movieSearch = document.getElementById('movieSearch');
const resultsDiv = document.getElementById('results');

// Busca filmes na API
async function searchMovies(query) {
    try {
        const response = await fetch(
            `${API_URL}/search/movie?api_key=${API_KEY}&query=${query}&language=pt-BR`
        );
        const data = await response.json();
        return data.results;
    } catch (error) {
        console.error("Erro ao buscar filmes:", error);
        return [];
    }
}

// Calcula episódios de One Piece
function calculateOnePieceEpisodes(movieDuration) {
    const onePieceEpisodeDuration = 24; // minutos por episódio
    return movieDuration / onePieceEpisodeDuration;
}

// Exibe os resultados na página
function displayResults(movie) {
    const episodes = calculateOnePieceEpisodes(movie.runtime);
    const fullEpisodes = Math.floor(episodes);
    const remainingMinutes = Math.floor((episodes - fullEpisodes) * 24);
    
    // Criar elementos de episódios
    let episodesHTML = '';
    for (let i = 1; i <= fullEpisodes; i++) {
        episodesHTML += `<div class="episode">${i}</div>`;
    }
    
    // Atualizar o DOM
    resultsDiv.innerHTML = `
        <div class="movie-result">
            <img src="https://image.tmdb.org/t/p/w500${movie.poster_path}" 
                 alt="${movie.title}" 
                 class="movie-poster"
                 onerror="this.src='https://via.placeholder.com/120x180?text=Poster+Não+Disponível'">
            <h3 class="movie-title">${movie.title}</h3>
            <div class="movie-duration">${movie.runtime} minutos</div>
            
            <div class="comparison">
                <div class="comparison-item">
                    <div class="comparison-value">${episodes.toFixed(1)}</div>
                    <div class="comparison-label">episódios</div>
                </div>
                <div class="comparison-item">
                    <div class="comparison-value">${fullEpisodes}</div>
                    <div class="comparison-label">completos</div>
                </div>
            </div>
            
            <div class="episodes-container">${episodesHTML}</div>
        </div>
    `;
}

// Evento de busca
searchButton.addEventListener('click', async () => {
    const query = movieSearch.value.trim();
    
    if (!query) {
        alert("Por favor, digite um filme!");
        return;
    }
    
    // Mostrar mensagem de carregamento
    resultsDiv.innerHTML = '<div class="initial-message"><i class="fas fa-spinner fa-spin"></i><p>Buscando filme...</p></div>';
    
    const movies = await searchMovies(query);
    
    if (movies.length === 0) {
        resultsDiv.innerHTML = '<div class="initial-message"><i class="fas fa-times-circle"></i><p>Nenhum filme encontrado. Tente outro nome!</p></div>';
        return;
    }
    
    // Pega o primeiro filme da lista
    const movie = movies[0];
    
    // Se o filme não tiver duração, busca detalhes completos
    if (!movie.runtime) {
        const movieDetails = await fetch(
            `${API_URL}/movie/${movie.id}?api_key=${API_KEY}&language=pt-BR`
        ).then(res => res.json());
        movie.runtime = movieDetails.runtime;
    }
    
    // Se ainda não tiver duração, usa um valor padrão
    if (!movie.runtime) {
        movie.runtime = 120; // 2 horas padrão
    }
    
    displayResults(movie);
});

// Pesquisar ao pressionar Enter
movieSearch.addEventListener('keypress', (e) => {
    if (e.key === 'Enter') {
        searchButton.click();
    }
});