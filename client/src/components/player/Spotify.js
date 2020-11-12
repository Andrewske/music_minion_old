import React, {Fragment, useEffect} from 'react';
import { connect } from 'react-redux';


const Spotify = ({
    deviceId,
    loggedIn,
    error,
    trackName,
    artistName,
    albumName,
    playing,
    position,
    duration,
    expires_in
}) => {
    useEffect(() => {
        if (expires_at && expires_at >= Date.now()) {
            console.log('Access Token Expired')
            // Get a new access token
            getToken()
        } else {
            console.log("No expired_at")
        }


    })

    checkForPlayer() {
        const { token } = getToken();

        if (window.Spotify !== null) {
            this.player = new window.Spotify.Player({
                name: "Music Minion",
                getOAuthToken: cb => { cb(token); },
            });

            // this.createEventHandlers();

            this.player.connect();
        }
    }

    getToken() {
        // Get the users spotify token
    }


    return (
        <Fragment></Fragment>
    )
}