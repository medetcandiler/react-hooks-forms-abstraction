import { useState, useEffect, useRef } from "react";
import { collection, addDoc, deleteDoc, doc, updateDoc, query, onSnapshot } from "firebase/firestore";
import { db } from "../firebase-config";

function Form() {
  const [form, setForm] = useState({
    firstName: '',
    lastName: ''
  })
  const [users, setUsers] = useState([]);
  const [onEdit, setOnEdit] = useState(false);
  const [seletected, setSelected ] = useState({});
  const firstNameRef = useRef();

  const usersRef = collection(db, 'users')

  useEffect(() => {
    const q = query(collection(db, "users"));
    const unsubscribe = onSnapshot(q, (querySnapShot) => {
      let usersArr = [];
      querySnapShot.forEach((doc) => {
        usersArr.push({
          ...doc.data(),
          id: doc.id,
        });
      });
      setUsers(usersArr);
    });
    return () => unsubscribe();
  }, [])

  function handleChange(e) {
    const { name, value } = e.target;
    setForm(prev => ({
      ...prev,
      [name]: value
    }))
  }


  async function handleSubmit(e) {
    e.preventDefault();
    if (onEdit) {
      updateDoc(doc(db, 'users', seletected?.id), form)
    } else {
      if(form.firstName && form.lastName) {
        addDoc(usersRef, form)
      }
    }

    setForm({
      firstName: '',
      lastName: ''
    })
  }

  const handleDelete = async (id) => {
    await deleteDoc(doc(db, 'users', id))
  }

  const handleUpdate = (user) => {
    setOnEdit(prev => !prev);
    firstNameRef.current.focus();
    setSelected(user)
  }

  return (
    <div>
      <form onSubmit={handleSubmit}>
        {onEdit ? <>
          <input
            ref={firstNameRef}
            type="text"
            name="firstName"
            onChange={handleChange}
            value={form.firstName}
            placeholder={`Edit "${seletected.firstName}" your first name`}
          />
          <input
            type="text"
            name="lastName"
            onChange={handleChange}
            value={form.lastName}
            placeholder={`Edit "${seletected.lastName}"`}
          />
        </> :
          <>
            <input
              ref={firstNameRef}
              type="text"
              name="firstName"
              onChange={handleChange}
              value={form.firstName}
              placeholder="first name..."
            />
            <input
              type="text"
              name="lastName"
              onChange={handleChange}
              value={form.lastName}
              placeholder="last name..."
            /></>}
        <button type="submit">Submit</button>
      </form>
      {users.map(user => (
        <div key={user.id}>
          <p>{user.firstName}</p>
          <p>{user.lastName}</p>
          <button onClick={() => handleDelete(user.id)}>X</button>
          <button onClick={() => handleUpdate(user)}>update</button>
        </div>
      ))}
    </div>
  );
}

export default Form;
