$(document).ready($(".toTop").hide());

// using http://learn.jquery.com/events/event-delegation/ for first (and similar) script
$(document).on('click', '.deleteImage', function () {
	if (confirm("Delete image?")) {
		$(this).closest('.imageBox').remove();
		refreshImageEvents();
	}
});
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



/*$(document).on('click', '.deleteProduct', function () {
	if (confirm("Delete product?")) {
		$(this).closest('.productBox').remove();
	}
});*/
$(document).on('click', '.deleteTextblock', function () {
	if (confirm("Delete Text Block?")) {
		$(this).closest('.textblockBox').remove();
	}
});
$(document).on('click', '.deleteImageblock', function () {
	if (confirm("Delete Image Block?")) {
		$(this).closest('.imageblockBox').remove();
	}
});
$(document).on('click', '.deleteProductblock', function () {
	if (confirm("Delete Product List?")) {
		$(this).closest('.productblockBox').remove();
	}
});
$(document).on('click', '.deleteStartShoppingblock', function () {
	if (confirm('Delete Start Shopping Button?')) {
		$(this).closest('.startshoppingblockBox').remove();
	}
});

$("ul.newElement1 > li#TextBlock").click(
	function () {
		var textblockform = '<div class="col-sm-6 box"><div class="block"><div class="deletable"><div class="confirmDelete"><div class="del">Delete?</div><button type="button" class="close confirmNo">No</button><button type="button" class="close confirmYes">Yes</button></div><div><button type="button" class="close deleteThis" ><span class="glyphicon glyphicon-remove"></span></button></div></div><h4>Textblock</h4><form class="form-horizontal element1-container" role="form""> <div class="form-group"><input type="hidden" class="storeform" id="type" value="TextBlock"><label for="ttitle" class="col-sm-3 control-label">Title</label><div class="col-sm-9"><input type="text" class="form-control storeform" id="ttitle" placeholder="Title"></div><label for="tdescription" class="col-sm-3 control-label">Description</label><div class="col-sm-9"><textarea class="form-control storeform" rows="2" columns="3" id="tdescription" placeholder="Description"></textarea></div><label for="pos" class="col-sm-3 control-label">Position</label><div class="col-sm-9"><input type="number" class="form-control storeform" id="pos" placeholder="1"></div></div></form></div></div>';

		$("#element1Content").append(textblockform)
	});

$("ul.newElement1 > li#ImageBlock").click(
	function () {
		var imageblockform = '<div class="col-sm-6 box"><div class="block"><div class="deletable"><div class="confirmDelete"><div class="del">Delete?</div><button type="button" class="close confirmNo">No</button><button type="button" class="close confirmYes">Yes</button></div><div><button type="button" class="close deleteThis" ><span class="glyphicon glyphicon-remove"></span></button></div></div><h4>Imageblock</h4><form class="form-horizontal element1-container" role="form"><div class="form-group"><input type="hidden" class="storeform" id="type" value="ImageBlock"><label for="ititle" class="col-sm-3 control-label">Title</label><div class="col-sm-9"><input type="text" class="form-control storeform" id="ititle" placeholder="Title"></div><label for="idescription" class="col-sm-3 control-label">Description</label><div class="col-sm-9"><textarea class="form-control storeform" rows="2" id="idescription" placeholder="Description"></textarea></div><label for="iimage" class="col-sm-3 control-label">Image</label><div class="col-sm-9"><select class="form-control storeform" id="iimage"><option>None</option><option>image1.jpg</option><option>image2.jpg</option><option>image3.jpg</option><option>image4.jpg</option><option>image5.jpg</option></select></div><label for="pos" class="col-sm-3 control-label">Position</label><div class="col-sm-9"><input type="number" class="form-control storeform" id="pos" placeholder="1"></div></div></form></div></div>';

		$("#element1Content").append(imageblockform)
	});

$("ul.newElement1 > li#StartShopping").click(
	function () {
		var startshoppingform = '<div class="col-sm-6 box"><div class="block"><div class="deletable"><div class="confirmDelete"><div class="del">Delete?</div><button type="button" class="close confirmNo">No</button><button type="button" class="close confirmYes">Yes</button></div><div><button type="button" class="close deleteThis" ><span class="glyphicon glyphicon-remove"></span></button></div></div><h4>Start Shopping button</h4><form class="form-horizontal element1-container" role="form"><div class="form-group"><input type="hidden" class="storeform" id="type" value="StartShoppingButton"><label for="pos" class="col-sm-3 control-label">Position</label><div class="col-sm-9"><input type="number" class="form-control storeform" id="pos" placeholder="1"></div></form></div></div>';

		$("#element1Content").append(startshoppingform)
	});
	
$("ul.newElement1 > li#Carousel").click(
	function () {
		var carouselform = '<div class="col-sm-6 box"><div class="block"><div class="deletable"><div class="confirmDelete"><div class="del">Delete?</div><button type="button" class="close confirmNo">No</button><button type="button" class="close confirmYes">Yes</button></div><div><button type="button" class="close deleteThis" ><span class="glyphicon glyphicon-remove"></span></button></div></div><h4>Carousel</h4><form class="form-horizontal element1-container" role="form"><div class="form-group"><input type="hidden" class="storeform" id="type" value="Carousel"><label for="cimage1" class="col-sm-3 control-label">Image</label><div class="col-sm-9"><select class="form-control storeform" id="cimage1"><option>None</option><option>image1.jpg</option><option>image2.jpg</option><option>image3.jpg</option><option>image4.jpg</option><option>image5.jpg</option></select></div><label for="cimage2" class="col-sm-3 control-label">Image</label><div class="col-sm-9"><select class="form-control storeform" id="cimage2"><option>None</option><option>image1.jpg</option><option>image2.jpg</option><option>image3.jpg</option><option>image4.jpg</option><option>image5.jpg</option></select></div><label for="cimage3" class="col-sm-3 control-label">Image</label><div class="col-sm-9"><select class="form-control storeform" id="cimage3"><option>None</option><option>image1.jpg</option><option>image2.jpg</option><option>image3.jpg</option><option>image4.jpg</option><option>image5.jpg</option></select></div><label for="pos" class="col-sm-3 control-label">Position</label><div class="col-sm-9"><input type="number" class="form-control storeform" id="pos" placeholder="1"></div></div></form></div></div>';

		$("#element1Content").append(carouselform)
	});
	
$("ul.newElement2 > li#TextBlock").click(
	function () {
		var textblockform = '<div class="col-sm-6 box"><div class="block"><div class="deletable"><div class="confirmDelete"><div class="del">Delete?</div><button type="button" class="close confirmNo">No</button><button type="button" class="close confirmYes">Yes</button></div><div><button type="button" class="close deleteThis" ><span class="glyphicon glyphicon-remove"></span></button></div></div><h4>Textblock</h4><form class="form-horizontal element2-container" role="form""> <div class="form-group"><input type="hidden" class="storeform" id="type" value="TextBlock"><label for="ttitle" class="col-sm-3 control-label">Title</label><div class="col-sm-9"><input type="text" class="form-control storeform" id="ttitle" placeholder="Title"></div><label for="tdescription" class="col-sm-3 control-label">Description</label><div class="col-sm-9"><textarea class="form-control storeform" rows="2" columns="3" id="tdescription" placeholder="Description"></textarea></div><label for="pos" class="col-sm-3 control-label">Position</label><div class="col-sm-9"><input type="number" class="form-control storeform" id="pos" placeholder="1"></div></div></form></div></div>';

		$("#element2Content").append(textblockform)
	});

$("ul.newElement2 > li#ImageBlock").click(
	function () {
		var imageblockform = '<div class="col-sm-6 box"><div class="block"><div class="deletable"><div class="confirmDelete"><div class="del">Delete?</div><button type="button" class="close confirmNo">No</button><button type="button" class="close confirmYes">Yes</button></div><div><button type="button" class="close deleteThis" ><span class="glyphicon glyphicon-remove"></span></button></div></div><h4>Imageblock</h4><form class="form-horizontal element2-container" role="form"><div class="form-group"><input type="hidden" class="storeform" id="type" value="ImageBlock"><label for="ititle" class="col-sm-3 control-label">Title</label><div class="col-sm-9"><input type="text" class="form-control storeform" id="ititle" placeholder="Title"></div><label for="idescription" class="col-sm-3 control-label">Description</label><div class="col-sm-9"><textarea class="form-control storeform" rows="2" id="idescription" placeholder="Description"></textarea></div><label for="iimage" class="col-sm-3 control-label">Image</label><div class="col-sm-9"><select class="form-control storeform" id="iimage"><option>None</option><option>image1.jpg</option><option>image2.jpg</option><option>image3.jpg</option><option>image4.jpg</option><option>image5.jpg</option></select></div><label for="pos" class="col-sm-3 control-label">Position</label><div class="col-sm-9"><input type="number" class="form-control storeform" id="pos" placeholder="1"></div></div></form></div></div>';

		$("#element2Content").append(imageblockform)
	});

$("ul.newElement2 > li#ProductList").click(
	function () {
		var productlistform = '<div class="col-sm-6 box"><div class="block"><div class="deletable"><div class="confirmDelete"><div class="del">Delete?</div><button type="button" class="close confirmNo">No</button><button type="button" class="close confirmYes">Yes</button></div><div><button type="button" class="close deleteThis" ><span class="glyphicon glyphicon-remove"></span></button></div></div><h4>Product List</h4><form class="form-horizontal element2-container" role="form"><div class="form-group"><input type="hidden" class="storeform" id="type" value="ProductList"><label for="pos" class="col-sm-3 control-label">Position</label><div class="col-sm-9"><input type="number" class="form-control storeform" id="pos" placeholder="1"></div></form></div></div>';

		$("#element2Content").append(productlistform)
	});

$("ul.newElement2 > li#Carousel").click(
	function () {
		var carouselform = '<div class="col-sm-6 box"><div class="block"><div class="deletable"><div class="confirmDelete"><div class="del">Delete?</div><button type="button" class="close confirmNo">No</button><button type="button" class="close confirmYes">Yes</button></div><div><button type="button" class="close deleteThis" ><span class="glyphicon glyphicon-remove"></span></button></div></div><h4>Carousel</h4><form class="form-horizontal element2-container" role="form"><div class="form-group"><input type="hidden" class="storeform" id="type" value="Carousel"><label for="cimage1" class="col-sm-3 control-label">Image</label><div class="col-sm-9"><select class="form-control storeform" id="cimage1"><option>None</option><option>image1.jpg</option><option>image2.jpg</option><option>image3.jpg</option><option>image4.jpg</option><option>image5.jpg</option></select></div><label for="cimage2" class="col-sm-3 control-label">Image</label><div class="col-sm-9"><select class="form-control storeform" id="cimage2"><option>None</option><option>image1.jpg</option><option>image2.jpg</option><option>image3.jpg</option><option>image4.jpg</option><option>image5.jpg</option></select></div><label for="cimage3" class="col-sm-3 control-label">Image</label><div class="col-sm-9"><select class="form-control storeform" id="cimage3"><option>None</option><option>image1.jpg</option><option>image2.jpg</option><option>image3.jpg</option><option>image4.jpg</option><option>image5.jpg</option></select></div><label for="pos" class="col-sm-3 control-label">Position</label><div class="col-sm-9"><input type="number" class="form-control storeform" id="pos" placeholder="1"></div></div></form></div></div>';

		$("#element2Content").append(carouselform)
	});

$(".newImage").click(
	function () {
		var imageform = '<div class="col-sm-6 box"><div class="block"><div class="deletable"><div class="confirmDelete"><div class="del">Delete?</div><button type="button" class="close confirmNo">No</button><button type="button" class="close confirmYes">Yes</button></div><div><button type="button" class="close deleteThis" ><span class="glyphicon glyphicon-remove"></span></button></div></div><div class="col-sm-12"><img class="img-thumbnail imagethumb" src="http://placehold.it/200x200&text=Thumbnail" alt="200x200"></img></div><form class="form-horizontal image-container" role="form"><div class="form-group"><div><label for="imname" class="col-sm-4 control-label">Name</label><div class="col-sm-8"><input type="text" class="form-control" id="imname" placeholder="Image name"></div><label for="imfile" class="col-sm-4 control-label">Image File</label><div class="col-sm-8"><input type="file" class="form-control storeform imfile" ><input type="text" class="filename"><div class="button-group"> <a href="#" class="browse">Browse</a></div></div></div></div></form></div></div>';
		$("#imagesContent").append(imageform);
		refreshImageEvents();
	}
);

$(".newProduct").click(
	function () {
		var productform = '<div class="col-sm-6 box"><div class="block" ><div class="deletable"><div class="confirmDelete"><div class="del">Delete?</div><button type="button" class="close confirmNo">No</button><button type="button" class="close confirmYes">Yes</button></div><div><button type="button" class="close deleteThis" ><span class="glyphicon glyphicon-remove"></span></button></div></div><form class="form-horizontal product-container" role="form""><div class="form-group"><label for="ptitle" class="col-sm-3 control-label">Product</label><div class="col-sm-9"><input type="text" class="form-control storeform" id="ptitle" placeholder="Product Name"></div><label for="psdescription" class="col-sm-3 control-label">Short Description</label><div class="col-sm-9"><textarea class="form-control storeform" rows="2" id="psdescription"  placeholder="Short Description"></textarea></div><label for="pldescription" class="col-sm-3 control-label">Long Description</label><div class="col-sm-9"><textarea class="form-control storeform" rows="2" id="pldescription"  placeholder="Long Description"></textarea></div><label for="pprice" class="col-sm-3 control-label">Price</label><div class="col-sm-9"><input type="number" class="form-control storeform" id="pprice" placeholder="Price"></div><label for="pimage" class="col-sm-3 control-label">Image</label><div class="col-sm-9"><select class="form-control storeform" id="pimage"><option>None</option><option>image1.jpg</option><option>image2.jpg</option><option>image3.jpg</option><option>image4.jpg</option><option>image5.jpg</option></select></div><label for="ptags" class="col-sm-3 control-label">Tags</label><div class="col-sm-9"><textarea class="form-control storeform" rows="2" id="ptags"  placeholder="Tags (comma separated)"></textarea></div></div></form></div></div>';
		$("#productContent").append(productform);
	}
);
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
				formObject.settings[category][this.id] = this.value ? this.value : this.placeholder;
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
			if (this.type == 'checkbox') { //strange bug with checkboxes not properly storing their value.
				formObject.products[i][this.id] = $(this).is(':checked');
			} else {
				formObject.products[i][this.id] = this.value ? this.value : this.placeholder;
			}
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
			if (this.type == 'checkbox') { //strange bug with checkboxes not properly storing their value.
				formObject.frontPageElements[i][this.id] = $(this).is(':checked');
			} else {
				formObject.frontPageElements[i][this.id] = this.value ? this.value : this.placeholder;
			}
		});
	});

	$.post("/changefrontpage", JSON.stringify(formObject), function (serverreply) {
		alert(serverreply);
	});

}

function parseProductsPageForms() {
	var forms = $('.storeform-container');
	var logged = document.cookie.slice(6);
	var formObject = {
		productsPageElements: []
	};
	formObject.user = logged.replace(".", "_").replace("@", "__");
	var fields;
	$('.element2-container').each(function (i) {
		formObject.productsPageElements[i] = {};
		$(this).find('.storeform').each(function () {
			if (this.type == 'checkbox') { //strange bug with checkboxes not properly storing their value.
				formObject.productsPageElements[i][this.id] = $(this).is(':checked');
			} else {
				formObject.productsPageElements[i][this.id] = this.value ? this.value : this.placeholder;
			}
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
