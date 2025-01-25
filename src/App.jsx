import { useState, useEffect } from 'react'
import { showNotif } from './notifications/Notifs'
import Axios from 'axios'
import './App.css'

function App() {
  const [userLists, setUserLists] = useState([])
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')
  const [prevUserCount, setPrevUserCount] = useState(0)

/* Refactored Approach */
  const handleInput = (e) => {
    const { name, value } = e.target
    if( name === 'username' ) setUsername(value)
    if( name === 'password' ) setPassword(value)
  }

  /* para mag notif lahat ng na upload at na remove */
  const fetchUsers = async () => {
    try{
      const res = await Axios.get(`http://localhost:3003/users/getUser`)
      setUserLists(res.data)

      /* para sa notif new data pangkalahatan */
      if (res.data.length > prevUserCount) {
        showNotif('New Upload', 'New data has been uploaded!')
        setPrevUserCount(res.data.length)
      }
      /* para sa notif remove data pangkalahatan */
      if(res.data.length < prevUserCount) {
        showNotif('uploads remove', 'A post remove from the user!')
        setPrevUserCount(res.data.length)
      }

    } catch (error) {
      console.error('Error fetching users: ', error)
    }
  }


//get
  useEffect(() => {
      fetchUsers()
      const interval = setInterval(fetchUsers, 5000)
      return () => clearInterval(interval)
  }, [prevUserCount])

//create
  const createUser = (e) => {
    e.preventDefault()
    Axios.post('http://localhost:3003/users/createUser', { username: username, password: password }).then((res) => {
      const newUser = res.data.user
      setUserLists([ ...userLists, newUser])
      // console.log("Updated userLists:", [...userLists, newUser]);
      setUsername('')
      setPassword('')
      
      showNotif('Success', 'User successfully created!')
    })
    .catch((error) => {
      console.error('Error creating user:',error)

      showNotif('Error', 'Failed to create user. Please try again.')
    })
  }

//delete 
  const deleteUser = (id) => {
    Axios.post(`http://localhost:3003/users/delete/${id}`).then(() => {
      setUserLists(userLists.filter(user => user._id !== id))

      showNotif('Success', 'User deleted successfully!')

    }).catch((err) => {
      console.log(err)
      showNotif('Error', 'Failed to create user. Please try again.')
    })
  }


  

  return (
    <>
    <div>
    {userLists && userLists.length > 0 ? (
      userLists.map((user, index) => {
        return (
          <div key={index}>
            <h1>{user.username}</h1>
            <h1>{user.password}</h1>
            <button onClick={() => deleteUser(user._id)}>Delete</button>
            <hr />
          </div>
        );
      })
    ) : (
      <p>No users found.</p>
    )}
  </div>

      <div>
        <form onSubmit={createUser}>
        <input type='text' name='username' value={username} onChange={handleInput} placeholder='username...'/>
        <input type='text' name='password' value={password} onChange={handleInput} placeholder='password...'/>
        <button type='submit'>Submit</button>
        </form>
      </div>
    </>
  )
}

export default App
