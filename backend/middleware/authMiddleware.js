const jwt = require('jsonwebtoken');

const authMiddleware = (req, res, next) => {
    try {
        const token = req.header('Authorization'); // Citim token-ul din header
        if (!token) return res.status(401).json({ message: 'Access denied. No token provided.' });

        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        req.user = decoded; // Adăugăm user-ul decodat în request
        next();
    } catch (error) {
        res.status(400).json({ message: 'Invalid token' });
    }
};

module.exports = authMiddleware;
//verifica daca am jwt in header, il decodeaza si adaug utilizatorul in req users

// Protejează rutele (endpoints), ca să nu poată fi accesate decât de utilizatori autentificați.
// Verifică dacă există un token JWT valid în header-ul requestului.
// Dacă token-ul e valid, adaugă datele userului (req.user) și lasă requestul să continue (next()).