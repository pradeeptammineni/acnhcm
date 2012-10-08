var mini;
var personID, todaysDate, dValEnd, dValBeg, aValEnd, aValBeg = '';
var isAddFet = 0, isAddFine = 0, isBanFet = 0, isPerFet = 0, isPerFine = 0, isPayFet = 0;
var ADDRESS_SUBTYPE = '3';
var BASICPAY_SUBTYPE = '0';
var BANKDETAIL_SUBTYPE = '0';
var PERSDOC_SUBTYPE = 'PP';
var SAPEMPID_LENGTH = 8;


// On view load, wire up static actions and retrieve initial data
function init() {
  // Adjust the height of the app!
	gadgets.window.adjustHeight();
	//Set focus on the search criteria fields.
	$('#person-first-name').focus();
	//Link the "Search" button to EmpSearch
	$("#emp-id-search-button").click(onEmpSearch);
	//From "Search Results" -> BACK to "Search" form
	$("#results-back").click(onBackDetail);
	$("#insert-details").click(insertDetails);
	mini = new gadgets.MiniMessage();
}

function checkPersonID(empID) {
	var temp = empID;
	var i=0;
	var len = SAPEMPID_LENGTH - temp.length;
	for (i=0;i<len;i++) {
		empID = '0'+empID;
	}
	console.log(empID);
	return empID;
}

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

	//If this is invoked from APP Actions,
	//fetch the data differently
	personID = $('#person-id').val();
	personID = $.trim(personID);
	if (personID == '') {
		$('#response-message').html("<b>Please enter the employee ID.</b>");
		$('#person-id').focus();
		return;			
	}
	
	personID = checkPersonID(personID);
	
	$('#emp-id-search-button').text("Processing...");
	$('#emp-id-search-button').attr('disabled','disabled');		
	
	var soap_envelope = '<soapenv:Envelope xmlns:soapenv="http://schemas.xmlsoap.org/soap/envelope/" xmlns:urn="urn:sap-com:document:sap:soap:functions:mc-style"><soapenv:Header/><soapenv:Body><urn:EmployeeGetdata><Communication><item><Perno></Perno><Infotype></Infotype><Subtype></Subtype><ObjectId></ObjectId><LockInd></LockInd><ToDate></ToDate><FromDate></FromDate><Seqno></Seqno><ChOn></ChOn><ChangedBy></ChangedBy><HistFlag></HistFlag><Textflag></Textflag><RefFlag></RefFlag><CnfrmFlag></CnfrmFlag><Screenctrl></Screenctrl><Reason></Reason><Flag1></Flag1><Flag2></Flag2><Flag3></Flag3><Flag4></Flag4><Reserved1></Reserved1><Reserved2></Reserved2><Usertype></Usertype><Userid></Userid><UsridLong></UsridLong></item></Communication><Costcenter></Costcenter><Date>'+todaysDate+'</Date><EmployeeId>'+personID+'</EmployeeId><Extension></Extension><FstNameK></FstNameK><FstNameR></FstNameR><FstnameM></FstnameM><Jobtxt></Jobtxt><JobtxtLg></JobtxtLg><LastnameM></LastnameM><LiplateNo></LiplateNo><LstNameK></LstNameK><LstNameR></LstNameR><OrgAssignment><item><Perno></Perno><Infotype></Infotype><Subtype></Subtype><ObjectId></ObjectId><LockInd></LockInd><ToDate></ToDate><FromDate></FromDate><Seqno></Seqno><ChOn></ChOn><ChangedBy></ChangedBy><HistFlag></HistFlag><Textflag></Textflag><RefFlag></RefFlag><CnfrmFlag></CnfrmFlag><Screenctrl></Screenctrl><Reason></Reason><Flag1></Flag1><Flag2></Flag2><Flag3></Flag3><Flag4></Flag4><Reserved1></Reserved1><Reserved2></Reserved2><CompCode></CompCode><PersArea></PersArea><Egroup></Egroup><Esubgroup></Esubgroup><OrgKey></OrgKey><BusArea></BusArea><PSubarea></PSubarea><LegPerson></LegPerson><Payarea></Payarea><Contract></Contract><Costcenter></Costcenter><OrgUnit></OrgUnit><Position></Position><Job></Job><Supervisor></Supervisor><PayrAdmin></PayrAdmin><PersAdmin></PersAdmin><TimeAdmin></TimeAdmin><SortName></SortName><Name></Name><Objecttype></Objecttype><Admingroup></Admingroup><CoArea></CoArea><FundsCtr></FundsCtr><Fund></Fund><Orgtxt></Orgtxt><Jobtxt></Jobtxt><Postxt></Postxt><Fkber></Fkber><GrantNbr></GrantNbr></item></OrgAssignment><Orgtxt></Orgtxt><PersonalData><item><Perno></Perno><Infotype></Infotype><Subtype></Subtype><ObjectId></ObjectId><LockInd></LockInd><ToDate></ToDate><FromDate></FromDate><Seqno></Seqno><ChOn></ChOn><ChangedBy></ChangedBy><HistFlag></HistFlag><Initials></Initials><LastName></LastName><LastName2></LastName2><Firstname></Firstname><Title></Title><Title2></Title2><AriTitle></AriTitle><Nameaffix></Nameaffix><Nameprefix></Nameprefix><KnownAs></KnownAs><NameForm></NameForm><Formofadr></Formofadr><Gender></Gender><Birthdate></Birthdate><Birthctry></Birthctry><Birthstate></Birthstate><Birthplace></Birthplace><National></National><National2></National2><National3></National3><Langu></Langu><Religion></Religion><MarStatus></MarStatus><MarDate></MarDate><NoOChldr></NoOChldr><NameCon></NameCon><Permo></Permo><Perid></Perid><Birthdtpp></Birthdtpp><FstNameK></FstNameK><LstNameK></LstNameK><FstNameR></FstNameR><LstNameR></LstNameR><BirthnmeK></BirthnmeK><BirthnmeR></BirthnmeR><NicknameK></NicknameK><NicknameR></NicknameR><Birthyear></Birthyear><Birthmonth></Birthmonth><Birthday></Birthday><LastnameM></LastnameM><FstnameM></FstnameM></item></PersonalData><PhoneNo></PhoneNo><Postxt></Postxt><PostxtLg></PostxtLg><Readdb></Readdb><RoomNo></RoomNo><Userid></Userid></urn:EmployeeGetdata></soapenv:Body></soapenv:Envelope>';
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
					$('#emp-id-search-button').text("Search");
					$('#emp-id-search-button').removeAttr('disabled');
					gadgets.window.adjustHeight();
				}
			}
		else
		{
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
				$('#emp-id-search-button').text("Search");
				$('#emp-id-search-button').removeAttr('disabled');		
				$('#person-id').focus();
				gadgets.window.adjustHeight();
			}
			else { 
				
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
					
					$("#detailEmpID").html(fPerNo);
					$("#detailName").html('<b>'+fFirstName+' '+fLastName+'</b>');
					$("#detailCCode").html(fCompCode);
					$("#detailTeam").html(fOrgText);
					$("#detailJTitle").html(fJobText);
					$("#detailPTitle").html(fPosText);
					$("#detailCCenter").html(fCostCenter);
					$("#detailEID").html(fEmailID);
					
					$("#search-form").hide();
					$('#emp-id-search-button').text("Search");
					$('#emp-id-search-button').removeAttr('disabled');						
					$("#detailRecord").show();
					showAddress();
				});				
			}
		}
	});
}

$('a.perDocLink').click(function() {
	$('a.addLink').removeClass('active');
	$('a.annPayLink').removeClass('active');
	$('a.bankLink').removeClass('active');
	$(this).addClass('active');
	
	$('#addList').hide();
	$('#annPayList').hide();
	$('#bankList').hide();
	$('#perDocList').show();
	gadgets.window.adjustHeight();

	$('#response-status').html("");
	if (isPerFet == 1) {
		if (isPerFine == 0) {
			$('#response-status').html("<b>No Personal Document details found for the employee.</b>");
			gadgets.window.adjustHeight();
		}
	}
	
	if (isPerFet == 0)
	{
		showLoading();	
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
			gadgets.window.adjustHeight();
			if (dValBeg != '' && dValEnd != '') {
				soap_envelope = '<soapenv:Envelope xmlns:soapenv="http://schemas.xmlsoap.org/soap/envelope/" xmlns:urn="urn:sap-com:document:sap:soap:functions:mc-style"><soapenv:Header/><soapenv:Body><urn:EmppersidGetdetail><Employeenumber>'+personID+'</Employeenumber><Lockindicator></Lockindicator><Molga></Molga><Objectid></Objectid><Recordnumber></Recordnumber><Subtype>'+PERSDOC_SUBTYPE+'</Subtype><Validitybegin>'+dValBeg+'</Validitybegin><Validityend>'+dValEnd+'</Validityend></urn:EmppersidGetdetail></soapenv:Body></soapenv:Envelope>';		
				osapi.jive.connects.post({
						'alias' : 'SAPHCM',
						'href' : '/z_bapi_emppersid_getdetail/801/z_bapi_emppersid_getdetail/bind1',
						'body' : soap_envelope,
						'format' : 'text',
						'headers' : { 'content-type' : ['text/xml'] }
					}).execute(function(recallback) {
						
						empData = $.parseXML(recallback.content);
						$docDetails= $(empData);

						//Populate the Document table
						$("#docType").val($docDetails.find('Subtypetext').text());
						$("#docNum").val($docDetails.find('Docissuenumber').text());
						$("#docIssDate").val($docDetails.find('Personalidissuedt').text());
						$("#docExpiryDate").val($docDetails.find('Idexpirydate').text());
						$("#docIssPlace").val($docDetails.find('Idissuedplace').text());
						$("#docIssCountry").val($docDetails.find('Idissuedcountry').text());
						$("#docIssAuth").val($docDetails.find('Issuingauthority').text());
						isPerFet = 1;
				});
			}
			else {
				isPerFet = 1;
				isPerFine = 0;
				$('#response-status').html("<b>No Personal Document details found for the employee.</b>");
				hideLoading();
				gadgets.window.adjustHeight();
			}
		});
	}	
});

$('a.bankLink').click(function() {
	$('a.addLink').removeClass('active');
	$('a.annPayLink').removeClass('active');
	$('a.perDocLink').removeClass('active');
	$(this).addClass('active');
	
	$('#addList').hide();
	$('#annPayList').hide();
	$('#bankList').show();
	$('#perDocList').hide();
	$('#response-status').html("");
	if (isBanFet == 1 && isBanFine == 0) {
		$('#response-status').html("<b>No Bank details found for the employee.</b>");
		gadgets.window.adjustHeight();
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
			console.log("Bank Details: "+response.content);
			var bankDetails, bankData, tempData, tValBeg, tValEnd = '';
			bankData = $.parseXML(response.content);
			$tempData = $(bankData);
			tValBeg = $tempData.find('Validbegin').text();
			tValEnd = $tempData.find('Validend').text();
			if (tValBeg != '' && tValEnd != '') {
				soap_envelope = '<soapenv:Envelope xmlns:soapenv="http://schemas.xmlsoap.org/soap/envelope/" xmlns:urn="urn:sap-com:document:sap:soap:functions:mc-style"><soapenv:Header/><soapenv:Body><urn:BankdetailGetdetail><Employeenumber>'+personID+'</Employeenumber><Lockindicator></Lockindicator><Objectid></Objectid><Recordnumber></Recordnumber><Subtype>'+BANKDETAIL_SUBTYPE+'</Subtype><Validitybegin>'+tValBeg+'</Validitybegin><Validityend>'+tValEnd+'</Validityend></urn:BankdetailGetdetail></soapenv:Body></soapenv:Envelope>';
				osapi.jive.connects.post({
					'alias' : 'SAPHCM',
					'href' : '/z_bapi_bankdetail_getdetail/801/z_bapi_bankdetail_getdetail/bind1',
					'body' : soap_envelope,
					'format' : 'text',
					'headers' : { 'content-type' : ['text/xml'] }
				}).execute(function(callback) {
					console.log("Response from Bank 2: "+callback.content);
					bankData = $.parseXML(callback.content);
					$bankDetails= $(bankData);
					
					//Populate the address table
					$("#bankKey").html($bankDetails.find('Bankkey').text());
					$("#bankAcNum").html($bankDetails.find('Accountno').text());
					$("#bankCheck").html($bankDetails.find('Checkdigit').text());
					$("#bankIBAN").html($bankDetails.find('Iban').text());
					isBanFet = 1;
					isBanFine = 1;
					hideLoading();
					gadgets.window.adjustHeight();					
				});
			}
			else {
				isBanFet = 1;
				isBanFine = 0;
				$('#response-status').html("<b>No Bank details found for the employee.</b>");
				hideLoading();
				gadgets.window.adjustHeight();
			}
		});
	}
});

$('a.annPayLink').click(function() {
	$('a.addLink').removeClass('active');
	$('a.bankLink').removeClass('active');
	$('a.perDocLink').removeClass('active');
	$(this).addClass('active');
	
	$('#addList').hide();
	$('#annPayList').show();
	$('#bankList').hide();
	$('#perDocList').hide();
	gadgets.window.adjustHeight();
	
	$('#response-status').html("");
	if (isPayFet == 1 && isPayFine == 0) {
		$('#response-status').html("<b>No Annual Pay details found for the employee.</b>");
		gadgets.window.adjustHeight();
	}
	
	gadgets.window.adjustHeight();
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
			console.log("Basic Pay:"+response);
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
					console.log("Response from Pay 2: "+callback.content);
					payData = $.parseXML(callback.content);
					$payDetails= $(payData);
					//Populate the address table
					$("#payArea").html($payDetails.find('Payscalearea').text());
					$("#payGroup").html($payDetails.find('Payscalegroup').text());
					$("#payLevel").html($payDetails.find('Payscalelevel').text());
					$("#paySalary").html($payDetails.find('Annualsalary').text());
					$("#payCurrency").html($payDetails.find('Currencyannualsalary').text());
					isPayFet = 1;
					isPayFine = 1;
					hideLoading();
					gadgets.window.adjustHeight();					
				});
			}
			else {
				isPayFet = 1;
				isPayFine = 0;
				$('#response-status').html("<b>No Annual Pay details found for the employee.</b>");
				hideLoading();
				gadgets.window.adjustHeight();
			}
		});
	}
});


$('a.addLink').click(function(){
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

	$('#response-status').html("");
	if (isAddFet == 1) {
		if (isAddFine == 0) {
			$('#response-status').html("<b>No Address details found for the employee.</b>");
			gadgets.window.adjustHeight();
		}
	}
	
	gadgets.window.adjustHeight();
	if (isAddFet == 0)
	{
		showLoading();
		soap_envelope = '<soapenv:Envelope xmlns:soapenv="http://schemas.xmlsoap.org/soap/envelope/" xmlns:urn="urn:sap-com:document:sap:soap:functions:mc-style"><soapenv:Header/><soapenv:Body><urn:AddressempGetlist><Addressempkey><item><Employeeno></Employeeno><Subtype></Subtype><Objectid></Objectid><Lockindic></Lockindic><Validend></Validend><Validbegin></Validbegin><Recordnr></Recordnr></item></Addressempkey><Employeenumber>'+personID+'</Employeenumber><Subtype>'+ADDRESS_SUBTYPE+'</Subtype><Timeintervalhigh>'+todaysDate+'</Timeintervalhigh><Timeintervallow>'+todaysDate+'</Timeintervallow></urn:AddressempGetlist></soapenv:Body></soapenv:Envelope>';
		console.log(soap_envelope);
		osapi.jive.connects.post({
		'alias' : 'SAPHCM',
		'href' : '/z_bapi_addressemp_getlist/801/z_bapi_addressemp_getlist/bind1',
		'body' : soap_envelope,
		'format' : 'text',
		'headers' : { 'content-type' : ['text/xml'] }
		}).execute(function(callback) {
			var addDetails, empData, tempData = '';
			empData = $.parseXML(callback.content);
			$tempData = $(empData);
			$addDetails = $tempData.find('Addressempkey');
			$addDetails = $addDetails.find('item');
			aValBeg = $addDetails.children('Validbegin').text();
			aValEnd = $addDetails.children('Validend').text();
			gadgets.window.adjustHeight();
			if (aValBeg != '' && aValEnd != '') {
				soap_envelope = '<soapenv:Envelope xmlns:soapenv="http://schemas.xmlsoap.org/soap/envelope/" xmlns:urn="urn:sap-com:document:sap:soap:functions:mc-style"><soapenv:Header/><soapenv:Body><urn:AddressempGetdetail><Employeenumber>'+personID+'</Employeenumber><Lockindicator></Lockindicator><Objectid></Objectid><Recordnumber></Recordnumber><Subtype>'+ADDRESS_SUBTYPE+'</Subtype><Validitybegin>'+aValBeg+'</Validitybegin><Validityend>'+aValEnd+'</Validityend></urn:AddressempGetdetail></soapenv:Body></soapenv:Envelope>';	
				console.log(soap_envelope);
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
						$("#addCO").html($addDetails.find('Coname').text());
						$("#addLine1").html($addDetails.find('Streetandhouseno').text());
						$("#addLine2").html($addDetails.find('Scndaddressline').text());
						$("#addCity").html($addDetails.find('City').text());
						$("#addCode").html($addDetails.find('Postalcodecity').text());
						$("#addState").html($addDetails.find('State').text());
						$("#addCountry").html($addDetails.find('Country').text());
						isAddFet = 1;
						isAddFine = 1;
						hideLoading();
						gadgets.window.adjustHeight();					
				});
			}
			else {
				isAddFet = 1;
				isAddFine = 0;
				$('#response-status').html("<b>No Address details found for the employee.</b>");
				hideLoading();
				gadgets.window.adjustHeight();			
			}
		});
	}
}

function clearAll () {
	isAddFet = 0, isBanFet = 0, isPerFet = 0, isPayFet = 0;
	isAddFine = 0, isBanFine = 0, isPerFine = 0, isPayFine = 0;
	$('#detailCCode').html("");
	$('#detailTeam').html("");
	$('#detailJTitle').html("");
	$('#detailPTitle').html("");
	$('#detailCCenter').html("");
	$('#detailEID').html("");
	
	$('#addCO').html("");
	$('#addLine1').html("");
	$('#addLine2').html("");
	$('#addCity').html("");
	$('#addCode').html("");
	$('#addState').html("");
	$('#addCountry').html("");

	$('#payArea').html("");
	$('#payGroup').html("");
	$('#payLevel').html("");
	$('#paySalary').html("");
	$('#payCurrency').html("");


	$('#bankKey').html("");
	$('#bankAcNum').html("");
	$('#bankCheck').html("");
	$('#bankIBAN').html("");
	
	$('#docType').html("");
	$('#docNum').html("");
	$('#docIssDate').html("");
	$('#docExpiryDate').html("");
	$('#docIssPlace').html("");
	$('#docIssCountry').html("");	
	$('#docIssAuth').html("");	

	$('#response-status').html("");
	gadgets.window.adjustHeight();
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
	
	//If it's from Actions or if there is just ONE
	//record in the search results, we may want to 
	//switch to "Search" form!

	//Clear the search form too!

	$('#person-id').val("");
	$('#response-message').html("");
	$('#search-form').show();

	//deQueuePerson();
	//Clear all the form details
	clearAll();	
	gadgets.window.adjustHeight();
}

function insertDetails() {
	//detailRecord.innerHTML
	//addList annPayList bankList perDocList
	// if ($('#addList').is(":visible"))  { get the innerHTML }
	var empText = '<br/><hr/><h3>Employee Details</h3><table border="1">'+document.getElementById("detailPerson").innerHTML+'</table>';
	if ($('#addList').is(":visible"))  { 
		empText = empText+'<br/><h3>Address Details</h3><table border="1">'+document.getElementById("addList").innerHTML+'</table>';
	}
	else if ($('#annPayList').is(":visible"))  { 
		empText = empText+'<br/><h3>Annual Pay Details</h3><table border="1">'+document.getElementById("annPayList").innerHTML+'</table>';
	}
	else if ($('#bankList').is(":visible"))  { 
		empText = empText+'<br/><h3>Bank Details</h3><table border="1">'+document.getElementById("bankList").innerHTML+'</table>';
	}
	else if ($('#perDocList').is(":visible"))  { 
		empText = empText+'<br/><h3>Personal Document Details</h3><table border="1">'+document.getElementById("perDocList").innerHTML+'</table>';
	}	
	empText=empText+'<br/><hr/>';
	osapi.jive.core.container.editor().insert(empText);	
}
// Register our on-view-load handler
gadgets.util.registerOnLoadHandler(init);