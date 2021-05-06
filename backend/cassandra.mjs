
import cassandra from 'cassandra-driver';
let datacenter = process.env.NODE_ENV != 'dev' ? 'us-central1' : 'datacenter1'
const authProvider = new cassandra.auth.PlainTextAuthProvider('cassandra', 'cassandra');
const session = new cassandra.Client({ contactPoints: ['127.0.0.1'], keyspace: 'practica_bd2', authProvider: authProvider });

export { session }
