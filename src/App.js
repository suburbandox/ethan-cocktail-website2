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


class App extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      data: null,
    };
  }

  // async componentDidMount() {
  //   const response = await fetch(countries);
  //   const csvText = await response.text();
  //   const parsedData = Papa.parse(csvText, { header: true }).data;
  //   this.setState({ data: parsedData });
  // }

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
    return (
      <div>
        <h1>Cocktails</h1>
        <p>There are {data.length} cocktails.</p>
        <ul>
          {data.map(cocktail => <li>{cocktail['Cocktail-Name']}</li>)}
        </ul>
      </div>
    );
  }
}
export default App;