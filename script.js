var cityInputEl = document.querySelector(".cityForm");
var cityContainerEl = document.querySelector(".cityNameOutput");
var todayContainerEl = document.querySelector(".todayOutput");
var searchBtn = document.getElementById("button-addon2");
var previousSearch = document.querySelector(".cityHistory");
var today = moment().format("L");
var cards = document.querySelector(".card-deck")
var citySearches = [];

// event handler function for submitting city name in search
var formSubmitHandler = function (event) {
    event.preventDefault();
     
    var citySearch = cityInputEl.value.trim();

    if (citySearch) {
        getWeatherForecast(citySearch);
        previousSearch.innerHTML='';
        cards.innerHTML='';
        cityContainerEl.textContent = '';
        cityInputEl.value = '';
    } else {
        alert('Please enter a City');
    }


    // push city searched into array for storage
    citySearches.push(citySearch);
    storeCities(citySearches);
    renderCities();
    // getWeatherPredicition();
};

// local storage of city names searched
function storeCities () {
    localStorage.setItem("searchCity", JSON.stringify(citySearches));
};

// local storage retrieval of city names searched & rendering to page
function renderCities () {
    var renderSearches = JSON.parse(localStorage.getItem("searchCity"));
    // cityHistory.textContent = renderSearches;
   
    for (var i=0; i< renderSearches.length; i++) {
        var city = renderSearches[i];

        var li = document.createElement("li");
        li.textContent = citySearches[i];
        li.classList.add("list-group-item");
        previousSearch.appendChild(li)[i];

    };
}   
    
// function for fetching data w/ search input 
var getWeatherForecast = function (location) {
    var apiUrl = 'https://api.openweathermap.org/data/2.5/weather?q=' +location + '&appid=ed583dd51a00da89e6929f4359d523e1&units=imperial';

    fetch(apiUrl)
        .then(function (response) {
            if (response.ok) {
                console.log(response);
                response.json().then (function (currentData) {
                    console.log(currentData);
                    convertLatlon(currentData,location);
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

// function to display current forecast (less UV index)
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
   
    var displayTemp = document.querySelector(".temp");
    var displayWind = document.querySelector(".wind");
    var displayHumidity = document.querySelector(".humidity");
    

    displayTemp.textContent = "Temperature: " + temp + " degrees F";
    displayWind.textContent = "Wind: " + wind + " mph";
    displayHumidity.textContent = "Humidity: " + humidity + " %";

    cityContainerEl.classList.add("bg-primary");
    todayContainerEl.classList.add("bg-primary");
   

};

// retrieve lat long from city input & send fetch request using latLon
var convertLatlon = function (returnedInfo, cityNameSearched) {
       var latLon = {
           x: returnedInfo.coord.lat,
           y: returnedInfo.coord.lon,
       }
       console.log(latLon);
    
            var apiUrl2 = "https://api.openweathermap.org/data/2.5/onecall?lat="+ 
            latLon.x + 
            "&lon=" +
            latLon.y + 
            "&exclude=minutely,hourly,alerts&appid=ed583dd51a00da89e6929f4359d523e1&units=imperial";
        
            fetch(apiUrl2)
                .then(function (response2) {
                    if (response2.ok) {
                        console.log(response2);
                        response2.json().then (function (futureData) {
                            console.log(futureData);
                            showWeatherPredicition(futureData, location);
                        });
                    } else {
                        alert('Error: ' + response2.statusText);
                    }
                })
                .catch(function (error) {
                    alert('Unable to connect to OpenWeatherfor 5 Day Forecast');
                });

};

//  function to display current UV Index & 5 day forecast
var showWeatherPredicition = function (prediction, where) {
//    display UV in current card
    var uvindex = prediction.current.uvi;
    var displayUV = document.querySelector(".uvindex"); 
    displayUV.textContent = "UV Index: " + uvindex;

    // create array for forecast info
    var week = [prediction.daily[1], prediction.daily[2], prediction.daily[3], prediction.daily[4],prediction.daily[5]];    
    
// display 5 day forecast cards
    // convert unix date to short form date & display in card 

    for (var i=0; i < week.length; i++) {
        var unix = week[i].dt;
        var date = moment.unix(unix).format("L");
        console.log(date);
        var displayDate = document.createElement("div");
        displayDate.textContent = date;
        displayDate.classList.add("cdate");
        displayDate.classList.add("mb-3")
        displayDate.classList.add("bg-primary");
        cards.appendChild(displayDate);
        displayDate.classList.add("card");
                
        // display balance of info to cards
        // insert icon**Need help
        var displayIcon = document.createElement("img");
        var displayTempForecast = document.createElement("p");
        var displayWindForecast = document.createElement("p");
        var displayHumidityForecast = document.createElement("p");

        displayIcon.src = "https://openweathermap.org/img/wn/" + week[i].weather[0].icon + "@2x.png";
        displayTempForecast.textContent = "Temp: " + week[i].temp.day + " F";
        displayWindForecast.textContent = "Wind: " + week[i].wind_speed + " mph";
        displayHumidityForecast.textContent = "Humidity: " + week[i].humidity + " %";
        
        displayIcon.classList.add("climg");
        displayTempForecast.classList.add("ctemp");
        displayWindForecast.classList.add("cwind");
        displayHumidityForecast.classList.add("chumidity")
        
        
        displayDate.append(displayIcon);
        displayDate.append(displayTempForecast);
        displayTempForecast.append(displayWindForecast);
        displayWindForecast.append(displayHumidityForecast);
          
    };
};
     

// click listener for button
searchBtn.addEventListener('click', formSubmitHandler);
