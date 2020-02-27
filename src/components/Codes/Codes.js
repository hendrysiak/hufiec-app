import React, { useState, useEffect } from "react";
import axios from "../../axios-income";
import Spinner from "../UI/Spinner/Spinner";
import Navigation from "../Navigation/Navigation";

const Codes = () => {
  const [accounts, getAccountsFromServer] = useState(null);
  const [codes, getCodesFromServer] = useState(null);
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

  //   const fixedInfoOfAccount = () => {
  //     let newAccounts = [];
  //     codes.forEach(code => newAccounts.push({ [code]: [] }));
  //     newAccounts.forEach(account =>{
  //         accounts.forEach(team =>{
  //             if(team[account])
  //         })
  //     })
  //     // for(let account in accounts){
  //     //     codes.forEach(code => account[account][code] ? account[account][code].forEach(income => {
  //     //         income.code = code;
  //     //         newAccounts.push(income)
  //     //     }) : null)
  //     // }
  //     console.log(newAccounts);
  //   };

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
    // fixedInfoOfAccount();
  };

  let spinner;
  if (isLoading) spinner = <Spinner />;
  let codesMenu = [];
  if (codes) {
    // let codesItems = [];
    // for (let code in codes) {
    //   codes[code].forEach(code => codesItems.push(code));
    // }
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
