$( document ).ready($(".toTop").hide());

// using http://learn.jquery.com/events/event-delegation/ for first script
$(document).on('click','.deleteImage', function(){if(confirm("Delete image?")){$(this).closest('.imageBox').remove();}}
			);

			$(document).on('click','.deleteProduct', function(){if(confirm("Delete product?")){$(this).closest('.productBox').remove();}}
			);
			$(document).on('click','.deleteTextblock', function(){if(confirm("Delete textBlock?")){$(this).closest('.textblockBox').remove();}}
			);
			$(document).on('click','.deleteImageblock', function(){if(confirm("Delete imageBlock?")){$(this).closest('.imageblockBox').remove();}}
			);

			$("ul.newElement > li#TextBlock").click(
				function(){var textblockform = '<div class="col-sm-6 textblockBox"><div style="background-color:#aaaaaa;padding:10px;margin:5px">Textblock<button type="button" class="close deleteTextblock" aria-hidden="true">&times;</button><form class="form-horizontal" role="form""> <div class="form-group"><label for="ttitle" class="col-sm-2 control-label">Title</label><div class="col-sm-10"><input type="text" class="form-control" id="ttitle" placeholder="Title"></div><label for="tdescription" class="col-sm-2 control-label">Description</label><div class="col-sm-10"><textarea class="form-control" rows="2" columns="3" id="tdescription" placeholder="Description"></textarea></div></div></form></div></div>';

$("#elementContent").append(textblockform)});

$("ul.newElement > li#ImageBlock").click(
				function(){var imageblockform = '<div class="col-sm-6 imageblockBox"><div style="background-color:#aaaaaa;padding:10px;margin:5px">Imageblock<button type="button" class="close deleteImageblock" aria-hidden="true">&times;</button><form class="form-horizontal" role="form"><div class="form-group"><label for="ititle" class="col-sm-2 control-label">Title</label><div class="col-sm-10"><input type="text" class="form-control" id="ititle" placeholder="Title"></div><label for="idescription" class="col-sm-2 control-label">Description</label><div class="col-sm-10"><textarea class="form-control" rows="2" id="idescription" placeholder="Description"></textarea></div><label for="iimage" class="col-sm-2 control-label">Image</label><div class="col-sm-10"><select class="form-control" id="iimage"><option>None</option><option>image1.jpg</option><option>image2.jpg</option><option>image3.jpg</option><option>image4.jpg</option><option>image5.jpg</option></select></div></div></form></div></div>';

$("#elementContent").append(imageblockform)});

			$(".newImage").click(
				function(){var imageform = '<div class="col-sm-6 imageBox"><div style="background-color:#aaaaaa;padding:10px;margin:10px 5px" ><button type="button" class="close deleteImage" aria-hidden="true">&times;</button><br><form class="form-horizontal" role="form"><div class="form-group"><label for="imname" class="col-sm-3 control-label">Name</label><div class="col-sm-9"><input type="name" class="form-control" id="imname" placeholder="Product Name"></div><label for="imdescription" class="col-sm-3 control-label">Description</label><div class="col-sm-9"><textarea class="form-control" rows="2" id="imdescription" placeholder="Description" style="resize:none"></textarea></div><div><center><button type="submit" class="btn btn-default">Save</button></center></div></div></form></div></div>';
$("#imagesContent").append(imageform);}
			);

		$(".newProduct").click(
				function(){var productform = '<div class="col-sm-6 productBox"><div style="background-color:#aaaaaa;padding:10px;margin:5px" ><button type="button" class="close deleteProduct" aria-hidden="true">&times;</button><br><form class="form-horizontal" role="form""><div class="form-group"><label for="ptitle" class="col-sm-3 control-label">Product</label><div class="col-sm-9"><input type="text" class="form-control" id="ptitle" placeholder="Product Name"></div><label for="pdescription" class="col-sm-3 control-label">Description</label><div class="col-sm-9"><textarea class="form-control" rows="2" id="pdescription"placeholder="Description"></textarea></div><label for="pprice" class="col-sm-3 control-label">Price</label><div class="col-sm-9"><input type="number" class="form-control" id="pprice" placeholder="Price"></div><label for="pimage" class="col-sm-3 control-label">Image</label><div class="col-sm-9"><select class="form-control"><option>None</option><option>image1.jpg</option><option>image2.jpg</option><option>image3.jpg</option><option>image4.jpg</option><option>image5.jpg</option></select></div><div><center><button type="submit" class="btn btn-default">Save</button></center></div></div></form></div></div>';
$("#productContent").append(productform);}
			);
		$(".toTop").click(
			function(){$("html,body").animate({scrollTop:0});});
		$(window).scroll(function(){
												var notTop = $(window).scrollTop();
												if (notTop) {$(".toTop").show()}
												else {$(".toTop").hide()}
									});
