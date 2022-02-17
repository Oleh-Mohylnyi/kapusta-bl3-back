import { v2 as cloudinary } from 'cloudinary'
import { promisify } from 'util'
import { unlink } from 'fs/promises'
import Categories from '../../repository/categories'
import { CLOUDINARY_FOLDER_CATEGORIES_PICTURE } from '../../lib/constants'

cloudinary.config({
  cloud_name: process.env.CLOUD_NAME,
  api_key: process.env.API_KEY,
  api_secret: process.env.API_SECRET,
  secure: true,
})

class CloudStorage {
  constructor(file, categoryId) {
    this.id = categoryId
    this.filePath = file.path
    // this.idPictureCloud = user.idPictureCloud
    this.folderPicturesCloud = CLOUDINARY_FOLDER_CATEGORIES_PICTURE
    this.uploadCloud = promisify(cloudinary.uploader.upload)
  }

  async save() {
    const { public_id: returnedIdPictureCloud, secure_url: pictureUrl } =
      await this.uploadCloud(this.filePath, {
        public_id: this.idPictureCloud,
        folder: this.folderPicturesCloud,
      })
    const newPictureUrl = returnedIdPictureCloud.replace(`${this.folderAvatars}/`,'')
    await Categories.updatePicture(this.id, pictureUrl, newPictureUrl)
    await this.removeUploadFile(this.filePath)
    return pictureUrl
  }

  async removeUploadFile(filePath) {
    try {
      await unlink(filePath)
    } catch (error) {
    }
  }
}


export default CloudStorage