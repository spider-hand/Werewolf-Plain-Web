# Werewolf Red

![logo](../master/public/images/icons/android-icon-192x192.png)

https://werewolfred.com/  

Simple and easy to play online werewolf game server.

## Build Setup
```
# clone this repogitory
git clone https://github.com/spider-hand/Werewolf-Red

# go to the project directory
cd Werewolf-Red

# install dependencies
npm install

# run locally
npm run serve

# build for production
npm run build
```

Follow the official guides below to set up Firebase and Cloud Tasks.  

- [Firebase](https://firebase.google.com/docs/web/setup)
- [Cloud Tasks](https://cloud.google.com/tasks/docs/quickstart-appengine)

## Features

### Game Types and Roles
#### 5 player game
3 villagers, 1 seer, 1 werewolf

#### 9 player game
4 villagers, 1 seer, 1 knight, 2 werewolves, 1 minion

#### 11 player game
5 villagers, 1 seer, 1 medium, 1 knight, 2 werewolves, 1 minion

#### 15 player game
8 villagers, 1 seer, 1 medium, 1 knight, 3 werewolves, 1 minion

### Roles
#### :man_farmer: Villager
Villager doesn't have any abilities. They win when they kill all werewolves.

#### :wolf: Werewolf
Werewolf can choose one player each day and kill the most selected player at night. Werewwolf team wins either when they outnumber the villagers or they are the same number of villagers. They can chat using Werewolf Chat even during night and make strategies.

#### :crystal_ball: Seer
Seer can choose one player each day and uncover whether the player'role is Werewolf or not.

#### :mage_man: Medium
Medium can see whether the player executed last night is Werewolf or not.

#### :guard: Knight
Knight can choose one player each day and protect the player. The player cannot be killed by werewolves.

#### :bust_in_silhouette: Minion
Minion belongs to werewolf team but is seen as human. Minion wins when werewolf team wins. Minion doesn't have any abilities and can't see which players are werewolves. Werewolves also can't see which player is Minion. Minion's goal is to help werewolves win.

## Implementation
- Vue.js
- Firebase (Authentication, Firestore, Storage and Cloud Functions)
- Google Cloud Platform (Cloud Tasks)

## Credits
Logo by [Lee Mette](http://thenounproject.com/leemette) from [The Noun Project](http://thenounproject.com)  

## Contact
Feel free to give me feedback.  

[Email](mailto:creative.spider.hand@gmail.com)  
[Discord](https://discord.gg/cVJG96cced)  
