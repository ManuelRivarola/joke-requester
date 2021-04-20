const fs = require('fs').promises;
const https = require('https');
const prompt = require('prompt');

const main = async () => {
  // Get search term
  prompt.start();
  const search_term = (await prompt.get('term')).term;
  // Build url and options
  const url = new URL(`/search?term=${search_term}`,'https://icanhazdadjoke.com');
  const options = {
    method: 'GET',
    headers: {
      Accept: 'text/plain'
    }
  };

  https.get(url, options, res => {
    console.log(`statusCode: ${res.statusCode}`);
    var buffer = [];
    res.on('data', d => {
      buffer.push(d);
    });
    res.on('end', () => {
      if(buffer.length == 0) {
        // Buffer being empty means no jokes found
        console.log(`No jokes found with ${search_term}`);
      } else {
        // Jokes were found
        const jokes = buffer.toString().split('\n');
        const joke = jokes[Math.floor(Math.random() * jokes.length)];
        fs.writeFile('joke.txt', joke)
          .then(() => { console.log('Joke saved to ' + 'joke.txt') })
          .catch((error) => { console.log('Error!: ' + error) });
      }
    });
  });
}

main();