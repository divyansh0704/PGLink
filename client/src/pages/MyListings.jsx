import React, { useState, useEffect } from 'react'
import API from '../utils/api';
import "../styles/myListingsN.css";
import { Link } from 'react-router-dom';
import { Pencil, Trash2, Eye, Plus } from 'lucide-react'
import { toast } from 'react-toastify';
import { useNavigate } from 'react-router-dom';
import ShimmerCard from '../components/ShimmerCard';

const MyListings = () => {
    const [listings, setListings] = useState([]);
      const [loading, setLoading] = useState(true);
    const navigate = useNavigate();

    const fetchListings = async () => {
        try {
            const res = await API.get('/pgs/my-pgs');
            setListings(res.data);
            console.log("fetched data:", res.data);
        } catch (err) {
            console.error('Error fetching listings:', err);
        }finally{
            setLoading(false);
        }
    }
    const handleEdit = (pgId) => {
        navigate(`/edit/${pgId}`);
    };
    const handleDelete = async (pgId) => {

        const confirmDelete = window.confirm("Are you sure you want to delete this listing?");
        if (!confirmDelete) return;
        try {
            await API.delete(`/pgs/${pgId}`);
            setListings(prev => prev.filter(pg.id != pgId));
            toast.success("PG deleted successfully!", {
                position: 'top-right',
                autoClose: 2000,
            })
            setTimeout(() => {
                // navigate("/my-listings");
                // window.location.reload();
                window.location.href="/my-listings";
            }, 2000)


        } catch (err) {
            console.error("PG not deleted", err);
            alert("Error deleting PG");
        }


    }



    useEffect(() => {
        fetchListings();
    }, [])
    return (
        <div className='my-listings-container'>
            <h2 id='listHeading'>My PG Listings</h2>
            <div id='listBH'>
            <p className="subheading">Manage your PGs listed on PGLink</p>
            <Link to="/dashboard" >
            <button className="add-pg-btn" ><Plus size={18} /> Add New PG</button>
            </Link>
            
            </div>
            <div className="pg-listings-grid">
                {loading ?(
                    <>
                     <ShimmerCard/>
                     <ShimmerCard/>
                     <ShimmerCard/>
                    </>
                ):listings.length === 0 ? (
                    <p>You haven't listed any PGs yet.</p>
                ) : (
                    listings.map(pg => (
                        <div key={pg.id} className="pg-card2">
                            <img src={`${pg.imageUrl}`} alt="noimage" 
                            />
                            <h3>{pg.title}</h3>
                            <p className="location">{pg.city}</p>
                            <p className="address">{pg.address}</p>
                            <p className="rent">Rent: ₹{pg.rent}/month</p>
                            <div className="amenities">

                                {Object.entries(pg.amenities).map(([key, value]) => {
                                    if (!value) return null;

                                    const labels = {
                                        wifi: 'WiFi',
                                        laundry: 'Laundry',
                                        food: 'Food',
                                        ac: 'AC',
                                        waterCooler: 'Water Cooler',
                                        studyTable: 'Study Table',
                                    };


                                    return <span key={key} className="amenity">{labels[key] || key}</span>;
                                })}
                            </div>
                            <div className="actions fade-in-split">
                                {/* <button onClick={()=>{
                                    handleEdit(pg.id)
                                    
                                    
                                    }} className="half-button edit-btn"><Pencil size={18} /> Edit</button> */}
                                <button onClick={() => handleDelete(pg.id)} className=" half-button delete-btn"><Trash2 size={18} /> Delete</button>
                                {/* <button className="view-btn"><Eye/>👁️ View</button> */}
                            </div>
                        </div>
                    ))

                )}
            </div>
           
        </div>
    )
}

export default MyListings