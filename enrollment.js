var timer;
var exittimer;
var changeFocusToAnswer = true;
var validate = {
    AccountNumber: function (element) { validateAccountNumber(element) },
    SSN: function (element) { validateSSN(element) },
    CompanyTaxId: function (element) { validateTaxid(element) },
    DateOfBirth: function (element) { validateDob(element) },
    SecurityPin: function (element) { validateSecurityPin(element) },
    FirstName: function (element) { validateName(element) },
    LastName: function (element) { validateName(element) },
    CompanyName: function (element) { validateCompanyName(element) },
    UserId: function (element) { validateUserID(element) },
    Passcode: function (element) { validatePasscode(element) },
    ConfirmPasscode: function (element) { validateConfirmPasscode(element) },
    EmailAddress: function (element) { validateEmailAddress(element) },
    SecurityAnswer1: function (element) { validateSecurityAnswer(element) },
    SecurityAnswer2: function (element) { validateSecurityAnswer(element) },
    SecurityAnswer3: function (element) { validateSecurityAnswer(element) },
    SecurityQuestion1Key: function (element) { validateSecurityQuestion(element) },
    SecurityQuestion2Key: function (element) { validateSecurityQuestion(element) },
    SecurityQuestion3Key: function (element) { validateSecurityQuestion(element) },
    AccountTypesB: function (element) { validateAccountType(element) },
    AccountTypesR: function (element) { validateAccountType(element) },
    AccountNumberB: function (element) { validateAccountNumber(element) },
    AccountNumberR: function (element) { validateAccountNumber(element) },
    IsEsddOpted: function (element) { return true },
    DropDown: function (element) { validteDropdown(element) },
}

var binNumbers = ["4170", "4691", "4258", "5026", "5887", "5889", "4747"];

//Window Focus
window.addEventListener('focus', function () {
    s.events = "event170";
    s.linkTrackEvents = "event170";
    s.linkTrackVars = "events";
    s.tl(this, "o", "");
});

window.addEventListener('blur', function () {
    s.events = "event171";
    s.linkTrackEvents = "event171";
    s.linkTrackVars = "events";
    s.tl(this, "o", "");
});


window.addEventListener('touchstart', function () {
    //Analytics combo check for continue button 
    if (($('#accountEligible').is(':checked'))) {
        s.events = "event194";
        s.linkTrackEvents = "event194";
        s.eVar39 = "EligibleCheckbox";
        s.prop30 = "EligibleCheckbox";
        s.linkTrackVars = "prop30,eVar39,events";
        s.tl(this, "o", "");
    }
});
$(document).on("click", ".js-enrolleeType", function () {
    //Analytics combo check for continue button 
    if (($('#accountEligible').is(':checked'))) {
        s.events = "event194";
        s.linkTrackEvents = "event194";
        s.eVar39 = "EligibleCheckbox";
        s.prop30 = "EligibleCheckbox";
        s.linkTrackVars = "prop30,eVar39,events";
        s.tl(this, "o", "");
    }
});



$(document).on("click", ".js-submit", function () {
    if (($('#IsEsddOpted').is(':checked'))) {
        s.events = "event194";
        s.linkTrackEvents = "event194";
        s.eVar39 = "EligibleCheckbox";
        s.prop30 = "EligibleCheckbox";
        s.linkTrackVars = "prop30,eVar39,events";
        s.tl(this, "o", "");
    }
});

$(document).ready(function () {
    startSessionTimer(9);

    $(document).on("click", ".js-sessiontimer", function () {
        clearTimeout(timer);
        clearTimeout(exittimer);
        startSessionTimer($(this).attr("data-sessiontimer"));
    });

    $(document).on("click", ".js-AddAccountBtn", function () {
        clearPageLevelError();
        if ($(this).hasClass("js-saveEditAccntBtn")) {
            saveEditedAccount((/B$/.test($(this).attr("id")) ? "B" : "R"), $(this).attr("data-editaccountindexnum"));
        } else {
            addAdditionalAccount($(this).closest("[data-accountTypeforBtns]").attr("data-accountTypeforBtns"));
        }
    });

    $(document).on("change", ".js-AddAccountTypeList", function () {
        changeAccountType(this);
    });

    $(document).on("change", "select[name*='SecurityQuestion']", function (event) {
        var n = String($(this).attr("id")).replace(/[^0-9]/gi, "");
        if (changeFocusToAnswer) {
            $("input[name='SecurityAnswer" + n + "']").focus();
        }
        changeFocusToAnswer = true;
    });


    $(document).on("click", ".js-CancelAddAccountBtn", function () {
        var listType = $(this).closest("[data-accounttypeforbtns]");
        resetAddAccountForm(listType);
    });

    $(document).on("click", ".js-delAddedAccountBtn", function () {
        var listType = $(this).closest("[data-accounttype]").attr("data-accounttype");
        var indx = $(this).closest("[data-accounttype]").attr("data-addedaccountindx");
        $("#CurrentListType").val(listType);
        $("#CurrentAddedListIndex").val(indx);
        addedAccNumber = $(this).closest("[data-addedaccountindx]").find(".js-AddBoxAccountNumber").text();
        $(".js-accNumberEnding").html(addedAccNumber.substring(addedAccNumber.length - 4, addedAccNumber.length));
    });

    $(document).on("click", ".js-deletAddedAccountConfirmBtn", function () {
        deleteAddedAccount($("#CurrentAddedListIndex").val(), $("#CurrentListType").val());
    });

    $(document).on("click", ".js-editAddedAccountBtn", function () {
        var listType = $(this).closest(".addedAccountBox").attr("data-accountType");
        var indx = $(this).closest(".addedAccountBox").attr("data-AddedAccountIndx");
        var dropListndx = $(this).closest(".addedAccountBox").attr("data-DropListIndx");
        LoadEditFormAddedAccount(listType, indx, dropListndx);
        $("#addAccountFormBox" + listType).removeClass("hide");
    });


    //VERIFY ADD ACCOUNT SCREEN
    $(document).on("click", ".js-addAccountForm .js-submit", function () {
        $(".js-pgLevelMsgtext").html("");
        if (verifyAddAccountsForm()) {
            $("#loadingOverlay").show();
            submitForm($("form"));
        }
    });

    $(document).on("click", "[data-open='noSSNContent']", function () {
        $("#noSSNContent").toggleClass("hide");
    });

    //SETS THE ENROLLEE TYPE AND THEN SUBMITS THE FORM
    $(document).on("click", ".js-enrolleeType, .js-enrolleeTypeTab", function () {
        if ($(this).hasClass("js-paialternative")) {
            clearAllErrors();
        }

        $(this).setEnrolleeType();
    });

    //VERIFY THE ACCOUNT INFO SCREEN
    $(document).on("click", ".js-verifyAccountForm .js-submit", function () {
        $(".js-pgLevelMsgtext").html("");
        $(".js-pgLevelMsg").removeClass("callout");

        if (verifyEnrollmentTypeForm()) {
            $("#loadingOverlay").show();
            submitForm($("form"));
        }
    });

    //VERIFY THE AGREEMENT SCREEN BEFORE WE
    $(document).on("click", ".js-agreementsForm .js-submit", function () {
        $(".js-pgLevelMsgtext").html("");
        if (verifyAgreementsForm()) {
            $("#loadingOverlay").show();
            submitForm($("form"));
        }
    });


    //VERIFY CREDENTIALS SCREEN
    $(document).on("click", ".js-verifyCredentialsForm .js-submit", function () {
        $(".js-pgLevelMsgtext").html("");

        if (verifyCredentialsForm()) {
            $("#loadingOverlay").show();
            submitForm($("form"));
        }
    });


    //CLEAR ERROR FROM FIELD ON FOCUS
    $('.js-formnputItem').on("click", function (event) {
        clearErrorAttributes(this);
    });


    $('.js-formnputItem').on("keyup", function (event) {
        //HANLDES KEY DOWN EVENT FOR FIELDS THAT ACCEPTS ONLY NUMBERS
        if (/^numbers$/i.test($(this).attr("data-textBoxAccepts"))) {
            if (/^AccountNumber$/i.test($(this).attr("id")) && /card/gi.test($("#EnrollmentType").val())) {
                checkForCardEnrollment(this, event);
            } else
                if (/Date/i.test($(this).attr("id"))) {
                    formatNumberOnInput(this, "date", event);
                }
        }
    });


    $('.js-formnputItem').on("keydown", function (event) {

        if (/enter/gi.test(event.key) || event.which == 13) {
            return false;
        }

        //HANDLES THE KEYDOWN EVENT FOR CHOOSING TO AUTO FOCUS ON CORRESPONDING SECURITY ANSWER
        if (/^SecurityQuestion/.test($(this).attr("name")) && /select/i.test($(this)[0].tagName)) {
            if (/arrow/gi.test(event.key) || (event.which >= 37 && event.which <= 40)) {
                changeFocusToAnswer = false;
            } else {
                changeFocusToAnswer = true;
            }
        } else

            //HANLDES KEY DOWN EVENT FOR FIELDS THAT ACCEPTS ONLY LETTERS
            if (/^letters$/i.test($(this).attr("data-textBoxAccepts"))) {
                inputLettersOnly(this, event, getBoolfromString($(this).attr("data-allowPaste")), getBoolfromString($(this).attr("data-allowCopy")));
            } else

                //HANLDES KEY DOWN EVENT FOR FIELDS THAT ACCEPTS ONLY NUMBERS
                if (/^numbers$/i.test($(this).attr("data-textBoxAccepts"))) {
                    inputNumbersOnly(this, event, getBoolfromString($(this).attr("data-allowPaste")), getBoolfromString($(this).attr("data-allowCopy")));
                } else

                    //HANLDES KEY DOWN EVENT FOR FIELDS THAT ACCEPTS NUMBERS AND LETTERS
                    if (/^numbersletters$/i.test($(this).attr("data-textBoxAccepts"))) {
                        inputLettersNumbersOnly(this, event, getBoolfromString($(this).attr("data-allowPaste")), getBoolfromString($(this).attr("data-allowCopy")));
                    } else

                        //HANLDES KEY DOWN EVENT FOR FIELDS THAT ACCEPTS CUSTOM INPUTS
                        if (/^custom$/i.test($(this).attr("data-textBoxAccepts"))) {
                            inputAllowedKeysOnly(this, event, regexKeys[$(this).attr("data-regexname")], getBoolfromString($(this).attr("data-allowPaste")), getBoolfromString($(this).attr("data-allowCopy")));
                        } else

                            //HANLDES KEY DOWN EVENT FOR FIELDS THAT ACCEPTS EMAILS
                            if (/^email$/i.test($(this).attr("data-textBoxAccepts"))) {
                                inputEmailOnly(this, event, getBoolfromString($(this).attr("data-allowPaste")), getBoolfromString($(this).attr("data-allowCopy")));
                            }

    });
    /*$('#DateOfBirth').on('textInput', event => {
        //HANLDES KEY DOWN EVENT FOR FIELDS THAT ACCEPTS ONLY NUMBERS ON ANDROID
         formatNumberOnInput(this, "date", event);
    });*/

    //SHOW HIDE FOR PROTECTED FIELDS
    $(document).on("click", ".js-showHide", function () {
        var fldTarget = $("#" + $(this).attr("data-btnfor"));
        var fldOGType = $(fldTarget).attr("data-inputType");
        var fldCurrentType = $(fldTarget).attr("type");
        if (fldCurrentType != "password") {
            //HIDE
            setinputToProtected(fldTarget);
        } else {
            //SHOW
            setinputToOpen(fldTarget, true);
        }
    });


    //BLUR THE SHOW HIDE BUTTON
    $(document).on("blur", ".js-showHide", function () {
        var targetEle = $("#" + $(this).attr("[data-btnfor]"));
        var targetEleFormat = $("[data-parentfor='" + $(this).attr("[data-btnfor]") + "']").attr("data-formattype");
        var targetEleVal = $(targetEle).val();
    });


    //ON BLUR OF HIDDEN TYPE IT SHOULD REVERT TO MASKED
    $(document).on("blur", ".js-canShowHide", function () {
        setinputToProtected(this);
    });

    $(document).on("focus", ".js-canShowHide", function () {
        setinputToOpen(this);
    });

    $("#UserId").blur(function(e) {
        validateUserID(e.target);
    });

    $("#Passcode").blur(function(e) {
        validatePasscode(e.target);
    });

    $("#ConfirmPasscode").blur(function(e) {
        validateConfirmPasscode(e.target);
    });

    //CHECKS TO SEE IF THE FORM NAME IS VERIFY ACCOUNT IF SO IT SETS THE FIELDS THAT SHOULD SHOW OR HIDE
    if ($(".js-verifyAccountForm")) {
        setEnrollmentTypeView($("#EnrollmentType").val());
    }

    $("[data-textBoxAccepts='numbers']").on("blur", function (event) {
        var eleInputFormat = $("[data-parentfor='" + $(this).attr("id") + "']").attr("data-formattype");
        if (/Date/i.test($(this).attr("id"))) {
            nwVal = getFormattedNumber(this, eleInputFormat);
            $(this).val(nwVal);
        }
    });

    if (/true/i.test($("#SetFieldsToProtected").val())) {
        protectForm();
    }

    checkForFldMsg();
});

$.fn.setEnrolleeType = function () {
    $("#EnrolleeType").val($(this).attr("data-value"));
    $("#EnrollmentType").val($(this).attr("data-defaultaccounttype"));

    if ($(this).attr("data-url")) {
        $(this).submitToUrl();
    }

    if (verifyEnrolleeTypeForm()) {
        $(".js-pgLevelMsgtext").html("");
        $("#loadingOverlay").show();
        submitForm($("form"));
    }
};

$('#pai-modal').on("closed.zf.reveal", function () {
    $(this).find("input[type='checkbox']").prop("checked", false);
    clearErrorAttributes(this);
});

$('#addacntdel-modal').on("closed.zf.reveal", function () {
    $(this).find("input[type='checkbox']").prop("checked", false);
    clearErrorAttributes(this);
});


$(".js-addAccountFormBox").on('on.zf.toggler', function () {
    if (/addAccountFormBoxR/.test($(this).attr("id"))) {
        resetAddAccountForm("R");
    } else {
        resetAddAccountForm("B");
    }
    $(this).find(".js-formFieldParent").addClass("hide");
});

$(".js-addAccountFormBox").on('off.zf.toggler', function () {
    $(this).find(".js-formFieldParent").removeClass("hide");
});

function CheckStartingBinNumber(x) {
    var numToCompare = String(x).replace(/^0+/, "").match(/^.{4}/)[0];
    if (binNumbers.indexOf(numToCompare) != -1) {
        return true;
    } else {
        return false;
    }
}

function dynamicClick(href) {
    var aTag = document.createElement('a');
    aTag.setAttribute('href', href);
    aTag.innerHTML = "";
    aTag.click();
}

function startSessionTimer(mins) {
    timer = setTimeout(
        function () {
            $("#minwarning-modal").foundation('open');
            exittimer = setTimeout(function () { window.location = "/Home/SessionTimeOut" }, (60000 * Number(1)));
        }, (60000 * Number(mins)));

}

function saveEditedAccount(listType, indx) {
    var item = buildAddAccountItem(listType);

    validateAccountNumber($("#AccountNumber" + listType));
    validateDropDown($("#AccountTypes" + listType));

    if (hasNoErrors($("#addAccountFormBox" + listType))) {
        if (listType == "R") {
            additionalAccountsR[indx] = item;
            buildAddBoxUifromAdditional("R");
            resetAddAccountForm("R");
        } else {
            additionalAccountsB[indx] = item;
            buildAddBoxUifromAdditional("B");
            resetAddAccountForm("B");
        }
    }
}

function buildAddAccountItem(listType) {
    var item = { AccountKey: { AccountNumber: "", ProductCode: "" }, SubProductCode: "", AccountDisplayName: "", DropListIndx: "" };
    item.AccountKey.AccountNumber = $("#AccountNumber" + listType).val();
    item.AccountDisplayName = $("#AccountTypes" + listType + " option:selected").text();
    item.AccountKey.ProductCode = $("#AccountTypes" + listType + " option:selected").val().split(":")[1]
    item.SubProductCode = $("#AccountTypes" + listType + " option:selected").val().split(":")[2]
    item.DropListIndx = $("#AccountTypes" + listType).prop("selectedIndex");
    return item;
}

function addAdditionalAccount(listType) {
    var item = buildAddAccountItem(listType);

    validateAccountNumber($("#AccountNumber" + listType));
    validateDropDown($("#AccountTypes" + listType));

    if (listType == "R" && hasNoErrors($("#addAccountFormBoxR"))) {
        additionalAccountsR.push(item);
        buildAddBoxUifromAdditional("R");
        resetAddAccountForm("R");
    } else if (listType == "B" && hasNoErrors($("#addAccountFormBoxB"))) {
        additionalAccountsB.push(item);
        buildAddBoxUifromAdditional("B");
        resetAddAccountForm("B");
    }

}

function deleteAddedAccount(indx, listType) {

    if (listType == "R") {
        additionalAccountsR.splice(indx, 1);
    } else {
        additionalAccountsB.splice(indx, 1);
    }


    buildAddBoxUifromAdditional(listType);
    resetAddAccountForm(listType);

}

function clearAccountsHtml(listType) {
    $(".js-addedBox" + listType).each(function () {
        $(this).find(".js-AddBoxAccountName").html("");
        $(this).find(".js-AddBoxAccountNumber").html("");
    });
}

function resetAddAccountForm(listType) {
    $("#AccountTypes" + listType).prop("selectedIndex", 0);
    $("#AccountNumber" + listType).val("");
    $("#AccountNumber" + listType).val("");
    $("#addAccountFormBox" + listType + "  .is-masked").removeClass("is-masked");
    $("#AddAccountBtn" + listType).text("Add Account");
    $("#AddAccountBtn" + listType).removeClass("js-saveEditAccntBtn");
    $("#AddAccountBtn" + listType).closest(".js-addAccountFormBox").removeClass("inEdiMode");
    clearErrorAttributes($("#addAccountFormBox" + listType));
    $(".js-showHide[data-btnfor='AccountNumber" + listType + "']").text('Hide');

    $("#AddAccountBtn" + listType).attr("data-editaccountindexnum", "");
    $("#AddAccountBtn" + listType).removeAttr("data-editaccountindexnum");

    $("label[for='AccountNumber" + listType + "']").text("Account Number");
    $("#addAccountFormBox" + listType).addClass("hide");

    if ($(".js-addedBox" + listType + ":not(.hide)").length < 10) { //can add more
        $("#addAccountFormBox" + listType + " + .js-addAccountToggle").removeClass("hide");
    } else {
        $("#addAccountFormBox" + listType + " + .js-addAccountToggle").addClass("hide");
    }

}

function buildAddBoxUifromAdditional(listType) {
    if (listType == "R") {
        additionalList = additionalAccountsR;
    } else {
        additionalList = additionalAccountsB;
    }

    $(".js-addedBox" + listType).each(function (i) {
        if (additionalList[i] != undefined && additionalList[i].AccountName) {
            additionalList[i].AccountDisplayName = additionalList[i].AccountName
        }

        if (additionalList[i] != undefined && fixforNullorUndefined(additionalList[i].AccountKey.AccountNumber) != "") {
            $(this).find(".js-AddBoxAccountName").html(additionalList[i].AccountDisplayName);
            $(this).find(".js-AddBoxAccountNumber").html(additionalList[i].AccountKey.AccountNumber);
            if (additionalList[i].AccountKey.AccountNumber.length > 4)
                $(this).find(".js-AddBoxAccountNumber").html(MaskAllButLastN(additionalList[i].AccountKey.AccountNumber));
            else {
                $(this).find(".js-AddBoxAccountNumber").html(additionalList[i].AccountKey.AccountNumber);
            }
            $(this).attr("data-DropListIndx", additionalList[i].DropListIndx);
            $(this).removeClass("hide");
        } else {
            $(this).find(".js-AddBoxAccountName").html("");
            $(this).find(".js-AddBoxAccountNumber").html("");
            $(this).attr("data-DropListIndx", "");
            $(this).addClass("hide");
        }

    });

    AddMoreConditions(listType);
}

function LoadEditFormAddedAccount(listType, indx, dropListndx) {
    if (listType == "R") {
        additionalList = additionalAccountsR;
        // resetAddAccountForm("B");
    } else {
        additionalList = additionalAccountsB;
        // resetAddAccountForm("R");
    }
    clearErrorAttributes($("#addAccountFormBox" + listType));
    $("#AddAccountBtn" + listType).closest(".js-addAccountFormBox").addClass("inEdiMode");
    $("#AddAccountBtn" + listType).text("Save Changes");
    $("#AddAccountBtn" + listType).addClass("js-saveEditAccntBtn");
    $("#AccountTypes" + listType).prop("selectedIndex", dropListndx);
    $("#AccountNumber" + listType).val(additionalList[indx].AccountKey.AccountNumber);
    $(".js-showHide[data-btnfor='AccountNumber" + listType + "']").text('Show');
    $("#AccountTypes" + listType).focus();

    changeAccountType($("#AccountTypes" + listType));

    //SEE IT ALL
    $("#addAccountFormBox" + listType).removeClass("hide");
    $("#addAccountFormBox" + listType + " + .js-addAccountToggle").addClass("hide");
    $("#addAccountFormBox" + listType + " .js-formFieldParent").removeClass("hide");
    $("#AddAccountBtn" + listType).attr("data-editaccountindexnum", indx);
    $("#AccountTypes" + listType).focus()
}

function verifySaveAdditionalAccounts() {
    $("#loadingOverlay").show();
    var enrollment = {};
    enrollment.EnrollmentInfo = {};
    enrollment.EnrollmentInfo.EnrolleeToken = $("#EnrolleeToken").val();
    enrollment.AdditionalBusinessAccountList = additionalAccountsB;
    enrollment.AdditionalPersonalAccountList = additionalAccountsR;

    $.ajax({
        url: "/Enrollment/AddAccounts",
        type: "POST",
        cache: false,
        data: enrollment,
        dataType: "Json",
        complete: function (result) {
            $("form").submit();
        },
        fail: function (result) {
            $("#loadingOverlay").hide();
            showPageLevelError(errorMsg["AddAccountFail"]);
        }
    });
}

function valideUniqueAnswers() {
    var ans1 = String($("#SecurityAnswer1").val()).toLowerCase();
    var ans2 = String($("#SecurityAnswer2").val()).toLowerCase();
    var ans3 = String($("#SecurityAnswer3").val()).toLowerCase();

    if ((ans1 == ans2) && (ans1 != "" && ans2 != "")) {
        addErrorAttributes($("#SecurityAnswer1"), "UniqueAnswers");
        addErrorAttributes($("#SecurityAnswer2"), "UniqueAnswers");
    }

    if ((ans1 == ans3) && (ans1 != "" && ans3 != "")) {
        addErrorAttributes($("#SecurityAnswer1"), "UniqueAnswers");
        addErrorAttributes($("#SecurityAnswer3"), "UniqueAnswers");
    }

    if ((ans3 == ans2) && (ans3 != "" && ans2 != "")) {
        addErrorAttributes($("#SecurityAnswer2"), "UniqueAnswers");
        addErrorAttributes($("#SecurityAnswer3"), "UniqueAnswers");
    }

    if ((ans1 == ans2 && ans2 == ans3) && (ans1 != "" && ans2 != "" && ans3 != "")) {
        addErrorAttributes($("#SecurityAnswer1"), "UniqueAnswers");
        addErrorAttributes($("#SecurityAnswer2"), "UniqueAnswers");
        addErrorAttributes($("#SecurityAnswer3"), "UniqueAnswers");
    }
}

function setEnrollmentTypeView(enrollmentType) {
    $("[data-showfor]").addClass("hide");

    if (enrollmentType == "" && /credentials/i.test(window.location.href)) {
        enrollmentType = "RetailAccount";
    }
    $("[data-showfor*='" + enrollmentType + "'], .js-formFieldParent:not([data-showfor])").removeClass("hide");

    /* FINANCIAL CRIMES FIELD LEVEL TRACKING
    evar = 121;
    $("[data-fcid]:visible").each(function() {
        $(this).attr("data-fcid", evar++);
    });
    */
}



//SUPORTED TYPE VALS ARE 'DebitCard'(DEFAULT) and 'CreditCard'
function setCardTypeInputFields(type) {
    if (type == "CreditCard") {  //CHECK IF CURRENT PIN IS NOT DEBIT
        $("#SecurityPin").attr("maxlength", 3);
        $("#SecurityPin").attr("placeholder", "000");
        $("#SecurityPin").val("");
        $("label[for='SecurityPin']").text("3-Digit Security Code (CVV)");
    } else {
        $("#SecurityPin").val("");
        $("#SecurityPin").attr("maxlength", 4);
        $("#SecurityPin").attr("placeholder", "0000");
        $("label[for='SecurityPin']").text("4-Digit PIN");
    }
}

function checkForCardEnrollment(element) {
    var val = $(element).val();
    var numOnlyVal = val.replace(/[^0-9]/gi, "");
    var prefix = /r/i.test($("#EnrolleeType").val()) ? "Retail" : "Business";
    var binNumber = numOnlyVal.substring(0, 4);
    var isCreditPinFromInput = $("#SecurityPin").attr("maxlength") == 3 ? true : false;
    var isCreditCardType = rgxisCreditCard.test(binNumber);
    var allowCard = true;

    //ADDED TO BLOCK SUB FIELDS FOR RCC AND BCC IF RETAIL IS SELECTED
    if ((/retailcard/ig.test($("#EnrollmentType").val())) && (/^4691|^4170/.test(val))) {
        allowCard = false;
    }

    if ((numOnlyVal.length > 3) && allowCard) {
        if (rgxisCard.test(binNumber)) { //CHECK IF BIN IS A VALID CARD
            if (isCreditCardType) { //CHECK IF BIN IS A CREDIT CARD
                $("#EnrollmentType").val(prefix + "CreditCard");
                if (!isCreditPinFromInput) {  //CHECK IF CURRENT PIN IS NOT CREDIT
                    setCardTypeInputFields("CreditCard")
                }
            } else {
                $("#EnrollmentType").val(prefix + "DebitCard");
                if (isCreditPinFromInput) {  //CHECK IF CURRENT PIN IS NOT DEBIT
                    setCardTypeInputFields("DebitCard")
                }
            }
        } else {
            $("#EnrollmentType").val(prefix + "Card");
            resetCardForm();
        }
    } else {
        resetCardForm();
    }

    setEnrollmentTypeView($("#EnrollmentType").val());
}


function resetCardForm() {
    $("#EnrollmentType").val((/r/i.test($("#EnrolleeType").val()) ? "Retail" : "Business") + "Card");
    clearAllErrors();
    clearForm($("form.js-verifyAccountForm"));
    $("#DateOfBirth").val("");
    $("#CurrentAddedListIndex").val("");
    $("#CurrentListType").val("");
    $("#CurrentDropListIndx").val("");
    $("#SSN").val("");
    $(".is-masked").removeClass("is-masked");
}

function isCardEnrollment() {
    return /card/gi.test(String($("#EnrollmentType").val()));
}

function setinputToProtected(element) {
    var eleId = $(element).attr("id");
    var eleParent = $(element).closest(".js-maskFldParent");
    var showHideBtn = $(".js-showHide[data-btnfor='" + eleId + "']");
    var eleVal = $(element).val();
    var eleInputFormat = $("[data-parentfor='" + eleId + "']").attr("data-formattype");

    if (!isBlank($(element).val())) {
        $(element).attr("type", "password");
        $(showHideBtn).text("Show");

        if (/.+/i.test(fixforNullorUndefined(getFormattedNumber(element, eleInputFormat)))) {
            if (isCardEnrollment()) {
                $(eleParent).attr("data-maskoverlay", String(getFormattedNumber(element, eleInputFormat)).replace(/[^0-9]/gi, " ").replace(/[0-9]/gi, "\u2022"));
                $(eleParent).addClass("is-masked");
            } else if (/ssn|companytaxid/i.test($(element).attr("name"))) {
                $(eleParent).attr("data-maskoverlay", String(getFormattedNumber(element, eleInputFormat)).replace(/[^0-9]/gi, "-").replace(/[0-9]/gi, "\u2022"));
                $(eleParent).addClass("is-masked");
            }
        }
    }
}

function protectForm() {
    $("input.js-canShowHide").each(function () {
        setinputToProtected(this);
    });
}

function setinputToOpen(element) {
    var eleId = $(element).attr("id");
    var eleParent = $(element).closest(".js-maskFldParent");
    var showHideBtn = $(".js-showHide[data-btnfor='" + eleId + "']");
    var eleVal = $(element).val();
    var eleInputFormat = $("[data-parentfor='" + eleId + "']").attr("data-formattype");

    $(element).attr("type", $(element).attr("data-inputtype"));
    $(showHideBtn).text("Hide");
    $(eleParent).removeClass("is-masked");
}

/*VALIDATE THE FIELDS*/

function validateDropDown(element) {
    clearErrorAttributes($(element));


    if ($(element).prop("selectedIndex") == 0) {
        addErrorAttributes($(element), "FieldBlank", getLabelText(element));
        return false;
    }
}

function validateAccountNumber(element) {
    clearErrorAttributes($(element));
    var isCard = /card/i.test($(element).closest(".js-formFieldParent").attr("data-formattype"));
    val = String($(element).val());
    valNumsOnly = val.replace(/[^0-9]/gi, "");

    if (isBlank(val)) {
        addErrorAttributes($(element), "FieldBlank", getLabelText(element));
        return false;
    }

    if (/[0-9]/.test($(element).attr("maxlength"))) {
        if (isOverMaxLength(val, Number($(element).attr("maxlength")))) {
            addErrorAttributes($(element), "MaxChars", getLabelText(element), Number($(element).attr("maxlength")));
            return false;
        }
    }

    if (hasLetters(val)) {
        addErrorAttributes($(element), "NoLetters", getLabelText(element));
        return false;
    }

    //RETAIL CARD ACCOUNT CHECK TO BLOCK CARDS IF ACOCUNT TAB IS SELECTED
    // And AddAccount should skip this check. 
    if (/account/gi.test($("#EnrollmentType").val()) && !(/AccountSelection/gi.test($("#TagPageName").val()))) {
        if (/^4170|^4691|^4258|^5026|^5887|^5889|^4747/.test(val)) {
            showPageLevelError(errorMsg["CardsNotAllowed"]);
            return false;
        }
    }

    //RETAIL CARD ACCOUNT CHECK TO BLOCK CARDS IF CARD TAB IS SELECTED
    if (/retailcard/gi.test($("#EnrollmentType").val())) {
        if (/^4170/.test(val)) {
            showPageLevelError(errorMsg["NotEligible"]);
            return false;
        }
    }

    if (isCard) {

        if (hasSpaces(val)) {
            addErrorAttributes($(element), "NoSpaces", getLabelText(element));
            return false;
        }

        //VALIDATIONS NEEDED FOR CREDIT CARDS        
        if (hasBadChars(val, rgNotNumsSpaceOnly)) {
            addErrorAttributes($(element), "NoSpecialChars", getLabelText(element));
            return false;
        }

        if (isFormatBad(val, rgxisCard) || isFormatBad(val, rgxCardFormat)) {
            addErrorAttributes($(element), "NotValid", "M&T Bank " + getLabelText(element));
            return false;
        }


    } else {

        if (hasSpaces(val)) {
            addErrorAttributes($(element), "NoSpaces", getLabelText(element));
            return false;
        }

        if (hasBadChars(val, rgNotNumsOnly)) {
            addErrorAttributes($(element), "NoSpecialChars", getLabelText(element));
            return false;
        }

        if (/^0+/.test(valNumsOnly)) {//check to see if account number starts with 0

            if (CheckStartingBinNumber(valNumsOnly)) {
                //error
                showPageLevelError(errorMsg["StartsWithZeroPageLevelMsg"]);
                return false;
            }      
        }
    }


    if (valNumsOnly.length != val.length) {
        addErrorAttributes($(element), "NoSpecialChars", getLabelText(element));
        return false;
    }

}

function validateSSN(element) {
    clearErrorAttributes($(element));
    var val = String($(element).val());
    var valNumOnly = String($(element).val()).replace(/[^0-9]/gi, "");

    if (isBlank(val)) {
        addErrorAttributes($(element), "FieldBlank", getLabelText(element));
        return false;
    }

    if (/[0-9]/.test($(element).attr("maxlength"))) {
        if (isOverMaxLength(val, Number($(element).attr("maxlength")))) {
            addErrorAttributes($(element), "MaxChars", getLabelText(element), Number($(element).attr("maxlength")));
            return false;
        }
    }

    if (hasSpaces(val)) {
        addErrorAttributes($(element), "NoSpaces", getLabelText(element));
        return false;
    }

    if (hasLetters(val)) {
        addErrorAttributes($(element), "NoLetters", getLabelText(element));
        return false;
    }

    if (hasBadChars(val, rgNotNumsDashOnly)) {
        addErrorAttributes($(element), "NoSpecialChars", getLabelText(element));
        return false;
    }

    if ($(element).hasClass("js-ssn4")) {
        if (isFormatBad(val, /^[0-9]{4}$/)) {
            addErrorAttributes($(element), "BadFormat", "SSN", $(element).attr("placeholder"));
            return false;
        }

        if (!hasMinchars(val, 4)) {
            addErrorAttributes($(element), "MinChars", getLabelText(element), 4);
            return false;
        }
    } else {
        if (isFormatBad(val, rgxSSNFormat)) {
            addErrorAttributes($(element), "BadFormat", getLabelText(element), $(element).attr("placeholder"));
            return false;
        }

        if (!hasMinchars(val, 9)) {
            addErrorAttributes($(element), "MinChars", getLabelText(element), 9);
            return false;
        }
    }


}

function validateDob(element) {
    clearErrorAttributes($(element));
    var val = String($(element).val());

    if (isBlank(val)) {
        addErrorAttributes($(element), "FieldBlank", getLabelText(element));
        return false;
    }

    if (hasSpaces(val)) {
        addErrorAttributes($(element), "NoSpaces", getLabelText(element));
        return false;
    }

    if (hasLetters(val)) {
        addErrorAttributes($(element), "NoLetters", getLabelText(element));
        return false;
    }

    if (hasBadChars(val, rgNotNumsSlashOnly)) {
        addErrorAttributes($(element), "NoSpecialChars", getLabelText(element));
        return false;
    }

    if (isFormatBad(val, rgxCheckDateMMDDYYY)) {
        addErrorAttributes($(element), "BadFormat", getLabelText(element), $(element).attr("placeholder"));
        return false;
    }


    if (isFormatBad(val, rgxDob)) {
        addErrorAttributes($(element), "NotValid", getLabelText(element));
        return false;
    }

    if (new Date(val) == "Invalid Date") {
        addErrorAttributes($(element), "NotValid", getLabelText(element));
        return false;
    }

    if (new Date(val).getFullYear() <= 1900) {
        addErrorAttributes($(element), "NotValid", getLabelText(element));
        return false;
    }


    //makes sure a bad date string is not converted to a vailid date by comparing the mm/dd/yyy to the calc date vs the entered date to match
    var d = new Date(val);
    if (Number(d.getMonth() + 1) == Number(val.split("/")[0]) && (Number(d.getDate()) == Number(val.split("/")[1])) && Number(d.getFullYear()) == Number(val.split("/")[2])) {

    } else {
        addErrorAttributes($(element), "NotValid", getLabelText(element));
        return false;
    }

    if (!isOldEnough(val, 13)) {
        showPageLevelError(errorMsg["NotEligible"]);
        return false;
    }
}

function validateTaxid(element) {
    clearErrorAttributes($(element));
    var val = String($(element).val());

    if (isBlank(val)) {
        addErrorAttributes($(element), "FieldBlank", getLabelText(element));
        return false;
    }

    if (/[0-9]/.test($(element).attr("maxlength"))) {
        if (isOverMaxLength(val, Number($(element).attr("maxlength")))) {
            addErrorAttributes($(element), "MaxChars", getLabelText(element), Number($(element).attr("maxlength")));
            return false;
        }
    }

    if (hasSpaces(val)) {
        addErrorAttributes($(element), "NoSpaces", getLabelText(element));
        return false;
    }

    if (hasLetters(val)) {
        addErrorAttributes($(element), "NoLetters", getLabelText(element));
        return false;
    }

    if (hasBadChars(val, rgNotNumsDashOnly)) {
        addErrorAttributes($(element), "NoSpecialChars", getLabelText(element));
        return false;
    }

    if (isFormatBad(val, rgxTaxIdFormat)) {
        addErrorAttributes($(element), "BadFormat", getLabelText(element), $(element).attr("placeholder"));
        return false;
    }
}

function validateSecurityPin(element) {
    clearErrorAttributes($(element));
    var val = String($(element).val());
    var enrollmentType = /debit/i.test($("#EnrollmentType").val()) ? "debit" : "credit";

    if (isBlank(val)) {
        addErrorAttributes($(element), "FieldBlank", getLabelText(element));
        return false;
    }

    if (hasSpaces(val)) {
        addErrorAttributes($(element), "NoSpaces", getLabelText(element));
        return false;
    }

    if (hasLetters(val)) {
        addErrorAttributes($(element), "NoLetters", getLabelText(element));
        return false;
    }

    if (hasBadChars(val, rgNotNumsOnly)) {
        addErrorAttributes($(element), "NoSpecialChars", getLabelText(element));
        return false;
    }

    if (enrollmentType == "credit") {
        //VALIDATIONS NEEDED FOR CREDIT CARDS        
        if (isFormatBad(val, rgxCvv)) {
            addErrorAttributes($(element), "SecurityPinFormat", getLabelText(element), $(element).attr("maxlength"));
            return false;
        }
    } else if (enrollmentType == "debit") {
        if (isFormatBad(val, rgxPin)) {
            addErrorAttributes($(element), "SecurityPinFormat", getLabelText(element), $(element).attr("maxlength"));
            return false;
        }
    }
}

function validateName(element) {
    clearErrorAttributes($(element));
    var trimmedVal = getTrimmedString($(element).val());
    $(element).val(trimmedVal);

    var accepts = $(element).attr("data-textboxaccepts") != undefined ? $(element).attr("data-textboxaccepts") : "";

    var val = String($(element).val());
    if (isBlank(val)) {
        addErrorAttributes($(element), "FieldBlank", getLabelText(element));
        return false;
    }

    if (/^letters$/i.test(accepts)) {
        if (hasNumbers(val)) {
            addErrorAttributes($(element), "NoNumbers", getLabelText(element));
            return false;
        }
    }

    if (hasBadChars(val, /[^0-9a-z ]/gi)) {
        addErrorAttributes($(element), "NoSpecialChars", getLabelText(element));
        return false;
    }

}

function validateCompanyName(element) {
    clearErrorAttributes($(element));
    var trimmedVal = getTrimmedString($(element).val());
    $(element).val(trimmedVal);

    var val = String($(element).val());
    if (isBlank(val)) {
        addErrorAttributes($(element), "FieldBlank", getLabelText(element));
        return false;
    }

    if (hasBadChars(val, rgxCompanyName)) {
        addErrorAttributes($(element), "CompanyNameNoSpecialChars");
        return false;
    }
}

function validateUserID(element) {
    var val = String($(element).val());
    clearErrorAttributes($(element));
    if (isBlank(val)) {
        addErrorAttributes($(element), "FieldBlank", getLabelText(element));
        return false;
    }

    if (hasSpaces(val)) {
        addErrorAttributes($(element), "NoSpaces", getLabelText(element));
        return false;
    }

    if (!hasMinchars(val, 5)) {
        addErrorAttributes($(element), "MinChars", getLabelText(element), 5);
        return false;
    }

    if (hasBadChars(val, rgWTSSOStart)) {
        addErrorAttributes($(element), "WTSSOStart");
        return false;
    }

    if (hasBadChars(val, /[^0-9a-z]/gi)) {
        addErrorAttributes($(element), "NoSpecialChars", getLabelText(element));
        return false;
    }

}


function validateConfirmPasscode(element) {
    var val = String($(element).val());
    clearErrorAttributes($(element));
    if (isBlank(val)) {
        addErrorAttributes($(element), "FieldBlank", getLabelText(element));
        return false;
    }
}

function validatePasscode(element) {
    var val = String($(element).val());
    clearErrorAttributes($(element));


    if (isBlank(val)) {
        addErrorAttributes($(element), "FieldBlank", getLabelText(element));
        return false;
    }

    if (hasSpaces(val)) {
        addErrorAttributes($(element), "NoSpaces", getLabelText(element));
        return false;
    }

    if (!hasMinchars(val, 8)) {
        addErrorAttributes($(element), "MinChars", getLabelText(element), 8);
        return false;
    }


    if (val.match(/[a-z]/ig) == undefined) {
        addErrorAttributes($(element), "PasscodeULCase");
        return false;
    }

    if (!hasUpperCase(val)) {
        addErrorAttributes($(element), "PasscodeUCase");
        return false;
    }

    if (!hasLowerCase(val)) {
        addErrorAttributes($(element), "PasscodeLCase");
        return false;
    }



    if (String($("#UserId").val()).toLowerCase() == String($("#Passcode").val()).toLowerCase()) {
        addErrorAttributes($(element), "PasscodeSameId");
        return false;
    }

    if (hasBadChars(val, /[\&\#\*]/)) {
        addErrorAttributes($(element), "PasscodeNoSpecialChars");
        return false;
    }

    if (hasRepeatingChars(val, 3)) {
        addErrorAttributes($(element), "RepeatingChars", getLabelText(element), 3);
        return false;
    }

    if ($("#ConfirmPasscode").val() != "" && $("#Passcode").val() != "") {
        if ($("#ConfirmPasscode").val() != $("#Passcode").val()) {
            addErrorAttributes($(element), "PasscodeMisMatch");
            return false;
        }
    }

}


function validateEmailAddress(element) {
    var val = String($(element).val());
    clearErrorAttributes($(element));
    if (isBlank(val)) {
        addErrorAttributes($(element), "FieldBlank", getLabelText(element));
        return false;
    }

    if (hasSpaces(val)) {
        addErrorAttributes($(element), "NoSpaces", getLabelText(element));
        return false;
    }

    if (hasBadChars(val, rgEmailBlockifNot)) {
        addErrorAttributes($(element), "NoSpecialChars", getLabelText(element));
        return false;
    }

    if (isFormatBad(val, rgxEmail)) {
        addErrorAttributes($(element), "EmailFormat");
        return false;
    }

    if (/\.\./.test(val)) {
        addErrorAttributes($(element), "EmailFormat");
        return false;
    }
}

function validateSecurityAnswer(element) {
    var trimmedVal = getTrimmedString($(element).val());
    $(element).val(trimmedVal);
    var val = String($(element).val());

    clearErrorAttributes($(element));
    if (isBlank(val)) {
        addErrorAttributes($(element), "SecurtyAnswerBlank", String($(element).attr("id")).replace(/[^0-9]/gi, ""));
        return false;
    }

    if (hasBadChars(val, /[^0-9a-z ]/gi)) {
        addErrorAttributes($(element), "NoSpecialChars", getLabelText(element));
        return false;
    }

    if (!hasMinchars(val, 4)) {
        addErrorAttributes($(element), "MinCharsAnswers", "Answer", 4);
        return false;
    }

    if (isOverMaxLength(val, 12)) {
        addErrorAttributes($(element), "MaxChars", "Answer", 12);
        return false;
    }

    if (!hasLettersorNumbers(val)) {
        addErrorAttributes($(element), "SecurityAnswerFormat", getLabelText(element));
        return false;
    }

    valideUniqueAnswers();
}

function validateSecurityQuestion(element) {
    var val = String($(element).val());
    clearErrorAttributes($(element));
    if (isBlank(val)) {
        addErrorAttributes($(element), "FieldBlank", getLabelText(element));
    }
}

function validateAccountType(element) {
    var val = String($(element).val());
    if (isBlank(val)) {
        addErrorAttributes($(element), "FieldBlank", getLabelText(element));
    }
}

function validateAddedAccounts() {
    if (additionalAccountsB.length == 0) {
        showPageLevelError(errorMsg["NeedsAddedAccounts"]);
    }
}


/*VERIFY THE FORMS*/
function verifyEnrolleeTypeForm() {

    if (/pai/i.test($("#EnrolleeType").val())) {
        if (!isCheckboxChecked($("#accountEligible"))) {
            addErrorAttributes($("#accountEligible"), "PAIConfirmEligble")
            return false;
        }
    }

    return hasNoErrors();//verified;
}

function verifyEnrollmentTypeForm() {
    validateAllFields();
    return hasNoErrors();//verified;
}

function verifyAgreementsForm() {

    if (!isCheckboxChecked($("#EsignAccepted"))) {
        addErrorAttributes($("#EsignAccepted"), "AgreemntNotAccepted", "ESign Agreement")

    }

    if (!isCheckboxChecked($("#DSAAccepted"))) {
        addErrorAttributes($("#DSAAccepted"), "AgreemntNotAccepted", "Digital Services Agreement")
    }

    return hasNoErrors();//verified;
}

function verifyCredentialsForm() {
    validateAllFields();
    return hasNoErrors();//verified;
}

function verifyAddAccountsForm() {

    $(".js-addAccountFormBox:not('.hide')").each(function () {
        selList = $(this).find("select[id^='AccountTypes']");
        selListParent = $(this).find("select[id^='AccountTypes']").closest(".js-formFieldParent");

        numFld = $(this).find("input[id^='AccountNumber']");
        numFldParent = $(this).find("input[id^='AccountNumber']").closest(".js-formFieldParent");

        if ($(selList).prop("selectedIndex") > 0 || !isBlank($(numFld).val())) {
            $(selListParent).each(function () {
                fldId = $(this).attr("data-parentfor");
                fldElement = $("#" + fldId);
                validate[fldId](fldElement);
            });

            $(numFldParent).each(function () {
                fldId = $(this).attr("data-parentfor");
                fldElement = $("#" + fldId);
                validate[fldId](fldElement);
            });
        }

    });

    if (/account/i.test($("#EnrollmentType").val())) {
        validateAddedAccounts();
    }

    if (hasNoErrors()) {
        verifySaveAdditionalAccounts();
    } else {
        return false;
    }
}

function AddMoreConditions(listType) {
    if ($(".js-addedBox" + listType + ":not(.hide)").length < 10) { //can add more
        $("#addAccountFormBox" + listType).removeClass("hide");
        $("#addAccountFormBox" + listType + " + .js-addAccountToggle").removeClass("hide");
        $("#addAccountFormBox" + listType + " .js-formFieldParent").removeClass("hide");
    } else {
        $("#addAccountFormBox" + listType).addClass("hide");
        $("#addAccountFormBox" + listType + " + .js-addAccountToggle").addClass("hide");
        $("#addAccountFormBox" + listType + " .js-formFieldParent").addClass("hide");
    }
}

function changeAccountType(element) {
    var listType = /accounttypesb/gi.test($(element).attr("id")) ? "B" : "R";
    var isCard = /card/i.test($(element).find("option:selected").text());

    accountNumLabel = isCard ? $("label[for='AccountNumber" + listType + "']").text("Card Number") : $("label[for='AccountNumber" + listType + "']").text("Account Number");
}

function checkForFldMsg() {
    if ($("[data-msglevel='Field']").length > 0) {
        addErrorAttributes($("#" + $("[data-msgtarget]").attr("data-msgtarget")), $(".js-pgLevelMsg").attr("data-msg-code"));
        $(".js-pgLevelMsg").addClass("hide");
        $(".is-mtb-form-error:eq(0)").find("input").focus();
    }
}