import mongoose from 'mongoose';

const paymentHistorySchema = new mongoose.Schema({
  amount: Number,
  date: Date,
  status: String
});

const clientSchema = new mongoose.Schema({
  contactName: {
    type: String,
    required: true
  },
  phoneNumber: {
    type: String,
    required: true
  },
  location: {
    type: String,
    required: true
  },
  email: {
    type: String,
    required: true
  },
  subscriptionDate: {
    type: Date,
    required: true
  },
  duePayment: {
    type: Number,
    required: true
  },
  quotationFile: {
    type: String
  },
  paymentHistory: [paymentHistorySchema],
  paymentDelay: {
    type: Number,
    default: 0
  }
}, {
  timestamps: true,
  toJSON: {
    transform: function(doc, ret) {
      ret.id = ret._id;
      delete ret._id;
      delete ret.__v;
      return ret;
    }
  }
});

export const Client = mongoose.model('Client', clientSchema); 