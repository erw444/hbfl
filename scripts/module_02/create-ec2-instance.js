// Imports
// TODO: Import the aws-sdk
const AWS = require('aws-sdk')
const helpers = require('./helpers')

// TODO: Configure region
AWS.config.update({region: 'us-east-1'})

// Declare local variables
// TODO: Create an ec2 object
const ec2 = new AWS.EC2()
const sgName = 'hamster_sg2'
const keyName = 'hamster_key2'

// Do all the things together
createSecurityGroup(sgName)
.then(() => {
  return createKeyPair(keyName)
})
.then(helpers.persistKeyPair)
.then(() => {
  return createInstance(sgName, keyName)
})
.then((data) => {
  console.log('Created instance with:', data)
})
.catch((err) => {
  console.error('Failed to create instance with:', err)
})

// Create functions

function createSecurityGroup (sgName) {
  // TODO: Implement sg creation & setting SSH rule
  const params = {
    Description: sgName,
    GroupName: sgName
  };

  return new Promise((resolve, reject) => {
    ec2.createSecurityGroup(params, (err, data) => {
      if(err){
        reject(err)
      } else {
          const params = {
            GroupId: data.GroupId,
            IpPermissions: [
              { //SSH
                IpProtocol: 'tcp',
                FromPort: 22,
                ToPort: 22,
                IpRanges: [
                  {
                    CidrIp: '0.0.0.0/0'
                  }
                ]
              },
              { //application port
                IpProtocol: 'tcp',
                FromPort: 3000,
                ToPort: 3000,
                IpRanges: [
                  {
                    CidrIp: '0.0.0.0/0'
                  }
                ]
              }
            ]
          }
          ec2.authorizeSecurityGroupIngress(params, err => {
            if(err) reject(err)
            else resolve()
          })
      }
    })
  })
}

function createKeyPair (keyName) {
  // TODO: Create keypair
  const params = {
    KeyName: keyName
  }

  return new Promise((resolve, reject) => {
    ec2.createKeyPair(params, (err, data) => {
      if(err){
        reject(err)
      } else {
        resolve(data)
      }
    })
  })
}

function createInstance (sgName, keyName) {
  // TODO: create ec2 instance
  const params = {
    ImageId: 'ami-0e47d335bb5eff5a3',
    InstanceType: 't2.micro',
    KeyName: keyName,
    MaxCount: 1,
    MinCount: 1,
    SecurityGroups: [sgName],
    UserData: 'IyEvYmluL2Jhc2gNCnN1ZG8gYXB0LWdldCB1cGRhdGUNCnN1ZG8gYXB0LWdldCAteSBpbnN0YWxsIGdpdA0KZ2l0IGNsb25lIGh0dHBzOi8vZ2l0aHViLmNvbS9lcnc0NDQvaGJmbC5naXQgL2hvbWUvYml0bmFtaS9oYmZsDQpjaG93biAtUiBiaXRuYW1pOiAvaG9tZS9iaXRuYW1pL2hiZmwNCmNkIC9ob21lL2JpdG5hbWkvaGJmbA0Kc3VkbyBucG0gaQ0Kc3VkbyBucG0gcnVuIHN0YXJ0'
  }

  return new Promise((resolve, reject) => {
    ec2.runInstances(params, (err, data) =>{
      if(err){
        reject(err)
      } else {
        resolve(data)
      }
    })
  })
}
