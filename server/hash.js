import bcrypt from 'bcrypt';

const saltRounds = 10;

const hashPassword = async (plainPassword) => {
    try {
        const salt = await bcrypt.genSalt(saltRounds);
        const hashedPassword = await bcrypt.hash(plainPassword, salt);
        return hashedPassword;
    } catch (error) {
        throw new Error('Error hashing password: ' + error.message);
    }
};

// Call the function and log the result
hashPassword("Jackpot@2024").then(hashedPassword => {
    console.log("Hashed Password: ", hashedPassword);
}).catch(err => {
    console.error(err);
});
