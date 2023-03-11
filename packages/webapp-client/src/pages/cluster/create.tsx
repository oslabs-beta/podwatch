import React from 'react';
import serverInstance from '../../utils/serverInstance';

const CreateClusterPage = () => {
  const [name, setName] = React.useState<string>('');
  const [description, setDescription] = React.useState<string>('');

  const [clusterId, setClusterId] = React.useState<string | null>(null);
  const [clusterSecret, setClusterSecret] = React.useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const { data } = await serverInstance.post('/cluster', {
      name,
      description,
    });
    console.log(data);
    setClusterId(data.cluster.id);
    setClusterSecret(data.secret);
  };

  return (
    <div style={{ color: 'white' }}>
      <form onSubmit={handleSubmit}>
        <label htmlFor="name">Cluster Name</label>
        <input
          type="text"
          name="name"
          value={name}
          onChange={(e) => setName(e.target.value)}
        />
        <label htmlFor="name">Cluster Description</label>
        <input
          type="text"
          name="description"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
        />
        <button type="submit">Create Cluster</button>
      </form>
      {clusterId && clusterSecret && (
        <div>
          <p>Cluster ID: {clusterId}</p>
          <p>Cluster Secret: {clusterSecret}</p>
        </div>
      )}
    </div>
  );
};

export default CreateClusterPage;
