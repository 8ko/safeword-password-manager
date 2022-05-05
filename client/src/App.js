import "./App.css";
import { useState, useEffect } from "react";
import Axios from "axios";
import Swal from 'sweetalert2';

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
    Axios.post("http://localhost:3001/addpassword", {
      password: password,
      title: title,
    });
    console.log("Password added");
    document.getElementById('title').value = '';
    document.getElementById('password').value = '';
    
    Swal.fire({
      title: 'Success!',
      text: 'Password has been added to your vault.',
      icon: 'success',
      confirmButtonColor: '#318ce7',
      confirmButtonText: 'Okay',
      showCloseButton: 'true',
      closeButtonHtml: '&times;',
    });
    // window.location.reload();
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
          }}
        />
        <button onClick={addPassword}> Add Password</button>
      </div>

      <div className="Passwords">
        {passwordList.map((val, key) => {
          return (
            <div
              className="password"
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
          );
        })}
      </div>
    </div>
  );
}

export default App;
