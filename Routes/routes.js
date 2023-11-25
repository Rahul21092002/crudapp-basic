const express = require('express')
const router = express.Router()
const User = require('../models/users')
const multer = require('multer')
const fs = require('fs')
const { log } = require('console')

// Image Upload
var storage = multer.diskStorage({
    destination: function(req,file,cb){
        cb(null,'./uploads')
    },
    filename: function(req,file,cb){
        cb(null,file.fieldname+"_"+Date.now()+"_"+file.originalname)
    }
})

var upload = multer({
    storage : storage,
}).single("image")

// Insert a user into the database route
router.post('/add', upload, async (req, res) => {
    try {
        const user = new User({
            name: req.body.name,
            email: req.body.email,
            phone: req.body.phone,
            image: req.file.filename
        });

        await user.save();

        req.session.message = {
            type: 'success',
            message: 'User added successfully',
        };
        res.redirect('/');
    } catch (err) {
        res.json({ message: err.message, type: 'danger' });
    }
});

// Get all users
router.get('/',async (req,res) => {
    try{
        const users = await User.find().exec()
        res.render('index',{
            title : "Home Page",
            users : users,
        })
    }catch(err){
        res.json({message : err.message})
    }
})


router.get('/add',(req,res) => {
    res.render('addUser',{title : " Add User Page"})
})

// Edit and update user
router.get('/edit/:id', async (req, res) => {
    try {
        const id = req.params.id;
        const user = await User.findById(id).exec();

        if (user === null) {
            res.redirect('/');
        } else {
            res.render('edit_users', {
                title: 'Edit User',
                user: user,
            });
        }
    } catch (err) {
        res.redirect('/');
    }
});


// Update user route
router.post('/update/:id', upload, async (req, res) => {
    try {
        let id = req.params.id;
        let newImage = '';

        if (req.file) {
            newImage = req.file.filename;
            console.log(req.body.old_image)
            try {
                fs.unlinkSync("./uploads/" + req.body.old_image);
            } catch (err) {
                console.log(err);
            }
        } else {
            newImage = req.body.old_image;
        }

        const result = await User.findByIdAndUpdate(id, {
            name: req.body.name,
            email: req.body.email,
            phone: req.body.phone,
            image: newImage
        }).exec();

        if (!result) {
            res.redirect('/');
        } else {
            req.session.message = {
                type: 'success',
                message: 'User updated successfully'
            };
            res.redirect('/');
        }
    } catch (err) {
        res.json({ message: err.message, type: 'danger' });
    }
});

// Delete user route
router.get('/delete/:id/img/:img', upload, async (req, res) => {
    try {
        const id = req.params.id;
        const imageName=req.params.img
        console.log(req.params);
        console.log(imageName);


        try {
            fs.unlinkSync("./uploads/" +imageName);
        } catch (err) {
            console.log(err);
        }

        const result = await User.findByIdAndDelete(id).exec();

        if (!result) {
            res.redirect('/');
        } else {
            req.session.message = {
                type: 'success',
                message: 'User deleted successfully'
            };
            res.redirect('/');
        }
    } catch (err) {
        res.json({ message: err.message, type: 'danger' });
    }
});



module.exports = router