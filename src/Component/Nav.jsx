import './Nav.css'

const Nav=()=>{
    return(
        <>
            <div className='navbar'>
                <div className='name'>
                    <p>Jackpot</p>
                </div>
                <ul>
                    <li><a href="/stock">Stock</a></li>
                    <li><a href="/invoice">Invoice</a></li>
                    <li><a href="/profile">Profile</a></li>
                    <li><a href="/">Sign out</a></li>
                </ul>
                
            </div>
        </>
    )
}

export default Nav;