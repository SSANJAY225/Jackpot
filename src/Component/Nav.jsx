import './Nav.css'

const Nav=()=>{
    return(
        <>
            <div className='navbar'>
                <div className='name'>
                    <p>jackpot</p>
                </div>
                <ul>
                    <li><a href="/stock" onClick={handileStock}>stock</a></li>
                    <li><a href="/invoice">invoice</a></li>
                    <li><a href="/profile">profile</a></li>
                    <li><a href="/">Singout</a></li>
                </ul>
                
            </div>
        </>
    )
}

export default Nav;