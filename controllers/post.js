
const fs = require("fs");
//------------Cryptage------------
const bcrypt = require("bcrypt");
//------------Token------------
const jwt = require("jsonwebtoken");
//------------database------------
const con = require("../config/config")
const mysql = require('mysql');

exports.createPost = (req, res, next) => {
  const { Users_Id, title, message} = req.body;
  const image_url = `${req.protocol}://${req.get("host")}/images/${req.file}`;
 
  // Requête
  const string = "INSERT INTO posts (Users_Id, title, message,image_url ) VALUES ( ?,?, ?,?)";
  const inserts = [ Users_Id, title, message, image_url ];
  const sql = mysql.format(string, inserts);
  console.log(inserts);
  const createPost = con.query(sql, (error) => {
      if (!error) {
          res.status(201).json(inserts);
      } else {
        console.log(error);
          return res.status(405).json({message:"Erreur de requête, la publication n'a pas été créée"});
      }
  });
};
exports.updatePost = (req, res, next) => {
  const {  title, message, id} = req.body;

  // Vérification s'il y a une image dans le body
 
  // Requête
  const string = 
  "UPDATE posts SET title = ?, message = ?  WHERE id = ? ";
  const inserts = [  title, message,id];
  const sql = mysql.format(string, inserts);
  console.log(inserts);
  const createPost = con.query(sql, (error) => {
      if (!error) { 
          res.status(201).json(inserts);
      } else {
        console.log(error);
          return res.status(405).json({message:"Erreur de requête, la publication n'a pas été modifiée"});
      }
  });
};


exports.createComment = (req, res, next) => {
  const { fk_postId, content} = req.body;
 
  // Requête
  const string = "INSERT INTO com (fk_postId, content) VALUES (?, ? )";
  const inserts = [ fk_postId, content];
  const sql = mysql.format(string, inserts);
  console.log(inserts);
  const createPost = con.query(sql, (error) => {
      if (!error) {
          res.status(201).json(inserts);
      } else {
        console.log(error);
          return res.status(405).json({message:"Erreur de requête, la publication n'a pas été créée"});
      }
  });
};
    
exports.deletePost = (req, res, next) => {
  const {id} = req.body
  const string = "DELETE FROM posts WHERE id = ?";
  const inserts = [ id];
  const sql = mysql.format(string, inserts);
  // Vérification si c'est l'admin ou l'utilisateur même
  
const decodeUid = (authorization) => {
  const token = authorization.split(" ")[1];
  const decodedToken = jwt.verify(token, process.env.JWT_SECRET);
}

  // Requête
  const deletePost = con.query(sql, (error) => {
    if (decodeUid) {
        res.status(200).json({message:" la publication a  été supprimer"});
    } else {
      console.log(error);
        return res.status(405).json({message:"Erreur de requête, la publication n'a pas été supprimer"});
    }
}) 
   
};



exports.likeDislike = (req, res, next) => {
  Sauce.findById(req.params.id).then(sauce => {
    if (req.body.like == -1) {
      //il veut unliker

      if (sauce.usersLiked.filter(id => id === req.body.userId).length !== 0) {
        //S'il a déjà liké
        //renvoyer un message qui lui indique qu'il doit d'abord retirer son like avant de unlike et mettre à jour la BD
        //return res.status(...).json(...)
        return res
          .status(401)
          .json({ message: "Veuillez d'abord retirer votre Like" });
      }

      if (
        sauce.usersDisliked.filter(id => id === req.body.userId).length !== 0
      ) {
        //S'il a déjà unliké
        //décrémenter le nombre de unlike et retirer ce userId du tableau des unLIkes et mettre à jour la bd
        Sauce.updateOne(
          { _id: req.params.id },
          { $inc: { dislikes: -1 }, $pull: { usersDisliked: req.body.userId } }
        )
          .then(resp =>
            res
              .status(200)
              .json({ message: "Vous avez retiré votre  DisLiker !" })
          )
          .catch(error => res.status(400).json({ error }));
      } else {
        //il n'a pas encore unliké
        //Incrémenter le nombre de unlike et ajouter ce userId dans tableau des unLIkes et mettre à jour la bd
        Sauce.updateOne(
          { _id: req.params.id },
          { $inc: { dislikes: 1 }, $push: { usersDisliked: req.body.userId } }
        )
          .then(sauce =>
            res.status(200).json({ message: "Vous avez DisLiker !" })
          )
          .catch(error => res.status(400).json({ error }));
      }
    } else if (req.body.like == 1) {
      //il veut liker
      if (
        sauce.usersDisliked.filter(id => id === req.body.userId).length !== 0
      ) {
        //S'il a déjà unliké
        //renvoyer un message qui lui indique qu'il doit d'abord retirer son unlike avant de like et mettre à jour la BD
        //return res.status(...).json(...)
        return res
          .status(401)
          .json({ message: "Veuillez d'abord retirer votre unlike" });
      }

      if (sauce.usersLiked.filter(id => id === req.body.userId).length !== 0) {
        //S'il a déjà liké
        //décrémenter le nombre de like et retirer ce userId du tableau des likes et mettre à jour la bd
        Sauce.updateOne(
          { _id: req.params.id },
          { $inc: { likes: -1 }, $pull: { usersLiked: req.body.userId } }
        )
          .then(sauce => res.status(200).json({ message: "Vous avez Liker !" }))
          .catch(error => res.status(400).json({ error }));
      } else {
        //il n'a pas encore liké
        //Incrémenter le nombre de like et ajouter ce userId dans tableau des likes et mettre à jour la bd
        Sauce.updateOne(
          { _id: req.params.id },
          { $inc: { likes: 1 }, $push: { usersLiked: req.body.userId } }
        )
          .then(sauce => res.status(200).json({ message: "Vous avez Liker !" }))
          .catch(error => res.status(400).json({ error }));
      }
    } else if (req.body.like == 0) {
      if (sauce.usersLiked.filter(id => id === req.body.userId).length !== 0) {
        //S'il a déjà liké
        //décrémenter le nombre de like et retirer ce userId du tableau des likes et mettre à jour la bd
        Sauce.updateOne(
          { _id: req.params.id },
          { $inc: { likes: -1 }, $pull: { usersLiked: req.body.userId } }
        )
          .then(sauce =>
            res.status(200).json({ message: "Vous avez unliker!" })
          )
          .catch(error => res.status(400).json({ error }));
      }

      if (
        sauce.usersDisliked.filter(id => id === req.body.userId).length !== 0
      ) {
        //S'il a déjà unliké
        //décrémenter le nombre de unlike et retirer ce userId du tableau des unLIkes et mettre à jour la bd
        Sauce.updateOne(
          { _id: req.params.id },
          { $inc: { dislikes: -1 }, $pull: { usersDisliked: req.body.userId } }
        )
          .then(resp =>
            res
              .status(200)
              .json({ message: "Vous avez retiré votre  /undislike  !" })
          )
          .catch(error => res.status(400).json({ error }));
      } else {
        res
          .status(200)
          .json({ message: "Vous ne pouvez pas dislike sans like !" });
      }
    } else {
      //pour tout autre valeur de like differentes de 1 et -1
      return res.status(400).json("votre requette est incorrecte");
    }
  });
};

exports.getAllPosts = (req, res, next) => {
    con.query("select * from posts", function (err, result) {
    res.status(200).json(result);
    })

  
};
exports.getOneComment = (req, res, next) => {
  const {id} = req.body
  const string = "select * from com where fk_postId = ?";
  const inserts = [ id];
  const sql = mysql.format(string, inserts);
  const createPost = con.query(sql, (error, result ) => {
    if (result) {
        res.status(201).json(result);
        console.log(result);
    } else {
      console.log(error);
        return res.status(405).json({message:"Erreur de requête, la publication n'a pas été créée"});
    }
});


};
exports.getOnePost = (req, res) => {
  const { id} = req.body;
  // Requête
  const string = "SELECT * from posts where id = ? ";
  const inserts = [ id];
  const sql = mysql.format(string, inserts);
  console.log(inserts);
  const getpost = con.query(sql, (error ,result) => {
      if (result) {
          res.status(201).json(result);
          console.log(result);
      } else {
        console.log(error);
          return res.status(405).json({message:"Erreur de requête, la publication n'a pas été recuperer"});
      }
  });
};

