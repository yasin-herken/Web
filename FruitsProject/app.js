const mongoose =require('mongoose');

main().catch(err => console.log(err));

async function main() {
  await mongoose.connect("mongodb://localhost:27017/person",{useNewUrlParser:true});
}

const personSchema=new mongoose.Schema({
    name: String,
    age: Number
});

const Person =mongoose.model("Person",personSchema);


const person =new Person
(
    {
    name:"John",
    age:37
    }
);
person.save();
