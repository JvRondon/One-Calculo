const API_KEY = 'SUA_CHAVE_AQUI';

document.getElementById('searchButton').addEventListener('click', () => {
    const filme = document.getElementById('movieSearch').value.trim();

    if (!filme) {
        alert('Digite o nome de um filme');
        return;
    }

    console.log('Buscando filme:', filme);

    fetch(`https://api.themoviedb.org/3/search/movie?api_key=${API_KEY}&query=${encodeURIComponent(filme)}&language=pt-BR`)
        .then(response => response.json())
        .then(data => {
            console.log('Resultado:', data);
            alert(`Encontrado: ${data.results[0]?.title || 'Nenhum filme encontrado'}`);
        })
        .catch(err => {
            console.error('Erro:', err);
            alert('Erro ao buscar o filme.');
        });
});
