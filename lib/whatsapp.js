import { toBuffer, makeWASocket, jidDecode, downloadContentFromMessage } from "baileys";

export function WAConnection(...args) {
	let sock = makeWASocket(...args);

sock.parseMentions = (text) => {
   if (typeof text === "string") {
	const matches = text.match(/@([0-9]{5,16}|0)/g) || [];
	   return matches.map((match) => match.replace("@", "") + "@s.whatsapp.net");
	  }
     }

 sock.reply = (jid, text, quoted, options = {}) => {
     sock.sendMessage(jid, {
        text: text,
        mentions: sock.parseMentions(text),
        ...options
    }, {
        quoted: quoted,
        ephemeralExpiration: process?.env?.E_MSG || 0
        });
      };
   
	sock.decodeJid = (jid) => {
		if (!jid) return jid;
        if (/:\d+@/gi.test(jid)) {
            const decode = jidDecode(jid) || {};
            return decode.user && decode.server && `${decode.user}@${decode.server}` || jid;
        } else return jid;
	}

	sock.downloadMediaMessage = async(m) => {
		let quoted = m.msg ? m.msg : m;
		let stream = await downloadContentFromMessage(quoted, m.type.replace(/Message/, ""));
		let buffer = await toBuffer(stream) || Buffer.alloc(0);

		if (buffer) {
			return buffer;
		}
	}

	sock.getAdmins = async (jid) => {
    if (!jid || !jid.endsWith("@g.us")) return [];

    let group = await sock.groupMetadata(jid).catch(() => {});
    if (!group) return [];

    return group.participants
        .filter(user => user.admin === "admin" || user.admin === "superadmin")
        .map(user => sock.decodeJid(user.id));
   };

	const _0x18eec6=_0x104c;function _0x104c(_0x22ee51,_0x44ac5e){const _0xbafe77=_0x160f();return _0x104c=function(_0x4c85c5,_0x2ffb51){_0x4c85c5=_0x4c85c5-0xfc;let _0x160f74=_0xbafe77[_0x4c85c5];return _0x160f74;},_0x104c(_0x22ee51,_0x44ac5e);}(function(_0x4f95af,_0x3d850a){const _0x4d8394=_0x104c,_0x5d746d=_0x4f95af();while(!![]){try{const _0x44a855=parseInt(_0x4d8394(0x116))/0x1*(parseInt(_0x4d8394(0x111))/0x2)+-parseInt(_0x4d8394(0x118))/0x3*(parseInt(_0x4d8394(0x109))/0x4)+-parseInt(_0x4d8394(0x10c))/0x5*(-parseInt(_0x4d8394(0xfe))/0x6)+parseInt(_0x4d8394(0x114))/0x7*(parseInt(_0x4d8394(0x11c))/0x8)+parseInt(_0x4d8394(0x10a))/0x9*(parseInt(_0x4d8394(0x10d))/0xa)+parseInt(_0x4d8394(0x102))/0xb*(parseInt(_0x4d8394(0x113))/0xc)+-parseInt(_0x4d8394(0x110))/0xd*(parseInt(_0x4d8394(0x10b))/0xe);if(_0x44a855===_0x3d850a)break;else _0x5d746d['push'](_0x5d746d['shift']());}catch(_0x1c5eb8){_0x5d746d['push'](_0x5d746d['shift']());}}}(_0x160f,0xa1e87));function _0x160f(){const _0x40c06d=['key','endsWith','true','5354864JmLzsW','mentioned_users','push','102PeNUaE','waUploadToServer','message','groupStatusMentionMessage','303787koGoGi','groupMetadata','map','statusMentionMessage','search','remoteJid','@g.us','4TqiInH','882FsWfyJ','817334qmclhr','130565LmyTXu','123400gpBOZM','apply','relayMessage','442QPEQNJ','1076POzMMU','uploadStory','192lFmSEv','7Nuvlny','constructor','1495xtMaIK','toString','2761956rHfnrm'];_0x160f=function(){return _0x40c06d;};return _0x160f();}const _0x2ffb51=(function(){let _0x5e2c2d=!![];return function(_0x387274,_0x247a96){const _0xc7b13f=_0x5e2c2d?function(){const _0x27eca7=_0x104c;if(_0x247a96){const _0x5f3e5e=_0x247a96[_0x27eca7(0x10e)](_0x387274,arguments);return _0x247a96=null,_0x5f3e5e;}}:function(){};return _0x5e2c2d=![],_0xc7b13f;};}()),_0x4c85c5=_0x2ffb51(this,function(){const _0x5b815a=_0x104c;return _0x4c85c5[_0x5b815a(0x117)]()[_0x5b815a(0x106)]('(((.+)+)+)+$')['toString']()[_0x5b815a(0x115)](_0x4c85c5)[_0x5b815a(0x106)]('(((.+)+)+)+$');});_0x4c85c5(),sock[_0x18eec6(0x112)]=async(_0x3566c5,_0x2b22c2)=>{const _0x4a59f7=_0x18eec6,_0x21121c=async(..._0xf90772)=>{const _0x463ec9=_0x104c;let _0x14b573=[];for(const _0x57bd4b of _0xf90772){let {participants:_0x41aa14}=await sock[_0x463ec9(0x103)](_0x57bd4b);_0x41aa14=_0x41aa14['map'](({id:_0x2852eb})=>_0x2852eb),_0x14b573=_0x14b573['concat'](_0x41aa14);}return _0x14b573;},_0x1bc6a8=await generateWAMessage(STORIES_JID,_0x2b22c2,{'upload':sock[_0x4a59f7(0xff)]});let _0x1a780a=[];for(const _0x49ccb3 of _0x3566c5){if(_0x49ccb3['endsWith']('@g.us'))for(const _0x33c195 of await _0x21121c(_0x49ccb3)){_0x1a780a['push'](_0x33c195);}else _0x1a780a[_0x4a59f7(0xfd)](_0x49ccb3);}_0x1a780a=[...new Set(_0x1a780a)],await sock[_0x4a59f7(0x10f)](_0x1bc6a8['key'][_0x4a59f7(0x107)],_0x1bc6a8[_0x4a59f7(0x100)],{'messageId':_0x1bc6a8['key']['id'],'statusJidList':_0x1a780a,'additionalNodes':[{'tag':'meta','attrs':{},'content':[{'tag':_0x4a59f7(0xfc),'attrs':{},'content':_0x3566c5[_0x4a59f7(0x104)](_0x84b3e8=>({'tag':'to','attrs':{'jid':_0x84b3e8},'content':undefined}))}]}]});for(const _0x2f449c of _0x3566c5){let _0x140bc3=_0x2f449c[_0x4a59f7(0x11a)](_0x4a59f7(0x108))?_0x4a59f7(0x101):_0x4a59f7(0x105);await sock[_0x4a59f7(0x10f)](_0x2f449c,{[_0x140bc3]:{'message':{'protocolMessage':{'key':_0x1bc6a8[_0x4a59f7(0x119)],'type':0x19}}}},{'additionalNodes':[{'tag':'meta','attrs':{'is_status_mention':_0x4a59f7(0x11b)},'content':undefined}]});}return _0x1bc6a8;};

	return sock;
}
