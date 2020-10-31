import * as functions from 'firebase-functions'
import * as admin from 'firebase-admin'
import * as tasks from '@google-cloud/tasks'

import { Count, Player, Room } from './types/index'

admin.initializeApp()

exports.addTasks = functions.https.onCall((data, context) => {
  const promises: Promise<void>[] = []
  const roomId: string = data.roomId
  const dayLength: number = data.dayLength
  const nightLength: number = data.nightLength

  promises.push(addNightTask(roomId, dayLength))
  promises.push(addDaytimeTask(roomId, dayLength, nightLength))

  return Promise.all(promises)
})

function addNightTask(roomId: string, dayLength: number): Promise<any> {
  const client = new tasks.CloudTasksClient()

  const projectId = functions.config().werewolf.id
  const queue = 'night'
  const location = functions.config().werewolf.location
  const parent = client.queuePath(projectId, location, queue)
  const url = 'https://' + location + '-' + projectId + '.cloudfunctions.net/executeNightTask?roomId=' + roomId

  const task: tasks.protos.google.cloud.tasks.v2.ITask = {
    httpRequest: {
      httpMethod: 'POST',
      url: url,
    },
    scheduleTime: {
      seconds: dayLength * 60 + Date.now() / 1000,
    },
  }

  const request: tasks.protos.google.cloud.tasks.v2.ICreateTaskRequest = {
    parent: parent,
    task: task,
  }

  return client.createTask(request)
}

function addDaytimeTask(roomId: string, dayLength: number, nightLength: number): Promise<any> {
  const client = new tasks.CloudTasksClient()

  const projectId = functions.config().werewolf.id
  const queue = 'daytime'
  const location = functions.config().werewolf.location
  const parent = client.queuePath(projectId, location, queue)
  const url = 'https://' + location + '-' + projectId + '.cloudfunctions.net/executeDaytimeTask?roomId=' + roomId + '&dayLength=' + dayLength + '&nightLength=' + nightLength

  const task: tasks.protos.google.cloud.tasks.v2.ITask = {
    httpRequest: {
      httpMethod: 'POST',
      url: url,
    },
    scheduleTime: {
      seconds: (dayLength + nightLength) * 60 + Date.now() / 1000,
    }, 
  }

  const request: tasks.protos.google.cloud.tasks.v2.ICreateTaskRequest = {
    parent: parent,
    task: task,
  }

  return client.createTask(request)  
}

exports.executeNightTask = functions.https.onRequest((req, res) => {
  // Execute tasks when turning into night
  const db = admin.firestore()
  const roomId = req.query.roomId
  const docRef = db.collection('rooms').doc(roomId as string)

  docRef.update({
    isNight: true,
  })
  .then(() => {
    docRef.collection('messages').add({
      from: 'GM',
      timestamp: admin.firestore.Timestamp.now(),
      body: "It's night. Villagers are not allowed to chat. Make sure doing actions before daytime comes.", 
      gameName: 'GM',
      avatar: null,
      isFromGrave: false,
    })
    .then((messageRef) => {
      res.send("It's night.")
    })
    .catch((err) => {
      functions.logger.error(err)
    })
  })
  .catch((err) => {
    functions.logger.error(err)
  })
})

exports.executeDaytimeTask = functions.https.onRequest((req, res) => {
  // Execute tasks when turning into daytime
  const db = admin.firestore()
  const roomId = req.query.roomId as string
  const dayLength = parseInt(req.query.dayLength as string)
  const nightLength = parseInt(req.query.nightLength as string)
  const docRef = db.collection('rooms').doc(roomId)

  let countsVillager = 0
  let countsWerewolf = 0

  const countsVote: { [uid: string]: Count } = {} 
  const countsBite: { [uid: string]: number } = {}
  let compareVote = 0
  let compareBite = 0
  let mostVotedPlayer: Player | null = null
  let mostBittenPlayer: Player | null = null
  let protectedPlayer: Player | null = null
  let divinedPlayer: Player | null = null
  
  const players: Player[] = []
  const suicides: Player[] = []
  
  let hasGameEnded = false
  let daytimeMessage = ''

  const promises: Promise<FirebaseFirestore.WriteResult | FirebaseFirestore.DocumentReference | void>[] = []
  const promises0: Promise<FirebaseFirestore.WriteResult | FirebaseFirestore.DocumentReference | void>[] = []
  const promises1: Promise<FirebaseFirestore.WriteResult | FirebaseFirestore.DocumentReference | void>[] = []
  const promises2: Promise<FirebaseFirestore.WriteResult | FirebaseFirestore.DocumentReference | void>[] = []
  const promises3: Promise<FirebaseFirestore.WriteResult | FirebaseFirestore.DocumentData | FirebaseFirestore.DocumentReference | void>[] = []

  docRef.collection('players').get()
    .then((querySnapshot) => {
      Promise.all(querySnapshot.docs.map((doc) => {
        const player = doc.data() as Player
        // Save the player's name and role so they can be revealed when the game ends
        players.push(player)

        if (player.isAlive) {
          if (player.role !== 'werewolf') {
            countsVillager += 1

            if (player.role === 'knight' && player.protectedPlayer !== null) {
              protectedPlayer = player.protectedPlayer
            }

            else if (player.role === 'seer' && player.divinedPlayer !== null) {
              divinedPlayer = player.divinedPlayer
            }
          } else {
            // Decide who will be killed by werewolves
            const bittenPlayer = player.bittenPlayer
            countsWerewolf += 1

            if (bittenPlayer !== null) {
              if (countsBite[bittenPlayer.uid] === undefined) {
                countsBite[bittenPlayer.uid] = 1
              } else {
                countsBite[bittenPlayer.uid] += 1
              }

              if (countsBite[bittenPlayer.uid] > compareBite) {
                compareBite = countsBite[bittenPlayer.uid]
                mostBittenPlayer = bittenPlayer
              }
            }
          }

          if (player.votedPlayer !== null) {
            // Decide who will be executed
            if (countsVote[player.votedPlayer.uid] === undefined) {
              countsVote[player.votedPlayer.uid] = { count: 1, name: player.votedPlayer.name }
            } else {
              countsVote[player.votedPlayer.uid].count += 1
            }

            if (countsVote[player.votedPlayer.uid].count > compareVote) {
              compareVote = countsVote[player.votedPlayer.uid].count
              mostVotedPlayer = player.votedPlayer
            }
          } else {
            // Players who didn't vote will die
            suicides.push(player)
          }

          // Reset players status every night
          promises.push(resetPlayerStatus(docRef, doc))
        }

        return Promise.all(promises)
      }))
      .then(() => {
        // Players who didn't vote will die
        for (let suicide of suicides) {
          // If the player who didn't vote is the most selected player, the player will be executed
          if (suicide.uid !== mostVotedPlayer?.uid) {
            promises0.push(killPlayer(docRef, suicide.uid))
            daytimeMessage += `${suicide.name} commited suicide..\n`

            if (suicide.role !== 'werewolf') {
              countsVillager -= 1
            } else {
              countsWerewolf -= 1
            }
          }
        }

        return Promise.all(promises0)
      })
      .then(() => {
        // Execute the most voted player
        if (mostVotedPlayer 
            && countsWerewolf > 0 
            && countsVillager > countsWerewolf) {
          promises1.push(killPlayer(docRef, mostVotedPlayer.uid))

          // Show how many votes each player got
          for (let uid in countsVote) {
            daytimeMessage += `${countsVote[uid].name} got ${countsVote[uid].count} votes.\n`
          }

          // Show the most voted player
          daytimeMessage += `${mostVotedPlayer.name} was executed.`

          if (mostVotedPlayer.role !== 'werewolf') {
            countsVillager -= 1
          } else {
            countsWerewolf -= 1
          }
        } else {
          hasGameEnded = true

          if (countsWerewolf > 0) {
            daytimeMessage += 'No villagers left.. Werewolves win..\n\n'
          } else {
            daytimeMessage += 'All werewolves has been executed! Villagers win!\n\n'
          }

          promises1.push(endGame(docRef))
          promises1.push(sendDaytimeMessage(docRef, daytimeMessage))
        }

        return Promise.all(promises1)        
      })
      .then(() => {
        if (!hasGameEnded) {
          if (countsWerewolf > 0 && countsVillager > countsWerewolf) {
            // Kill the player selected by werewolves if the player isn't protected
            if (mostBittenPlayer 
                && protectedPlayer?.uid !== mostBittenPlayer?.uid 
                && mostVotedPlayer?.uid !== mostBittenPlayer?.uid) {
              promises2.push(killPlayer(docRef, mostBittenPlayer.uid))

              daytimeMessage += `${mostBittenPlayer?.name} was killed.\n`
              countsVillager -= 1
            } else {
              // No one will be killed either when the player is protected or
              // the player is already executed or all werewolves didn't select a player
              // or werewolves selected a player who didn't vote and already got suicide
              daytimeMessage += 'No one was killed last night.\n'
            }
          } else {
            hasGameEnded = true

            if (countsWerewolf > 0) {
              daytimeMessage += 'No villagers left.. Werewolves win..\n\n'
            } else {
              daytimeMessage += 'All werewolves has been executed! Villagers win!\n\n'
            }

            promises2.push(endGame(docRef))
            promises2.push(sendDaytimeMessage(docRef, daytimeMessage))
          }
        }

        return Promise.all(promises2)       
      })
      .then(() => {
        if (!hasGameEnded) {
          // Check if the number of villagers is still greater than the number of werewolves
          if (countsVillager > countsWerewolf) {
            daytimeMessage += "It's daytime. Start a discussion."
            const daytimeComes = docRef.update({ isNight: false })

            promises3.push(daytimeComes)
            promises3.push(sendDaytimeMessage(docRef, daytimeMessage))

            // Add the tasks for the next day
            promises3.push(addNightTask(roomId, dayLength))
            promises3.push(addDaytimeTask(roomId, dayLength, nightLength))

            // Identify the divined player's role
            if (divinedPlayer?.uid) {
               promises3.push(sendSeerResult(docRef, divinedPlayer))
            }

            // Identify the most voted player's role
            if (mostVotedPlayer?.uid) {
              promises3.push(sendMediumResult(docRef, mostVotedPlayer))
            }
          }
        } else {
          hasGameEnded = true

          if (countsWerewolf > 0) {
            daytimeMessage += 'No villagers left.. Werewolves win..\n\n'
          } else {
            daytimeMessage += 'All werewolves has been executed! Villagers win!\n\n'
          }

          daytimeMessage += revealRoles(players)

          promises3.push(endGame(docRef))
          promises3.push(sendDaytimeMessage(docRef, daytimeMessage))
        } 

        return Promise.all(promises3)       
      })
      .then(() => {
        res.send("It's daytime.")
      })
      .catch((err) => {
        functions.logger.error(err)
      })
    })
    .catch((err) => {
      functions.logger.error(err)
    })
})

function resetPlayerStatus(roomRef: FirebaseFirestore.DocumentReference, playerDoc: FirebaseFirestore.DocumentData): Promise<FirebaseFirestore.WriteResult | void> {
  const promise = 
    roomRef.collection('players').doc(playerDoc.id).update({
        votedPlayer: null,
        bittenPlayer: null,
        protectedPlayer: null,
        divinedPlayer: null,
      })
      .catch((err) => {
        functions.logger.error(err)
      })

  return promise
}

function killPlayer(roomRef: FirebaseFirestore.DocumentReference, uid: string): Promise<FirebaseFirestore.WriteResult | void> {
  const promise = 
    roomRef.collection('players').doc(uid).update({
        isAlive: false,
      })
      .catch((err) => {
        functions.logger.error(err)
      })
  return promise
}

function sendDaytimeMessage(roomRef: FirebaseFirestore.DocumentReference, daytimeMessage: string): Promise<FirebaseFirestore.DocumentReference | void> {
  const promise = 
    roomRef.collection('messages').add({
        from: 'GM',
        timestamp: admin.firestore.Timestamp.now(),
        body: daytimeMessage,
        gameName: 'GM',
        avatar: null,
        isFromGrave: false,
      })
      .catch((err) => {
        functions.logger.error(err)
      })

  return promise
}

function sendSeerResult(roomRef: FirebaseFirestore.DocumentReference, divinedPlayer: Player): Promise<FirebaseFirestore.DocumentData | void> {
  const divinedPlayerRole = divinedPlayer.role !== 'werewolf' ? 'human' : 'werewolf'

  const promise = 
    roomRef.collection('resultsSeer').add({
        from: 'GM',
        timestamp: admin.firestore.Timestamp.now(),
        body: `${divinedPlayer.name} is ${divinedPlayerRole}.`,
        gameName: 'GM',
        avatar: null,
        isFromGrave: false,                     
      })
      .catch((err) => {
        functions.logger.error(err)
      })

   return promise 
}

function sendMediumResult(roomRef: FirebaseFirestore.DocumentReference, mostVotedPlayer: Player): Promise<FirebaseFirestore.DocumentData | void> {
  const mostVotedPlayerRole = mostVotedPlayer.role !== 'werewolf' ? 'human' : 'werewolf'

  const promise = 
    roomRef.collection('resultsMedium').add({
        from: 'GM',
        timestamp: admin.firestore.Timestamp.now(),
        body: `${mostVotedPlayer.name} is ${mostVotedPlayerRole}.`,
        gameName: 'GM',
        avatar: null,
        isFromGrave: false,
      })
      .catch((err) => {
        functions.logger.error(err)
      })

   return promise 
}

function revealRoles(players: Player[]): string {
  let text = ''
  players.forEach((player, index) => {
    text += `${players[index].name} is ${players[index].role}.\n`
  })
  return text
}

function endGame(roomRef: FirebaseFirestore.DocumentReference): Promise<FirebaseFirestore.WriteResult | void> {
  const promise =
    roomRef.update({
      status: 'closed',
      isNight: false,
    })
    .catch((err) => {
      functions.logger.error(err)
    })
  return promise
}

exports.deleteExpiredRooms = functions.pubsub.schedule('every wednesday 00:00').onRun((context) => {
  const db = admin.firestore()

  return db.collection('rooms').get()
    .then((querySnapShot) => {
      querySnapShot.forEach((doc) => {
      	const roomDoc = doc.data() as Room

        const status = roomDoc.status
        const createdAt = (doc.data().timestamp as FirebaseFirestore.Timestamp).toMillis()
        const currentDate = Date.now()
        const difference = currentDate - createdAt

        if (difference > 604800000 && status !== 'ongoing') {
          doc.ref.delete().catch((err) => { functions.logger.error(err) })

          doc.ref.collection('players').get()
            .then((playerSnapShot) => {
              playerSnapShot.forEach((playerDoc) => {
                playerDoc.ref.delete().catch((err) => { functions.logger.error(err) })
              })
            })
            .catch((err) => {
              functions.logger.error(err)
            })

          doc.ref.collection('messages').get()
            .then((messageSnapShot) => {
              messageSnapShot.forEach((messageDoc) => {
                messageDoc.ref.delete().catch((err) => { functions.logger.error(err) })
              })
            })
            .catch((err) => {
              functions.logger.error(err)
            })
        }
      })
    })
})