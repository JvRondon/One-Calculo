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

const suggestionsList = document.getElementById('suggestions');

// Digitação no campo
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
            li.innerHTML = `
                <img src="https://image.tmdb.org/t/p/w92${filme.poster_path}" alt="${filme.title}">
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

// Ocultar sugestões ao clicar fora
document.addEventListener('click', (e) => {
    if (!e.target.closest('.search-box')) {
        suggestionsList.innerHTML = '';
    }
});
