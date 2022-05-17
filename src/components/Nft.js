import React, { Component } from 'react';
import './App.css';
import Color from '../abis/Color.json';
import CristiToken from '../abis/CristiToken.json';
import web3 from './web3';
class NFT extends Component {

  async componentWillMount() {
    //await this.loadWeb3();
    await this.loadBlockchainData();
  }

  /*
  async loadWeb3() {
    if (window.ethereum) {
      window.web3 = new Web3(window.ethereum)
      await window.ethereum.enable()
    }
    else if (window.web3) {
      window.web3 = new Web3(window.web3.currentProvider)
    }
    else {
      window.alert('Non-Ethereum browser detected. You should consider trying MetaMask!')
    }
  }
  */

  async loadBlockchainData() {

    //const web3 = window.web3;
    //load acc
    const accounts =await web3.eth.getAccounts();
    this.setState({ account: accounts[0] })
    const networkId = await web3.eth.net.getId();
    const networkData = Color.networks[networkId]
    if (networkData) {
      const address = networkData.address;
      const abi = Color.abi
      const contract = new web3.eth.Contract(abi, address)
      this.setState({ contract })
      console.log(contract);
      const totalSupply = await contract.methods.totalSupply().call();
      console.log(totalSupply._hex);
      this.setState({ totalSupply })
      for (var i = 1; i <= totalSupply; i++) {
        const color = await contract.methods.colors(i - 1).call()
        this.setState({
          colors: [...this.state.colors, color]
        })
      }
      

    }
    else {
      alert("contract not found, not deployed probably");
    }

    const networkData2 = CristiToken.networks[networkId]
    if (networkData2) {
      const address2 = networkData2.address;
      const abi2 = CristiToken.abi
      const contract2 = new web3.eth.Contract(abi2, address2)
      this.setState({ contract2 })
      console.log(contract2);
      const totalSupply2 = await contract2.methods.totalSupply().call();
      const namecristi = await contract2.methods.name().call();
      console.log(totalSupply2.toNumber());
      console.log(namecristi);
      this.setState({ totalSupply2 })
      
    }
    else {
      alert("contract not found, not deployed probably");
    }

  }
  mint = (color) =>{
    this.state.contract.methods.mint(color).send({from: this.state.account})
    .once('receipt', (receipt)=>{
      this.setState({
        colors: [...this.state.colors, color]
      })
    })
  }

  constructor(props) {
    super(props);
    this.state = {
      account: '',
      contract: null,
      totalSupply: 0,
      colors: []
    }

  }

  render() {
    return (
      <div>
        <div className="container-fluid mt-5">
          <div className="row">
            <main role="main" className="col-lg-12 d-flex text-center">
              <div className="content mr-auto ml-auto">
                <h1>Create token</h1>
                <form onSubmit = {(event) =>{
                  event.preventDefault()
                  const color = this.color.value;
                  this.mint(color);
                }}>
                  <input
                  type = 'text' className='form-control mb-1' placeholder='e.g. #FFFFFF' ref={(input)=>{this.color = input}}
                  />
                  <input 
                  type='submit' className='btn btn-block btn-primary' value="MINT"
                  />
                </form>
                <h3>Total tokens minted: { parseInt(this.state.totalSupply._hex, 16)}</h3>
              </div>
            </main>
          </div>
          <hr />
          <div className="row text-center">
            {this.state.colors.map((color,key)=>{
            return (<div key = {key} className = "col-md-3 mb-3">
              <div className = "token" style={{backgroundColor: color}}></div>
              <div>{color}</div>
            </div>)
            })
            }
          </div>
        </div>
      </div>
    );
  }
}

export default NFT;
