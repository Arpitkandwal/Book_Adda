const Book=require('../models/books');


module.exports.index = async(req,res)=>{
    const books=await Book.find({});
    res.render('books/index',{ books });
}

module.exports.addbook = async(req,res)=>{
    res.render('books/new');
 }

 module.exports.postbook = async(req,res, next)=>{
    const book = new Book(req.body.book);
    book.user = req.user._id;
    await book.save();
    req.flash('success', 'Successfully added a book');
    res.redirect(`/books/${book._id}`);
}

 module.exports.showbook = async(req,res)=>{
    const Id=req.params.id;
    const book= await Book.findById(Id).populate('user').populate({
       path:'reviews',
        populate:{
           path:'author'
       }});
    console.log(book);
    res.render('books/show',{book});
}

module.exports.buybook = async(req,res,next)=>{
    res.render('books/buy');
}

module.exports.cart = async(req,res,next)=>{
    const Id=req.params.id;
     const book= await Book.findById(Id);
     await book.save();
       res.render('books/cart',{book});
}

module.exports.deletebook = async (req,res)=>{
    const { id } = req.params;
    await Book.findByIdAndDelete(id);
    res.redirect('/books');

}

