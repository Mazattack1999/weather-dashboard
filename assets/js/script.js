var apiKey = "306788568658af908965e1ffaa757f64";
var cityInput = "Irmo";
var lat;
var lon;
var weatherUrl = "https://api.openweathermap.org/data/2.5/onecall?lat=20&lon=86&exclude=minutely,hourly,alerts&appid=" + apiKey + "&units=imperial";

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

// return data from url
function getInfo(url) {
fetch(url)
.then(function (response){
    return response.json();
}).then(function(data){
    console.log(data);
    return data;
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
        } else {
            console.log("City not found");
        }
    }).catch(function(error){
        console.log(error.message);
    })

}

// getInfo(cityUrl);
getCoords(cityInput);









