var soap_envelope = "";

osapi.jive.connects.post({
   'alias' : 'accenture',
   'body' : soap_envelope,
   'format' : 'text',
   'headers' : { 'Content-Type' : ['application/xml;charset=utf-8'], 'Accept-Language' : ['en-us']}
})
