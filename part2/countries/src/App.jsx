import { useState, useEffect } from 'react'
import countryService from './services/countries'

const Country = ({countries, value}) => {
  const countriesToShow = countries.filter( 
    country => country.name.common.toLowerCase().includes(value.toLowerCase())
  )
  
  if (countriesToShow.length > 10) {
    return <div>Too many matches, specify another filter</div>
  }

  if (countriesToShow.length === 1) {
    const country = countriesToShow[0]
    return (
      <div>
        <h2>{country.name.common}</h2>
        <div>Capital {country.capital[0]}</div>
        <div>Area {country.area}</div>
        <h3>languages</h3>
        <ul>
          {Object.values(country.languages).map(language => 
            <li key={language}>{language}</li>
          )}
        </ul>
        <img src={country.flags.png} alt={country.flags.alt} width="177" />
      </div>
    )
  }

  // console.log('filtered', countriesToShow)
  return (
    <div>
      {countriesToShow.map(country => (
        <div key={country.name.common}>
          {country.name.common}
        </div>
      ))}
    </div>
  )
}

function App() {
  const [value, setValue] = useState('')
  const [countries, setCountries] = useState([])
    
  useEffect(() => {
    console.log('Fetching countries...')
    countryService
        .getAll()
        .then(data => {
          console.log('Data received:', data)
          setCountries(data)
        })
  }, [])

  const handleChange = (event) => {
    // console.log(event.target.value)
    setValue(event.target.value)
  }

  // console.log(countries[0].name.common)

  return (
    <div>
        find countries: <input value={value} onChange={handleChange} />
      {/* <pre>
        {JSON.stringify(countries, null, 2)}
      </pre> */}
      <Country countries={countries} value={value} />
    </div>
  )
}

export default App
