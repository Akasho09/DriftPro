import express from 'express'
import aksh from "@repo/db/client"
const app = express()

app.get("/hdfcwebhook" , async (req,res)=>{
  
    try {
        const paymentInfo = {
            token : req.body.token ,
            userId : req.body.userId,
            amount : req.body.amount
        }    
        await  aksh.$transaction([
           aksh.balance.update({
                where: {
                    id : paymentInfo.userId
                },
                data : {
                    amount:{
                        increment: Number(paymentInfo.amount)
                    }
                }
            }),

            aksh.onRampTransaction.updateMany({
                where:{
                    token : paymentInfo.token
                },
                data : {
                    status : "Success"
                }
            })
        ])
        res.json({
            message: "Captured"
        })
    } catch(e) {
        console.error(e);
        res.status(411).json({
            message: "Error while processing webhook"
        })
    }
})


app.listen(3004, ()=>{
    console.log("Web Bank started ")
})