import React, { useState, useEffect } from 'react'
import './App.css';
import { FormControl, Select, MenuItem, Card, CardContent} from '@material-ui/core'
import InfoBox from './InfoBox';
import Map from './Map';
import Table from './Table';
import {sortData} from './util.js';
import LineGraph from './LineGraph';
//import "leaflet/dist/leaflet.css";

function App() {

  const [countries, setCountries] = useState([]);
  const [country, setCountry] = useState("worldwide");
  const [countryInfo , setCountryInfo] = useState({});
  const [tableData , setTableData] = useState([]);
  const [mapCenter , setMapCenter] = useState({lat: 34.80764 , lng: -40.4796});
  const [mapZoom , setMapZoom] = useState(3);


  useEffect(() => {
    fetch("https://disease.sh/v3/covid-19/all")
    .then((response) => response.json())
    .then((data) => {
      setCountryInfo(data);
    });
  } , []);

  useEffect(() => {
    const getCountriesData = async () => {
      await fetch("https://disease.sh/v3/covid-19/countries")
        .then((response) => response.json())
        .then((data) => {
          const countries = data.map((country) => ({
            name: country.country,
            value: country.countryInfo.iso2,
          }));
          const sortedData = sortData(data);
          setTableData(sortedData);
          setCountries(countries);
        });
    };
    getCountriesData();
  }, []);

  const onCountryChange = async (event) => {
    const countryCode = event.target.value;

    const url = countryCode === "worldwide" ? "https://disease.sh/v3/covid-19/all" : `https://disease.sh/v3/covid-19/countries/${countryCode}`
    await fetch(url)
    .then(response => response.json())
    .then((data) => {
      setCountry(countryCode);
      setCountryInfo(data);
    })
  };

  return (
    <div className="app">
      <div className="app__left">
        <div className="app__header">
        
        <span>
        <h1>COVID TRACKER</h1>
        <h4>by</h4>
        <h3>NAMAN SAINI</h3>
        </span>
          
          <FormControl className="app__dropdown" >
            <Select variant="outlined" onChange={onCountryChange} value={country} >
              <MenuItem value="worldwide" > Worldwide </MenuItem>
              {countries.map((country) => (
                <MenuItem value={country.value}> {country.name} </MenuItem>
              ))}
            </Select>
          </FormControl>
        </div>

        <div className="app__stats">
          <InfoBox title="Coronavirus cases" cases={countryInfo.todayCases} total={countryInfo.cases} />
          <InfoBox title="Recovered" cases={countryInfo.todayRecovered} total={countryInfo.recovered} />
          <InfoBox title="Deaths" cases={countryInfo.todayDeaths} total={countryInfo.deaths} />
        </div>

      <Map 
          center = {mapCenter}
          zoom = {mapZoom}
        />

      </div>

      <Card className="app__right">
      <CardContent>
        <h3>Live cases by country</h3>
        <Table countries = {tableData} />
        <h3>Worldwide live cases</h3>
        <LineGraph />
      </CardContent>
      </Card>



    </div>
  );
}

export default App;
