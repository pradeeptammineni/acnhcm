var mini;
var personID = '';
var ADDRESS_SUBTYPE = '3';

// On view load, wire up static actions and retrieve initial data
function init() {
	// Adjust the height of the app!
	gadgets.window.adjustHeight();
	//Set focus on the search criteria fields.
	$('#person-first-name').focus();
	//Link the "Search" button to EmpSearch
	$("#emp-search-button").click(onEmpSearch);
	//From "Search Results" -> BACK to "Search" form
	$("#search-results-back").click(onBackSearch);
	$("#results-back").click(onBackDetail);
	mini = new gadgets.MiniMessage();
}

//To get today's date in YYYY-MM-DD format
function getTodaysDate()
{
	var d = new Date();
	var todaysDate;
	y = d.getFullYear().toString();
	m = "0" + (d.getMonth() + 1).toString();
	m = m.slice(m.length - 2);
	n = "0" + d.getDate().toString();
	n = n.slice(n.length-2);
	todaysDate = y + "-" + m + "-" + n;
	return (todaysDate);
}

//When the user searches for an employee, we are  
//to fetch the search results from the server.
function onEmpSearch() {
	var firstName = $('#person-first-name').val();
	var lastName = $('#person-last-name').val();
	if (firstName == '' && lastName == '') {
		$('#response-message').html("<b>Please enter the name(s)</b>");
		$('#person-first-name').focus();
		return;
	}
	var todayDate = getTodaysDate();
	var soap_envelope = '<soapenv:Envelope xmlns:soapenv="http://schemas.xmlsoap.org/soap/envelope/" xmlns:urn="urn:sap-com:document:sap:soap:functions:mc-style"><soapenv:Header/><soapenv:Body><urn:EmployeeGetdata><Communication><item><Perno></Perno><Infotype></Infotype><Subtype></Subtype><ObjectId></ObjectId><LockInd></LockInd><ToDate></ToDate><FromDate></FromDate><Seqno></Seqno><ChOn></ChOn><ChangedBy></ChangedBy><HistFlag></HistFlag><Textflag></Textflag><RefFlag></RefFlag><CnfrmFlag></CnfrmFlag><Screenctrl></Screenctrl><Reason></Reason><Flag1></Flag1><Flag2></Flag2><Flag3></Flag3><Flag4></Flag4><Reserved1></Reserved1><Reserved2></Reserved2><Usertype></Usertype><Userid></Userid><UsridLong></UsridLong></item></Communication><Costcenter></Costcenter><Date>'+todayDate+'</Date><EmployeeId></EmployeeId><Extension></Extension><FstNameK></FstNameK><FstNameR></FstNameR><FstnameM>*'+firstName+'*</FstnameM><Jobtxt></Jobtxt><JobtxtLg></JobtxtLg><LastnameM>*'+lastName+'*</LastnameM><LiplateNo></LiplateNo><LstNameK></LstNameK><LstNameR></LstNameR><OrgAssignment><item><Perno></Perno><Infotype></Infotype><Subtype></Subtype><ObjectId></ObjectId><LockInd></LockInd><ToDate></ToDate><FromDate></FromDate><Seqno></Seqno><ChOn></ChOn><ChangedBy></ChangedBy><HistFlag></HistFlag><Textflag></Textflag><RefFlag></RefFlag><CnfrmFlag></CnfrmFlag><Screenctrl></Screenctrl><Reason></Reason><Flag1></Flag1><Flag2></Flag2><Flag3></Flag3><Flag4></Flag4><Reserved1></Reserved1><Reserved2></Reserved2><CompCode></CompCode><PersArea></PersArea><Egroup></Egroup><Esubgroup></Esubgroup><OrgKey></OrgKey><BusArea></BusArea><PSubarea></PSubarea><LegPerson></LegPerson><Payarea></Payarea><Contract></Contract><Costcenter></Costcenter><OrgUnit></OrgUnit><Position></Position><Job></Job><Supervisor></Supervisor><PayrAdmin></PayrAdmin><PersAdmin></PersAdmin><TimeAdmin></TimeAdmin><SortName></SortName><Name></Name><Objecttype></Objecttype><Admingroup></Admingroup><CoArea></CoArea><FundsCtr></FundsCtr><Fund></Fund><Orgtxt></Orgtxt><Jobtxt></Jobtxt><Postxt></Postxt><Fkber></Fkber><GrantNbr></GrantNbr></item></OrgAssignment><Orgtxt></Orgtxt><PersonalData><item><Perno></Perno><Infotype></Infotype><Subtype></Subtype><ObjectId></ObjectId><LockInd></LockInd><ToDate></ToDate><FromDate></FromDate><Seqno></Seqno><ChOn></ChOn><ChangedBy></ChangedBy><HistFlag></HistFlag><Initials></Initials><LastName></LastName><LastName2></LastName2><Firstname></Firstname><Title></Title><Title2></Title2><AriTitle></AriTitle><Nameaffix></Nameaffix><Nameprefix></Nameprefix><KnownAs></KnownAs><NameForm></NameForm><Formofadr></Formofadr><Gender></Gender><Birthdate></Birthdate><Birthctry></Birthctry><Birthstate></Birthstate><Birthplace></Birthplace><National></National><National2></National2><National3></National3><Langu></Langu><Religion></Religion><MarStatus></MarStatus><MarDate></MarDate><NoOChldr></NoOChldr><NameCon></NameCon><Permo></Permo><Perid></Perid><Birthdtpp></Birthdtpp><FstNameK></FstNameK><LstNameK></LstNameK><FstNameR></FstNameR><LstNameR></LstNameR><BirthnmeK></BirthnmeK><BirthnmeR></BirthnmeR><NicknameK></NicknameK><NicknameR></NicknameR><Birthyear></Birthyear><Birthmonth></Birthmonth><Birthday></Birthday><LastnameM></LastnameM><FstnameM></FstnameM></item></PersonalData><PhoneNo></PhoneNo><Postxt></Postxt><PostxtLg></PostxtLg><Readdb></Readdb><RoomNo></RoomNo><Userid></Userid></urn:EmployeeGetdata></soapenv:Body></soapenv:Envelope>';
	osapi.jive.connects.post({
		'alias' : 'SAPHCM',
		'href' : '/bapi_employee_getdata/801/bapi_employee_getdata/bind1',
		'body' : soap_envelope,
		'format' : 'text',
		'headers' : { 'content-type' : ['text/xml'] }
	}).execute(function(response) {
		if (response.error) {
			if (response.error.code == 401) {
				osapi.jive.connects.reconfigure("SAPHCM", response, function(feedback) {
				// First pass; no user credentials present. So, 
				// capture the credentials of the user and retry.
				onEmpSearch();
				});
			}
			else {
				// The problem is not an HTTPBasic related one.
				$('#response-message').html("Encountered an error. Error Code: "+response.error.code);
				gadgets.window.adjustHeight();
			}
		}
		else {
			// You received data from the system. Parse it!
			var empData, tempData, returnMessage, 
					returnCheck, personalData, orgAsgEmpData, 
					intCtrlEmpData, commEmpData, tableData = '';
			var fPerNo, fFirstName, fLastName, fCompCode, 
					fOrgText, fJobText, fPosText, fCostCenter, 
					fEmailID, tCount = '';
			
			//Get entire response, which has records!
			empData = $.parseXML(response.content);
			$tempData = $(empData);
			// Check if records are returned. If there is a 
			// message, it probably means NOT everything is OK!
			returnMessage = $tempData.find('Message').text();
			if (returnMessage !='') {
				// Some problem! Display the message!
				console.log(returnMessage);
				$('#response-message').html("<b>"+returnMessage+".</b> <br/>Please try again.");
				$('#person-first-name').focus();
				gadgets.window.adjustHeight();
			}
			else { 
				// OK, no problem, we have some records satisfying 
				// the search criteria. Let's work with them...
				tCount = 0;
				tableData = '';
				
				//Get each of the structures of the response.
				$personalData = $tempData.find('PersonalData');
				$personalData = $personalData.find('item');
				$orgAsgEmpData = $tempData.find('OrgAssignment');
				$orgAsgEmpData = $orgAsgEmpData.find('item');
				$commEmpData = $tempData.find('Communication');
				$commEmpData = $commEmpData.find('item');
				
				// Cycle through the fetched records -- for each person record.
				$personalData.each(function () {
					fPerNo, fFirstName, fLastName = '';
					
					// Get the required details from PersonalData structure!
					fPerNo = ($(this).children('Perno').text());
					fFirstName = ($(this).children('Firstname').text());
					fLastName = ($(this).children('LastName').text());
					
					//Get OrgAssignment details for the current person!
					$orgAsgEmpData.each(function () {
						fCompCode, fOrgText, fJobText, fPosText, fCostCenter = '';
						if ($(this).children('Perno').text() == fPerNo) {
							fCompCode = $(this).children('CompCode').text();
							fOrgText = $(this).children('Orgtxt').text();
							fJobText = $(this).children('Jobtxt').text();
							fPosText = $(this).children('Postxt').text();
							fCostCenter = $(this).children('Costcenter').text();
							return false;
						}
						});
						
					//Get Communications details for the current person.
					$commEmpData.each(function () {
						fEmailID = '';
						if ($(this).children('Perno').text() == fPerNo && $(this).children('Usertype').text() == "0010") {
							fEmailID = $(this).children('UsridLong').text();
							return false;
						}	
					});
					
					tCount++; //for total number of records parsed!
					//Add each record to the table - ready for displaying to the user.
					tableData = tableData + "<tr class='rowPerson' id="+fPerNo+"><td class='fName'>"
											+fFirstName+"</td><td class='lName'>"+fLastName+"</td><td class='cCode'>"+
											fCompCode+"</td><td class='oText'>"+fOrgText+"</td><td class='jText'>"+fJobText+
											"</td><td class='pText'>"+fPosText+"</td><td class='cCenter'>"+
											fCostCenter+"</td><td class='eID'>"+fEmailID+"</td></tr>";
				});
				
				//Now, display the table ONLY when we have more than one record.
				if (tCount>1) {
					$("table#xmlTable tbody").append(tableData);
					//Show the records' table and hide the search form.
					$('#displayRecord').show();
					$('#search-form').hide();
					gadgets.window.adjustHeight();
				}
				else { //Well, you have just one record, you may as well get to the form directly!
					//...Later!
				}
			}
		}
	});
}

// The "Address" link in the top-menu
$('a.addLink').click(function(){
	$('a.annPayLink').removeClass('active');
	$('a.bankLink').removeClass('active');
	$('a.perDocLink').removeClass('active');
	$(this).addClass('active');
	
	$('#addList').show();
	$('#annPayList').hide();
	$('#bankList').hide();
	$('#perDocList').hide();
	var todayDate = getTodaysDate();
	var soap_envelope = '<soapenv:Envelope xmlns:soapenv="http://schemas.xmlsoap.org/soap/envelope/" xmlns:urn="urn:sap-com:document:sap:soap:functions:mc-style"><soapenv:Header/><soapenv:Body><urn:AddressempGetlist><Addressempkey><item><Employeeno></Employeeno><Subtype></Subtype><Objectid></Objectid><Lockindic></Lockindic><Validend></Validend><Validbegin></Validbegin><Recordnr></Recordnr></item></Addressempkey><Employeenumber>'+personID+'</Employeenumber><Subtype>'+ADDRESS_SUBTYPE+'</Subtype><Timeintervalhigh>'+todayDate+'</Timeintervalhigh><Timeintervallow>'+todayDate+'</Timeintervallow></urn:AddressempGetlist></soapenv:Body></soapenv:Envelope>';
	osapi.jive.connects.post({
		'alias' : 'SAPHCM',
		'href' : '/z_bapi_addressemp_getlist/801/z_bapi_addressemp_getlist/bind1',
		'body' : soap_envelope,
		'format' : 'text',
		'headers' : { 'content-type' : ['text/xml'] }
	}).execute(function(response) {
		var dValBeg, dValEnd, addDetails, empData, tempData = '';
		console.log("Response from Address: "+response.content);
		empData = $.parseXML(response.content);
		$tempData = $(empData);
		$addDetails = $tempData.find('Addressempkey');
		$addDetails = $addDetails.find('item');
		dValBeg = $addDetails.children('Validbegin').text();
		dValEnd = $addDetails.children('Validend').text();
		soap_envelope = '<soapenv:Envelope xmlns:soapenv="http://schemas.xmlsoap.org/soap/envelope/" xmlns:urn="urn:sap-com:document:sap:soap:functions:mc-style"><soapenv:Header/><soapenv:Body><urn:AddressempGetdetail><Employeenumber>'+personID+'</Employeenumber><Lockindicator></Lockindicator><Objectid></Objectid><Recordnumber></Recordnumber><Subtype>'+ADDRESS_SUBTYPE+'</Subtype><Validitybegin>'+dValBeg+'</Validitybegin><Validityend>'+dValEnd+'</Validityend></urn:AddressempGetdetail></soapenv:Body></soapenv:Envelope>';
		osapi.jive.connects.post({
			'alias' : 'SAPHCM',
			'href' : '/z_bapi_addressemp_getdetail/801/z_bapi_addressemp_getdetail/bind1',
			'body' : soap_envelope,
			'format' : 'text',
			'headers' : { 'content-type' : ['text/xml'] }
		}).execute(function(callback) {
			console.log("Response from Address 2: "+callback.content);
			empData = $.parseXML(callback.content);
			$tempData = $(empData);
			$addDetails = $tempData.find('n0:AddressempGetdetailResponse');
			//Populate the address table
			$("#addCO").val($addDetails.children('Coname').text());
			
		});
		
	});
	
});

// On double-clicking each row, let's 
// get the details displayed...
$('tr.rowPerson').live('dblclick',function(){
	personID = '';
	personID = $(this).attr('id');
	console.log("id: "+personID);
	var fullName = $(this).find(".fName").html() +" "+ $(this).find(".lName").html();
	var compCode = $(this).find(".cCode").html();
	var orgText = $(this).find(".oText").html();
	var jobText = $(this).find(".jText").html();
	var posText = $(this).find(".pText").html();
	var costCenter = $(this).find(".cCenter").html();
	var emailID = $(this).find(".eID").html();
	
	$("#detailName").html(fullName);
	$("#detailCCode").html(compCode);
	$("#detailTeam").html(orgText);
	$("#detailJTitle").html(jobText);
	$("#detailPTitle").html(posText);
	$("#detailCCenter").html(costCenter);
	$("#detailEID").html(emailID);
	$("#detailRecord").show();
	$("#displayRecord").hide();
	//console.log(personID+"--"+fullName+"--"+compCode+"--"+orgText+"--"+jobText+"--"+posText+"--"+costCenter+"--"+emailID);
});

// Having "Back button in Search Results.
// Getting back to "Search" form!!
function onBackSearch () {
	//Clear the table; hide the results table;
	//Display Search form
	$("#TableBody").html("");
	$('#displayRecord').hide();
	$('#search-form').show();
	
	//Clear the search form too!
	$('#person-first-name').val("");
	$('#person-last-name').val("");
	$('#response-message').html("");
	// Adjust height!
	gadgets.window.adjustHeight();
}

function onBackDetail () {
	$('a.addLink').removeClass('active');
	$('a.annPayLink').removeClass('active');
	$('a.bankLink').removeClass('active');
	$('a.perDocLink').removeClass('active');
	
	$('#addList').hide();
	$('#annPayList').hide();
	$('#bankList').hide();
	$('#perDocList').hide();
	
	$('#displayRecord').show();
	$('#detailRecord').hide();
}
// Register our on-view-load handler
gadgets.util.registerOnLoadHandler(init);