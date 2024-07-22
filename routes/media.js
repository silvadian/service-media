const express = require("express")
const isBase64 = require("is-base64")
const base64img = require("base64-img")
const fs = require("fs")
const { Media } = require("../models")

const router = express.Router()

//router gettimage by id
router.get("/:id", async (req, res) => {
    const {id} = req.params;

    const media = await Media.findByPk(id)

   if(!media){
    return res.status(404).json({
        status : "error",
        message : "image not found",
    })
   }
    return res.json({
        status : "success",
        data :{
            image: `${req.get("host")}/${media.image}`,
        }
    })
})

// routerget berfungsi untuk request dalam metode get. biasanya digunakan untuk mengambil data/file
router.get("/", async (req, res) => {
    const media = await Media.findAll({
        attributes: [
            'id', 'image'
        ]
    })
    const mapedMedia = media.map((m) => {
        m.image = `${req.get("host")}/${m.image}`
        return m
    })
    return res.json({
        status: "success",
        data: mapedMedia
    })
})

// routerpost digunakan untuk request dalam metode post. biasnaya digunakan untuk menyimpan data/file
router.post("/", async (req, res) => {
    //ambil image dari request.body
    const image = req.body.image
    // apakah base64 yang dikirim adalah base64 yang valid
    // jika bukan maka kirim respon error
    if (!isBase64(image, { mimeRequired: true })) {
        return res.status(400).json({
            status: "error",
            message: "invalid base64"
        })
    }
    // simpan image kedalam folder publik
    base64img.img(image, "./public/images", Date.now(), async (err, filepath) => {
        if (err) {
            return res.status(400).json({
                status: "error",
                message: err.message
            })
        }
        // ambil nama filenya
        const fileName = filepath.split("\\").pop().split("/").pop()
        const media = await Media.create({
            image: `images/${fileName}`
        })
        return res.json({
            status: "success", data: {
                id: media.id,
                image: `${req.get("host")}/images/${fileName}`
            }
        })

    })

})

// routerdelete digunakan untuk request dalam metode post. biasanya digunakan untuk menghapus data/file
router.delete("/:id", async (req, res) => {
    // ambil id dari params
    const id = req.params.id
    // cari media berdasarkan primarykey id
    const media = await Media.findByPk(id)
    // jika tidak ada media return error
    if (!media) {
        return res.status(404).json({
            status: "error",
            message: "media not found"
        })
    }
    // jika media ditemukan hapus dari folder public
    fs.unlink(`./public/${media.image}`, async (err)=>{
        if(err){
            return res.status(404).json({
                status:"error",
                message:err.message
            })
        }
        // hapus data di database
        await media.destroy()
        // success
        return res.json({
            status:"success",
            message:"deleted"
        })
    })

})
module.exports = router 