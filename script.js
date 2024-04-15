document.addEventListener('DOMContentLoaded', function() {
    fetchMediaTypes();
    fetchGenres('movie'); // Fetch genres for 'Movies' initially
    fetchYears();
});

function fetchMediaTypes() {
    const mediaTypes = ['movies', 'tv', 'person'];
    const mediaTypeLabels = ['Movies', 'TV Shows', 'Music'];
    const mediaTypeDropdown = document.getElementById('media-type');

    mediaTypes.forEach((type, index) => {
        const option = document.createElement('option');
        option.value = type;
        option.textContent = mediaTypeLabels[index];
        mediaTypeDropdown.appendChild(option);
    });
}

// Function to fetch genres for a given media type
function fetchGenres(mediaType) {
    const url = `https://api.themoviedb.org/3/genre/${mediaType}/list?api_key=95f2c5fe28ba4637cb113a994db89623&language=en`;

    fetch(url)
    .then(response => response.json())
    .then(data => {
        const genreDropdown = document.getElementById('genre');
        genreDropdown.innerHTML = '';
        data.genres.forEach(genre => {
            const option = document.createElement('option');
            option.value = genre.id;
            option.textContent = genre.name;
            genreDropdown.appendChild(option);
        });
    })
    .catch(error => console.error(`Error fetching ${mediaType} genres:`, error));
}

function fetchYears() {
    const currentYear = new Date().getFullYear();
    const yearDropdown = document.getElementById('year');
    for (let year = currentYear; year >= 1900; year--) {
        const option = document.createElement('option');
        option.value = year;
        option.textContent = year;
        yearDropdown.appendChild(option);
    }
}

function fetchMedia() {
    let mediaType = document.getElementById('media-type').value;
    if (mediaType.toLowerCase() === 'movies') {
        mediaType = 'movie';
    }
    const genreId = document.getElementById('genre').value;
    const year = document.getElementById('year').value;

    const url = `https://api.themoviedb.org/3/discover/${mediaType}?api_key=95f2c5fe28ba4637cb113a994db89623&language=en&sort_by=popularity.desc&with_genres=${genreId}&primary_release_year=${year}`;

    fetch(url)
    .then(response => response.json())
    .then(data => {
        const mediaDetails = document.getElementById('media-details');
        mediaDetails.innerHTML = '';

        if (data.results.length > 0) {
            data.results.forEach(media => {
                const mediaDiv = document.createElement('div');
                mediaDiv.classList.add('media');
                mediaDiv.innerHTML = `
                    <h2>${media.title || media.name}</h2>
                    <p>${media.overview}</p>
                    <img src="https://image.tmdb.org/t/p/w500/${media.poster_path}" alt="${media.title || media.name} Poster">
                `;
                mediaDetails.appendChild(mediaDiv);
            });
        } else {
            mediaDetails.innerHTML = '<p>No media found.</p>';
        }
    })
    .catch(error => console.error(`Error fetching ${mediaType}:`, error));
}

// Event listener for media type dropdown
document.getElementById('media-type').addEventListener('change', function() {
    const mediaType = this.value;
    fetchGenres(mediaType); // Fetch genres whenever media type is changed
});

function searchMedia() {
    const searchTerm = document.getElementById('search').value.trim();

    if (searchTerm === '') {
        alert('Please enter a search term.');
        return;
    }

    const url = `https://api.themoviedb.org/3/search/multi?api_key=95f2c5fe28ba4637cb113a994db89623&language=en&query=${encodeURIComponent(searchTerm)}`;

    fetch(url)
    .then(response => response.json())
    .then(data => {
        const mediaDetails = document.getElementById('media-details');
        mediaDetails.innerHTML = '';

        if (data.results.length > 0) {
            data.results.forEach(media => {
                const mediaDiv = document.createElement('div');
                mediaDiv.classList.add('media');
                mediaDiv.innerHTML = `
                    <h2>${media.title || media.name}</h2>
                    <p>${media.overview}</p>
                    <img src="https://image.tmdb.org/t/p/w500/${media.poster_path}" alt="${media.title || media.name} Poster">
                `;
                mediaDetails.appendChild(mediaDiv);
            });
        } else {
            mediaDetails.innerHTML = '<p>No media found.</p>';
        }
    })
    .catch(error => console.error('Error searching media:', error));
}
