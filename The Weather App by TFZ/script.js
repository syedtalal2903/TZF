const modal = document.querySelector('.modal');
const cityList = document.querySelector('.form');
const cityTitle = document.querySelector('.city');
const searchInput = document.querySelector('.search-input');
const searchButton = document.querySelector('.search-button');
const closeButton = document.querySelector('.close-modal');
const cancelButton = document.querySelector('.cancel-button');
const useCurrentLocation = document.querySelector('.current-location');
const searchThrobber = document.querySelector('.search-throbber');
const locationThrobber = document.querySelector('.location-throbber');

const API_KEY = '81987dd79e0d74f1918035c9e09b452e';

async function getLocation(city) {
	try {
		const location = await fetch(
			`https://api.openweathermap.org/geo/1.0/direct?q=${city}&limit=5&appid=${API_KEY}`
		);
		const locationData = await location.json();
		parseResponseJson(locationData);
	} catch (error) {
		console.error(error);
	}
}

function getCurrentLocation() {
	navigator.geolocation.getCurrentPosition(onSuccess, onError, {
		maximumAge: 60000,
		timeout: 10000,
		enableHighAccuracy: true,
	});
	function onSuccess(position) {
		getWeather(position.coords);
	}
	function onError(error) {
		console.error(error);
	}
}

async function getWeather(coordinates) {
	try {
		let latitude = coordinates.latitude;
		let longitude = coordinates.longitude;
		const weatherResponse = await fetch(
			`https://api.openweathermap.org/data/2.5/weather?lat=${latitude}&lon=${longitude}&appid=${API_KEY}`
		);
		const weatherData = await weatherResponse.json();
		handleWeatherData(weatherData);
	} catch (error) {
		alert('we are having trouble getting weather info :(');
		console.error(error);
	}
}

function parseResponseJson(data) {
	if (data.length === 1) {
		let latitude = data[0].lat;
		let longitude = data[0].lon;
		getWeather({ latitude, longitude });
	} else {
		cityList.innerHTML = '';
		for (let i = 0; i < data.length; i++) {
			const cityListItem = document.createElement('input');
			const cityListItemLabel = document.createElement('label');
			cityListItem.classList.add('city-list-item');
			cityListItem.setAttribute('name', 'city-choice');
			cityListItem.setAttribute('id', data[i].name + ', ' + data[i].state);
			cityListItem.setAttribute('type', 'radio');
			cityListItem.setAttribute('value', i);
			cityListItemLabel.innerText = data[i].name + ', ' + data[i].state;
			if (i === 0) {
				cityListItem.setAttribute('checked', '');
			}
			cityList.append(cityListItem, cityListItemLabel);
		}
		modal.showModal();
		searchThrobber.style.display = 'none';
		handleFormData(data);
	}
}

function handleFormData(locData) {
	cityList.addEventListener(
		'submit',
		function (event) {
			var data = new FormData(cityList);
			for (const entry of data) {
				var output = {
					latitude: locData[entry[1]].lat,
					longitude: locData[entry[1]].lon,
				};
			}
			getWeather(output);
		},
		false
	);
}

function handleWeatherData(data) {
	try {
		document.querySelector('.clouds-data').innerHTML = `${data.clouds?.all}%`;
		document.querySelector(
			'.wind-deg-data'
		).innerHTML = `${data.wind.deg} from N`;
		document.querySelector('.sunset-data').innerHTML = `${convertMsToTime(
			data.sys.sunset + data.timezone
		)} PM`;
		document.querySelector('.sunrise-data').innerHTML = `${convertMsToTime(
			data.sys.sunrise + data.timezone
		)} AM`;
		document.querySelector('.gust-data').innerHTML = `${data.wind.gust} m/s`;
		document.querySelector(
			'.wind-speed-data'
		).innerHTML = `${data.wind.speed} m/s`;
		document.querySelector(
			'.weather'
		).innerHTML = `${data.weather[0].description}`;
		document.querySelector('.temp').innerHTML = `Temperature : ${Math.floor(
			data.main.temp - 273
		)} °C`;
		document.querySelector(
			'.feels-like'
		).innerHTML = `Feels like : ${Math.floor(data.main.feels_like - 273)} °C`;
		document.querySelector(
			'.ground-level-data'
		).innerHTML = `${data.main.grnd_level} hPa`;
		document.querySelector(
			'.humidity-data'
		).innerHTML = `${data.main.humidity} g.m-3`;
		document.querySelector(
			'.pressure-data'
		).innerHTML = `${data.main.pressure} hPa`;
		document.querySelector(
			'.sea-level-data'
		).innerHTML = `${data.main.sea_level} hPa`;
		document.querySelector('.temp-min-data').innerHTML = `${Math.floor(
			data.main.temp_min - 273
		)} °C`;
		document.querySelector('.temp-max-data').innerHTML = `${Math.floor(
			data.main.temp_max - 273
		)} °C`;
		document.querySelector('.city').innerText = data.name;

		locationThrobber.style.display = 'none';
		searchThrobber.style.display = 'none';
	} catch (error) {
		console.error(error);
	}
}

function convertUTCDateToLocalDate(time) {
	var newDate = new Date(date.getTime() + date.getTimezoneOffset() * 60 * 1000);
	var offset = date.getTimezoneOffset() / 60;
	var hours = date.getHours();
	newDate.setHours(hours - offset);
	return newDate;
}

function padTo2Digits(num) {
	return num.toString().padStart(2, '0');
}

function convertMsToTime(milliseconds) {
	let seconds = Math.floor(milliseconds / 1000);
	let minutes = Math.floor(seconds / 60);
	let hours = Math.floor(minutes / 60);
	seconds = seconds % 60;
	minutes = minutes % 60;
	hours = hours % 24;
	return `${padTo2Digits(hours)}:${padTo2Digits(minutes)}:${padTo2Digits(
		seconds
	)}`;
}

searchButton.addEventListener('click', () => {
	searchThrobber.style.display = 'unset';
	var cityName = searchInput.value;
	getLocation(cityName);
});

closeButton.onclick = () => {
	modal.close();
};

cancelButton.onclick = () => {
	modal.close();
};

useCurrentLocation.onclick = () => {
	getCurrentLocation();
	locationThrobber.style.display = 'unset';
};
window.onload = getCurrentLocation;
/** @type {import('tailwindcss').Config} */ 
module.exports = {
    content: ["./src/**/*.{html,js}"],
    theme: {
      extend: {},
    },
    plugins: [],
  }