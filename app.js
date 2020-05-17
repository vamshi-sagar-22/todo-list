const express = require('express')
const bp = require('body-parser')
const app = express()
app.use(express.static('public'))
app.use(bp.urlencoded({extended:true}))
app.set('view engine','ejs')
const mongoose = require('mongoose')
mongoose.connect('mongodb+srv://admin-vamshi:vamshi22@cluster0-ycyqx.mongodb.net/todoDB',{useNewUrlParser:true,useUnifiedTopology:true})
const itemsSchema =new mongoose.Schema({
  name:String
})
const collection = mongoose.model('listItem',itemsSchema)

const item1 =new collection( {name:"play"})
const item2 =new collection( {name:"eat"})
const item3 =new collection( {name:"study"})

const array = [item1,item2,item3]
const listSchema = {
  name:String,
  items : []
}

const list = mongoose.model('list',listSchema)
app.get('/',function(req,res){

  collection.find({},function(err, data){
    if(data.length===0){

      collection.insertMany(array,function(err){
        if(err)
        console.log(err);
        else{

        }
      })

      res.redirect('/')
    }
    else{
    res.render('list',{day:'Today',listItem:data})
  }
  })


})

app.post('/',function(req,res){
  var li = req.body.todo;
  var ln = req.body.button;
  var item = new collection({name:li})
  if(ln ==="Today"){
    item.save();
    res.redirect('/')
  }
  else{
      list.findOne({name:ln},function(err,result){
        result.items.push(item)
        result.save()
        res.redirect('/'+ln);
      })
  }
})

app.post('/delete',function(req,res){
  var ln = req.body.listname
  if(ln==="Today"){
  if(req.body.checkbox!==null){
    collection.findByIdAndRemove(req.body.checkbox,function(err){
      if(err)
      console.log(err);
      else
      {
        res.redirect('/');
      }
    })
  }}
  else{
    var id = mongoose.Types.ObjectId(req.body.checkbox)
    list.findOneAndUpdate({name:ln},{$pull : {items:{_id:id}}},{useFindAndModify:false},
      function(err,result){
      if(!err){
        res.redirect("/"+ln)
      }
    })
  }
})


app.get('/:token',function(req,response){
  const listname = req.params.token

list.findOne({name:listname},function(err,data){
  if(!data)
  {
    const l = new list({
      name:listname,
      items:array
    })
    l.save()
    var url = "/"+listname
    response.redirect(url)
    }
    else{
      response.render('list',{day:listname,listItem:data.items})
    }

})

})

app.listen(process.env.PORT || 3000);
