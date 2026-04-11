import Admin from '../models/Admin.js';
import bcrypt from 'bcrypt';

export const listAdmins = async (req, res) => {
    try {
        const admins = await Admin.find().select('-passwordHash').sort({ createdAt: -1 });
        res.status(200).json({ ok: true, admins: admins.map(a => ({ id: a._id, username: a.username, createdAt: a.createdAt })) });
    } catch (error) {
        console.error("Error listing admins:", error);
        res.status(500).json({ ok: false, message: 'Failed to fetch admins' });
    }
};

export const createAdminAccount = async (req, res) => {
    try {
        const { username, password } = req.body || {};

        if (!username || !password) {
            return res.status(400).json({ ok: false, message: 'Please provide both username and password' });
        }

        const existing = await Admin.findOne({ username: username.toLowerCase() });
        if (existing) {
            return res.status(400).json({ ok: false, message: 'Username already exists' });
        }

        const salt = await bcrypt.genSalt(10);
        const passwordHash = await bcrypt.hash(password, salt);

        const newAdmin = new Admin({
            username: username.toLowerCase(),
            passwordHash,
        });

        await newAdmin.save();

        res.status(201).json({ 
            ok: true, 
            message: 'Admin account created successfully', 
            admin: { id: newAdmin._id, username: newAdmin.username, createdAt: newAdmin.createdAt }
        });
    } catch (error) {
        console.error("Error creating admin:", error);
        res.status(500).json({ ok: false, message: 'Failed to create admin account' });
    }
};
