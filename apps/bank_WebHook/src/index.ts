import express from 'express'
import { PrismaClient } from '@repo/db/client'
const aksh = new PrismaClient()

const app = express()

app.get("/hdfcwebhook" , (req,res)=>{
    const paymentInfo = {
        token : req.body.token ,
        userId : req.body.userId,
        amount : req.body.amount
    }

    try {
        aksh.$transaction([
            aksh.balance.update({
                where: {
                    id: Number(paymentInfo.userId)
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
