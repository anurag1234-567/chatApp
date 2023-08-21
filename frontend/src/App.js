import { useState } from 'react';
import Chat from './chat';
import './app.css';

function App(){

  const [username, setUsername] = useState('');
  const [showChat, setShowChat] = useState(false);

  const handleSubmit = (e)=>{
    e.preventDefault();
    setShowChat(true);
  }

  return(
    <>
    {
      showChat ? 
      ( <Chat  username={username}  /> )
      : ( <div className='login-page'>
            <form onSubmit={handleSubmit}>
            <label className='username'>Username</label>
            <input type='text' value={username}
            onChange={ (e)=>{ setUsername(e.target.value); }} />
            <input type='submit' value='Join' className='join'/>
            </form> 
         </div> )
    }
    </>
  );
}
export default App;