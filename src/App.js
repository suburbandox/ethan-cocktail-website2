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
function Cocktail(props){
  const [show, setShow] = useState(false);
  const [data, setData] = useState(null);
  const handleClose = () => {
    setShow(false);
  };
  const handleShow = async () => {
    setShow(true);
    const fetchData = await fetchModalData(`text/${cocktail.name}.txt`);
    setData(fetchData);
  };
  const cocktail = props.cocktail
  //console.log(cocktail.name)
  return(
    <div 
      key={cocktail.name} 
      style={{
        margin: "10px",
      }}
    >
         <Card style={{ width: "18rem" }}>
        <Card.Img
          variant="top"
          src={`imo/${cocktail.name}.jpg`}
          alt={cocktail.name}
        />
        <Card.Body>
          <Card.Title>{cocktail.name}</Card.Title>
          <Button variant="primary" onClick={handleShow}>
            Recipe
          </Button>
        </Card.Body>
      </Card>
      <Modal show={show} onHide={handleClose}>
        <Modal.Header closeButton>
          <Modal.Title>{cocktail.name}</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          {/* Population: {country.population}
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
          <br /> */}
          <Markdown>{data}</Markdown> 
        </Modal.Body>
      </Modal>
    </div>
  )
}  


class App extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      data: null,
    };
  }

  async componentDidMount() {
    const response = await fetch(cocktails);
    const csvText = await response.text();
    const parsedData = Papa.parse(csvText, { header: true }).data;
    this.setState({ data: parsedData });
  }

  render() {
    const { data } = this.state;
    if (data === null) {
      return "loading...";
    }

    // const allcountries = data.length;
    // const filteredCountries = data.filter(
    //   (country) => filterContries(continent, country) && filterSearch(search, country)
    // );
    // const sortedCountries = sortCountries(sortOrder, filteredCountries);
    // const countries = sortedCountries.map((country) => {
    //   return <Country country={country} key={country.name} />;
    // });
    // const newcountries = countries.length;

    // const cocktails = sortedCountries.map((country) => {
    //   return <Country country={country} key={country.name} />;
    // });
    // console.log(data)
    // console.log(this.props)
    const cocktails = data.map((cocktail)=>{
      return<Cocktail cocktail={cocktail} key={cocktail.name} />
    })
    
  
    return (
      <div>
        <h1>Cocktails</h1>
        <p>There are {data.length} cocktails.</p>
        {/* <ul>
          {data.map(cocktail => <li>{cocktail['Cocktail-Name']}</li>)}
        </ul>  */}
        
        <div className="App"
          style={{
            display: "flex",
            width: "80%",
            margin: "10px auto",
            flexWrap: "wrap",
            justifyContent: "center",
          }}>
          {cocktails}
        </div>
      </div>
      
    );

  }
}
export default App;