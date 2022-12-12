$(document).ready(function () {

  createSimpleCountryCode();

  simpleDropDown();

});

// simpleDropDown
function simpleDropDown() {
  $(".middle-contry-code-dropdown-block").each(function () {
    $(this).on("wheel", function (event) {
      event.stopPropagation();
      event.preventDefault();

      let tmpTop =
        event.originalEvent.wheelDelta +
        parseInt($(this).find(".middle-contry-code-dropdown-list").css("top"));

      let listHeight =
        -1 * $(this).find(".middle-contry-code-dropdown-list").height() + 198;

      if (tmpTop > 11 || tmpTop < listHeight - 11) {
        return;
      }

      $(this)
        .find(".middle-contry-code-dropdown-list")
        .css("top", tmpTop + "px");

      $(this)
        .find(".middle-contry-code-dropdown-line")
        .css("top", (tmpTop * -1) / 55 + "px");
    });

    // mobile

    let tmpTop, touchStart, touchEnd, touchResult;

    $(this).on("touchstart", function (event) {
      listHeight = -1 * $(this).find(".middle-contry-code-dropdown-list").height() + 198;

      touchStart = 1 * event.originalEvent.touches[0].clientY;
    });

    $(this).on("touchmove", function (event) {
      event.stopPropagation();
      event.preventDefault();
      touchEnd = 1 * event.originalEvent.touches[0].clientY;

      tmpTop =
        -1 * (touchStart - touchEnd) +
        parseInt($(this).find(".middle-contry-code-dropdown-list").css("top"));

      if (tmpTop > 11 || tmpTop < listHeight - 11) {
        return;
      }

      $(this)
        .find(".middle-contry-code-dropdown-list")
        .css("top", tmpTop + "px");

      $(this)
        .find(".middle-contry-code-dropdown-line")
        .css("top", (tmpTop * -1) / 55 + "px");
    });
  });
}

// setCountryCode
function setCountryCode(thisForm, countryCode, countryCallingCode) {
  
  thisForm.find(".country-flag span").removeClass().toggleClass(countryCode);

  thisForm.find(".country-code .dial-code span").text(countryCallingCode);

  thisForm.find('.country-code').on("click", function () {
    if (!thisForm.hasClass("open")) {
      $(".country-code-form.open").removeClass("open");
    }
    thisForm.toggleClass("open");
  });

  let countriesList = thisForm.find("ul");

  for (let countryCodeObjKey in allCoundtiesObj) {
    let name = allCoundtiesObj[countryCodeObjKey]['name'];

    if (name.indexOf("(") > 0) {
      name = name.split("(")[0];
    }

    let phone_code = allCoundtiesObj[countryCodeObjKey]['phone_code'];
    let country_code = allCoundtiesObj[countryCodeObjKey]['country_code'];
    let phone_mask = allCoundtiesObj[countryCodeObjKey]['phone_mask'];


    let resultStr = '<li class="countries-item">';
    resultStr += '<div class="country-flag-item">';
    resultStr += '<span class="' + country_code + '"></span></div>';

    resultStr += '<span class="code" ';
    resultStr += 'data-code="' + phone_code + '" ';
    resultStr += 'data-mask="' + phone_mask + '">';
    resultStr += name + " +" + phone_code + "</span></li>";

    countriesList.append(resultStr);
  }

  let placeholder = thisForm.find('.country-flag-item span.' + countryCode).parent().next().data('mask');
  let dataCode = thisForm.find('.country-flag-item span.' + countryCode).parent().next().data('code');

  placeholder = placeholder.split(dataCode)[1];

  if(placeholder[0] == '-'){
    placeholder = placeholder.replace(/^-/,'');
  }

  thisForm.find('input[name="phone"]').attr('placeholder', placeholder);

  thisForm.find(".countries-item").each(function () {
    $(this).on("click", function () {
      let dataFlag = $(this).find(".country-flag-item span").attr("class");
      let code = $(this).find(".code").data("code");

      thisForm.find(".country-flag span").each(function () {
        $(this).removeClass().toggleClass(dataFlag);
      });
      thisForm.find(".country-code .dial-code span").each(function () {
        $(this).text("+" + code);
      });

      let placeholder = $(this).find(".code").data("mask");

      placeholder = placeholder.split(code)[1];

      if(placeholder[0] == '-'){
        placeholder = placeholder.replace(/^-/,'');
      }

      console.log(placeholder);

      thisForm.find("input[name='phone']").val('').attr('placeholder', placeholder);

    });
  });

  thisForm.find('input[name="phone"]').on('focus', function(event){

    let mask = $(this).attr('placeholder');

    if(mask[0] == '(' && $(this).val().length == 0){
      $(this).val('(');
    }
  });


  thisForm.find('input[name="phone"]').on('input', function(event){

    event.preventDefault();

    let originalEvent = event.originalEvent.data;

    if(event.keyCode == 8){ // backspace
      $(this).val(thisVal.slice(0,maskLength));
      return;
    }

    let mask = $(this).attr('placeholder');
    let maskLength = mask.length;

    let thisVal = $(this).val();

    let valLength = thisVal.length;

    if(mask[0] == '(' && valLength == 0){
      $(this).val('(');
    }

    if(maskLength < valLength){
      $(this).val(thisVal.slice(0,maskLength));
      return;
    }

    if(isNaN(1*originalEvent)){
      $(this).val(thisVal.slice(0,valLength - 1));
      // return;
    }

    if(mask[valLength] == ')' && originalEvent){
      $(this).val($(this).val() + ')');
    }

    if(mask[valLength] == '-' && originalEvent){
      $(this).val($(this).val() + '-');
    }

    if(mask[valLength + 1] == ' ' && originalEvent){
      $(this).val($(this).val() + ' ');
    }

  });
}

// createSimpleCountryCode
function createSimpleCountryCode() {
  let countryCode = "us";
  let countryCallingCode = "+1";

  $(".country-code-form").each(function () {
    let thisForm = $(this);

    $.get("https://ipapi.co/json/", function () {}, "json").always(function (
      resp
    ) {
      countryCode = resp && resp.country ? resp.country : "us";
      countryCallingCode =
        resp && resp.country_calling_code ? resp.country_calling_code : "+1";

      setCountryCode(thisForm, countryCode.toLowerCase(), countryCallingCode);
    });
  });
}