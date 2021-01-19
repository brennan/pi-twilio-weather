#!/usr/bin/env node

const request = require('request-promise')
const twilio = require ('twilio')
const accountSid = process.env.TWILIO_ACCOUNT_SID
const authToken = process.env.TWILIO_AUTH_TOKEN
const weatherAppId = process.env.WEATHER_APP_ID
const twilioNumber = process.env.TWILIO_SMS_NUMBER
const recipient = process.env.RECIPIENT_NUMBER
const twilioClient = twilio(accountSid, authToken)

// Open Weather API:
// https://openweathermap.org/api

let currentTemp
let highTemp
let weather
let weatherDesc
let sunset

const getWeather = async () => {
  await request(`http://api.openweathermap.org/data/2.5/weather?zip=94118&units=imperial&appid=${weatherAppId}`, { json: true }, (err, res, body) => {
    if (err) { console.log(err); return }
    format(body)
  })
}

//run program
getWeather()

// if response is successful, then
// write format function to format weather data, then
// text to me using the Twilio sdk

const format = body => {
  currentTemp = Math.round(body.main.temp)
  highTemp = Math.round(body.main.temp_max)
  weather = body.weather[0].main
  weatherDesc = body.weather[0].description
  sunset = new Date(body.sys.sunset * 1000).toString().split(' ')[4]
  createMessage(currentTemp, highTemp, weather, weatherDesc)
}

const createMessage = (currentTemp, highTemp, weather, weatherDesc) => {
  const message = `\n\n===Today in San Francisco===\n` +
                  `Weather: ${weatherDesc}\n` +
                  `Current temperature: ${currentTemp}\n` +
                  `High temperature: ${highTemp}\n` +
                  `Sunset: ${sunset}`

  sendMessage(message)
}

sendMessage = async message => {
  try {
    await twilioClient.messages.create({
      body: message,
      to: recipient,
      from: twilioNumber
    })
  } catch(e) {
    process.exit(0)
  }
  process.exit(1)
}
