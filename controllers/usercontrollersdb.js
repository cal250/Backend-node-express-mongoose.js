const express=require('express')
let userModal = require('../models/usermodel');
const bcrypt = require("bcryptjs");


const router= express.Router()

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

 



//retriving data 

router.get('/',async(req,res)=>{
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

router.delete('/:id',async(req,res)=>{
    try{
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