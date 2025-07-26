// Configurações da API
const API_KEY = '9dc4fbf1b311b95209a262062220cca2'; // Chave V3
const API_READ_TOKEN = 'eyJhbGciOiJIUzI1NiJ9.eyJhdWQiOiI5ZGM0ZmJmMWIzMTFiOTUyMDlhMjYyMDYyMjIwY2NhMiIsInN1YiI6IjY4ODQzMzZmNmEzODA0YzIwZTE2YjllZiIsInNjb3BlcyI6WyJhcGlfcmVhZCJdLCJ2ZXJzaW9uIjoxfQ._wsj-xGue5fRNzh7iAcVIi1O01K5vPTawM-0bVHJSy4'; // Token V4

// Função para buscar filmes
async function searchMovies(query) {
    try {
        // Mostra loading
        document.getElementById('results').innerHTML = `
            <div class="loading">
                <i class="fas fa-spinner fa-spin"></i>
                <p>Procurando "${query}"...</p>
            </div>
        `;

        // 1. Busca o filme (usando API KEY V3)
        const searchResponse = await fetch(
            `https://api.themoviedb.org/3/search/movie?api_key=${API_KEY}&query=${encodeURIComponent(query)}&language=pt-BR`
        );

        if (!searchResponse.ok) throw new Error(`Erro na busca: ${searchResponse.status}`);
        
        const searchData = await searchResponse.json();
        if (!searchData.results.length) throw new Error("Nenhum filme encontrado");

        // 2. Pega os detalhes (usando TOKEN V4)
        const movieId = searchData.results[0].id;
        const detailsResponse = await fetch(
            `https://api.themoviedb.org/3/movie/${movieId}?language=pt-BR`,
            {
                headers: {
                    'Authorization': `Bearer ${API_READ_TOKEN}`,
                    'accept': 'application/json'
                }
            }
        );

        if (!detailsResponse.ok) throw new Error(`Erro nos detalhes: ${detailsResponse.status}`);
        
        const movie = await detailsResponse.json();
        showResults(movie);

    } catch (error) {
        console.error("Erro completo:", error);
        document.getElementById('results').innerHTML = `
            <div class="error">
                <i class="fas fa-exclamation-triangle"></i>
                <p>${error.message}</p>
                <small>Tente filmes como: "Vingadores", "Titanic"</small>
                <button onclick="window.location.reload()">Tentar novamente</button>
            </div>
        `;
    }
}

// Função para mostrar resultados
function showResults(movie) {
    const duration = movie.runtime || 120; // Fallback se não tiver duração
    const episodes = (duration / 24).toFixed(1);
    const fullEpisodes = Math.floor(duration / 24);

    document.getElementById('results').innerHTML = `
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
                <small>(${fullEpisodes} completos + ${Math.round((duration % 24))} min do próximo)</small>
            </div>
        </div>
    `;
}

// Evento de busca
document.getElementById('searchButton').addEventListener('click', () => {
    const query = document.getElementById('movieSearch').value.trim();
    if (query) searchMovies(query);
    else alert("Digite um filme!");
});
