const {catchAsyncErrors} = require("../middlewares/catchAsyncErrors")

exports.homepage =  catchAsyncErrors (async(req, res,next)=>{

    res.json({message : "this is huihui"})

})