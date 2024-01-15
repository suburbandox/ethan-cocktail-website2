import Papa from "papaparse";
import countries from "./countries.csv";
import cocktails from "./cocktails.csv"
import React from "react";
import "./App.css";
import "bootstrap/dist/css/bootstrap.min.css";
import Button from "react-bootstrap/Button";
import Card from "react-bootstrap/Card";
import Modal from "react-bootstrap/Modal";
import { useState } from "react";
import Markdown from "react-markdown";

async function fetchModalData(file) {
  const response = await fetch(file);
  const text = await response.text();
  return text;
}
function filterContries(continent, country) {
  if (continent === "africa") {
    return country.continent === "Africa";
  } else if (continent === "asia") {
    return country.continent === "Asia";
  } else if (continent === "europe") {
    return country.continent === "Europe";
  } else if (continent === "oceania") {
    return country.continent === "Oceania";
  } else if (continent === "northamerica") {
    return country.continent === "North America";
  } else if (continent === "southamerica") {
    return country.continent === "South America";
  } else {
    return true;
  }
}
function filterSearch(query, country) {
  if (country.name.toLowerCase().includes(query.toLowerCase())) {
    return country
  }
}
function sortCountries(sortOrder, countries) {
  if (sortOrder === "asc") {
    return countries.sort(function (a, b) {
      return a.name.localeCompare(b.name);
    });
  } else if (sortOrder === "des") {
    return countries.sort(function (a, b) {
      return b.name.localeCompare(a.name);
    });
  } else if (sortOrder === "+pop") {
    return countries.sort(function (a, b) {
      return b.population - a.population;
    });
  } else if (sortOrder === "-pop") {
    return countries.sort(function (a, b) {
      return a.population - b.population;
    });
  } else {
    return countries.sort((o) => o.name);
  }
}
function lower(w) {
  return w.toLowerCase();
}
function formattedNumberDefault(p) {
  return Number(p).toLocaleString();
}
function Country(props) {
  const [show, setShow] = useState(false);
  const [data, setData] = useState(null);
  const country = props.country;
  const handleClose = () => {
    setShow(false);
  };
  const handleShow = async () => {
    setShow(true);
    const fetchData = await fetchModalData(`text/${country.name}.txt`);
    setData(fetchData);
  };

  return (
    <div
      key={country.name}
      className={`${country.subregion} ${country.continent}`}
      style={{
        margin: "10px",
      }}
    >
      
      <Card style={{ width: "18rem" }}>
        <Card.Img
          variant="top"
          src={`https://flagcdn.com/${lower(country.abbreviation)}.svg`}
          alt={`flag of ${country.name}`}
        />
        <Card.Body>
          <Card.Title>{country.name}</Card.Title>
          <Card.Text>
            Region: {country.continent}
            <br />
            Population: {formattedNumberDefault(country.population)}
            <br />
            Capital: {country.capital}
          </Card.Text>
          <Button variant="primary" onClick={handleShow}>
            Show more
          </Button>
        </Card.Body>
      </Card>

      <Modal show={show} onHide={handleClose}>
        <Modal.Header closeButton>
          <Modal.Title>{country.name}</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          Population: {country.population}
          <br />
          Region: {country.continent}
          <br />
          Capital: {country.capital}
          <br />
          Subregion: {country.subregion}
          <br />
          Map: <a href={`${country.map_google}`}target="blank">map</a> 
          <br /> 
          Wiki: <a href={`https://en.wikipedia.org/wiki/${country.name}`}target="blank">Wiki</a>        
          <br /> 
          <Markdown>{data}</Markdown>
        </Modal.Body>
      </Modal>
    </div>
  );
}
class App extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      data: null,
      continent: "",
      search: "",
      sortOrder: "",
    };
  }

  async componentDidMount() {
    const response = await fetch(countries);
    const csvText = await response.text();
    const parsedData = Papa.parse(csvText, { header: true }).data;
    this.setState({ data: parsedData });
  }

  // async componentDidMount() {
  //   const response = await fetch(cocktails);
  //   const csvText = await response.text();
  //   const parsedData = Papa.parse(csvText, { header: true }).data;
  //   this.setState({ data: parsedData });
  // }

  render() {
    const { data, continent, search, sortOrder } = this.state;

    if (data === null) {
      return "loading...";
    }

  

    const allcountries = data.length;
    const filteredCountries = data.filter(
      (country) => filterContries(continent, country) && filterSearch(search, country)
    );
    const sortedCountries = sortCountries(sortOrder, filteredCountries);
    const countries = sortedCountries.map((country) => {
      return <Country country={country} key={country.name} />;
    });
    const newcountries = countries.length;
    return (
      <div>
        <div style={{display:"flex",justifyContent:"center",marginTop:"2rem"}}>
  
        <label htmlFor="continent">Choose an continent</label>
        <select
          id="continent"
          onChange={(event) => {
            this.setState({ continent: event.target.value });
          }}
        >
          <option value="all">Show all</option>
          <option value="africa">Africa</option>
          <option value="asia">Asia</option>
          <option value="europe">Europe</option>
          <option value="oceania">Oceania</option>
          <option value="northamerica">North America</option>
          <option value="southamerica">South America</option>
        </select>
        <label htmlFor="order">Choose an order</label>
        <select style={{}}
          id="order"
          onChange={(event) => {
            this.setState({ sortOrder: event.target.value });
          }}>
          <option value="asc">asc </option>
          <option value="des">des </option>
          <option value="+pop">population asc</option>
          <option value="-pop">population dec</option>
        </select>
          <label htmlFor="search">search</label>
          <input id="search" onChange={(event)=> {this.setState({search:event.target.value})}}></input>
        </div>
        <h1 style={{textAlign: "center"}}>
          Now showing {newcountries} out of {allcountries}
        </h1>
        <div
          className="App"
          style={{
            display: "flex",
            width: "80%",
            margin: "10px auto",
            flexWrap: "wrap",
            justifyContent: "center",
          }}
        >
          {countries}
        </div>
      </div>
    );
  }
}
export default App;