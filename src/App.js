import React, { useState , useEffect} from 'react';
import { ethers } from 'ethers';
import axios from "axios";
import './App.css';

const provider = new ethers.providers.Web3Provider(window.ethereum)

/*
TODO:
  - Deletion and ban need confirmation
  - Some kind of security, or can any random create a link and delete/ban ppl?
  - Button to view all users when logged in is admin
  - Css please!
  - Add env file for sensitive vars...
  - Pagination of all users table
 */
function App() {

  // NODE-RED HTTP ENDPOINTS:
  const GETUserUrl = 'https://192.168.1.100:1880/userfromAddress/'
  const PUTUserUrl = 'https://192.168.1.100:1880/userPUTAddress/'
  const DELETEUserUrl = 'https://192.168.1.100:1880/userDelete/'
  const GETAllUserUrl = 'https://192.168.1.100:1880/userGETall/'
  const BanUserURL = 'https://192.168.1.100:1880/userBanPUT/'

  // METAMASK STATES 
  const [errorMessage, setErrorMessage] = useState(null)
  const [defaultAccount, setDefaultAccount] = useState(null)
  const [userBalance, setUserBalance] = useState(null)
  // FULL USER DATASET
  const [allUserData, setAllUserData] = useState([])

  // DATAVASE REPONSE STATE
  const [dbReply, setDbReply] = useState([])

  // CURRENT USERDATA STATE
  const [user, setUser] = useState({    
      firstName: '',
      lastName: '',
      email: '',
      userName: '',
      ethAddress: ''    
  })
  // FORM STATES
  const [ShowUserStats, setShowUserStats] = useState(false)
  const [showEditForm, setShowEditForm] = useState(false)

  function addEditDetails() {
    setShowEditForm(prevState => !prevState)
  }

  // GET User Details
  function getUserData(account) {
    axios.get(GETUserUrl + account).then((response) => {
      const replyData = response.data[0]
      if(replyData === undefined) {
        setUser({    
          firstName: '',
          lastName: '',
          email: '',
          userName: '',
          ethAddress: account   
      }
        ) 
        console.log(user) 
        return
      }
      setUser(replyData)
      setShowUserStats(true)
      })
    
  }
  
// GET All Users 
useEffect(() => {
  axios.get(GETAllUserUrl)
      .then((response) => {
        setAllUserData(response.data);
      })
}, [dbReply])

// BAN USER
async function BanUser(id, banstat) {
  if(banstat === 'ban' ? banstat = 'Banned' : 'NotBanned')
  await axios.put(BanUserURL, 
     {
      id: id,
      banstat: banstat
    } )
      .then((response) => {
        setDbReply(response.data)
      })}

// DELETE USER
async function DeleteUser(id) {
  await axios.delete(DELETEUserUrl + id)
      .then((response) => {
        setDbReply(response.data)
})}

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
      getUserData(address)

  }
  const getuserBalance = async (address) => {
      const balance = await provider.getBalance(address, "latest")
      }

  // SHORTEN ETH ADDRESS FOR BUTTONText
  let shortEth = defaultAccount ? defaultAccount.slice(0, 5).concat( "...", defaultAccount.slice(-4)) : ''
  const shortAddress =  defaultAccount ? shortEth : "Connect" 

  // CHANGES TO FORM UPDATE USER STATE
  const handleChange = (event) => {
    setUser({
      ...user,
      [event.target.id]: event.target.value,
    });
  };

  // PUT WHEN FORM SUBMITTED - ()
  const handleSubmit = (event) => {
    event.preventDefault();
    axios.put(PUTUserUrl, user).then((response) => {
      const replyData = response.data[0]
      setDbReply(response.data)
      })
     .catch(error => console.error('error: ${error}'))
  };


  return (
    
    <main>
      <header>
      <div className="MetaMaskDIV">
            <button className='MMconnectBUTTON' onClick={connectwalletHandler}> {defaultAccount ? shortAddress : "Connect"} </button>
            <button className='MMconnectBUTTON' onClick={addEditDetails}>{showEditForm ? "Hide Form" : "Add / Edit User Details" }</button>
           
        <div className='MMErrorMsgDIV'>{errorMessage}</div>
        </div>

      </header>

      <div className='mainpage'>
       
        <div className="userDetails" style={{ display: (ShowUserStats ? 'block' : 'none') }}>
        <h4 className="walletAddress">Address:{defaultAccount}</h4>
            <h4 className="walletAddress">Wallet Amount: {userBalance}</h4>
            <ul>
            <li>Username: {user ? user.userName : ''} ({user ? user.email : ''})</li>
            <li>First Name: {user ? user.firstName : ''}</li>
            <li>Last Name: {user ? user.lastName : ''}</li>
            <li>Address: {defaultAccount} ({Math.round(userBalance)})</li>
            </ul>
            </div>

        <div className='newUserForm' style={{ display: (showEditForm ? 'block' : 'none') }}>
        <form>
          <h1>{user ? 'Update' : 'Add'} User Details</h1>
          <fieldset>
            <label><p>Preferred UserName</p>
              <input id='userName' name="userName" value={user && user.userName} onChange={handleChange} /> </label>
            <label><p>First Name</p>
              <input id='firstName' name="firstName" value={user && user.firstName } onChange={handleChange}/> </label>
            <label><p>Last Name</p>
              <input id='lastName' name="lastName" value={user && user.lastName } onChange={handleChange}/> </label> 
            <label><p>email</p>
              <input id='email' name="email" value={user && user.email } onChange={handleChange}/> </label><br/><br/>  
            
            <button onClick={handleSubmit}>Update Post</button>
          </fieldset>
          </form>
 
        </div>

        <div className='allUsersTableDiv'>

        </div>
          <div className='AllUsersTableTable' >
            All {allUserData.length} Users:<br/> {allUserData.Role}
            <table>
              <thead>
                <tr>
                <th>user ID</th>
                <th>firstname</th>
                <th>lastname</th>
                <th>username</th>
                <th>email</th>
                <th>Address</th>
                <th>Status</th>
                <th>Role</th>
                <th>Action:Ban</th>
                <th>Action:Delete</th>
                </tr></thead>
              <tbody>
  {allUserData.map((data) => {
     return (
       <tr key={data.idUsers} className={data.Status === 'Banned' ? 'bannedTR' : 'notbannedTR' }>
          <td>{data.idUsers}</td>
          <td>{data.firstName}</td>
          <td>{data.lastName}</td>
          <td>{data.userName}</td>
          <td>{data.email}</td>
          <td>{data.ethAddress}</td>
          <td>{data.Status}</td>
          <td>{data.Role} </td>
          <td onClick={() => {data.Status === 'Banned' ?  BanUser(data.idUsers, 'unban') :  BanUser(data.idUsers,'ban')}}>{data.Status === 'Banned' ? 'unban' : 'ban'} User {data.userName}</td>
          <td onClick={() => {DeleteUser(data.idUsers)}}>Delete User {data.userName}</td>
          </tr>
   )})}</tbody>
   </table>
    Database response: {dbReply.data && dbReply.message}
          </div>
      </div>
    </main>
  );
}

export default App;