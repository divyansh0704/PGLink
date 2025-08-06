import React, { useEffect } from 'react'
import { useState } from 'react'
import API from '../utils/api'
import AddPgForm from '../components/AddPgForm';
import { useNavigate } from 'react-router-dom';


const Dashboard = ({onClosePg}) => {
    const [user, setUser] = useState(null);
    // const [showAddPG,setShowAddPG]=useState(false);
    const navigate = useNavigate();

    useEffect(() => {
        API.get('/users/me')
            .then((res) => {
                setUser(res.data);
            })
            .catch((err) => {
                console.error("failed to fetch user: ", err);
                setTimeout(() => navigate('/login'), 1500);

            })
    }, [navigate])

    return (

        <div>
            {/* <h2 style={{
                paddingLeft:"2%"
            }}>Dashboard</h2> */}
           
            {/* {user ? (
                user.role === 'owner' ? (
                    <AddPgForm user={user} onClose={onClose} />
                ) : (
                    <p>You are not authorized to add PGs.</p>
                )
            ) : (
                <p>Loading user data...</p>
            )} */}
            <AddPgForm user={user} onClosePg={onClosePg} />
            
        </div>
    )
}

export default Dashboard