
var latitude="";
var longitude="";

var latitudewq="";
var longitudewq="";

function getLocationInfoAch() {
	var options = { enableHighAccuracy: false};	
	navigator.geolocation.getCurrentPosition(onSuccess, onError, options);	
	$(".errorChk").html("Confirming location. Please wait.");
}
// onSuccess Geolocation
function onSuccess(position) {
	$("#ach_lat").val(position.coords.latitude);
	$("#ach_long").val(position.coords.longitude);
	$(".errorChk").html("Location Confirmed");
}
// onError Callback receives a PositionError object
function onError(error) {
   $("#ach_lat").val(0);
   $("#ach_long").val(0);
   $(".errorChk").html("Failed to Confirmed Location.");
}

function getLocationInfoWq() {
	//$("#wq_lat").val(11111);
   	//$("#wq_long").val(11111);
	navigator.geolocation.getCurrentPosition(onSuccessWq, onErrorWq);		
	$(".errorChk").html("Confirming location. Please wait.");
}

// onSuccess Geolocation
function onSuccessWq(position) {
	$("#wq_lat").val(position.coords.latitude);
	$("#wq_long").val(position.coords.longitude);
	$(".errorChk").html("Location Confirmed");
}
// onError Callback receives a PositionError object
function onErrorWq(error) {
   $("#wq_lat").val(0);
   $("#wq_long").val(0);
   $(".errorChk").html("Failed to Confirmed Location.");
}
//---- online 
var apipath="http://e2.businesssolutionapps.com/planbd/syncmobile_survey/";

//--- local
//var apipath="http://127.0.0.1:8000/planbd/syncmobile_survey/";


var planFlag=0;
var cboFlag=0;
var locationFlag=0;

var achPlanSector='';

var achWord='';
var achCluster='';

var achHndEvent='';
	
var startDt='';
var syncResult='';
var achPlanId='';
var achPlanActivities='';
var achCBOid='';
var achPopulation='';
var achWpHousehold='';
var achHousehold='';
var achMale='';
var achFemale='';
var achGirlsUnder='';
var achBoysUnder='';
var achGirls='';
var achBoys='';
var achDapMale='';
var achDapFemale='';
var achPoorC='';
var achPoorEx='';
var achEthMale='';
var achEthFemale='';


var achLatType='';
var achComDate='';

var achWpTech='';
var achWpComDate='';


var achServiceRecpt='';
var achPhoto='';
var wqPhoto='';
var reviewAchFlag=0; //used for html triger
var reviewAchDisplayFlag=false; //used for save data from review
var arrayId=-1;

var imageName = "";
var imagePathA="";
var imagePathW="";

$(function(){
	
	$('#syncBasic').click(function() {
					
		var mobile=$("#mobile").val() ;
	 	var password=$("#password").val() ;
		
		if (mobile=="" || password==""){
			 $(".errorChk").html("Required mobile no and password");
			 $('#syncBasic').show();	
		 }else{	
			 $('#syncBasic').hide();			 
			 $(".errorChk").html("Sync in progress. Please wait...");
			if(localStorage.sync_code==undefined || localStorage.sync_code==""){
					localStorage.sync_code=0
				}
			
		 	//alert(apipath+'passwordCheck?cid=PLANBD&mobile='+mobile+'&password='+encodeURI(password)+'&sync_code='+localStorage.sync_code);
			$.ajax({				   
//			  url:apipath+'dataSyncCheck?cid=WAB&mobile='+mobile+'&password='+encodeURI(password)+'&sync_code='+localStorage.sync_code,
				url:apipath+'passwordCheck?cid=PLANBD&mobile='+mobile+'&password='+encodeURI(password)+'&sync_code='+localStorage.sync_code,
			  success: function(result) {
				syncResult=result
				//alert(syncResult);
				var syncResultArray = syncResult.split('rdrd');
					if (syncResultArray[0]=='YES'){	
						localStorage.sync_code=syncResultArray[1];
						
						
						localStorage.mobile_no=mobile;
						
						
						localStorage.ach_save="";
						localStorage.water_q_save="";
						
						$(".errorChk").html("Sync Successful");
						//alert('aa');
						
						$('#syncBasic').show();
						
						
						var url = "#pagesync";
						$.mobile.navigate(url);
						//$(location).attr('href',url);
//						location.reload();
					}
					else {
						
						$(".errorChk").html("Sync Failed. Authorization or Network Error.");
						$('#syncBasic').show();
					}
				
			  }//----/success f
			});//------/ajax
		 
		 }//-----/field
			
	});//-----/basic
	
});//------/func

//------------------water aid button click

function menuClick(){
	$(".errorChk").text("");
	
	planFlag=0
	cboFlag=0
	locationFlag=0
	
	//var url = "#reportType";
	//$(location).attr('href',url);
	
	$.mobile.navigate("#reportType")
	location.reload();
	
	}
	
$(document).ready(function(){	
	$("#planlistDiv").html(localStorage.plan_list);	

	
	$(".errorChk").text("");
	$(".activities").text("");
	
	$("#achCluster").hide();
	$("#achHhID").hide();	
	$("#tbl_water_point").hide();
	
	$("#tbl_sanitation").hide();
	
	$("#handwash_event").hide();
	$("#sharedLatHH").hide();
	$("#wpHH").hide();

});


//----------------back button
function backClick(){
	$(".errorChk").text("");
	}


function chkSurveySector(sector){	
	
		localStorage.sector=sector;
		
		$(".sector").text(localStorage.sector);
		
		$.mobile.navigate("#pageSearch")
			
	
}


function searchRec(){
	$("#btnSearch").hide();
	$(".errorChk").text("Sreach....");
	
	var refID=$("#refID").val();
	
	if (refID=="" || refID==undefined){
		$(".errorChk").text("Required valid Referance ID");
		$("#btnSearch").show();
	}else{	
		 	//alert(apipath+'searchRec?cid=PLANBD&refID='+refID+'&sector='+localStorage.sector);
			$.ajax({
				url:apipath+'searchRec?cid=PLANBD&refID='+refID+'&sector='+localStorage.sector,
			  	success: function(result) {
					var resultArr=result.split('<fdfd>');
					
					if (resultArr[0]=="Failed"){
						$(".errorChk").text(resultArr[1]);
						$("#btnSearch").show();
						$.mobile.navigate("#pageDetails")
						}else{
							$(".errorChk").text("");
							
							var detailsStr=resultArr[1].split("<fd>");
							
							$("#slNo").text(detailsStr[1]);
							$("#ref_id").text(detailsStr[2]);
							$("#activity").text(detailsStr[3]);
							$("#sector").text(detailsStr[4]);
							$("#achID").text(detailsStr[5]);
							
							$("#female").text(detailsStr[6]);
							$("#male").text(detailsStr[7]);
							$("#girls").text(detailsStr[8]);
							$("#boys").text(detailsStr[9]);
							$("#girls_under").text(detailsStr[10]);
							$("#boys_under").text(detailsStr[11]);							
							$("#dap_female").text(detailsStr[12]);							
							$("#dap_male").text(detailsStr[13]);
							$("#population").text(detailsStr[14]);
							$("#totalHH").text(detailsStr[15]);
							
							
							
							$("#typeOfLat").text(detailsStr[16]);
							$("#totalHHSan").text(detailsStr[15]);							
							$("#compDate").text(detailsStr[17]);
							
							$("#technology").text(detailsStr[18]);
							$("#techCompDate").text(detailsStr[19]);
							
							$("#arsenic").text(detailsStr[20]);
							$("#arTestDt").text(detailsStr[21]);
							$("#iron").text(detailsStr[22]);
							$("#ironTestDt").text(detailsStr[23]);
							$("#fc").text(detailsStr[24]);
							$("#fcTestDt").text(detailsStr[25]);
							$("#choloride").text(detailsStr[26]);
							$("#cholorideTestDt").text(detailsStr[27]);
							$("#potableSt").text(detailsStr[28]);
							$("#testBy").text(detailsStr[29]);
							
							
							 if (detailsStr[4]=='Water'){
								 $("#tr_hh").show();
								 $("#tblFacility").hide();
								 if (detailsStr[28]!=""){
									 $("#testResult").show();
								 }else{
									 $("#testResult").hide();
									 }
							 }else if(detailsStr[4]=='Sanitation'){
								 $("#tr_hh").hide();
								 $("#tblFacility").show();
								 $("#testResult").hide();
								 
							 }else{
								 $("#tr_hh").hide();
								 $("#testResult").hide();
								 $("#tblFacility").hide();								 
							  }
							
														
							$.mobile.navigate("#pageDetails")
							
							}
					
					}
			  
			});
		
		}
	
	}



function detailsNext(){
	
	if (localStorage.sector=="Water"){		
		$.mobile.navigate("#pageWater")		
	}else if (localStorage.sector=="Sanitation"){
		$.mobile.navigate("#pageSanitation")
	}else if (localStorage.sector=="Handwash"){
		$.mobile.navigate("#pageHandWash")
	}
	
	
	
	}


function waterNext(){
	
	$.mobile.navigate("#pageWater1")	
	}



function waterNext1(){
	
	$.mobile.navigate("#inPhoto")
	}


function sanitationNext(){	
	$.mobile.navigate("#pageSanitation1")
	}


function latChangeClass(r){
	if(r=="NO"){
		$(".liStChange").hide();
	}else{
		$(".liStChange").show();
		}	
	}

function sanitationNext1(){	
	$.mobile.navigate("#pageSanitation2")
	}

function sanitationNext2(){	
	$.mobile.navigate("#pageSanitation3")
	}


function sanitationNext3(){	
	$.mobile.navigate("#inPhoto")
	}



function handWashNext(){
	
	$.mobile.navigate("#pageHandWash1")
	
	}


function handWashNext1(){
	
	$.mobile.navigate("#inPhoto")
	
	}







//---------------------report Type list	
function achivementclick(){
	$(".errorChk").text("");
	
	if(localStorage.plan_list==undefined || localStorage.plan_list==""){
		$(".errorChk").text("Required Sync");
	}else{
		if (planFlag==0){
			$("#planlistDiv").html(localStorage.plan_list);
			planFlag=1;
		}else{
			$('#planlistDiv').empty();
			$('#planlistDiv').append(localStorage.plan_list).trigger('create');
		}
		
	
		
		$("#achWord").val("");
		$("#achClusterID").val("");
		$("input:radio[name='hnd_event']" ).attr('checked','');
		
		$("#achID").val("");
		
		$("#population").val("");
		$("#wpHousehold").val("");
		$("#household").val("");
		$("#male").val("");
		$("#female").val("");
		$("#girlsUnder").val("");
		$("#boysUnder").val("");
		$("#girls").val("");
		$("#boys").val("");
		$("#dapMale").val("");
		$("#dapFemale").val("");
		$("#poorA").val("");
		$("#poorB").val("");
		$("#poorC").val("");
		$("#poorEx").val("");
		$("#ethMale").val("");
		$("#ethFemale").val("");	
		$("#serRecpent").val("");	
		$("#achPhoto").val("");
		
		$("#latType").val("");
		$("#san_conp_date").val("");	
		$("#wp_tech").val("");
		$("#wp_conp_date").val("");
		
		reviewAchDisplayFlag==false;
		arrayId='';
		
		
		
		var url = "#planList";
		$.mobile.navigate(url);
		//$(location).attr('href',url);
		//location.reload();
	}
}
	
//------------------------------domain list 
function achDataNext(){	
		
	if($("#planlistDiv").find("input[name='activity_select']:checked").length==0){
		$(".errorChk").text("Required Plan");
	}else{
		var ach_plan_id=$("input[name='activity_select']:checked").val();
		
		achPlanActivities=$("#achActivityName"+ach_plan_id).val();
		
		 achPlanSector=$("#achActivitySector"+ach_plan_id).val();
		
		
		achPlanId=ach_plan_id;
		achPlanActivities=achPlanActivities;
		
		$(".activities").text(achPlanActivities);
		
		if (achPlanSector=="Handwash"){
			$("#handwash_event").show();			
			}
			
		if (achPlanSector=="Water"){
			$("#tbl_water_point").show();
			$("#achCluster").show();
			$("#achHhID").show();
			$("#wpHH").show();
			$("#latType").val("");
			$(".hh_or_wp_id").html("Water Point ID<sup class='reqField'>*</sup>");
		}else if (achPlanSector=="Sanitation"){
			$("#achCluster").show();
			$("#achHhID").show();
			$("#wpHH").hide();
			$("#tbl_sanitation").show();
			$(".hh_or_wp_id").html("HH ID<sup class='reqField'>*</sup>");			
		}else if(achPlanSector=="SanitationCommunity"){
			$("#achCluster").show();
			$("#achHhID").show();
			$("#wpHH").hide();
			$("#tbl_sanitation").show();
			$(".hh_or_wp_id").html("Sanitation Point ID<sup class='reqField'>*</sup>");			
			}
		
		if (achPlanSector=="SanitationCommunity"){
			$("#latType").val("Shared");			
			$(".latTypeD" ).attr("disabled",true);
			$("#sharedLatHH").show();
		}else{
			$(".latTypeD" ).attr("disabled",false);			
			}
		
		
		if (startDt==""){
			var now = new Date();
			var month=now.getUTCMonth()+1;
			startDt = now.getUTCFullYear()+ "-" + month + "-" + now.getUTCDate()+" "+now.getHours()+':'+now.getMinutes()+':'+now.getSeconds();
		}
		
		$(".errorChk").text("");
		
		
		var url = "#achiveDataList";
		$.mobile.navigate(url);
		//$(location).attr('href',url);
	}
}


//-----------------------------achivement data people support
function achivementDataPSupport(){
	$(".errorChk").text("");	
	
	var now = new Date();
	var month=now.getUTCMonth()+1;
	if (month<10){
		month="0"+month
		}
	var day=now.getUTCDate();
	if (day<10){
		day="0"+day
		}
		
	var year=now.getUTCFullYear();
	
	var currentDay = new Date(year+ "-" + month + "-" + day);
	
	
			
	var ach_word=$("#achWord").val();	
	
	//sanitation/ water
	var ach_cluster=$("#achClusterID").val();	
	
	// hh id
	var ach_id=$("#achID").val();
	
	
	//hand wash
	var hnd_event=$("input[name='hnd_event']:checked").val();
	
		
	var population=$("#population").val();
	var wpHousehold=$("#wpHousehold").val();
	var household=$("#household").val();
	var male=$("#male").val();
	var female=$("#female").val();
	var girlsUnder=$("#girlsUnder").val();
	var boysUnder=$("#boysUnder").val();
	var girls=$("#girls").val();
	var boys=$("#boys").val();
	var dapMale=$("#dapMale").val();
	var dapFemale=$("#dapFemale").val();
	
	
	// for water quality test 
	var ethFemale=$("#ethFemale").val();
	var ethMale=$("#ethMale").val(); 
	var poorA=$("#poorA").val();
		
	var poorB=$("#poorB").val();
	var poorC=$("#poorC").val();
	var poorEx=$("#poorEx").val(); 
	
	//for sanitation 
	var latType=$("#latType").val();	
	var sanCompDate=$("#san_conp_date").val();	
		
		
	
	//water	
	var wpTechnology=$("#wp_tech").val();
	var WpCompDate=$("#wp_conp_date").val();
		
	

	
	if(male==''){
			male=0;
			}
	
	if(female==''){
			female=0;
			}
			
	if(girlsUnder==''){
			girlsUnder=0;
			}
			
	if(boysUnder==''){
			boysUnder=0;
			}
			
	if(girls==''){
			girls=0;
			}
			
	if(boys==''){
			boys=0;
			}
	if(dapMale==''){
			dapMale=0;
			}
			
	if(dapFemale==''){
			dapFemale=0;
			}
	
	if(population==''){
		population=0;
		}
	
	if (wpHousehold==''){
		wpHousehold=0;
		}
		
	if (household==''){
		household=0;
		}
	

	
	if (ach_word=="" ){		
		$(".errorChk").text("Required Ward ");
	}else{
			if (achPlanSector!="Handwash" && ach_cluster==""){
				$(".errorChk").text("Required Cluster ");						
			}else{
				if (achPlanSector!="Handwash" && ach_id==""){
					$(".errorChk").text("Required HH ID/ Water point ID");						
				}else{
					/*if (isNaN(ach_id)==true){
						$(".errorChk").text("HH ID/ Water point ID is Number and max three digit ");
					}else{
						}*/	
						
					if (ach_id.toString().length>3){							
						$(".errorChk").text("HH ID/ Water point ID is Number and maximum 3 digit ");
					}else{						
						if (ach_id.toString().length==1){
							ach_id='00'+ach_id
						}else if (ach_id.toString().length==2){
							ach_id='0'+ach_id
							}
					 	
					
					if (achPlanSector=="Sanitation" && latType==""){
						$(".errorChk").text("Required Latrine Type");						
					}else{
						if (achPlanSector=="Sanitation" && sanCompDate==""){
							$(".errorChk").text("Required Completion Date");						
						}else{
							var chkSanCompDate = new Date(sanCompDate);
							if (chkSanCompDate>currentDay){
								$(".errorChk").text("Required Completion Date Less Then Today");
							}else{							
								if (achPlanSector=="Water" && wpTechnology==""){
									$(".errorChk").text("Required Technology");						
								}else{
									if (achPlanSector=="Water" && WpCompDate==""){
										$(".errorChk").text("Required Water Point Completion Date");						
									}else{
										var chkWpCompDate=new Date(WpCompDate);
										if (chkWpCompDate>currentDay){
											$(".errorChk").text("Required Water Point Completion Date Less Then Today");
										}else{
											var totalMF=eval(male)+eval(female)+eval(girlsUnder)+eval(boysUnder)+eval(girls)+eval(boys);
											var population=eval(totalMF);
											//var totalPoor=eval(poorA)+eval(poorB)+eval(poorC)+eval(poorEx);
											// chk population
											//alert(population);
											
											if (population<=0){					
												$(".errorChk").text("Required Population ");
											}else if (achPlanSector=="Sanitation" && population>15){
												$(".errorChk").text("Maximum Population 15");
											}else if (achPlanSector=="SanitationCommunity" && population>80){
												$(".errorChk").text("Maximum Population 80");
											}else{
												
												if (latType=="Shared" && household<=0 ){
													$(".errorChk").text("Required Household");
												}else if (achPlanSector=="SanitationCommunity" && household>20){
													$(".errorChk").text("Household maximum 20");
												}else{												
												
													achWord=ach_word																		
													achCluster=ach_cluster
													
													//hand wash
													achHndEvent=hnd_event
													
													//hh id
													achID=ach_id
													//achCBOid=cbo_id
													
													achPopulation=population
													achWpHousehold=wpHousehold
													
													achHousehold=household
													achMale=male
													achFemale=female
													achGirlsUnder=girlsUnder
													achBoysUnder=boysUnder
													achGirls=girls
													achBoys=boys
													achDapMale=dapMale
													achDapFemale=dapFemale
													achPoorA=poorA
													achPoorB=poorB
													achPoorC=0
													achPoorEx=poorEx
													achEthMale=0
													achEthFemale=ethFemale
													
																
													achLatType=latType
													achComDate=sanCompDate
													
													achWpTech=wpTechnology;
													achWpComDate=WpCompDate;
													
													var ach_plan_id=$("input[name='activity_select']:checked").val();
													//alert(ach_plan_id);
													
													$(".errorChk").text("");
													
													
													var url="#inPhoto";
													$.mobile.navigate(url);
													//$(location).attr('href',url);
												}//chk hh
											}//population
										}//wp date chk
									}// wp completion date
							 }//technology
					  }// chk completion date
					}//lat completion date						
				}//lat type	
			  }//chk hh ID / WP ID length
			}//chk hhID/ wp ID
		  }//cluster
		}
	}


//------------------ show population
function totalPopulation(){
	var male=$("#male").val();
	var female=$("#female").val();
	var girlsUnder=$("#girlsUnder").val();
	var boysUnder=$("#boysUnder").val();
	var girls=$("#girls").val();
	var boys=$("#boys").val();
	
	if(male==''){
			male=0;
			}
	if(female==''){
			female=0;
			}
	if(girlsUnder==''){
			girlsUnder=0;
			}
	if(boysUnder==''){
			boysUnder=0;
			}
	if(girls==''){
			girls=0;
			}
	if(boys==''){
			boys=0;
			}
			
	var totalMF=eval(male)+eval(female)+eval(girlsUnder)+eval(boysUnder)+eval(girls)+eval(boys);
	
	$("#population").val(totalMF);
	}


function totalHH(){
	var latType=$("#latType").val();
	if(latType=="Shared"){
		$("#sharedLatHH").show();
	}else{
		$("#sharedLatHH").hide();
		}	
	}


	
//-----------------------------planid,CBO ID, ID, Population, Household,male,Female,girls Under, boys Under,girls,boys,DAP male, DAP Female,Poor A,Poor B ,Poor C, Poor D, Ethnic Male, Ethnic Female, service Recepent, service recepent value
function achiveDataSave(){
		$(".errorChk").text("");		
		$("#btn_ach_save").hide();
		$("#btn_ach_submit").hide();
		
		latitude=$("#ach_lat").val();
		longitude=$("#ach_long").val();
		
		achPhoto=$("#achPhoto").val();		
		
		
		if (latitude==undefined || latitude==''){
			latitude=0;
			}
		if (longitude==undefined || longitude==''){
			longitude=0;
			}
		
		if (achPhoto=='' || achPhoto==undefined){
			$(".errorChk").text("Please confirm Photo ");
			$("#btn_ach_save").show();
			$("#btn_ach_submit").show();
		}else{
		
			if(latitude==0 || longitude==0){
				$(".errorChk").text("Please confirm your location ");
				$("#btn_ach_save").show();
				$("#btn_ach_submit").show();
			}else{
						
				achivementSave=achPlanId+'fdfd'+achCBOid+'fdfd'+achID+'fdfd'+achPopulation+'fdfd'+achHousehold+'fdfd'+achMale+'fdfd'+achFemale+'fdfd'+achGirlsUnder+'fdfd'+achBoysUnder+'fdfd'+achGirls+'fdfd'+achBoys+'fdfd'+achDapMale+'fdfd'+achDapFemale+'fdfd'+achPoorA+'fdfd'+achPoorB+'fdfd'+achPoorC+'fdfd'+achPoorEx+'fdfd'+achEthMale+'fdfd'+achEthFemale+'fdfd'+achServiceRecpt+'fdfd'+achPlanActivities+'fdfd'+achPhoto+'fdfd'+startDt+'fdfd'+latitude+'fdfd'+longitude+'fdfd'+achWord+'fdfd'+achHndEvent+'fdfd'+achCluster+'fdfd'+achLatType+'fdfd'+achComDate+'fdfd'+achWpTech+'fdfd'+achWpComDate+'fdfd'+achWpHousehold
				
				if (achPlanId==''){
					$(".errorChk").text("New records not available");
					$("#btn_ach_save").show();
				}else{
					
					achivementStr=localStorage.ach_save;		
					var addFlag=true;			
					
					if (achivementStr==undefined || achivementStr==''){			
						localStorage.ach_save=achivementSave
					}else{
						var achiveSavArray=achivementStr.split('rdrd');
						
						if (reviewAchDisplayFlag==true){					
							if (arrayId ==-1){							
									$(".errorChk").text("Review Index value Error");
									$("#btn_ach_save").show();
							}else{
								achiveSavArray[arrayId]=achivementSave
								
								
								var achTemp="";
								var achTempStr="";
								for (i=0;i<achiveSavArray.length;i++){
									accTemp=achiveSavArray[i]
									
									if (achTempStr==""){
										achTempStr=accTemp
									}else{
										achTempStr=achTempStr+'rdrd'+accTemp
										}
									
								}
								if (achTempStr==""){
									$(".errorChk").text("Review Index Error" );
									$("#btn_ach_save").show();
								}else{
									localStorage.ach_save=achTempStr;
									}
								
								}
						}else{				
							if (achiveSavArray.length >= 10){
								addFlag=false;					
							}else{
								localStorage.ach_save=achivementStr+'rdrd'+achivementSave
								
							}
						}
					}
					
					if (addFlag==false){
						$(".errorChk").text("Maximum 10 records allowed to be saved for review");
						$("#btn_ach_save").show();
					}else{
						achWord='';
						achCluster='';
						achHndEvent='';
					
						achPlanId='';
						achID='';
						achCBOid='';
						achPopulation='';
						achWpHousehold='';
						achHousehold='';
						vachMale='';
						achFemale='';
						achGirlsUnder='';
						achBoysUnder='';
						achGirls='';
						achBoys='';
						achDapMale='';
						achDapFemale='';
						//---------------not use
						achPoorA='';
						achPoorB='';
						achPoorC='';
						achPoorEx='';
						achEthMale='';
						achEthFemale='';			
						
						achServiceRecpt='';
						//--------------------------
						achLatType='';
						achComDate='';
						
						achWpTech='';
						achWpComDate='';
						
						achPhoto='';
						startDt='';
						
						latitude='';
						longitude='';
						
						$("#achWord").val();
						$("#achClusterID").val("");
						$("#achID").val(""); //hhid
						$("input:radio[name='hnd_event']" ).attr('checked','');
						$("#population").val("");
						$("#wpHousehold").val("");
						$("#household").val("");
						$("#male").val("");
						$("#female").val("");
						$("#girlsUnder").val("");
						$("#boysUnder").val("");
						$("#girls").val("");
						$("#boys").val("");
						$("#dapMale").val("");
						$("#dapFemale").val("");
						$("#poorA").val("");
						$("#poorB").val("");
						$("#poorC").val("");
						$("#poorEx").val("");
						$("#ethMale").val("");
						$("#ethFemale").val("");
						
						//sanitation
						$("#latType").val("");
						$("#san_conp_date").val("");
						
						//water point
						$("#wp_tech").val("");
						$("#wp_conp_date").val("");
	
						$("#achPhoto").val("");
						
						$("#ach_lat").val("");
						$("#ach_long").val("");
						
						reviewAchDisplayFlag==false;
						arrayId=-1;
						
						
						$(".errorChk").text("Successfully saved for review");
						$("#btn_take_pic").hide();
						$("#btn_ach_lat_long").hide();
						
						}
				}
			}
		}
	}

function deleteAchReview(){	
		arrayId=eval($("input[name='achReviewRad']:checked").val());
		
		if (arrayId ==undefined){							
				$(".errorChk").text("Select a Record");
				
		}else{
				var achiveSavArray3=localStorage.ach_save.split('rdrd');
				
				achiveSavArray3.splice(arrayId,1);
				
				var achTemp3="";
				var achTempStr3="";
				for (k=0;k<achiveSavArray3.length;k++){
					accTemp3=achiveSavArray3[k];
					
					if (achTempStr3==""){
						achTempStr3=accTemp3
					}else{
						achTempStr3=achTempStr3+'rdrd'+accTemp3
						}
					
				}				
				localStorage.ach_save=achTempStr3;				
				
				var url = "#reportType";
				//$(location).attr('href',url);
				$.mobile.navigate(url);
				location.reload();
			}
	
	}
//Review Data List
function reviewAchiveData(){
		//listOfReviewData='';
		var achivement=localStorage.ach_save
		
		if (achivement==undefined || achivement==''){
			$(".errorChk").text("Review data not available");
		}else{
			var achivementSaveArray=achivement.split('rdrd');
			
			var achiveSaveCount=achivementSaveArray.length;
			
			var achiveArray=[];
			var reviewDataDiv="";
			var planID="";
			var cboID="";
			var achActivities="";
			
			reviewDataDiv='<ul data-role="listview" data-inset="true"><li style="background-color:#F2F2F2;">Review </li><li class="ui-field-contain"><fieldset data-role="controlgroup">'
			for (i=0;i<achiveSaveCount;i++){
				achiveArray=achivementSaveArray[i].split('fdfd');
				planID=achiveArray[0];
				cboID=achiveArray[1];
				achActivities=achiveArray[20];
				
				reviewDataDiv=reviewDataDiv+'<input type="radio" name="achReviewRad"  id="achReviewRad'+i+'"  value="'+i+'"/> <label for="achReviewRad'+i+'">'+achActivities+'-'+planID+'</label>'
				
				}
			
			reviewDataDiv=reviewDataDiv+'</fieldset></li></ul>'
			
			if (reviewAchFlag==0){
				$("#reviewAchList").html(reviewDataDiv);
				reviewAchFlag=1;
			}else{
				$('#reviewAchList').empty();
				$('#reviewAchList').append(reviewDataDiv).trigger('create');
				}
			
			//-----------------------------
			if (planFlag==0){
				$("#planlistDiv").html(localStorage.plan_list);
				planFlag=1;
			}else{
				$('#planlistDiv').empty();
				$('#planlistDiv').append(localStorage.plan_list).trigger('create');
			}
			
			if (cboFlag==0){
				$("#cboIdDiv").html(localStorage.cbo_list);	
				cboFlag=1;
			}else{
				$('#cboIdDiv').empty();
				$('#cboIdDiv').append(localStorage.cbo_list).trigger('create');
			}
			
			if (locationFlag==0){			   
				$("#serResDiv").html(localStorage.ser_res_list);	
				locationFlag=1;
			}else{
				$('#serResDiv').empty();
				$('#serResDiv').append(localStorage.ser_res_list).trigger('create');
			}
			
			$("#achClusterID").val("");
			$("#achID").val("");
			$("input:radio[name='hnd_event']" ).attr('checked','');
			
			$("#population").val("");
			$("#wpHousehold").val("");
			$("#household").val("");
			$("#male").val("");
			$("#female").val("");
			$("#girlsUnder").val("");
			$("#boysUnder").val("");
			$("#girls").val("");
			$("#boys").val("");
			$("#dapMale").val("");
			$("#dapFemale").val("");
			$("#poorA").val("");
			$("#poorB").val("");
			$("#poorC").val("");
			$("#poorEx").val("");
			$("#ethMale").val("");
			$("#ethFemale").val("");	
			$("#serRecpent").val("");
			
			$("#latType").val("");
			$("#san_conp_date").val("");
			
			$("#wp_tech").val("");
			$("#wp_conp_date").val("");
						
			$("#achPhoto").val("");				
			
			$("#ach_lat").val("");
			$("#ach_long").val("");
			
			reviewAchDisplayFlag==false;
			arrayId=-1;
			
			
			var url = "#reviewDataList";
			//$(location).attr('href',url);
			$.mobile.navigate(url);
		}	
		
	}

	
function reviewDataNext(){
	$('#btn_take_pic').hide();
	$('#btn_ach_lat_long').hide();
	
	reviewAchDisplayFlag=true;
	arrayId=eval($("input[name='achReviewRad']:checked").val());
	
	if (arrayId ==undefined){							
			$(".errorChk").text("Select a Record");			
	}else{
		
		var achivementRevArray2=localStorage.ach_save.split('rdrd');
		var achRevDetails=achivementRevArray2[arrayId];
		
		var achRevDetailsArray=achRevDetails.split('fdfd');
		
		//------------------
		$( "input:radio[name='activity_select'][value='"+achRevDetailsArray[0]+"']" ).attr('checked','checked');
		//$("#plan_select").val(achRevDetailsArray[0])
		
		
		$("#cbo_combo").val(achRevDetailsArray[1]);
		
		$("#achID").val(achRevDetailsArray[2]);				
		$("#population").val(achRevDetailsArray[3]);
		$("#household").val(achRevDetailsArray[4]);
		$("#male").val(achRevDetailsArray[5]);
		$("#female").val(achRevDetailsArray[6]);
		$("#girlsUnder").val(achRevDetailsArray[7]);
		$("#boysUnder").val(achRevDetailsArray[8]);
		$("#girls").val(achRevDetailsArray[9]);
		$("#boys").val(achRevDetailsArray[10]);
		$("#dapMale").val(achRevDetailsArray[11]);
		$("#dapFemale").val(achRevDetailsArray[12]);
		
		var compt_date_array=achRevDetailsArray[17].split("-");
		
		$("#com_c_d").val(compt_date_array[2]);
		$("#com_c_m").val(compt_date_array[1]);
		$("#com_c_y").val(compt_date_array[0]);
		
		
		var test_date_array=achRevDetailsArray[15].split("-");
		
		$("#test_c_d").val(test_date_array[2]);
		$("#test_c_m").val(test_date_array[1]);
		$("#test_c_y").val(test_date_array[0]);
		
		$("#poorA").val(achRevDetailsArray[13]);
		$("#poorB").val(achRevDetailsArray[14]);
		//$("#poorC").val(achRevDetailsArray[15]);
		$("#poorEx").val(achRevDetailsArray[16]);
		//$("#ethMale").val(achRevDetailsArray[17]);
		$("#ethFemale").val(achRevDetailsArray[18]);
		
		$("#serRecpent").val(achRevDetailsArray[19]);
		
		
		$("#achPhoto").val(achRevDetailsArray[21]);
		
		var achlat=$("#ach_lat").val(achRevDetailsArray[23]);
		var achlong=$("#ach_long").val(achRevDetailsArray[24]);
					
		var image = document.getElementById('myImageA');
		image.src = achRevDetailsArray[21];
		imagePathA = achRevDetailsArray[21];
		
		startDt=achRevDetailsArray[22]
		
		$("#achWord").val(achRevDetailsArray[25]);
		$( "input:radio[name='hnd_event'][value='"+achRevDetailsArray[26]+"']" ).attr('checked','checked');
		
		$("#achClusterID").val(achRevDetailsArray[27]);
		$("#latType").val(achRevDetailsArray[28]);
		$("#san_conp_date").val(achRevDetailsArray[29]);
		
		$("#wp_tech").val(achRevDetailsArray[30]);
		$("#wp_conp_date").val(achRevDetailsArray[31]);
		
		$("#wpHousehold").val(achRevDetailsArray[32]);
	
		$(".errorChk").text("");
		var url = "#planList";
		//$(location).attr('href',url);
		$.mobile.navigate(url);
	}
}



function achiveDataSubmit(){
		$("#btn_ach_submit").hide();
		
		var d = new Date();	
		var get_time=d.getTime();		

		
		latitude=$("#ach_lat").val();
		longitude=$("#ach_long").val();
		
		achPhoto=$("#achPhoto").val();

		
		if (latitude==undefined || latitude==''){
			latitude=0;
			}
		if (longitude==undefined || longitude==''){
			longitude=0;
			}
		
		if (achPhoto=='' || achPhoto==undefined){
			$(".errorChk").text("Please confirm Photo ");
			$("#btn_ach_submit").show();
		}else{		
			if(latitude==0 || longitude==0){
				$(".errorChk").text("Please confirm your location ");
				$("#btn_ach_submit").show();
			}else{				
				if (achPlanId==''){
					$(".errorChk").text("New records not available");
					$("#btn_ach_submit").show();
				}else{
					//imagePathA="test"
					if (imagePathA!=""){
						$(".errorChk").text("Syncing photo..");
						imageName = localStorage.mobile_no+"_"+get_time+".jpg";						
						uploadPhotoAch(imagePathA, imageName);
					}
					
				}
			}//end check location
		}//chk photo
	}

function syncDataAch(){	
			//alert(apipath+'submitAchiveData?cid=PLANBD&mobile_no='+localStorage.mobile_no+'&syncCode='+localStorage.sync_code+'&ach_plan_id='+achPlanId+'&ach_cbo_id=0&ach_id='+achID+'&ach_population='+achPopulation+'&ach_wp_household='+achWpHousehold+'&ach_household='+achHousehold+'&ach_male='+achMale+'&ach_female='+achFemale+'&ach_girlsUnder='+achGirlsUnder+'&ach_boysUnder='+achBoysUnder+'&ach_girls='+achGirls+'&ach_boys='+achBoys+'&ach_dapMale='+achDapMale+'&ach_dapFemale='+achDapFemale+'&ach_poorA='+achPoorA+'&ach_poorB='+achPoorB+'&ach_poorC='+achPoorC+'&ach_poorEx='+achPoorEx+'&ach_ethMale='+achEthMale+'&ach_ethFemale='+achEthFemale+'&ach_service_recpient=&latitude='+latitude+'&longitude='+longitude+'&ach_photo='+imageName+'&ach_startDt='+startDt+'&ach_word='+achWord+'&ach_event='+achHndEvent+'&ach_cluster='+achCluster+'&ach_lat_type='+achLatType+'&ach_lat_comp_date='+achComDate+'&ach_wp_tech='+achWpTech+'&ach_wp_comp_date='+achWpComDate);
			
			$.ajax({
					type: 'POST',
					url:apipath+'submitAchiveData?cid=PLANBD&mobile_no='+localStorage.mobile_no+'&syncCode='+localStorage.sync_code+'&ach_plan_id='+achPlanId+'&ach_cbo_id=0&ach_id='+achID+'&ach_population='+achPopulation+'&ach_wp_household='+achWpHousehold+'&ach_household='+achHousehold+'&ach_male='+achMale+'&ach_female='+achFemale+'&ach_girlsUnder='+achGirlsUnder+'&ach_boysUnder='+achBoysUnder+'&ach_girls='+achGirls+'&ach_boys='+achBoys+'&ach_dapMale='+achDapMale+'&ach_dapFemale='+achDapFemale+'&ach_poorA='+achPoorA+'&ach_poorB='+achPoorB+'&ach_poorC='+achPoorC+'&ach_poorEx='+achPoorEx+'&ach_ethMale='+achEthMale+'&ach_ethFemale='+achEthFemale+'&ach_service_recpient=&latitude='+latitude+'&longitude='+longitude+'&ach_photo='+imageName+'&ach_startDt='+startDt+'&ach_word='+achWord+'&ach_event='+achHndEvent+'&ach_cluster='+achCluster+'&ach_lat_type='+achLatType+'&ach_lat_comp_date='+achComDate+'&ach_wp_tech='+achWpTech+'&ach_wp_comp_date='+achWpComDate,
					   
					   success: function(result) {
							//alert(result);
						if(result=='Success'){							
							//------------------------
							
							if (reviewAchDisplayFlag==true){					
								if (arrayId ==-1){							
										$(".errorChk").text("Review Index value Error");
								}else{	
										var achiveSavArray2=localStorage.ach_save.split('rdrd');
										//alert(achiveSavArray2.length+','+arrayId);
										achiveSavArray2.splice(arrayId,1);
										
										var achTemp2="";
										var achTempStr2="";
										for (j=0;j<achiveSavArray2.length;j++){
											accTemp2=achiveSavArray2[j];
											
											if (achTempStr2==""){
												achTempStr2=accTemp2
											}else{
												achTempStr2=achTempStr2+'rdrd'+accTemp2
												}
											
										}										
										localStorage.ach_save=achTempStr2;
									}
									
							}
							//----------------
							$("#ach_lat").val("");
							$("#ach_long").val("");
							$( "input:radio[name='plan_select'][value='"+achPlanId+"']" ).attr('checked','');
							$("#cbo_combo").val("");
							
							achPlanId="";
							achCBOid="";
							$(".errorChk").text('Successfully Submitted');
							$("#btn_ach_save").hide();
							$("#btn_take_pic").hide();
							$("#btn_ach_lat_long").hide();
							//$("#achlocation").val('Successfully Submited');
							
						}else if(result=='Failed3'){
							//$(".errorChk").text('Failed to Submit');
							$(".errorChk").text('Invalid Ward');									
							$("#btn_ach_submit").show();
						}else if(result=='Failed4'){
							//$(".errorChk").text('Failed to Submit');
							$(".errorChk").text('Invalid Cluster');										
							$("#btn_ach_submit").show();
						}else if(result=='Failed5'){
							//$(".errorChk").text('Failed to Submit');
							$(".errorChk").text('Event Already Exists');															
							$("#btn_ach_submit").show();
						}else if(result=='Failed6'){
							//$(".errorChk").text('Failed to Submit');
							$(".errorChk").text('Already Exists');									
							$("#btn_ach_submit").show();
						}else{
							$(".errorChk").text('Unauthorized Access');
							//$(".errorChk").text('Try again after 5 minutes');																		
							$("#btn_ach_submit").show();
							}
							
					   }//end result
			});//end ajax
	
	}





// ------------------------------------- Report data

function ffReport(){
	//$(".errorChk").text(apipath+'get_ff_rpt_activity?cid=PLANBD&mobile='+localStorage.mobile_no+'&sync_code='+localStorage.sync_code);
	$.ajax({
			url:apipath+'get_ff_rpt_activity?cid=PLANBD&mobile='+localStorage.mobile_no+'&sync_code='+localStorage.sync_code,
		  success: function(result) {
					ach_list=result;
					ach_list_array=(ach_list).split("rdrd");
					
					for(i=0;i<ach_list_array.length;i++){
						ach_array=ach_list_array[i].split("fdfd");
						
						$('#ff_rpt_activity').append('<tr class="plan_tr" style="font-size:11px;"><td >'+ach_array[0]+'</td><td>'+ach_array[1]+'</td><td>'+ach_array[2]+'</td><td>'+ach_array[3]+'</td></tr>');
						
						//$('#ff_rpt_activity').append('<tr class="plan_tr" style="font-size:11px;"><td >'+ach_array[0]+'</td><td>'+ach_array[1]+'</td><td>'+ach_array[2]+'</td><td>'+ach_array[3]+'</td><td>'+ach_array[4]+'</td></tr>');
						
					}
			
					}
		});
	
	}



function exit() {
navigator.app.exitApp();
//navigator.device.exitApp();
}


// ----------------Camera-----------------------------------------------


//Acheivement
function getAchivementImage() {
	navigator.camera.getPicture(onSuccessA, onFailA, { quality: 50,
		targetWidth: 300,
		destinationType: Camera.DestinationType.FILE_URI,correctOrientation: true });
	
}

function onSuccessA(imageURI) {
    var image = document.getElementById('myImageA');
    image.src = imageURI;
	imagePathA = imageURI;
	$("#achPhoto").val(imagePathA);
	
}

function onFailA(message) {
	imagePathA="";
    alert('Failed because: ' + message);
}



//------------------------------------------------------------------------------
//File upload 
function uploadPhotoAch(imageURI, imageName) {	
	//winAch();
    var options = new FileUploadOptions();
    options.fileKey="upload";
    options.fileName=imageName;
    options.mimeType="image/jpeg";

    var params = {};
    params.value1 = "test";
    params.value2 = "param";

    options.params = params;

    var ft = new FileTransfer();
	ft.upload(imageURI, encodeURI("http://i01.businesssolutionapps.com/welcome/plan_sync/fileUploader/"),winAch,fail,options);
	//ft.upload(imageURI, encodeURI("http://127.0.0.1:8000/welcome/wab_sync/fileUploader/"),winAch,fail,options);
	
}

function winAch(r) {
//    console.log("Code = " + r.responseCode);
//    console.log("Response = " + r.response);
//    console.log("Sent = " + r.bytesSent);
	$(".errorChk").text('File upload Successful. Syncing Data...');
	syncDataAch();
}


function fail(error) {
	$(".errorChk").text('Memory or Network Error. Please Save and try to Submit later');
    //alert("An error has occurred: Code = " + error.code);
//    console.log("upload error source " + error.source);
//    console.log("upload error target " + error.target);
}


