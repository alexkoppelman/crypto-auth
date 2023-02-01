import React, { useState , useEffect} from 'react'
import axios from "axios"



export default function UserDetails(props) {

console.log('Userdetails Loaded: ' + props.defaultAccount)

let account = props.defaultAccount
const GETUserUrl = 'https://192.168.1.100:1880/userfromAddress/'

const [user, setUser] = useState({    
    firstName: '',
    lastName: '',
    email: '',
    userName: '',
    ethAddress: '', 
    Role: '',
    Status: ''
})



useEffect(() => {
    axios.get(GETUserUrl + account).then((response) => {
    const replyData = response.data[0]
    if(replyData === undefined) {
        setUser({    
            firstName: '',
            lastName: '',
            email: '',
            userName: '',
            ethAddress: account   ,
            Role: '',
            Status: ''
        }
        ) 
    console.log(user) 
    return
        }
    setUser(replyData)
    //setShowUserStats(true)
        })
  }, []);

 
    return(
        <div className="userDetails" style={{ display: (props.ShowUserStats ? 'block' : 'none') }}>
            <h4 className="walletAddress">Address:{props.defaultAccount}</h4>
            <h4 className="walletAddress">Wallet Amount: {props.userBalance}</h4>
            <ul>
                <li>Username: {user ? user.userName : ''} ({user ? user.email : ''})</li>
                <li>First Name: {user ? user.firstName : ''}</li>
                <li>Last Name: {user ? user.lastName : ''}</li>
                <li>Role: {user ? user.Role : ''}</li>
                <li>Last Status: {user ? user.Status : ''}</li>
                
                <li>Address: {props.defaultAccount} ({Math.round(props.userBalance)})</li>
            </ul>
        </div>
    )
}