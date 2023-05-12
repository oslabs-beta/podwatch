import { ClusterDocument } from './ClusterModel';
import mongoose from 'mongoose';

export type ServiceStatus = 'OK' | 'ERROR' | 'OFFLINE';

export interface Log {
  message: string;
  args: any[];
  level: string;
  timestamp: Date;
}

export interface Status {
  status: ServiceStatus;

  timestamp: Date;

  logs: Log[];

  cluster: ClusterDocument;
}

export interface StatusAttrs extends Status {}

export interface StatusDocument extends Status, mongoose.Document {
  id: string;
}

export interface StatusModel extends mongoose.Model<StatusDocument> {
  build(attrs: StatusAttrs): StatusDocument;
}

const statusSchema = new mongoose.Schema(
  {
    status: {
      type: String,
      required: true,
      enum: ['OK', 'ERROR'],
    },
    timestamp: {
      type: Date,
      required: true,
    },
    logs: [
      {
        message: {
          type: String,
          required: true,
        },
        args: {
          type: Array,
          required: true,
        },
        level: {
          type: String,
          required: true,
        },
        timestamp: {
          type: Date,
          required: true,
        },
      },
    ],
    cluster: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Cluster',
      required: true,
    },
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

statusSchema.statics.build = (attrs: StatusAttrs) => {
  return new StatusModel(attrs);
};

const StatusModel = mongoose.model<StatusDocument, StatusModel>(
  'Status',
  statusSchema
);

export { StatusModel };
