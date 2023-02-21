import mongoose from 'mongoose';
import bcrypt from 'bcrypt';
import { UserDocument } from './UserModel';

export interface ClusterAttrs {
  name: string;
  secret: string;
  description: string;
  owner: UserDocument;
  members: UserDocument[];
}

export interface ClusterDocument extends mongoose.Document {
  id: string;
  name: string;
  description: string;
  owner: UserDocument;
  members: UserDocument[];
}

export interface ClusterModel extends mongoose.Model<ClusterDocument> {
  build: (attrs: ClusterAttrs) => ClusterDocument;
}

const clusterSchema = new mongoose.Schema<ClusterAttrs>(
  {
    name: {
      type: String,
      required: true,
    },
    secret: {
      type: String,
      required: true,
      select: false,
    },
    description: {
      type: String,
    },
    owner: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    members: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
      },
    ],
  },
  {
    toJSON: {
      virtuals: true,
    },
    toObject: {
      virtuals: true,
    },
  }
);

clusterSchema.pre('save', async function (done) {
  if (!this.isModified('secret')) return done();
  try {
    const salt = await bcrypt.genSalt(10);
    this.secret = await bcrypt.hash(this.secret, salt);
    return done();
  } catch (err: any) {
    return done(err);
  }
});

clusterSchema.methods.compareSecret = async function (candidateSecret: string) {
  return await bcrypt.compare(candidateSecret, this.secret);
};

clusterSchema.statics.build = (attrs: ClusterAttrs) => {
  return new Cluster(attrs);
};

const Cluster = mongoose.model<ClusterDocument, ClusterModel>(
  'Cluster',
  clusterSchema
);

export { Cluster };
