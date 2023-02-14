const Joi = require('joi');
module.exports.BookSchema = Joi.object({
    book: Joi.object({
         title:Joi.string().required(),
         author:Joi.string().required(),
         price: Joi.string().required().min(0),
         image:Joi.string().required(),
         description: Joi.string().required()
    }).required()
});

module.exports.reviewSchema = Joi.object({
    review: Joi.object({
        rating:Joi.number().required(),
        body: Joi.string().required()
    }).required()
})