import { useState, useEffect, useRef } from'react';
import io from 'socket.io-client';
import EmojiPicker from 'emoji-picker-react';
import SendIcon from '@mui/icons-material/Send';
import SentimentSatisfiedOutlinedIcon from '@mui/icons-material/SentimentSatisfiedOutlined';
import Sidebar from './sidebar';

const socket = io.connect('http://localhost:4000');

function Chat(props){
 
    const username = props.username;
    const socketId = socket.id;
    const containerRef = useRef(null);
    const [message, setMessage] = useState('');
    const [messages, setMessages] = useState([]);
    const [showEmojis, setShowEmojis] = useState(false);

    useEffect( ()=>{
        socket.emit('user-connect', username);

        socket.on('message', (data)=>{
            setMessages( messages => [...messages, data]);
        })
    }, []);

    useEffect(()=>{
       scrolldown();
    }, [messages]);
    
    const scrolldown = () =>{
        const container = containerRef.current;
        container.scrollTop = container.scrollHeight;
    }

    const handleSubmit = (e)=>{
      e.preventDefault();
      if(message.trim() !== ''){
          setMessages( messages => [...messages, {username, message, socketId } ]);
          scrolldown();
          socket.emit('message', { username, message, socketId });
        }
        setMessage('');
    }

    return(
        <>
         <h2 className='header'>ChatAPP</h2>
         <div className='container'>
         <Sidebar socket={socket} />
         <div className='main'>

         <div ref={containerRef} className={showEmojis ? 'chatbody ch1' : 'chatbody'}>
            {
               messages.map( (obj, index)=>{
                   return obj.socketId !== socketId ?
                   (
                    <div key={index} className='message-wrp left'>
                   <div className='message'>
                   <p className='username'>{obj.username}</p>
                   <p className='message-content'>{obj.message}</p>
                   </div>
                   </div>
                   )
                   : (
                       <div key={index} className='message-wrp right'>
                       <div className='message'>
                       <p className='username'>You</p>
                       <p className='message-content'>{obj.message}</p>
                    </div>
                    </div>
                    
                    )
                })
            }
            </div>

            <div className={ showEmojis ? 'footer ch2' : 'footer'}> 
                    
                    <form onSubmit={handleSubmit} className='chatbar'>
                    <SentimentSatisfiedOutlinedIcon className='emoji' onClick={()=>{ setShowEmojis( showEmojis => !showEmojis )}} />
                    <input type='text' placeholder='Write something...' className='type-bar'
                        value={message} onChange={ (e)=>{ setMessage(e.target.value); }} />
                        <button className='send'><SendIcon /></button>
                    </form>
                    {
                        showEmojis &&
                        <EmojiPicker width='100%' searchDisabled theme='dark' lazyLoadEmojis={true} emojiStyle='native' suggestedEmojisMode='recent'
                        onEmojiClick={(e)=>{ setMessage(message => message + e.emoji);  }}/>
                    }
            </div>
             
            </div>
         </div>
        </>
    );
}
export default Chat;