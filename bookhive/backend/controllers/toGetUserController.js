const getUser = require('../models/User');

const emailValidator = (email)=>{
    if (typeof email !== 'string') return false;
    if(/\s/.test(email)) return false;
    if((email.length<6)||(email.length>50)) return false;
    const basicShape = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/; 
    return basicShape.test(email);
  }
  
  const passwordValidator = (password) => {
    if (typeof password !== 'string') return false;
    if (/\s/.test(password)) return false;
    const re = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[^\w\s])[^\s]{8,64}$/; 
    return re.test(password);
  };

const registerUser = async (req, res) => {
    try {
        const { username, email, password } = req.body;
        if (!username || !email || !password) {
            return res.status(400).json({ message: 'Name, email, and password are required.' });
        }
        if (!emailValidator(email)) {
            return res.status(400).json({ message: 'Email is invalid' });
        }
        if (!passwordValidator(password)) {
            return res.status(400).json({
              message: `Password doesn't match the criteria.`,
            });
        }
      
        
        // Check if user already exists
        const existingUser = await getUser.findOne({ $or: [{ username }, { email }] });
        if (existingUser) {
            return res.status(400).json({ error: 'Username or email already in use!!' });
        }
    
        // Create and save the new user
        const newUser = new getUser({ username, email });
        await newUser.setPassword(password);
        await newUser.save();
    
        res.status(200).json({ message: 'User registered successfully!', userId: newUser._id });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
}

const loginUser= async (req, res) => {
    try {
        const {name_email, password}= req.body;
        
        if(!name_email || !password){
            return res.status(400).json({message: 'Name/email and password are required.'});
        }

        const user = await getUser.findOne({ $or: [{ username: name_email }, { email: name_email }] }).select('+passwordHash');
        // select.(+passwordgash) opts the password hash to return from api / by default it was hidden and wont be returned by api.

        if(!user){
            return res.status(400).json({error: 'Invalid username/email or password!!'});
        }
        const isPasswordValid = await user.verifyPassword(password); // this will call verify password in getUser model to hash the entered password and compare it with the stored hash.
        
        if(!isPasswordValid){
            return res.status(400).json({error: 'Invalid username/email or password!!'});
        }
        res.status(200).json({message: 'Successfully Logged in!!', userId: user._id, username: user.username, email: user.email, role: user.role});

    } catch (err) {
        res.status(500).json({ error: err.message });
    }
}


module.exports = {registerUser, loginUser};
