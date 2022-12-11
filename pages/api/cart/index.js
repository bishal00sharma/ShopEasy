import dbConnect from "../../../lib/dbConnect"
import cartModals from "../../../modals/cart/cart"


export default async function Home(req, res) {

    const method = req.method
    await dbConnect()
    switch (method) {
        case "GET": {
            const { userid } = req.headers;
            console.log(userid);
            const finduser = await cartModals.find({ "userId": userid });
            if (!finduser) {
                return res.send({
                    cartitem: [],
                    massage: "sorry havn't anything here "
                })
            }
            return res.send(finduser)
        }
        case "POST": {

            const cartitem = req.body
            try {

                const isitemhave = await cartModals.find({ "userId": cartitem.userId, "productid": cartitem.productId })
                if (isitemhave.join("") !== "") {
                    let qty = isitemhave[0].quantity + cartitem.quantity
                    console.log("qty");
                    const update = await cartModals.updateOne({ "userId": cartitem.userId }, { "quantity": qty, "Productid": isitemhave.Productid }, { new: true })
                    return res.send(update)
                }
                const cartitemsave = new cartModals({
                    ...cartitem
                })
                await cartitemsave.save()
                console.log(cartitemsave);
                return res.send({
                    e: cartitemsave
                })
            }
            catch (e) {
                return res.send({
                    e: e.massage
                })
            }
        }
        case "DELETE": {

            const _id = req.body
            console.log(_id)

            const deleteitem = await cartModals.findOneAndDelete({ "productid": _id })

            res.send(deleteitem)

            return res.send("hii")
        }
        default: {
            return res.end(`access denied to ${method} `)
        }
    }
    // res.send(method)
}