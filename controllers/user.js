
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const mysql = require("mysql");
//============ Connection bd===================
const con = require("../config/config")
require('dotenv').config()



exports.userSignup = (req, res, next) =>{
  
  bcrypt.hash(req.body.passwords, 10)
  .then(hash =>{
    const nom = req.body.nom;
    const prenom = req.body.prenom;
    const email = req.body.email;
    const passwords = hash;
    const photo_url= req.body.photo_url;
    con.query(
      "INSERT INTO users (nom, prenom, email, passwords, photo_url) VALUES (?, ?, ?, ?, ?);",
      [nom,prenom, email, passwords, photo_url],
      (err, results) => {
        console.log(err);
        res.send(results);
      }
    );
  } );

 
}

exports.login = (req, res, next) => {
  const email = req.body.email;
  const passwords = req.body.passwords;
  // Requete de l'utilisateur sur la base de données
  const string = "SELECT id, email, passwords FROM users WHERE email = ?";
  const inserts = email;
  const sql = mysql.format(string, inserts);

  const query = con.query(sql, (error, user) => {
      // Vérifie que l'objet n'est pas vide (Utilisateur inexistant)
      // if (user.length === 0) {
      //     return (res.status("Votre adresse e-mail n'est pas valide", 401));
      // }
      console.log(user);
      // Comparaison entre le hash et le mot de passe
      bcrypt.compare(passwords, user[0].passwords).then((valid) => {
          if (!valid) {
            
              return res.status(401).json({message:"Votre mot de passe n'est pas valide"});
          }
          // Signe le id de l'utilisateur et retourne un JWT dans l'entête
          res.status(200).json({
              userId: user[0].id,
              token: jwt.sign(
                  {
                      userId: user[0].id,
                  },
                  "tokenDeSecurite",
                  {expiresIn:"24h"}
              ),
          });
      });
  });
};
exports.getAllUsers = (req, res) => {
  con.query("select * from users", function (err, result) {
  res.status(200).json(result);
  })


};