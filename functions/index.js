const functions = require('firebase-functions')

const admin = require('firebase-admin')
admin.initializeApp()

const tasks = require('@google-cloud/tasks')

exports.addTasks = functions.https.onCall((data, context) => {
  const promises = []
  const roomId = data.roomId
  const nightLength = data.nightLength
  const dayLength = data.dayLength
  const language = data.language

  promises.push(addNightTask(roomId, dayLength, language))
  promises.push(addDaytimeTask(roomId, dayLength, nightLength, language))

  return Promise.all(promises)
})

exports.atNight = functions.https.onRequest((req, res) => {
  var db = admin.firestore()
  var roomId = req.query.roomId
  var language = req.query.lang
  var docRef = db.collection('rooms').doc(roomId)

  docRef.update({
    isNight: true,
  }).then(() => {
    docRef.collection('messages').add({
      from: 'GM',
      timestamp: admin.firestore.Timestamp.now(),
      body: translateNightNotification(language),
      gameName: 'GM',
      avatar: '',
      isFromGrave: false,
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
  var language = req.query.lang
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
  var suicides = []
  var promises0 = []
  var promises1 = []
  var promises2 = []
  var promises3 = []
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
            suicides.push({
              id: doc.data().id,
              name: doc.data().name,
              role: doc.data().role,
            })
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
        // Players who didn't vote will commit suicide
        for (const suicide of suicides) {
          // If players select a player who didn't vote, the player will be executed instead of killing by himself
          if (suicide.id != mostVotedPlayer.id) {
            promises0.push(killPlayer(docRef, suicide.id))
            daytimeMessage += translateSuicideMessage(suicide.name, language)

            if (suicide.role != 'werewolf') {
              countsVillager -= 1
            } else {
              countsWerewolf -= 1
            }
          }
        }

        Promise.all(promises0).then(() => {
          // Execute the most voted player
          if (mostVotedPlayer.id != 'mostVotedPlayer' && countsWerewolf > 0 && countsVillager > countsWerewolf) {
            promises1.push(killPlayer(docRef, mostVotedPlayer.id))

            // How many votes each player got?
            for (var key in countsVote) {
              daytimeMessage += translateVotingResult(countsVote[key][1], countsVote[key][0], language)
            }

            daytimeMessage += translateExecutionMessage(mostVotedPlayer.name, language)

            if (mostVotedPlayer.role != 'werewolf') {
              countsVillager -= 1
            } else {
              countsWerewolf -= 1
            }
          } else {
            hasGameEnded = true

            if (countsWerewolf > 0) {
              doesVillageWin = false
              daytimeMessage += translateWerewolvesWinMessage(language)
            } else {
              daytimeMessage += translateVillageWinMessage(language)
            }

            daytimeMessage += revealRoles(playerRoles, language)

            promises1.push(endGame(docRef))
            promises1.push(sendDaytimeMessage(docRef, daytimeMessage))
            promises1.push(updateRecords(doesVillageWin, playerRoles))
          }

          Promise.all(promises1).then(() => {
            if (!hasGameEnded) {
              if (countsWerewolf > 0 && countsVillager > countsWerewolf) {
                // Kill the most bitten player if the player isn't protected by knight
                if (protectedPlayer.id != mostBittenPlayer.id && mostVotedPlayer.id != mostBittenPlayer.id && mostBittenPlayer.id != 'mostBittenPlayer' && !suicides.includes(mostBittenPlayer.id)) {
                  promises2.push(killPlayer(docRef, mostBittenPlayer.id))

                  daytimeMessage += translateKilledPlayerMessage(mostBittenPlayer.name, language)
                  countsVillager -= 1
                } else {
                  // No one will be killed eihter when the player is protected or the player is already executed or all werewolves don't select a player to kill
                  // or werewolves select a player who didn't vote (the player was supposed to be dead)
                  daytimeMessage += translateNoVictimMessage(language)
                }
              } else {
                // End this game
                hasGameEnded = true

                if (countsWerewolf > 0) {
                  doesVillageWin = false
                  daytimeMessage += translateWerewolvesWinMessage(language)
                } else {
                  daytimeMessage += translateVillageWinMessage(language)
                }

                daytimeMessage += revealRoles(playerRoles, language)

                promises2.push(endGame(docRef))
                promises2.push(sendDaytimeMessage(docRef, daytimeMessage))
                promises2.push(updateRecords(doesVillageWin, playerRoles))
              }
            }

            Promise.all(promises2).then(() => {
              if (!hasGameEnded) {
                // Check if the number of villagers are greater than the number of wolves after werewolves bite a villager
                if (countsVillager > countsWerewolf) {
                  daytimeMessage += translateDaytimeNotification(language)
                  var daytimeComes = docRef.update({ isNight: false, })

                  promises3.push(daytimeComes)
                  promises3.push(sendDaytimeMessage(docRef, daytimeMessage))

                  // Add the tasks for the next day
                  promises3.push(addNightTask(roomId, dayLength, language))
                  promises3.push(addDaytimeTask(roomId, dayLength, nightLength, language))

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
                        body: translateRevealRoleMessage(divinedPlayer.name, divinedPlayerRole, language),
                        gameName: 'GM',
                        avatar: '',
                      })
                    promises3.push(sendSeerResult)
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
                        body: translateRevealRoleMessage(mostVotedPlayer.name, mostVotedPlayerRole, language),
                        gameName: 'GM',
                        avatar: '',
                      })
                    promises3.push(sendMediumResult)
                  }
                } else {
                  // End this game
                  hasGameEnded = true

                  if (countsWerewolf > 0) {
                    doesVillageWin = false
                    daytimeMessage += translateWerewolvesWinMessage(language)
                  } else {
                    daytimeMessage += translateVillageWinMessage(language)
                  }

                  daytimeMessage += revealRoles(playerRoles, language)

                  promises3.push(endGame(docRef))
                  promises3.push(sendDaytimeMessage(docRef, daytimeMessage))
                  promises3.push(updateRecords(doesVillageWin, playerRoles))
                }              
              }

              Promise.all(promises3).then(() => {
                res.send("It's daytime.")
              })
            })
          })
        })
      })
    })
})

exports.deleteExpiredRooms = functions.pubsub.schedule('every wednesday 00:00').onRun((context) => {
  var db = admin.firestore()

  return db.collection('rooms').get()
    .then((querySnapShot) => {
      querySnapShot.forEach((doc) => {
        // Delete rooms either 1 week passed since it was either created or finished
        var status = doc.data().status
        var createdAt = doc.data().timestamp.toDate()
        var currentDate = Date.now()
        var difference = currentDate - createdAt

        if (difference > 604800000 && status != 'ongoing') {
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

function addNightTask(roomId, dayLength, language) {
  const client = new tasks.CloudTasksClient()

  const projectId = functions.config().werewolf.id
  const queue = 'night'
  const location = functions.config().werewolf.location

  const parent = client.queuePath(projectId, location, queue)

  const url = 'https://' + location + '-' + projectId + '.cloudfunctions.net/atNight?roomId=' + roomId + '&lang=' + language
  
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

function addDaytimeTask(roomId, dayLength, nightLength, language) {
  const client = new tasks.CloudTasksClient()

  const projectId = functions.config().werewolf.id
  const queue = 'daytime'
  const location = functions.config().werewolf.location

  const parent = client.queuePath(projectId, location, queue)

  const url = 'https://' + location + '-' + projectId + '.cloudfunctions.net/inDaytime?roomId=' + roomId + '&dayLength=' + dayLength + '&nightLength=' + nightLength + '&lang=' + language

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

function revealRoles(playerRoles, language) {
  var text = ''
  for (var i = 0; i < playerRoles.length; i++) {
    text += translateRevealRoleMessage(playerRoles[i].name, playerRoles[i].role, language)
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


function translateNightNotification(language) {
  if (language == 'ja') {
    return '夜になりました。発言を禁止します。昼になる前にアクションを完了してください。'
  } else if (language == 'es') {
    return 'Es de noche. Los aldeanos no pueden discutir. Hacer acciones antes de que llegue el día.'
  } else if (language == 'pt') {
    return 'É noite. Os moradores não têm permissão para conversar. Realize ações antes do dia chegar.'
  } else {
    return "It's night. Villagers are not allowed to chat. Do actions before daytime comes."
  }
}

function translateDaytimeNotification(language) {
  if (language == 'ja') {
    return '昼になりました。議論を開始してください。'
  } else if (language == 'es') {
    return 'Es de día. Iniciar discusión.'
  } else if (language == 'pt') {
    return 'É dia. Iniciar discussão.'
  } else {
    return "It's daytime. Start discussion."
  }
}

function translateSuicideMessage(player, language) {
  if (language == 'ja') {
    return `${player}が突然死しました...\n`
  } else if (language == 'es') {
    return `${player} se suicidó..\n`
  } else if (language == 'pt') {
    return `${player} cometeu suicídio..\n`
  } else {
    return `${player} committed suicide..\n`
  }
}

function translateVotingResult(player, counts, language) {
  if (language == 'ja') {
    return `${player}は${counts}票獲得しました。\n`
  } else if (language == 'es') {
    return `${player} obtuvo ${counts} votos.\n`
  } else if (language == 'pt') {
    return `${player} obteve ${counts} votos.\n`
  } else {
    return `${player} got ${counts} votes.\n`
  }
}

function translateExecutionMessage(player, language) {
  if (language == 'ja') {
    return `${player}は処刑されました。 `
  } else if (language == 'es') {
    return `${player} fue ejecutado.`
  } else if (language == 'pt') {
    return `${player} foi executado.`
  } else {
    return `${player} was executed. `
  }
}

function translateKilledPlayerMessage(player, language) {
  if (language == 'ja') {
    return `${player}が殺された。\n`
  } else if (language == 'es') {
    return `${player} fue asesinado.\n`
  } else if (language == 'pt') {
    return `${player} foi morto.\n`
  } else {
    return `${player} was killed.\n`
  }
}

function translateNoVictimMessage(language) {
  if (language == 'ja') {
    return '昨晩犠牲者はいませんでした。\n'
  } else if (language == 'es') {
    return 'No hubo una víctima anoche.\n'
  } else if (language == 'pt') {
    return 'Não houve vítima ontem à noite.\n'
  } else {
    return 'There was not a victim last night.\n'
  }
}

function translateVillageWinMessage(language) {
  if (language == 'ja') {
    return '全ての人狼を処刑した！村の勝利！\n\n'
  } else if (language == 'es') {
    return '¡Todos los hombres lobo son ejecutados! ¡El pueblo gana!\n\n'
  } else if (language == 'pt') {
    return 'Todos os lobisomens são executados! A vila vence!'
  } else {
    return 'All werewolves are executed! Village wins!\n\n'
  }
}

function translateWerewolvesWinMessage(language) {
  if (language == 'ja') {
    return '人狼の勝利...\n\n'
  } else if (language == 'es') {
    return 'Los hombres lobo ganan..\n\n'
  } else if (language == 'pt') {
    return 'Lobisomens vencem..\n\n'
  } else {
    return 'Werewolves win..\n\n'
  }
}

function translateRevealRoleMessage(player, role, language) {
  var translatedRole
  if (role == 'villager') {
    translatedRole = translateVillager(language)
  } else if (role == 'werewolf') {
    translatedRole = translateWerewolf(language)
  } else if (role == 'seer') {
    translatedRole = translateSeer(language)
  } else if (role == 'medium') {
    translatedRole = translateMedium(language)
  } else if (role == 'knight') {
    translatedRole = translateKnight(language)
  } else if (role == 'minion') {
    translatedRole = translateMinion(language)
  } else if (role == 'human') {
    translatedRole = translateHuman(language)
  }

  if (language == 'ja') {
    return `${player}は${translatedRole}だった。\n`
  } else if (language == 'es') {
    return `${player} es ${translatedRole}.\n`
  } else if (language == 'pt') {
    return `${player} é ${translatedRole}.\n`
  } else {
    return `${player} is ${translatedRole}.\n`
  }
}

function translateVillager(language) {
  if (language == 'ja') {
    return '村人'
  } else if (language == 'es') {
    return 'aldeano'
  } else if (language == 'pt') {
    return 'camponês'
  } else {
    return 'villager'
  }
}

function translateWerewolf(language) {
  if (language == 'ja') {
    return '人狼'
  } else if (language == 'es') {
    return 'hombre lobo'
  } else if (language == 'pt') {
    return 'lobisomem'
  } else {
    return 'werewolf'
  }
}

function translateSeer(language) {
  if (language == 'ja') {
    return '占い師'
  } else if (language == 'es') {
    return 'vidente'
  } else if (language == 'pt') {
    return 'vidente'
  } else {
    return 'seer'
  }
}

function translateMedium(language) {
  if (language == 'ja') {
    return '霊能者'
  } else if (language == 'es') {
    return 'médium'
  } else if (language == 'pt') {
    return 'médium'
  } else {
    return 'medium'
  }
}

function translateKnight(language) {
  if (language == 'ja') {
    return '騎士'
  } else if (language == 'es') {
    return 'caballero'
  } else if (language == 'pt') {
    return 'cavaleiro'
  } else {
    return 'knight'
  }
}

function translateMinion(language) {
  if (language == 'ja') {
    return '狂人'
  } else if (language == 'es') {
    return 'secuaz'
  } else if (language == 'pt') {
    return 'servo'
  } else {
    return 'minion'
  }
}

function translateHuman(language) {
  if (language == 'ja') {
    return '人間'
  } else if (language == 'es') {
    return 'humano'
  } else if (language == 'pt') {
    return 'humano'
  } else {
    return 'human'
  }
}
