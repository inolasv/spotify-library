

// Gets the top 7 genres that the user listens to based on the genres of their top 5 artists
export const getUsersTopGenres = async (topArtists) => {

    const genres = new Map();

    for (let artist of topArtists.items) {
        for(let genre of artist.genres) {
            if (genres.get(genre) === undefined) {
                genres.set(genre, 1)
            } else {
                genres.set(genre, genres.get(genre) + 1)
            }
        }
    }

    const sortedGenres = new Map([...genres.entries()].sort((x, y) => y[1] - x[1]));
    const topGenres = [ ...sortedGenres.keys() ].slice(0, 4)
    
    return topGenres;

}
