import axios from "axios";
async function getCurrentWeather(location){
    
    const response = await axios.get(`https://api.openweathermap.org/data/2.5/weather?q=${location}&appid=c4b0571106953ff07a67bc88f9acb831`)
    // .then( (response) => {

    const data = response?.data;
    const locationName = (`${data?.sys.country}, ${data?.name}`);
    const temperatureMin = data?.main.temp_min;
    const temperatureMax = data?.main.temp_max;
    const wind = data?.wind.speed;
    const humidity = data?.main.humidity;
    const currentTemperature = data?.main.temp;
    const weatherDescription = data?.weather[0].description;

    results = [ currentTemperature, temperatureMin, temperatureMax, locationName, wind, humidity, weatherDescription ]
    // console.warn(data);

    // })
    // .catch( error => {
    //     console.error(error);
    // });

    return results;
}

export default getCurrentWeather