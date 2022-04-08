var apiKey = "306788568658af908965e1ffaa757f64";
var cityInput = "Cairo";
var lat;
var lon;
var icon;
var weatherInfo;

var cities = [];

var searchBtn = document.querySelector("#search-btn");
var searchBar = document.querySelector("#search-bar");
var searchList = document.querySelector("#search-list");

function loadCityData() {
    // get city data from local storage
    if (!localStorage.getItem("cities")) {
        localStorage.setItem("cities", JSON.stringify(cities));
    } else {
        cities = JSON.parse(localStorage.getItem("cities"));
        loadCities();
    }
}

function loadCities() {
    // create previous searches
    for (var i = cities.length-1; i >= 0; i--) {
        // create a list item
        var li = document.createElement("li");

        // create a button
        var btn = document.createElement("button");
        btn.setAttribute("type", "button");
        btn.classList.add("p-search");
        btn.innerHTML = cities[i];
        // append to list item
        li.appendChild(btn);

        //append li to searchList
        searchList.appendChild(li);
    }
}

// get weather info from city
function getWeatherInfo(url) {
fetch(url)
.then(function (response){
    return response.json();
}).then(function(data){
    console.log(data);
    icon = getIcon(data.current.weather[0]);
}).catch(function(error){
    console.log(error.message);
})
}

function getIcon(day) {
    var tempIcon = day.icon;
    tempIcon = "http://openweathermap.org/img/wn/" + tempIcon + "@2x.png";
    return tempIcon;
}

// get coorinates of a city
function getCoords(city) {
    var cityUrl ="http://api.openweathermap.org/geo/1.0/direct?q="+ city + "&limit=1&appid=" + apiKey;

    // fetch city coordinates
    fetch(cityUrl)
    .then(function (response){
        return response.json();
    }).then(function(data){
        if (data.length !== 0){
            // set latitude and longitude
            lat = data[0].lat;
            lon = data[0].lon;
            // create url to fetch
            var weatherUrl = "https://api.openweathermap.org/data/2.5/onecall?lat="+ lat +"&lon="+ lon +"&exclude=minutely,hourly,alerts&appid=" + apiKey + "&units=imperial";
            getWeatherInfo(weatherUrl);
        } else {
            console.log("City not found");
        }
    }).catch(function(error){
        console.log(error.message);
    })

}

function appendPreviousSearch(city) {
    var recentLi = searchList.querySelector("li");
    
    // create new list item
    var li = document.createElement("li");

    // create a button
    var btn = document.createElement("button");
    btn.setAttribute("type", "button");
    btn.classList.add("p-search");
    btn.innerHTML = city;
    // append to list item
    li.appendChild(btn);

    // insert list item at top of list
    searchList.insertBefore(li, recentLi);

    // append city to cities and update localStorage
    cities.push(city);
    localStorage.setItem("cities", JSON.stringify(cities));
}

// event listeners
searchBtn.addEventListener("click", function(event){
    event.preventDefault();

    // check if search bar contains any information
    if (searchBar.value){
        getCoords(searchBar.value);
        appendPreviousSearch(searchBar.value);
        searchBar.value = "";
    } else {
        console.log("No value detected")
    }
})

searchList.addEventListener("click", function(event){
    if (event.target.getAttribute("class") === "p-search") {
        var city = event.target.innerHTML;
        getCoords(city);
        appendPreviousSearch(city);
    }
})

loadCityData();
// getInfo(cityUrl);
// getCoords(cityInput);
