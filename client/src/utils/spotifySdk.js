export const transferPlaybackHere = (access_token, device_id) => {
  fetch('https://api.spotify.com/v1/me/player', {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${access_token}`,
    },
    body: JSON.stringify({
      device_ids: [device_id],
      play: true,
    }),
  });
};
