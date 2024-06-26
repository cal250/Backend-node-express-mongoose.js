const express=require('express')
let userModal = require('../models/usermodel');
const bcrypt = require("bcryptjs");
const { verifyToken, generateToken } = require('./jwtAuth');


const router= express.Router()

router.get("/", async (req,res) => {
    res.send("hello")
})

//create

router.post('/adduser', async (req, res) => {
    let { name, email, password} = req.body;

    try { 
        // Check if a user with the same name already exists
        const existingUser = await userModal.findOne({ name: name });
        if (existingUser) {
            return res.status(400).send('User with the same name already exists');
        }

        const genSalt = await bcrypt.genSalt(10);
        let hashedPassword = await bcrypt.hash(password, genSalt);

        const user = new userModal({
            name,
            email,
            password: hashedPassword,
        });

        const storeUser = await user.save();
        if (!storeUser) return res.status(500).send('Error in saving user');

        res.status(201).send('User saved');
    } catch (err) {
        console.log('Failed to add user: ', err);
        res.status(500).send(err);
    }
});

 

router.post('/login', async (req, res) => {
    const { name, password } = req.body;

    try {
        const user = await userModal.findOne({ name });
        if (!user) {
            return res.status(404).json({ error: 'User not found' });
        }

        const isPasswordValid = await bcrypt.compare(password, user.password);
        if (!isPasswordValid) {
            return res.status(401).json({ error: 'Invalid password' });
        }

        const token = generateToken(user);
        res.status(200).json({ token });
    } catch (err) {
        console.error('Login error:', err);
        res.status(500).json({ error: 'Internal server error' });
    }
});

//retriving data 

router.get('/', async(req,res)=>{
    try{
        const users = await userModal.find({});
        res.status(200).send(users);
    }
    catch(err){
        res.status(500).send({error})
    }
});

//retrieving data may be using id 

router.get('/:id',async(req,res)=>{
    try{
    const user = await userModal.findOne({_id:req.params.id});
    res.status(200).send(user)
    }
    catch(err){
        res.status(500).send({err});
    } 
})

//update

router.put('/:id',async(req,res)=>{
    try{
        const user = await userModal.findByIdAndUpdate(
            req.params.id,
            req.body
        );
        await user.save()
        res.send(user)
    }catch(err){
        res.status(500).send({err})

    }
});

//delete

router.delete('/:id', verifyToken, async(req,res)=>{
    try{
        console.log("some")
        const user = await userModal.findByIdAndDelete(req.params.id)
        if(!user){
            res.status(500).send('no user found')
        }else{
            res.status(200).send({message:'user removed successfully'})
        }
    }catch(err){
        res.status(500).send({error})
    }
})

module.exports=router;