import { useState, useEffect } from 'react';

function App() {
  const [users, setUsers] = useState([]);
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [age, setAge] = useState('');
  const [editinguserId, setEditingUserId] = useState(null);

  const fetchUsers = async () => {
    try {
      const response = await fetch("http://localhost:8080/getuser");
      const data = await response.json();
      console.log(data);
      setUsers(data);
    } catch (error) {
      console.error("Error fetching users:", error);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  const handleNameChange = (e) =>{
    setName(e.target.value);
    }

  const handleEmailChange = (e) =>{
    setEmail(e.target.value);  
  }

  const handleAgeChange = (e) =>{
    setAge(e.target.value);
  }

  const handleEditClick = (user) => {
    setName(user.name);
    setEmail(user.email);
    setAge(user.age);
    setEditingUserId(user._id);
  }

  // const handleSubmit = async(e) => {
  //   e.preventDefault();

  //   try{
  //     const response = await fetch("http://localhost:8080/adduser", {
  //       method: 'POST',
  //       headers: {'Content-Type' : 'application/json'},
  //       body: JSON.stringify({ name, email, age})
  //     });
  //     if(!response.ok){
  //       throw new Error("network respons was not ok!");
  //     }
  //     setName('');
  //     setEmail('');
  //     setAge('');
  
  //     fetchUsers();
  //   }
  //   catch(err){
  //     console.error('error adding users:', err);
  //   }
  // }
  
  const handleDelete = async(userId) => {
    try{
      const response = await fetch("http://localhost:8080/deleteuser", {
        method: 'DELETE',
        headers: {'Content-Type' : 'application/json'},
        body: JSON.stringify({ userId })
      });
      if(!response.ok){
        throw new Error("network respons was not ok!");
      }
      setName('');
      setEmail('');
      setAge('');
  
      fetchUsers();
    }
    catch(err){
      console.error('error adding users:', err);
    }
  }

  //add / update user
  const handleSubmit = async(e) => {
    e.preventDefault();

    const url = editinguserId ? `http://localhost:8080/updateuser/${editinguserId}` : 'http://localhost:8080/adduser';
    const method = editinguserId ? "PUT" : "POST";

    try{
      const response = await fetch(url, {
        method,
        headers: {'Content-Type' : 'application/json'},
        body: JSON.stringify({name, email, age})
      })

      if(!response.ok){
          throw new Error("Network response was not ok!");
        }
        setName('');
        setEmail('');
        setAge('');
        setEditingUserId(null);

        fetchUsers();
    }
    catch (err) {
      console.error(`Error ${editUserId ? 'updating' : 'adding'} user:`, err);
    }
  }

  // const handleUpdate = async(e, editUserId) => {
  //   e.preventDefault();

  //   if (!editUserId) return;

  //   try {
  //     const response = await fetch(`http://localhost:8080/updateuser/${editUserId}`, {
  //       method: 'PUT',
  //       headers: {'Content-Type' : 'application/json'},
  //       body: JSON.stringify({ name, email, age })
  //     });
  //     if(!response.ok){
  //       throw new Error("Network response was not ok!");
  //     }
  //     setName('');
  //     setEmail('');
  //     setAge('');
  //     setEditingUserId(null);

  //     fetchUsers();
  //   } catch(err) {
  //     console.error('Error updating user:', err);
  //   }
  // }

  return (
    <div>
      <h1>Users</h1>
      <ul>
        {users.map(user => (
          <li key={user._id}>
            {user.name} - {user.email} - {user.age}
            <button onClick={() => handleDelete(user._id)}>Delete</button>
            <button onClick={() => handleEditClick(user)}>Edit</button>
          </li>
        ))}
      </ul>
      <form onSubmit={handleSubmit}>
        <label htmlFor="name">Username</label>
        <input
          type="text"
          id="name"
          value={name}
          onChange={handleNameChange}
          required
        />
        <label htmlFor="email">Email</label>
        <input
          type="email"
          id="email"
          value={email}
          onChange={handleEmailChange}
          required
        />
        <label htmlFor="age">Age</label>
        <input
          type="number"
          id="age"
          value={age}
          onChange={handleAgeChange}
          required
        />
        <button type="submit">{editinguserId ? 'Update' : 'Add'} User</button>
      </form>
    </div>
  );
}

export default App;
