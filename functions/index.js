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
  var dayLength = req.query.dayLength
  var nightLength = req.query.nightLength
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
  var daytimeMessage = ''

  docRef.collection('players').get()
    .then((querySnapShot) => {
      Promise.all(querySnapShot.docs.map((doc) => {
        // Save the name and the player's role so it can be revealed when the game ends
        playerRoles.push({
          name: doc.data().name,
          role: doc.data().role,
        })

        if (doc.data().isAlive) {
          var votedPlayer = doc.data().votedPlayer
          var playerRole = doc.data().role

          if (playerRole != 'wolf') {
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
                countsBite[bittenPlayer.id] = countsBite[bittenPlayer.id] + 1
              }

              if (countsBite[bittenPlayer.id] > compareBite) {
                compareBite = countsBite[bittenPlayer.id]
                mostBittenPlayer = bittenPlayer
              }
            }
          }

          if (votedPlayer != null) {
            if (countsVote[votedPlayer.id] == undefined) {
              countsVote[votedPlayer.id] = 1
            } else {
              countsVote[votedPlayer.id] = countsVote[votedPlayer.id] + 1
            }

            if (countsVote[votedPlayer.id] > compareVote) {
              compareVote = countsVote[votedPlayer.id]
              mostVotedPlayer = votedPlayer
            }
          } else {
            // Kill players who didn't vote
            killPlayer(docRef, doc.id)
            daytimeMessage += `${doc.data().name} committed suicide.. `

            if (playerRole != 'wolf') {
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

          daytimeMessage += `${mostVotedPlayer.name} was executed. `
        } else {
          hasGameEnded = true
          daytimeMessage += checkWhichSideWin(countsWerewolf)
          daytimeMessage += revealRoles(playerRoles)

          promises0.push(endGame(docRef))
          promises0.push(sendDaytimeMessage(docRef, daytimeMessage))
        }

        Promise.all(promises0).then(() => {
          if (!hasGameEnded) {
            if (mostVotedPlayer.role != 'wolf') {
              countsVillager -= 1
            } else {
              countsWerewolf -= 1
            }

            if (countsWerewolf > 0 && countsVillager > countsWerewolf) {
              // Kill the most bitten player if the player isn't protected by knight
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
              daytimeMessage += checkWhichSideWin(countsWerewolf)
              daytimeMessage += revealRoles(playerRoles)

              promises1.push(endGame(docRef))
              promises1.push(sendDaytimeMessage(docRef, daytimeMessage))
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
                  if (divinedPlayer.role != 'wolf') {
                    divinedPlayerRole = 'human'
                  } else {
                    divinedPlayerRole = 'wolf'
                  }

                  var sendSeerResult = 
                    docRef.collection('resultsSeer').add({
                      from: 'host',
                      timestamp: admin.firestore.Timestamp.now(),
                      body: `${divinedPlayer.name} is ${divinedPlayerRole}.`,
                      gameName: '',
                      avatar: '',
                    })
                  promises2.push(sendSeerResult)
                }

                if (mostVotedPlayer.id != 'mostVotedPlayer') {
                  var mostVotedPlayerRole
                  if (mostVotedPlayer.role != 'wolf') {
                    mostVotedPlayerRole = 'human'
                  } else {
                    mostVotedPlayerRole = 'wolf'
                  }

                  var sendMediumResult = 
                    docRef.collection('resultsMedium').add({
                      from: 'host',
                      timestamp: admin.firestore.Timestamp.now(),
                      body: `${mostVotedPlayer.name} is ${mostVotedPlayerRole}.`,
                      gameName: '',
                      avatar: '',
                    })
                  promises2.push(sendMediumResult)
                }
              } else {
                // End this game
                // TODO: Update the player's record when ending the game
                // TODO: Reveal all player's roles when ending the game
                hasGameEnded = true
                daytimeMessage += checkWhichSideWin(countsWerewolf)
                daytimeMessage += revealRoles(playerRoles)

                promises2.push(endGame(docRef))
                promises2.push(sendDaytimeMessage(docRef, daytimeMessage))
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
      from: 'host',
      timestamp: admin.firestore.Timestamp.now(),
      body: daytimeMessage,
      gameName: '',
      avatar: '',                    
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

function checkWhichSideWin(countsWerewolf) {
  if (countsWerewolf == 0) {
    return 'All werewolves were executed! Village wins!\n'
  } else {
    return 'Werewolves killed all villagers..\n'
  }  
}

function revealRoles(playerRoles) {
  var text = ''
  for (var i = 0; i < playerRoles.length; i++) {
    text += `${playerRoles[i].name} is ${playerRoles[i].role}.\n`
  }
  return text
}
