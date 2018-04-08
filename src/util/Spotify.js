const clientId = 'e8159db2d1694f409c54d3e7222eda68'
let accessToken = ''
const redirectUri = 'https://geege_playlist.surge.sh/' //'http://localhost:3000/' 
let clearingTimer

const Spotify = {
  getAccessToken () {
    if (accessToken) {
      return accessToken
    } else {
      let url = window.location.href
      let accessTokenMatchRes = url.match(/access_token=([^&]*)/)
      let matchedExpireTime = url.match(/expires_in=([^&]*)/)

      if (accessTokenMatchRes && matchedExpireTime) {
        accessToken = accessTokenMatchRes[1]
        let expireTime = matchedExpireTime[1]

        if (clearingTimer) {
          // window.clearTimeout(clearingTimer)
        }

        clearingTimer = window.setTimeout(() => accessToken = '', expireTime * 1000)
        window.history.pushState('Access Token', null, '/')
        return accessToken
      } else { // redirect user to url
        window.location = `https://accounts.spotify.com/authorize?client_id=${clientId}&response_type=token&scope=playlist-modify-public&redirect_uri=${redirectUri}`
      }
    }
  },

  search (term) {
    let accessToken = Spotify.getAccessToken()

    return fetch(`https://api.spotify.com/v1/search?type=track&q=${term}`, {
      headers: {Authorization: `Bearer ${accessToken}`}
    }).then(response => {
      return response.json()
    }).then(jsonRes => {
      if (jsonRes.tracks) {
        return Promise.resolve(jsonRes.tracks.items.map(track => {
          return {
            id: track.id,
            name: track.name,
            artist: track.artists[0].name,
            album: track.album.name,
            uri: track.uri
          }
        }))
      } else {
        return Promise.resolve([])
      }
    })
  },

  savePlaylist (playlistName, trackURIs) {

    let accessToken = Spotify.getAccessToken()
    let headers = {Authorization: `Bearer ${accessToken}`}
    let fetchedUserId

    /*
     * First, get the user ID of the current user.
     */
    return fetch(`https://api.spotify.com/v1/me`, {headers: headers}
    ).then(response => response.json()
    ).then(jsonResponse => {
      return Promise.resolve(jsonResponse.id)
    /*
     * Then, list the existing playlists for the current user.
     */
    }).then(userId => {
      fetchedUserId = userId
      return fetch('https://api.spotify.com/v1/me/playlists', {headers: headers})
    }).then(response => response.json()
    ).then(listPlaylistsRes => {
      let foundPlaylist = false
      let playlistId

      foundPlaylist = listPlaylistsRes.items.find(function isAwesomePlaylist(playlist) {
        return playlist.name === playlistName
      })
      /*
     * If playlist exists, replace with new tracks.
     */
      if (foundPlaylist) {
        playlistId = foundPlaylist.id
        return fetch(`https://api.spotify.com/v1/users/${fetchedUserId}/playlists/${playlistId}/tracks`, {
          method: 'PUT',
          headers: headers,
          body: JSON.stringify({uris: trackURIs})
        })
      /*
     * Else, create a new playlist.
     */
      } else {
        return fetch(`https://api.spotify.com/v1/users/${fetchedUserId}/playlists`, {
          method: 'POST',
          headers: headers,
          body: JSON.stringify({name: playlistName})
        }).then(response => response.json()
        ).then(jsonResponse => {
          let playlistId = jsonResponse.id
          return fetch(`https://api.spotify.com/v1/users/${fetchedUserId}/playlists/${playlistId}/tracks`, {
            method: 'POST',
            headers: headers,
            body: JSON.stringify({uris: trackURIs})
          })
        })
      }
    })
  }
}

export default Spotify
