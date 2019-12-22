const functions = require('firebase-functions')

const admin = require('firebase-admin')
admin.initializeApp()

const tasks = require('@google-cloud/tasks')

exports.addTasks = functions.https.onCall((data, context) => {
  const client = new tasks.CloudTasksClient()

  const projectId = functions.config().werewolf.id
  const queueNight = 'night'
  const queueDaytime = 'daytime'
  const location = functions.config().werewolf.location

  const parentNight = client.queuePath(projectId, location, queueNight)
  const parentDaytime = client.queuePath(projectId, location, queueDaytime)

  const roomId = data.roomId
  const dayLength = data.dayLength
  const nightLength = data.nightLength
  const urlNight = 'https://' + location + '-' + projectId + '.cloudfunctions.net/atNight?roomId=' + roomId
  const urlDaytime = 'https://' + location + '-' + projectId + '.cloudfunctions.net/inDaytime?roomId=' + roomId

  const taskAtNight = {
    httpRequest: {
      httpMethod: 'POST',
      url: urlNight,
    },
    scheduleTime: {
      seconds: dayLength * 60 + Date.now() / 1000,
    },    
  }

  const taskInDaytime = {
    httpRequest: {
      httpMethod: 'POST',
      url: urlDaytime,
    },
    scheduleTime: {
      seconds: (dayLength + nightLength) * 60 + Date.now() / 1000,
    },     
  }

  const requestAtNight = {
    parent: parentNight,
    task: taskAtNight,
  }

  const requestInDaytime = {
    parent: parentDaytime,
    task: taskInDaytime,
  }

  const promises = []
  const createNightTask = client.createTask(requestAtNight)
  const createDaytimeTask = client.createTask(requestInDaytime)
  promises.push(createNightTask)
  promises.push(createDaytimeTask)

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
  var promises0 = []
  var promises1 = []
  var promises2 = []
  var hasGameEnded = false
  var daytimeMessage = ''

  docRef.collection('players').get()
    .then((querySnapShot) => {
      Promise.all(querySnapShot.docs.map((doc) => {
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
            docRef.collection('players').doc(doc.id).update({
              isAlive: false,
            })
            daytimeMessage += `${doc.data().name} committed suicide.. `

            if (playerRole != 'wolf') {
              countsVillager -= 1
            } else {
              countsWerewolf -= 1
            }
          }
        }
      }))
      .then(() => {
        // Execute the most voted player
        if (mostVotedPlayer.id != 'mostVotedPlayer' && countsWerewolf > 0 && countsVillager > countsWerewolf) {
          var executeMostVotedPlayer = docRef.collection('players').doc(mostVotedPlayer.id).update({ isAlive: false, })
          promises0.push(executeMostVotedPlayer)
        } else {
          hasGameEnded = true

          var endGame = 
            docRef.update({
              status: 'closed',
              isNight: false,
            })
          promises0.push(endGame)
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
                var killMostBittenPlayer = docRef.collection('players').doc(mostBittenPlayer.id).update({ isAlive: false, })
                promises1.push(killMostBittenPlayer)

                countsVillager -= 1
              }
            } else {
              // End this game
              hasGameEnded = true

              var endGame = 
                docRef.update({ 
                  status: 'closed',
                  isNight: false, 
                })
              promises1.push(endGame)
            }
          }

          Promise.all(promises1).then(() => {
            if (!hasGameEnded) {
              // Check if the number of villagers are greater than the number of wolves
              // TODO: Add the next day's tasks if the game continues
              if (countsVillager > countsWerewolf) {

                if (mostVotedPlayer.id != 'mostVotedPlayer') {
                  if (mostBittenPlayer.id != 'mostBittenPlayer') {
                    daytimeMessage += `It's daytime. ${mostVotedPlayer.name} was executed. ${mostBittenPlayer.name} was killed. `
                  } else {
                    daytimeMessage += `It's daytime. ${mostVotedPlayer.name} was executed. There wasn't a victim last night. `
                  }
                } else {
                  daytimeMessage += `It's daytime. There wasn't a victim last night. `
                }

                var daytimeComes = docRef.update({ isNight: false, })
                var sendDaytimeMessage = 
                  docRef.collection('messages').add({
                    from: 'host',
                    timestamp: admin.firestore.Timestamp.now(),
                    body: daytimeMessage,
                    gameName: '',
                    avatar: '',
                  })

                promises2.push(daytimeComes)
                promises2.push(sendDaytimeMessage)

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
                hasGameEnded = true

                var endGame = 
                  docRef.update({ 
                    status: 'closed',
                    isNight: false, 
                  })
                promises2.push(endGame)
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