const functions = require('firebase-functions')

const admin = require('firebase-admin')
admin.initializeApp()

const tasks = require('@google-cloud/tasks')

exports.addTasks = functions.https.onCall((data, context) => {
  const promises = [] as Promise<void>[]
  const roomId = data.roomId as string
  const dayLength = data.dayLength as number
  const nightLength = data.nightLength as number
  // const language = data.language as string

  promises.push(addNightTask(roomId, dayLength))
  promises.push(addDaytimeTask(roomId, dayLength, nightLength))

  return Promise.all(promises)
})

function addNightTask(roomId, dayLength) {
  const client = new tasks.CloudTasksClient()

  const projectId = functions.config().werewolf.id
  const queue = 'night'
  const location = functions.config().werewolf.location
  const parent = client.queuePath(projectId, location, queue)
  const url = 'https://' + location + '-' + projectId + '.cloudfunctions.net/executeNightTask?roomId=' + roomId

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

  return client.createTask(request)
}

function addDaytimeTask(roomId, dayLength, nightLength) {
  const client = new tasks.CloudTasksClient()

  const projectId = functions.config().werewolf.id
  const queue = 'daytime'
  const location = functions.config().werewolf.location
  const parent = client.queuePath(projectId, location, queue)
  const url = 'https://' + location + '-' + projectId + '.cloudfunctions.net/executeDaytimeTask?roomId=' + roomId + '&dayLength=' + dayLength + '&nightLength=' + nightLength

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

  return client.createTask(request)  
}

declare interface Player {
  uid: string,
  name: string,
  role: string,
  avatar: string,
  isAlive: boolean,
  votedPlayer: Player | null,
  bittenPlayer: Player | null,
  protectedPlayer: Player | null,
  divinedPlayer: Player | null,  
}

exports.executeNightTask = functions.https.onRequest((req, res) => {
  // Execute tasks when turning into night
  const db = admin.firestore()
  const roomId = req.query.roomId
  const docRef = db.colleciton('rooms').doc(roomId)

  docRef.update({
    isNight: true,
  }).then(() => {
    docRef.colleciton('messages').add({
      from: 'GM',
      timestamp: admin.firestore.Timestamp.now(),
      body: '',  // TODO: Set a message
      gameName: 'GM',
      avatar: '',
      isFromGrave: false,
    }).then((messageRef) => {
      res.send("It's night.")
    })
  })
})

exports.executeDaytimeTask = functions.https.onRequest((req, res) => {
  // Execute tasks when turning into daytime
  const db = admin.firestore()
  const roomId = req.query.roomId
  const dayLength = parseInt(req.query.dayLength)
  const nightLength = parseInt(req.query.nightLength)
  const docRef = db.collection('rooms').doc(roomId)

  let countsVillager = 0
  let countsWerewolf = 0
  let mostVotedPlayer: Player
  let mostBittenPlayer: Player
  let protectedPlayer: Player
  let divinedPlayer: Player
  let suicides = [] as Player[]
  let hasGameEnded = false
  let doesVillageWin = true

  const promises0 = [] as Promise<void>[]
  const promises1 = [] as Promise<void>[]
  const promises2 = [] as Promise<void>[]
  const promises3 = [] as Promise<void>[]

  docRef.collection('players').get()
    .then((querySnapshot) => {
      Promise.all(querySnapshot.docs.map((doc) => {
        // TODO: Save the player's name and role so they can be revealed when the game ends

        if (doc.data()!.isAlive!) {
          let votedPlayer = doc.data()!.votedPlayer
          let role = doc.data()!.role

          if (role !== 'werewolf') {
            countsVillager += 1

            if (role === 'knight' && doc.data()!.protectedPlayer !== null) {
              protectedPlayer = doc.data()!.protectedPlayer as Player
            }

            else if (role === 'seer' && doc.data()!.divinedPlayer !== null) {
              divinedPlayer = doc.data()!.divinedPlayer
            }
          } else {
            // Decide who will be killed by werewolves
          }

          if (votedPlayer !== null) {
            // Decide who will be executed
          } else {
            // Players who didn't vote will die
            suicides.push(doc.data()! as Player)
          }

          // Reset the selected player every night
          docRef.collection('players').doc(doc.id).update({
            votedPlayer: null,
            bittenPlayer: null,
            protectedPlayer: null,
            divinedPlayer: null,
          })
        }
      }))
      .then(() => {
        // Players who didn't vote will die
        for (let suicide of suicides) {
          // If the player who didn't vote is the most selected player, the player will be executed
          if (suicide.uid !== mostVotedPlayer.uid) {
            promises0.push(killPlayer(docRef, suicide.uid))

            if (suicide.role !== 'werewolf') {
              countsVillager -= 1
            } else {
              countsWerewolf -= 1
            }
          }
        }
      })

      Promise.all(promises0).then(() => {
        // Execute the most voted player
        if (mostVotedPlayer !== null && countsWerewolf > 0 && countsVillager > countsWerewolf) {
          promises1.push(killPlayer(docRef, mostVotedPlayer.uid))

          if (mostVotedPlayer.role !== 'werewolf') {
            countsVillager -= 1
          } else {
            countsWerewolf -= 1
          }
        } else {
          hasGameEnded = true

          if (countsWerewolf > 0) {
            doesVillageWin = false

            // TODO: Set a message
          } else {
            // TODO: Set a message
          }
          // TODO: End the game

        }

        Promise.all(promises1).then(() => {
          if (!hasGameEnded) {
            if (countsWerewolf > 0 && countsVillager > countsWerewolf) {
              // Kill the player selected by werewolves if the player isn't protected
              if (protectedPlayer.uid !== mostBittenPlayer.uid && mostVotedPlayer.uid !== mostBittenPlayer.uid) {
                promises2.push(killPlayer(docRef, mostBittenPlayer.uid))

                countsVillager -= 1
              } else {
                // When no one got killed
              }
            } else {
              hasGameEnded = true

              if (countsWerewolf > 0) {
                doesVillageWin = false
                // TODO: Set a message
              } else {
                // TODO: Set a message
              }

              promises2.push(endGame(docRef))
            }
          }

          Promise.all(promises2).then(() => {
            if (!hasGameEnded) {
              // Check if the number of villagers is still greater than the number of werewolves
              if (countsVillager > countsWerewolf) {
                // TODO: set a message
                const daytimeComes = docRef.update({ isNight: false })

                promises3.push(daytimeComes)

                // TODO: Identify the divined player's role

                // TODO: Identify the most voted player's role
              }
            } else {
              hasGameEnded = true

              if (countsWerewolf > 0) {
                doesVillageWin = false
                // TODO: Set a message
              } else {
                // TODO: Set a message
              }

              promises3.push(endGame(docRef))
            }

            Promise.all(promises3).then(() => {
              res.send("It's daytime.")
            })
          })
        })
      })
    })
})

function killPlayer(roomRef, uid: string): Promise<void> {
  const promise = 
    roomRef.collection('players').doc(uid).update({
      isAlive: false,
    })
  return promise
}

function endGame(roomRef): Promise<void> {
  const promise =
    roomRef.update({
      status: 'closed',
      isNight: false,
    })
  return promise
}

exports.deleteExpiredRooms = functions.pubsub.schedule('every wednesday 00:00').onRun((context) => {
  const db = admin.firestore()

  return db.collection('rooms').get()
    .then((querySnapShot) => {
      querySnapShot.forEach((doc) => {
        var status = doc.data()!.status!
        var createdAt = doc.data()!.timestamp!.toDate()
        var currentDate = Date.now()
        var difference = currentDate - createdAt

        if (difference > 604800000 && status !== 'ongoing') {
          doc.ref.delete()

          doc.ref.collection('players').get()
            .then((querySnapShot) => {
              querySnapShot.forEach((playerDoc) => {
                playerDoc.ref.delete()
              })
            })

          doc.ref.collection('messages').get()
            .then((querySnapShot) => {
              querySnapShot.forEach((messageDoc) => {
                messageDoc.ref.delete()
              })
            })
        }
      })
    })
})