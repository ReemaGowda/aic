import React, { Component } from "react";
import logo from "./logo.svg";
import "./App.css";
import axios from "axios";


class App extends Component {
  constructor(props) {
    super(props);
    this.state = {
      numberOccData: [],
      noWordCount: [],
      dictionary: [],
    };
  }

  componentDidMount() {
    this.getData();
  }

  async getData() {
    const res = await axios.get("http://norvig.com/big.txt");

    const { data } = await res;
    this.setState({ numberOccData: data });
    // console.log(data)

    // RegEx 
    //Find count of words from the doc.
    var wordCount = data.match(/(\w+)/g).length;
    this.setState({
      noWordCount: wordCount,
    });
    console.log(wordCount);

    //top ten most word

    var occur = this.nthMostCommon(data, 10);
    this.setState({
      numberOccData: occur,
    });
    console.log(occur);

    //dictionary details

    var result = this.dictionaryDetails(data);
    this.setState({
      dictionary: result,
    });

    console.log(result);
  }



  nthMostCommon = (string, amount) => {
    var wordsArray = string.split(/\s/);
    var wordOccurrences = {};

    // You should split the string into words, then loop
    // through the words and increment a counter for each one:
    //to find the most common word

    for (var i = 0; i < wordsArray.length; i++) {
      wordOccurrences["_" + wordsArray[i]] =
        (wordOccurrences["_" + wordsArray[i]] || 0) + 1;
    }

    var result = Object.keys(wordOccurrences).reduce(function (
      acc,
      currentKey
    ) {
      for (var i = 0; i < amount; i++) {
        if (!acc[i]) {
          acc[i] = {
            word: currentKey.slice(1, currentKey.length),
            occurences: wordOccurrences[currentKey],
          };
          break;
        } else if (acc[i].occurences < wordOccurrences[currentKey]) {
          acc.splice(i, 0, {
            word: currentKey.slice(1, currentKey.length),
            occurences: wordOccurrences[currentKey],
          });
          if (acc.length > amount) acc.pop();
          break;
        }
      }
      return acc;
    },
    []);
    return result;
  };

  

  dictionaryDetails = (obj) => {
    for (let i = 0; i < 1; i++) {
      fetch(
        `https://dictionary.yandex.net/api/v1/dicservice.json/lookup?key=dict.1.1.20170610T055246Z.0f11bdc42e7b693a.eefbde961e10106a4efa7d852287caa49ecc68cf&lang=en-en&text=${obj[i].word}`
      )
        .then((response) => response.json())
        .then((data) => this.setState({ dictionary: data.def[0] }));
    }
  };

  render() {
    console.log(this.state.numberOccData);
    console.log(this.state.noWordCount);
    console.log(this.state.dictionary);
    return (
      // <div>
      <div id="main">
        <h1 className="heading">Conversational AI</h1>
        <h1>
          {" "}
          Number of words counted from the{" "}
          <a href="http://norvig.com/big.txt">documents</a> :{" "}
          {this.state.noWordCount}
        </h1>
        <br></br>
        Below are the list of top 10 words along with its number of occurences
        <div id="border"></div>
        <p>{JSON.stringify(this.state.numberOccData)}</p>
        <p>Dictionary Details</p>
        <p>{JSON.stringify(this.state.dictionary)}</p>
        {/* <p>{JSON.stringify(this.state.numberOccData,null,2).replace(/[\[\]"]+/g,"").replace(/[{}]/g, '')}</p> */}
      </div>

    );
  }
}

export default App;
