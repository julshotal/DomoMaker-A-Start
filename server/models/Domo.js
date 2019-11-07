const mongoose = require('mongoose');
mongoose.Promise = global.Promise;
const _ = require('underscore');

const convertID = mongoose.Types.ObjectId;
const setName = (name) => _.escape(name).trim();
const amCowboy = (img) => {
  if(img === 'yes') {
    return '../../assets/img/domofaceC.jpeg';
  }

  return '../../assets/img/domoface.jpeg'
}

let DomoModel = {};

const DomoSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    trim: true,
    set: setName,
  },

  age: {
    type: Number,
    min: 0,
    required: true,
  },

  img: {
    type: String,
    required: true,
    set: amCowboy,
  },

  owner: {
    type: mongoose.Schema.ObjectId,
    required: true,
    ref: 'Account',
  },

  createdData: {
    type: Date,
    default: Date.now,
  },
});

DomoSchema.statics.toAPI = (doc) => ({
  name: doc.name,
  age: doc.age,
});

DomoSchema.statics.findByOwner = (ownerId, callback) => {
  const search = {
    owner: convertID(ownerId),
  };

  return DomoModel.find(search).select('name age').exec(callback);
};

DomoModel = mongoose.model('Domo', DomoSchema);

module.exports.DomoModel = DomoModel;
module.exports.DomoSchema = DomoSchema;
