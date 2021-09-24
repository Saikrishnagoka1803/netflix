import express from "express"
import path, { dirname, join } from "path";
import { fileURLToPath } from "url";
import fs from "fs-extra"
import uniqid from "uniqid"
import multer from "multer"
import  {writeFileToPublicDirectory}  from "./../../lib/poster.js"

const mediajsonpath = join(dirname(fileURLToPath(import.meta.url)), "../../data/media.json")
console.log(mediajsonpath)
const getmedia = () => fs.readFileSync(mediajsonpath)
const writemedia = (content) => fs.writeFileSync(mediajsonpath, JSON.stringify(content))

const mediaRouter = express.Router()

mediaRouter.get("/", (req, res, next) => {
    const media = JSON.parse(getmedia().toString())
    res.status(201).send(media)
})

mediaRouter.get("/:id", (req, res, next) => {
    const media = JSON.parse(getmedia().toString())
    const eachmediaIndex = media.findIndex(m => m.imdbID === req.params.id)
    if(eachmediaIndex === -1){
        res.send({message : "id not found!!"})
    }
    else{
        res.send(media[eachmediaIndex])
    }
})

mediaRouter.post("/", (req, res, next) => {
    try {
        const media = {
            ...req.body,
            imdbID: uniqid(),
           
        }
        const mediap = JSON.parse(getmedia().toString())
        mediap.push(media)
        writemedia(mediap)
        res.send({message: "posted successfully!!"})
    } catch (error) {
        next(error)
    }
})

mediaRouter.put("/:id", (req, res, next) => {
    try {
        const mediaput = JSON.parse(getmedia().toString())
        const specificmediaIndex = mediaput.findIndex(m => m.imdbID=== req.params.id)
        mediaput[specificmediaIndex] = {...mediaput[specificmediaIndex], ...req.body}
    
        writemedia(mediaput)
        res.send({message: "edited successfully!!", mediaput})
    } catch (error) {
        console.log(error)
    }
})

mediaRouter.delete("/:id", (req, res, next) => {
    try {
        const media = JSON.parse(getmedia().toString())
        const afterdeleted = media.filter(m => m.imdbID !== req.params.id)
        writemedia(afterdeleted)
        res.send({message: "deleted successfully", afterdeleted})
    } catch (error) {
        console.log(error)
    }
})

////////// poster upload ////////////////////////////
mediaRouter.post("/:id/poster", multer().single('image'), async(req,res,next) => {
    try {
        console.log(req.params)
        const {url, id} = await writeFileToPublicDirectory(req.file)
        //res.send({url, id})
       const updateimage = { "Poster" : `${url}` }
        const media = await getmedia()
        const TobeEditedmediaIndex = media.findIndex(m => m.imdbId === req.params.id)
        media[TobeEditedmediaIndex] = {...media[TobeEditedmediaIndex], ...updateimage}
        await writemedia(media)
        res.send({url, id, message:"done, poster upload succeded!!"})
        

    } catch (error) {
        next(error)
    }
})

//////////////////////////////////////////////////////////////

export default mediaRouter