var mini;
var personID, todaysDate, dValEnd, dValBeg, aValEnd, aValBeg, lockInd, objID = '';
var isAddFet = 0, isAddFine = 0, isBanFet = 0, isPerFet = 0, isPerFine = 0, isPayFet = 0, isSingle = 0;
var ADDRESS_SUBTYPE = '3';
var BASICPAY_SUBTYPE = '0';
var BANKDETAIL_SUBTYPE = '0';
var PERSDOC_SUBTYPE = 'PP';
var SAPEMPID_LENGTH = 8;

var ua = navigator.userAgent,
		eventHandler = (ua.match(/iPad/i)) ? "touchstart" : "click";

// On view load, wire up static actions and retrieve initial data
function init() {
	// Adjust the height of the app!
	jive.canvas.getCanvasDimensions(function(dimensions) {
	  //gadgets.window.adjustHeight(dimensions.height); console.log("Height: "+dimensions.height
	  console.log("Height: "+dimensions.height);
	  gadgets.window.adjustHeight(525);
	});
	
	// Based on the device, adjust the width -- on iPad, we may
	// have to leave room for scrolling - hence 60% !
	xmlTable.style.width = (ua.match(/iPad/i)) ? "60%" : "90%";
	//Set focus on the search criteria fields.
	//$('#person-first-name').focus();
	$("input:text:visible:first").focus();
	//Link the "Search" button to EmpSearch
	$("#emp-search-button").bind(eventHandler, onEmpSearch);
	//From "Search Results" -> BACK to "Search" form
	$("#search-results-back").bind(eventHandler, onBackSearch);
	$("#results-back").bind(eventHandler, onBackDetail);
	$("#submit-address-update").bind(eventHandler, onAddUpdate);
	$("#submit-document-update").bind(eventHandler, onDocUpdate);
	mini = new gadgets.MiniMessage();
}

// Check if person ID has 8 characters (SAPEMPID_LENGTH)
// If it doesn't prefix 0s
function checkPersonID(empID) {
	var temp = empID;
	var i=0;
	var len = SAPEMPID_LENGTH - temp.length;
	for (i=0;i<len;i++) {
		empID = '0'+empID;
	}
	return empID;
}

// Show the "Mask Load"
function showLoading() 
{
	$("#maskLoad").mask("Please Wait...");
}

function hideLoading() 
{
	$("#maskLoad").unmask();
}  
	
//To get today's date in YYYY-MM-DD format
function getTodaysDate()
{
	var d = new Date();
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
	
	todaysDate = getTodaysDate();
	var firstName = $('#person-first-name').val();
	var lastName = $('#person-last-name').val();
	firstName = $.trim(firstName);
	lastName = $.trim(lastName);
	var len1 = firstName.length;
	var len2 = lastName.length;
	if (firstName == '' && lastName == '') {
		$('#response-message').html("<b>Please enter the name(s)</b>");
		$("input:text:visible:first").focus();
		return;
	}
	else if ((len1 <= 2 && len2 <= 2) || (len1 <= 3 && len2 < 1) || (len1 < 1 && len2 <= 3)) {
		$('#response-message').html("<b>Please enter longer names for optimal search.</b>");
		$("input:text:visible:first").focus();
		return;			
	}
	$('#emp-search-button').text("Processing...");
	$('#emp-search-button').attr('disabled','disabled');
	
	var soap_envelope = '<soapenv:Envelope xmlns:soapenv="http://schemas.xmlsoap.org/soap/envelope/" xmlns:urn="urn:sap-com:document:sap:soap:functions:mc-style"><soapenv:Header/><soapenv:Body><urn:EmployeeGetdata><Communication><item><Perno></Perno><Infotype></Infotype><Subtype></Subtype><ObjectId></ObjectId><LockInd></LockInd><ToDate></ToDate><FromDate></FromDate><Seqno></Seqno><ChOn></ChOn><ChangedBy></ChangedBy><HistFlag></HistFlag><Textflag></Textflag><RefFlag></RefFlag><CnfrmFlag></CnfrmFlag><Screenctrl></Screenctrl><Reason></Reason><Flag1></Flag1><Flag2></Flag2><Flag3></Flag3><Flag4></Flag4><Reserved1></Reserved1><Reserved2></Reserved2><Usertype></Usertype><Userid></Userid><UsridLong></UsridLong></item></Communication><Costcenter></Costcenter><Date>'+todaysDate+'</Date><EmployeeId></EmployeeId><Extension></Extension><FstNameK></FstNameK><FstNameR></FstNameR><FstnameM>*'+firstName+'*</FstnameM><Jobtxt></Jobtxt><JobtxtLg></JobtxtLg><LastnameM>*'+lastName+'*</LastnameM><LiplateNo></LiplateNo><LstNameK></LstNameK><LstNameR></LstNameR><OrgAssignment><item><Perno></Perno><Infotype></Infotype><Subtype></Subtype><ObjectId></ObjectId><LockInd></LockInd><ToDate></ToDate><FromDate></FromDate><Seqno></Seqno><ChOn></ChOn><ChangedBy></ChangedBy><HistFlag></HistFlag><Textflag></Textflag><RefFlag></RefFlag><CnfrmFlag></CnfrmFlag><Screenctrl></Screenctrl><Reason></Reason><Flag1></Flag1><Flag2></Flag2><Flag3></Flag3><Flag4></Flag4><Reserved1></Reserved1><Reserved2></Reserved2><CompCode></CompCode><PersArea></PersArea><Egroup></Egroup><Esubgroup></Esubgroup><OrgKey></OrgKey><BusArea></BusArea><PSubarea></PSubarea><LegPerson></LegPerson><Payarea></Payarea><Contract></Contract><Costcenter></Costcenter><OrgUnit></OrgUnit><Position></Position><Job></Job><Supervisor></Supervisor><PayrAdmin></PayrAdmin><PersAdmin></PersAdmin><TimeAdmin></TimeAdmin><SortName></SortName><Name></Name><Objecttype></Objecttype><Admingroup></Admingroup><CoArea></CoArea><FundsCtr></FundsCtr><Fund></Fund><Orgtxt></Orgtxt><Jobtxt></Jobtxt><Postxt></Postxt><Fkber></Fkber><GrantNbr></GrantNbr></item></OrgAssignment><Orgtxt></Orgtxt><PersonalData><item><Perno></Perno><Infotype></Infotype><Subtype></Subtype><ObjectId></ObjectId><LockInd></LockInd><ToDate></ToDate><FromDate></FromDate><Seqno></Seqno><ChOn></ChOn><ChangedBy></ChangedBy><HistFlag></HistFlag><Initials></Initials><LastName></LastName><LastName2></LastName2><Firstname></Firstname><Title></Title><Title2></Title2><AriTitle></AriTitle><Nameaffix></Nameaffix><Nameprefix></Nameprefix><KnownAs></KnownAs><NameForm></NameForm><Formofadr></Formofadr><Gender></Gender><Birthdate></Birthdate><Birthctry></Birthctry><Birthstate></Birthstate><Birthplace></Birthplace><National></National><National2></National2><National3></National3><Langu></Langu><Religion></Religion><MarStatus></MarStatus><MarDate></MarDate><NoOChldr></NoOChldr><NameCon></NameCon><Permo></Permo><Perid></Perid><Birthdtpp></Birthdtpp><FstNameK></FstNameK><LstNameK></LstNameK><FstNameR></FstNameR><LstNameR></LstNameR><BirthnmeK></BirthnmeK><BirthnmeR></BirthnmeR><NicknameK></NicknameK><NicknameR></NicknameR><Birthyear></Birthyear><Birthmonth></Birthmonth><Birthday></Birthday><LastnameM></LastnameM><FstnameM></FstnameM></item></PersonalData><PhoneNo></PhoneNo><Postxt></Postxt><PostxtLg></PostxtLg><Readdb></Readdb><RoomNo></RoomNo><Userid></Userid></urn:EmployeeGetdata></soapenv:Body></soapenv:Envelope>';
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
				$('#response-message').html("Unable to process your request.<br/>Please try again.");
				console.log("Encountered an error. Error Code: "+response.error.code);
				$('#emp-search-button').text("Search");
				$('#emp-search-button').removeAttr('disabled');
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
				//console.log(returnMessage);
				$('#response-message').html("<b>"+returnMessage+".</b> <br/>Please try again.");
				$('#emp-search-button').text("Search");
				$('#emp-search-button').removeAttr('disabled');		
				$("input:text:visible:first").focus();
				
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
					isSingle = 0;
					$("table#xmlTable tbody").append(tableData);
					$("table#xmlTable").tablesorter({widthFixed: false, widgets: ['zebra'],sortList: [[0,1]], headers: { 10:{sorter: false}}}).tablesorterPager({container: $("#pager")});
					//Show the records' table and hide the search form.
					$('#recordCount').text(tCount);
					$('#displayRecord').show();
					$('#search-form').hide();
					$('#emp-search-button').text("Search");
					$('#emp-search-button').removeAttr('disabled');					
				}
				else { //Well, you have just one record, you may as well get to the form directly!
					isSingle = 1;
					personID = fPerNo;
					$("#detailEmpID").html(fPerNo);
					$("#detailName").html(fFirstName+' '+fLastName);
					$("#detailCCode").html(fCompCode);
					$("#detailTeam").html(fOrgText);
					$("#detailJTitle").html(fJobText);
					$("#detailPTitle").html(fPosText);
					$("#detailCCenter").html(fCostCenter);
					$("#detailEID").html(fEmailID);
					$('#emp-search-button').text("Search");
					$('#emp-search-button').removeAttr('disabled');						
					$("#search-form").hide();
					$("#detailRecord").show();
					gadgets.window.adjustHeight();
					showAddress();					
				}
			}
		}
	});
}

$('a.perDocLink').bind(eventHandler, function() {
	$('a.addLink').removeClass('active');
	$('a.annPayLink').removeClass('active');
	$('a.bankLink').removeClass('active');
	$(this).addClass('active');
	
	$('#addList').hide();
	$('#annPayList').hide();
	$('#bankList').hide();
	$('#perDocList').show();
	
	$('#submit-address-update').hide();
	
	$('#response-status').html("");
	if (isPerFet == 1) {
		if (isPerFine == 0) {
			$('#response-status').html("<b>No Personal Document details found for the employee.</b>");
			$('#submit-document-update').hide();
			jive.canvas.getCanvasDimensions(function(dimensions) {
			  //gadgets.window.adjustHeight();
			});
		}
		else {
			$('#submit-document-update').show();
		}
	}
	
	if (isPerFet == 0)
	{
		showLoading();
		$('#submit-document-update').show();
		soap_envelope = '<soapenv:Envelope xmlns:soapenv="http://schemas.xmlsoap.org/soap/envelope/" xmlns:urn="urn:sap-com:document:sap:soap:functions:mc-style"><soapenv:Header/><soapenv:Body><urn:EmppersidGetlist><Employeenumber>'+personID+'</Employeenumber><Ppidkey><item><Employeeno></Employeeno><Subtype></Subtype><Objectid></Objectid><Lockindic></Lockindic><Validend></Validend><Validbegin></Validbegin><Recordnr></Recordnr></item></Ppidkey><Subtype>'+PERSDOC_SUBTYPE+'</Subtype><Timeintervalhigh>'+todaysDate+'</Timeintervalhigh><Timeintervallow>'+todaysDate+'</Timeintervallow></urn:EmppersidGetlist></soapenv:Body></soapenv:Envelope>';
		console.log(soap_envelope);
		osapi.jive.connects.post({
		'alias' : 'SAPHCM',
		'href' : '/z_bapi_emppersid_getlist/801/z_bapi_emppersid_getlist/bind1',
		'body' : soap_envelope,
		'format' : 'text',
		'headers' : { 'content-type' : ['text/xml'] }
		}).execute(function(callback) {
			var docDetails, empData, tempData = '';
			empData = $.parseXML(callback.content);
			console.log(callback.content);
			$tempData = $(empData);
			$docDetails = $tempData.find('Ppidkey');
			$docDetails = $docDetails.find('item');
			dValBeg = $docDetails.children('Validbegin').text();
			dValEnd = $docDetails.children('Validend').text();
			if (dValBeg != '' && dValEnd != '') {
				soap_envelope = '<soapenv:Envelope xmlns:soapenv="http://schemas.xmlsoap.org/soap/envelope/" xmlns:urn="urn:sap-com:document:sap:soap:functions:mc-style"><soapenv:Header/><soapenv:Body><urn:EmppersidGetdetail><Employeenumber>'+personID+'</Employeenumber><Lockindicator></Lockindicator><Molga></Molga><Objectid></Objectid><Recordnumber></Recordnumber><Subtype>'+PERSDOC_SUBTYPE+'</Subtype><Validitybegin>'+dValBeg+'</Validitybegin><Validityend>'+dValEnd+'</Validityend></urn:EmppersidGetdetail></soapenv:Body></soapenv:Envelope>';		
				console.log("Personal Doc: "+soap_envelope);
				osapi.jive.connects.post({
						'alias' : 'SAPHCM',
						'href' : '/z_bapi_emppersid_getdetail/801/z_bapi_emppersid_getdetail/bind1',
						'body' : soap_envelope,
						'format' : 'text',
						'headers' : { 'content-type' : ['text/xml'] }
					}).execute(function(recallback) {
						empData = $.parseXML(recallback.content);
						$docDetails= $(empData);
						console.log("Response from Personal Document: "+docDetails);
						
						//Populate the Document table
						$("#docType").val($docDetails.find('Subtypetext').text());
						$("#docNum").val($docDetails.find('Docissuenumber').text());
						$("#docIssDate").val($docDetails.find('Personalidissuedt').text());
						$("#docExpiryDate").val($docDetails.find('Idexpirydate').text());
						$("#docIssPlace").val($docDetails.find('Idissuedplace').text());
						$("#docIssCountry").val($docDetails.find('Idissuedcountry').text());
						$("#docIssAuth").val($docDetails.find('Issuingauthority').text());
						isPerFet = 1;
						isPerFine = 1;
						hideLoading();
						jive.canvas.getCanvasDimensions(function(dimensions) {
							gadgets.window.adjustHeight();
						});
				});				
			}
			else {
				isPerFet = 1;
				isPerFine = 0;
				$('#response-status').html("<b>No Personal Document details found for the employee.</b>");
				$('#submit-document-update').hide();
				hideLoading();
				jive.canvas.getCanvasDimensions(function(dimensions) {
					gadgets.window.adjustHeight();
				});				
			}
		});
	}
});

$('a.bankLink').bind(eventHandler, function() {
	$('a.addLink').removeClass('active');
	$('a.annPayLink').removeClass('active');
	$('a.perDocLink').removeClass('active');
	$(this).addClass('active');
	
	$('#addList').hide();
	$('#annPayList').hide();
	$('#bankList').show();
	$('#perDocList').hide();
	
	$('#submit-address-update').hide();
	$('#submit-document-update').hide();

	$('#response-status').html("");
	if (isBanFet == 1 && isBanFine == 0) {
		$('#response-status').html("<b>No Bank details found for the employee.</b>");
		jive.canvas.getCanvasDimensions(function(dimensions) {
		  //gadgets.window.adjustHeight();
		});
	}

	if (isBanFet == 0)
	{
		showLoading();
		var soap_envelope = '<soapenv:Envelope xmlns:soapenv="http://schemas.xmlsoap.org/soap/envelope/" xmlns:urn="urn:sap-com:document:sap:soap:functions:mc-style"><soapenv:Header/><soapenv:Body><urn:BankdetailGetlist><Bankdetailkey><item><Employeeno></Employeeno><Subtype></Subtype><Objectid></Objectid><Lockindic></Lockindic><Validend></Validend><Validbegin></Validbegin><Recordnr></Recordnr></item></Bankdetailkey><Employeenumber>'+personID+'</Employeenumber><Subtype>'+BANKDETAIL_SUBTYPE+'</Subtype><Timeintervalhigh>'+todaysDate+'</Timeintervalhigh><Timeintervallow>'+todaysDate+'</Timeintervallow></urn:BankdetailGetlist></soapenv:Body></soapenv:Envelope>';
		osapi.jive.connects.post({
			'alias' : 'SAPHCM',
			'href' : '/z_bapi_bankdetail_getlist/801/z_bapi_bankdetail_getlist/bind1',
			'body' : soap_envelope,
			'format' : 'text',
			'headers' : { 'content-type' : ['text/xml'] }
		}).execute(function(response) {
			//console.log("Bank Details: "+response.content);
			var bankDetails, bankData, tempData, tValBeg, tValEnd = '';
			bankData = $.parseXML(response.content);
			$tempData = $(bankData);
			tValBeg = $tempData.find('Validbegin').text();
			tValEnd = $tempData.find('Validend').text();
			console.log("Yeah: "+tValBeg+"..."+tValBeg);
			if (tValBeg != '' && tValEnd != '') {
				soap_envelope = '<soapenv:Envelope xmlns:soapenv="http://schemas.xmlsoap.org/soap/envelope/" xmlns:urn="urn:sap-com:document:sap:soap:functions:mc-style"><soapenv:Header/><soapenv:Body><urn:BankdetailGetdetail><Employeenumber>'+personID+'</Employeenumber><Lockindicator></Lockindicator><Objectid></Objectid><Recordnumber></Recordnumber><Subtype>'+BANKDETAIL_SUBTYPE+'</Subtype><Validitybegin>'+tValBeg+'</Validitybegin><Validityend>'+tValEnd+'</Validityend></urn:BankdetailGetdetail></soapenv:Body></soapenv:Envelope>';
				osapi.jive.connects.post({
					'alias' : 'SAPHCM',
					'href' : '/z_bapi_bankdetail_getdetail/801/z_bapi_bankdetail_getdetail/bind1',
					'body' : soap_envelope,
					'format' : 'text',
					'headers' : { 'content-type' : ['text/xml'] }
				}).execute(function(callback) {
					//console.log("Response from Bank 2: "+callback.content);
					bankData = $.parseXML(callback.content);
					$bankDetails= $(bankData);
					
					//Populate the address table
					$("#bankKey").val($bankDetails.find('Bankkey').text());
					$("#bankAcNum").val($bankDetails.find('Accountno').text());
					$("#bankCheck").val($bankDetails.find('Checkdigit').text());
					$("#bankIBAN").val($bankDetails.find('Iban').text());
					isBanFet = 1;
					isBanFine = 1;
					hideLoading();
					jive.canvas.getCanvasDimensions(function(dimensions) {
					  gadgets.window.adjustHeight();
					});
				});
			}
			else {
				isBanFet = 1;
				isBanFine = 0;
				$('#response-status').html("<b>No Bank details found for the employee.</b>");
				hideLoading();
				jive.canvas.getCanvasDimensions(function(dimensions) {
				  gadgets.window.adjustHeight();
				});				
			}
		});
	}
});

$('a.annPayLink').bind(eventHandler, function() {
	$('a.addLink').removeClass('active');
	$('a.bankLink').removeClass('active');
	$('a.perDocLink').removeClass('active');
	$(this).addClass('active');
	
	$('#addList').hide();
	$('#annPayList').show();
	$('#bankList').hide();
	$('#perDocList').hide();
	
	$('#submit-address-update').hide();
	$('#submit-document-update').hide();
	
	$('#response-status').html("");
	if (isPayFet == 1 && isPayFine == 0) {
		$('#response-status').html("<b>No Annual Pay details found for the employee.</b>");
		jive.canvas.getCanvasDimensions(function(dimensions) {
		  //gadgets.window.adjustHeight();
		});
	}
	
	if (isPayFet == 0)
	{
		showLoading();
		var soap_envelope = '<soapenv:Envelope xmlns:soapenv="http://schemas.xmlsoap.org/soap/envelope/" xmlns:urn="urn:sap-com:document:sap:soap:functions:mc-style"><soapenv:Header/><soapenv:Body><urn:BasicpayGetlist><Basicpayempkey><item><Employeeno></Employeeno><Subtype></Subtype><Objectid></Objectid><Lockindic></Lockindic><Validend></Validend><Validbegin></Validbegin><Recordnr></Recordnr></item></Basicpayempkey><Employeenumber>'+personID+'</Employeenumber><!--Optional:--><Subtype>'+BASICPAY_SUBTYPE+'</Subtype><Timeintervalhigh>'+todaysDate+'</Timeintervalhigh><Timeintervallow>'+todaysDate+'</Timeintervallow></urn:BasicpayGetlist></soapenv:Body></soapenv:Envelope>';
		osapi.jive.connects.post({
			'alias' : 'SAPHCM',
			'href' : '/z_bapi_basicpay_getlist/801/z_bapi_basicpay_getlist/bind1',
			'body' : soap_envelope,
			'format' : 'text',
			'headers' : { 'content-type' : ['text/xml'] }
		}).execute(function(response) {
			//console.log("Basic Pay:"+response);
			var payDetails, payData, tempData, tValBeg, tValEnd = '';
			payData = $.parseXML(response.content);
			$tempData = $(payData);
			tValBeg = $tempData.find('Validbegin').text();
			tValEnd = $tempData.find('Validend').text();
			if (tValBeg != '' && tValEnd!='') {
				soap_envelope = '<soapenv:Envelope xmlns:soapenv="http://schemas.xmlsoap.org/soap/envelope/" xmlns:urn="urn:sap-com:document:sap:soap:functions:mc-style"><soapenv:Header/><soapenv:Body><urn:BasicpayGetdetail><Employeenumber>'+personID+'</Employeenumber><Lockindicator></Lockindicator><Objectid></Objectid><Recordnumber></Recordnumber><Subtype>'+BASICPAY_SUBTYPE+'</Subtype><Validitybegin>'+tValBeg+'</Validitybegin><Validityend>'+tValEnd+'</Validityend><Wagetypes><item><Wagetype></Wagetype><Amount></Amount><Number></Number><Timeunit></Timeunit><Indvaluat></Indvaluat><Addtotamnt></Addtotamnt><Operindic></Operindic><Nameofwagetype></Nameofwagetype></item></Wagetypes></urn:BasicpayGetdetail></soapenv:Body></soapenv:Envelope>';
				osapi.jive.connects.post({
					'alias' : 'SAPHCM',
					'href' : '/z_bapi_basicpay_getdetail/801/z_bapi_basicpay_getdetail/bind1',
					'body' : soap_envelope,
					'format' : 'text',
					'headers' : { 'content-type' : ['text/xml'] }
				}).execute(function(callback) {
					//console.log("Response from Pay 2: "+callback.content);
					payData = $.parseXML(callback.content);
					$payDetails= $(payData);
					//Populate the address table
					$("#payArea").val($payDetails.find('Payscalearea').text());
					$("#payGroup").val($payDetails.find('Payscalegroup').text());
					$("#payLevel").val($payDetails.find('Payscalelevel').text());
					$("#paySalary").val($payDetails.find('Annualsalary').text());
					$("#payCurrency").val($payDetails.find('Currencyannualsalary').text());
					isPayFet = 1;
					isPayFine = 1;
					jive.canvas.getCanvasDimensions(function(dimensions) {
					  gadgets.window.adjustHeight();
					});					
					hideLoading();
				});				
			}
			else {
				isPayFet = 1;
				isPayFine = 0;
				$('#response-status').html("<b>No Annual Pay details found for the employee.</b>");
				jive.canvas.getCanvasDimensions(function(dimensions) {
				  gadgets.window.adjustHeight();
				});					
				hideLoading();
			}
		});
	}
});


$('a.addLink').bind(eventHandler, function(){
	showAddress();
});

// The "Address" link in the top-menu
function showAddress() {
	$('a.annPayLink').removeClass('active');
	$('a.bankLink').removeClass('active');
	$('a.perDocLink').removeClass('active');
	$('a.addLink').addClass('active');
	
	$('#addList').show();
	$('#annPayList').hide();
	$('#bankList').hide();
	$('#perDocList').hide();

	$('#submit-document-update').hide();
	
	$('#response-status').html("");
	if (isAddFet == 1) {
		if (isAddFine == 0) {
			$('#response-status').html("<b>No Address details found for the employee.</b>");
			jive.canvas.getCanvasDimensions(function(dimensions) {
			  //gadgets.window.adjustHeight();
			});
		}
		else {
			$('#submit-address-update').show();
		}
	}
	
	if (isAddFet == 0)
	{
		showLoading();
		$('#submit-address-update').show();
		soap_envelope = '<soapenv:Envelope xmlns:soapenv="http://schemas.xmlsoap.org/soap/envelope/" xmlns:urn="urn:sap-com:document:sap:soap:functions:mc-style"><soapenv:Header/><soapenv:Body><urn:AddressempGetlist><Addressempkey><item><Employeeno></Employeeno><Subtype></Subtype><Objectid></Objectid><Lockindic></Lockindic><Validend></Validend><Validbegin></Validbegin><Recordnr></Recordnr></item></Addressempkey><Employeenumber>'+personID+'</Employeenumber><Subtype>'+ADDRESS_SUBTYPE+'</Subtype><Timeintervalhigh>'+todaysDate+'</Timeintervalhigh><Timeintervallow>'+todaysDate+'</Timeintervallow></urn:AddressempGetlist></soapenv:Body></soapenv:Envelope>';
		osapi.jive.connects.post({
		'alias' : 'SAPHCM',
		'href' : '/z_bapi_addressemp_getlist/801/z_bapi_addressemp_getlist/bind1',
		'body' : soap_envelope,
		'format' : 'text',
		'headers' : { 'content-type' : ['text/xml'] }
		}).execute(function(callback) {
			var addDetails, empData, tempData = '';
			console.log(callback.content);
			empData = $.parseXML(callback.content);
			$tempData = $(empData);
			$addDetails = $tempData.find('Addressempkey');
			$addDetails = $addDetails.find('item');
			aValBeg = $addDetails.children('Validbegin').text();
			aValEnd = $addDetails.children('Validend').text();
			if (aValBeg != '' && aValEnd != '') {
				soap_envelope = '<soapenv:Envelope xmlns:soapenv="http://schemas.xmlsoap.org/soap/envelope/" xmlns:urn="urn:sap-com:document:sap:soap:functions:mc-style"><soapenv:Header/><soapenv:Body><urn:AddressempGetdetail><Employeenumber>'+personID+'</Employeenumber><Lockindicator></Lockindicator><Objectid></Objectid><Recordnumber></Recordnumber><Subtype>'+ADDRESS_SUBTYPE+'</Subtype><Validitybegin>'+aValBeg+'</Validitybegin><Validityend>'+aValEnd+'</Validityend></urn:AddressempGetdetail></soapenv:Body></soapenv:Envelope>';		
				osapi.jive.connects.post({
						'alias' : 'SAPHCM',
						'href' : '/z_bapi_addressemp_getdetail/801/z_bapi_addressemp_getdetail/bind1',
						'body' : soap_envelope,
						'format' : 'text',
						'headers' : { 'content-type' : ['text/xml'] }
					}).execute(function(recallback) {
						//console.log("Response from Address 2: "+recallback.content);
						empData = $.parseXML(recallback.content);
						$addDetails= $(empData);
						//$addDetails = $tempData.find('n0:AddressempGetdetailResponse');
						//Populate the address table
						$("#addCO").val($addDetails.find('Coname').text());
						$("#addLine1").val($addDetails.find('Streetandhouseno').text());
						$("#addLine2").val($addDetails.find('Scndaddressline').text());
						$("#addCity").val($addDetails.find('City').text());
						$("#addCode").val($addDetails.find('Postalcodecity').text());
						$("#addState").val($addDetails.find('State').text());
						$("#addCountry").val($addDetails.find('Country').text());
						isAddFet = 1;
						isAddFine = 1;
						jive.canvas.getCanvasDimensions(function(dimensions) {
						  gadgets.window.adjustHeight();
						});										
						hideLoading();
				});				
			}
			else {
				isAddFet = 1;
				isAddFine = 0;
				$('#response-status').html("<b>No Address details found for the employee.</b>");
				$('#submit-address-update').hide();
				jive.canvas.getCanvasDimensions(function(dimensions) {
				  gadgets.window.adjustHeight();
				});				
				hideLoading();
			}
		});
	}
}

function onAddUpdate() {
	var soap_envelope, addCO, addLine1, addLine2, 
			addCity, addCode, addState, addCountry = '';
	showLoading();
	addCO = $("#addCO").val();
	addLine1 = $("#addLine1").val();
	addLine2 = $("#addLine2").val();
	addCity = $("#addCity").val();
	addCode = $("#addCode").val();
	addState = $("#addState").val();
	addCountry = $("#addCountry").val();
	soap_envelope = '<soapenv:Envelope xmlns:soapenv="http://schemas.xmlsoap.org/soap/envelope/" xmlns:urn="urn:sap-com:document:sap:soap:functions:mc-style"><soapenv:Header/><soapenv:Body><urn:ZbapiAddressempChange><City>'+addCity+'</City><Coname>'+addCO+'</Coname><Country>'+addCountry+'</Country><District>?</District><Employeenumber>'+personID+'</Employeenumber><Lockindicator></Lockindicator><Nocommit></Nocommit><Objectid></Objectid><Postalcodecity>'+addCode+'</Postalcodecity><Recordnumber>000</Recordnumber><Scndaddressline>'+addLine2+'</Scndaddressline><State>'+addState+'</State><Streetandhouseno>'+addLine1+'</Streetandhouseno><Subtype>'+ADDRESS_SUBTYPE+'</Subtype><Telephonenumber></Telephonenumber><Validitybegin>'+aValBeg+'</Validitybegin><Validityend>'+aValEnd+'</Validityend></urn:ZbapiAddressempChange></soapenv:Body></soapenv:Envelope>';
	//console.log(soap_envelope);
	osapi.jive.connects.post({
			'alias' : 'SAPHCM',
			'href' : '/zbapi_addressemp_change/801/zbapi_addressemp_change/bind1',
			'body' : soap_envelope,
			'format' : 'text',
			'headers' : { 'content-type' : ['text/xml'] }
		}).execute(function(callback) {
			$('#response-status').html("<b>Address successfully updated.</b>");
			hideLoading();
			console.log("Address updated: "+callback.content);
			jive.canvas.getCanvasDimensions(function(dimensions) {
			  gadgets.window.adjustHeight();
			});
		});			
}

function onDocUpdate() {
	var soap_envelope, docNum, docIssDate, docExpiryDate, 
			docIssPlace, docIssCountry, docIssAuth, addCountry = '';
	showLoading();
	//docType = $("#docType").val();
	docNum = $("#docNum").val();
	docIssDate = $("#docIssDate").val();
	docExpiryDate = $("#docExpiryDate").val();
	docIssPlace = $("#docIssPlace").val();
	docIssCountry = $("#docIssCountry").val();
	docIssAuth = $("#docIssAuth").val();
	soap_envelope = '<soapenv:Envelope xmlns:soapenv="http://schemas.xmlsoap.org/soap/envelope/" xmlns:urn="urn:sap-com:document:sap:soap:functions:mc-style"><soapenv:Header/><soapenv:Body><urn:ZbapiEmppersidChange><Applicationdate></Applicationdate><Applicationstatus></Applicationstatus><Docissuenumber>'+docNum+'</Docissuenumber><Employeenumber>'+personID+'</Employeenumber><Icnumber></Icnumber><Idcountry></Idcountry><Idexpirydate>'+docExpiryDate+'</Idexpirydate><Idissuedcountry>'+docIssCountry+'</Idissuedcountry><Idissuedplace>'+docIssPlace+'</Idissuedplace><Indicatorconschkoverride></Indicatorconschkoverride><Issuingauthority>'+docIssAuth+'</Issuingauthority><Lengthofmultiplevisa></Lengthofmultiplevisa><Lockindicator></Lockindicator><Nocommit></Nocommit><Objectid></Objectid><Oldicnumber></Oldicnumber><Personalidissuedt>'+docIssDate+'</Personalidissuedt><Recordnumber>000</Recordnumber><Rejectreason></Rejectreason><Singlemultiple>?</Singlemultiple><Subtype>'+PERSDOC_SUBTYPE+'</Subtype><Timeunitfornextpayment></Timeunitfornextpayment><Usedfromdate></Usedfromdate><Usedtodate></Usedtodate><Validitybegin>'+dValBeg+'</Validitybegin><Validityend>'+dValEnd+'</Validityend></urn:ZbapiEmppersidChange></soapenv:Body></soapenv:Envelope>';
	//console.log(soap_envelope);
	osapi.jive.connects.post({
			'alias' : 'SAPHCM',
			'href' : '/zbapi_emppersid_change/801/zbapi_emppersid_change/bind1',
			'body' : soap_envelope,
			'format' : 'text',
			'headers' : { 'content-type' : ['text/xml'] }
		}).execute(function(callback) {
			$('#response-status').html("<b>Personal Document details successfully updated.</b>");
			jive.canvas.getCanvasDimensions(function(dimensions) {
			  gadgets.window.adjustHeight();
			});			
			hideLoading();
			//console.log("Address updated: "+callback.content);
		});			
}

// On double-clicking each row, let's 
// get the details displayed...
//$('tr.rowPerson').bind(eventHandler, function(){
$('tr.rowPerson').live (eventHandler, function(){
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
	
	$("#detailEmpID").html(personID);
	$("#detailName").html(fullName);
	$("#detailCCode").html(compCode);
	$("#detailTeam").html(orgText);
	$("#detailJTitle").html(jobText);
	$("#detailPTitle").html(posText);
	$("#detailCCenter").html(costCenter);
	$("#detailEID").html(emailID);
	
	$("#displayRecord").hide();
	$("#detailRecord").show();
	showAddress();
	//console.log(personID+"--"+fullName+"--"+compCode+"--"+orgText+"--"+jobText+"--"+posText+"--"+costCenter+"--"+emailID);
});

function clearAll () {
	isAddFet = 0, isBanFet = 0, isPerFet = 0, isPayFet = 0;
	isAddFine = 0, isBanFine = 0, isPerFine = 0, isPayFine = 0;
	$('#detailCCode').val("");
	$('#detailTeam').val("");
	$('#detailJTitle').val("");
	$('#detailPTitle').val("");
	$('#detailCCenter').val("");
	$('#detailEID').val("");
	
	$('#addCO').val("");
	$('#addLine1').val("");
	$('#addLine2').val("");
	$('#addCity').val("");
	$('#addCode').val("");
	$('#addState').val("");
	$('#addCountry').val("");

	$('#payArea').val("");
	$('#payGroup').val("");
	$('#payLevel').val("");
	$('#paySalary').val("");
	$('#payCurrency').val("");


	$('#bankKey').val("");
	$('#bankAcNum').val("");
	$('#bankCheck').val("");
	$('#bankIBAN').val("");
	
	$('#docType').val("");
	$('#docNum').val("");
	$('#docIssDate').val("");
	$('#docExpiryDate').val("");
	$('#docIssPlace').val("");
	$('#docIssCountry').val("");	
	$('#docIssAuth').val("");
	
	$('#response-status').html("");
	jive.canvas.getCanvasDimensions(function(dimensions) {
	  gadgets.window.adjustHeight();
	});
}

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
	
	$("input:text:visible:first").focus();
	
	// Adjust height!
	jive.canvas.getCanvasDimensions(function(dimensions) {
	  gadgets.window.adjustHeight();
	});
}

// On clicking Back in Detail View, 
// make all sections to disappear.
function onBackDetail () {
	
	$('a.addLink').removeClass('active');
	$('a.annPayLink').removeClass('active');
	$('a.bankLink').removeClass('active');
	$('a.perDocLink').removeClass('active');
	
	$('#addList').hide();
	$('#annPayList').hide();
	$('#bankList').hide();
	$('#perDocList').hide();
	
	$('#detailRecord').hide();
	console.log("Single: "+isSingle);
	
	//If it's from Actions or if there is just ONE
	//record in the search results, we may want to 
	//switch to "Search" form!
	if (isSingle) {
		//Clear the search form too!
		$('#person-first-name').val("");
		$('#person-last-name').val("");
		$('#response-message').html("");
		$('#search-form').show();
	}
	else {
		$('#displayRecord').show();
	}	
	jive.canvas.getCanvasDimensions(function(dimensions) {
	  //gadgets.window.adjustHeight();
	});
	
	//Clear all the form details
	clearAll();	
}

// Register our on-view-load handler
gadgets.util.registerOnLoadHandler(init);