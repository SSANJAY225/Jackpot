import { useNavigate } from 'react-router-dom';
import './Nav.css';
import Axios from 'axios';

const Nav = () => {
    const navigate = useNavigate();
    const handleSignOut = async () => {
        try {
            await Axios.post('https://jackpot-backend-r3dc.onrender.com/api/logout', {}, { withCredentials: true });
            localStorage.removeItem('userData'); 
            navigate('/');
        } catch (error) {
            console.error('Error during logout:', error);
        }
    };

    return (
        <>
            <div className='navbar'>
                <div className='name'>
                    <p>jackpot</p>
                </div>
                <ul>
                    <li onClick={() => navigate('/stock')}><a>stock</a></li>
                    <li onClick={() => navigate('/invoice')}><a>invoice</a></li>
                    <li onClick={() => navigate('/profile')}><a>profile</a></li>
                    <li onClick={handleSignOut}><a>Sign out</a></li>
                </ul>
            </div>
        </>
    );
}

export default Nav;
