

export const sortingTransferToIncomesAndOutomes = (incomes) => {
  const sortedIncomes = incomes.filter(income => Number(income.cash) > 0);
  const sortedOutcomes = incomes.filter(income => Number(income.cash) < 0);

  return {
    incomes: sortedIncomes.map(income => {
      return {
        cash: Number(income.cash),
        title: income.title
      }
    }),
    outcomes: sortedOutcomes.map(outcome => {
      return {
        cash: Number(outcome.cash),
        title: outcome.title
      }    
    })
  }
}

export const sortingIncomesByTeams = (teams, incomes) => {

  const updatedIncomes = incomes.map(income => {
    let updatedIncome = income;

  Object.keys(teams).forEach(teamCode => {
    const regex = new RegExp(`${teamCode}`, "m"); // team code as regex pattern
    if (regex.test(income.title)) updatedIncome = {...income, team: teamCode}
    else return;
  });
  return updatedIncome;
})

  return updatedIncomes.map(income => {
    if (!income.hasOwnProperty('team')) return { ...income, team: null }
    else return { ...income };
  });
};


export const sortingIncomesByCode = (codes, incomes) => {
  const sortedIncomesByCode = incomes.map(income => {
    let updatedIncome = income;

    codes.forEach(code => {
      const regex = new RegExp(`${code}`, "m"); 
      if (regex.test(income.title)) updatedIncome = { ...income, event: code }
    })
    return updatedIncome;
  })

  return sortedIncomesByCode.map(income => {
    if (!income.hasOwnProperty('event')) return { ...income, event: null }
    else return { ...income };
  });
};

export const matchingIncomesToTeamMember = (teams, incomes) => {
  const matchedIncomesToMember = incomes.map(income => {
    let updatedIncome = income;
    if (income.team === null) updatedIncome = { ...income }
    else {

      const currentTeamMembers = [...teams[income.team]];
      const findedMember = currentTeamMembers.find(member => {

        const nameRegex = new RegExp(member.name, "mi");
        const surnameRegex = new RegExp(member.surname, "mi");

        if (nameRegex.test(income.title) && surnameRegex.test(income.title)) return true;
      })

      if (findedMember) updatedIncome = { ...income, name: findedMember.name, surname: findedMember.surname}

    }
    return updatedIncome
  })

  return matchedIncomesToMember;

}

export const matchingIncomeByYear = (incomes) => {
  const currentYear = new Date().getFullYear();
  const yearRegex = new RegExp(currentYear, "mi")
  const matchedIncomesByYear = incomes.map(income => {
    let updatedIncome = income;

    if (yearRegex.test(updatedIncome.title)) updatedIncome = {...updatedIncome, year: currentYear}
    return updatedIncome;
  })
  return matchedIncomesByYear;
}

export const sortingIncome = (incomesToSort, teams, codes) => {
  const { incomes, outcomes } = sortingTransferToIncomesAndOutomes(incomesToSort);

  const byTeam = sortingIncomesByTeams(teams, incomes);
  const byCode = sortingIncomesByCode(codes, byTeam);
  const byMembers = matchingIncomesToTeamMember(teams, byCode);
  const byYear = matchingIncomeByYear(byMembers)

  return {
    sortedIncomes: byYear,
    sortedOutcomes: outcomes
  }

}