import { useState } from 'react'

export default function SearchBar({ id, placeholder, onSearch }) {
  const [val, setVal] = useState('')

  function handleChange(e) {
    setVal(e.target.value)
    onSearch(e.target.value)
  }

  function handleClear() {
    setVal('')
    onSearch('')
  }

  return (
    <div className="search-wrap">
      <span className="search-icon">🔍</span>
      <input
        className="search-input"
        id={id}
        placeholder={placeholder}
        value={val}
        onChange={handleChange}
        autoComplete="off"
        autoCorrect="off"
        spellCheck="false"
      />
      <button className={`search-clear${val ? ' visible' : ''}`} onClick={handleClear}>✕</button>
    </div>
  )
}
