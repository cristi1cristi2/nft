import React, { useState, useEffect } from "react";
import HeaderTab from "./headerTab";
import { getContract, getCurrAccount } from './contract';
import AssigCardList from "./assigCardList";

function Student() {
  const [contract, setContract] = useState(null)
  const [currentAcc, setCurrentAcc] = useState("")

  useEffect(() => {
    getContract().then(c => {
      setContract(c);
    })
    getCurrAccount().then(acc => {
      setCurrentAcc(acc);
    })
  }, []);

  return (
    <div>
      <h3>Hello Student!</h3>
      <HeaderTab />
      <AssigCardList></AssigCardList>
    </div>
  );
}

export default Student