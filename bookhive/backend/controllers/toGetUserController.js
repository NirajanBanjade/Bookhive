const getUser = require('../models/User');
const jwt = require('jsonwebtoken');
const { sendMail } = require('../utils/mailEvents'); 
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
        const { username, email, password, dateOfBirth } = req.body;
        if (!username || !email || !password || !dateOfBirth) {
            return res.status(400).json({ message: 'Username, email, password, and date of birth are required.' });
        }
        if (!emailValidator(email)) {
            return res.status(400).json({ message: 'Email is invalid' });
        }
        if (!passwordValidator(password)) {
            return res.status(400).json({
              message: 'Password does not match the criteria.',
            });
        }

        // Validate date of birth
        const dob = new Date(dateOfBirth);
        if (isNaN(dob.getTime())) {
            return res.status(400).json({ message: 'Invalid date of birth format.' });
        }

        // Check if date is not in the future
        if (dob > new Date()) {
            return res.status(400).json({ message: 'Date of birth cannot be in the future.' });
        }
        
        // Check if date is reasonable (not older than 120 years)
        const maxAgeDate = new Date();
        maxAgeDate.setFullYear(maxAgeDate.getFullYear() - 120);
        if (dob < maxAgeDate) {
            return res.status(400).json({ message: 'Invalid date of birth.' });
        }
      
        
        // Check if user already exists
        const existingUser = await getUser.findOne({ $or: [{ username }, { email }] });
        if (existingUser) {
            return res.status(400).json({ error: 'Username or email already in use!!' });
        }
    
        // Create and save the new user
        const newUser = new getUser({ username, email, dateOfBirth: dob });
        
        // Calculate and set isMinor status
        newUser.isMinor = newUser.calculateIsMinor();
        
        await newUser.setPassword(password);
        await newUser.save();
        try {
            await sendMail.welcome(newUser);
          } catch (emailErr) {
            console.error('Failed to send welcome email:', emailErr);
            // Don't fail registration if email fails
          }
    
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

        if(!user){
            return res.status(400).json({error: 'Invalid username/email or password!!'});
        }
        const isPasswordValid = await user.verifyPassword(password);
        
        if(!isPasswordValid){
            return res.status(400).json({error: 'Invalid username/email or password!!'});
        }

        // Recalculate isMinor status on login if dateOfBirth exists
        if (user.dateOfBirth) {
            user.isMinor = user.calculateIsMinor();
            await user.save();
        }

        const token = jwt.sign({ id: user.id }, process.env.JWT_SECRET, { expiresIn: '1h' });

        res.json({ 
            message: 'Login successful', 
            token,
            isMinor: user.isMinor || false,
            userId: user._id,
            username: user.username
        });
        // try {
        //     await sendMail.loginAlert(user, {
        //       ip: req.ip || req.connection.remoteAddress,
        //       userAgent: req.get('user-agent'),
        //       timestamp: new Date()
        //     });
        //   } catch (emailErr) {
        //     console.error('Failed to send login alert:', emailErr);
        //     // Don't fail login if email fails
        //   }

    } catch (err) {
        res.status(500).json({ error: err.message });
    }
}


module.exports = {registerUser, loginUser};
