const express = require("express");
const app = express();
const PORT = process.env.PORT_ONE || 4002;
const mongoose = require("mongoose");
const Utilisateur = require("./utilisateur");
const jwt = require("jsonwebtoken");
const bcrypt = require('bcryptjs');
mongoose.set('strictQuery', true);
mongoose.connect(
"mongodb://mongo:27017/auth-service",
{
useNewUrlParser: true,
useUnifiedTopology: true,
},)
.then(() => console.log("Auth-Service DB Connected"))
  .catch((err) => console.error("DB Error:", err)
);
app.use(express.json());
app.post("/auth/register", async (req, res) => {
    let { nom, email, mot_passe } = req.body;
    const userExists = await Utilisateur.findOne({ email });
    if (userExists) {
    return res.json({ message: "Cet utilisateur existe déjà" });
    } 
    try {
        const hash = await bcrypt.hash(mot_passe, 10);
        const newUtilisateur = new Utilisateur({
          nom,
          email,
          mot_passe: hash,
        });
    
        const savedUser = await newUtilisateur.save();
        return res.status(201).json(savedUser);
      } catch (error) {
        return res.status(500).json({ error });
      }
    });
    app.post("/auth/login", async (req, res) => {
        const { email, mot_passe } = req.body;
        const utilisateur = await Utilisateur.findOne({ email });
        if (!utilisateur) {
        return res.json({ message: "Utilisateur introuvable" });
        } 
        const resultat = await bcrypt.compare(mot_passe, utilisateur.mot_passe);
  if (!resultat) {
    return res.json({ message: "Mot de passe incorrect" });
  }

  const payload = {
    email,
    nom: utilisateur.nom,
  };
  jwt.sign(payload, "secret", (err, token) => {
    if (err) return res.status(500).json({ error: err });
    return res.json({ token });
    });
    });
    app.listen(PORT, () => {
    console.log(`Auth-Service at ${PORT}`);
    });