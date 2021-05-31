const express=require('express');
const app=express();
const path=require('path');
const mongoose=require('mongoose');
const methodOverride=require('method-override');
const Product=require('./models/product');

mongoose.connect('mongodb://localhost:27017/farmStand', { useNewUrlParser: true, useUnifiedTopology: true })
    .then(() => {
        console.log("MONGO CONNECTION OPEN!!!")
    })
    .catch(err => {
        console.log("OH NO MONGO CONNECTION ERROR!!!!")
        console.log(err)
    })

app.set('views',path.join(__dirname,'views'));
app.set('view engine','ejs');
app.use(express.urlencoded({extended:true}));
app.use(methodOverride('_method'));


const categories = ['fruit', 'vegetable', 'dairy'];

app.get('/products', async (req,res)=>{

    try{
        if(req.query.category)
        {
            const products= await Product.find({category:req.query.category});
res.render('./products/index',{products,category:req.query.category});
        }
        else
        {
const products= await Product.find({});
res.render('./products/index',{products,category:'All'});
        }
    }
    catch(e)
    {
        console.log(e);
    }
});


// app.get('/prouduct/new',async(req,res)=>{
// // res.render('./products/new');
// res.send('hi');
// });
app.get('/products/new',(req,res)=>{
    res.render('./products/new',{categories});
});



app.get('/products/:id', async(req,res)=>{
try{
    const {id}=req.params;
    const product= await Product.findById(id);
   res.render('./products/show',{product,categories:categories});
}
catch(e)
{
    console.log(e);
}
});

app.get('/products/edit/:id',async(req,res)=>{
    const {id}=req.params;
const product= await Product.findById(id);
res.render('products/edit',{product,categories});
});


app.put('/products/:id',async(req,res)=>{
    const {id}=req.params;
    const product=await Product.findByIdAndUpdate(id,req.body,{runValidators:true,new:true});
    res.redirect(`/products/${product._id}`);
});


app.delete('/products/:id',async(req,res)=>{
    const {id}=req.params;
    await Product.findByIdAndDelete(id);
    res.redirect(`/products`);
});


app.post('/products',async(req,res)=>{
    
const product = new Product(req.body);
await product.save();
console.log(product);
res.redirect(`/products/${product._id}`);
});

app.listen('3000',()=>{
    console.log('Server Started');
})
