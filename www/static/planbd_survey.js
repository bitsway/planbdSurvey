
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


//---- online 
var apipath="http://e2.businesssolutionapps.com/planbd_survey/syncmobile_survey/";

//--- local
//var apipath="http://127.0.0.1:8000/planbd_survey/syncmobile_survey/";

var detailsStr='';

var startDt='';
var syncResult='';
var achPlanId='';

var achPhoto='';

var reviewAchFlag=0; //used for html triger
var reviewAchDisplayFlag=false; //used for save data from review
var arrayId=-1;

var imageName = "";
var imagePathA="";
var imagePathW="";

$(document).ready(function(){
	$('form').trigger("reset");	
	$(".errorChk").text("");
	
	$("#wp_add_qlty_chk").hide();
	$("#wp_func_chk").hide();
	$("#wp_not_func_chk").hide();
	
	$("#wp_use_all_time_chk").hide();
	$("#wp_use_most_chk").hide();
	$("#wp_not_use_chk").hide();	
		
	$("#s_adeq_qlty_chk").hide();
	$("#s_par_adeq_qlty_chk").hide();
	$("#s_inadeq_qlty_chk").hide();
	
	$("#s_in_use_chk").hide();
	$("#s_in_use_most_chk").hide();
	$("#s_not_use_chk").hide();
	//$("input:text,select").val('');
	//$("input:checkbox,input:radio").removeAttr('checked');
		
	$(".sector").text(localStorage.sector);	

});


function syncBasic() {
					
		var mobile=$("#mobile").val() ;
	 	var password=$("#password").val() ;
		
		if (mobile=="" || password==""){
			 $(".errorChk").html("Required mobile no and password");	
		 }else{	
			 $('#syncBasic').hide();			 
			 $(".errorChk").html("Sync in progress. Please wait...");
			
			if(localStorage.sync_code==undefined || localStorage.sync_code==""){
					localStorage.sync_code=0
				}
			
		 	//alert(apipath+'passwordCheck?cid=PLANBD&mobile='+mobile+'&password='+encodeURI(password)+'&sync_code='+localStorage.sync_code);
			
			$.ajax({
				url:apipath+'passwordCheck?cid=PLANBD&mobile='+mobile+'&password='+encodeURI(password)+'&sync_code='+localStorage.sync_code,
			  	success: function(result) {
				syncResult=result
				//alert(syncResult);
				var syncResultArray = syncResult.split('<rdrd>');
					if (syncResultArray[0]=='YES'){	
						localStorage.sync_code=syncResultArray[1];
						
						
						localStorage.mobile_no=mobile;
						
						
						localStorage.ach_save="";
						
						$(".errorChk").html("Sync Successful");						
						$('#syncBasic').show();						
						
						var url = "#pagesync";
						$.mobile.navigate(url);
					}
					else {
						
						$(".errorChk").html("Sync Failed. Authorization or Network Error.");
						$('#syncBasic').show();
					}
				
			  }//----/success f
			});//------/ajax
		 
		 }//-----/field
			
	}

//------------------water aid button click

function menuClick(){	
	$('form').trigger("reset");	
	$(".errorChk").text("");
	$(".sucChk").text("");
	$("#collectorName").val("");
	imagePathA="";
	//$("#collectorName").val("");	
	//$("input:text,select").val('');
	//$("input:checkbox,input:radio").removeAttr('checked');	
	
	
	$("#wp_add_qlty_chk").hide();
	$("#wp_func_chk").hide();
	$("#wp_not_func_chk").hide();
	
	$("#wp_use_all_time_chk").hide();
	$("#wp_use_most_chk").hide();
	$("#wp_not_use_chk").hide();
	
	$("#s_adeq_qlty_chk").hide();
	$("#s_par_adeq_qlty_chk").hide();
	$("#s_inadeq_qlty_chk").hide();
	
	$("#s_in_use_chk").hide();
	$("#s_in_use_most_chk").hide();
	$("#s_not_use_chk").hide();
	
	$("#btn_take_pic").show();
	$("#btn_ach_lat_long").show();
	$("#btn_ach_submit").show();
	
	$(".sector").text(localStorage.sector);
	
	$.mobile.navigate("#reportType")
	
	}
	



//----------------back button
function backClick(){
	$(".errorChk").text("");
	}


function chkSurveySector(sector){
		$("#refID").val("");	
		$("#btnSearch").show();
		localStorage.sector=sector;		
		$(".sector").text(localStorage.sector);		
		$.mobile.navigate("#pageSearch")
	
}

var tmpUrl="";
function searchRec(){
	$("#btnSearch").hide();
	$(".errorChk").text("Sreach....");
	
	var refID=$("#refID").val();
	
	if (refID=="" || refID==undefined){
		$(".errorChk").text("Required valid Referance ID");
		$("#btnSearch").show();
	}else{	
		 	if (localStorage.sector=="Water"){
				tmpUrl=apipath+'searchWaterRec?cid=PLANBD&mobile='+localStorage.mobile_no+'&refID='+refID;
			}else{
				tmpUrl=apipath+'searchSanRec?cid=PLANBD&mobile='+localStorage.mobile_no+'&refID='+refID;
			}
			
											
			$.ajax({
				url:tmpUrl,
			  	success: function(result) {
					var resultArr=result.split('<fdfd>');
					
					if (resultArr[0]=="Failed"){
						$(".errorChk").text(resultArr[1]);
						$("#btnSearch").show();
						
						}else{
							$(".errorChk").text("");
																					
							if(localStorage.sector=="Water"){
								setWaterDetails(resultArr[1])
							}else{
								setSanDetails(resultArr[1])							
							}
						}
					}
			});
		}
	}


var dtStr="";

function setWaterDetails(rStr){
		var detailsStr=rStr.split("<fd>");		
							
		$("#w_ref_id").text(detailsStr[1]);
		$("#w_mPMISNo").text(detailsStr[2]);
		$("#w_country").text(detailsStr[3]);
		$("#w_quarter").text(detailsStr[4]);
		$("#w_div_name").text(detailsStr[5]);		
		$("#w_dist_name").text(detailsStr[6]);
		$("#w_upazila_thana").text(detailsStr[7]);
		$("#w_union_name").text(detailsStr[8]);
		$("#w_village_name").text(detailsStr[9]);
		$("#w_latitude").text(detailsStr[10]);
		$("#w_longitude").text(detailsStr[11]);
									
		$("#w_type_activity").text(detailsStr[12]);							
		$("#w_wp_technology").text(detailsStr[13]);
		$("#w_wq_comp_date").text(detailsStr[14]);
		$("#w_pro_partner").text(detailsStr[15]);
				
		$("#w_wq_test_type").text(detailsStr[16]);
		$("#w_wq_test_date").text(detailsStr[17]);							
		$("#w_wq_test_result").text(detailsStr[18]);
		
		$("#w_house_hold").text(detailsStr[19]);
		$("#w_population").text(detailsStr[20]);		
		$("#w_female").text(detailsStr[21]);			 
		$("#w_male").text(detailsStr[22]);
		$("#w_girls").text(detailsStr[23]);
		$("#w_boys").text(detailsStr[24]);
		$("#w_girls_under").text(detailsStr[25]);
		$("#w_boys_under").text(detailsStr[26]);
		$("#w_dap_female").text(detailsStr[27]);
		$("#w_dap_male").text(detailsStr[28]);
		
		$("#w_evi_1_type").text(detailsStr[29]);
		$("#w_evi_1_file").text(detailsStr[30]);
		$("#w_evi_1_location").text(detailsStr[31]);
		
		$("#w_evi_2_type").text(detailsStr[32]);
		$("#w_evi_2_file").text(detailsStr[33]);
		$("#w_evi_2_location").text(detailsStr[34]);
		
		$("#w_evi_3_type").text(detailsStr[35]);
		$("#w_evi_3_file").text(detailsStr[36]);
		$("#w_evi_3_location").text(detailsStr[37]);
		
		$("#w_evi_4_type").text(detailsStr[38]);
		$("#w_evi_4_file").text(detailsStr[39]);
		$("#w_evi_4_location").text(detailsStr[40]);
		
		$("#w_clerk").text(detailsStr[41]);
		$("#w_supervisor").text(detailsStr[42]);
		$("#w_location").text(detailsStr[43]);
		
		
		
		dtStr="&sector="+localStorage.sector+"&refID="+detailsStr[1];
		
											
		$.mobile.navigate("#pageWaterDetails")
	
	}


function setSanDetails(rStr){
		var detailsStr=rStr.split("<fd>");		
							
		$("#s_ref_id").text(detailsStr[1]);
		$("#s_mPMISNo").text(detailsStr[2]);
		$("#s_country").text(detailsStr[3]);
		$("#s_quarter").text(detailsStr[4]);
		$("#s_div_name").text(detailsStr[5]);		
		$("#s_dist_name").text(detailsStr[6]);
		$("#s_upazila_thana").text(detailsStr[7]);
		$("#s_union_name").text(detailsStr[8]);
		$("#s_village_name").text(detailsStr[9]);
		$("#s_latitude").text(detailsStr[10]);
		$("#s_longitude").text(detailsStr[11]);
									
		$("#s_type_lat").text(detailsStr[12]);							
		$("#s_date_comp").text(detailsStr[13]);
				
		$("#s_house_hold").text(detailsStr[14]);		
		$("#s_female").text(detailsStr[15]);			 
		$("#s_male").text(detailsStr[16]);
		$("#s_girls").text(detailsStr[17]);
		$("#s_boys").text(detailsStr[18]);
		$("#s_girls_under").text(detailsStr[19]);
		$("#s_boys_under").text(detailsStr[20]);
		$("#s_dap_female").text(detailsStr[21]);
		$("#s_dap_male").text(detailsStr[22]);
		
		$("#s_evi_1_type").text(detailsStr[23]);
		$("#s_evi_1_file").text(detailsStr[24]);
		$("#s_evi_1_location").text(detailsStr[25]);
		
		$("#s_evi_2_type").text(detailsStr[26]);
		$("#s_evi_2_file").text(detailsStr[27]);
		$("#s_evi_2_location").text(detailsStr[28]);
		
		$("#s_evi_3_type").text(detailsStr[29]);
		$("#s_evi_3_file").text(detailsStr[30]);
		$("#s_evi_3_location").text(detailsStr[31]);		
		
		$("#s_clerk").text(detailsStr[32]);
		$("#s_supervisor").text(detailsStr[33]);
		$("#s_location").text(detailsStr[34]);
		
		
		
		dtStr="&sector="+localStorage.sector+"&refID="+detailsStr[1];
									
		$.mobile.navigate("#pageSanDetails")
	
	}



function detailsNext(){		
		
		$('form').trigger("reset");
				
		if (localStorage.sector=="Water"){		
			$.mobile.navigate("#pageWater")		
		}else if (localStorage.sector=="Sanitation"){
			$.mobile.navigate("#pageSanitation")
		}
	}

//water
var waterStr="";
function waterNext(){
	$(".errorChk").text("");
	
	var w_type_act=$("#w_type_act").val();
	var w_type_ins=$("#w_type_ins").val();
	var is_tw_test=$("input[name='is_tw_test']:checked").val();
	
	var w_arsenic=$("#w_arsenic").val();
	var w_iron=$("#w_iron").val();
	var w_chloride=$("#w_chloride").val();
	var w_focal=$("#w_focal").val();
	var w_pH=$("#w_pH").val();
	
	
	if (w_type_act==""){
		$(".errorChk").text("Required Type of Activity");
	}else if (w_type_ins==""){
		$(".errorChk").text("Required Type of installed TW");
	}else if (is_tw_test=="" || is_tw_test==undefined){
		$(".errorChk").text("Required Is the TW again tested?");
	}else if (w_arsenic=="" || w_iron=="" || w_chloride=="" || w_focal=="" || w_pH==""){		
		$(".errorChk").text("Required Put the water quality test value");
		
	}else{			
		waterStr=dtStr+"&w_type_act="+encodeURIComponent(w_type_act)+"&w_type_ins="+encodeURIComponent(w_type_ins)+"&is_tw_test="+is_tw_test+"&w_arsenic="+w_arsenic+"&w_iron="+w_iron+"&w_chloride="+w_chloride+"&w_focal="+w_focal+"&w_pH="+w_pH
		
		$(".errorChk").text("");
		$("#wp_add_qlty_chk").hide();
		$("#wp_func_chk").hide();
		$("#wp_not_func_chk").hide();
		
		$.mobile.navigate("#pageWater1")	
		
		}
	
	
	
	}


var waterStr1="";
function waterNext1(){
	$(".errorChk").text("");
	
	var all_cont=$("input[name='all_cont']:checked").val();
	var present_ins=$("input[name='present_ins']:checked").val();
	
	
	
	if (all_cont=="" || all_cont==undefined){
		$(".errorChk").text("Required Are all contaminants within the national limit?");
	}else if (present_ins=="" || present_ins==undefined){
		$(".errorChk").text("Present conditions of installed water point");
	}else{
		if (present_ins==1){						
			if($("#wp_add_qlty_chk").find("input[type='checkbox']:checked").length==0){
				$(".errorChk").text("Adequate quality of construction of water point");
			}else{
				var wp_add_qlty="";
				for(i=1;i<=$("#wp_add_qlty_chk").find("input[type='checkbox']").length;i++){			
					var wp_add_qlty_ck=$("#wp_add_qlty_"+i).is(":checked")?1:0;			
					if (i==1){
						wp_add_qlty=wp_add_qlty_ck;
					}else{
						wp_add_qlty+=","+wp_add_qlty_ck;
					}			
				}
				waterStr1=waterStr+"&all_cont="+all_cont+"&wp_add_qlty="+wp_add_qlty+"&wp_func=0,0,0&wp_not_func=0,0";
				$.mobile.navigate("#pageWater2")				
			}
			
		}else if(present_ins==2){			
			if($("#wp_func_chk").find("input[type='checkbox']:checked").length==0){
				$(".errorChk").text("Water point functioning but some elements need to be improved");
			}else{
				var wp_func="";
				for(j=1;j<=$("#wp_func_chk").find("input[type='checkbox']").length;j++){			
					var wp_func_ck=$("#wp_func_"+j).is(":checked")?1:0;			
					if (j==1){
						wp_func=wp_func_ck;
					}else{
						wp_func+=","+wp_func_ck;
					}			
				}
				waterStr1=waterStr+"&all_cont="+all_cont+"&wp_add_qlty=0,0&wp_func="+wp_func+"&wp_not_func=0,0";
				$.mobile.navigate("#pageWater2")	
			}
		}else if(present_ins==3){
			 if($("#wp_not_func_chk").find("input[type='checkbox']:checked").length==0){
				$(".errorChk").text("Water point not functioning acceptably");		
			}else{
				var wp_not_func="";
				for(k=1;k<=$("#wp_not_func_chk").find("input[type='checkbox']").length;k++){			
					var wp_not_func_ck=$("#wp_not_func_"+k).is(":checked")?1:0;			
					if (k==1){
						wp_not_func=wp_not_func_ck;
					}else{
						wp_not_func+=","+wp_not_func_ck;
					}			
				}
			waterStr1=waterStr+"&all_cont="+all_cont+"&wp_add_qlty=0,0&wp_func=0,0,0&wp_not_func="+wp_not_func;
			$.mobile.navigate("#pageWater2")					
		}		
	  }
	}
}

function chkPresentIns(i){
		$(".errorChk").text("");
					
		if (i==1){
			$("#wp_add_qlty_chk").show();
			$("#wp_func_chk").hide();
			$("#wp_not_func_chk").hide();
			
		}else if(i==2){
			$("#wp_add_qlty_chk").hide();
			$("#wp_func_chk").show();
			$("#wp_not_func_chk").hide();
			
		}else if(i==3){
			$("#wp_add_qlty_chk").hide();
			$("#wp_func_chk").hide();
			$("#wp_not_func_chk").show();
		
		}else{
			$("#wp_add_qlty_chk").hide();
			$("#wp_func_chk").hide();
			$("#wp_not_func_chk").hide();
		}
			
}


var waterStr2="";
function waterNext2(){
	$(".errorChk").text("");
	
	var wp_use=$("input[name='wp_use']:checked").val();
	
	if (wp_use=="" || wp_use==undefined){
		$(".errorChk").text("Water point use");
	}else{
		if (wp_use==1){
			if($("#wp_use_all_time_chk").find("input[type='checkbox']:checked").length==0){
				$(".errorChk").text("Required In use all of the time");		
			}else{
				var wp_use_all_time="";
				for(i=1;i<=$("#wp_use_all_time_chk").find("input[type='checkbox']").length;i++){			
					var wp_use_all_time_ck=$("#wp_use_all_time_"+i).is(":checked")?1:0;			
					if (i==1){
						wp_use_all_time=wp_use_all_time_ck;
					}else{
						wp_use_all_time+=","+wp_use_all_time_ck;
					}			
				}
				waterStr2=waterStr1+"&wp_use_all_time="+wp_use_all_time+"&wp_use_most=0,0,0,0&wp_not_use=0,0,0,0,0"
				$.mobile.navigate("#pageHygiene")				
			}
			
		}else if (wp_use==2){
			if($("#wp_use_most_chk").find("input[type='checkbox']:checked").length==0){
				$(".errorChk").text("Required In use most of the time (used 180 day and above)");	
			}else{
				var wp_use_most="";
				for(j=1;j<=$("#wp_use_most_chk").find("input[type='checkbox']").length;j++){			
					var wp_use_most_ck=$("#wp_use_most_"+j).is(":checked")?1:0;			
					if (j==1){
						wp_use_most=wp_use_most_ck;
					}else{
						wp_use_most+=","+wp_use_most_ck;
					}			
				}
				waterStr2=waterStr1+"&wp_use_all_time=0,0,0,0,0&wp_use_most="+wp_use_most+"&wp_not_use=0,0,0,0,0"
				$.mobile.navigate("#pageHygiene")				
			}
			
		}else if (wp_use==3){
			if($("#wp_not_use_chk").find("input[type='checkbox']:checked").length==0){
				$(".errorChk").text("Required Not in use (used less than 180 days)");		
			}else{
				var wp_not_use="";
				for(k=1;k<=$("#wp_not_use_chk").find("input[type='checkbox']").length;k++){			
					var wp_not_use_ck=$("#wp_not_use_"+k).is(":checked")?1:0;			
					if (k==1){
						wp_not_use=wp_not_use_ck;
					}else{
						wp_not_use+=","+wp_not_use_ck;
					}			
				}
			waterStr2=waterStr1+"&wp_use_all_time=0,0,0,0,0&wp_use_most=0,0,0,0&wp_not_use="+wp_not_use
			$.mobile.navigate("#pageHygiene")
			}				
			
		}
	}
	
		
}

function chkWpUse(i){
		$(".errorChk").text("");
					
		if (i==1){
			$("#wp_use_all_time_chk").show();
			$("#wp_use_most_chk").hide();
			$("#wp_not_use_chk").hide();
			
		}else if(i==2){
			$("#wp_use_all_time_chk").hide();
			$("#wp_use_most_chk").show();
			$("#wp_not_use_chk").hide();
			
		}else if(i==3){
			$("#wp_use_all_time_chk").hide();
			$("#wp_use_most_chk").hide();
			$("#wp_not_use_chk").show();
		
		}else{
			$("#wp_use_all_time_chk").hide();
			$("#wp_use_most_chk").hide();
			$("#wp_not_use_chk").hide();
		}
			
}





// san
var sanStr="";
function sanitationNext(){
	$(".errorChk").text("");
	
	var s_lat_type=$("#s_lat_type").val();
	var sp_con=$("input[name='sp_con']:checked").val();
	
	if (s_lat_type=="" || s_lat_type==undefined){
		$(".errorChk").text("Required Type of latrine provided");
	}else if($("#has_lat_hh_chk").find("input[type='checkbox']:checked").length==0){
		$(".errorChk").text("Required Has latrine upgraded by household? (superstructure and Sub structure)");		
	}else if (sp_con=="" || sp_con==undefined){
		$(".errorChk").text("Required latrine condition");
	}else{
		var has_lat_hh="";
		for(i=1;i<=$("#has_lat_hh_chk").find("input[type='checkbox']").length;i++){			
			var has_lat_hh_ck=$("#has_lat_hh_"+i).is(":checked")?1:0;			
			if (i==1){
				has_lat_hh=has_lat_hh_ck;
			}else{
				has_lat_hh+=","+has_lat_hh_ck;
			}			
		}
		
				
		if (sp_con==1){
			if($("#s_adeq_qlty_chk").find("input[type='checkbox']:checked").length==0){
				$(".errorChk").text("Required Adequate quality (state reason for adequate quality)");	
			}else{
				var s_adeq_qlty="";
				for(j=1;j<=$("#s_adeq_qlty_chk").find("input[type='checkbox']").length;j++){			
					var s_adeq_qlty_ck=$("#s_adeq_qlty_"+j).is(":checked")?1:0;			
					if (j==1){
						s_adeq_qlty=s_adeq_qlty_ck;
					}else{
						s_adeq_qlty+=","+s_adeq_qlty_ck;
					}			
				}
				sanStr=dtStr+"&s_lat_type="+s_lat_type+"&has_lat_hh="+has_lat_hh+"&s_adeq_qlty="+s_adeq_qlty+"&s_par_adeq_qlty=0,0&s_inadeq_qlty=0,0,0";
				$.mobile.navigate("#pageSanitation1")
							
			}
		
		
		}else if(sp_con==2){
			if($("#s_par_adeq_qlty_chk").find("input[type='checkbox']:checked").length==0){
				$(".errorChk").text("Required  Partially adequate quality: (state reason for partial quality)");
			}else{
				var s_par_adeq_qlty="";
				for(k=1;k<=$("#s_par_adeq_qlty_chk").find("input[type='checkbox']").length;k++){			
					var s_par_adeq_qlty_ck=$("#s_par_adeq_qlty_"+k).is(":checked")?1:0;			
					if (k==1){
						s_par_adeq_qlty=s_par_adeq_qlty_ck;
					}else{
						s_par_adeq_qlty+=","+s_par_adeq_qlty_ck;
					}			
				}
				sanStr=dtStr+"&s_lat_type="+s_lat_type+"&has_lat_hh="+has_lat_hh+"&s_adeq_qlty=0,0,0,0,0,0,0&s_par_adeq_qlty="+s_par_adeq_qlty+"&s_inadeq_qlty=0,0,0";
				$.mobile.navigate("#pageSanitation1")
					
				
			}
		
		}else if(sp_con==3){
			if($("#s_inadeq_qlty_chk").find("input[type='checkbox']:checked").length==0){
				$(".errorChk").text("Required Inadequate quality of latrine: (state reason for inadequate quality)");
			}else{
				var s_inadeq_qlty="";
				for(l=1;l<=$("#s_inadeq_qlty_chk").find("input[type='checkbox']").length;l++){			
					var s_inadeq_qlty_ck=$("#s_inadeq_qlty_"+l).is(":checked")?1:0;			
					if (l==1){
						s_inadeq_qlty=s_inadeq_qlty_ck;
					}else{
						s_inadeq_qlty+=","+s_inadeq_qlty_ck;
					}			
				}
				sanStr=dtStr+"&s_lat_type="+s_lat_type+"&has_lat_hh="+has_lat_hh+"&s_adeq_qlty=0,0,0,0,0,0,0&s_par_adeq_qlty=0,0&s_inadeq_qlty="+s_inadeq_qlty;
				$.mobile.navigate("#pageSanitation1")
								
			}
			
		}
	
	}	
	
}


function chkSpCon(i){
		$(".errorChk").text("");
					
		if (i==1){
			$("#s_adeq_qlty_chk").show();
			$("#s_par_adeq_qlty_chk").hide();
			$("#s_inadeq_qlty_chk").hide();
			
		}else if(i==2){
			$("#s_adeq_qlty_chk").hide();
			$("#s_par_adeq_qlty_chk").show();
			$("#s_inadeq_qlty_chk").hide();
			
		}else if(i==3){
			$("#s_adeq_qlty_chk").hide();
			$("#s_par_adeq_qlty_chk").hide();
			$("#s_inadeq_qlty_chk").show();
		
		}else{
			$("#s_adeq_qlty_chk").hide();
			$("#s_par_adeq_qlty_chk").hide();
			$("#s_inadeq_qlty_chk").hide();
		}
			
}






var sanStr1="";
function sanitationNext1(){
	$(".errorChk").text("");
	
	var sp_use=$("input[name='sp_use']:checked").val();
	
	if (sp_use=="" || sp_use==undefined){
		$(".errorChk").text("Required Latrine use");
	}else{
		if (sp_use==1){
			if($("#s_in_use_chk").find("input[type='checkbox']:checked").length==0){
				$(".errorChk").text("Required In use all of the time (state the reason for use)");		
			}else{
				var s_in_use="";
				for(i=1;i<=$("#s_in_use_chk").find("input[type='checkbox']").length;i++){			
					var s_in_use_ck=$("#s_in_use_"+i).is(":checked")?1:0;			
					if (i==1){
						s_in_use=s_in_use_ck;
					}else{
						s_in_use+=","+s_in_use_ck;
					}			
				}
				
				sanStr1=sanStr+"&s_in_use="+s_in_use+"&s_in_use_most=0,0,0,0&s_not_use=0,0,0,0";		
				$.mobile.navigate("#pageHygiene")			
			}
			
		}else if(sp_use==2){
			if($("#s_in_use_most_chk").find("input[type='checkbox']:checked").length==0){
				$(".errorChk").text("Required In use most of the time (state the reason for partial use)");	
			}else{
				var s_in_use_most="";
				for(j=1;j<=$("#s_in_use_most_chk").find("input[type='checkbox']").length;j++){			
					var s_in_use_most_ck=$("#s_in_use_most_"+j).is(":checked")?1:0;			
					if (j==1){
						s_in_use_most=s_in_use_most_ck;
					}else{
						s_in_use_most+=","+s_in_use_most_ck;
					}			
				}
				sanStr1=sanStr+"&s_in_use=0,0&s_in_use_most="+s_in_use_most+"&s_not_use=0,0,0,0";		
				$.mobile.navigate("#pageHygiene")				
			}
			
		}else if(sp_use==3){
			 if($("#s_not_use_chk").find("input[type='checkbox']:checked").length==0){
				$(".errorChk").text("Required Not in use (state the reason for not use)");		
			}else{
				var s_not_use="";
				for(k=1;k<=$("#s_not_use_chk").find("input[type='checkbox']").length;k++){			
					var s_not_use_ck=$("#s_not_use_"+k).is(":checked")?1:0;			
					if (k==1){
						s_not_use=s_not_use_ck;
					}else{
						s_not_use+=","+s_not_use_ck;
					}			
				}
				sanStr1=sanStr+"&s_in_use=0,0&s_in_use_most=0,0,0,0&s_not_use="+s_not_use;		
				$.mobile.navigate("#pageHygiene")				
			}		
		}	
	}	
}


function chkSpUse(i){
		$(".errorChk").text("");
					
		if (i==1){
			$("#s_in_use_chk").show();
			$("#s_in_use_most_chk").hide();
			$("#s_not_use_chk").hide();
			
		}else if(i==2){
			$("#s_in_use_chk").hide();
			$("#s_in_use_most_chk").show();
			$("#s_not_use_chk").hide();
			
		}else if(i==3){
			$("#s_in_use_chk").hide();
			$("#s_in_use_most_chk").hide();
			$("#s_not_use_chk").show();
		
		}else{
			$("#s_in_use_chk").hide();
			$("#s_in_use_most_chk").hide();
			$("#s_not_use_chk").hide();
		}
			
}





//hygiene
var hygieneStr="";
function hygieneNext(){
	$(".errorChk").text("");
	
	var h_age_cat=$("#h_age_cat").val();
	var h_dev_lat=$("#h_dev_lat").val();
	var h_water_lat=$("input[name='h_water_lat']:checked").val();
	var h_dev_5m=$("#h_dev_5m").val();
	var h_water_5m=$("input[name='h_water_5m']:checked").val();
	var h_dev_kit_din=$("#h_dev_kit_din").val();
	var h_water_kit=$("input[name='h_water_kit']:checked").val();
	var h_dev_soap=$("input[name='h_dev_soap']:checked").val();
		
	if (h_age_cat=="" || h_age_cat==undefined){
		$(".errorChk").text("Required HH respondent age category");
	}else if (h_dev_lat=="" || h_dev_lat==undefined){
		$(".errorChk").text("Required Hand Washing Device at latrine?");
	}else if (h_water_lat=="" || h_water_lat==undefined){
		$(".errorChk").text("Required Water available into Hand washing device?");
	}else if (h_dev_5m=="" || h_dev_5m==undefined){
		$(".errorChk").text("Required Hand washing device within 5 meters of latrine?");
	}else if (h_water_5m=="" || h_water_5m==undefined){
		$(".errorChk").text("Required Water available into Hand washing device?");
	}else if (h_dev_kit_din=="" || h_dev_kit_din==undefined){
		$(".errorChk").text("Required Hand washing device available at kitchen or dining?");
	}else if (h_water_kit=="" || h_water_kit==undefined){
		$(".errorChk").text("Required Water available into Hand washing device? ");
	}else if (h_dev_soap=="" || h_dev_soap==undefined){
		$(".errorChk").text("Required Soap or soap substitute Available with Hand Washing Device?");
	}else{
		
		if (localStorage.sector=="Water"){
			hygieneStr=waterStr2+"&h_age_cat="+h_age_cat+"&h_dev_lat="+encodeURIComponent(h_dev_lat)+"&h_water_lat="+h_water_lat+"&h_dev_5m="+encodeURIComponent(h_dev_5m)+"&h_water_5m="+h_water_5m+"&h_dev_kit_din="+encodeURIComponent(h_dev_kit_din)+"&h_water_kit="+h_water_kit+"&h_dev_soap="+h_dev_soap
		}else{
			hygieneStr=sanStr1+"&h_age_cat="+h_age_cat+"&h_dev_lat="+encodeURIComponent(h_dev_lat)+"&h_water_lat="+h_water_lat+"&h_dev_5m="+h_dev_5m+"&h_water_5m="+encodeURIComponent(h_water_5m)+"&h_dev_kit_din="+encodeURIComponent(h_dev_kit_din)+"&h_water_kit="+h_water_kit+"&h_dev_soap="+h_dev_soap
			}
		
		$.mobile.navigate("#pageHygiene1")
		
		}
	
	
	}


var hygieneStr1="";
function hygieneNext1(){
	$(".errorChk").text("");
	
	var h_fecal=$("#h_fecal").val();
	
	if($("#h_wash_hand_chk").find("input[type='checkbox']:checked").length==0){
		$(".errorChk").text("Required At what points during the day do you wash your hands with soap?");		
	}else if($("#h_liquid_chk").find("input[type='checkbox']:checked").length==0){
		$(".errorChk").text("Required HH have liquid waste management system?");	
	}else if($("#h_solid_chk").find("input[type='checkbox']:checked").length==0){
		$(".errorChk").text("Required HH have solid waste management system?");		
	}else if(h_fecal==""){
		$(".errorChk").text("Required HH maintaining fecal sludge management?");
	}else{
		var h_wash_hand="";
		for(i=1;i<=$("#h_wash_hand_chk").find("input[type='checkbox']").length;i++){			
			var h_wash_hand_ck=$("#h_wash_hand_"+i).is(":checked")?1:0;			
			if (i==1){
				h_wash_hand=h_wash_hand_ck;
			}else{
				h_wash_hand+=","+h_wash_hand_ck;
			}			
		}
		
		var h_liquid="";
		for(i=1;i<=$("#h_liquid_chk").find("input[type='checkbox']").length;i++){			
			var h_liquid_ck=$("#h_liquid_"+i).is(":checked")?1:0;			
			if (i==1){
				h_liquid=h_liquid_ck;
			}else{
				h_liquid+=","+h_liquid_ck;
			}			
		}
		
		var h_solid="";
		for(i=1;i<=$("#h_solid_chk").find("input[type='checkbox']").length;i++){			
			var h_solid_ck=$("#h_solid_"+i).is(":checked")?1:0;			
			if (i==1){
				h_solid=h_solid_ck;
			}else{
				h_solid+=","+h_solid_ck;
			}			
		}
		
		
		hygieneStr1=hygieneStr+"&h_wash_hand="+h_wash_hand+"&h_liquid="+h_liquid+"&h_solid="+h_solid+"&h_fecal="+encodeURIComponent(h_fecal);
		
		
		$("#btn_take_pic").show();
		$("#btn_ach_lat_long").show();
		$("#btn_ach_submit").show();
		
		$.mobile.navigate("#inPhoto")
	}
		
	
}

function surveyDataSubmit_x(){
	syncDataSurvey()
	}

var collectorName="";

function surveyDataSubmit(){
		$("#btn_ach_submit").hide();
		
		var d = new Date();	
		var get_time=d.getTime();		

		
		latitude=$("#ach_lat").val();
		longitude=$("#ach_long").val();
		
		achPhoto=$("#achPhoto").val();
		collectorName=$("#collectorName").val();

		
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

			if (imagePathA!=""){
				$(".errorChk").text("Syncing photo..");
				imageName = localStorage.mobile_no+"_"+get_time+".jpg";						
				uploadPhotoAch(imagePathA, imageName);
			}

		}//chk photo
	}

function syncDataSurvey(){	
			
			if (localStorage.sector=="Water"){	
				tmpUrl=apipath+'submitSurveyWaterData?cid=PLANBD&mobile_no='+localStorage.mobile_no+'&syncCode='+localStorage.sync_code+'&latitude='+latitude+'&longitude='+longitude+'&ach_photo='+imageName+'&collectorName='+encodeURIComponent(collectorName)+'&ach_startDt='+startDt+hygieneStr1
			}else{
				tmpUrl=apipath+'submitSurveySanData?cid=PLANBD&mobile_no='+localStorage.mobile_no+'&syncCode='+localStorage.sync_code+'&latitude='+latitude+'&longitude='+longitude+'&ach_photo='+imageName+'&collectorName='+encodeURIComponent(collectorName)+'&ach_startDt='+startDt+hygieneStr1
			}
			
			
			
			$.ajax({
					type: 'POST',
					url:tmpUrl,					   
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
							$('form').trigger("reset");
							
							$("#collectorName").val("");
							
							$("#ach_lat").val("");
							$("#ach_long").val("");
							$("#myImageA").val("");							
							//$("input:radio").removeAttr('checked');
							//$("input:checkbox").removeAttr('checked');
							//$("#cbo_combo").val("");
							
							achPlanId="";
							achCBOid="";
							$(".errorChk").text("");
							$(".sucChk").text('Successfully Submitted');
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
	//alert(imageURI)
    var options = new FileUploadOptions();
    options.fileKey="upload";
    options.fileName=imageName;
    options.mimeType="image/jpeg";

    var params = {};
    params.value1 = "test";
    params.value2 = "param";
    options.params = params;
	
	options.chunkedMode = false;

    var ft = new FileTransfer();
	ft.upload(imageURI, encodeURI("http://i01.businesssolutionapps.com/welcome/plan_survey_sync/fileUploader/"),winAch,fail,options);
	//ft.upload(imageURI, encodeURI("http://127.0.0.1:8000/welcome/wab_sync/fileUploader/"),winAch,fail,options);
	
}

function winAch(r) {
	$(".errorChk").text('File upload Successful. Syncing Data...');
	syncDataSurvey();
}


function fail(error) {
	//$(".errorChk").text('Memory or Network Error. Please Save and try to Submit later');
	$(".errorChk").text(JSON.stringify(error));
 
}


//------------------------------------------

function exit() {
navigator.app.exitApp();
//navigator.device.exitApp();
}






//---------------------report Type list	

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



