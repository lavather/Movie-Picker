// declaration of all my consts and variables i need throughout the code

const searchField=document.getElementById("search-field")
const searchBtn=document.getElementById("search-btn")
const section=document.getElementById("section")
let pageCounter=1
let searchWord=""
var filename=location.pathname
let moviesArray = [];
const apiKey="c53395f1"


//declaration of all my event listeners

window.addEventListener("keypress", (e) => e.key === "Enter" ? handleSearch() : null);

searchBtn.addEventListener("click", handleSearch )

window.addEventListener("click", (e) => {
    e.target.id === "watchlist-link" ? (window.location.href = "watchlist.html", handleRenderWatchlist()) : null
    e.target.id === "next-btn" ? (pageCounter++, section.innerHTML = "", getSearch(searchWord)) :
    e.target.id === "previous-btn" ? (pageCounter--, section.innerHTML = "", getSearch(searchWord)) : null;
});


//search functions for button click and the actual search on the api 
//(with await we wait until the response is finished, this way we dont have to deal with half fulfilled data)

function handleSearch() {
    section.innerHTML = "";
    searchWord = searchField.value ? (pageCounter = 1, searchField.value) : searchWord;
    getSearch(searchWord);
    searchField.value = "";
    searchWord=""
} 

async function getSearch(x) {
    const response = await fetch(`https://www.omdbapi.com/?s=${x}&page=${pageCounter}&apikey=${apiKey}`);
    const data = await response.json();    
    const eintrag = data.Search;
    const promises = eintrag.map(async function(entry) {           
        const movieResponse = await fetch(`https://www.omdbapi.com/?i=${entry.imdbID}&plot=full&apikey=${apiKey}`);
        const movieData = await movieResponse.json();
        return movieData;
    });
        
    const movieDetails = await Promise.all(promises);
    renderResults(movieDetails)
}


//rendering search results in the dom by placing data in an object 
//and saving that to an array we can use later, this way we dont have to annoy the api constantly
//then taking the data out of the finished array to display

function renderResults(y) {
    // Create an array to hold the movie objects
    moviesArray = [];

    y.forEach(function(x) {
        // Extract data for the movie object
        let movie = {
            id: x.imdbID,
            rating: x.Ratings[0]?.Value || "N/A",
            poster: x.Poster !== "N/A" ? x.Poster : "images/No-image.svg",
            title: x.Title,
            runtime: x.Runtime,
            genre: x.Genre,
            plot: x.Plot,
        };

        // Push the movie object into the moviesArray
        moviesArray.push(movie);
        
    });

    handleRenderingArray(moviesArray)

    // Add event listener to each watchlist button
    document.querySelectorAll('.watchlist-btn').forEach(button => {
        button.addEventListener('click', handleWatchlistClick);
    });
}

function handleRenderingArray(x){
    // Retrieve watchlistArray from local storage
    const watchlistArray = retrieveLocalStorage();

    let htmlContent = "";
    x.forEach(function(movie) {
        const buttonHTML = renderWatchlistButton(movie, watchlistArray);

        htmlContent += `
            <div data-id="${movie.id}" class="results">
                <img src="${movie.poster}" class="poster"/>
                <div class="details">
                    <div class="movie-name-rating">
                        <h2>${movie.title}</h2>
                        <p class="no-margin-top"><i class="fas fa-star" style="color: yellow;"></i>${movie.rating}</p>
                    </div>
                    <div class="length-tags-watch">
                        <p>${movie.runtime}</p>
                        <p>${movie.genre}</p>
                        <div class="align-centre">
                            <i class="fa-solid fa-circle-plus"></i>
                            ${buttonHTML}
                        </div>
                    </div>
                    <div class="plot">${movie.plot}</div>
                </div>
            </div>`;
    });
    section.innerHTML = `${htmlContent}<div class="more"><button id="previous-btn">PREV 10</button><button id="next-btn">NEXT 10</button>`;
}


// the watchlist button takes its own id (same as the imdb ID for its corresponding movie)
// searches the moviesarray we just generated in the search and gets all the data off that object
// and places it in the localstorage array, it then disables itself so it cant be clicked again
// sponsored by chatGPT

function handleWatchlistClick() {
    const dataId = this.id;

    // Find the corresponding movie object in the moviesArray
    const movie = moviesArray.find(movie => movie.id === dataId);

    // Retrieve the watchlistArray from local storage
    let watchlistArray = retrieveLocalStorage();

    // Add the movie to the watchlistArray
    watchlistArray.push(movie);

    // Update the local storage with the updated watchlistArray
    localStorage.setItem("storedMovies", JSON.stringify(watchlistArray));

    // Disable the clicked button
    this.disabled = true;
}


//since i check against localstorage often, i thought a separate function would be good

function retrieveLocalStorage() {
    const storedData = localStorage.getItem("storedMovies");
    return storedData ? JSON.parse(storedData) : [];
}


// these functions take the watchlistarray from localstorage 
//and the moviesarray we generated before displaying the results on the dom
//it then check if any of the ids match
// if not, then they place the normal watchlist button, if they do exist, they place a disabled watchlist button
//this function is called before rendering results on the dom

function isMovieWatchlisted(movie, watchlistArray) {
    return watchlistArray.some(item => item.id === movie.id);
}

function renderWatchlistButton(movie, watchlistArray) {
    const isWatchlisted = isMovieWatchlisted(movie, watchlistArray);
    return isWatchlisted ? `<button id="${movie.id}" class="watchlist-btn" disabled>Add to Watchlist</button>` : `<button id="${movie.id}" class="watchlist-btn">Add to Watchlist</button>`;
}





