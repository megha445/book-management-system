import mongoose from 'mongoose';

const borrowRecordSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    book: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Book',
      required: true,
    },
    borrowDate: {
      type: Date,
      default: Date.now,
    },
    dueDate: {
      type: Date,
      default: function() {
        return new Date(Date.now() + 14 * 24 * 60 * 60 * 1000); // 14 days from now
      }
    },
    returnDate: {
      type: Date,
      default: null,
    },
    status: {
      type: String,
      enum: ['borrowed', 'returned', 'overdue'],
      default: 'borrowed',
    },
    fine: {
      type: Number,
      default: 0,
    },
  },
  { timestamps: true }
);

// Set due date to 14 days from borrow date by default
borrowRecordSchema.pre('save', function (next) {
  if (this.isNew && !this.dueDate) {
    this.dueDate = new Date(Date.now() + 14 * 24 * 60 * 60 * 1000);
  }
  next();
});

export default mongoose.model('BorrowRecord', borrowRecordSchema);

