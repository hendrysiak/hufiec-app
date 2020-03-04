import React, { useState, useEffect } from "react";
import { Route } from "react-router-dom";
import axios from "../../axios-income";
import Spinner from "../UI/Spinner/Spinner";
import Navigation from "../Navigation/Navigation";
import Code from "./Code/Code";

const Codes = () => {
  const [accounts, getAccountsFromServer] = useState(null);
  const [codes, getCodesFromServer] = useState(null);
  const [infoAboutIncomes, setInfoAboutIncome] = useState(null);
  const [isLoading, setLoadingStatus] = useState(false);

  const getInfo = async () => {
    const codes = await axios.get("/codes.json");
    let codesList = [];
    for (let code in codes.data) {
      await codes.data[code].forEach(code => codesList.push(code));
    }
    const accounts = await axios.get("/teams.json");
    await getAccountsFromServer(accounts.data);
    await getCodesFromServer(codesList);
    fixedInfoOfAccount();
  };

  const fixedInfoOfAccount = () => {
    const infoAboutIncome = {};
    for (let team in accounts) {
      codes.forEach(code => {
        if (accounts[team].hasOwnProperty(`${code}`)) {
          infoAboutIncome[code] = {
            ...infoAboutIncome[code],
            ...{
              team,
              incomes: accounts[team][code]
            }
          };
        } else {
          infoAboutIncome["nonAssigned"] = {
            ...infoAboutIncome["nonAssigned"],
            ...{
              incomes: accounts[team][code]
            }
          };
        }
      });
    }
    // let fixedInfo = infoAboutIncome.map(item => {
    //   return { item };
    // });

    setInfoAboutIncome(infoAboutIncome);
  };

  useEffect(() => {
    setLoadingStatus(true);
    try {
      getInfo();
    } catch (err) {
      console.log(err);
    } finally {
      setLoadingStatus(false);
    }
  }, [infoAboutIncomes]);

  const showInfo = () => {
    console.log(accounts);
    console.log(codes);
    console.log(infoAboutIncomes);
    console.log(infoAboutIncomes["CMOK"]);
    // infoAboutIncomes.forEach((code, index) => console.log(code, index));
  };

  let spinner;
  if (isLoading) spinner = <Spinner />;
  let codesMenu = [];
  if (codes) {
    codesMenu = codes.map(code => {
      return { link: `/codes/${code}`, title: `${code}` };
    });
  }
  let routing = [];
  if (infoAboutIncomes) {
    for (let code in infoAboutIncomes) {
      routing.push({
        [code]: {
          team: infoAboutIncomes[code]["team"],
          incomes: infoAboutIncomes[code]["incomes"]
        }
      });

      // console.log(infoAboutIncomes[code]);
    }
    console.log(routing[1]);
    // infoAboutIncomes.forEach((code, index) => console.log(code, index));
    // routing = infoAboutIncomes.map((code, index) => {
    //   console.log(code, index);
    //   return (
    //     <Route
    //       key={index}
    //       path={`/codes/${code}`}
    //       component={props => <Code income={code} />}
    //     />
    //   );
    // });
  }

  return (
    <section className="Section">
      <header>
        <nav className="Nav">
          <Navigation list={codesMenu} />
        </nav>
        <h2>Pokaż listę po kodzie</h2>
        <button onClick={showInfo}>Pobierz info</button>
        {spinner}
      </header>
      <main>
        <div className="GridArea">
          {routing.map((item, index) => {
            return (
              <Route
                key={index}
                path={`/codes/${item}`}
                component={props => <Code income={item} />}
              />
            );
          })}
        </div>
      </main>
    </section>
  );
};

export default Codes;
