const mongoose=require('mongoose')


const mongoURI="mongodb://localhost:27017/inotebook"

const connectToMongo=()=>{
    const options = { useNewUrlParser: true, useUnifiedTopology: true };
    mongoose.connect(mongoURI,options)
        .then(()=>{
        console.log("Connected to mongoose succesfully")
    })
    .catch((error)=>{
        console.log("Not connected",error)
    })

}
module.exports=connectToMongo