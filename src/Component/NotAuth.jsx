import { useNavigate } from 'react-router-dom';

const NotAuth=()=>{
    const navigate = useNavigate();

    return(
        <div className="not-auth">
            <h1>Not Authenticated</h1>
            <a onClick={()=>navigate('/')}>Move to log in page</a>
        </div>
    )
}

export default NotAuth