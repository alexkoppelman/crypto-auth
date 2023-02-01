import React, { useState , useEffect} from 'react'
import { ethers } from 'ethers'
import axios from "axios"
import './App.css'
import './menu.css'

import AllUsersComponent from './components/AllUsers'
import UserDetails from './components/UserDetails'
const provider = new ethers.providers.Web3Provider(window.ethereum)

/*
TODO:
  - When not authenticated to MM show only button
  - Deletion and ban need confirmation
  - Some kind of security, or can any random create a link and delete/ban ppl?
  - Button to view all users when logged in is admin
  - Css please!
  - Add env file for sensitive vars...
  - Pagination of all users table
 */
function App() {

  // NODE-RED HTTP ENDPOINTS:
  /* const GETUserUrl = 'https://192.168.1.100:1880/userfromAddress/' */
  
  function burgerMenu(){
    return(



<div class="hamburger-menu">
    <input id="menu__toggle" type="checkbox" />
    <label class="menu__btn" for="menu__toggle">
      <span></span>
    </label>
    <ul class="menu__box">
      <li><a class="menu__item" href="#" onClick={connectwalletHandler}>{defaultAccount ? shortAddress : "Connect"}</a></li>
      <li><a class="menu__item" href="#" onClick={addEditDetails}>{showEditForm ? "Hide Form" : "Add / Edit User Details" }</a></li>
      <li><a class="menu__item" href="#">Team</a></li>
      <li><a class="menu__item" href="#">Contact</a></li>
      <li><a class="menu__item" href="https://twitter.com/alexkbcn" target='_blank' alt='twitter'>Twitter</a></li>
    </ul>
  </div>

    )
  }

  // METAMASK STATES 
  const [errorMessage, setErrorMessage] = useState(null)
  const [defaultAccount, setDefaultAccount] = useState(null)
  const [userBalance, setUserBalance] = useState(null)
  const [userAvatar, setUserAvatar] = useState(null)
  // DATABASE REPONSE STATE
  const [dbReply, setDbReply] = useState([])

  const [ShowUserStats, setShowUserStats] = useState(true)

  const [showEditForm, setShowEditForm] = useState(false)
  function addEditDetails() {
    setShowEditForm(prevState => !prevState)
  }

//METAMASK CONNECTION
  const connectwalletHandler = () => {
      if (window.ethereum) {
          provider.send("eth_requestAccounts", [])
              .then(async () => {
                  await accountChangedHandler(provider.getSigner());
              })
              
      } else {
          setErrorMessage("Please Install MetaMask!!!");
      }
  }
  const accountChangedHandler = async (newAccount) => {
      const address = await newAccount.getAddress();
      setDefaultAccount(address);
      const balance = await newAccount.getBalance()
      setUserBalance(ethers.utils.formatEther(balance));
      await getuserBalance(address)
      // checking for user data in DB
      console.log("MM LOGGED IN: " + address)
      // getUserData(address)
      setUserAvatar('https://robohash.org/'+ address)

  }
  const getuserBalance = async (address) => {
      const balance = await provider.getBalance(address, "latest")
      
      }

  // SHORTEN ETH ADDRESS FOR BUTTONText
  let shortEth = defaultAccount ? defaultAccount.slice(0, 5).concat( "...", defaultAccount.slice(-4)) : ''
  
  const shortAddress =  defaultAccount ? shortEth : "Connect" 
  const shortBalance = userBalance ? userBalance.slice(0,6) : 'Please connect your wallet'

  return (
    <div>
    <main>
      <header>
      <div className="MetaMaskDIV">
      {/* {defaultAccount &&
        <button className='MMconnectBUTTON' onClick={addEditDetails}>{showEditForm ? "Hide Form" : "Add / Edit User Details" }</button>
      } */}
        <div className='MMErrorMsgDIV'>{errorMessage}</div>

      </div>
      <div className='walletInfoDIV'>{burgerMenu()} {defaultAccount ? <span className='header--mm--username'><img src={userAvatar} alt="" width="25"/> <span className='header--username'>{shortAddress}</span></span>: ''}
      {defaultAccount ? <div className='header--balance'>Wallet Balance: {shortBalance} eth</div> : ''}
          
          {/* <p className='header--balance'>Wallet Balance: {shortBalance} eth</p> */}
       
        {/*   <p><button className='MMconnectBUTTON' onClick={connectwalletHandler}> {defaultAccount ? shortAddress : "Connect"} </button></p>  */}
        
        
      </div>

      </header>

      <div className='mainpage'>
    

      <UserDetails
        defaultAccount = {defaultAccount}
        userBalance = {userBalance}
        ShowUserStats = {ShowUserStats}
      /> 


    
          </div>
    </main>
    <footer>
Database response: {dbReply.data && dbReply.message}
    </footer>
</div>
  );
}

export default App;