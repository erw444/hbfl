// Imports
// TODO: Import the aws-sdk
const AWS = require('aws-sdk')

// TODO: Configure region
AWS.config.update({region: 'us-east-1'})

// Declare local variables
// TODO: Create an ec2 object
const ec2 = new AWS.EC2()

function listInstances () {
  // TODO: List instances using ec2.describeInstances()
  return new Promise((resolve, reject) => {
    ec2.describeInstances({}, (err, data) => {
      if(err) reject(err)
      else {
        resolve(data.Reservations.reduce((i, r) => {
          return i.concat(r.Instances)
        }, []))
      }
    })
  })
}

function terminateInstance (instanceId) {
  // TODO: Terminate an instance with a given instanceId
  const params = {
    InstanceIds: [
      instanceId
    ]
  }

  return new Promise((resolve, reject) => {
    ec2.terminateInstances(params, (err, data) => {
      if(err) reject(err)
      else resolve(data)
    })
  })
}

// listInstances()
// .then(data => console.log(data))
terminateInstance('i-0bfd1ac4a806cc3ac')
.then(data => console.log(data))
