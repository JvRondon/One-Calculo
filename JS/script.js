const API_KEY = '9dc4fbf1b311b95209a262062220cca2';
const API_TOKEN = 'eyJhbGciOiJIUzI1NiJ9.eyJhdWQiOiI5ZGM0ZmJmMWIzMTFiOTUyMDlhMjYyMDYyMjIwY2NhMiIsInN1YiI6IjY4ODQzMzZmNmEzODA0YzIwZTE2YjllZiIsInNjb3BlcyI6WyJhcGlfcmVhZCJdLCJ2ZXJzaW9uIjoxfQ._wsj-xGue5fRNzh7iAcVIi1O01K5vPTawM-0bVHJSy4'; // Token de acesso v4

document.getElementById('searchButton').addEventListener('click', async () => {
    const query = document.getElementById('movieSearch').value.trim();
    if (!query) return alert("Digite um filme!");

    try {
        document.getElementById('results').innerHTML = `
            <div class="loading">
                <i class="fas fa-spinner"></i>
                <p>Procurando "${query}"...</p>
            </div>
        `;

        // 1. Busca o ID do filme
        const searchResponse = await fetch(
            `https://api.themoviedb.org/3/search/movie?query=${encodeURIComponent(query)}&language=pt-BR&page=1`,
            {
                headers: {
                    'Authorization': `Bearer ${API_TOKEN}`,
                    'accept': 'application/json'
                }
            }
        );

        if (!searchResponse.ok) throw new Error('Filme não encontrado');
        
        const searchData = await searchResponse.json();
        if (!searchData.results || searchData.results.length === 0) {
            throw new Error('Nenhum filme encontrado');
        }

        // 2. Pega os detalhes (incluindo duração)
        const movieId = searchData.results[0].id;
        const detailsResponse = await fetch(
            `https://api.themoviedb.org/3/movie/${movieId}?language=pt-BR`,
            {
                headers: {
                    'Authorization': `Bearer ${API_TOKEN}`,
                    'accept': 'application/json'
                }
            }
        );

        if (!detailsResponse.ok) throw new Error('Erro ao buscar detalhes');
        
        const movie = await detailsResponse.json();
        showResults(movie);

    } catch (error) {
        console.error("Erro:", error);
        document.getElementById('results').innerHTML = `
            <div class="error">
                <i class="fas fa-exclamation-triangle"></i>
                <h3>Erro!</h3>
                <p>${error.message}</p>
                <button onclick="window.location.reload()">Tentar novamente</button>
            </div>
        `;
    }
});

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
                <p>Você poderia assistir:</p>
                
                <div class="episodes-container">
                    ${Array(fullEpisodes).fill().map((_, i) => `<div class="episode">${i+1}</div>`).join('')}
                </div>
                
                <p><small>Cada episódio tem ~24 minutos</small></p>
            </div>
        </div>
    `;
}
