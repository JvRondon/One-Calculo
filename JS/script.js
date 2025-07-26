// Configurações da API - Versão Netlify
const TMDB_API_KEY = '9dc4fbf1b311b95209a262062220cca2'; // Chave V3
const TMDB_API_TOKEN = 'eyJhbGciOiJIUzI1NiJ9.eyJhdWQiOiI5ZGM0ZmJmMWIzMTFiOTUyMDlhMjYyMDYyMjIwY2NhMiIsInN1YiI6IjY4ODQzMzZmNmEzODA0YzIwZTE2YjllZiIsInNjb3BlcyI6WyJhcGlfcmVhZCJdLCJ2ZXJzaW9uIjoxfQ._wsj-xGue5fRNzh7iAcVIi1O01K5vPTawM-0bVHJSy4'; // Token V4

// Elementos DOM
const searchBtn = document.getElementById('searchButton');
const movieInput = document.getElementById('movieSearch');
const resultsDiv = document.getElementById('results');

// Função principal
async function handleSearch() {
    const query = movieInput.value.trim();
    if (!query) return showError("Digite um filme!");

    try {
        showLoading(query);
        
        // 1. Busca o filme (API Key V3)
        const searchUrl = `https://api.themoviedb.org/3/search/movie?api_key=${TMDB_API_KEY}&query=${encodeURIComponent(query)}&language=pt-BR`;
        const searchData = await fetchApi(searchUrl);
        
        if (!searchData.results?.length) throw new Error("Nenhum filme encontrado");
        
        // 2. Busca detalhes (Token V4)
        const movieId = searchData.results[0].id;
        const detailsUrl = `https://api.themoviedb.org/3/movie/${movieId}?language=pt-BR`;
        const movieDetails = await fetchApi(detailsUrl, true);
        
        showResults(movieDetails);
    } catch (error) {
        console.error("Erro na busca:", error);
        showError(error.message.includes("401") ? 
            "Problema de autenticação. Atualize a página." : 
            error.message);
    }
}

// Função de fetch com tratamento de CORS
async function fetchApi(url, useToken = false) {
    const options = useToken ? {
        headers: {
            'Authorization': `Bearer ${TMDB_API_TOKEN}`,
            'accept': 'application/json'
        }
    } : {};
    
    // Solução CORS para Netlify
    try {
        const response = await fetch(url, options);
        if (!response.ok) {
            const errorData = await response.json();
            throw new Error(errorData.status_message || `Erro ${response.status}`);
        }
        return await response.json();
    } catch (error) {
        // Fallback com proxy se houver erro de CORS
        const proxyUrl = `https://api.allorigins.win/get?url=${encodeURIComponent(url)}`;
        const proxyResponse = await fetch(proxyUrl);
        const data = await proxyResponse.json();
        
        if (data.contents) {
            return JSON.parse(data.contents);
        }
        throw new Error("Erro ao acessar a API");
    }
}

// Exibir loading
function showLoading(query) {
    resultsDiv.innerHTML = `
        <div class="loading">
            <i class="fas fa-spinner fa-spin"></i>
            <p>Buscando "${query}"...</p>
        </div>
    `;
}

// Exibir resultados
function showResults(movie) {
    const duration = movie.runtime || 120;
    const episodes = (duration / 24).toFixed(1);
    const fullEpisodes = Math.floor(duration / 24);

    resultsDiv.innerHTML = `
        <div class="movie-card">
            <img src="${movie.poster_path ? 
                `https://image.tmdb.org/t/p/w300${movie.poster_path}` : 
                'https://i.imgur.com/JuMqQEg.png'}" 
                alt="${movie.title}"
                class="poster"
                onerror="this.src='https://i.imgur.com/JuMqQEg.png'">
            
            <h3>${movie.title}</h3>
            <p>⏱️ ${duration} minutos</p>
            
            <div class="one-piece-result">
                <p>☠️ <strong>${episodes}</strong> episódios de One Piece</p>
                <div class="episodes">
                    ${Array.from({length: fullEpisodes}, (_, i) => 
                        `<span>${i+1}</span>`).join('')}
                </div>
                <small>(${fullEpisodes} completos)</small>
            </div>
        </div>
    `;
}

// Exibir erro
function showError(message) {
    resultsDiv.innerHTML = `
        <div class="error">
            <i class="fas fa-exclamation-triangle"></i>
            <p>${message}</p>
            <button onclick="window.location.reload()">Tentar novamente</button>
        </div>
    `;
}

// Event listeners
searchBtn.addEventListener('click', handleSearch);
movieInput.addEventListener('keypress', (e) => {
    if (e.key === 'Enter') handleSearch();
});
