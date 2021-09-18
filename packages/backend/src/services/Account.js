const { Account } = require('../models');

module.exports.create = function(formInput){
    let newAccount = new Account({
        ...formInput
    })
    return newAccount.save();
}