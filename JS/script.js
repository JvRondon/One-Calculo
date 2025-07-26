function showResults(movie) {
    // Garante que temos uma duração válida (mínimo 1 minuto)
    const duration = Math.max(movie.runtime || 120, 1);
    const episodes = (duration / 24).toFixed(1);
    const fullEpisodes = Math.floor(duration / 24);
    
    // Imagem do filme
    let posterUrl = 'https://i.imgur.com/JuMqQEg.png'; // Imagem padrão
    if (movie.poster_path && !movie.poster_path.includes('undefined')) {
        posterUrl = `https://image.tmdb.org/t/p/w300${movie.poster_path}`;
    }
    
    // Formata os números de episódios
    let episodesHTML = '';
    const maxPerLine = 5;
    for (let i = 1; i <= fullEpisodes; i++) {
        episodesHTML += `<span class="episode-number">${i}</span>`;
        if (i % maxPerLine === 0 && i !== fullEpisodes) {
            episodesHTML += '<br>';
        }
    }
    
    // Exibe os resultados
    resultsDiv.innerHTML = `
        <div class="movie-card">
            <img src="${posterUrl}" 
                 alt="${movie.title}"
                 class="poster"
                 onerror="this.src='https://i.imgur.com/JuMqQEg.png'">
            
            <h3>${movie.title}</h3>
            <p class="duration">⏱️ ${duration} minutos</p>
            
            <div class="one-piece-result">
                <p class="episode-count">☠️ <strong>${episodes}</strong> episódios de One Piece</p>
                <div class="episodes-container">
                    ${episodesHTML}
                </div>
                <small class="complete-episodes">(${fullEpisodes} completos)</small>
            </div>
        </div>
    `;
}
