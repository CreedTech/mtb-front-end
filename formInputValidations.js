var watcher;
$(document).ready(function () {

});

function fixforNullorUndefined(stringVal) {
    return (stringVal == null || stringVal == undefined) ? "" : stringVal;
}

function isBlank(stringVal) {
    var stringVal = fixforNullorUndefined(stringVal);
    return stringVal.length == 0 ? true : false;
}

function hasMinchars(stringVal, minNumofChars) {
    var stringVal = fixforNullorUndefined(stringVal);
    return (String(stringVal).length >= minNumofChars) ? true : false;
}

function hasSpecialChars(stringVal, regxcharAllowed) {
    var rg = new RegExp(String("[^a-z0-9" + nonAlphaNumCharAllowed + "]+"), "gi");
    return rg.test(o);
}

function hasSpaces(stringVal) {
    return /\s/g.test(stringVal);
}

function hasLetters(stringVal) {
    return /[a-z]/ig.test(stringVal);
}

function hasNumbers(stringVal) {
    return /[0-9]/ig.test(stringVal);
}

function hasLettersorNumbers(stringval) {
    return /[a-z0-9]+/i.test(stringval);
}
function hasBadChars(stringVal,rg) {
    return rg.test(stringVal);
}

function hasLowerCase(stringVal) {
    return /[a-z]/.test(stringVal);
}

function hasUpperCase(stringVal) {
    return /[A-Z]/.test(stringVal);
}

function compareMatch(stringVal1, stringVal2) {
    return (stringVal1 == stringVal2) ? true : false;
}

function hasRepeatingChars(stringVal, maxNumRepeatable) {
    var rg = new RegExp(String("(.)\\1{" + (maxNumRepeatable) + ",}"));
    return rg.test(stringVal);
}

function isFormatBad(stringVal, regexToFormatAgainst) {
    if (stringVal.length > 0) {
        return regexToFormatAgainst.test(stringVal) ? false : true;
    }
}

function isNumPressed(event) {
    return /number/i.test(getEventKeyCodeType(event)) || /[0-9]/i.test(event.key);
}

function isNumLetterPressed(event) {
    return /number/i.test(getEventKeyCodeType(event)) || /letter/i.test(getEventKeyCodeType(event)) || /[0-9a-z ]/i.test(event.key);
}

function isLetterPressed(event) {
    return /letter/i.test(getEventKeyCodeType(event)) || /[a-z ]/i.test(event.key);
}

function isAllowedPressed(event,rgx) {
    return rgx.test(event.key);
}

function isNumbersOnly(stringVal, nonAlphaNumCharAllowed) {
    var rg = new RegExp("[^0-9" + nonAlphaNumCharAllowed + "]");
    return rg.test(stringVal) ? false : true;
}

function isOldEnough(dateString, n) {
    var dob = new Date(dateString);
    var now = new Date();
    var ageInYears = (now.getFullYear() - dob.getFullYear());
    var dobMo = Number(dob.getMonth());
    var dobDate = Number(dob.getDate());

    if (n < ageInYears) {
        return true;
    } else {
        if (n == ageInYears) {
            if((dobMo < now.getMonth()) ||(dobMo == now.getMonth() && dobDate <= now.getDate())){
                return true;
            }
        } else {
            return false;
        }
    }    
}

function isCheckboxChecked(element) {
    return $(element).prop("checked");
}

function isBadDate(dateString) {
    var baddate = false;
    if (new Date(dateString) > new Date()) {
        baddate = true;
    }

    if (/[0-9]{4}$/.test(dateString) && Number(dateString.match(/[0-9]{4}$/)[0]) < 1900) {
        baddate = true;
    }

    if (dateString.length == 10 && (Number(dateString.substr(0, 2)) > 0 && Number(dateString.substr(0, 2)) <= 12)) {

    } else {
        baddate = true;
    }

    if (dateString.length == 10 && (Number(dateString.substr(3, 2)) > 0 && Number(dateString.substr(3, 2)) <= 31)) {

    } else {
        baddate = true;
    }

    return baddate;
}

function isOverMaxLength(stringVal, n) {
    if (n != undefined) {
        return String(stringVal).length > Number(n);
    } else {
        return false;
    }
}

function clearErrorAttributes(element) {
    var parentElement = ($(element).closest("[data-parentFor]").length != 0 ? $(element).closest("[data-parentFor]") : $(element));
    $(parentElement).find(".is-mtb-form-error").length != 0 ? $(parentElement).find(".is-mtb-form-error").removeClass("is-mtb-form-error") :  $(parentElement).removeClass("is-mtb-form-error");
    $(parentElement).find(".form-error").empty();
}

function clearPageLevelError() {
    $(".js-pgLevelMsgtext").html("");
}

function clearForm(parentElement) {
    $(parentElement).find(".js-formnputItem[type='checkbox']").not(".js-keeponclear").prop("checked", false);
    $(parentElement).find(".js-formnputItem[type='radio']").not(".js-keeponclear").prop("checked", false);
    $(parentElement).find(".js-formnputItem[type='textbox']").not(".js-keeponclear").val("");
    $(parentElement).find(".js-formnputItem[type='password']").not(".js-keeponclear").val("");
    $(parentElement).find(".js-formnputItem[type='tel']").not(".js-keeponclear").val("");
    $(parentElement).find("select.js-formnputItem").not(".js-keeponclear").prop("selectedIndex", 0);
}

function addErrorAttributes(element, errorID, varA, varB) {
    elementID = $(element).attr("id");    
    $(element).attr("aria-describedby", elementID + "Error");
    $(element).attr("aria-errormessage", elementID + "Error");
    $(element).attr("aria-invalid", "true");
    $("[data-parentFor='" + elementID + "']").addClass("is-mtb-form-error");
    $("#" + elementID + "Error").html((varA != undefined || varB != undefined) ? errorMsg[errorID](varA, varB) : errorMsg[errorID]);
}

function inputNumbersOnly(element, event, pasteOk, copyOk) {    
    if ((isPaste(event) && !pasteOk) || (isCopy(event) && !copyOk)) {
        event.preventDefault();
        return false;
    } else {
        if (isNumPressed(event) || isPaste(event) == pasteOk || isCopy(event) == copyOk || isNonOutputKey(event)) {
            return true;
        } else {            
            event.preventDefault();
            return false;
        }
    }
}

function inputEmailOnly(element, event, pasteOk, copyOk) {
    if ((isPaste(event) && !pasteOk) || (isCopy(event) && !copyOk)) {
        event.preventDefault();
        return false;
    } else {
        if (rgEmailAllow.test(event.key) || isPaste(event) == pasteOk || isCopy(event) == copyOk || isNonOutputKey(event)) {
            return true;
        } else {
            event.preventDefault();
            return false;
        }
    }
}

function inputLettersOnly(element, event, pasteOk, copyOk) {
    if ((isPaste(event) && !pasteOk) || (isCopy(event) && !copyOk)) {
        event.preventDefault();
        return false;
    } else {
        if (isLetterPressed(event) || isNonOutputKey(event)) {
            return true;
        } else {
            event.preventDefault();
            return false;
        }
    }
}

function inputLettersNumbersOnly(element, event, pasteOk, copyOk) {
    if ((isPaste(event) && !pasteOk) || (isCopy(event) && !copyOk)) {        
        event.preventDefault();
        return false;
    } else {
        if (/[0-9a-z ]/gi.test(event.key) || isNonOutputKey(event)) {
            return true;
        } else {
            event.preventDefault();
            return false;
        }
    }
}

function inputAllowedKeysOnly(element, event, rgAllowed, pasteOk, copyOk) {
    if ((isPaste(event) && !pasteOk) || (isCopy(event) && !copyOk)) {
        event.preventDefault();
        return false;
    } else {       
        if (new RegExp(rgAllowed).test(event.key) || isNonOutputKey(event)) {
            return true;
        } else {            
            event.preventDefault();
            return false;
        }
    }
}

function isCopy(event) {
    return ((/^c$/i.test(event.key) && event.ctrlKey) || (/^x$/i.test(event.key) && event.ctrlKey));
}

function isPaste(event) {    
    return ( /^v$/i.test(event.key) && event.ctrlKey);
}

function hasNoErrors(parentEle) {
    if (parentEle != undefined) {
        return ($(parentEle).find(".form-error:not(:empty)").length > 0) ? false : true;
    } else {
        return ($(".form-error:not(:empty)").length > 0 || ($(".js-pgLevelMsgtext:not(:empty)").length > 0)) ? false : true;
    }
}

function submitForm(formElement) {
    if (formElement == undefined) {
        formElement = $("form");
    }

    if (hasNoErrors()) {
        $(formElement).submit();
    } else {
        event.preventDefault();
        $("#loadingOverlay").hide();
    }
}

function validateAllFields() {
    $(".js-formFieldParent:not('.hide')").each(function () {
        fldId = $(this).attr("data-parentfor");
        fldElement = $("#" + fldId);
        validate[fldId](fldElement);
    });

    $(".is-mtb-form-error:eq(0)").find("input").focus();
}


function formatNumberOnInput(element, format,event) {
    var val = $(element).val();
    var targetEleFormat = format == undefined ? ($("[data-parentfor='" + $(element).attr("id") + "']").attr("data-formattype")) : format;
    var ogCursor = $(element)[0].selectionStart;
    
    if (textBoxAllowTypeTest($(element), "numbers")) {
        if (isCharRemovalKey(event) || (/number/i.test(getEventKeyCodeType(event)))) {
            var ogCursor = $(element)[0].selectionStart;
            nwVal = getFormattedNumber(element, targetEleFormat);
            $(element).val(nwVal);
            if(isNonOutputKey(event)){
                $(element)[0].setSelectionRange(ogCursor, ogCursor);
            }
        }
    }
    return val;
}

function textBoxAllowTypeTest(element,testforType) {
    var rgx = new RegExp("^" + testforType + "$", "i");
    return rgx.test($(element).attr("data-textboxaccepts"));
}

function getFormattedNumber(element, format) {
    if (textBoxAllowTypeTest($(element), "numbers")) {
        if (/ssn/i.test(format)) {            
            return formatSSNInput(element);
        } else if (/taxid/i.test(format)) {            
            return formatTaxIdInput(element);
        } else if (/card/i.test(format)) {
            return formatCardInput(element);
        } else if (/date/i.test(format)) {
            return formatDateInput(element);
        } else {
            return $(element).val();
        }
    }
}

function formatSSNInput(element) {        
    var val = $(element).val();
    var numsOnly = String($(element).val()).replace(/[^0-9]/gi, "");
    
    if ((numsOnly.length == 9)) {
        formatedVal = numsOnly.substr(0, 3) + "-" + numsOnly.substr(3, 2) + "-" + numsOnly.substr(5, 4);
        return formatedVal;
    } else {
        formatedVal = numsOnly.replace(/\-/g, "");
        return formatedVal;
    }
}

function formatTaxIdInput(element) {
    var val = $(element).val();
    var numsOnly = String($(element).val()).replace(/[^0-9]/gi, "");
    
    if ((numsOnly.length == 9)) {
        formatedVal = numsOnly.substr(0, 2) + "-" + numsOnly.substr(2, 7);
        return formatedVal;
    } else {
        formatedVal = numsOnly.replace(/\-/g, "");
        return formatedVal;
    }
    
}

function formatDateInput(element) {
    var val = $(element).val();
    var numsOnly = String($(element).val()).replace(/[^0-9]/gi, "");
    
    if ((numsOnly.length == 2)) {
        formatedVal = numsOnly.substr(0, 2) + "/";
        return formatedVal;
    } else if ((numsOnly.length == 4)) {
        formatedVal = numsOnly.substr(0, 2) + "/" + numsOnly.substr(2, 2) + "/";
        return formatedVal;
    } else if ((numsOnly.length == 8)) {
        formatedVal = numsOnly.substr(0, 2) + "/" + numsOnly.substr(2, 2) + "/" + numsOnly.substr(4, 4);
        return formatedVal;
    } else if ((numsOnly.length < 2)) {
        formatedVal = numsOnly.replace(/\//g, "");
        return formatedVal;
    } else {
        return val;
    }
}

function formatCardInput(element) {
    var val = $(element).val();
    var numsOnly = String($(element).val()).replace(/[^0-9]/gi, "");

    if ((numsOnly.length == 16)) {
        formatedVal = numsOnly.substr(0, 4) + " " + numsOnly.substr(4, 4) + " " + numsOnly.substr(8, 4) + " " + numsOnly.substr(12, 4);
        return formatedVal;
    } else {
        formatedVal = numsOnly.replace(/ /g, "");
        return formatedVal;
    } 
}

function clearAllErrors(){
    $(".js-formnputItem").each(function(){
        clearErrorAttributes(this);
    });
}

function getTrimmedString(strval) {
    return strval.replace(/(^\s+|\s+$)/g, "");
}

function showPageLevelError(msg) {
    if (msg != undefined) {
        $(".js-pgLevelMsgtext").html(msg);
        $(".js-pgLevelMsg").addClass("callout");
    }
    $(".js-pgLevelMsg").removeClass("hide");
    $(".js-pgLevelMsg").focus();
}

function MaskAllButLastN(val, n, maskchar) {
    var n = (n == undefined ? 4 : n);
    var maskchar = (maskchar == undefined ? "\u2022" : maskchar);
    if (n < val.length) {    
        return val.substring(0,val.length - n).replace(/./g,maskchar) + val.substring(val.length - n, val.length);
    } else {
        return val.substring(0, val.length - n).replace(/./g, maskchar);
    }
}

function getEventKeyCodeType(event) {
    try{
      kc = event.originalEvent.data.charCodeAt(0)
    } catch(e) {
        kc = event.which;
    }
    
    if ((kc >= 65 && kc <= 90) && (event.shiftKey == false)) {
        return "letter";
    } else if ((kc >= 48 && kc <= 57) && (event.shiftKey == false)) {
        return "number";
    } else if ((kc >= 96 && kc <= 105) && (event.shiftKey == false)) {
        return "number";
    } else {
        return "";
    }
}

function isNonOutputKey(event) {
    try {
        kc = event.originalEvent.data.charCodeAt(0)
    } catch (e) {
        kc = event.which;
    }

    return ((kc < 48 && kc != 32)  || (kc >90 && kc < 96) || (kc >111 && kc < 186));
}

function isCursorMovementKey(event) {
    try {
        kc = event.originalEvent.data.charCodeAt(0)
    } catch (e) {
        kc = event.which;
    }

    return (kc >= 35 && kc <= 40);
}

function isCharRemovalKey(event) {
    try {
        kc = event.originalEvent.data.charCodeAt(0)
    } catch (e) {
        kc = event.which;
    }

    return (kc == 8 || kc == 46);
}