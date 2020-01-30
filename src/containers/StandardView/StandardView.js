import React, { Component } from "react";
import axios from "axios";

import ListContainer from "../../components/ListContainer/ListContainer";
import ListEl from "../../components/ListEl/ListEl";

class StandardView extends Component {
  state = {
    array: [],
    teams: [
      { id: 6673, income: [] },
      { id: 6682, income: [] },
      { id: 6687, income: [] },
      { id: 6689, income: [] },
      { id: 6699, income: [] },
      { id: 6697, income: [] },
      { id: 6692, income: [] },
      { id: 6700, income: [] },
      { id: 6701, income: [] },
      { id: 6704, income: [] },
      { id: 6707, income: [] },
      { id: 6711, income: [] },
      { id: 6717, income: [] },
      { id: 6722, income: [] },
      { id: 6723, income: [] },
      { id: 6704, income: [] },
      { id: 6705, income: [] },
      { id: 11600, income: [] },
      { id: 12427, income: [] },
      { id: 13522, income: [] },
      { id: 14149, income: [] },
      { id: 15446, income: [] },
      { id: 15946, income: [] },
      { id: 15947, income: [] },
      { id: 15948, income: [] },
      { id: "pozostałe", income: [] }
    ]
  };

  componentDidMount = async () => {
    try {
      const result = await axios.get(
        "https://gist.githubusercontent.com/hendrysiak/9b7f2fa73d9384e3c412fcab3f8cff6c/raw/8eee22684e05fe23d515f3aa3676894ff2583191/xml-convert"
      );
      console.log(result);
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

      this.setState({ array: resultInfo });

      this.verifyTeams();
      console.log(this.state.teams);
      console.log(this.state.array);
    } catch (err) {
      console.log(err);
    }
  };

  verifyTeams = () => {
    const newArray = [...this.state.teams];
    const copyState = [...this.state.array];

    newArray.forEach(element => {
      if (element.id !== "pozostałe") {
        const regex = new RegExp(`(${element.id})`, "m");
        const valueInfo = copyState.filter(info => regex.test(info.title));

        element.income = [...valueInfo];
      } else if (element.id === "pozostałe") {
        const regexArr = newArray.map(
          element => new RegExp(`(${element.id})`, "m")
        );
        regexArr.splice(regexArr.length - 1, 1);

        const notPassValue = copyState.filter(info =>
          regexArr.every(item => !item.test(info.title))
        );

        element.income = [...notPassValue];
      }
    });
    this.setState({ teams: newArray });
    console.log(this.state.teams);
  };

  render() {
    let listOfIncome = this.state.teams.map((element, index) => (
      <ListContainer key={index} title={element.id}>
        {element.income.map((item, index) => (
          <ListEl key={index} title={item.title} cash={item.cash} />
        ))}
      </ListContainer>
    ));

    let listOfOutcome = this.state.teams[
      this.state.teams.length - 1
    ].income.map((element, index) => {
      if (element.cash * 1 < 0) {
        return <ListEl key={index} title={element.title} cash={element.cash} />;
      }
    });

    let listOfNonAssignedIncome = this.state.teams[
      this.state.teams.length - 1
    ].income.map((element, index) => {
      if (element.cash * 1 > 0) {
        return <ListEl key={index} title={element.title} cash={element.cash} />;
      }
    });

    const style = { display: "flex", flexDirection: "row" };

    return (
      <div style={style}>
        <div>
          <h2>Wpływy</h2>
          {listOfIncome}
        </div>
        <div>
          <h2>Wydatki</h2>
          {listOfOutcome}
        </div>
        <div>
          <h2>Wpływy nieprzypisane</h2>
          {listOfNonAssignedIncome}
        </div>
      </div>
    );
  }
}

export default StandardView;
