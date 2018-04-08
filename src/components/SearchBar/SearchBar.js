import React, { Component } from 'react'
import './SearchBar.css'

class SearchBar extends Component {
  constructor (props) {
    super(props) 

    this.search = this.search.bind(this)
    this.searchClick = this.searchClick.bind(this)
    this.enterClick = this.enterClick.bind(this)
  }

  search (term) {
    return this.props.onSearch(term)
  }

  searchClick (event) {
    const searchText = document.getElementById('search-text')
    this.search(searchText.value)
  }

  enterClick (event) {
    const enterText = document.getElementById('enter-text')
    console.log('enter triggered');
    if (event.keyCode === 13) {
      this.search(enterText.value)
      document.addEventListener('keydown', this.enterClick.bind)
      console.log('Pressed Enter');
    }
  }

  render () {
    return (
      <div className='SearchBar'>
        <input id='enter-text'
          placeholder='Enter A Song, Album, or Artist'
          onKeyDown={this.enterClick}
        />
        <a id='search-text' onClick={this.searchClick} >SEARCH</a>
      </div>
    )
  }
}

export default SearchBar
