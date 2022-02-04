import { mkdir } from 'fs/promises'
import app from '../app'
import db from '../lib/db'

const PORT = process.env.PORT || 4000

db.then(() => {
  app.listen(PORT, async () => {
    await mkdir(process.env.UPLOAD_DIR, { recursive: true })
    console.log(`Server running on port: ${PORT}`)
  })
}).catch((err) => {
  console.log(`Server not running. Error: ${err.message}`)
})
