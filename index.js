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
// https://openweathermap.org/api/one-call-api

let currentTemp
let highTemp
let weather
let weatherDesc
let sunrise
let sunset

const getWeather = async () => {
  await request(`http://api.openweathermap.org/data/2.5/onecall?lat=37.7809707&lon=-122.4713741&units=imperial&exclude=minutely,hourly&appid=${weatherAppId}`, { json: true }, (err, res, body) => {
    if (err) { console.log(err); return }
    format(body)
  })
}

// let's go!
getWeather()

const format = body => {
  weatherDesc = body.current.weather[0].description
  currentTemp = Math.round(body.current.temp)
  highTemp = Math.round(body.daily[0].temp.max)
  sunrise = new Date(body.daily[0].sunrise * 1000).toString().split(' ')[4]
  sunset = new Date(body.daily[0].sunset * 1000).toString().split(' ')[4]
  createMessage(weatherDesc, currentTemp, highTemp, sunrise, sunset)
}

const createMessage = (weatherDesc, currentTemp, highTemp, sunrise, sunset) => {
  const message = `\n\n===Today in San Francisco===\n` +
                  `Current weather: ${weatherDesc}\n` +
                  `Current temperature: ${currentTemp}\n` +
                  `High temperature: ${highTemp}\n` +
                  `Sunrise: ${sunrise}\n` +
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
    console.log(e)
    process.exit(1)
  }
  process.exit(0)
}
