import mongoose from 'mongoose';
import { ClusterDocument } from './ClusterModel';

export interface NativeKEvent {
  type: string;
  object: {
    kind: string;
    apiVersion: string;
    metadata: {
      name: string;
      namespace: string;
      uid: string;
      resourceVersion: string;
      creationTimestamp: string;
      managedFields: any[];
    };
    involvedObject: {
      kind: string;
      namespace: string;
      name: string;
      uid: string;
      apiVersion: string;
      resourceVersion: string;
      fieldPath: string;
    };
    reason: string;
    message: string;
    source: {
      component: string;
      host: string;
    };
    firstTimestamp: string;
    lastTimestamp: string;
    count: number;
    type: string;
    eventTime: null;
    reportingComponent: string;
    reportingInstance: string;
  };
}

export interface KError {
  name: string;
  reason: string;
  message: string;
  type: string;
  count: number;
  firstTimestamp: Date;
  lastTimestamp: Date;
  cluster: ClusterDocument;
  nativeEvent: NativeKEvent;
}

export interface KErrorAttrs extends KError {}

export interface KErrorDocument extends KErrorAttrs, mongoose.Document {
  id: string;
}

export interface KErrorModel extends mongoose.Model<KErrorDocument> {
  build: (attrs: KErrorAttrs) => KErrorDocument;
}

const kErrorSchema = new mongoose.Schema<KErrorAttrs>(
  {
    name: {
      type: String,
      required: true,
    },
    reason: {
      type: String,
      required: true,
    },
    message: {
      type: String,
      required: true,
    },
    type: {
      type: String,
      required: true,
    },
    count: {
      type: Number,
      required: true,
    },
    firstTimestamp: {
      type: Date,
      required: true,
    },
    lastTimestamp: {
      type: Date,
      required: true,
    },
    cluster: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Cluster',
      required: true,
    },
    nativeEvent: {
      type: Object,
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

kErrorSchema.statics.build = (attrs: KErrorAttrs) => {
  return new KErrorModel(attrs);
};

const KErrorModel = mongoose.model<KErrorDocument, KErrorModel>(
  'KError',
  kErrorSchema
);

export { KErrorModel };
