import React, { Component } from 'react'
import './App.css'
import SearchBar from '../SearchBar/SearchBar'
import SearchResults from '../SearchResults/SearchResults'
import PlayList from '../PlayList/PlayList'
import Spotify from '../../util/Spotify'

class App extends Component {
  constructor (props) {
    super(props)

    this.state = {}

    this.state.searchResults =
      []

    this.state.playlistName = 'Awesome Jams Playlist'

    this.state.playlistTracks = []

    this.addTrack = this.addTrack.bind(this)
    this.removeTrack = this.removeTrack.bind(this)
    this.updatePlaylistName = this.updatePlaylistName.bind(this)
    this.savePlaylist = this.savePlaylist.bind(this)
    this.search = this.search.bind(this)
  }

  addTrack (track) {
    /*
     * First, add the track to the playlist.
     */
    let playlistTracks = this.state.playlistTracks
    if (!playlistTracks.includes(track)) {
      playlistTracks.push(track)

      /*
       * Then, remove it from search results, but only if we added the track to the playlist.
       */
      let trackIdx = -1
      this.state.searchResults.forEach(function findAddedTrack (searchResTrack, searchResTrackIdx) {
        if (searchResTrack.id === track.id) {
          trackIdx = searchResTrackIdx
        }
      })

      if (trackIdx !== -1) {
        this.state.searchResults.splice(trackIdx, 1)
      }

      this.setState({
        playlistTracks: playlistTracks,
        searchResults: this.state.searchResults
      })
    }
  }

  removeTrack (track) {
    /*
     * First, remove the track to the playlist.
     */
    let playlistTracks = this.state.playlistTracks
    if (playlistTracks.includes(track)) {
      playlistTracks = playlistTracks.filter(function doFilter (currentTrack) {
        return currentTrack.id !== track.id
      })
      /*
       * Then, add it to search results, but only if we removed the track to the playlist.
       */
      this.state.searchResults.push(track)

      this.setState({
        playlistTracks: playlistTracks,
        searchResults: this.state.searchResults
      })
    }
  }

  updatePlaylistName (name) {
    this.setState({playlistName: name})
  }

  savePlaylist () {
    let trackURIs = this.state.playlistTracks.map(track => track.uri)

    Spotify.savePlaylist(this.state.playlistName, trackURIs).then(
      this.setState({
        playlistName: this.state.playlistName,
        searchResults: []
      })
    )
  }

  search (term) {
    Spotify.search(term).then(searchResults => {
      this.setState({searchResults: searchResults})
    })
  }

  render () {
    return (
      <div>
        <h1>Ja<span className='highlight'>mmm</span>ing</h1>
        <div className='App'>
          <SearchBar
            onSearch={this.search}
          />
          <div className='App-playlist'>
            <SearchResults
              searchResults={this.state.searchResults}
              onAdd={this.addTrack}
            />
            <PlayList
              playlistName={this.state.playlistName}
              playlistTracks={this.state.playlistTracks}
              onRemove={this.removeTrack}
              onAdd={this.addTrack}
              onNameChange={this.updatePlaylistName}
              onSave={this.savePlaylist}
            />
          </div>
        </div>
      </div>
    )
  }
}

export default App
