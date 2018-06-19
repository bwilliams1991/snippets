# snippets
Web article scrapper, honey badger takes what he wants

GitHub.io Pages link: https://bwilliams1991.github.io/snippets/

Checkout the deployed app on Heroku [here](https://snippetsbw.herokuapp.com/).


## How it works
On the backend, the app uses `express` to serve routes and `mongoose` to interact with a `MongoDB` database.

On the frontend, the app uses `handlebars` for templating each video and `materialize` as a styling framework. The app also uses `jQuery` and `AJAX` to help with making post requests.

And for webscraping, the app uses the `request` and `cheerio` node packages. All webscrapping code can be found in the `controllers.js` file.


## Cloning down the repo
If you wish to clone the app down to your local machine...
  1. Ensure that you have MongoDB set up on your computer
    * [Here](https://github.com/dannyvassallo/mongo_lesson) is a helpful tutorial.
  2. Once you are set up, `cd` into this repo and run `npm install`.
  3. Then open another bash or terminal window and run `mongod`
  4. Run the script with `node server.js`.
  5. Navigate to `localhost:3000` in your browser.