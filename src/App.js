import React from "react";
import logo from './logo.svg';
import web3 from "./web3";
import './App.css';
import lottery from "./lottery";
//figuring out how to work with the lottery contract
//the place to start is getting an address of the owner/manager
//get off contract and render on the component
//theres always this sequence to render:
//0. let our compenent render, 1. define compoenntdidmount, call method on it, 
//set data on component state, show it inside method
class App extends React.Component {
  // constructor(props) {
  //   super(props);
    //this is where our "properties" go
    //es2016 lets us refactor this.state = for susinct?
    //taking place inside an automatically created constructor
    state = { 
      manager: "", 
      players: [],
      balance: "",
      // textbox
      value: '',
      message: ''
    };
  

  async componentDidMount() {
    //consider for later turning lottery.methods into a Contract
    //when using metamask, default account is the first one
    //call can take a from property?
    const manager = await lottery.methods.manager().call();
    const players = await lottery.methods.getPlayers().call();
    const balance = await web3.eth.getBalance(lottery.options.address);
    //es2015 syntax, booya
    this.setState({ manager });
  }

  // event handler, the context of .this 
  //don't worry about manually binding the function
  // onSubmit() {
    // called with event object
  onSubmit = async (event) => {
    event.preventDefault();

    //in this version of web3, before directly calling it we have to
    //get a list of accounts
    const accounts = await web3.eth.getAccounts();
    //(takes time), so loading, and alerting messaging to users
    this.setState({message:'waiting on transaction success...'});
    //async, enters us into our contract, sending into the network , takes time
    await lottery.methods.enter().send({
      from: accounts[0],
      value: web3.utils.toWei(this.state.value, 'ether')
    })
    //update the user its completed (await won't progress to this until done?)
    this.setState({ message: "You're In! Entered the lottery, good luck!"})
    //how to update who won the contract?  do we change our lottery with a
    //lottery.sol
    //lastWinner = players[index]

  }

  // define onClick function
  onClick = async () => {
    const accounts = await web3.eth.getAccounts();

    this.setState({message: 'ok plz waiting on transaction success'})
    await lottery.methods.pickWinner().send({
      // send a msg.sender
      from: accounts[0]
    })
    this.setState({message: 'winnerPicked! who won?'})
    
  }

  render() {
    return (
      <div>
        <h2>Lottery Contract</h2>
        <p>
          This contract is managed by {this.state.manager}.
          There are currently {this.state.players.length} players
          {/* specify the units we want to tranlate from wei to */}
           hoping to win {web3.utils.fromWei(this.state.balance, 'ether')} Ether! 
        </p>

        <hr />
        {/* event handler  */}
        <form onSubmit={this.onSubmit}>
          <h4>Try for a win!</h4>
          <div>
            <label>Amount of ether to enter</label>
            <input
              // initilized to empty string up in state
              value={this.state.value}
              onChange={event => this.setState({ value: event.target.value })}
            />
          </div>
          <button>Enter</button>
        </form>

        <hr />
        <h4>Mr Manager can pickWinner!</h4>
        <button onClick={this.onClick}>_pickWinner!</button>
        <hr />
        <h1>{this.state.message}</h1>
      </div>
    );
  }
}
export default App;
