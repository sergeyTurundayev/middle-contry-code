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
  thisForm.find(".country-flag span").each(function () {
    $(this).removeClass().toggleClass(countryCode);
  });

  thisForm.find(".country-code .dial-code span").each(function () {
    $(this).text(countryCallingCode);
  });

  thisForm.on("click", function () {
    if (!thisForm.hasClass("open")) {
      $(".country-code-form.open").removeClass("open");
    }
    thisForm.toggleClass("open");
  });

  let countriesList = thisForm.find("ul");

  for (var i = 0; i < allCountries.length; i++) {
    let name = allCountries[i][0];

    if (name.indexOf("(") > 0) {
      name = name.split("(")[0];
    }

    let dialCode = allCountries[i][2];
    let iso2 = allCountries[i][1];

    let resultStr = '<li class="countries-item">';
    resultStr += '<div class="country-flag-item">';
    resultStr += '<span class="' + iso2 + '"></span></div>';

    resultStr += '<span class="code" data-code="' + dialCode + '">';
    resultStr += name + " +" + dialCode + "</span></li>";

    countriesList.append(resultStr);
  }

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
    });
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