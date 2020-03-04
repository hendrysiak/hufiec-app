import React, { useState, useEffect } from "react";
import axios from "../../axios-income";

const AddCode = () => {
  const [codes, getCodes] = useState({});

  const getCodesFromServer = async () => {
    const codes = await axios.get("/codes.json");
    await getCodes(codes.data);
  };

  useEffect(() => {
    getCodesFromServer();
  }, []);

  return (
    <div>
      <form action="submit">
        Dodaj kod ogólny
        <label htmlFor="general">
          <input type="text" id="general" placeholder="Wpisz kod ogólny" />
        </label>
        <button>Dodaj</button>
      </form>
      <form action="submit">
        Dodaj kod do drużyny
        <label htmlFor="teams">
          <input type="text" id="teams" placeholder="Wpisz kod ogólny" />
          <input
            type="text"
            id="teams"
            placeholder="Wpisz drużynę, dla której przypisano kod"
          />
        </label>
        <button>Dodaj</button>
      </form>
      <section>
        <h2>Przypisane kody</h2>
        {`${codes}`}
      </section>
    </div>
  );
};

export default AddCode;
