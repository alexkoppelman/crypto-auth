import axios from "axios";
import React, { useState , useEffect} from 'react';

export default function AllUsersComponent(props) {

// FULL USER DATASET
const [allUserData, setAllUserData] = useState([])
// All User URL
const GETAllUserUrl = 'https://192.168.1.100:1880/userGETall/'
// GET All Users 
useEffect(() => {
    axios.get(GETAllUserUrl)
        .then((response) => {
          setAllUserData(response.data);
        })
        console.log(allUserData)
  }, [])

    function showAll(){
      console.log("show all users!")
    }
        
     return (
    
    <div >
    <div><button onclick={showAll()}>
      Get all user data button here
      </button>
    </div>
    <div className="allUsers" style= 'display: none'>
    All {allUserData.length} Users:<br/> {allUserData.Role}
        <table className='AllUsersTableTable' >
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
 <tr key={data.idUsers} >
    <td>{data.idUsers}</td>
    <td>{data.firstName}</td>
    <td>{data.lastName}</td>
    <td>{data.userName}</td>
    <td>{data.email}</td>
    <td>{data.ethAddress}</td>
    <td>{data.Status}</td>
    <td>{data.Role} </td>
    <td><a href={onclick=props.banUser(data.idUsers)}>BAN</a></td>
    <td><a href={onclick=props.deleteUser(data.idUsers)}>DELETE</a></td>
    </tr>
)})}</tbody>
</table>
</div>
</div>
     )
}