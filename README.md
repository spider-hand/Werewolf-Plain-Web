# Werewolf Plain

![logo](../master/public/images/icons/android-icon-192x192.png)

https://werewolfplain.com/  

Werewolf Plain is a simple and easy to use onine werewolf game server. 

## Download
### Android
[![play_store_badge](../master/public/images/others/google-play-badge.png)](https://play.google.com/store/apps/details?id=com.spiderhand.werewolf_plain)

## Build Setup
```
# clone this repogitory
git clone https://github.com/spider-hand/Werewolf-Plain

# go to the project directory
cd werewolf

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

## Basic Rules
There are villager team and werewolf team in this game and the village wins if they can execute all werewolves. The werewolves win when the number of werewolves is equal or greater than the number of players who belong to the villager team. A player will be executed each day and the goal of the villagers is to look for werewolves and execute all of them. Werewolves can kill a villager each day and their goal is to kill enough villagers. 

## Features
### Roles
Currently villager, werewolf, seer, medium, knight and minion are supported.  

#### :man_farmer: Villager
Villager doesn't have any abilities.

#### :wolf: Werewolf
Werewolf can choose a player each day and the most selected player will be killed at night. Wereowolves can chat and communicate with other werewolves even at night.  

#### :mage_woman: Seer
Seer can choose a player each day and uncover whether the player is werewolf or not.  

#### :mage_man: Medium
Medium can see whether the player executed last night is wereowlf or not.  

#### :guard: Knight
Knight can choose one player each day and protect the player. The player cannot be killed by werewolves.  

#### :bust_in_silhouette: Minion
Minion belongs to werewolf team but is seen as human. Minion wins when werewolf team wins. Minion doesn't have any abilities and can't see which players are werewolves. Werewolves also can't see which player is minion.  

### :globe_with_meridians: Internationalization
Currently supports English, Japanese, Spanish and Portuguese. Please contact me if you could help making a translation!

### PWA
You can install this web app from Chrome (for Android) or Safari (for iOS) and use this like mobile app. 

## Implementation
- Vue.js
- Firebase (Authentication, Firestore, Storage and Cloud Functions)
- Google Cloud Platform (Cloud Tasks)

## Contribution
Logo by [Lee Mette](http://thenounproject.com/leemette) from [The Noun Project](http://thenounproject.com)  
Icon by [Gregor Cresnar](http://thenounproject.com/grega.cresnar) from [The Noun Project](http://thenounproject.com)  
Translation (Spanish) by Alejandra Sandoval  
Translation (Portuguese) by Alex Gimenez  

## Contact
Feel free to give me feedback.  

[Email](mailto:creative.spider.hand@gmail.com)  
[Discord](https://discord.gg/Vrtx7fW)  
