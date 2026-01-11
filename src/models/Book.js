import mongoose from 'mongoose';

const bookSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: [true, 'Book title is required'],
      trim: true,
    },
    author: {
      type: String,
      required: [true, 'Author name is required'],
      trim: true,
    },
    isbn: {
      type: String,
      required: [true, 'ISBN is required'],
      unique: true,
      trim: true,
    },
    publicationYear: {
      type: Number,
      required: [true, 'Publication year is required'],
      min: [1000, 'Invalid publication year'],
      max: [new Date().getFullYear(), 'Publication year cannot be in future'],
    },
    genre: {
      type: String,
      required: [true, 'Genre is required'],
      enum: ['Fiction', 'Non-Fiction', 'Science', 'History', 'Biography', 'Technology', 'Other'],
    },
    totalCopies: {
      type: Number,
      required: [true, 'Total copies is required'],
      min: [1, 'At least 1 copy required'],
      default: 1,
    },
    availableCopies: {
      type: Number,
      min: [0, 'Available copies cannot be negative'],
      default: function() {
        return this.totalCopies;
      }
    },
    description: {
      type: String,
      maxlength: [1000, 'Description cannot exceed 1000 characters'],
    },
    coverImage: {
      type: String,
      default: null,
    },
  },
  { timestamps: true }
);

// This hook is no longer needed with the default function above
// But keeping it as backup for explicit setting
bookSchema.pre('save', function (next) {
  if (this.isNew && this.availableCopies === undefined) {
    this.availableCopies = this.totalCopies;
  }
  next();
});

export default mongoose.model('Book', bookSchema);