import "./App.css";
import { useState, useEffect } from "react";
import Axios from "axios";
import Swal from 'sweetalert2';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faEye, faTrash } from '@fortawesome/free-solid-svg-icons';

function App() {
  const [password, setPassword] = useState("");
  const [title, setTitle] = useState("");
  const [passwordList, setPasswordList] = useState([]);


  useEffect(() => {
    Axios.get("http://localhost:3001/showpasswords").then((response) => {
      setPasswordList(response.data);
    });
  }, []);

  const addPassword = () => {
    var title=document.getElementById('title').value;
    var password=document.getElementById('password').value;
    if (title!=='' || password!==''){
      console.log("hello");
      Axios.post("http://localhost:3001/addpassword", {
        password: password,
        title: title,
      });
      console.log("Password added");
      // title = '';
      // password = '';
      
      Swal.fire({
        title: 'Success!',
        text: 'Password has been added to your vault.',
        icon: 'success',
        // showConfirmButton: false,
        confirmButtonColor: '#318ce7',
        confirmButtonText: 'Okay',
        showCloseButton: true,
        closeButtonHtml: '&times;',
        timer: 5000
      }).then((result) =>{
        window.location.reload();
      });

    } else {
      console.log('empty');
      Swal.fire({
        title: 'Error!',
        text: 'Please fill out the fields.',
        icon: 'error',
        showConfirmButton: false,
        showCloseButton: true,
        closeButtonHtml: '&times;',
        timer: 1500
      });
    }
    
  };

  const deletePassword = () => {
    Axios.delete()
    // Axios.post("http://localhost:3001/deletepassword", {
    //   password: password,
    //   title: title,
    // });
    console.log("Password deleted");

    // Swal.fire({
    //   title: 'Success!',
    //   text: 'Password has been removed from your vault.',
    //   icon: 'success',
    //   confirmButtonColor: '#318ce7',
    //   confirmButtonText: 'Okay',
    //   showCloseButton: 'true',
    //   closeButtonHtml: '&times;',
    // }).then((result) =>{
    //   window.location.reload();
    // });
  };

  const decryptPassword = (encryption) => {
    Axios.post("http://localhost:3001/decryptpassword", {
      password: encryption.password,
      iv: encryption.iv,
    }).then((response) => {
      setPasswordList(
        passwordList.map((val) => {
          return val.id === encryption.id
            ? {
              id: val.id,
              password: val.password,
              title: response.data,
              iv: val.iv,
            }
            : val;
        })
      );
    });
  };

  return (
    <div className="App">
      <div className="AddingPassword">
        <div className="SafewordLogo">
        <p>Safe<mark>Word</mark></p>
        </div>
        <input
          type="text"
          id="password"
          placeholder="Ex. password123"
          onChange={(event) => {
            setPassword(event.target.value);
          }}
        />
        <input 
          type="text"
          id="title"
          placeholder="Ex. Facebook"
          onChange={(event) => {
            setTitle(event.target.value);
          }}z
        />
        <button onClick={addPassword}> Add Password </button></div>

      <div className="Passwords w-50 d-flex">
        {passwordList.map((val, key) => {
          return (
            <div className="container-fluid">
              <div className="row text-white ">
                <div className="col-8">
                  <div
                    className="password w-100 h-75 rounded"
                    onClick={() => {
                      decryptPassword({
                        password: val.password,
                        iv: val.iv,
                        id: val.id,
                      });
                    }}
                    key={key}
                  >
                    <h3>{val.title}</h3> 
                  </div>
                </div>
                <div className="col w-100">
                  <div className="view h-75 rounded">
                    <FontAwesomeIcon icon={faEye}></FontAwesomeIcon>
                  </div>
                </div>
                <div className="col w-100">
                  <div className="del h-75 rounded">
                    <FontAwesomeIcon onClick={deletePassword} icon={faTrash}></FontAwesomeIcon>
                  </div>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

export default App;
