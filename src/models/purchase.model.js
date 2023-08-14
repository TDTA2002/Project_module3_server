import { PrismaClient } from '@prisma/client'
const prisma = new PrismaClient()


export default {
    addToCart: async function (user_id, cart_detail_record) {
        console.log("ser_id", cart_detail_record);
        try {
            let userCart = await prisma.carts.findUnique({
                where: {
                    user_id
                }
            })
            if (userCart) {
                /* Đã có giỏ hàng */
                let existRecord = await prisma.cart_details.findMany({
                    where: {
                        AND: [
                            {
                                cart_id: userCart.id
                            },
                            {
                                product_id: Number(cart_detail_record.product_id)
                            }
                        ]
                    }
                })

                if (existRecord.length != 0) {
                    // sản phẩm đã tồn tại trong carts
                    const dataExist = await prisma.cart_details.update({
                        where: {
                            id: existRecord[0].id
                        },
                        data: {
                            quantity: (cart_detail_record.quantity + existRecord[0].quantity),
                        },

                        include: {
                            product: true
                        }
                    })

                    return {
                        status: true,
                        message: "Thêm sản phẩm vào giỏ hàng thành công!",
                        data: dataExist
                    }
                } else {
                    // chưa từng
                    const dataNew = await prisma.cart_details.create({
                        data: {
                            ...cart_detail_record,
                            cart_id: userCart.id
                        },
                        include: {
                            product: true
                        }
                    })

                    return {
                        status: true,
                        message: "Thêm sản phẩm vào giỏ hàng thành công!",
                        data: dataNew
                    }
                }
            } else {
                /* Không có giỏ hàng */
                const dataNewCart = await prisma.carts.create({
                    data: {
                        user_id: user_id,
                        cart_details: {
                            create: [
                                cart_detail_record
                            ]
                        },
                    }
                })

                const dataReturn = await prisma.cart_details.findMany({
                    where: {
                        cart_id: dataNewCart.id
                    }
                })
                return {
                    status: true,
                    message: "Thêm sản phẩm vào giỏ hàng thành công!",
                    data: dataReturn[0]
                }

            }
        } catch (err) {
            console.log("err", err)
            return {
                status: false,
                message: "Lỗi!"
            }
        }
    },
    findCart: async function (user_id) {
        try {
            let existCart = await prisma.carts.findUnique({
                where: {
                    user_id: user_id
                },
                include: {
                    cart_details: {
                        include: {
                            product: {
                                include: {
                                    product_options: true,

                                }
                            }
                        }
                    }
                }
            });

            return {
                status: true,
                message: "ok!",
                data: existCart
            }
        } catch (err) {
            console.log("err", err)
            return {
                status: false,
                message: "Lỗi model!"
            }
        }
    },
    deleteProductFromCart: async function (product_id) {
        console.log("product_id", product_id);
        try {
            await prisma.cart_details.delete({
                where: {
                    id: product_id
                },
            });
            return {
                status: true,
                message: "Delete product successfully"
            }
        } catch (err) {
            console.log("err", err);
            return {
                status: false,
                message: "Delete product fail"
            }
        }

    },
    updateCart: async function (data) {

        console.log("id: data.cart_detail_record_edited.id", data);
        try {

            if (data.type) {
                await prisma.cart_details.update({
                    where: {
                        id: data.cart_detail_record_edited.id
                    },
                    data: {
                        quantity: data.cart_detail_record_edited.quantity
                    }
                })
            } else {
                await prisma.cart_details.delete({
                    where: {
                        id: data.cart_detail_record_edited.id
                    }
                })
            }
            return {
                status: true,
                message: 'Updated Successfully'
            }
        } catch (err) {
            console.log("err update", err);
            return {
                status: false,
                message: "Update Cart failed"
            }
        }
    },
    createReceipt: async function (data) {
        try {
            let receipt = prisma.receipts.create({
                data: {
                    ...data.receiptInfor,
                    receipt_details: {
                        create: data.receiptDetails
                    },
                }
            })

            const deleteCartDetail = prisma.cart_details.deleteMany({
                where: {
                    cart_id: data.receiptInfor.receipt_code
                }
            })

            const deleteCart = prisma.carts.delete({
                where: {
                    id: data.receiptInfor.receipt_code,
                },
            })

            const transaction = await prisma.$transaction([receipt, deleteCartDetail, deleteCart])

            return {
                status: true,
                message: "Ok nhé",
                data: receipt
            }
        } catch (err) {
            console.log("lỗi createReceipt", err)
            return {
                status: false,
                message: "lỗi createReceipt model"
            }
        }
    }

}