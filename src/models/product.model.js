import { PrismaClient } from '@prisma/client';
const prisma = new PrismaClient();

module.exports = {
    create: async function (dataObj) {
        try {
            const product = await prisma.products.create({
                data: {
                    ...dataObj.productInfor,
                    product_options: {
                        create: dataObj.productOptions
                    },
                },
                include: {
                    product_options: true,
                    product_options: {
                        include: {
                            product_option_pictures: true,
                        }
                    }
                },
            })
            return {
                status: true,
                message: "Thêm sản phẩm thành công!",
                data: product
            }
        } catch (err) {
            console.log("err", err);
            return {
                status: false,
                message: "Lỗi không xác định!"
            }
        }
    },
    readMany: async function (status = undefined) {
        try {
            let products = await prisma.products.findMany({
                where: {
                    category: {
                        deleted: false,
                    }
                },
                include: {
                    category: true,
                    product_options: {
                        include: {
                            product_option_pictures: true,
                        }
                    }
                }
            });

            return {
                status: true,
                message: "Lấy danh sách sản phẩm thành công!",
                data: products
            };
        } catch (err) {
            return {
                status: false,
                message: "Lỗi không xác định"
            };
        }
    },
    findById: async function (id) {
        try {
            let products = await prisma.products.findUnique({
                where: {
                    id: id
                }, include: {
                    product_options: {
                        include: {
                            product_option_pictures: true,
                        }
                    }
                }
            });
            return {
                message: "Húp",
                data: products
            }
        } catch (err) {
            console.log("err", err);

            return {
                status: false,
                message: "Lỗi không xác định!"
            }
        }
    },
    findAllProducts: async () => {
        try {
            let products = await prisma.products.findMany()
            return {
                status: true,
                message: "get all product thanh cong",
                data: products
            }
        } catch (err) {
            console.log("err", err);
            return {
                status: false,
                message: "get all product that bai"
            }
        }
    },
    findMany: async function () {
        try {
            let products = await prisma.products.findMany();
            return {
                status: true,
                message: "san pham duoc tim thay!",
                data: products
            }
        } catch (err) {
            return {
                status: false,
                message: "lỗi!"
            }
        }
    },
    searchByName: async function (searchString) {
        try {
            let products = await prisma.products.findMany({
                where: {
                    OR: [
                        {
                            name: {
                                contains: searchString,
                            }
                        },
                        {
                            des: {
                                contains: searchString,
                            },
                        }
                    ]
                }
            });
            return {
                status: true,
                message: "Ket qua search",
                data: products
            }
        } catch (err) {
            console.log("err", err)
            return {
                status: false,
                message: "lỗi!"
            }
        }
    },
    update: async (productId, data) => {
        try {
            let product = await prisma.products.update({
                where: {
                    id: productId
                },
                data: {
                    ...data
                }
            })

            return {
                status: true,
                message: "Update thành công!",
                data: product
            }
        } catch (err) {
            return {
                status: false,
                message: "Lỗi gì đó!"
            }
        }
    },
}
