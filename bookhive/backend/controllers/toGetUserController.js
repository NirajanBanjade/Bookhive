const getUser = require('../models/User');

const registerUser = async (req, res) => {
    try {
        const { username, email, password } = req.body;
    
        // Check if user already exists
        const existingUser = await getUser.findOne({ $or: [{ username }, { email }] });
        if (existingUser) {
            return res.status(400).json({ error: 'Username or email already in use' });
        }
    
        // Create new user
        const newUser = new getUser({ username, email });
        await newUser.setPassword(password);
        await newUser.save();
    
        res.status(201).json({ message: 'User registered successfully', userId: newUser._id });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
}

module.exports = registerUser;
