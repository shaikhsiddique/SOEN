import React, { useContext } from 'react'
import { UserContext } from '../context/UserContext'

function Home() {
  const {user, setUser} = useContext(UserContext);
  console.log(user);
  return (
    <div>{user? user.email :null}</div>
  )
}

export default Home