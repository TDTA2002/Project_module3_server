import productModel from '../models/product.model';
import { uploadFileToStorage } from '../firebase';
import fs from 'fs';
module.exports = {
    create: async function (req, res) {
        let productInforFormat = JSON.parse(req.body.product_infor);

        // xử lý avatar
        let avatarProcess = await uploadFileToStorage(req.files[0], "products", fs.readFileSync(req.files[0].path));
        productInforFormat.avatar = avatarProcess;
        fs.unlink(req.files[0].path, (err) => {

        })
        req.files.splice(0, 1);


        for (let i in productInforFormat.options) {
            productInforFormat.options[i].price = Number(productInforFormat.options[i].price);
            productInforFormat.options[i].stock = Number(productInforFormat.options[i].stock);
            for (let j in productInforFormat.options[i].pictures) {
                let imgProcess = await uploadFileToStorage(req.files[j], "products", fs.readFileSync(req.files[j].path));
                productInforFormat.options[i].pictures[j].url = imgProcess;
                fs.unlink(req.files[j].path, (err) => {

                })
            }
            req.files.splice(0, productInforFormat.options[i].pictures.length);
        }

        console.log("productInforFormat", productInforFormat)
        try {
            /* Lấy ra options */
            let productOptions = productInforFormat.options;

            /* Xóa options */
            delete productInforFormat.options;

            /* Phần còn lại là information */
            let productInfor = productInforFormat;

            /* Chuyển đổi information về dạng đúng format của model */
            for (let i in productOptions) {
                productOptions[i].product_option_pictures = {
                    create: productOptions[i].pictures
                }
                delete productOptions[i].pictures;
            }

            /* Gọi model xử lý database */
            let result = await productModel.create(
                {
                    productInfor,
                    productOptions
                }
            );

            console.log("result", result)
        } catch (err) {
            return res.status(500).json({
                message: "Lỗi xử lý!"
            })
        }
    },
    readMany: async function (req, res) {
        try {
            let result = await productModel.readMany(req.query.status);
            if (result.status) {
                return res.status(200).json({
                    message: result.message,
                    data: result.data
                })
            }
            return res.status(500).json({
                message: result.message
            })
        } catch (err) {
            return res.status(500).json({
                message: "Lỗi không xác định!"
            })
        }
    },
    findById: async function (req, res) {
        try {
            let result = await productModel.findById(parseInt(req.params.id));

            return res.status(200).json({
                message: result.message,
                data: result.data
            })

        } catch (err) {
            console.log("err", err);
            return res.status(500).json({
                message: "Lỗi không xác định!"
            })
        }
    },
    findAllProducts: async function (req, res) {
        try {
            /* Find by name or des */
            if (req.query.search) {
                let modelRes = await productModel.searchByName(req.query.search)
                console.log("modelRes", modelRes);
                return res.status(modelRes.status ? 200 : 221).json(modelRes)
            }
            /* Find all */
            let modelRes = await productModel.findMany()
            return res.status(modelRes.status ? 200 : 221).json(modelRes)
        } catch (err) {
            return res.status(500).json({
                message: "Lỗi không xác định!"
            })
        }
    },
    update: async (req, res) => {

        req.body = JSON.parse(req.body.product_infor);

        // xử lý avatar
        if (req.file != undefined) {
            let url = await uploadFileToStorage(req.file, "products", fs.readFileSync(req.file.path));
            fs.unlink(req.file.path, (err) => { })
            req.body.avatar = url;
        }

        try {
            /* Gọi model xử lý database */
            let result = await productModel.update(Number(req.params.productId), req.body);
            return res.status(result.status ? 200 : 214).json(result)
            // console.log("result", result)
        } catch (err) {
            return res.status(500).json({
                message: "Lỗi xử lý!"
            })
        }
    }

}