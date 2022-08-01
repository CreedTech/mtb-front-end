//Foundation.Reveal.defaults.closeOnClick = false;
$(document).foundation();

var regexKeys = {
    companyNameAllow: "[^\\%\\}\\]\\\"\\<\\>\\~]",
    passocdeAllow: /[^\#\&\* ]/gi
}

rgxCompanyName = /[\%\}\]\"\<\>\~]/;
rgxCardFormat = /^[0-9]{16}$/;
rgxSSNFormat = /^[0-9]{9}$/;
rgxTaxIdFormat = /^[0-9]{9}$/;
rgxDobFormat = /^[0-9]{2}\/[0-9]{2}\/[0-9]{4}$/;
rgxDob = /^[0-1][0-9]\/[0-3][0-9]\/[1-2][0-9]{3}$/;
rgxName = /^[0-9a-z\.\- ]+$/i;
rgxNumbersOnly = /^[0-9]+$/;
rgxEmail = /^[a-z0-9\.\-\_]+\@[a-z0-9\.*]+\.[a-z]{2,4}$/i;
rgxisCard = /^4691|^4258|^5026|^5887|^5889|^4747/;
rgxisDebitCard = /^4258|^5026|^5887|^5889|^4747/; //4747
rgxisCreditCard = /^4691/;
rgxPin = /^[0-9]{4}$/;
rgxCvv = /^[0-9]{3}$/;

rgNotNumsLettersOnly = /[^0-9a-z]/gi;
rgNotNumsOnly = /[^0-9]/gi;
rgNotNumsSpaceOnly = /[^0-9 ]/gi;
rgNotNumsDashOnly = /[^0-9\-]/gi;
rgNotNumsSlashOnly = /[^0-9\/]/gi;
rgWTSSOStart = /^wtsso/i;
rgEmailAllow = /[a-z0-9\@\.\-\_]/i;
rgEmailBlockifNot = /[^a-z0-9\+\@\.\-\_]/i;
rgxAlphaNumsOnly = /[^0-9a-z\.\- ]/i;
rgxCheckDateMMDDYYY = /[0-9]{2}\/[0-9]{2}\/[0-9]{4}/;
rgxNotAlphaNumericOrSpace = /[^0-9a-z ]/gi;


$(document).ready(function () {
    createEnsightenPageName();

    $(document).on("click", ".js-closewindow", function () {
        windowClose(window.self);
    });

    //Mobile - Back to CSS Home Menu
    $(".js-close-button-mobile").on("click", function () {
        var aTag = document.createElement('a');
        aTag.setAttribute('href', "nativeapp://close");
        aTag.innerHTML = "Close Window";
        aTag.click();
    });

});

$.fn.submitToUrl = function () {
    url = $(this).attr("data-url");
    $("form").attr("action", url);
    $("form").submit();    
};

function createEnsightenPageName() {
    window["EnsightenPageName"] = $("title").text() + ": " + $("#EnrollmentType").val();
}

function getLabelText(element) {
    return String($("label[for='" + $(element).attr("id") + "']").text()).replace(/ \(.+?\)/, "");
}

function getBoolfromString(str) {
    return /true/i.test(str);
}

function windowClose(win) {
    win.close();
}