const express = require('express');
const axios = require('axios');
const path = require('path');

require('dotenv').config({ path: path.resolve(__dirname, '../.env') });


const app = express()
const port = 8080;


app.get('/',  (req, res) => {
    const data = {
        "test": "this",
        "working": true
    }

    res.json(data)
});

// OAuth Authorization to access Spotify

const CLIENT_ID = process.env.CLIENT_ID;
const CLIENT_SECRET = process.env.CLIENT_SECRET;
const REDIRECT_URI = process.env.REDIRECT_URI;

console.log(REDIRECT_URI);

// Generates a random string of 'length' size.
const generateRandomString = (length) => {
    let text = "";
    const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
  
    for (var i = 0; i < length; i++) {
      text += chars.charAt(Math.floor(Math.random() * chars.length));
    }
    return text;
};

const stateKey = 'spotify_auth_state'

app.get('/login', (req, res) => {
    const state = generateRandomString(16)
    res.cookie(stateKey, state)

    const scope = 'user-read-recently-played user-read-private user-top-read'

    const params = new URLSearchParams({ 
        client_id: CLIENT_ID, 
        response_type: "code", 
        redirect_uri: REDIRECT_URI,
        state: state,
        scope: scope
    });

    // GET request to spotify authorization
    res.redirect(`https://accounts.spotify.com/authorize?${params}`);
});


app.get('/callback', (req, res) => {
    const code = (req.query.code || null)
    const buffer = Buffer.from(`${CLIENT_ID}:${CLIENT_SECRET}`)

    axios({
        method: 'post',
        url: 'https://accounts.spotify.com/api/token',
        data: new URLSearchParams({
            grant_type: "authorization_code",
            code: code,
            redirect_uri: REDIRECT_URI
        }),
        headers: {
            'content-type': 'application/x-www-form-urlencoded',
            Authorization: `Basic ${buffer.toString('base64')}`,
            "Access-Control-Allow-Origin": "*"
        }
    })
        .then(response => {
            // Status is OK,
            if (response.status === 200) {
                // get the access and refresh tokens from spotify
                const { access_token, refresh_token, expires_in } = response.data;
                const params = new URLSearchParams({
                    access_token, 
                    refresh_token,
                    expires_in
                })
                // redirect to the app again with the access and refresh tokens
                res.redirect(`http://localhost:3000/?${params}`)

                // const { refresh_token } = response.data;

                // axios.get(`http://localhost:8080/refresh_token?refresh_token=${refresh_token}`)
                //   .then(response => {
                //     res.send(`<pre>${JSON.stringify(response.data, null, 2)}</pre>`);
                //   })
                //   .catch(error => {
                //     res.send(error)
                //   })

                // then get the data from spotify using the access token
                // axios.get('http://api.spotify.com/v1/me', {
                //     headers: {
                //         Authorization: `${token_type} ${access_token}`
                //     }
                // })
                //     .then(response => {
                //         res.send(`<pre>${JSON.stringify(response.data, null, 2)}</pre>`);
                //     })
                //     .catch(error => {
                //         res.send(error)
                //     })


            } else {
                const errorParams = new URLSearchParams({
                    error: "invalid_token"
                })
                res.redirect(`/${errorParams}`)

                // // probably an error...
                // console.log("wut")
                // res.send(response)
            }
        })
        .catch(error => {
            res.send(error);
        });

});

// optional, but better for the user:
// uses the refresh token so they user isnt signed out after the access token expires
app.get('/refresh_token', (req, res) => {
    const { refresh_token } = req.query
    const buffer = Buffer.from(`${CLIENT_ID}:${CLIENT_SECRET}`)

    const params = new URLSearchParams({
        grant_type: "refresh_token",
        refresh_token: refresh_token,
    })


    axios({
        method: 'post',
        url: 'https://accounts.spotify.com/api/token',
        data: params,
        headers: {
            'content-type': 'application/x-www-form-urlencoded',
            Authorization: `Basic ${buffer.toString('base64')}`,
            "Access-Control-Allow-Origin": "*"
        }

    })
        .then((response) => {
            res.send(response.data);
        })
        .catch(error => {
            res.send(error)
        });
});



// startapp on port 8080
app.listen(port, () => {
    console.log(`Server started at http://localhost:${port}`)
})