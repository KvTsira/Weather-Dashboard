// Get key Items
let cityName = document.getElementById("city"); 
let citiesList = []; 
let todayDate = document.getElementById("todayDate");
let cityForm = document.getElementById("formCity"); 
let buttons = document.getElementById("buttons"); 
let cityEl = document.querySelector("#searchedCity"); 



// GET WEATHER FOR TODAY DISPLAY
let getWeather = (city) => {
  fetch("https://api.openweathermap.org/data/2.5/weather?q=" + city + "&units=imperial&appid=4204bfdd6f4f063ef67429ec56df1142")
    .then((response) => {
        response.json()
          .then((data) => {
              // getWeather => showWeather
              showWeather(data, city);
            });
      });
};

// get future forecats + UVI data
let getForecast = (city) => {
  fetch("https://api.openweathermap.org/data/2.5/forecast?q=" + city + "&units=imperial&appid=4204bfdd6f4f063ef67429ec56df1142")
    .then((response) => {
      response.json()
        .then((data) => {
          // getForecast => showForecast
          showForecast(data, city);
          //get city coordinates
          let lat = data.city.coord.lat;
          let lon = data.city.coord.lon;
          // get UV data based on city coordinates
          let getTodayUV = (city) => {
            fetch("https://api.openweathermap.org/data/2.5/uvi?lat=" + lat + "&lon=" + lon + "&appid=4204bfdd6f4f063ef67429ec56df1142")
              .then((response) => {
                response.json()
                  .then((data) => {
                    // SET COLOR CODED CLASS BASED ON UV VALUE
                    document.getElementById("todayUV").innerHTML = data.value;
                    if(data.value <= 3) {
                      document.getElementById("todayUV").setAttribute("class", "favorableLevel");
                    } else if(data.value > 3 && data.value <=10) {
                      document.getElementById("todayUV").setAttribute("class", "moderateLevel");
                    } else { 
                      document.getElementById("todayUV").setAttribute("class", "severeLevel");
                    };
                  });
              });
          };
          getTodayUV();
        });
    });
};

// submit the city search and store the search item
// submitQuery 
let submitQuery = (event) => {
    event.preventDefault();
    let cityEl = cityName.value.trim();
    let btn = document.createElement("button"); 
    btn.className = "searched-list btn";
    btn.innerHTML = cityEl; 
    buttons.appendChild(btn);
    listCity();
    if(!citiesList.includes(cityEl) && (cityEl != "")) {
        citiesList.push(cityEl);
    };
    localStorage.setItem("citiesList", JSON.stringify(citiesList));
    if(cityEl) {
        getWeather(cityEl);
        getForecast(cityEl);
        cityName.value = "";
    } else {
        alert("Enter a city name to get the weather!");
    }
};

// recent searches
let listCity = () => {
    citiesList = JSON.parse(localStorage.getItem("citiesList"));
    if(!citiesList) {
        citiesList = [];
    };
};

// add a bbuttom for recent search items
let addList = () => {
    for(var i = 0; i < citiesList.length; i++) {
        let btn = document.createElement("button");
        btn.className = "searched-list btn"; 
        btn.innerHTML = citiesList[i];
        buttons.appendChild(btn); 
    };

  // use recent search buttons
  let listButtons = document.querySelectorAll(".searched-list");
    for(var i = 0; i < listButtons.length; i++) {
    listButtons[i].addEventListener("click", (event) => {
        getWeather(event.target.textContent);
        getForecast(event.target.textContent);
    })
    }
};

// current weather
todayDate.textContent = moment()
  .format("dddd, MMMM Do, h:mm a");

// getWeather (API Call) => showWeather
let showWeather = (weather, searchQuery) => {
    cityEl.textContent = searchQuery;
    document.getElementById("todayIcon").src = "http://openweathermap.org/img/wn/" + weather.weather[0].icon + ".png"; // changeout icon set in future, here and forecast
    document.getElementById("todayTemp").innerHTML = weather.main.temp;
    document.getElementById("todayHumidity").innerHTML = weather.main.humidity;
    document.getElementById("todayWind").innerHTML = weather.wind.speed;
};

// 5 day forecast
document.getElementById("day1").innerHTML = moment().add(1, "d").format("MMMM Do");
document.getElementById("day2").innerHTML = moment().add(2, "d").format("MMMM Do");
document.getElementById("day3").innerHTML = moment().add(3, "d").format("MMMM Do");
document.getElementById("day4").innerHTML = moment().add(4, "d").format("MMMM Do");
document.getElementById("day5").innerHTML = moment().add(5, "d").format("MMMM Do");


// getForecast (API Call) => showForecast
let showForecast = (forecast, searchQuery) => {
    cityEl.textContent = searchQuery;
    var x=4
    //loop to show the 5 days forecast
    for (i=1; i<=5; i++){
        console.log(forecast.list[x]);
        console.log(forecast.list[x].weather[0].icon);
        document.getElementById("temp" + i).innerHTML = forecast.list[x].main.temp;
        document.getElementById("wind" + i).innerHTML = forecast.list[x].wind.speed;
        document.getElementById("humidity" + i).innerHTML = forecast.list[x].main.humidity;
        iconElx = forecast.list[x].weather[0].icon;
        document.getElementById("img" + i).src = "http://openweathermap.org/img/wn/" + forecast.list[x].weather[0].icon+".png";
        x=x+8;
    }
};

// listen => submitQuery
cityForm.addEventListener("submit", submitQuery);
listCity();
addList();

// Open with default city selection
getWeather("West Springfield");
getForecast("West Springfield");