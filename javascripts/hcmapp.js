var mini;

// On view load, wire up static actions and retrieve initial data
function init() {
    $("#emp-search-button").click(onEmpSearch);
    mini = new gadgets.MiniMessage();
}

function onEmpSearch() {
   var soap_envelope = '<soapenv:Envelope xmlns:soapenv="http://schemas.xmlsoap.org/soap/envelope/" xmlns:urn="urn:sap-com:document:sap:soap:functions:mc-style"><soapenv:Header/><soapenv:Body><urn:EmployeeGetdata><Communication><item><Perno></Perno><Infotype></Infotype><Subtype></Subtype><ObjectId></ObjectId><LockInd></LockInd><ToDate></ToDate><FromDate></FromDate><Seqno></Seqno><ChOn></ChOn><ChangedBy></ChangedBy><HistFlag></HistFlag><Textflag></Textflag><RefFlag></RefFlag><CnfrmFlag></CnfrmFlag><Screenctrl></Screenctrl><Reason></Reason><Flag1></Flag1><Flag2></Flag2><Flag3></Flag3><Flag4></Flag4><Reserved1></Reserved1><Reserved2></Reserved2><Usertype></Usertype><Userid></Userid><UsridLong></UsridLong></item></Communication><Costcenter></Costcenter><Date>2012-01-01</Date><EmployeeId></EmployeeId><Extension></Extension><FstNameK></FstNameK><FstNameR></FstNameR><FstnameM>*M*</FstnameM><Jobtxt></Jobtxt><JobtxtLg></JobtxtLg><LastnameM>*Connor*</LastnameM><LiplateNo></LiplateNo><LstNameK></LstNameK><LstNameR></LstNameR><OrgAssignment><item><Perno></Perno><Infotype></Infotype><Subtype></Subtype><ObjectId></ObjectId><LockInd></LockInd><ToDate></ToDate><FromDate></FromDate><Seqno></Seqno><ChOn></ChOn><ChangedBy></ChangedBy><HistFlag></HistFlag><Textflag></Textflag><RefFlag></RefFlag><CnfrmFlag></CnfrmFlag><Screenctrl></Screenctrl><Reason></Reason><Flag1></Flag1><Flag2></Flag2><Flag3></Flag3><Flag4></Flag4><Reserved1></Reserved1><Reserved2></Reserved2><CompCode></CompCode><PersArea></PersArea><Egroup></Egroup><Esubgroup></Esubgroup><OrgKey></OrgKey><BusArea></BusArea><PSubarea></PSubarea><LegPerson></LegPerson><Payarea></Payarea><Contract></Contract><Costcenter></Costcenter><OrgUnit></OrgUnit><Position></Position><Job></Job><Supervisor></Supervisor><PayrAdmin></PayrAdmin><PersAdmin></PersAdmin><TimeAdmin></TimeAdmin><SortName></SortName><Name></Name><Objecttype></Objecttype><Admingroup></Admingroup><CoArea></CoArea><FundsCtr></FundsCtr><Fund></Fund><Orgtxt></Orgtxt><Jobtxt></Jobtxt><Postxt></Postxt><Fkber></Fkber><GrantNbr></GrantNbr></item></OrgAssignment><Orgtxt></Orgtxt><PersonalData><item><Perno></Perno><Infotype></Infotype><Subtype></Subtype><ObjectId></ObjectId><LockInd></LockInd><ToDate></ToDate><FromDate></FromDate><Seqno></Seqno><ChOn></ChOn><ChangedBy></ChangedBy><HistFlag></HistFlag><Initials></Initials><LastName></LastName><LastName2></LastName2><Firstname></Firstname><Title></Title><Title2></Title2><AriTitle></AriTitle><Nameaffix></Nameaffix><Nameprefix></Nameprefix><KnownAs></KnownAs><NameForm></NameForm><Formofadr></Formofadr><Gender></Gender><Birthdate></Birthdate><Birthctry></Birthctry><Birthstate></Birthstate><Birthplace></Birthplace><National></National><National2></National2><National3></National3><Langu></Langu><Religion></Religion><MarStatus></MarStatus><MarDate></MarDate><NoOChldr></NoOChldr><NameCon></NameCon><Permo></Permo><Perid></Perid><Birthdtpp></Birthdtpp><FstNameK></FstNameK><LstNameK></LstNameK><FstNameR></FstNameR><LstNameR></LstNameR><BirthnmeK></BirthnmeK><BirthnmeR></BirthnmeR><NicknameK></NicknameK><NicknameR></NicknameR><Birthyear></Birthyear><Birthmonth></Birthmonth><Birthday></Birthday><LastnameM></LastnameM><FstnameM></FstnameM></item></PersonalData><PhoneNo></PhoneNo><Postxt></Postxt><PostxtLg></PostxtLg><Readdb></Readdb><RoomNo></RoomNo><Userid></Userid></urn:EmployeeGetdata></soapenv:Body></soapenv:Envelope>';
   osapi.jive.connects.post({
      'alias' : 'SAPHCM',
      'body' : soap_envelope,
      'format' : 'text',
      'headers' : { 'Content-Type' : ['application/xml;charset=utf-8'], 'Accept-Language' : ['en-us']}
   }).execute(function(response) {
    if (response.error) {
        if (response.error.code == 401) {
            osapi.jive.connects.reconfigure("SAPHCM", response, function(feedback) {
                // See discussion below
                onEmpSearch();
            });
        }
        else {
            // Deal with errors other than 401
            console.log("Error:"+response.error.message);
        }
    }
    else {
        // Process the received data
        console.log("Returned: "+JSON.stringify(feedback));
    }
}

// Register our on-view-load handler
gadgets.util.registerOnLoadHandler(init);

