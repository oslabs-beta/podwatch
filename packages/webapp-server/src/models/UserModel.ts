import mongoose from 'mongoose';
import bcrypt from 'bcrypt';

export interface User {
  /**
   * The user's email address
   */
  email: string;
  /**
   * The user's auth provider (local, google, github)
   */
  provider: 'local' | 'google' | 'github';
  /**
   * The user's auth provider ID (only required if using a non-local auth strategy)
   */
  providerId?: string;
  /**
   * The user's avatar URL, if provided by the auth provider
   */
  avatar?: string;
}
export interface UserAttrs extends User {
  /**
   * The user's password (only required if using a local auth strategy)
   */
  password?: string;
}

export interface UserModel extends mongoose.Model<UserDocument> {
  build: (attrs: UserAttrs) => UserDocument;
}

export interface UserDocument extends UserAttrs, mongoose.Document {
  /**
   * The user's mongodb ID
   */
  id: string;
  /**
   * Compare a provided password with the hashed password in the database
   * @param candidatePassword The password to compare
   * @returns True if the passwords match, false otherwise
   */
  comparePassword: (candidatePassword: string) => Promise<boolean>;
}

const userSchema = new mongoose.Schema<UserAttrs>(
  {
    email: {
      type: String,
      required: true,
    },
    provider: {
      type: String,
      required: true,
      enum: ['local', 'google', 'github'],
    },
    providerId: {
      type: String,
    },
    password: {
      type: String,
      select: false,
      // Password is required if the user is using the local provider
      required: function (this: UserDocument) {
        return this.provider === 'local';
      },
    },
    avatar: {
      type: String,
    },
  },
  {
    toJSON: {
      // Include virtual getters as properties (such as _id -> id) when converting to JSON
      virtuals: true,
    },
    toObject: {
      // Include virtual getters as properties (such as _id -> id) when converting to objects
      virtuals: true,
    },
  }
);

userSchema.pre('save', async function save(next) {
  if (!this.password) return next();
  if (!this.isModified('password')) return next();
  try {
    const salt = await bcrypt.genSalt(10);
    this.password = await bcrypt.hash(this.password, salt);
    return next();
  } catch (err: any) {
    return next(err);
  }
});

userSchema.virtual('password').set(function (password: string) {
  this.password = password;
});

userSchema.methods.comparePassword = async function (
  candidatePassword: string
) {
  if (this.provider !== 'local') return false;
  return await bcrypt.compare(candidatePassword, this.password);
};

userSchema.statics.build = (attrs: UserAttrs): UserDocument => {
  return new UserModel(attrs);
};

const UserModel = mongoose.model<UserDocument, UserModel>('User', userSchema);

export { UserModel };
