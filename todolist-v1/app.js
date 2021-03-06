const express=require("express");

const bodyParser=require("body-parser");

const date=require(__dirname+"/date.js");

const mongoose=require('mongoose');

const _=require('lodash');

const app = express();

app.set('view engine', 'ejs');

app.use(bodyParser.urlencoded({extended:true}));

app.use(express.static('public'))

const uri = "mongodb+srv://admin-Yasin:Test123@cluster0.iq2bu.mongodb.net/myFirstDatabase?retryWrites=true&w=majoritymongodb+srv://admin-Yasin:Test123@cluster0.iq2bu.mongodb.net/myFirstDatabase?retryWrites=true&w=majority";
mongoose.connect("mongodb+srv://admin-Yasin:Test123@cluster0.iq2bu.mongodb.net/myFirstDatabase?retryWrites=true&w=majority/todolistDB",{useNewUrlParser:true});

const itemsSchema={
    name:String
};

const Item=mongoose.model("Item",itemsSchema);

const item1=new Item({
    name:"Welcome to your todolist."
})
const item2=new Item({
    name:"Hit the +button to add a new item."
})
const item3=new Item({
    name:"Hit this to delete an item."
})
const defaultItems=[item1,item2,item3];

const listSchema={
    name:String,
    items:[itemsSchema]
};

const List=mongoose.model("List",listSchema);

app.get("/",function(req,res){

    
    Item.find({},function(err,results){

        if(results.length==0){
            Item.insertMany(defaultItems,function(err){
                if(err)
                    console.log(err);
                else{
                    console.log("Succesfully added");
                } 
            });
            res.redirect("/");
        }
        else{res.render('list', {listTitle: "Today",newListItems:results});
        }
    });
    
});

app.post("/",function(req,res){
    const itemName =req.body.newItem;

    const listName=req.body.list;
    const item=new Item({name:itemName});

    if(listName=="Today"){
        item.save();
        res.redirect("/");
    }else{
        List.findOne({name:listName},function(err,results){
            results.items.push(item);
            results.save();
            
        });
        res.redirect("/"+listName);
    }
        
});
app.post("/delete",function(req,res){
   const checkedItemID=req.body.checkbox;
   const listName=req.body.listName;

   if(listName=="Today"){
    Item.findByIdAndRemove(checkedItemID,function(err){
        if(!err){
            console.log("Successfully deleted checked item.");
            res.redirect("/");
        }
   });
   }else{
       List.findOneAndUpdate({name:listName},{$pull:{items:{_id:checkedItemID}}},function(err,foundList){
           if(!err){
               res.redirect("/"+listName);
           }
       });
   }
   
});
app.get("/list/:customListName",function(req,res){
    const customListName=_.capitalize(req.params.customListName);

    List.findOne({name:customListName},function(err,results){
        if(!err){
            if(!results){
                //create a new list
                const list=new List({
                name:customListName,
                items:defaultItems
                });
            list.save();
            res.redirect("/"+customListName);
        }else{
                res.render("list",{listTitle: results.name,newListItems:results.items});
        }
    }     
});
});
app.post("/work",function(req,res){
    let item=req.body.newItem;
    workItems.push(item);
    res.redirect("/work");
})
let port=process.env.PORT;
if(port==null || port=="")
{
    port=3000;
}
console.log(port);
app.listen(port,function(){
    console.log("Server started on port"+port);
    
})