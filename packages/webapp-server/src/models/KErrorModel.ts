import mongoose from 'mongoose';
import { Cluster } from './ClusterModel';

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
  reason: string;
  message: string;
  timestamp: Date;
  nativeEvent: NativeKEvent;
}

export interface KErrorAttrs extends KError {
  cluster: Cluster;
}

export interface KErrorDocument extends KErrorAttrs, mongoose.Document {
  id: string;
}

export interface KErrorModel extends mongoose.Model<KErrorDocument> {
  build: (attrs: KErrorAttrs) => KErrorDocument;
}

const kErrorSchema = new mongoose.Schema<KErrorAttrs>(
  {
    reason: {
      type: String,
      required: true,
    },
    message: {
      type: String,
      required: true,
    },
    timestamp: {
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
