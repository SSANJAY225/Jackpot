import { useState } from 'react';
import Nav from './Nav';

const ChangePass = () => {
    const [Email, setEmail] = useState('');
    const [Password, setPassword] = useState('');
    const [NewPass, setNewPass] = useState('');
    const [ConfirmNewPass, setConfirmNewPass] = useState('');
    const [message, setMessage] = useState('');

    const handleSubmit = async (e) => {
        e.preventDefault();

        // Basic validation: check if the new password matches the confirm password
        if (NewPass !== ConfirmNewPass) {
            setMessage('New password and confirm password do not match');
            return;
        }

        try {
            // Send the request to the backend API
            const response = await fetch('http://localhost:5000/api/change-password', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    Email,
                    Password: Password,
                    newPassword: NewPass
                }),
            });

            const data = await response.json();

            if (response.ok) {
                setMessage('Password changed successfully!');
            } else {
                setMessage(data.error || 'Failed to change password');
            }
        } catch (error) {
            console.log(error);
            setMessage('An error occurred. Please try again.');
        }
    };

    return (
        <>
            <Nav />
            <div className="box">
                <form onSubmit={handleSubmit}>
                    <div className="innerbox">
                        <h1>Update Profile</h1>
                        <label>Email: </label>
                        <input
                            type="email"
                            placeholder="Email"
                            value={Email}
                            onChange={(e) => setEmail(e.target.value)}
                            required
                        />
                        <label>Password: </label>
                        <input
                            type="password"
                            placeholder="Current Password"
                            value={Password}
                            onChange={(e) => setPassword(e.target.value)}
                            required
                        />
                        <label>New Password:</label>
                        <input
                            type="password"
                            placeholder="New Password"
                            value={NewPass}
                            onChange={(e) => setNewPass(e.target.value)}
                            required
                        />
                        <label>Confirm New Password: </label>
                        <input
                            type="password"
                            placeholder="Confirm New Password"
                            value={ConfirmNewPass}
                            onChange={(e) => setConfirmNewPass(e.target.value)}
                            required
                        />
                        <button type="submit">Update</button>
                    </div>
                    <p>{message}</p>
                </form>
            </div>
        </>
    );
};

export default ChangePass;
