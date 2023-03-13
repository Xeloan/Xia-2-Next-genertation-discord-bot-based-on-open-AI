require('dotenv').config();
const { Client, GatewayIntentBits, Discord, TextChannel } = require('discord.js');
const fs = require('fs');
const moment = require('moment-timezone');
const similarity = require( 'compute-cosine-similarity' );
const natural = require('natural');
const path = require('path');
const axios = require('axios');
const {encode, decode} = require('gpt-3-encoder');
const crypto = require('crypto');
const lodash = require('lodash');
const client = new Client({ intents: [GatewayIntentBits.Guilds, GatewayIntentBits.GuildMessages, GatewayIntentBits.MessageContent,] });
const { Configuration, OpenAIApi } = require("openai");
const configuration = new Configuration({
  apiKey: process.env.OPENAI_API_KEY,
});
const openai = new OpenAIApi(configuration);

let GPTprompt = [];
let GPTmemory = [];
let GPTrecall = [];
let GPTimage = [];
let GPTimagedes = [];
let GPTimgstart = [];
let prompt = ``;
const header = "Xia is a cool girl. She is Xeloan's girlfriend. She likes coding and chemistry. Also, she likes painting.  But she is also very tsundere and cool, like a boy but still lovely sometimes. She likes Xeloan but always refuses to express her feeling directly often in an opposite way since she is a tsundere.\n";
let chatcontent = ``;
let chatbuffer = [];
let detect = false; //imgdetect
let detectcount = 0; //count↑
let desbase = ``;//img

GPTprompt.push(
  {"role": "system", "content": "Now you are the model: text-davinci-3, give the response of the prompt sent to you by the user.(in English)"},
  {},
  {},
  {"role": "system", "content": "Ok, I know Xia's memory and characteristic and will follow your instruction and fill the response of Xia in English. Also, I will only reply the words of what Xia says, only the content, without other descriptional words of Xia's attitude like cool tone. Please send me the prompt of the conversation."},
  {}
);

GPTmemory.push(
  {"role": "system", "content": "You are the language model text-davinci-003. Fill the prompt the user send you."},
  {}
);

GPTrecall.push(
  {"role": "system", "content": "You are the language model text-davinci-003. Fill the prompt the user send you."},
  {}
);

GPTimage.push(
  {"role": "system", "content": "You are the language model text-davinci-3. Follow the intruction of the user."},
  {}
);

GPTimagedes.push(
  {"role": "system", "content": "You are the language model text-davinci-003. Follow the instruction of the user."},
  {}
);

GPTimgstart.push(
  {"role": "system", "content": "You are the language model text-davinci-003. Follow the instruction of the user."},
  {}
);

chatcontent = fs.readFileSync(`./chatcontent.json`);
chatcontent = `${chatcontent}`;
prompt = `The following is the conversation between Xeloan and Xia.\n\n${chatcontent}`;
const MAX_CHATCONTENT_LENGTH = 1024;
const MAX_RECALL_LENGTH = 128;
var logFileName = ``;
var filePath = ``;
var [year, month, day, hour, minute, second]=[]
var formattedTime = ``;
let busy = false;

let arraybase = JSON.parse(fs.readFileSync(`./memIndex.json`));
let er;
fs.readFile('./error.json','utf8', (err, data) => {
	 er = data;
  });
console.log(`\n\n\n=============================   Xia-Gpt Chatbot <<<Ver 2.0001>>> By Xeloan Steve   =============================\n\n\n`);
client.on('ready', () => {
  if (er == 0){
     client.channels.cache.get(`${process.env.CHANNEL_ID}`).send("Channel granted");
    }
  if (er == 1){
     client.channels.cache.get(`${process.env.CHANNEL_ID}`).send("An error has appeared, bot restarted");
     fs.writeFileSync(`./error.json`, `0`);
    }
  axios.get('https://api.openai.com/v1/models/text-davinci-003', {
  headers: {
    'Authorization': 'Bearer ' + process.env.OPENAI_API_KEY,
    'OpenAI-Organization': process.env.ORG
  }
})
  .then(function (response) {
    client.channels.cache.get(`${process.env.CHANNEL_ID}`).send(`Api request test succeeded. Code: ${response.status}`);
  })
  .catch(function (error) {
    client.channels.cache.get(`${process.env.CHANNEL_ID}`).send(`Api request error. Code: ${error.response.status}, please check your API KEY and Organization name. Type /restart to force the bot to reboot.`);
  });
  const currentTime = new Date().toISOString();
  console.log(`[${currentTime}] Logged in as ${client.user.tag}!`);
  [year, month, day, hour, minute, second] = currentTime.match(/^(\d{4})-(\d{2})-(\d{2})T(\d{2}):(\d{2}):(\d{2})/).slice(1);
  formattedTime = `${year}_${month}_${day}_${hour}_${minute}_${second}`;
  logFileName = `${formattedTime}.log`;
  filePath = `./logs/${logFileName}`;
  fs.writeFileSync(`./logs/${logFileName}`, `[${currentTime}] Logged in as ${client.user.tag}!`+`\n`);
});

client.on("messageCreate", function (message) {

if (`${message.channel.id}` !== `${process.env.CHANNEL_ID}`){

	return;

}
   
   const currentTime = new Date().toISOString();
   console.log(`[${currentTime}] ${message.author.tag}: ${message.content}`);
   fs.appendFileSync(filePath,`[${currentTime}] ${message.author.tag}: ${message.content}`+`\n`);
   [year, month, day, hour, minute, second] = currentTime.match(/^(\d{4})-(\d{2})-(\d{2})T(\d{2}):(\d{2}):(\d{2})/).slice(1);
   formattedTime = `${year}_${month}_${day}_${hour}_${minute}_${second}`;
   const time = moment().tz('Asia/Shanghai').format('YYYY/MM/DD HH:mm:ss');
   if (message.author.bot) return;
   if (message.content.startsWith("/restart")) {
    message.reply("");
    return;
	}
   if (busy){
   message.reply(`sent too fast`);
   return;
}
   busy = true;


if (message.content.startsWith("/log")) {
     message.reply({
      files: [{
          attachment: filePath,
          name: logFileName
        }]
});
      busy = false;
	return;
}





if (message.content.startsWith("/D")) {
  (async () => {
    const text = message.content.slice(3);
    const creatingMessage = await message.reply(`Creating`);
    try { 
      const response = await openai.createImage({
        prompt: text,
        n: 1,
        size: "1024x1024",
      });
      image_url = response.data.data[0].url;

    
      const image = await axios({
        url: image_url,
        responseType: 'arraybuffer'
      });
      const randomString = crypto.randomBytes(4).toString('hex');
      const file = `${text.substring(0,5)}-${randomString}.png`;
	fs.writeFileSync(path.join('./DALLE_img', file), image.data);
	await creatingMessage.delete();
      message.reply({
        files: [{
          attachment: './DALLE_img/' + file,
          name: file
        }]
      });
    } catch (error) {
      console.error(error);
	await creatingMessage.delete();
      message.reply(`Invalid content`);
    }
     busy = false;
  })();
	return;
}
	


   if (message.content.startsWith("/clear")) {
    chatcontent = `Xeloan: Hello there.\nXia: Ah finally you come.\nXeloan: `;
    detect = false;
    detectcount = 0;
    desbase = ``;
    chatbuffer = [];
    fs.writeFileSync(`./chatcontent.json`,chatcontent);
    prompt = `The following is the conversation between Xeloan and Xia.\nCurrent time is ${time}(24h)\n\n${chatcontent}`;
    message.reply("Prompt cleared.");
    busy = false;
    return;
	}
  if (message.content.startsWith("/save")){
    let memoryPath = `./memoryBackup/${formattedTime}.json`;
    fs.writeFileSync(memoryPath,JSON.stringify(arraybase));
    client.users.cache.get(message.author.id).send({
      files: [{
        attachment: './memIndex.json',
        name: 'memIndex.json'
      }]
    }
    );
    message.reply('Memory saved.');
    busy = false;
    return;
 }

   if (message.content.startsWith("/prompt")) {
    message.reply(prompt)
    message.reply(`${encode(prompt).length}`);
    busy = false;
    return;
	}
   
   if (message.content.startsWith("/test")) {
    axios.get('https://api.openai.com/v1/models/text-davinci-003', {
    headers: {
    'Authorization': 'Bearer ' + process.env.OPENAI_API_KEY,
    'OpenAI-Organization': process.env.ORG
  }
})
  .then(function (response) {
    message.reply(`Api request test succeeded. Code: ${response.status}`);
  })
  .catch(function (error) {
    message.reply(`Api request error. Code: ${error.response.status}, please check your API KEY and Organization name. Type /restart to force the bot to reboot.`);
  });
 
   (async () => {
    try{
     let test = await openai.createCompletion({
     model: "text-ada-001",
     prompt: "test",
     temperature: 0,
     max_tokens: 1,
     top_p: 0,
     frequency_penalty: 0,
     presence_penalty: 0,
});
     message.reply(`Api usability test succeeded.`)
  
     }catch(error){message.reply(`Api unsability error. Code: ${error.response.status}, please check your account. Type /restart to force the bot to reboot.`)}  
     busy = false;
})();
    return;
	}


  if (message.content.startsWith(`/cm`)){
    arraybase = [];
    fs.writeFileSync(`./memIndex.json`,`[]`);
    message.reply(`Memory cleared.`);
    busy = false;
    return;
  }


  if (message.content.startsWith("/hint")){
    (async () => {
      console.log(arraybase);
      busy = false;
    })();
    return;
  }

  while (encode(chatcontent).length > MAX_CHATCONTENT_LENGTH) {
     
    const humanIndex = chatcontent.indexOf("Xeloan: ");
    
    const aiIndex = chatcontent.indexOf("Xia: ", humanIndex) + 3; 
    
    const nextMessageIndex = chatcontent.indexOf("Xeloan: ", aiIndex + 1);
    
    chatcontent = chatcontent.substring(0, humanIndex) + chatcontent.substring(nextMessageIndex, chatcontent.length);
  }

  
  (async () => {
    let success = false;
    message.channel.sendTyping();
    let chatinput =`Xeloan: ${message.content}\n`;
    let hintbase = [];
    let chathint = ``;
    let recall = ``;
    chatcontent += `${message.content}\nXia:`;
    let simbase = [];
    const hintarray = await openai.createEmbedding({
      model: "text-embedding-ada-002",
      input: chatinput,
    });
    if (arraybase.length > 0){
      for (let i = 0; i <= arraybase.length - 1; i ++){
      const sim = similarity(hintarray.data.data[0].embedding,Object.values(arraybase[i])[1]);
      simbase.push(
        {"content": Object.values(arraybase[i])[0], "time": Object.values(arraybase[i])[2], "sim": sim}
      );
    }
    simbase = lodash.sortBy(simbase, [function(o) { return Object.values(o)[2]; }]).reverse();
    hintbase.push(simbase [0]);
    for (let i = 1; i <= simbase.length - 1; i ++){
      if((Object.values(simbase[i-1])[2]-Object.values(simbase[i])[2]) <= 0.02){
        hintbase.push(simbase[i]);
      }else{
        break;
      }
     }
    hintbase = lodash.sortBy(hintbase, [function(o) { return Object.values(o)[1]; }]);
    while(hintbase.length>8){
      hintbase.shift();
    }
    for(let i = 0; i <= hintbase.length - 1; i ++){
      chathint += `[Time: ${Object.values(hintbase[i])[1]}]: ${Object.values(hintbase[i])[0]}\n`;
    }
    GPTrecall[1] = {"role": "user", "content": `The following is some memories in Xia's mind:\n\n${chathint}\n${chatinput}\nGet the most related few memories according to what Xeloan has said. If memories contradict, consider the newest one by the time better than the older ones.\n\nJust reply the exact content of memory in one sentence in English. The format should be: 'Xia remembers: ......'`};
    const recallResponse = await openai.createChatCompletion({
      model: "gpt-3.5-turbo",
      messages: GPTrecall,
      temperature: 0,
      top_p: 0.5,
      presence_penalty: 0,
      frequency_penalty: 0,
    });
    recall = `${recallResponse.data.choices[0].message.content}\n`
  }
//

      console.log(recall);
      fs.appendFileSync(filePath,`    ${recall}`);

//
    GPTimage[1] = {"role": "user", "content": `The following is what Xeloan says to his girlfriend Xia.\n\n${chatinput}\nInstruction:\nDecide whether Xeloan shows obvious request to let Xia draw a picture for him. Usually it should be straightforward request such as 'Help me draw a picture', 'Draw a picture please'.\n\nThe response should be 'Y' or 'N'.(Do not add a full stop)`};
    GPTimgstart[1] = {"role": "user", "content": `The following is a message Xeloan sends to Xia:\n\n${chatinput}\nInstruction:\nDecide whether Xeloan say something about 'Start', such as 'Start now', 'You can start to draw', 'You can start', 'Draw it please'etc'.\nYou should only say  'Y' or 'N'. (Do not add a full stop)`};
    const imgdetect = await openai.createChatCompletion({
      model: "gpt-3.5-turbo",
      messages: GPTimage,
      temperature: 0,
      top_p: 0,
      presence_penalty: 0,
      frequency_penalty: 0,
    });
     if(imgdetect.data.choices[0].message.content == "Y"){
        detect = true;
        console.log("Y");
        detectcount = 5;
     }else{
        if(detectcount > 0){
          detectcount --;
        }
     }
    
    if (detectcount > 0){      
      const imgstartdetect = await openai.createChatCompletion({
        model: "gpt-3.5-turbo",
        messages: GPTimgstart,
        temperature: 0,
        top_p: 0,
        presence_penalty: 0,
        frequency_penalty: 0,
      });
      if (imgstartdetect.data.choices[0].message.content == "Y"){
        detect = false;
        detectcount = 0;
        GPTimagedes[1] = {"role": "user", "content": `The following is a conversation between Xeloan and Xia. Xeloan want Xia to draw a picture. They are talking about what to draw.\n\n${desbase}\n\nInstruction:\nPick the description of the picture from the conversation. The response should be in the form of several key words in English. Only the key words! Don't say anything else. Example: 'beautiful, anime girl, ......'`};
        const imagedes = await openai.createChatCompletion({
          model: "gpt-3.5-turbo",
          messages: GPTimagedes,
          temperature: 0,
          top_p: 0,
          presence_penalty: 0,
          frequency_penalty: 0,
        });

        let able = true;
        try { 
          const response = await openai.createImage({
            prompt: imagedes.data.choices[0].message.content,
            n: 1,
            size: "1024x1024",
          });
          image_url = response.data.data[0].url;
     
          const image = await axios({
            url: image_url,
            responseType: 'arraybuffer'
          });
          const randomString = crypto.randomBytes(4).toString('hex');
          const file = `${imagedes.data.choices[0].message.content.substring(0,5)}-${randomString}.png`;
          fs.writeFileSync(path.join('./DALLE_img', file), image.data);
          message.reply({
            files: [{
              attachment: './DALLE_img/' + file,
              name: file
            }]
          });
        } catch (error) {
          console.log(error);
          message.reply("NA");
          able = false;
        }
        if (able){
          chatcontent += " Finished it\n";
          chatcontent += "Xia:";
        }else {
          chatcontent += " I failed\n";
          chatcontent += "Xia:";
        }
      }
    }
    prompt = `The following is the conversation between Xeloan and Xia.\nCurrent time is ${time}(24h)\n\n${chatcontent}`;
    let j = 0;
    let gptResponse;
    GPTprompt[1]= {"role": "user", "content": `The prompt I will send you later is about a conversation between Xeloan and Xia. You need to fill in Xia's reply after 'Xia:' and don't start with 'Xia:', only the reply.\n\nNow I first provide you with some memories of Xia. Your need to take this into account when generating the response. Here is the memory of Xia:\n\n${recall}\n\nHere is a part of their chat for reference, just an example:\nXeloan: You seem to know everything!\nXia: Haha, I don't know everything. I just know what I know.`};
    GPTprompt[2]= {"role": "user", "content": `This is the desciption of Xia, you should take this into account. \n${header}\nYour response should be only the words of what Xia says, do not add other descriptional words of Xias attitude like cool tone.`};
    GPTprompt[4]= {"role": "user", "content": prompt};
    message.channel.sendTyping();
    while(!success){
      try{
        gptResponse = await openai.createChatCompletion({
          model: "gpt-3.5-turbo",
          messages: GPTprompt,
          temperature: 0.9,
          top_p: 0.7,
          presence_penalty: 1,
          frequency_penalty: 1,
        });
        success = true;
      }catch(error){console.log(error);}
     j+=1;
     if (j>=3) break;
}
  message.reply(gptResponse.data.choices[0].message.content);
  chatcontent += ` ${gptResponse.data.choices[0].message.content}\n`;
	chatcontent += `Xeloan: `;
  chatinput += `Xia: ${gptResponse.data.choices[0].message.content}`
  if (detectcount > 0){
    desbase += `${chatinput}\n`;
    console.log(`test: ${desbase}`);
  }
  chatbuffer.push({"content": chatinput});
  if (chatbuffer.length >= 6){
    let buffercontent = ``;
    for (i = 0; i <= chatbuffer.length - 1; i++){
      buffercontent += `${Object.values(chatbuffer[i])[0]}\n`;
    }
    chatbuffer.shift();
    GPTmemory[1] = {"role": "user", "content": `The following is a part of conversation between Xeloan and Xia.\n\n${buffercontent}\nInstruction:\nGet the important key informations Xia should memorize. If what Xeloan says conflicts to what Xia says, the memory should be based on Xeloan's words.\n\nReply concisely with a sentence in the format'Xia memorizes: ......'.`};
      const remResponse = await openai.createChatCompletion({
        model: "gpt-3.5-turbo",
        messages: GPTmemory,
        temperature: 0,
        top_p: 0.5,
        presence_penalty: 0,
        frequency_penalty: 0,
      });
      const memarray = await openai.createEmbedding({
        model: "text-embedding-ada-002",
        input: remResponse.data.choices[0].message.content,
      });

///
      console.log(remResponse.data.choices[0].message.content);
      fs.appendFileSync(filePath,`    ${remResponse.data.choices[0].message.content}`);
///

      arraybase.unshift(
        {"content": remResponse.data.choices[0].message.content, "array": memarray.data.data[0].embedding,"time": time}
      );
  }
  prompt = `The following is the conversation between Xeloan and Xia.\nCurrent time is ${time}(24h)\n\n${chatcontent}`;
  fs.writeFileSync(`./chatcontent.json`, chatcontent);
  fs.writeFileSync(`./memIndex.json`,JSON.stringify(arraybase));
        busy = false;
    })();
});                
                            
client.login(process.env.BOT_TOKEN);
