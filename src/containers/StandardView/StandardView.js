import React, { Component } from "react";
import axios from "axios";

import ListEl from "../../components/ListEl/ListEl";

class StandardView extends Component {
  state = {
    array: []
  };

  async componentDidMount() {
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
      this.setState({ array: resultInfo });
      console.log(this.state.array);
    } catch (err) {
      console.log(err);
    }
  }
  render() {
    let list = this.state.array.map((element, index) => {
      return (
        <ListEl
          key={index}
          number={index}
          value={element.cash}
          title={element.title}
        />
      );
    });

    return (
      <div>
        <ul>{list}</ul>
      </div>
    );
  }
}

export default StandardView;
