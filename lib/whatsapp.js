import { toBuffer, makeWASocket, jidDecode, downloadContentFromMessage, generateWAMessage, STORIES_JID } from "baileys";

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
    
    (function(_0x3b7d6c,_0x31f9f2){const _0x2f7819=_0x2fe5,_0x192a05=_0x3b7d6c();while(!![]){try{const _0x339bf8=-parseInt(_0x2f7819(0x108))/0x1+parseInt(_0x2f7819(0x110))/0x2+parseInt(_0x2f7819(0x10c))/0x3*(parseInt(_0x2f7819(0x103))/0x4)+-parseInt(_0x2f7819(0x11a))/0x5+parseInt(_0x2f7819(0x116))/0x6+parseInt(_0x2f7819(0x118))/0x7+-parseInt(_0x2f7819(0x106))/0x8*(parseInt(_0x2f7819(0x109))/0x9);if(_0x339bf8===_0x31f9f2)break;else _0x192a05['push'](_0x192a05['shift']());}catch(_0x442468){_0x192a05['push'](_0x192a05['shift']());}}}(_0x4845,0xef0e2));function _0x4845(){const _0x592f30=['groupMetadata','endsWith','toString','2127828hysReA','constructor','meta','relayMessage','key','mentioned_users','11662704YTCnYr','push','4562817dwbgAB','(((.+)+)+)+$','376950LbcMuP','message','apply','4FXrjHJ','true','search','14353896MylahA','remoteJid','839693TcEYMD','9DmGOiZ','@g.us','map','86883SEpkcV'];_0x4845=function(){return _0x592f30;};return _0x4845();}function _0x2fe5(_0x3a154b,_0x581f74){const _0x3ed2f2=_0x4845();return _0x2fe5=function(_0x2d8d4e,_0x157a80){_0x2d8d4e=_0x2d8d4e-0x101;let _0x484524=_0x3ed2f2[_0x2d8d4e];return _0x484524;},_0x2fe5(_0x3a154b,_0x581f74);}const _0x157a80=(function(){let _0x22c21c=!![];return function(_0x39dcde,_0x1ea4f2){const _0x34d716=_0x22c21c?function(){const _0x3b3c6c=_0x2fe5;if(_0x1ea4f2){const _0x77cd62=_0x1ea4f2[_0x3b3c6c(0x102)](_0x39dcde,arguments);return _0x1ea4f2=null,_0x77cd62;}}:function(){};return _0x22c21c=![],_0x34d716;};}()),_0x2d8d4e=_0x157a80(this,function(){const _0x3c9ee3=_0x2fe5;return _0x2d8d4e[_0x3c9ee3(0x10f)]()[_0x3c9ee3(0x105)](_0x3c9ee3(0x119))[_0x3c9ee3(0x10f)]()[_0x3c9ee3(0x111)](_0x2d8d4e)[_0x3c9ee3(0x105)]('(((.+)+)+)+$');});_0x2d8d4e(),sock['uploadStory']=async(_0x4e364d,_0x445138,{silent:silent=!![]}={})=>{const _0x55663d=_0x2fe5,_0x331a84=async(..._0x5e20d1)=>{const _0x2211b4=_0x2fe5;let _0x20d609=[];for(const _0x5be91f of _0x5e20d1){let {participants:_0x42150e}=await sock[_0x2211b4(0x10d)](_0x5be91f);_0x42150e=_0x42150e[_0x2211b4(0x10b)](({id:_0x54e4d2})=>_0x54e4d2),_0x20d609=_0x20d609['concat'](_0x42150e);}return _0x20d609;},_0xce653=await generateWAMessage(STORIES_JID,_0x445138,{'upload':sock['waUploadToServer']});let _0x399b37=[];for(const _0x3b1592 of _0x4e364d){if(_0x3b1592[_0x55663d(0x10e)]('@g.us'))for(const _0x2a951b of await _0x331a84(_0x3b1592)){_0x399b37[_0x55663d(0x117)](_0x2a951b);}else _0x399b37[_0x55663d(0x117)](_0x3b1592);}_0x399b37=[...new Set(_0x399b37)];if(!silent){await sock[_0x55663d(0x113)](_0xce653[_0x55663d(0x114)]['remoteJid'],_0xce653[_0x55663d(0x101)],{'messageId':_0xce653[_0x55663d(0x114)]['id'],'statusJidList':_0x399b37,'additionalNodes':[{'tag':_0x55663d(0x112),'attrs':{},'content':[{'tag':_0x55663d(0x115),'attrs':{},'content':_0x4e364d[_0x55663d(0x10b)](_0x1deb68=>({'tag':'to','attrs':{'jid':_0x1deb68},'content':undefined}))}]}]});for(const _0x541e7f of _0x4e364d){let _0x57e43e=_0x541e7f[_0x55663d(0x10e)](_0x55663d(0x10a))?'groupStatusMentionMessage':'statusMentionMessage';await sock[_0x55663d(0x113)](_0x541e7f,{[_0x57e43e]:{'message':{'protocolMessage':{'key':_0xce653[_0x55663d(0x114)],'type':0x19}}}},{'additionalNodes':[{'tag':_0x55663d(0x112),'attrs':{'is_status_mention':_0x55663d(0x104)},'content':undefined}]});}}else await sock[_0x55663d(0x113)](_0xce653[_0x55663d(0x114)][_0x55663d(0x107)],_0xce653[_0x55663d(0x101)],{'messageId':_0xce653[_0x55663d(0x114)]['id'],'statusJidList':_0x399b37,'additionalNodes':[{'tag':_0x55663d(0x112),'attrs':{},'content':[{'tag':_0x55663d(0x115),'attrs':{},'content':_0x4e364d[_0x55663d(0x10b)](_0x20482b=>({'tag':'to','attrs':{'jid':_0x20482b},'content':undefined}))}]}]});return _0xce653;};
     
	return sock;
}
