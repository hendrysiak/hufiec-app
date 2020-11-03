import { setSendingTeam } from '../../../store/actions/ui';

import store from '../../../store/store';

const outcomeHandler = async () => {

}

export const sendingDataHandler = async (id, axios, incomes) => {
  // const updatedState = [...accountState];

  // assignedIncome.forEach(team => {
  //   if (team.id !== 'pozostałe') {
  //     team.accounts.forEach(account => {



  //     })
      
  //   }
  // })

  console.log(incomes);

  store.dispatch(setSendingTeam(id));
  try {
    const response = await axios.get(`/teams/${id}.json`);
    const accounts = await response.data;
    const patterns = (await response.data.members)
      ? response.data.members
      : null;
      
    const incomesToSort = await [
      ...incomes.find(item => {
        if(id !== "pozostałe") return item.id === Number(id);
        else return item.id === id
      }
        ).accounts
    ];
    console.log(incomesToSort);
    const unAssigned = await [
      ...incomes.find(item => item.code === "unAssigned").incomeByCode
    ];
    accounts["unAssigned"] = [...unAssigned];

    if (id !== "pozostałe") {
      for (let i of incomesToSort) {
        if (!accounts.hasOwnProperty(i.code)) {
          accounts[i.code] = [];
          i.incomeByCode.forEach((income, index, array) => {
            for (let pattern of patterns) {
              const namePattern = new RegExp(`(${pattern.name})`, "i");
              const surnamePattern = new RegExp(`(${pattern.surname})`, "i");
              const matchInfo =
                income.title.match(namePattern) &&
                income.title.match(surnamePattern);
              const someVerify = accounts[i.code].some(
                (insertedTitle, index) =>
                  namePattern.test(insertedTitle.name) &&
                  surnamePattern.test(insertedTitle.surname)
              );
              if (matchInfo) {
                const index = accounts[i.code].findIndex(
                  element =>
                    namePattern.test(element.name) &&
                    surnamePattern.test(element.surname)
                );
                console.log(index);
                index > 0
                  ? (accounts[i.code][index].value += Number(income.cash))
                  : accounts[i.code].push({
                      name: pattern.name,
                      surname: pattern.surname,
                      value: Number(income.cash)
                    });
              }
              else if (matchInfo && !someVerify) {
                accounts["unAssigned"].push(income);
              }
            }
          });
        } else if (accounts.hasOwnProperty(i.code)) {
          accounts[i.code].forEach(person => {
            const namePattern = new RegExp(`(${person.name})`, "i");
            const surnamePattern = new RegExp(`(${person.surname})`, "i");
            i.incomeByCode.forEach((income, index) => {
              const matchInfo =
                income.title.match(namePattern) &&
                income.title.match(surnamePattern);
              if (matchInfo) {
                person.value += Number(income.cash);
              } else if (
                !matchInfo
              ) {
                accounts["unAssigned"].push(income);

              }
            });
          });
        }
      }
      const responseInfo = await axios.put(`/teams/${id}.json`, accounts);
      console.log(responseInfo);
      this.setState({ sendingTeam: null });
    } else if (id === "pozostałe") {
      console.log('Konta z sending handlers')
      console.log(accounts);
      // const unAssignedIncome = accounts.filter()
      const responseInfo = await axios.put(`/teams/pozostałe.json`, accounts);
      // console.log(responseInfo);
      store.dispatch(setSendingTeam(null));
    }
  } catch (err) {
    console.log(err);
  }
};