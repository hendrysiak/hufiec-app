import React, { Component } from "react";
import axios from "axios";

import ListEl from "../../components/ListEl/ListEl";

class StandardView extends Component {
  state = {
    array: [],
    teams: [
      { id: 12427, income: [] },
      { id: 6699, income: [] },
      { id: 6697, income: [] },
      { id: 6692, income: [] },
      { id: 6700, income: [] },
      { id: 6701, income: [] },
      { id: 6722, income: [] },
      { id: 6704, income: [] },
      { id: 6687, income: [] },
      { id: 6682, income: [] },
      { id: 6705, income: [] },
      { id: 11600, income: [] },
      { id: 6707, income: [] },
      { id: "pozostałe", income: [] }
    ]
  };

  componentDidMount = async () => {
    try {
      const result = await axios.get(
        "https://gist.githubusercontent.com/hendrysiak/9b7f2fa73d9384e3c412fcab3f8cff6c/raw/2bb5f48d9352560ae5b00c7f33e34f07c9b8ac58/xml-convert"
      );
      const resultArray = result.data.Document.BkToCstmrAcctRpt.Rpt.Ntry;
      const resultInfo = [];
      resultArray.forEach(result => {
        resultInfo.push({
          cash:
            result.CdtDbtInd === "DBIT"
              ? `-${result.Amt.__text}`
              : result.Amt.__text,
          title: result.NtryDtls.TxDtls.RmtInf.Ustrd
        });
      });
      resultInfo.forEach(element => this.verifyTeams(element));

      this.setState({ array: resultInfo });
      console.log(this.state.teams);
    } catch (err) {
      console.log(err);
    }
  };

  verifyTeams = position => {
    const newArray = [...this.state.teams];
    newArray.forEach(element => {
      if (position.title.includes(`${element.id}`)) {
        element.income.push(position);
      }
    });
    this.setState({ teams: newArray });
  };

  render() {
    let listOfIncome = this.state.array.map((element, index) => {
      if (element.cash * 1 > 0) {
        return (
          <ListEl
            key={index}
            number={index}
            value={element.cash}
            title={element.title}
          />
        );
      }
    });
    let listOfOutcome = this.state.array.map((element, index) => {
      if (element.cash * 1 < 0) {
        return (
          <ListEl
            key={index}
            number={index}
            value={element.cash}
            title={element.title}
          />
        );
      }
    });
    const style = { display: "flex", flexDirection: "row" };

    return (
      <div style={style}>
        <div>
          <h2>Wpływy</h2>
          <ul>{listOfIncome}</ul>
        </div>
        <div>
          <h2>Wydatki</h2>
          <ul>{listOfOutcome}</ul>
        </div>
      </div>
    );
  }
}

export default StandardView;
