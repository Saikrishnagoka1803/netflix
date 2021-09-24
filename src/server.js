import express from "express"
import cors from "cors"
import mediaRouter  from "./services/media/index.js"
import listendpoints from "express-list-endpoints"

const server = express()
const port = 3001

server.use(cors())
server.use(express.json())
server.use("/media", mediaRouter)

console.table(listendpoints(server))

server.listen(port, () => {
    console.log(`server running on port ${port}`)
})