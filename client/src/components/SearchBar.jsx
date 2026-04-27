import React from 'react'
import '../css/SearchBar.css'

const SearchBar = ({ value, onChange, onSubmit }) => {
  return (
    <form className="searchbar" onSubmit={(e) => { e.preventDefault(); onSubmit?.() }}>
      <input
        type="search"
        className="search-input"
        placeholder='Search anything... e.g. "memory leak in node.js"'
        value={value}
        onChange={(e) => onChange(e.target.value)}
        aria-label="Search posts"
      />
      <button type="submit" className="search-button">
        Search
      </button>
    </form>
  )
}

export default SearchBar