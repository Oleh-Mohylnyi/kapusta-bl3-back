import repositoryCategories from '../../repository/categories'
import { HttpCode } from '../../lib/constants'
import { CustomError } from '../../lib/custom-error'
import {UploadFileService,CloudFileStorage} from '../../service/file-storage'

const getCategories = async (req, res, next) => {
    const { id: userId } = req.user;
    const categories = await repositoryCategories.getCategories(userId, req.query);
    res
        .status(HttpCode.OK)
        .json({ status: 'success', code: HttpCode.OK, data: { ...categories } });
}


const addСategory = async (req, res, next) => {
    const { id: userId } = req.user;
    const newCategory = await repositoryCategories.addCategory(userId, req.body);
    res.status(HttpCode.CREATED).json({
        status: 'success',
        code: HttpCode.OK,
        data: { category: newCategory },
    });
}

const removeСategory = async (req, res, next) => {
    const { id } = req.params;
    const { id: userId } = req.user;
    const category = await repositoryCategories.removeCategory(userId, id);
  if (category) {
    return res
      .status(HttpCode.OK)
      .json({ status: 'success', code: HttpCode.OK, data: { category } })
    };
    throw new CustomError(HttpCode.NOT_FOUND, 'Not found');
}



const uploadCategorysPicture = async (req, res, next) => {
    const { id } = req.params;
    const uploadService = new UploadFileService(
        CloudFileStorage,
        req.file,
        id,
    );

    const pictureUrl = await uploadService.updatePicture();

    res
        .status(HttpCode.OK)
        .json({ status: 'success', code: HttpCode.OK, data: { pictureUrl } });
}

export { getCategories, addСategory, removeСategory, uploadCategorysPicture }
