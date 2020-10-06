require('dotenv').config();
const cron = require('node-cron');
const xoxb = process.env.XOXB;
const plants = require('./data/plants.json');
const locations = require('./data/locations');

if (!xoxb) {
  console.log('Slack bot OAuth token not found.');
  return;
}

if (!Array.isArray(plants)) {
  console.log('plant.json is not an array.');
  return;
}

// Every weekdays at 2pm
cron.schedule('0 0 14 * * 2-6', prepare);

function prepare() {
  const getNames = (arr) =>
    arr.reduce((acc, cur, idx, src) => {
      if (idx === 0) return cur.name;

      if (idx === src.length - 1)
        if (idx === 1) return acc + ' and ' + cur.name;
        else return acc + ', and ' + cur.name;

      return acc + ', ' + cur.name;
    }, '');

  const dayOfWeek = new Date().getDay();
  const waterToday = plants.filter((p) => p.days.includes(dayOfWeek));
  const names = getNames(waterToday);

  const keepMoist = plants.filter((p) => p.keepMoist);
  const alsoNames = getNames(keepMoist);

  const describeLocations = locations.reduce((acc, cur, idx, src) => {
    const somePlants = [...waterToday, ...keepMoist].filter(
      (p) => p.location === idx,
    );
    if (somePlants.length === 0) return acc;
    let be = 'is';
    if (somePlants.length > 1) be = 'are';
    const n = getNames(somePlants);

    if (idx === 0) return `${n} ${be} ${cur}.`;
    return `${acc} ${n} ${be} ${cur}.`;
  }, '');

  let msg = `Hi guys, don't forget to water ${names} today. Also, make sure the soil is mosit for ${alsoNames}. ${describeLocations}`;

  console.log(msg);
  //   send(msg);
}

prepare();

async function send(message) {
  const bent = require('bent');
  const url = 'https://slack.com/api';

  const post = bent(
    url,
    'POST',
    {
      'Content-Type': 'application/json; charset=utf-8',
      Authorization: 'Bearer ' + xoxb,
    },
    'json', //response encoding
    200, //response status filter
  );

  const res = await post('/chat.postMessage', {
    channel: 'U011DPFMJB0',
    text: message,
  });

  console.log(res);
}
