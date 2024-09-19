// import './Login.css';
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
// import Axios from 'axios';

const Login = () => {
    const [Email, setEmailState] = useState('');
    const [Password, setPassword] = useState('');
    const [message, setMessage] = useState('');
    const navigate = useNavigate();

    const handleSubmit = (e) => {
        e.preventDefault();
        // Axios.post("http://localhost:3000/login", { Email, Password })
        //     .then((response) => {
        //         setEmail(Email);
                navigate('/invoice');
            // })
            // .catch((error) => {
            //     console.log(error.response.data.error);
            //     setMessage('Error logging in.'+" "+error.response.data.error);
            // });
    };

    return (
        <>
            <div className="box">
                <form onSubmit={handleSubmit}>
                    <div className="innerbox">
                        <h1>Signin</h1>
                        <label>Email: </label>
                        <input
                            type="email"
                            placeholder="Email"
                            value={Email}
                            onChange={(e) => setEmailState(e.target.value)}
                            required
                        />
                        <label>Password: </label>
                        <input
                            type="password"
                            placeholder="Password"
                            value={Password}
                            onChange={(e) => setPassword(e.target.value)}
                            required
                        />
                        <button type="submit">Signin</button>
                        <a href="/signup">Create new user</a>
                        <p>{message}</p>
                    </div>
                </form>
                
            </div>
        </>
    );
};

export default Login;
