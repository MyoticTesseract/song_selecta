# A SONG A DAY KEEPS THE BLUES AWAY

![giphy-downsized 4](https://user-images.githubusercontent.com/6969180/29043939-2719bb50-7b8b-11e7-9986-91ae8f440ca6.gif)

## WHAT IS THIS?
A Twitter bot that brings you a fresh song daily based on a monthly theme.

## SETUP

#### 1- Clone the repo

- From the command line (aka the [terminal](https://medium.com/wearecolorcoded/these-are-a-few-of-my-favorite-terminal-shortcuts-8da1eaf12612)) enter `git@github.com:wearecolorcoded/song_selecta.git` _or_ fork it into your account with the button on the top right of the screen

- Cd into the directory `cd song_selecta`

#### 2- Node and packages

- Make sure you have [Node](https://nodejs.org/en/download/) installed. If not, get it [here](https://nodejs.org/en/download/)
- Run `npm install`

#### 3- API Credentials

- We are using [dotenv](https://github.com/motdotla/dotenv) to hide our environments variables so before you start the application, get your credentials:
    - On [Twitter](https://apps.twitter.com) _Register your app with your bots' account, not yours. Unless you wish to post songs from your account._

    - On [Spotify](https://developer.spotify.com/my-applications/#!/applications)
    
- Create a `.env` file, and add your credentials like so

```
clientId='SPOTIFY CLIENT ID GOES HERE'
clientSecret='SPOTIFY CLIENT SECRET GOES HERE'

CONSUMER_KEY='TWITTER CONSUMER KEY GOES HERE'
CONSUMER_SECRET='TWITTER CONSUMER KEY GOES HERE'
ACCESS_TOKEN='TWITTER ACCESS TOKEN GOES HERE'
ACCESS_TOKEN_SECRET='TWITTER ACCESS TOKEN SECRET GOES HERE'
```

#### 4- Use and Remix the app!

- Start the server by running `npm start`
- Open you Twitter bot's page
- Watch a song get tweeted

:rainbow:
