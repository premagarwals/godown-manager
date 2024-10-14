import React, {useState} from 'react'
import { useNavigate } from 'react-router-dom'
import backend from "./config"
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faUnlock } from "@fortawesome/free-solid-svg-icons";

const Auth = (props) => {
    const [alias, setAlias] = useState('');
    const [passKey, setPassKey] = useState('');
    const [status, setStatus] = useState('');
    const navigate = useNavigate();

    if (props.isAuthenticated){
        navigate('/');
    }

    const Authenticate = async () => {
      setStatus('validating...')
        try {
          const response = await fetch(`${backend}/login`, {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify({ 'alias' : alias, 'passKey' : passKey }),
          });
    
          if (!response.ok) {
            throw new Error('Network response was not ok');
          }
    
          const data = await response.json();
          if (data.auth){
            window.localStorage.setItem("token",data.token);
            props.verify(data.auth);
            navigate('/');
          }
          else{
            setStatus(data.message);
          }
        } catch (error) {
          console.error('Error during authentication:', error);
        }
      };

    return (
        <div className='w-screen h-screen flex flex-col gap-2 justify-center items-center'>
            <h2 className='text-lg text-teal-600'>Are you The Godown Owner?</h2>
            <input
                type="text"
                value={alias}
                onChange={(e) => setAlias(e.target.value)}
                placeholder="Enter admin alias"
                className='bg-slate-200 p-4'
            />
            <input
                type="password"
                value={passKey}
                onChange={(e) => setPassKey(e.target.value)}
                placeholder="Enter pass key"
                className='bg-slate-200 p-4'
            />
            <p className={`text-sm ${status==="Invalid Alias or Passkey"? "text-red-500" : "text-blue-500"}`}>{status}</p>
            <button onClick={Authenticate} className='p-4 bg-slate-400 text-slate-100'>Unlock Godown <FontAwesomeIcon icon={faUnlock}/></button>
            
        </div>
    );
}

export default Auth