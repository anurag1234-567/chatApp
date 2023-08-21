import { useState, useEffect } from 'react';

function Sidebar(props){

    const socket = props.socket;
    const [users, setUsers] = useState([]);

    useEffect( ()=>{
        socket.on('active-users', (activeUsers) =>{
            const usernames = activeUsers.map( ({ username, socketId }) => username );
            setUsers(usernames);
        });
    }, [])

    return(
        <div className='sidebar'>
        <h2>Active Users</h2>
        {
            users.map( user => <p className='active-users'>{user}</p> )
        }
        </div>
    );
}
export default Sidebar;