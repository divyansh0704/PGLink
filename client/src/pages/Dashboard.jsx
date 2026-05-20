import React, { useEffect } from 'react'
import { useState } from 'react'
import API from '../utils/api'
import AddPgForm from '../components/AddPgForm';
import { useNavigate } from 'react-router-dom';


const Dashboard = ({onClosePg}) => {
    // const [user, setUser] = useState(null);
    // const [showAddPG,setShowAddPG]=useState(false);
    const navigate = useNavigate();
    // const token = localStorage.getItem('token');
    // const getuser = JSON.parse(localStorage.getItem('user'));
    // console.log(getuser);
    


    // useEffect(() => {
    //     setUser(getuser);
    //     console.log("user",user)
    // }, [])

    return (

        <div>
            
            <AddPgForm  onClosePg={onClosePg} />
            {/* user={user} */} 
            {/* above attribute removed from addpgform element */}
            
        </div>
    )
}

export default Dashboard