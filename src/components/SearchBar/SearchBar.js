import React, { Component } from 'react'
import './SearchBar.css'

class SearchBar extends Component {
  constructor (props) {
    super(props); 

    this.search = this.search.bind(this);
    this.searchClick = this.searchClick.bind(this);
    // this.state={term:''};
  }

  search(term) {
    return this.props.onSearch(term);
  }

  searchClick (event) {
    const searchText = document.getElementById('search-text');
    this.search(searchText.value);
  }

  render () {
    return (
      <div className='SearchBar'>
        <input id='search-text'
          placeholder='Enter A Song, Album, or Artist'
          
        />
        <a onClick={this.searchClick} >SEARCH</a>
      </div>
    )     
  }
}

export default SearchBar
