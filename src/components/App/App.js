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
      [
        {
          id: 3,
          name: 'Le lac',
          artist: 'Julien Dore',
          album: 'yahyah'
        },
        {
          id: 4,
          name: 'Castle for Sale',
          artist: 'Session Victim',
          album: 'SV'
        },
        {
          id: 5,
          name: 'Awake Again',
          artist: 'Duke Hugh',
          album: 'Duke Hugh'
        }
      ]

    this.state.playlistName = 'Awesome playlist'

    this.state.playlistTracks = [
      {
        id: 1,
        name: 'Glue',
        artist: 'Bicep',
        album: 'Woosh'
      },
      {
        id: 2,
        name: 'Full Circle',
        artist: 'George Fitzgerald',
        album: 'GF'
      }
    ]

    this.addTrack = this.addTrack.bind(this)
    this.removeTrack = this.removeTrack.bind(this)
    this.updatePlaylistName = this.updatePlaylistName.bind(this)
    this.savePlaylist = this.savePlaylist.bind(this)
    this.search = this.search.bind(this)
  }

  addTrack (track) {
    let newTrack = this.state.playlistTracks
    if (!newTrack.includes(track)) {
      newTrack.push(track)
    }
    this.setState({playlistTracks: newTrack})
  }

  removeTrack (track) {
    let newTrack = this.state.playlistTracks
    newTrack = newTrack.filter(function doFilter (currentTrack) {
      return currentTrack.id !== track.id
    })
    this.setState({playlistTracks: newTrack})
  }

  updatePlaylistName (name) {
    this.setState({playlistName: name})
  }

  savePlaylist () {
    let trackURIs = this.state.playlistTracks.map(track => track.uri)

    Spotify.savePlaylist(this.state.playlistName, trackURIs).then(
      this.setState({
        playlistName: 'New Playlist',
        searchResults: []
      })
    )
  }

  search(term) {
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
