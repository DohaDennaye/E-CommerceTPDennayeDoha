const express = require("express");
const app = express();
const PORT = process.env.PORT_ONE || 4001;
const mongoose = require("mongoose");
const Commande = require("./Commande");
const axios = require('axios');

mongoose.set('strictQuery', true);
mongoose.connect(process.env.MONGODB_URI,
 {
 useNewUrlParser: true,
 useUnifiedTopology: true,
 },)
 .then(() => {
 console.log(`Commande-Service DB Connected`);
 })
 .catch((err) => {
    console.error("DB connection error:", err);
  });
 app.use(express.json());

function prixTotal(produits) {
let total = 0;
for (let t = 0; t < produits.length; ++t) {
total += produits[t].prix;
}
console.log("prix total :" + total);
return total;
}

async function httpRequest(ids) {
try {
const URL = "http://localhost:4000/produit/acheter"
const response = await axios.post(URL, { ids: ids }, {
headers: {
'Content-Type': 'application/json'
}
});

return prixTotal(response.data);
} catch (error) {
console.error(error);
}
}
app.post("/commande/ajouter", async (req, res, next) => {
const { ids, email_utilisateur } = req.body;
httpRequest(req.body.ids).then(total => {
console.log("Total reçu :", total);
const newCommande = new Commande({
ids,
email_utilisateur: email_utilisateur,
prix_total: total,
});
newCommande.save()
.then(commande => res.status(201).json(commande))
.catch(error => res.status(400).json({ error }));
});
});
app.listen(PORT, () => {
console.log(`Commande-Service at ${PORT}`);
});