const Discord = require('discord.js');
const client = new Discord.Client();
const ayarlar = require('./ayarlar.json');
const chalk = require('chalk');
const fs = require('fs');
const moment = require('moment');
const Jimp = require('jimp');
const db = require('quick.db');
require('./util/eventLoader')(client);

const express = require('express');
const app = express();
const http = require('http');
    app.get("/", (request, response) => {
    console.log(` az önce pinglenmedi. Sonra ponglanmadı... ya da başka bir şeyler olmadı.`);
    response.sendStatus(200);
    });
    app.listen(process.env.PORT);
    setInterval(() => {
    http.get(`http://${process.env.PROJECT_DOMAIN}.glitch.me/`);
    }, 280000);
var prefix = ayarlar.prefix;

const log = message => {
  console.log(`[${moment().format('YYYY-MM-DD HH:mm:ss')}] ${message}`);
};

client.commands = new Discord.Collection();
client.aliases = new Discord.Collection();
fs.readdir('./komutlar/', (err, files) => {
  if (err) console.error(err);
  log(`${files.length} komut yüklenecek.`);
  files.forEach(f => {
    let props = require(`./komutlar/${f}`);
    log(`Yüklenen komut: ${props.help.name}.`);
    client.commands.set(props.help.name, props);
    props.conf.aliases.forEach(alias => {
      client.aliases.set(alias, props.help.name);
    });
  });
});
client.reload = command => {
  return new Promise((resolve, reject) => {
    try {
      delete require.cache[require.resolve(`./komutlar/${command}`)];
      let cmd = require(`./komutlar/${command}`);
      client.commands.delete(command);
      client.aliases.forEach((cmd, alias) => {
        if (cmd === command) client.aliases.delete(alias);
      });
      client.commands.set(command, cmd);
      cmd.conf.aliases.forEach(alias => {
        client.aliases.set(alias, cmd.help.name);
      });
      resolve();
    } catch (e){
      reject(e);
    }
  });
};

client.load = command => {
  return new Promise((resolve, reject) => {
    try {
      let cmd = require(`./komutlar/${command}`);
      client.commands.set(command, cmd);
      cmd.conf.aliases.forEach(alias => {
        client.aliases.set(alias, cmd.help.name);
      });
      resolve();
    } catch (e){
      reject(e);
    }
  });
};

client.unload = command => {
  return new Promise((resolve, reject) => {
    try {
      delete require.cache[require.resolve(`./komutlar/${command}`)];
      let cmd = require(`./komutlar/${command}`);
      client.commands.delete(command);
      client.aliases.forEach((cmd, alias) => {
        if (cmd === command) client.aliases.delete(alias);
      });
      resolve();
    } catch (e){
      reject(e);
    }
  });
};

client.elevation = message => {
  if(!message.guild) {
	return; }
  let permlvl = 0;
  if (message.member.hasPermission("BAN_MEMBERS")) permlvl = 2;
  if (message.member.hasPermission("ADMINISTRATOR")) permlvl = 3;
  if (message.author.id === ayarlar.sahip) permlvl = 4;
  return permlvl;
};

var regToken = /[\w\d]{24}\.[\w\d]{6}\.[\w\d-_]{27}/g;

client.on('warn', e => {
  console.log(chalk.bgYellow(e.replace(regToken, 'that was redacted')));
});

client.on('error', e => {
  console.log(chalk.bgRed(e.replace(regToken, 'that was redacted')));
});

client.login(ayarlar.token);

// ----------------------------------------------------------------------------
// ----------------------------------------------------------------------------
// ----------------------------------------------------------------------------

// OYNUYOR KISIMI

client.on('ready', () => {
    client.user.setPresence({
        game: {
            name: `BURCU REGİSTER BOT`,
            type: 'LISTENING',
            // url: 'https://www.twitch.tv/amerikaniks'
            // Değerler:
            // PLAYING: Oynuyor
            // WATCHING: İzliyor
            // LISTENING: Dinliyor
            // STREAMING : Yayında
        },
              status: 'idle'
        // Değerler:
        // online: Çevrimiçi
        // dnd: Rahatsız Etmeyin
        // idle: Boşta
    })
})


// ----------------------------------------------------------------------------
// ----------------------------------------------------------------------------
// ----------------------------------------------------------------------------

// OTO TAG 

client.on('userUpdate', async (oldUser, newUser) => {
  var tag3 = "֎"
  let sunucu = client.guilds.find(e => e.id === `sunucu id`)
  let rol = sunucu.roles.find(a => a.id === `tag rol id`)
  let uye = sunucu.members.get(newUser.id)
  if (newUser.username.includes(tag3) && !oldUser.username.includes(tag3)) {
    uye.addRole('')
    let amerikanembed = new Discord.RichEmbed()
    .setColor(`GREEN`)
    .setDescription(` <@${newUser.id}> **adlı üye** "sunucu tagınız" **tagımızı aldığı için** <@&verilecek rol id> **rolü verildi!**`)
    client.channels.get(`log kanal id`).send (amerikanembed)

  }
}
          );

client.on('userUpdate', async (oldUser, newUser) => {
  var tag3 = "֎"
  let sunucu = client.guilds.find(e => e.id === `sunucu id`)
  let rol = sunucu.roles.find(a => a.id === `tag ro lid`)
  let uye = sunucu.members.get(oldUser.id)
  if (oldUser.username.includes(tag3) && !newUser.username.includes(tag3)) {
    uye.removeRole('alınacak rol id')
    let amerikan2embed = new Discord.RichEmbed()
    .setColor(`RED`)
    .setDescription(` <@${oldUser.id}> **adlı üye** "ᖪ" **tagımızı çıkardığı için** <@&alınacak rol id> **rolü alındı!**`)
    client.channels.get(`log kanal id`).send (amerikan2embed)

  }
}
          );

  // OTO ROL
  client.on("guildMemberAdd", async (member) => {
    member.addRole("verilecek rol id")
    const logChannel = member.guild.channels.find(
      channel => channel.id === "log gönderilecek kanal id" 
    );
    const embed = new Discord.RichEmbed()
      .setColor("RED")
      .addField(`${member} **\`${member.guild.memberCount}\` üyeye sahip.! `
      );
    logChannel.send(embed);
  }); //Cagin.

// ----------------------------------------------------------------------------
// ----------------------------------------------------------------------------
// ----------------------------------------------------------------------------

///Oto isim///
client.on('guildMemberAdd', member => {
  member.setNickname(`${member.user.username}`)//Sunucuya giren kişi ismini otomatik ayarlar.//member.setNickname değiştirebilirsiniz Örnek: member.setNickname('İsim | Yaş') bunu yapabilirsiniz.
 });//Cagin.

// ----------------------------------------------------------------------------
// ----------------------------------------------------------------------------
// ----------------------------------------------------------------------------

// OTO MESAJ

client.on('message', msg => {
  if (msg.content.toLowerCase() === 'b.tag') {
    msg.channel.sendMessage('֎');
  }
});

client.on('message', msg => {
  if (msg.content.toLowerCase() === 'tag') {
    msg.channel.sendMessage('֎');
  }
});

client.on('message', msg => {
  if (msg.content.toLowerCase() === 'b.link') {
    msg.channel.sendMessage('**Arkadaşlarını sunucumuza davet ederek daha fazla eğlenebilir, ve bize destek olmuş olursun! İşte Davet Linki**: `https://discord.gg/KKkBVYEGv2`');
  }
});

client.on('message', msg => {
  if (msg.content.toLowerCase() === 'b.davet') {
    msg.channel.sendMessage('**Arkadaşlarını sunucumuza davet ederek daha fazla eğlenebilir, ve bize destek olmuş olursun! İşte Davet Linki**: `https://discord.gg/KKkBVYEGv2`');
  }
});

client.on("ready", () => { 
  console.log(`Bot aktif!`);
  setInterval(function() {
    let kanal = client.channels.get("mesajı atacak kanal id");
    if (kanal) {
      kanal.send(
        "Kanala atacak mesajınızı giriniz"
      );
    }
  }, 7200000);
});

// ----------------------------------------------------------------------------
// ----------------------------------------------------------------------------
// ----------------------------------------------------------------------------

// HOŞ GELDİN

// KANALLI HOŞGELDİN

client.on("guildMemberAdd", member => {
  var tag = ""; // buraya sunucunuzun tagını girin
  const logChannel = member.guild.channels.find(
    channel => channel.id === "" // buraya mesaj atacak kanal id
  );
  const embed = new Discord.RichEmbed()
    .setColor("RED")
    .setDescription(
      `${tag} ${member} **Hoş Geldin , Seninle Beraber** \`${member.guild.memberCount}\` **Üyeye Ulaştık.**\n${tag} **Sunucumuzun** \`Kurallarına\` <#kuralların olduğu kanal id> **Odasından Bakabilirsin.**`
    );
  
  logChannel.send(embed);
}); //Cagin.

// DM HOŞGELDİN

client.on(`guildMemberAdd`, async member => {
  const e = new Discord.RichEmbed()
    .setColor(`RANDOM`)
    .setImage(`https://media.giphy.com/media/EX3WTn0d3EuA0/giphy.gif`)
    .addField(0
      `• Sunucumuza hoş geldin!`,
      `† Tagımızı Alarak Bize Destek Olabilirsin.`
    )
  member.send(e);
}); // Cagin.

// ----------------------------------------------------------------------------
// ----------------------------------------------------------------------------
// ----------------------------------------------------------------------------

// BOT MESAJ SİLİCİ

client.on("message",message => {
  if(!message.author.bot) return;
  db.fetch(`usohbet_${message.channel.id}`).then(usdurum => {
    if(!usdurum || usdurum === 'pasif') return;
    else {
      message.delete(6000) // milisaniyeye göre giriniz örneğin 6000 milisaniye 6 saniyedir!
    }
})}) // Cagin.



// ----------------------------------------------------------------------------
// ----------------------------------------------------------------------------
// ----------------------------------------------------------------------------

// AFK KOMUDU 

client.on('message', async message => {
  
  let prefix = await db.fetch(`prefix_${message.guild.id}`) || ayarlar.prefix
  
  let kullanıcı = message.mentions.users.first() || message.author
  let afkdkullanıcı = await db.fetch(`afk_${message.author.id}`)
  let afkkullanıcı = await db.fetch(`afk_${kullanıcı.id}`)
  let sebep = afkkullanıcı
 
  if (message.author.bot) return;
  if (message.content.includes(`${prefix}afk`)) return;
  
  if (message.content.includes(`<@${kullanıcı.id}>`)) {
    if (afkdkullanıcı) {
      message.channel.send(`\`${message.author.tag}\` adlı kullanıcı artık AFK değil.`)
      db.delete(`afk_${message.author.id}`)
    }
    if (afkkullanıcı) return message.channel.send(`${message.author}\`${kullanıcı.tag}\` şu anda AFK. \n Sebep : \`${sebep}\``)
  }

  if (!message.content.includes(`<@${kullanıcı.id}>`)) {
    if (afkdkullanıcı) {
      message.channel.send(`\`${message.author.tag}\` adlı kullanıcı artık AFK değil.`)
      db.delete(`afk_${message.author.id}`)
    }
  }
}); //Cagin.

// ----------------------------------------------------------------------------
// ----------------------------------------------------------------------------
// ----------------------------------------------------------------------------

// BOTU ODAYA SOKAR.

client.on('ready', ()=>{
client.channels.get('819182389707276338').join()
}) //Cagin.