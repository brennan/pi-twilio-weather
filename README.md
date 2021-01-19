# Pi/Twilio Weather

A simple Node JS script that texts the weather to recipient(s) using [Twilio's SMS service](https://www.twilio.com/docs/sms/quickstart/node). Weather information provided by [Open Weather](http://api.openweathermap.org).

# Usage

I run this script from a cron job on my Raspberry Pi Zero. The Pi is simple to set up and works perfectly as a basic, always-on home server. The Pi uses only one watt. :)

## Example

### Run Script

```
TWILIO_ACCOUNT_SID=<your-sid> \
TWILIO_AUTH_TOKEN=<your-auth-token> \
TWILIO_SMS_NUMBER=<your-twilio-sms-number> \
RECIPIENT_NUMBER=<desired-recipient> \
WEATHER_APP_ID=<your-open-weather-app-id> \
node index.js
```

### Response

You'll receive the below as a text at the `RECIPIENT_NUMBER` you provided as
an environment variable above.

```
===Today in San Francisco===
Weather: few clouds
Current temperature: 66
High temperature: 72
Sunset: 17:17:45
```