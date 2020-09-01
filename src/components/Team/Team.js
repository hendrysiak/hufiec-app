import React, { useEffect } from "react";
import { useSelector } from "react-redux";
import ListEl from "../ListEl/ListEl";
import ListContainer from "../ListContainer/ListContainer";
import axios from "../../axios-income";

const Team = (props) => {

  const assignedIncome  = useSelector(state => state.income.assignedIncome);

  const getData = async () => {
    try {
      const response = await axios.get("/codes.json");
      // console.log(response);
      console.log(assignedIncome);
    } catch (err) {
      console.log(err);
    }
  }
 useEffect(() => {
  getData();
 }, [])

 const getTeam = () => {
    const teams = assignedIncome;
    const incomes = teams.filter(item =>
      item.id == props.teamNum ? item.accounts : false
    );
    return incomes;
  };

    return (
      <div>
        <ul>
          {getTeam()[0].accounts.map((item, index) => (
            <ListContainer
              key={index}
              title={item.code !== "nonAssigned" ? item.code : "Nie rozpoznane"}
            >
              {item.incomeByCode.map((income, index) => (
                <ListEl key={index} title={income.title} cash={income.cash} />
              ))}
            </ListContainer>
          ))}
        </ul>
      </div>
    );
}

// const mapStateToProps = state => {
//   return {
//     init: state.income.initIncome,
//     teams: state.income.teams,
//     incomes: state.income.assignedIncome
//   };
// };

export default Team;
