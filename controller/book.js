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
    req.flash('error', 'Sorry this feature is not available yet!');
    const Id=req.params.id;
    const book= await Book.findById(Id).populate('user').populate({
       path:'reviews',
        populate:{
           path:'author'
       }});
    res.redirect(`/books/${book._id}`);

}

module.exports.cart = async(req,res,next)=>{
    req.flash('error', 'Sorry this feature is not available yet!');
    const Id=req.params.id;
    const book= await Book.findById(Id).populate('user').populate({
       path:'reviews',
        populate:{
           path:'author'
       }});
    res.redirect(`/books/${book._id}`);

}



module.exports.deletebook = async (req,res)=>{
    const { id } = req.params;
    await Book.findByIdAndDelete(id);
    res.redirect('/books');

}

