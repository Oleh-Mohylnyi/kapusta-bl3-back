import { v2 as cloudinary } from 'cloudinary'
import { promisify } from 'util'
import { unlink } from 'fs/promises'
import Users from '../../repository/users'
import { CLOUDINARY_FOLDER_AVATARS } from '../../lib/constants'

cloudinary.config({
  cloud_name: process.env.CLOUD_NAME,
  api_key: process.env.API_KEY,
  api_secret: process.env.API_SECRET,
  secure: true,
})

class CloudStorage {
  constructor(file, user) {
    this.userId = user.id
    this.filePath = file.path
    this.idAvatarCloud = user.idAvatarCloud
    this.folderAvatarsCloud = CLOUDINARY_FOLDER_AVATARS
    this.uploadCloud = promisify(cloudinary.uploader.upload)
  }

  async save() {
    const { public_id: returnedIdAvatarCloud, secure_url: avatarUrlCloud } =
      await this.uploadCloud(this.filePath, {
        public_id: this.idAvatarCloud,
        folder: this.folderAvatarsCloud,
      })
    const newIdAvatarCloud = returnedIdAvatarCloud.replace(`${this.folderAvatars}/`,'')
    await Users.updateAvatar(this.userId, avatarUrlCloud, newIdAvatarCloud)
    await this.removeUploadFile(this.filePath)
    return avatarUrlCloud
  }

  async removeUploadFile(filePath) {
    try {
      await unlink(filePath)
    } catch (error) {
      console.error(error.message)
    }
  }
}

export default CloudStorage