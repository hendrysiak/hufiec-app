import React, { useState, useEffect } from "react";
import axios from "../../axios-income";
import ListContainer from "../ListContainer/ListContainer";

const AddCode = () => {
  const [codes, setCodes] = useState([]);

  const setCodesFromServer = async () => {
    try {
      const codes = await axios.get("/codes.json");
      let codesToSave = [];
      for (let team in codes.data) {
        codesToSave.push({ team, codes: codes.data[team] });
      }
      await setCodes(codesToSave);
    } catch (err) {
      console.log(err);
    }
  };

  useEffect(() => {
    setCodesFromServer();
  }, []);

  let listOfCode;
  if (codes.length) {
    listOfCode = codes.map((element, index) => (
      <ListContainer
        key={index}
        title={element.team !== "general" ? element.team : "Kody ogólne"}
      >
        {element.codes.map((code, i) => (
          <li key={i}>{code}</li>
        ))}
      </ListContainer>
    ));
  }

  const saveCode = event => {
    event.preventDefault();
    const id = event.target.dataset.id;
    const dataForm = document.getElementById(`${id}`);
    const info = new FormData(dataForm);
    const newInfo = [...info];
    const codesToEdit = [...codes];
    if (newInfo.length > 1) {
      let team = newInfo[1][1];
      let code = newInfo[0][1];
      let index = codesToEdit.findIndex(item => item.team === `${team}`);
      index > -1
        ? codesToEdit[index].codes.push(`${code}`)
        : codesToEdit.push({ team, codes: [`${code}`] });
      setCodes(codesToEdit);
    } else {
      let code = newInfo[0][1];
      let index = codesToEdit.findIndex(item => item.team === "general");
      codesToEdit[index].codes.push(`${code}`);
      setCodes(codesToEdit);
    }
  };

  const sendCode = async () => {
    try {
      const newCodes = {};
      codes.forEach(team => (newCodes[team.team] = team.codes));
      console.log(newCodes);
      await axios.patch("/codes.json", newCodes);
    } catch (err) {
      console.log(err);
    }
  };

  return (
    <div>
      <form id="general">
        Dodaj kod ogólny
        <label htmlFor="general">
          <input type="text" name="general" placeholder="Wpisz kod ogólny" />
        </label>
        <button data-id="general" onClick={event => saveCode(event)}>
          Dodaj
        </button>
      </form>
      <form id="teams">
        Dodaj kod do drużyny
        <label htmlFor="teams">
          <input type="text" name="teams-code" placeholder="Wpisz kod ogólny" />
          <input
            type="text"
            name="teams-id"
            placeholder="Wpisz drużynę, dla której przypisano kod"
          />
        </label>
        <button data-id="teams" onClick={event => saveCode(event)}>
          Dodaj
        </button>
      </form>
      <section>
        <h2>Przypisane kody</h2>
        {listOfCode}
        <button onClick={sendCode}>Zapisz kody do bazy</button>
      </section>
    </div>
  );
};

export default AddCode;