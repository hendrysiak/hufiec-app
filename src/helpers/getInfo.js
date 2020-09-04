import axios from "../axios-income";

export const getInfo = async (getAccountsFromServer, getCodesFromServer) => {
  const codes = await axios.get("/codes.json");
  let codesList = [];
  for (let code in codes.data) {
    await codes.data[code].forEach(code => codesList.push(code));
  }
  const accounts = await axios.get("/teams.json");
  let accountList = []; // init empty array
  for (let team in accounts.data) {
    // iteration by all teams
    for (let code in accounts.data[team]) {
      // for each code in team
      let index = accountList.findIndex(item => item.code === code); // get index, if exist
      //if index exist, assign new incomes to existing code
      if (index > -1) {
        accountList[index].income = [
          ...accountList[index].income,
          { team, persons: [...accounts.data[team][code]] }
        ];
      } else {
        // if index doesn't exist, push new object with code
        accountList.push({
          code,
          income: [{ team, persons: [...accounts.data[team][code]] }]
        });
      }
    }
  }
  getAccountsFromServer(accountList);
  getCodesFromServer(codesList);
};