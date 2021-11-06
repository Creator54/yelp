module.exports = fun =>{
    return (req,res,next) =>{
        func(req,res,next).catch(next);
    }
}