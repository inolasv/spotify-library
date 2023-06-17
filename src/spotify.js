import axios from "axios";

const LOCAL_STORAGE_KEYS = {
    accessToken: 'spotify_access_token',
    refreshToken: 'spotify_refresh_token',
    expireTime: 'spotify_token_expire_time',
    timestamp: 'spotify_token_timestamp'
}

const LOCAL_STORAGE_VALS = {
    accessToken: window.localStorage.getItem(LOCAL_STORAGE_KEYS.accessToken),
    refreshToken: window.localStorage.getItem(LOCAL_STORAGE_KEYS.refreshToken),
    expireTime: window.localStorage.getItem(LOCAL_STORAGE_KEYS.expireTime),
    timestamp: window.localStorage.getItem(LOCAL_STORAGE_KEYS.timestamp),
}

// Get the access and refresh tokens from the url
const getAccessToken = () => {
    const queryString = window.location.search;
    const urlParams = new URLSearchParams(queryString);
    const queryParams = {
        [LOCAL_STORAGE_KEYS.accessToken]: urlParams.get('access_token'),
        [LOCAL_STORAGE_KEYS.refreshToken]: urlParams.get('refresh_token'),
        [LOCAL_STORAGE_KEYS.expireTime]: urlParams.get('expires_in'),
    }
    const error = urlParams.get('error');

    // refreshToken();


    // if error, or expired token, refresh the token
    if (error || hasTokenExpired() || LOCAL_STORAGE_VALS.accessToken === 'undefined') {
        refreshToken();
    }

    // if token in storage, log in with that in back
    if(LOCAL_STORAGE_VALS.accessToken && LOCAL_STORAGE_VALS.accessToken !== 'undefined') {
        return LOCAL_STORAGE_VALS.accessToken
    }

    // if token in url params, take that and log in while storing the params in storage
    if (queryParams[LOCAL_STORAGE_KEYS.accessToken]) {
        for (const param in queryParams) {
            window.localStorage.setItem(param, queryParams[param]);
        }
        window.localStorage.setItem(LOCAL_STORAGE_KEYS.timestamp, Date.now());
        return queryParams[LOCAL_STORAGE_KEYS.accessToken];
    }
    
    // dont reach here.
    return false;
    

    // const refreshToken = urlParams.get('refresh_token');
    // if(refreshToken){
    //   fetch(`refresh_token?refresh_token=${refreshToken}`)
    //     .then((res) => res.json())
    //     .then((data) => console.log(data))
    //     .catch((err) => console.log(err))
    // }
    
  };

const hasTokenExpired = () => {
    const { accessToken, timestamp, expireTime } = LOCAL_STORAGE_VALS;
    if (!accessToken || !timestamp) {
        return false
    }
    const elapsedTime = Date.now() - Number(timestamp); // this is milliseconds
    return elapsedTime / 1000 > Number(expireTime) // expire time is in seconds
}

const refreshToken = async () => {
    try {
        console.log("AHHHHHHHHH")
        // no refresh token or infinite loop...
        if (LOCAL_STORAGE_VALS.refreshToken == null || LOCAL_STORAGE_VALS.refreshToken === 'undefined' || (Date.now() - Number(LOCAL_STORAGE_VALS.timestamp) / 1000 < 1000)) {
            console.error('No refresh token.');
            logout();
        }


        // get the data from the endpoint
        const { data } = await axios.get(`/api/refresh_token?refresh_token=${LOCAL_STORAGE_VALS.refreshToken}`);

        // set local storage value
        window.localStorage.setItem(LOCAL_STORAGE_KEYS.accessToken, data.access_token);
        window.localStorage.setItem(LOCAL_STORAGE_KEYS.timestamp, Date.now());
        
        // Reload the page for localSt
        // reload
        window.location.reload();
    } catch(err) {
        console.error(err);
    }
}

export const logout = () => {
    console.log("LOGGING OUT")
    for (const param in LOCAL_STORAGE_KEYS) {
        window.localStorage.removeItem(LOCAL_STORAGE_KEYS[param]);
    }
    window.location = window.location.origin;
}

export const accessToken = getAccessToken();


// set axios defaults
axios.defaults.baseURL = 'https://api.spotify.com/v1'
axios.defaults.headers['Authorization'] = `Bearer ${accessToken}`
axios.defaults.headers['Content-Type'] = 'application/json'

export const getCurrentUserProfile = () => axios.get('/me');

export const getUsersTopArtists = () =>  axios.get(`/me/top/artists?time_range=medium_term`);

export const getUsersTopTracks = () => axios.get(`/me/top/tracks?limit=10&time_range=medium_term`);
