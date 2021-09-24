import path from "path"
import fs from "fs-extra"
import uniqid from "uniqid"

export const publicFolderPath = path.join(process.cwd(),'Public')

export const writeFileToPublicDirectory = async (file) => {
    try {
      
        console.log(file)
        const [name,extension] = file.originalname.split(".") 
        console.log({name,extension})
        const id = uniqid()
        const newFileName = `${id}.${extension}`
        console.log({id,newFileName})
    
        const filePath = path.join(publicFolderPath,newFileName) 

        console.log({filePath})
       
        await fs.writeFile(filePath,file.buffer)  
        const url = `http://localhost:3001/${newFileName}`

        console.log({url})

        return {url,id}

    } catch (error) {
        throw error
    }
     
}