import { useState, useEffect, useRef } from "react";
import { collection, addDoc, deleteDoc, doc, updateDoc, query, onSnapshot, collectionGroup } from "firebase/firestore";
import { useForm } from 'react-hook-form';

import { db } from "../firebase-config";

function Form() {
  const [users, setUsers] = useState([]);
  const [onEdit, setOnEdit] = useState(false);
  const [selected, setSelected] = useState({});

  const { register, handleSubmit, reset } = useForm({
    defaultValues: {
      firstName: '',
      lastName: ''
    }
  });
  const onsubmit = data => {
    if (onEdit) {
      updateDoc(doc(db, 'users', selected?.id), data)
    } else {
      addDoc(usersRef, data)
    }
    reset()
  }

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



  const handleDelete = async (id) => {
    await deleteDoc(doc(db, 'users', id))
  }

  const handleUpdate = (user) => {
    setOnEdit(prev => !prev);
    setSelected(user);
    setTimeout(() => {
      const edit = document.querySelector('#edit')
      if(edit){
        edit.focus()
      }
    },0)
  }

  return (
    <div>
      <form onSubmit={handleSubmit(onsubmit)}>
        {onEdit ? <>
          <input
            id="edit"
            {...register('firstName')}
            placeholder='Edit first name...'
          />
          <input
            {...register('lastName')}
            placeholder='Edit last name...'
          />
        </> :
          <>
            <input
              {...register('firstName')}
              placeholder="first name..."
            />
            <input
              {...register('lastName')}
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
