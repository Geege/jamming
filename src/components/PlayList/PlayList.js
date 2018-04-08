import React, { Component } from 'react'
import './PlayList.css'
import TrackList from '../TrackList/TrackList'

class PlayList extends Component {
  constructor (props) {
    super(props)

    this.onNameChange = this.props.onNameChange.bind(this);
  }

  handleNameChange (event) {
    this.onNameChange(event.target.value)
  }

  render () {
    return (
      <div className='Playlist'>
        <h2 className="no-padding"> Create an
          <input value={'Awesome Playlist'} />
        </h2>
        <TrackList 
          tracks={this.props.playlistTracks} 
          onRemove={this.props.onRemove}
          onAdd={this.props.onAdd}
          isRemoval={true}/>
        <a 
          className='Playlist-save' 
          onClick={this.props.onSave}>
        SAVE TO SPOTIFY
        </a>
      </div>
    )
  }
}

export default PlayList
