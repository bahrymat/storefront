$( document ).ready($(".toTop").hide());

// using http://learn.jquery.com/events/event-delegation/ for first (and similar) script
$(document).on('click','.deleteImage', function(){if(confirm("Delete image?")){$(this).closest('.imageBox').remove();}}
			);

			$(document).on('click','.deleteProduct', function(){if(confirm("Delete product?")){$(this).closest('.productBox').remove();}}
			);
			$(document).on('click','.deleteTextblock', function(){if(confirm("Delete Text Block?")){$(this).closest('.textblockBox').remove();}}
			);
			$(document).on('click','.deleteImageblock', function(){if(confirm("Delete Image Block?")){$(this).closest('.imageblockBox').remove();}}
			);
	$(document).on('click','.deleteProductblock', function(){if(confirm("Delete Product List?")){$(this).closest('.productblockBox').remove();}}
			);

			$("ul.newElement > li#TextBlock").click(
				function(){var textblockform = '<div class="col-sm-6 textblockBox"><div class="block"><div class="titles">Text Block<button type="button" class="close deleteTextblock" aria-hidden="true">&times;</button></div><form class="form-horizontal element-container" role="form""> <div class="form-group"><label for="ttitle" class="col-sm-3 control-label">Title</label><div class="col-sm-9"><input type="text" class="form-control storeform" id="ttitle" placeholder="Title"></div><label for="tdescription" class="col-sm-3 control-label">Description</label><div class="col-sm-9"><textarea class="form-control storeform" rows="2" columns="3" id="tdescription" placeholder="Description"></textarea></div><label for="pos" class="col-sm-3 control-label">Position</label><div class="col-sm-9"><input type="number" class="form-control storeform" id="pos" placeholder="n + 1"></div></div></form></div></div>';

$("#elementContent").append(textblockform)});

$("ul.newElement > li#ImageBlock").click(
				function(){var imageblockform = '<div class="col-sm-6 imageblockBox"><div class="block"><div class="titles">Image Block<button type="button" class="close deleteImageblock" aria-hidden="true">&times;</button></div><form class="form-horizontal element-container" role="form"><div class="form-group"><label for="ititle" class="col-sm-3 control-label">Title</label><div class="col-sm-9"><input type="text" class="form-control storeform" id="ititle" placeholder="Title"></div><label for="idescription" class="col-sm-3 control-label">Description</label><div class="col-sm-9"><textarea class="form-control storeform" rows="2" id="idescription" placeholder="Description"></textarea></div><label for="iimage" class="col-sm-3 control-label">Image</label><div class="col-sm-9"><select class="form-control storeform" id="iimage"><option>None</option><option>image1.jpg</option><option>image2.jpg</option><option>image3.jpg</option><option>image4.jpg</option><option>image5.jpg</option></select></div><label for="pos" class="col-sm-3 control-label">Position</label><div class="col-sm-9"><input type="number" class="form-control storeform" id="pos" placeholder="n + 1"></div></div></form></div></div>';

$("#elementContent").append(imageblockform)});

$("ul.newElement > li#ProductList").click(
				function(){var productlistform = '<div class="col-sm-6 productblockBox"><div class="block"><div class="titles">Product List<button type="button" class="close deleteProductblock" aria-hidden="true">&times;</button></div><form class="form-horizontal element-container" role="form"><div class="form-group"><label for="pos" class="col-sm-3 control-label">Position</label><div class="col-sm-9"><input type="number" class="form-control storeform" id="pos" placeholder="n + 1"></div></form></div></div>';

$("#elementContent").append(productlistform)});

			$(".newImage").click(
				function(){var imageform = '<div class="col-sm-6 imageBox"><div class="block"><button type="button" class="close deleteImage" aria-hidden="true">&times;</button><br><div class="col-sm-12"><img class="img-thumbnail imagethumb" src="http://placehold.it/200x200&text=Thumbnail" alt="200x200"></img></div><form class="form-horizontal image-container" role="form"><div class="form-group"><div><label for="imname" class="col-sm-4 control-label">Name</label><div class="col-sm-8"><input type="text" class="form-control" id="imname" placeholder="Image name"></div><label for="imfile" class="col-sm-4 control-label">Image File</label><div class="col-sm-8"><input type="file" class="form-control storeform" id="imfile" ><input type="text" id="filename"><div class="button-group"> <a href="#" id="browse">Browse</a></div></div></div></div></form></div></div>';
$("#imagesContent").append(imageform);}
			);

		$(".newProduct").click(
				function(){var productform = '<div class="col-sm-6 productBox"><div class="block" ><button type="button" class="close deleteProduct" aria-hidden="true">&times;</button><br><form class="form-horizontal product-container" role="form""><div class="form-group"><label for="ptitle" class="col-sm-3 control-label">Product</label><div class="col-sm-9"><input type="text" class="form-control storeform" id="ptitle" placeholder="Product Name"></div><label for="psdescription" class="col-sm-3 control-label">Short Description</label><div class="col-sm-9"><textarea class="form-control storeform" rows="2" id="psdescription"  placeholder="Short Description"></textarea></div><label for="pldescription" class="col-sm-3 control-label">Long Description</label><div class="col-sm-9"><textarea class="form-control storeform" rows="2" id="pldescription"  placeholder="Long Description"></textarea></div><label for="pprice" class="col-sm-3 control-label">Price</label><div class="col-sm-9"><input type="number" class="form-control storeform" id="pprice" placeholder="Price"></div><label for="pimage" class="col-sm-3 control-label">Image</label><div class="col-sm-9"><select class="form-control storeform" id="pimage"><option>None</option><option>image1.jpg</option><option>image2.jpg</option><option>image3.jpg</option><option>image4.jpg</option><option>image5.jpg</option></select></div><label for="ptags" class="col-sm-3 control-label">Tags</label><div class="col-sm-9"><textarea class="form-control storeform" rows="2" id="ptags"  placeholder="Tags (comma separated)"></textarea></div></div></form></div></div>';
$("#productContent").append(productform);}
			);
		$(".toTop").click(
			function(){$("html,body").animate({scrollTop:0});});
		$(window).scroll(function(){
												var notTop = $(window).scrollTop();
												if (notTop) {$(".toTop").show()}
												else {$(".toTop").hide()}
									});


//adapted from http://stackoverflow.com/questions/3226167/how-to-style-input-file-with-css3-javascript as answered by user981027
//for slightly better file input
$("#browse").click(function () {
    $("#imfile").click();
})
$('#imfile').change(function () {
    $('#filename').val($(this).val());
})
//end cite

function parseForms() {
	var forms = $('.storeform-container');
	var formObject = {elements: [], products: [], settings: {}};
	var fields;
	$('.element-container').each(function (i) {
		formObject.elements[i] = {};
		$(this).find('.storeform').each(function () {
			if (this.type == 'checkbox') { //strange bug with checkboxes not properly storing their value.
				formObject.elements[i][this.id] = $(this).is(':checked');
			} else {
				formObject.elements[i][this.id] = this.value ? this.value : this.placeholder;
			}
		});
	});
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
	document.write("<pre>"+JSON.stringify(formObject, null, "\t"));
	document.close(); 
}

$('.storesubmit').click(parseForms);