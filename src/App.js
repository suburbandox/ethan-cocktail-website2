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
function filterCocktailRoot(root, cocktail) {
  if (root === "OldFashioned") {
    return cocktail.root === "OldFashioned";
  } else if (root === "Martini") {
    return cocktail.root === "Martini";
  } else if (root === "Daiquiri") {
    return cocktail.root === "Daiquiri";
  } else if (root === "Sidecar") {
    return cocktail.root === "Sidecar";
  } else if (root === "Highball") {
    return cocktail.root === "Highball";
  } else if (root === "Flip") {
    return cocktail.root === "Flip";
  } else {
    return true;
  }
}
function filterCocktailSpirit(spirit, cocktail) {
  if (spirit === "Bourbon") {
    return cocktail.spirit === "Bourbon";
  } else if (spirit === "Rye") {
    return cocktail.spirit === "Rye";
  } else if (spirit === "Cognac") {
    return cocktail.spirit === "Cognac";
  } else if (spirit === "Champagne") {
    return cocktail.spirit === "Champagne";
  } else if (spirit === "Gin") {
    return cocktail.spirit === "Gin";
  } else if (spirit === "Rum") {
    return cocktail.spirit === "Rum";
  } else if (spirit === "Pisco") {
    return cocktail.spirit === "Pisco";
  } else if (spirit === "Tequila") {
    return cocktail.spirit === "Tequila";
  } else if (spirit === "Vodka") {
    return cocktail.spirit === "Vodka";
  } else if (spirit === "Sherry") {
    return cocktail.spirit === "Sherry";
  } else if (spirit === "Whiskey") {
    return cocktail.spirit === "Whiskey";
  } else {
    return true;
  }
}
function filterSearch(query, cocktail) {
  if (cocktail.name.toLowerCase().includes(query.toLowerCase())) {
    return cocktail
  }
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
      search: "",
    };
  }

  async componentDidMount() {
    const response = await fetch(cocktails);
    const csvText = await response.text();
    const parsedData = Papa.parse(csvText, { header: true }).data;
    this.setState({ data: parsedData });
  }

  render() {
    const { data ,root,spirit,search} = this.state;
    if (data === null) {
      return "loading...";
      }

    const allcocktails = data.length;
    const filteredCocktails = data.filter(
      (cocktail) => filterCocktailRoot(root, cocktail)&&filterCocktailSpirit(spirit,cocktail)&& filterSearch(search, cocktail)
    );
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
    const cocktails = filteredCocktails.map((cocktail)=>{
      return<Cocktail cocktail={cocktail} key={cocktail.name} />
    })
    
    const newcocktails = cocktails.length;
    return (
      <div>
        {/* <h1>Cocktails</h1>
        <p>There are {data.length} cocktails.</p> */}
        {/* <ul>
          {data.map(cocktail => <li>{cocktail['Cocktail-Name']}</li>)}
        </ul>  */}

        <div style={{display:"flex",justifyContent:"center",marginTop:"2rem"}}>
          <label htmlFor="root">Choose a cocktail</label>
          <select
            id="root"
            onChange={(event) => {
              this.setState({ root: event.target.value });
            }}
          >
            <option value="all">Show all</option>
            <option value="OldFashioned">OldFashioned</option>
            <option value="Martini">Martini</option>
            <option value="Daiquiri">Daiquiri</option>
            <option value="Sidecar">Sidecar</option>
            <option value="Highball">Highball</option>
            <option value="Flip">Flip</option>
          </select>

          <label htmlFor="spirit">Choose a spirit</label>
          <select
            id="spirit"
            onChange={(event) => {
              this.setState({ spirit: event.target.value });
            }}
          >
            <option value="all">Show all</option>
            <option value="Bourbon">Bourbon</option>
            <option value="Rye">Rye</option>
            <option value="Cognac">Cognac</option>
            <option value="Champagne">Champagne</option>
            <option value="Gin">Gin</option>
            <option value="Rum">Rum</option>
            <option value="Pisco">Pisco</option>
            <option value="Tequila">Tequila</option>
            <option value="Vodka">Vodka</option>
            <option value="Sherry">Sherry</option>
            <option value="Whiskey">Whiskey</option>
          </select>
          <label htmlFor="search">search</label>
          <input
            id="search"
            onChange={(event) => {
              this.setState({ search: event.target.value });
            }}
          ></input>
        </div>
        <h1 style={{textAlign: "center"}}>
          Now showing {newcocktails} out of {allcocktails} cocktails
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
          {cocktails}
        </div>
      </div>
    );
  }
}
export default App;