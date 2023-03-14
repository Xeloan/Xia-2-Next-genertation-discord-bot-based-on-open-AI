# Description
This is next generation of Xia, which is a huge update so I make it a new repository. This version of Xia is an example of a humanlike AI based on open AI, whose role now is the girlfriend of Xeloan(Just an example, please don't mind it). Xia can have fluent a humanlike chat with you and also have a long-term memory of key information. What's more, she can draw a picture for you based on your descrition(No using command, just ask her to draw a picture for you)

This is an old version of Xia, you can view it in my previous repository, just a common discord bot.

https://github.com/Xeloan/A-discord-bot-based-on-Open-Ai


!!!You can get the premade client in the releases.

# Recent updates
V2.0002: small bug fixed(my fault), which made Xia behave not very humanlike.


# Command list
/prompt : send the prompt of current chat

/clear: clear the chat prompt

/save: save the memory in the folder memoryBackup

/log: send the log of chat

/test: test whether Open AI API works alright

/restart: restart the bot(force to restart)

/D <Description>: create an image using DALL-E based on the description by hand. (You needn't use this since you can tell her to draw for you directly)
  
/cm clear current memory(Carefully use it please)

# Examples
![Screenshot_2023-03-06_203410](https://user-images.githubusercontent.com/105624127/224680701-1746a4c6-689e-4e0c-86f2-47c4fe90a185.png)
![Screenshot_2023-03-06_203442](https://user-images.githubusercontent.com/105624127/224680759-a769efda-0c9f-4a86-abe1-f8530a3f986b.png)
![Screenshot_2023-03-06_203520](https://user-images.githubusercontent.com/105624127/224680790-366a351f-9be6-4602-9bd2-f1c315aac3c7.png)
![Screenshot_2023-03-06_203637](https://user-images.githubusercontent.com/105624127/224680823-b2472855-879c-4360-beef-690e1adfc6f5.png)


# Set up
After downloading and decompressing the Xia Client in the releases and installing nodejs on your computer
First build a bot on discord:  (I just partly copy that written by Kav-K)
- Create a new Bot on Discord Developer Portal: https://discord.com/developers/applications
    - Applications -> New Application
- Generate Token of the bot
    - Select App (Bot) -> Bot -> Reset Token
- Toogle PRESENCE INTENT:
    - Select App (Bot) -> Bot -> PRESENCE INTENT, SERVER MEMBERS INTENT, MESSAGES INTENT, (basically turn on all intents)
- Add Bot the the server.
    - Select App (Bot) -> OAuth2 -> URL Generator -> Select Scope: Bot
    - Bot Permissions will appear, select the administrator permissions
    - Copy the link generated below and paste it on the browser
    - On add to server select the desired server to add the bot
Next get the ID of the channel you've added the bot in: you can just open the channel and check the link (like https://discord.com/channels/974519864045756446/1047566067888820274 the 1047566067888820274 is the channel ID)
Then generate an Open AI Api key: https://beta.openai.com/account/api-keys and get your organization ID in https://platform.openai.com/account/org-settings
Finally paste the token of the bot, Open AI Api, organization ID and the channel ID into the .env in the file you've downloaded.
Open the Xia Client.exe(not the xxx.js), you will see login in the log and the bot send "Channel granted" in your channel(remember just one channel).


# Last thing
The Xia_Client.exe is just the launcher of the js file and auto restart it when error appears (like 404, 429, etc.)

chatcontent.json stores the current chat prompt. If the bot suddenly stops and is turned on again, the chat prompt will be automatically restored.

memIndex.json stores the memory

error.json stores just a flag of whether the bot is stopped by an error
  
The image generated will also be stored in the DALLE_img folder
  
The log will also be stored in the logs folder
  

# Limitions
The bot still has some limitions. It recognizes you as Xeloan. For drawing without command, you should first ask Xia to draw one by saying something like "Help me draw a picture please". Then you can describe the picture. When you think it's time to start to draw, send something like "start to draw please", "start", etc. Then Xia will draw a picture for you. Chances are that the long-term memory might not work properly(but very little).
