var AWS = require('aws-sdk');
var rds = new AWS.RDS();

var instanceId = process.env.INSTANCE_ID;

exports.handler = async (event) => {
  
  console.log(`Preparing to stop RDS database ${instanceId}...`);

  // Get info about the instance:
  console.log('Getting database info...');
  var rdsResponse = await rds.describeDBInstances({ DBInstanceIdentifier: instanceId }).promise();
  var instanceInfo = rdsResponse.DBInstances[0];

  console.log('RDS instance info: ', JSON.stringify(instanceInfo, null, 2));
  var instanceStatus = instanceInfo.DBInstanceStatus;
  var instanceEngine = instanceInfo.Engine;

  console.log(`RDS instance ${instanceId} (${instanceEngine}) current state = ${instanceStatus}`);

  // We can only stop an instance if its status is available:
  if (instanceStatus === 'available') {
    console.log('Issuing stop command...');
    // We need to check whether the database is Aurora, since Aurora uses a 
    // slightly different API call to stop the database: 
    if (['aurora-postgres', 'aurora-mysql'].indexOf(instanceInfo.Engine) >= 0) {
      await rds.stopDBCluster({ DBClusterIdentifier: instanceInfo.DBClusterIdentifier }).promise();
    }
    else {
      await rds.stopDBInstance({ DBInstanceIdentifier: instanceId }).promise();
    }
    console.log('Stop command issued to database.');
  }
  else {
    console.log('Database is in a state that cannot be stopped.');
  }

  const response = {
    statusCode: 200,
    result: 'Function complete!'
  };

  return response;
};
