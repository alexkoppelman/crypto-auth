import React, { useState , useEffect} from 'react'
import axios from "axios";

export default function EditUserDetails(props) {
    

  const PUTUserUrl = 'https://192.168.1.100:1880/userPUTAddress/'
  const DELETEUserUrl = 'https://192.168.1.100:1880/userDelete/'
  const BanUserURL = 'https://192.168.1.100:1880/userBanPUT/'

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
    
    return(
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

    )
}