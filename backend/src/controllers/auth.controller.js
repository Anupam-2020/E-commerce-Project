const bcrypt = require('bcrypt');
const pool = require('../config/db');
const { signToken } = require('../utils/jwt');

async function register(req, resp) {
    const { name, email, password, age, city } = req.body;
    const [existing] = await pool.query(
        'SELECT id FROM users WHERE email = ?', [email]
    );
    if(existing.length) {
        return resp.status(409).json({
            message: 'Email already exists'
        });
    }

    const password_hash = await bcrypt.hash(password, 10);
    const [result] = await pool.query(
        `INSERT INTO users (name, email, password_hash, age, city)
        VALUES (?, ?, ?, ?, ?)`, [name, email, password_hash, age ?? null, city ?? null]
    );

    const token = signToken({ // we create a token for the user immediately after registration so they can be logged in right away without needing to call the login endpoint separately
        id: result.insertId, email, role: 'customer'
    });

    return resp.status(201).json({
        message: 'User registered',
        token,
        user: { id: result.insertId, name, email, role: 'customer'}
    })
}

async function login(req, resp) {
    const { email, password } = req.body;
    const [rows] = await pool.query (
        'SELECT id, name, email, password_hash, role FROM users WHERE email = ?', [email]
    );

    if(!rows.length) {
        return resp.status(401).json({
            message: 'Invalid email or password'
        })
    }

    const user = rows[0];
    const matched = await bcrypt.compare(password, user.password_hash);
    if(!matched) {
        return resp.status(401).json({
            message: 'Invalid email or password'
        })
    }

    const token = signToken({ // we are creating a new token for the user after successful login, not verifying an existing token
        id: user.id, email: user.email, role: user.role
    });

    return resp.json({
        message: 'Login successful',
        token,
        user: { id: user.id, name: user.name, email: user.email, role: user.role }
    });
}

async function me(req, resp) { // this endpoint is protected by the auth middleware which verifies the token and attaches the user info to req.user, so we can directly use req.user.id to fetch the user's details from the database without needing to verify the token again here
    const [rows] = await pool.query(
        'SELECT id, name, email, age, city, role, created_at FROM users WHERE id = ?', [req.user.id]
    );

    if(!rows.length) {
        return resp.status(404).json({
            message: 'User not found'
        });
    }

    return resp.json([rows[0]]);
}


module.exports = {
    register,
    login,
    me
}