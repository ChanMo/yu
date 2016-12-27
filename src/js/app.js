/**
 * toggle box
 */
function toggle_box(current){
  var ele = $(current).data("box-toggle");
  if(ele){
    $(ele).toggleClass("box-show");
    $("body").toggleClass("unscroll");
  }
  return false;
}

/** window scroll **/
function window_scroll(){
  d_top = $(document).scrollTop();
  d_height = $(document).height();
  while(d_top + 80 >= d_height - w_height){
    window.removeEventListener('scroll', window_scroll, false);
    load_more(false);
    break;
  }
}

/**
 * fixed topbar
 * if scrolltop > half of window height, set topbar fixed
 */
function fixed_topbar(){
  d_top = $(document).scrollTop();
  if(d_top*2 > w_height){
    $(".home__nav").addClass("fixed");
  }else{
    $(".home__nav").removeClass("fixed");
  }
}


/** thumbs up **/
function thumbs_up(ele){
  var count = parseInt($(ele).find("span").html()); // current count
  if($(ele).find("i").hasClass("fa-thumbs-up")){
    /** if up **/
    $(ele).find("i").removeClass("fa-thumbs-up");
    $(ele).find("i").addClass("fa-thumbs-o-up");
    count--;
  }else{
    /** if no up **/
    $(ele).find("i").removeClass("fa-thumbs-o-up");
    $(ele).find("i").addClass("fa-thumbs-up");
    count++;
  }
  $(ele).find("span").html(count);
  return false;
}

/**
  * load more
  * elements: .home__item, .home__container
  */
function load_more(is_init){
  var container = $(".home__container");
  var offset;
  var url = 'card_list.html';
  var loading = "<div class='home__loading'><i class='fa fa-spinner fa-pulse'></i></div>";

  if(is_init) {
    /** if is reload, empty container first **/
    container.html('');
    offset = 0;
  }else{
    offset = $(".home__item").length; // where to start
  }

  $.ajax({
    url: url + '?offset=' + offset,
    type: 'GET',
    beforeSend: function(){
      container.append(loading);
    },
    success: function(data){
      $(".home__loading").remove();
      $(".home__container").append(data);

      /** not need to start scrolling as soon **/
      window.setTimeout(function(){
        window.addEventListener('scroll', window_scroll, false);
      }, 2000);
    },
    complete: function(){
    }
  });
}

/** handle image upload **/
function handle_files(files, ele){
  for (var i=0; i<files.length; i++){
    var file = files[i];
    var imageType = /image.*/;
    if(!file.type.match(imageType)){
      continue;
    }

    images.push(file); // push to images;

    var img = $("<li><img><i onclick='remove_image(this)' class='fa fa-remove'></i></li>");
    ele.prepend(img);

    var reader = new FileReader();
    reader.onload = (function(aImg){
      return function(e){
        aImg.find("img").attr('src', e.target.result);
      };
    })(img);
    reader.readAsDataURL(file);
  }
}

function remove_image(ele){
  var index = $(ele).parent("li").index();
  $(ele).parent("li").remove();
  images.splice(images.length - index - 1, 1);
}

function upload_image(e){
  $("#photo").click();
}

function check_form(){
  if(document.getElementById("photo").value == ''){
    alert('请选择一张图片');
    return false;
  }else{
    $('#submit').attr('disabled','disabled');
  }
}
