var apiKey = "306788568658af908965e1ffaa757f64";
var lat;
var lon;
var icon;
var weatherInfo;

var cities = [];

var searchBtn = document.querySelector("#search-btn");
var searchBar = document.querySelector("#search-bar");
var searchList = document.querySelector("#search-list");

var currentSection = document.querySelector(".current-forecast");
var currentSectionInfo = document.querySelector(".current-forecast-info");
var futureSection = document.querySelector(".future-forecast");
var futureSectionInfo = document.querySelector(".future-forecast-info");


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
    displayWeatherInfo(data);
}).catch(function(error){
    console.log(error.message);
})
}

function displayWeatherInfo (data) {
    // start with current day
    var city = cities[cities.length-1];
    var date = moment().format("MM/DD/YYYY");
    var icon = getIcon(data.current.weather[0]);
    var temp = data.current.temp;
    var wind = data.current.wind_speed;
    var hum = data.current.humidity;
    
    // set section title
    var currentTitle = currentSection.querySelector(".current-header");
    currentTitle.innerHTML = city + " (" + date + ") <img src="+ icon + " width=40px height=40px>";
    //delete old info
    if (currentSectionInfo) {
        currentSectionInfo.remove();
    }
    // create new info conatiner
    currentSectionInfo = document.createElement("div");
    currentSectionInfo.classList.add("current-forecast-info");
    // load tempurature, wind, and humidity
    loadTWH(temp, wind, hum, currentSectionInfo);

    // create UV p
    var uvContent = document.createElement("p");
    uvContent.innerHTML = "UV Index: <span>" + data.current.uvi + "</span>";
    var uvSpan = uvContent.querySelector("span");
    uvSpan.classList.add("uv");
    
    if (data.current.uvi > 5) {
        // severe
        uvSpan.classList.add("uv-sev");
    } else if (data.current.uvi > 2) {
        // moderate
        uvSpan.classList.add("uv-mod");
    } else {
        uvSpan.classList.add("uv-fav");
    }

    //append to currentSectionInfo
    currentSectionInfo.appendChild(uvContent);


    //append to currentSection
    currentSection.appendChild(currentSectionInfo);

    // display 5-day forcast cards
    displayFutureForecast(data);

}

function displayFutureForecast(data) {
    var forecast = data.daily;

     // delete old info
     if (futureSectionInfo){
        futureSectionInfo.remove();
    }

    // create new card container
    futureSectionInfo = document.createElement("div");
    futureSectionInfo.setAttribute("id", "card-container");

    var temp;
    var wind;
    var hum;
    var section;
    var tDate;
    var tIcon;

    for (var i = 1; i < 6; i++) {
        // create card 
        section = document.createElement("div");
        section.classList.add("card");

        // create date element
        tDate = document.createElement("h4");
        tDate.innerHTML = moment().add(i, 'd').format("MM/DD/YYYY");
        section.appendChild(tDate);

        // create icon element
        tIcon = document.createElement("img");
        tIcon.setAttribute("src", getIcon(forecast[i].weather[0]));
        section.appendChild(tIcon);

        // get temp, wind, and hum for day being checked
        temp = forecast[i].temp.day;
        wind = forecast[i].wind_speed;
        hum = forecast[i].humidity;
        loadTWH(temp, wind, hum, section);

        // append section to card container
        futureSectionInfo.appendChild(section);
    }

    // append card container to future info
    futureSection.appendChild(futureSectionInfo);


}

// load tempurature, wind, and humidity
function loadTWH (temp, wind, hum, section) {
    // create temp p
    tContent = document.createElement("p");
    tContent.innerHTML = "Temp: " + temp + "°F";
    section.appendChild(tContent);

    // create wind p
    wContent = document.createElement("p");
    wContent.innerHTML = "Wind: " + wind + " MPH";
    section.appendChild(wContent);

    // create hum p
    hContent = document.createElement("p");
    hContent.innerHTML = "Humidity: " + hum + "%";
    section.appendChild(hContent);

}

function getIcon(day) {
    var tempIcon = day.icon;
    tempIcon = "https://openweathermap.org/img/wn/" + tempIcon + "@2x.png";
    return tempIcon;
}

// get coorinates of a city
function getCoords(city) {
    var cityUrl ="https://api.openweathermap.org/geo/1.0/direct?q="+ city + "&limit=1&appid=" + apiKey;

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
            // currentSection.querySelector(".current-header").innerHTML = "City Not Found";
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
// load data of most recent searched city if any have been searched
if (cities.length > 0){
    getCoords(cities[cities.length-1]);
}


