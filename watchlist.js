const searchField=document.getElementById("search-field")
const searchBtn=document.getElementById("search-btn")
const section=document.getElementById("section")
let pageCounter=1
let searchWord=""
var filename=location.pathname
const apiKey="c53395f1"


//single event listener for the html page swap

window.addEventListener("click", (e) => {
    e.target.id === "Title-text" ? window.location.href = "index.html" : null
})


//render watchlist needs to be called as soon as we open the watchlist

handleRenderWatchlist()


//rendering the watchlist by taking the localstorage saved array of objects and displaying the stored data

function handleRenderWatchlist(){
    let htmlContent = "";
    const watchlistArray = retrieveLocalStorage();

    watchlistArray.forEach(function(movie) {
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
                            <i class="fa-solid fa-circle-minus"></i>
                            <button id="${movie.id}" class="remove-btn">Remove from Watchlist</button>
                        </div>
                    </div>
                    <div class="plot">${movie.plot}</div>
                </div>
            </div>`;
    });
    section.innerHTML = htmlContent;
    // Add event listener to each remove button
    document.querySelectorAll('.remove-btn').forEach(button => {
        button.addEventListener('click', handleRemoveClick);
    });
}


//removing movies by taking the button-ids (same as movie IDs), checking for matches and then snipping the match out
//store that in localstorage and refresh the page

function handleRemoveClick() {
    const dataId = this.id;

    // Retrieve the watchlistArray from local storage
    let watchlistArray = retrieveLocalStorage();

    // Find the index of the movie with the given id in the watchlistArray
    const index = watchlistArray.findIndex(movie => movie.id === dataId);

    // Remove the movie if found, otherwise log an error
    index !== -1 ? (
        watchlistArray.splice(index, 1),
        localStorage.setItem("storedMovies", JSON.stringify(watchlistArray)),
        location.reload()
    ) : console.error("Movie not found in watchlist.");
}

function retrieveLocalStorage() {
    const storedData = localStorage.getItem("storedMovies");
    return storedData ? JSON.parse(storedData) : [];
}








