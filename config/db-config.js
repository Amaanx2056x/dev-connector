const mongoose = require('mongoose')
mongoose.connect(process.env.DBURL, {
  useUnifiedTopology: true, useNewUrlParser: true, useFindAndModify: false, useCreateIndex: true
}).then(()=> {
  console.log('Connected')
}).catch((err)=>console.log(err))