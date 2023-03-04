import { User } from './User';

export interface Cluster {
  /**
   * The cluster's unique identifier.
   */
  id: string;
  /**
   * The cluster's name, specified by the cluster owner.
   */
  name: string;
  /**
   * The cluster's description, specified by the cluster owner.
   */
  description?: string;
  /**
   * The cluster's owner - this should be a reference to a user document.
   */
  owner: User;
  /**
   * The cluster's members - this should be an array of references to user documents. These users will be permitted read access to this cluster's dashboard.
   */
  members: User[];
}
