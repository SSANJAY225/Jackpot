import { useNavigate } from 'react-router-dom'
import './Nav.css'

const Nav=()=>{
    const navigate=useNavigate()
    return(
        <>
            <div className='navbar'>
                <div className='name'>
                    <p>jackpot</p>
                </div>
                <ul>
                    <li onClick={()=>navigate('/stock')}><a>stock</a></li>
                    <li onClick={()=>navigate('/invoice')}><a>invoice</a></li>
                    <li onClick={()=>navigate('/profile')}><a>profile</a></li>
                    <li onClick={()=>navigate('/')}>Singout</li>
                </ul>
                
            </div>
        </>
    )
}

export default Nav;