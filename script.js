var cityInputEl = document.querySelector(".cityForm");
var cityContainerEl = document.querySelector(".cityNameOutput");
var todayContainerEl = document.querySelector(".todayOutput");
var searchBtn = document.getElementById("button-addon2");
var previousSearch = document.querySelector(".currentCity");
var today = moment().format("L");

// event handler function for submitting city name in search
var formSubmitHandler = function (event) {
    event.preventDefault();

    var citySearch = cityInputEl.value.trim();

    if (citySearch) {
        getWeatherForecast(citySearch);

        cityContainerEl.textContent = '';
        cityInputEl.value = '';
    } else {
        alert('Please enter a City');
    }
    
    localStorage.setItem("searchCity", citySearch);
    localStorage.getItem("searchCity", citySearch);

    previousSearch.textContent = citySearch;
};

// function for fetching data w/ search input

var getWeatherForecast = function (location) {
    var apiUrl = 'http://api.openweathermap.org/data/2.5/weather?q=' +location + '&appid=ed583dd51a00da89e6929f4359d523e1&units=imperial';

    fetch(apiUrl)
        .then(function (response) {
            if (response.ok) {
                console.log(response);
                response.json().then (function (currentData) {
                    console.log(currentData);
                    displayCurrentConditions(currentData, location);
                });
            } else {
                alert('Error: ' + response.statusText);
            }
        })
        .catch(function (error) {
            alert('Unable to connect to OpenWeather');
        });
};

// function to display current forecast
var displayCurrentConditions = function (currentForecast, searchLocation) {
    if (currentForecast.length === 0) {
        todayContainerEl.textContent = 'No Weather Forecast Available.';
        return;
    } 
    cityContainerEl.textContent = currentForecast.name + " " + today;

    var temp = Math.round(currentForecast.main.temp);
    var wind = currentForecast.wind.speed;
    console.log(wind);
    var humidity = currentForecast.main.humidity;
    // var uvindex = currentForecast.CANNOT FIND IN CONSOLE OR SITE

    var displayTemp = document.querySelector(".temp");
    var displayWind = document.querySelector(".wind");
    var displayHumidity = document.querySelector(".humidity");
    // var displayUV = document.querySelector(".uvindex");

    displayTemp.textContent = "Temperature: " + temp + " degrees F";
    displayWind.textContent = "Wind: " + wind + " mph";
    displayHumidity.textContent = "Humidity: " + humidity + " %";
    // displayUV.textContent = "UV Index:" + displayUV;

    }




// click listener for button
searchBtn.addEventListener('click', formSubmitHandler);