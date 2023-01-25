const express = require('express')
const router = express.Router()
const key = '*'

const openaiendpoint='https://api.openai.com/v1/completions'
router.use(express.json())



router.post('/igv',(req,res) => {


    async function open (){
        const reqbody= {
            model:'text-davinci-003',
            prompt:req.body.body,
            temperature:0,
        }
        const reqParams = {
            method:'POST',
            headers:{
                'Content-Type':'application/json',
                'Authorization': `Bearer ${key}`
            },
            body: JSON.stringify(reqbody)
        }
        let response = await fetch(openaiendpoint, reqParams)

        return response.json()


    }
  open().then(r => res.status(200).json(r['choices'][0]))

})

router.get('/',(req,res) => {
    res.send('Hello Certified State Lover')
    console.log('We are in textworld')



})



module.exports = router
