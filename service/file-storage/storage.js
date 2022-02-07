
   
import Jimp from 'jimp'

class UploadFileService {
  constructor(Storage, file, user) {
    this.storage = new Storage(file, user)
    this.pathFile = file.path
  }

  async updateAvatar() {
    await this.transformAvatar(this.pathFile)
    const userUrlAvatar = await this.storage.save()
    return userUrlAvatar
  }

  async updatePicture() {
    await this.transformPicture(this.pathFile)
    const pictureUrl = await this.storage.save()
    return pictureUrl
  }

  async transformAvatar(pathFile) {
    const pic = await Jimp.read(pathFile)
    await pic
      .autocrop()
      .cover(250,250,Jimp.HORIZONTAL_ALIGN_CENTER | Jimp.VERTICAL_ALIGN_MIDDLE)
      .writeAsync(pathFile)
  }

    async transformPicture(pathFile) {
    const pic = await Jimp.read(pathFile)
    await pic
      .autocrop()
      .cover(100,100,Jimp.HORIZONTAL_ALIGN_CENTER | Jimp.VERTICAL_ALIGN_MIDDLE)
      .writeAsync(pathFile)
  }
}

export default UploadFileService