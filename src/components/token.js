import React, {useState} from "react";
import axiosInstance from "./axios";
import {
    Avatar,
    Button,
    List,
    ListItemIcon,
    ListItem,
    ListItemText,
  } from "@material-ui/core";
import web3 from './web3';
import CristiToken from '../abis/CristiToken.json';
import Modal from 'react-bootstrap/Modal'


const send10Tokens = (toAcc, contract)=> {

  web3.eth.getAccounts().then((accounts)=>{
  const curAcc= accounts[0];
    if(toAcc!='x0'){
      const transact =  contract.methods.transfer(toAcc , 1000).send({from:curAcc}).on('transactionHash', function(hash){
        console.log(hash);
        console.log(web3.eth.getTransactionReceipt(hash));
})
      }
  })
    }
  
function TransactionModal (props) {

  const hideIt = ()=>{  
    props.onHide();
  };
  return (
    <Modal
      {...props}
      size="lg"
      aria-labelledby="contained-modal-title-vcenter"
      centered
    >
      <Modal.Header closeButton>
        <Modal.Title id="contained-modal-title-vcenter">
          Modal heading
        </Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <h4>Send tokens to address:</h4>
        <p>
          {props.usr.address}
        </p>
        <input type="text" name="name" value={0} />
      </Modal.Body>
      <Modal.Footer>
        <Button onClick={props.onHide}>Close</Button>
        <Button onClick={() => { send10Tokens(props.usr.address, props.contract); hideIt();} } >Send tokens</Button>
      </Modal.Footer>
    </Modal>
  );
}

const DetailsModal =(props) => {

  const [tokenName, setTokenName] = useState("")
  const [balanceOf, setBalanceOf] = useState(0)


  if(props.contract!=null){
    props.contract.methods.totalSupply().call().then((supply)=>{
      const totalSupply = supply;
      props.contract.methods.name().call().then((name)=>{
        setTokenName(name);
        if(props.usr.address != "x0")
        props.contract.methods.balanceOf(props.usr.address).call().then((balance)=>{
          setBalanceOf(balance.toNumber());
        })
      })
    })
  }
  

  return (
    <Modal
      {...props}
      size="lg"
      aria-labelledby="contained-modal-title-vcenter"
      centered
    >
      <Modal.Header closeButton>
        <Modal.Title id="contained-modal-title-vcenter">
          Modal heading
        </Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <h4>Details</h4>
       <p>name: {props.usr.name}</p>
       <p>address: {props.usr.address}</p>
       <p>{tokenName}: {balanceOf}</p>
      </Modal.Body>
      <Modal.Footer>
        <Button onClick={props.onHide}>Close</Button>
      </Modal.Footer>
    </Modal>
  );
}



function Token(){
  const [theData, setTheData] = useState([])
  const [theUser, setTheUser] = useState( { name: "", address: "x0"})
  const [contract, setContract] = useState(null)


  const getContract = () =>{

    web3.eth.net.getId().then((id)=>
    {const networkData = CristiToken.networks[id];
    if(networkData){
      const address = networkData.address;
      const abi = CristiToken.abi;
      const c = new web3.eth.Contract(abi, address)
      setContract(c);
    }
    })
  }
  

  const [TransactionModalShow, setTransactionModalShow] = React.useState(false);
  const [DetailsModalShow, setDetailsModalShow] = React.useState(false);

  const getData = ()=>{  axiosInstance
      .get("/student")
      .then((res) => {
        setTheData(res.data)
    });
}

React.useEffect(() => {
    getData();
    getContract();
}, []);

    return (
        <div style={{ padding: '50px' }}>

      <TransactionModal
        show={TransactionModalShow}
        usr={theUser}
        contract={contract}
        onHide={() => setTransactionModalShow(false)}
      />
       <DetailsModal
        show={DetailsModalShow}
        usr={theUser}
        contract={contract}
        onHide={() => setDetailsModalShow(false)}
      />
            {theData !== null && (
           <List>
                {theData.map((usr) => (
                  <ListItem>
                    <ListItemIcon>
                      <Avatar>{"USER"}</Avatar>
                    </ListItemIcon>
                    <ListItemText
                      primary={"Username: " + usr.name}
                      secondary={
                        <div>
                          <div>Address: {usr.address}</div>
                        </div>
                      }
                    />
                   
                   <Button
                        className="animeaza"
                        variant="contained"
                        color="primary"
                        onClick={ () => {setTheUser(usr); setTransactionModalShow(true)}}
                      >
                        Transact
                      </Button>
                      <Button
                        className="animeaza"
                        variant="contained"
                        color="primary"
                        onClick={ () => {setTheUser(usr); setDetailsModalShow(true)}}
                      >
                        Show details
                      </Button>

                  </ListItem>
                ))}
              </List>
            )}

        </div>
    );
}

export default Token