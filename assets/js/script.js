// Get key Items
let cityName = document.getElementById("city"); // user input
let citiesList = []; // build list for local storage in empty array
let todayDate = document.getElementById("todayDate");
let cityForm = document.getElementById("formCity"); // form for input
let buttons = document.getElementById("buttons"); // buttons past search
let cityEl = document.querySelector("#searchedCity"); // city as displayed

// API CALLS

// GET WEATHER FOR TODAY DISPLAY
// My API Key: 4204bfdd6f4f063ef67429ec56df1142
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

// GET 5-DAY FORECAST + UV DATA
let getForecast = (city) => {
  fetch("https://api.openweathermap.org/data/2.5/forecast?q=" + city + "&units=imperial&appid=4204bfdd6f4f063ef67429ec56df1142")
    .then((response) => {
      response.json()
        .then((data) => {
          // getForecast => showForecast
          console.log(data);
          showForecast(data, city);
          // DEFINE LAT AND LON VALUES AS VARIABLES
          let lat = data.city.coord.lat;
          let lon = data.city.coord.lon;
          // GET UV DATA BASED ON CITY LAT/LON COORDINATES
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

// SUBMIT CITY SEARCH AND STORE CITY SEARCH

// submitQuery => listCity, getWeather, getForecast
let submitQuery = (event) => {
  event.preventDefault();
  let cityEl = cityName.value.trim();
  let btn = document.createElement("button"); // need to add in no blank button without this breaking
  btn.className = "searched-list btn";
  btn.innerHTML = cityEl; // need to add in no dupe button needed, maybe capitalization standardization
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

// PAST CITY SEARCHES
let listCity = () => {
  citiesList = JSON.parse(localStorage.getItem("citiesList"));
  if(!citiesList) {
    citiesList = [];
  };
};

// ADD BUTTONS TO SEARCH HISTORY
let addList = () => {
  for(var i = 0; i < citiesList.length; i++) {
    let btn = document.createElement("button");
    btn.className = "searched-list btn"; // one for identifying as list item, one for styling
    btn.innerHTML = citiesList[i];
    buttons.appendChild(btn); // maybe add a clear buttons option in future
  };

  // USE PAST SEARCH BUTTON
  let listButtons = document.querySelectorAll(".searched-list");
  for(var i = 0; i < listButtons.length; i++) {
    listButtons[i].addEventListener("click", (event) => {
      getWeather(event.target.textContent);
      getForecast(event.target.textContent);
    })
  }
};

// TODAY WEATHER
// Content for central weather feature
todayDate.textContent = moment()
  .format("dddd, MMMM Do, h:mm a");

// getWeather (API Call) => showWeather
let showWeather = (weather, searchQuery) => {
    cityEl.textContent = searchQuery;
    iconEl = weather.weather[0].icon;
    document.getElementById("todayIcon").src = "./assets/css/icons/" + iconEl + ".png"; // changeout icon set in future, here and forecast
    document.getElementById("todayTemp").innerHTML = weather.main.temp;
    document.getElementById("todayHumidity").innerHTML = weather.main.humidity;
    document.getElementById("todayWind").innerHTML = weather.wind.speed;
};

// 5 DAY FORECAST
document.getElementById("day1").innerHTML = moment().add(1, "d").format("MMMM Do");
document.getElementById("day2").innerHTML = moment().add(2, "d").format("MMMM Do");
document.getElementById("day3").innerHTML = moment().add(3, "d").format("MMMM Do");
document.getElementById("day4").innerHTML = moment().add(4, "d").format("MMMM Do");
document.getElementById("day5").innerHTML = moment().add(5, "d").format("MMMM Do");


// getForecast (API Call) => showForecast
let showForecast = (forecast, searchQuery) => {
    cityEl.textContent = searchQuery;
    var x=4
    for (i=1; i<=5; i++){
        console.log(x);
        document.getElementById("temp" + i).innerHTML = forecast.list[x].main.temp;
        document.getElementById("wind" + i).innerHTML = forecast.list[x].wind.speed;
        document.getElementById("humidity" + i).innerHTML = forecast.list[x].main.humidity;
        //iconEl1 = forecast.list[x].weather[0].icon;
        document.getElementById("img" + i).src = "./assets/css/icons/" + forecast.list[x].weather[0].icon; + ".png";
        x=x+8;
    }
    // day 1
    /*
    document.getElementById("temp1").innerHTML = forecast.list[4].main.temp;
    document.getElementById("wind1").innerHTML = forecast.list[4].wind.speed;
    document.getElementById("humidity1").innerHTML = forecast.list[4].main.humidity;
    iconEl1 = forecast.list[4].weather[0].icon;
    document.getElementById("img1").src = "./assets/css/icons/" + iconEl1 + ".png";
    // day 2
    document.getElementById("temp2").innerHTML = forecast.list[12].main.temp;
    document.getElementById("wind2").innerHTML = forecast.list[12].wind.speed;
    document.getElementById("humidity2").innerHTML = forecast.list[12].main.humidity;
    iconEl2 = forecast.list[12].weather[0].icon;
    document.getElementById("img2").src = "./assets/css/icons/"  + iconEl2 + ".png";
    // day 3
    document.getElementById("temp3").innerHTML = forecast.list[20].main.temp;
    document.getElementById("wind3").innerHTML = forecast.list[20].wind.speed;
    document.getElementById("humidity3").innerHTML = forecast.list[20].main.humidity;
    iconEl3 = forecast.list[20].weather[0].icon;
    document.getElementById("img3").src = "./assets/css/icons/" + iconEl3 + ".png";
    // day 4
    document.getElementById("temp4").innerHTML = forecast.list[28].main.temp;
    document.getElementById("wind4").innerHTML = forecast.list[28].wind.speed;
    document.getElementById("humidity4").innerHTML = forecast.list[28].main.humidity;
    iconEl4 = forecast.list[28].weather[0].icon;
    document.getElementById("img4") .src = "./assets/css/icons/" + iconEl4 + ".png";
    // day 5
    document.getElementById("temp5").innerHTML = forecast.list[36].main.temp;
    document.getElementById("wind5").innerHTML = forecast.list[36].wind.speed;
    document.getElementById("humidity5").innerHTML = forecast.list[36].main.humidity;
    iconEl5 = forecast.list[36].weather[0].icon;
    document.getElementById("img5").src = "./assets/css/icons/" + iconEl5 + ".png";
    */
  // end 5 day Forecast
};

// LISTEN FOR CITY FORM SUBMISSION
// listen => submitQuery
cityForm.addEventListener("submit", submitQuery);
listCity();
addList();

// Open with default city selection
getWeather("West Springfield");
getForecast("West Springfield");