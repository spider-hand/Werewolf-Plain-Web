const functions = require('firebase-functions')

const admin = require('firebase-admin')
admin.initializeApp()

const tasks = require('@google-cloud/tasks')

exports.addTasks = functions.https.onCall((data, context) => {
  const promises = []
  const roomId = data.roomId
  const nightLength = data.nightLength
  const dayLength = data.dayLength

  promises.push(addNightTask(roomId, dayLength))
  promises.push(addDaytimeTask(roomId, dayLength, nightLength))

  return Promise.all(promises)
})

exports.atNight = functions.https.onRequest((req, res) => {
  var db = admin.firestore()
  var roomId = req.query.roomId
  var docRef = db.collection('rooms').doc(roomId)

  docRef.update({
    isNight: true,
  }).then(() => {
    docRef.collection('messages').add({
      from: 'GM',
      timestamp: admin.firestore.Timestamp.now(),
      body: "It's night.",
      gameName: 'GM',
      avatar: '',
    }).then((messageRef) => {
      res.send("It's night.")
    })
  })
})

exports.inDaytime = functions.https.onRequest((req, res) => {
  var db = admin.firestore()
  var roomId = req.query.roomId
  var dayLength = parseInt(req.query.dayLength)
  var nightLength = parseInt(req.query.nightLength)
  var docRef = db.collection('rooms').doc(roomId)

  var countsVillager = 0
  var countsWerewolf = 0
  var countsVote = {}
  var countsBite = {}
  var compareVote = 0
  var compareBite = 0
  var mostVotedPlayer = { id: 'mostVotedPlayer' }
  var mostBittenPlayer = { id: 'mostBittenPlayer' }
  var protectedPlayer = { id: 'protectedPlayer' }
  var divinedPlayer = { id: 'divinedPlayer' }
  var playerRoles = []
  var promises0 = []
  var promises1 = []
  var promises2 = []
  var hasGameEnded = false
  var doesVillageWin = true
  var daytimeMessage = ''

  docRef.collection('players').get()
    .then((querySnapShot) => {
      Promise.all(querySnapShot.docs.map((doc) => {
        // Save the name and the player's role so it can be revealed when the game ends
        playerRoles.push({
          id: doc.data().id,
          name: doc.data().name,
          role: doc.data().role,
        })

        if (doc.data().isAlive) {
          var votedPlayer = doc.data().votedPlayer
          var playerRole = doc.data().role

          if (playerRole != 'werewolf') {
            countsVillager += 1

            if (playerRole == 'knight' && doc.data().protectedPlayer != null) {
              protectedPlayer = doc.data().protectedPlayer
            }

            if (playerRole == 'seer' && doc.data().divinedPlayer != null) {
              divinedPlayer = doc.data().divinedPlayer
            }
          } else {
            var bittenPlayer = doc.data().bittenPlayer
            countsWerewolf += 1

            if (bittenPlayer != null) {
              if (countsBite[bittenPlayer.id] == undefined) {
                countsBite[bittenPlayer.id] = 1
              } else {
                countsBite[bittenPlayer.id] += 1
              }

              if (countsBite[bittenPlayer.id] > compareBite) {
                compareBite = countsBite[bittenPlayer.id]
                mostBittenPlayer = bittenPlayer
              }
            }
          }

          if (votedPlayer != null) {
            if (countsVote[votedPlayer.id] == undefined) {
              countsVote[votedPlayer.id] = []
              countsVote[votedPlayer.id].push(1)
              countsVote[votedPlayer.id].push(votedPlayer.name)
            } else {
              countsVote[votedPlayer.id][0] += 1
            }

            if (countsVote[votedPlayer.id][0] > compareVote) {
              compareVote = countsVote[votedPlayer.id][0]
              mostVotedPlayer = votedPlayer
            }
          } else {
            // Kill players who didn't vote
            killPlayer(docRef, doc.id)
            daytimeMessage += `${doc.data().name} committed suicide.. `

            if (playerRole != 'werewolf') {
              countsVillager -= 1
            } else {
              countsWerewolf -= 1
            }
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
        // Execute the most voted player
        if (mostVotedPlayer.id != 'mostVotedPlayer' && countsWerewolf > 0 && countsVillager > countsWerewolf) {
          promises0.push(killPlayer(docRef ,mostVotedPlayer.id))

          // How many votes each player got?
          for (var key in countsVote) {
            if (countsVote[key][0] == 1) {
              daytimeMessage += `${countsVote[key][1]} got ${countsVote[key][0]} vote. `
            } else {
              daytimeMessage += `${countsVote[key][1]} got ${countsVote[key][0]} votes. `
            }
          }

          daytimeMessage += `${mostVotedPlayer.name} was executed. `
        } else {
          hasGameEnded = true

          if (countsWerewolf > 0) {
            doesVillageWin = false
            daytimeMessage += 'Werewolves killed all villagers.. \n'
          } else {
            daytimeMessage += 'All werewolves were executed! Village wins! \n'
          }

          daytimeMessage += revealRoles(playerRoles)

          promises0.push(endGame(docRef))
          promises0.push(sendDaytimeMessage(docRef, daytimeMessage))
          promises0.push(updateRecords(doesVillageWin, playerRoles))
        }

        Promise.all(promises0).then(() => {
          if (!hasGameEnded) {
            if (mostVotedPlayer.role != 'werewolf') {
              countsVillager -= 1
            } else {
              countsWerewolf -= 1
            }

            if (countsWerewolf > 0 && countsVillager > countsWerewolf) {
              // Kill the most bitten player if the player isn't protected by knight
              // TODO: Kill a player randomly when any werewolves didn't select a player
              if (protectedPlayer.id != mostBittenPlayer.id && mostVotedPlayer.id != mostBittenPlayer.id && mostBittenPlayer.id != 'mostBittenPlayer') {
                promises1.push(killPlayer(docRef, mostBittenPlayer.id))

                daytimeMessage += `${mostBittenPlayer.name} was killed. `
                countsVillager -= 1
              } else {
                daytimeMessage += 'No one was killed last night. '
              }
            } else {
              // End this game
              hasGameEnded = true

              if (countsWerewolf > 0) {
                doesVillageWin = false
                daytimeMessage += 'Werewolves killed all villagers.. \n'
              } else {
                daytimeMessage += 'All werewolves were executed! Village wins! \n'
              }

              daytimeMessage += revealRoles(playerRoles)

              promises1.push(endGame(docRef))
              promises1.push(sendDaytimeMessage(docRef, daytimeMessage))
              promises1.push(updateRecords(doesVillageWin, playerRoles))
            }
          }

          Promise.all(promises1).then(() => {
            if (!hasGameEnded) {
              // Check if the number of villagers are greater than the number of wolves after werewolves bite a villager
              if (countsVillager > countsWerewolf) {
                var daytimeComes = docRef.update({ isNight: false, })

                promises2.push(daytimeComes)
                promises2.push(sendDaytimeMessage(docRef, daytimeMessage))

                // Add the tasks for the next day
                promises2.push(addNightTask(roomId, dayLength))
                promises2.push(addDaytimeTask(roomId, dayLength, nightLength))

                if (divinedPlayer.id != 'divinedPlayer') {
                  var divinedPlayerRole
                  if (divinedPlayer.role != 'werewolf') {
                    divinedPlayerRole = 'human'
                  } else {
                    divinedPlayerRole = 'werewolf'
                  }

                  var sendSeerResult = 
                    docRef.collection('resultsSeer').add({
                      from: 'GM',
                      timestamp: admin.firestore.Timestamp.now(),
                      body: `${divinedPlayer.name} is ${divinedPlayerRole}.`,
                      gameName: 'GM',
                      avatar: '',
                    })
                  promises2.push(sendSeerResult)
                }

                if (mostVotedPlayer.id != 'mostVotedPlayer') {
                  var mostVotedPlayerRole
                  if (mostVotedPlayer.role != 'werewolf') {
                    mostVotedPlayerRole = 'human'
                  } else {
                    mostVotedPlayerRole = 'werewolf'
                  }

                  var sendMediumResult = 
                    docRef.collection('resultsMedium').add({
                      from: 'GM',
                      timestamp: admin.firestore.Timestamp.now(),
                      body: `${mostVotedPlayer.name} is ${mostVotedPlayerRole}.`,
                      gameName: 'GM',
                      avatar: '',
                    })
                  promises2.push(sendMediumResult)
                }
              } else {
                // End this game
                hasGameEnded = true

                if (countsWerewolf > 0) {
                  doesVillageWin = false
                  daytimeMessage += 'Werewolves killed all villagers.. \n'
                } else {
                  daytimeMessage += 'All werewolves were executed! Village wins! \n'
                }

                daytimeMessage += revealRoles(playerRoles)

                promises2.push(endGame(docRef))
                promises2.push(sendDaytimeMessage(docRef, daytimeMessage))
                promises2.push(updateRecords(doesVillageWin, playerRoles))
              }              
            }

            Promise.all(promises2).then(() => {
              res.send("It's daytime.")
            })
          })
        })
      })
    })
})

exports.deleteExpiredRooms = functions.pubsub.schedule('every wednesday 00:00').onRun((context) => {
  var db = admin.firestore()

  db.collection('rooms').get()
    .then((querySnapShot) => {
      return Promise.all(querySnapShot.docs.map((doc) => {
        // Delete rooms either 1 week passed since it was either created or finished
        var status = doc.data().status
        var createdAt = doc.data().timestamp.toDate()
        var currentDate = Date.now()
        var difference = currentDate - createdAt

        if (difference > 604800000 && status != 'ongoing') {
          doc.ref.delete()

          doc.ref.collection('players').get()
            .then((querySnapShot) => {
              Promise.all(querySnapShot.docs.map((playerDoc) => {
                playerDoc.ref.delete()
              }))
            })

          doc.ref.collection('messages').get()
            .then((querySnapShot) => {
              Promise.all(querySnapShot.docs.map((messageDoc) => {
                messageDoc.ref.delete()
              }))
            })
        }
      }))
    })
})

function addNightTask(roomId, dayLength) {
  const client = new tasks.CloudTasksClient()

  const projectId = functions.config().werewolf.id
  const queue = 'night'
  const location = functions.config().werewolf.location

  const parent = client.queuePath(projectId, location, queue)

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

  return client.createTask(request)
}

function addDaytimeTask(roomId, dayLength, nightLength) {
  const client = new tasks.CloudTasksClient()

  const projectId = functions.config().werewolf.id
  const queue = 'daytime'
  const location = functions.config().werewolf.location

  const parent = client.queuePath(projectId, location, queue)

  const url = 'https://' + location + '-' + projectId + '.cloudfunctions.net/inDaytime?roomId=' + roomId + '&dayLength=' + dayLength + '&nightLength=' + nightLength

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

function killPlayer(docRef, uid) {
  var promise = 
    docRef.collection('players').doc(uid).update({
      isAlive: false,
    })
  return promise
}

function sendDaytimeMessage(docRef, daytimeMessage) {
  var promise = 
    docRef.collection('messages').add({
      from: 'GM',
      timestamp: admin.firestore.Timestamp.now(),
      body: daytimeMessage,
      gameName: 'GM',
      avatar: '', 
      isFromGrave: false,                   
    })
  return promise
}

function endGame(docRef) {
  var promise = 
    docRef.update({
      status: 'closed',
      isNight: false,
    })
  return promise
}

function revealRoles(playerRoles) {
  var text = ''
  for (var i = 0; i < playerRoles.length; i++) {
    text += `${playerRoles[i].name} is ${playerRoles[i].role}.\n`
  }
  return text
}

function updateRecords(doesVillageWin, playerRoles) {
  var db = admin.firestore()
  var docRef = db.collection('users')
  var promises = []

  for (var i = 0; i < playerRoles.length; i++) {
    var role = playerRoles[i].role
    var userRef = docRef.doc(playerRoles[i].id)

    if (doesVillageWin) {
      if (role == 'villager') {
        var promise = 
          userRef.update({
            villagerWin: admin.firestore.FieldValue.increment(1),
          })
      } else if (role == 'seer') {
        var promise = 
          userRef.update({
            seerWin: admin.firestore.FieldValue.increment(1),
          })
      } else if (role == 'medium') {
        var promise = 
          userRef.update({
            mediumWin: admin.firestore.FieldValue.increment(1),
          })
      } else if (role == 'knight') {
        var promise = 
          userRef.update({
            knightWin: admin.firestore.FieldValue.increment(1),
          })
      } else if (role == 'werewolf') {
        var promise = 
          userRef.update({
            werewolfLose: admin.firestore.FieldValue.increment(1),
          })
      } else if (role == 'minion') {
        var promise = 
          userRef.update({
            minionLose: admin.firestore.FieldValue.increment(1),
          })
      }
    } else {
      if (role == 'villager') {
        var promise = 
          userRef.update({
            villagerLose: admin.firestore.FieldValue.increment(1),
          })
      } else if (role == 'seer') {
        var promise = 
          userRef.update({
            seerLose: admin.firestore.FieldValue.increment(1),
          })
      } else if (role == 'medium') {
        var promise = 
          userRef.update({
            mediumLose: admin.firestore.FieldValue.increment(1),
          })
      } else if (role == 'knight') {
        var promise = 
          userRef.update({
            knightLose: admin.firestore.FieldValue.increment(1),
          })
      } else if (role == 'werewolf') {
        var promise = 
          userRef.update({
            werewolfWin: admin.firestore.FieldValue.increment(1),
          })
      } else if (role == 'minion') {
        var promise = 
          userRef.update({
            minionWin: admin.firestore.FieldValue.increment(1),
          })
      }   
    }
    promises.push(promise)
  }

  return Promise.all(promises)
}
