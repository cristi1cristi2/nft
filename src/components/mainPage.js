import React, { useEffect, useState } from "react";
import Student from "./student";
import Teacher from "./teacher";
import { getContract, getCurrAccount } from './contract';

function MainPage() {
  const [isTeacher, setIsTeacher] = useState(false)
  const [contract, setContract] = useState(null)
  const [currentAcc, setCurrentAcc] = useState("")

  useEffect(() => {
    if (contract != null) {
      contract.methods.isTeacher.call({ from: currentAcc }).then((res) => {
        console.log(res);
        setIsTeacher(res);
      })
    }
  }, [contract]);

  useEffect(() => {
    getContract().then(c => {
      setContract(c);
    })
    getCurrAccount().then(acc => {
      setCurrentAcc(acc);
    })
  }, []);

  if (isTeacher === true) {
    return (<Teacher />);
  }
  else {
    return (<Student />);
  }
}

export default MainPage