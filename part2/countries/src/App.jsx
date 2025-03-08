import { useState, useEffect } from 'react'
import countryService from './services/countries'

const CountryDetails = ({ country }) => (
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

const CountryList = ({ countries }) => {
  const [selectedCountry, setSelectedCountry] = useState(null);
  
  const toggleCountry = (country) => {
    if (selectedCountry?.name.common === country.name.common) {
      setSelectedCountry(null); 
    } else {
      setSelectedCountry(country);
    }
  };

  if (countries.length > 10) {
    return <div>Too many matches, specify another filter</div>;
  }

  return (
    <div>
      {countries.map((country) => (
        <div key={country.name.common}>
          {country.name.common}{" "}
          <button onClick={() => toggleCountry(country)}>
            {selectedCountry?.name.common === country.name.common ? "hide" : "show"}
          </button>
          {/* Muestra detalles si el país está seleccionado */}
          {selectedCountry?.name.common === country.name.common && (
            <CountryDetails country={selectedCountry} />
          )}
        </div>
      ))}
    </div>
  )
}

const Country = ({countries, value}) => {
  const countriesToShow = countries.filter( 
    country => country.name.common.toLowerCase().includes(value.toLowerCase())
  )
  
  return (
    <div>
      {countriesToShow.length === 1 ? (
        <CountryDetails country={countriesToShow[0]} />
      ) : (
        <CountryList countries={countriesToShow} />
      )}
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
