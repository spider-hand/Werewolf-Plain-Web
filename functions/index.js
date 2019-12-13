const functions = require('firebase-functions')

const admin = require('firebase-admin')
admin.initializeApp()

const tasks = require('@google-cloud/tasks')

exports.addNightTask = functions.https.onCall((data, context) => {
  const client = new tasks.CloudTasksClient()

  const projectId = functions.config().werewolf.id
  const queue = 'night'
  const location = functions.config().werewolf.location

  const parent = client.queuePath(projectId, location, queue)

  const roomId = data.roomId
  const dayLength = data.dayLength
  const url = 'https://' + location + '-' + projectId + '.cloudfunctions.net/atNight?roomId=' + roomId
  
  const task = {
    httpRequest: {
      httpMethod: 'POST',
      url: url,
    },
    scheduleTime: {
      seconds: dayLength * 60 + Date.now() / 1000,
    }, 
  }

  const request = {
    parent: parent,
    task: task,
  }

  return client.createTask(request).then((response) => {
    return response
  })
})

exports.addDaytimeTask = functions.https.onCall((data, context) => {
  const client = new tasks.CloudTasksClient()

  const projectId = functions.config().werewolf.id
  const queue = 'daytime'
  const location = functions.config().werewolf.location

  const parent = client.queuePath(projectId, location, queue)

  const roomId = data.roomId
  const dayLength = data.dayLength
  const nightLength = data.nightLength
  const url = 'https://' + location + '-' + projectId + '.cloudfunctions.net/inDaytime?roomId=' + roomId
  
  const task = {
    httpRequest: {
      httpMethod: 'POST',
      url: url,
    },
    scheduleTime: {
      seconds: (dayLength + nightLength) * 60 + Date.now() / 1000,
    }, 
  }

  const request = {
    parent: parent,
    task: task,
  }

  return client.createTask(request).then((response) => {
    return response
  })
})

exports.atNight = functions.https.onRequest((req, res) => {
  var db = admin.firestore()
  var roomId = req.query.roomId
  var docRef = db.collection('rooms').doc(roomId)

  docRef.update({
    isNight: true,
  }).then(() => {
    docRef.collection('messages').add({
      from: 'host',
      timestamp: admin.firestore.Timestamp.now(),
      body: "It's night.",
      gameName: '',
      avatar: '',
    }).then((messageRef) => {
      res.send("It's night.")
    })
  })
})

exports.inDaytime = functions.https.onRequest((req, res) => {
  var db = admin.firestore()
  var roomId = req.query.roomId
  var docRef = db.collection('rooms').doc(roomId)

  // TODO: Check the day's result
  // Kill the selected player if the player isn't protected
  // Execute the selected player
  // End the game if the number of wolves are greater than the number of villagers or there's no wolves
  // Add tasks for the next day if the game still continues

  docRef.update({
    isNight: false,
  }).then(() => {
    docRef.collection('messages').add({
      from: 'host',
      timestamp: admin.firestore.Timestamp.now(),
      body: "It's daytime.",
      gameName: '',
      avatar: '',
    }).then((messageRef) => {
      res.send("It's daytime.")
    })
  })
})