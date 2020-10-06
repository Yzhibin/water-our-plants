# water-our-plants

Dedoco's new office has just got a few plants. They need to be taken care of at different intervals. To make it hassle-free, I created a simple cron task to send out reminders to our Slack workspace.

> To find out more about Dedoco, visit [dedoco.com](https://dedoco.com).

This repo is created as a public one just to utilize the free GitHub Actions hours. Feel free to copy and modify it as you please. Almost certainly won't take in any PR. Issues are okay for discussions I guess.

## To use it

`plants.json` and `locations.js` under `~/data` store the information about the plants and a few locations in the office. Pretty self-explanatory I think.

```js
{
    "name": "plant A",
    "location": 0, // index in the locations.js array
    "days": [1, 2, 3, 5] // day of week on which it needs to be watered
},
{
    "name": "plant B",
    "location": 0,
    "days": [],
    "keepMoist":  true // no particular day of week. Just make sure the soil is moist
}

```
