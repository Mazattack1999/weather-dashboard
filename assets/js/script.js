var apiKey = "306788568658af908965e1ffaa757f64";
var cityInput = "Irmo";
var lat;
var lon;
var weatherInfo;

var cities = [];
// emojis from https://emojipedia.org/search/?q=weather
var weatherEmojis = ["☁️","🌡️","🌫️","❄️", "🌨️", "⛅",   ]; 

function loadCityData() {
    // get city data from local storage
    if (!localStorage.getItem("cities")) {
        localStorage.setItem("cities", JSON.stringify(cities));
    } else {
        cities = JSON.parse(localStorage.getItem("cities"));
    }
}

// get weather info from city
function getWeatherInfo(url) {
fetch(url)
.then(function (response){
    return response.json();
}).then(function(data){
    console.log(data);
}).catch(function(error){
    console.log(error.message);
})
}

// get coorinates of a city
function getCoords(city) {
    var cityUrl ="http://api.openweathermap.org/geo/1.0/direct?q="+ city + "&limit=1&appid=" + apiKey;

    // fetch city coordinates
    fetch(cityUrl)
    .then(function (response){
        return response.json();
    }).then(function(data){
        console.log(data);
        if (data.length !== 0){
            // set latitude and longitude
            lat = data[0].lat;
            lon = data[0].lon;
            console.log(lat, lon);
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

// getInfo(cityUrl);
getCoords(cityInput);









