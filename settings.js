$(document).ready($(".toTop").hide());

/*// using http://learn.jquery.com/events/event-delegation/ for first (and similar) script
$(document).on('click', '.deleteImage', function () {
	if (confirm("Delete image?")) {
		$(this).closest('.imageBox').remove();
		refreshImageEvents();
	}
});*/
$(document).on('click', '.deleteThis', function() {
	$(this).hide();
	$(this).parent().parent().children('.confirmDelete').show();
});

$(document).on('click', '.confirmYes', function() {
$(this).closest('.box').remove();
});

$(document).on('click', '.confirmNo', function() {
	$(this).closest('.confirmDelete').hide();
	$(this).parent().parent().children().children('.deleteThis').show();
});

var global_images = '';
function newTextBlock1() {
	var textblockform = '<div class="col-sm-6 box"><div class="block"><div class="deletable"><div class="confirmDelete"><div class="del">Delete?</div><button type="button" class="close confirmNo">No</button><button type="button" class="close confirmYes">Yes</button></div><div><button type="button" class="close deleteThis" ><span class="glyphicon glyphicon-remove"></span></button></div></div><h4>Textblock</h4><form class="form-horizontal element1-container" role="form""> <div class="form-group"><input type="hidden" class="storeform" id="type" value="TextBlock"><label for="ttitle" class="col-sm-3 control-label">Title</label><div class="col-sm-9"><input type="text" class="form-control storeform" id="ttitle" placeholder="Title"></div><label for="tdescription" class="col-sm-3 control-label">Description</label><div class="col-sm-9"><textarea class="form-control storeform" rows="2" columns="3" id="tdescription" placeholder="Description"></textarea></div><label for="pos" class="col-sm-3 control-label">Position</label><div class="col-sm-9"><input type="number" class="form-control storeform" id="pos" placeholder="1"></div></div></form></div></div>';

	$("#element1Content").append(textblockform);
}
$("ul.newElement1 > li#TextBlock").click(newTextBlock1);

function newImageBlock1() {
	var imageblockform = '<div class="col-sm-6 box"><div class="block"><div class="deletable"><div class="confirmDelete"><div class="del">Delete?</div><button type="button" class="close confirmNo">No</button><button type="button" class="close confirmYes">Yes</button></div><div><button type="button" class="close deleteThis" ><span class="glyphicon glyphicon-remove"></span></button></div></div><h4>Imageblock</h4><form class="form-horizontal element1-container" role="form"><div class="form-group"><input type="hidden" class="storeform" id="type" value="ImageBlock"><label for="ititle" class="col-sm-3 control-label">Title</label><div class="col-sm-9"><input type="text" class="form-control storeform" id="ititle" placeholder="Title"></div><label for="idescription" class="col-sm-3 control-label">Description</label><div class="col-sm-9"><textarea class="form-control storeform" rows="2" id="idescription" placeholder="Description"></textarea></div><label for="iimage" class="col-sm-3 control-label">Image</label><div class="col-sm-9"><select class="form-control storeform imageselect" id="iimage">' + global_images + '</select></div><label for="pos" class="col-sm-3 control-label">Position</label><div class="col-sm-9"><input type="number" class="form-control storeform" id="pos" placeholder="1"></div></div></form></div></div>';

	$("#element1Content").append(imageblockform);
}
$("ul.newElement1 > li#ImageBlock").click(newImageBlock1);

function newStartShopping1() {
	var startshoppingform = '<div class="col-sm-6 box"><div class="block"><div class="deletable"><div class="confirmDelete"><div class="del">Delete?</div><button type="button" class="close confirmNo">No</button><button type="button" class="close confirmYes">Yes</button></div><div><button type="button" class="close deleteThis" ><span class="glyphicon glyphicon-remove"></span></button></div></div><h4>Start Shopping button</h4><form class="form-horizontal element1-container" role="form"><div class="form-group"><input type="hidden" class="storeform" id="type" value="StartShoppingButton"><label for="pos" class="col-sm-3 control-label">Position</label><div class="col-sm-9"><input type="number" class="form-control storeform" id="pos" placeholder="1"></div></form></div></div>';

	$("#element1Content").append(startshoppingform);
}
$("ul.newElement1 > li#StartShopping").click(newStartShopping1);
	
function newCarousel1() {
	var carouselform = '<div class="col-sm-6 box"><div class="block"><div class="deletable"><div class="confirmDelete"><div class="del">Delete?</div><button type="button" class="close confirmNo">No</button><button type="button" class="close confirmYes">Yes</button></div><div><button type="button" class="close deleteThis" ><span class="glyphicon glyphicon-remove"></span></button></div></div><h4>Carousel</h4><form class="form-horizontal element1-container" role="form"><div class="form-group"><input type="hidden" class="storeform" id="type" value="Carousel"><label for="cimage1" class="col-sm-3 control-label">Image</label><div class="col-sm-9"><select class="form-control storeform imageselect" id="cimage1">' + global_images + '</select></div><label for="cimage2" class="col-sm-3 control-label">Image</label><div class="col-sm-9"><select class="form-control storeform imageselect" id="cimage2">' + global_images + '</select></div><label for="cimage3" class="col-sm-3 control-label">Image</label><div class="col-sm-9"><select class="form-control storeform imageselect" id="cimage3">' + global_images + '</select></div><label for="pos" class="col-sm-3 control-label">Position</label><div class="col-sm-9"><input type="number" class="form-control storeform" id="pos" placeholder="1"></div></div></form></div></div>';

	$("#element1Content").append(carouselform);
}
$("ul.newElement1 > li#Carousel").click(newCarousel1);
	
function newTextBlock2() {
	var textblockform = '<div class="col-sm-6 box"><div class="block"><div class="deletable"><div class="confirmDelete"><div class="del">Delete?</div><button type="button" class="close confirmNo">No</button><button type="button" class="close confirmYes">Yes</button></div><div><button type="button" class="close deleteThis" ><span class="glyphicon glyphicon-remove"></span></button></div></div><h4>Textblock</h4><form class="form-horizontal element2-container" role="form""> <div class="form-group"><input type="hidden" class="storeform" id="type" value="TextBlock"><label for="ttitle" class="col-sm-3 control-label">Title</label><div class="col-sm-9"><input type="text" class="form-control storeform" id="ttitle" placeholder="Title"></div><label for="tdescription" class="col-sm-3 control-label">Description</label><div class="col-sm-9"><textarea class="form-control storeform" rows="2" columns="3" id="tdescription" placeholder="Description"></textarea></div><label for="pos" class="col-sm-3 control-label">Position</label><div class="col-sm-9"><input type="number" class="form-control storeform" id="pos" placeholder="1"></div></div></form></div></div>';

	$("#element2Content").append(textblockform);
}
$("ul.newElement2 > li#TextBlock").click(newTextBlock2);

function newImageBlock2() {
	var imageblockform = '<div class="col-sm-6 box"><div class="block"><div class="deletable"><div class="confirmDelete"><div class="del">Delete?</div><button type="button" class="close confirmNo">No</button><button type="button" class="close confirmYes">Yes</button></div><div><button type="button" class="close deleteThis" ><span class="glyphicon glyphicon-remove"></span></button></div></div><h4>Imageblock</h4><form class="form-horizontal element2-container" role="form"><div class="form-group"><input type="hidden" class="storeform" id="type" value="ImageBlock"><label for="ititle" class="col-sm-3 control-label">Title</label><div class="col-sm-9"><input type="text" class="form-control storeform" id="ititle" placeholder="Title"></div><label for="idescription" class="col-sm-3 control-label">Description</label><div class="col-sm-9"><textarea class="form-control storeform" rows="2" id="idescription" placeholder="Description"></textarea></div><label for="iimage" class="col-sm-3 control-label">Image</label><div class="col-sm-9"><select class="form-control storeform imageselect" id="iimage">' + global_images + '</select></div><label for="pos" class="col-sm-3 control-label">Position</label><div class="col-sm-9"><input type="number" class="form-control storeform" id="pos" placeholder="1"></div></div></form></div></div>';

	$("#element2Content").append(imageblockform);
}
$("ul.newElement2 > li#ImageBlock").click(newImageBlock2);

function newProductList2() {
	var productlistform = '<div class="col-sm-6 box"><div class="block"><div class="deletable"><div class="confirmDelete"><div class="del">Delete?</div><button type="button" class="close confirmNo">No</button><button type="button" class="close confirmYes">Yes</button></div><div><button type="button" class="close deleteThis" ><span class="glyphicon glyphicon-remove"></span></button></div></div><h4>Product List</h4><form class="form-horizontal element2-container" role="form"><div class="form-group"><input type="hidden" class="storeform" id="type" value="ProductList"><label for="pos" class="col-sm-3 control-label">Position</label><div class="col-sm-9"><input type="number" class="form-control storeform" id="pos" placeholder="1"></div></form></div></div>';

	$("#element2Content").append(productlistform);
}
$("ul.newElement2 > li#ProductList").click(newProductList2);

function newCarousel2() {
	var carouselform = '<div class="col-sm-6 box"><div class="block"><div class="deletable"><div class="confirmDelete"><div class="del">Delete?</div><button type="button" class="close confirmNo">No</button><button type="button" class="close confirmYes">Yes</button></div><div><button type="button" class="close deleteThis" ><span class="glyphicon glyphicon-remove"></span></button></div></div><h4>Carousel</h4><form class="form-horizontal element2-container" role="form"><div class="form-group"><input type="hidden" class="storeform" id="type" value="Carousel"><label for="cimage1" class="col-sm-3 control-label">Image</label><div class="col-sm-9"><select class="form-control storeform imageselect" id="cimage1">' + global_images + '</select></div><label for="cimage2" class="col-sm-3 control-label">Image</label><div class="col-sm-9"><select class="form-control storeform imageselect" id="cimage2">' + global_images + '</select></div><label for="cimage3" class="col-sm-3 control-label">Image</label><div class="col-sm-9"><select class="form-control storeform imageselect" id="cimage3">' + global_images + '</select></div><label for="pos" class="col-sm-3 control-label">Position</label><div class="col-sm-9"><input type="number" class="form-control storeform" id="pos" placeholder="1"></div></div></form></div></div>';

	$("#element2Content").append(carouselform);
}
$("ul.newElement2 > li#Carousel").click(newCarousel2);

function newImage() {
	var imageform = '<div class="col-sm-6 box"><div class="block"><div class="deletable"><div class="confirmDelete"><div class="del">Delete?</div><button type="button" class="close confirmNo">No</button><button type="button" class="close confirmYes">Yes</button></div><div><button type="button" class="close deleteThis"><span class="glyphicon glyphicon-remove"></span></button></div></div><div class="col-sm-12"><img class="img-thumbnail imagethumb" src="http://placehold.it/200x200&text=Thumbnail" alt="200x200"></img></div><form class="form-horizontal image-container" role="form" action="/addimage" method="post" enctype="multipart/form-data"><div class="form-group"><div><label for="imname" class="col-sm-4 control-label">Name</label><div class="col-sm-8"><input type="text" class="form-control storeform" id="imname" placeholder="Image name" name="imname"><input type="hidden" id="email" name="email" class="storeform" placeholder="" value="' + getCookie("email") + '"></div><label for="imfile" class="col-sm-4 control-label">Image File</label><div class="col-sm-8"><input type="file" class="form-control imfile" name="imfile"><input type="text" id="filename" class="form-control filename storeform" placeholder="filename.png"><div class="button-group"> <a href="#" class="btn btn btn-default browse" role="button">Browse</a> <input type="submit" class="btn btn-default" value="Save"/></div></div></div></div></form></div></div>';
	$("#imagesContent").append(imageform);
	refreshImageEvents();
}
$(".newImage").click(newImage);

function newProduct() {
	var productform = '<div class="col-sm-6 box"><div class="block" ><div class="deletable"><div class="confirmDelete"><div class="del">Delete?</div><button type="button" class="close confirmNo">No</button><button type="button" class="close confirmYes">Yes</button></div><div><button type="button" class="close deleteThis" ><span class="glyphicon glyphicon-remove"></span></button></div></div><form class="form-horizontal product-container" role="form""><div class="form-group"><label for="ptitle" class="col-sm-3 control-label">Product</label><div class="col-sm-9"><input type="text" class="form-control storeform" id="ptitle" placeholder="Product Name"></div><label for="psdescription" class="col-sm-3 control-label">Short Description</label><div class="col-sm-9"><textarea class="form-control storeform" rows="2" id="psdescription"  placeholder="Short Description"></textarea></div><label for="pldescription" class="col-sm-3 control-label">Long Description</label><div class="col-sm-9"><textarea class="form-control storeform" rows="2" id="pldescription"  placeholder="Long Description"></textarea></div><label for="pprice" class="col-sm-3 control-label">Price</label><div class="col-sm-9"><input type="number" class="form-control storeform" id="pprice" placeholder="Price"></div><label for="pimage" class="col-sm-3 control-label">Image</label><div class="col-sm-9"><select class="form-control storeform imageselect" id="pimage">' + global_images + '</select></div><label for="ptags" class="col-sm-3 control-label">Tags</label><div class="col-sm-9"><textarea class="form-control storeform" rows="2" id="ptags"  placeholder="Tags (comma separated)"></textarea></div></div></form></div></div>';
	$("#productContent").append(productform);
}
$(".newProduct").click(newProduct);

$(".toTop").click(
	function () {
		$("html,body").animate({
			scrollTop: 0
		});
	});
$(window).scroll(function () {
	var notTop = $(window).scrollTop();
	if (notTop) {
		$(".toTop").show()
	} else {
		$(".toTop").hide()
	}
});

var reader = new FileReader();

function refreshImageEvents() {
	var browsebuttons = $(".browse");
	var images = $(".imfile");
	var filenames = $('.filename');
	var imagethumbs = $('.imagethumb');

	browsebuttons.unbind("click");
	images.unbind("change");	

	for (var i = 0; i < browsebuttons.length; i++) {
		
		(function (i) {
			$(browsebuttons[i]).click(function (event) {
				images[i].click();
				console.log("you clicked browse button number " + i);
				event.preventDefault();
			});

			$(images[i]).change(function (event) {
				$(filenames[i]).val($(this).val());

				reader.readAsDataURL(this.files[0]);
				reader.onloadend = function () {
					imagethumbs[i].src = this.result; //not the same this as before
				};

				event.preventDefault();
			});
		}(i));
	}
}

refreshImageEvents();

function parseSettingsForms() {
	var forms = $('.storeform-container');
	var logged = document.cookie.slice(6);
	var formObject = {
		settings: {}
	};
	formObject.user = logged.replace(".", "_").replace("@", "__");
	var fields;

	$('.settings-container').each(function () {
		category = this.id
		formObject.settings[category] = {};
		$(this).find('.storeform').each(function () {
			if (this.type == 'checkbox') { //strange bug with checkboxes not properly storing their value.
				formObject.settings[category][this.id] = $(this).is(':checked');
			} else {
				formObject.settings[category][this.id] = this.value ? this.value : "";
			}
		});
	});
	$.post("/changesettings", JSON.stringify(formObject), function (serverreply) {
		alert(serverreply);
	});

}

function parseProductForms() {
	var forms = $('.storeform-container');
	var logged = document.cookie.slice(6);
	var formObject = {
		products: []
	};
	formObject.user = logged.replace(".", "_").replace("@", "__");
	var fields;
	$('.product-container').each(function (i) {
		formObject.products[i] = {};
		$(this).find('.storeform').each(function () {
				formObject.products[i][this.id] = this.value ? this.value : this.placeholder;
		});
	});
	$.post("/changeproducts", JSON.stringify(formObject), function (serverreply) {
		alert(serverreply);
	});

}

function parseFrontPageForms() {
	var forms = $('.storeform-container');
	var logged = document.cookie.slice(6);
	var formObject = {
		frontPageElements: []
	};
	formObject.user = logged.replace(".", "_").replace("@", "__");
	var fields;
	$('.element1-container').each(function (i) {
		formObject.frontPageElements[i] = {};
		$(this).find('.storeform').each(function () {
				formObject.frontPageElements[i][this.id] = this.value ? this.value : this.placeholder;
		});
	});

	$.post("/changefrontpage", JSON.stringify(formObject), function (serverreply) {
		alert(serverreply);
	});

}

function parseProductsPageForms() {
	var forms = $('.storeform-container');
	var logged = getCookie("email");
	var formObject = {
		productsPageElements: []
	};
	formObject.user = logged.replace(".", "_").replace("@", "__");
	var fields;
	$('.element2-container').each(function (i) {
		formObject.productsPageElements[i] = {};
		$(this).find('.storeform').each(function () {
				formObject.productsPageElements[i][this.id] = this.value ? this.value : this.placeholder;
		});
	});

	$.post("/changeproductpage", JSON.stringify(formObject), function (serverreply) {
		alert(serverreply);
	});

}


$('.settingssubmit').click(parseSettingsForms);
$('.productssubmit').click(parseProductForms);
$('.frontsubmit').click(parseFrontPageForms);
$('.productpagesubmit').click(parseProductsPageForms);
$('.reset').click(reset);

var hash = window.location.hash;
hash && $('ul.nav a[href="' + hash + '"]').tab('show'); //link to specific tab

history.pushState("", document.title, window.location.pathname); //remove anchor from url

function populateSettings(callback) {
	$.ajax({url: "/getstoredata/" + getCookie("email")}).done(function (data) {
		var imageselect = '';
		
	
		for (var i = 0; i < data.images.length; i++) {
			newImage();
			
			$("#imagesContent .imagethumb")[i].src = "/store/" + data.settings.page.pageURL + "/images/" + data.images[i].iimage;
			$("#imagesContent #imname")[i].value = data.images[i].ititle;
			$("#imagesContent .filename")[i].value = data.images[i].iimage;
			
			(function (img_url) { //make it so that deleting image sends a delete request
				$($('#imagesContent .confirmYes')[i]).click(function() {
					$.post("/deleteimage/" + getCookie("email") + "/" + img_url);
				});
			}(data.images[i].iimage));
			imageselect = imageselect + '<option>'+data.images[i].iimage[0]+'</option>';
		}
		$("#imagesContent .btn").addClass("hidden");
		oldInputs = $("#imagesContent input");
		for (i = 0; i < oldInputs.length; i++) {
			oldInputs[i].disabled = true;
			oldInputs[i].placeholder = "";
		}
		global_images = imageselect;
		
		for (i = 0; i < data.products.length; i++) {
			newProduct();
			
			$("#productContent #ptitle")[i].value = data.products[i].ptitle;
			$("#productContent #psdescription")[i].value = data.products[i].psdescription;
			$("#productContent #pldescription")[i].value = data.products[i].pldescription;
			$("#productContent #pprice")[i].value = data.products[i].pprice;
			$("#productContent #pimage")[i].value = data.products[i].pimage;
			$("#productContent #ptags")[i].value = data.products[i].ptags;
		}
		$('#navbarLogo').html(global_images);
		for (var field in data.settings) {
			if (typeof data.settings[field] == "object") {
				for (field2 in data.settings[field]) {
					var input = $("#"+field2)[0];
					if (input.type == "checkbox") {
						input.checked = data.settings[field][field2];
					} else {
						input.value = data.settings[field][field2];
					}
					if (field2 == "pageURL") {
						$('#storelink2')[0].href = "/store/" + data.settings[field][field2];
					}
				}
			} else if (field == "hasBeenGenerated" && data.settings[field] == true) {
				$('#storelink').removeClass('hidden');
			}
		}
		
		for (i = 0; i < data.homePageElements.length; i++) {
			var element = data.homePageElements[i];
			if (element.type == "TextBlock") {
				newTextBlock1();
			} else if (element.type == "ImageBlock") {
				newImageBlock1();
			} else if (element.type == "StartShoppingButton") {
				newStartShopping1();
			} else if (element.type == "Carousel") {
				newCarousel1();
			}
			for (var j = 0; j < element.fields.length; j++) {
				try {
					var key = Object.keys(element.fields[j])[0];
					$('#elements1 .block').slice(i,i+1).find('#'+key)[0].value = element.fields[j][key];
				} catch (TypeError) {;}
			}
			$('#elements1 #pos')[i].value = element.pos;
		}
		
		for (i = 0; i < data.productsPageElements.length; i++) {
			var element = data.productsPageElements[i];
			if (element.type == "TextBlock") {
				newTextBlock2();
			} else if (element.type == "ImageBlock") {
				newImageBlock2();
			} else if (element.type == "ProductList") {
				newProductList2();
			} else if (element.type == "Carousel") {
				newCarousel2();
			}
			for (var j = 0; j < element.fields.length; j++) {
				try {
					var key = Object.keys(element.fields[j])[0];
					$('#elements2 .block').slice(i,i+1).find('#'+key)[0].value = element.fields[j][key];
				} catch (TypeError) {;}
			}
			$('#elements2 #pos')[i].value = element.pos;
		}
		
		callback(data);
	});
}

var global_data = {}
populateSettings(function (data) {
	global_data = data;
});
function reset() {
	$('.box').remove();
	populateSettings(function (data) {
		global_data = data;
	});
}
