/**
 * Ushbu proekt faqatgina test rejimdagi proekt hisoblanadi.
 * Ushbu proekt orqali excel faylidagi ma'lumotlarni o'qib olish kodlari keltirilgan.
 * Maqsad excel dasturidan foydalangan holda ma'lumotlarni o'qib olish hamda shu ma'lumotlar asosida dasturimizni optimallashtirish.
 */
const express = require('express');
const cors = require('cors');
const multer = require('multer');
const xls = require('xls-to-json');
const xlsx = require('xlsx-to-json');
const fs = require("fs")
require('dotenv').config();


const app = express();
app.use(cors());
app.use(express.json());

/**
 * Multer sozlamalarini ishlab olamiz.
 */
const storage = multer.diskStorage({
    destination: (req, file, cb)=>{
        cb(null, "./uploads");
    },
    filename: (req,file, cb)=>{
        cb(null, Date.now().toString()+file.originalname);
    }
});

const upload = multer({
    storage:storage,
});


app.post("/xls", upload.single("file"), async(req,res,next) =>{
    try {
        const file = req.file;
        if(file.originalname.split(".")[1] == "xls"){
            xls({
                input: file.path,
                output: "output.json"
            },function(err, result){
                if(err){
                    console.log(err)
                }
                else{
                   res.status(201).json(result)
                }
            })
        }
        else if(file.originalname.split(".")[1] == "xlsx"){
            xlsx({
                input: file.path,
                output: "output.json"
            },function(err, result){
                if(err){
                    console.log(err)
                }
                else{
                   res.status(201).json(result)
                }
            })
        }        

        // ochilgan ortiqcha faylni o'chirish uchun.
        fs.unlink(file.path, (err, res)=>{
            if(err){
                console.log(err)
            }
        });
        fs.unlink("./output.json", (err, res)=>{
            if(err){
                console.log(err)
            }
        });
        return
    } catch (e) {
        res.status(500).json(e.message);
    }
})


const port = process.env.PORT || 5000;
app.listen(port, ()=>console.log(`Server ishga tushdi. port: ${port}`));