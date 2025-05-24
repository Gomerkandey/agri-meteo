const apiKey = "974d85f98448bb0d0a139d68a1c99b49";
let map;

function getWeather() {
    const city = document.getElementById("cityInput").value;
    const url = `https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${apiKey}&units=metric&lang=fr`;

    fetch(url)
        .then(res => res.json())
        .then(data => {
            const temp = data.main.temp;
            const desc = data.weather[0].main.toLowerCase();
            const wind = data.wind.speed;
            const lat = data.coord.lat;
            const lon = data.coord.lon;

            document.getElementById("cityName").textContent = data.name;
            document.getElementById("temperature").textContent = `Température : ${temp} °C`;
            document.getElementById("weatherIcon").textContent = desc.includes("rain") ? "🌧️" : desc.includes("clear") ? "☀️" : "⛅";

            // Mise à jour fond uniquement bleu ou rouge
            document.body.classList.remove("cold", "hot");
            if (temp < 22) {
                document.body.classList.add("cold");
            } else {
                document.body.classList.add("hot");
            }

            const adviceBox = document.getElementById("adviceBox");
            const adviceText = document.getElementById("adviceText");
            const adviceIcon = document.getElementById("adviceIcon");
            adviceBox.className = "advice-box";

            if (desc.includes("rain")) {
                adviceText.textContent = "Pluie prévue : évitez les traitements et récoltes aujourd'hui.";
                adviceIcon.textContent = "🌧️";
                adviceBox.classList.add("advice-alert");
            } else if (temp > 33) {
                adviceText.textContent = "Chaleur intense : irriguez tôt le matin ou en soirée.";
                adviceIcon.textContent = "☀️";
                adviceBox.classList.add("advice-warning");
            } else if (temp >= 25 && temp <= 33) {
                adviceText.textContent = "Température favorable aux cultures maraîchères.";
                adviceIcon.textContent = "🌿";
                adviceBox.classList.add("advice-good");
            } else if (temp >= 18 && temp < 25) {
                adviceText.textContent = "Bon moment pour semer de maïs ou riz.";
                adviceIcon.textContent = "🌾";
                adviceBox.classList.add("advice-good");
            } else if (temp < 18 && wind > 6) {
                adviceText.textContent = "Vent frais : évitez les pulvérisations.";
                adviceIcon.textContent = "💨";
                adviceBox.classList.add("advice-warning");
            } else {
                adviceText.textContent = "Conditions stables pour vos activités agricoles.";
                adviceIcon.textContent = "✅";
                adviceBox.classList.add("advice-good");
            }

            if (!map) {
                map = L.map('map').setView([lat, lon], 10);
                L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png').addTo(map);
            } else {
                map.setView([lat, lon], 10);
            }
            L.marker([lat, lon]).addTo(map);
        });

    getForecast(city);
    showDate();
}

function getForecast(city) {
    const url = `https://api.openweathermap.org/data/2.5/forecast?q=${city}&appid=${apiKey}&units=metric&lang=fr`;
    fetch(url)
        .then(res => res.json())
        .then(data => {
            const forecastDiv = document.getElementById("forecast");
            forecastDiv.innerHTML = "";
            let daysAdded = {};

            data.list.forEach(item => {
                const date = new Date(item.dt_txt);
                const day = date.toLocaleDateString('fr-FR', { weekday: 'long' });
                if (!daysAdded[day] && Object.keys(daysAdded).length < 7) {
                    daysAdded[day] = true;
                    const icon = item.weather[0].main.toLowerCase().includes("rain") ? "🌧️" : item.weather[0].main.toLowerCase().includes("clear") ? "☀️" : "⛅";
                    forecastDiv.innerHTML += `
            <div class="forecast-day">
              <h4>${day}</h4>
              <p>${icon}</p>
              <p>${Math.round(item.main.temp)} °C</p>
            </div>`;
                }
            });
        });
}

function showDate() {
    const now = new Date();
    const options = { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' };
    document.getElementById("date").textContent = "Date : " + now.toLocaleDateString('fr-FR', options);
}




document.addEventListener("DOMContentLoaded", showDate);