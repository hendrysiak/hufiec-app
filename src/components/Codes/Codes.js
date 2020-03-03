import React, { useState, useEffect } from "react";
import axios from "../../axios-income";
import Spinner from "../UI/Spinner/Spinner";
import Navigation from "../Navigation/Navigation";

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
  };

  const fixedInfoOfAccount = () => {
    const infoAboutIncome = [];

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
  }, []);

  const showInfo = () => {
    console.log(accounts);
    console.log(codes);
    fixedInfoOfAccount();
  };

  let spinner;
  if (isLoading) spinner = <Spinner />;
  let codesMenu = [];
  if (codes) {
    codesMenu = codes.map(code => {
      return { link: `/codes/${code}`, title: `${code}` };
    });
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
          <main>
            {/* {sortedIncome.map((team, index) => {
              return (
                <Route
                  key={index}
                  path={`/transfers/sorted/${team.title}`}
                  component={props => <Team teamNum={team.title} />}
                />
              );
            })} */}
          </main>
        </div>
      </main>
    </section>
  );
};

export default Codes;
