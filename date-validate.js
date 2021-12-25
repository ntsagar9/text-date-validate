
(function () {
    const DATE_ERROR_MESSAGE = "INVALID INPUT - TYPE AGAIN";
    const DATE_SEPARATOR = "-";
    const SHORT_MONTHS = ["jan", "feb", "mar", "apr", "may", "jun", "jul", "aug", "sep", "oct", "nov", "dec"];
    const FULL_MONTHS = ["january", "february", "march", "april", "may", "june", "july", "august", "september", "october", "november", "december"];
    const monthWithout31Date = [4, 6, 9, 11];

    // Get number of month by month name
    function getMonthNumberFromMonthName(text = "") {
        const smallText = text.toLowerCase();
        const shortMonthIndex = SHORT_MONTHS.indexOf(smallText) + 1;
        const fullMonthIndex = FULL_MONTHS.indexOf(smallText) + 1;
        const monthNumber = shortMonthIndex || fullMonthIndex;
        if (monthNumber) {
            return monthNumber <= 9 ? `0${monthNumber}` : `${monthNumber}`;
        }

        return text;
    }

    // Get date object
    function getDateTodayObj() {
        const todayDate = new Date();
        return {
            day: todayDate.getDate(),
            month: todayDate.getMonth() + 1,
            year: todayDate.getFullYear(),
        }
    }
    const TODAY_DATE_OBJ = getDateTodayObj();

    // Remove non digit characters
    function removeNonDigit(text = "") {
        // return text.replace(/\D/g, DATE_SEPARATOR);
        return text.replace(/\D/g, "");
    }

    function replaceNonDigitToCharactor(text = "") {
        return text.replace(/\D/g, DATE_SEPARATOR);
    }

    // remove before after sign on text
    function trimSign(text = "") {
        const startCharRegx = new RegExp(`^${DATE_SEPARATOR}`);
        const endCharRegx = new RegExp(`${DATE_SEPARATOR}$`);
        text = text.replace(startCharRegx, "");

        return text.replace(endCharRegx, "");
    }

    // Remove all saparator
    function removeAllSaparator(text) {
        const removeSaparatorRegEx = new RegExp(DATE_SEPARATOR, "g");
        return text.replace(removeSaparatorRegEx, "");
    }

    // Add zero on odd length
    // if length 3, 5, 7
    function addZeroForSingleDigit(text = "") {
        onlyNum = removeNonDigit(text);
        if (!onlyNum) {
            return text;
        }

        const fourDigitFigure = text.split(DATE_SEPARATOR);
        let monthFigure = Number(fourDigitFigure[0]) || '';
        let dayFigure = Number(fourDigitFigure[1]) || '';
        let yearFigure = Number(fourDigitFigure[2]) || '';
        let updateText = "";
        if (monthFigure) {
            updateText = `${monthFigure <= 9 ? '0' : ''}${monthFigure}`;
        }
        if (dayFigure) {
            updateText += `${DATE_SEPARATOR}${dayFigure <= 9 ? '0' : ''}${dayFigure}`;
        }
        if (yearFigure) {
            updateText += `${DATE_SEPARATOR}${yearFigure}`;
        }

        // add zero if length is match
        const textOnlyWihtoutChar = removeNonDigit(updateText).length;
        if ([3, 5, 7].includes(textOnlyWihtoutChar)) {
            updateText = `0${updateText}`;
        }

        return updateText;
    }

    // Check invalid date
    function checkValidDate(text = "") {
        // text length without sign
        const textLength = removeNonDigit(text).length;
        const saparatorLength = text.split(DATE_SEPARATOR).length;

        if (textLength) {
            const fourDigitFigure = text.split(DATE_SEPARATOR);
            const monthFigure = Number(fourDigitFigure[0]);
            const dayFigure = Number(fourDigitFigure[1]);
            const yearFigure = Number(fourDigitFigure[2]);
            const isLeapYear = 0 == yearFigure % 4;


            if (textLength < 2 || textLength > 8 || saparatorLength > 3) {
                return DATE_ERROR_MESSAGE;
            } else if (isLeapYear && monthFigure == 2 && dayFigure >= 30) {
                return DATE_ERROR_MESSAGE;
            } else if (!isLeapYear && monthFigure == 2 && dayFigure >= 29) {
                return DATE_ERROR_MESSAGE;
            } else if (monthWithout31Date.includes(monthFigure) && dayFigure >= 31) {
                return DATE_ERROR_MESSAGE;
            }
        }

        return text;
    }

    // For a "4 number" input (MM & DD)
    function check4DigitDate(text = "") {
        text = trimSign(text);

        if (!text.includes(DATE_SEPARATOR) && text.length === 4) {
            text = `${text.slice(0, 2)}${DATE_SEPARATOR}${text.slice(2)}`;

            const fourDigitFigure = text.split(DATE_SEPARATOR);
            let monthFigure = fourDigitFigure[0];
            let dayFigure = fourDigitFigure[1];

            // Register as MM-DD
            // monthFigure = month
            // dayFigure = day
            const monthDayFigure = monthFigure >= 1 && monthFigure <= 12 && dayFigure >= 1 && dayFigure <= 31;

            // Register as DD-MM
            // monthFigure = day
            // dayFigure = month
            const dayMonthFigure = monthFigure >= 1 && monthFigure <= 31 && dayFigure >= 1 && dayFigure <= 12;
            if (!monthDayFigure && !dayMonthFigure) {
                console.log("[INVALID from check4DigitDate]");
                return DATE_ERROR_MESSAGE;
            }

            // DD-MM to swipe and convert into MM-DD
            if (dayMonthFigure) {
                text = `${dayFigure}-${monthFigure}`;
                const swipeFormat = monthFigure;
                monthFigure = dayFigure;
                dayFigure = swipeFormat;
            }

            const todayTime = new Date(`${TODAY_DATE_OBJ.year}-${TODAY_DATE_OBJ.month}-${TODAY_DATE_OBJ.day}`).getTime();
            const textTime = new Date(`${TODAY_DATE_OBJ.year}-${monthFigure}-${dayFigure}`).getTime();

            if (todayTime < textTime) {
                // If input is a larger number than "Today" then set current year
                text = `${text}-${TODAY_DATE_OBJ.year}`;
            } else if (todayTime >= textTime) {
                // If input is the same or smaller than "Today" then set next year
                text = `${text}-${TODAY_DATE_OBJ.year + 1}`;
            }
        }

        return text;
    }

    // For a "6 number" input (MM & DD && YY)
    function check6DigitDate(text = "") {
        text = trimSign(text);

        if (!text.includes(DATE_SEPARATOR) && text.length === 6) {
            text = `${text.slice(0, 2)}${DATE_SEPARATOR}${text.slice(2, 4)}${DATE_SEPARATOR}${text.slice(4)}`;

            const sixDigitFigure = text.split(DATE_SEPARATOR);
            let monthFigure = sixDigitFigure[0];
            let dayFigure = sixDigitFigure[1];
            let yearFigure = sixDigitFigure[2];

            // Register as MM-DD
            // monthFigure = month
            // dayFigure = day
            const monthDayFigure = monthFigure >= 1 && monthFigure <= 12 && dayFigure >= 1 && dayFigure <= 31;

            // Register as DD-MM
            // monthFigure = day
            // dayFigure = month
            const dayMonthFigure = monthFigure >= 1 && monthFigure <= 31 && dayFigure >= 1 && dayFigure <= 12;

            // Register as YY-MM-DD
            // dayFigure = month
            // yearFigure = day
            const yearMonthDayFigure = yearFigure >= 1 && yearFigure <= 31 && dayFigure >= 1 && dayFigure <= 12;

            if (!monthDayFigure && !dayMonthFigure && !yearMonthDayFigure) {
                console.log("[INVALID from check6DigitDate]");
                return DATE_ERROR_MESSAGE;
            }

            if (dayMonthFigure) {
                // DD-MM-DD convert into MM-DD-YY
                text = `${dayFigure}-${monthFigure}-${yearFigure}`;
            } else if (yearMonthDayFigure) {
                // YY-MM-DD convert into MM-DD-YY
                text = `${yearFigure}-${monthFigure}-${dayFigure}`;
            }

        }

        return text;
    }


    // For a "8 number" input (MM & DD && YYYY)
    function check8DigitDate(text = "", withReplaceYear = false) {
        text = trimSign(text);

        if (!text.includes(DATE_SEPARATOR) && text.length === 8) {
            text = `${text.slice(0, 2)}${DATE_SEPARATOR}${text.slice(2, 4)}${DATE_SEPARATOR}${text.slice(4)}`;

            const sixDigitFigure = text.split(DATE_SEPARATOR);
            let monthFigure = sixDigitFigure[0];
            let dayFigure = sixDigitFigure[1];
            let yearFigure = sixDigitFigure[2];

            // Register as MM-DD
            // monthFigure = month
            // dayFigure = day
            const monthDayFigure = monthFigure >= 1 && monthFigure <= 12 && dayFigure >= 1 && dayFigure <= 31;

            // Register as DD-MM
            // monthFigure = day
            // dayFigure = month
            const dayMonthFigure = monthFigure >= 1 && monthFigure <= 31 && dayFigure >= 1 && dayFigure <= 12;

            if (!monthDayFigure && !dayMonthFigure) {

                // replace the first 4 digits and last 4 digits with each other
                if (withReplaceYear) {
                    // replace non digit to characters
                    const digitDate = removeNonDigit(text);
                    const first4 = digitDate.slice(0, 4);
                    const last4 = digitDate.slice(4);
                    const replaceLast4 = `${last4}${first4}`;
                    return check8DigitDate(replaceLast4);
                }

                console.log("[INVALID from check8DigitDate]");
                return DATE_ERROR_MESSAGE;
            }

            if (dayMonthFigure) {
                // DD-MM-DD convert into MM-DD-YYYY
                text = `${dayFigure}-${monthFigure}-${yearFigure}`;
            }

        }

        return text;
    }


    $(document).ready(function () {
        console.log("Script loaded");

        const dateInputs = $("[data-date-text]");
        dateInputs.on("keyup", function () {
            const outputInput = $(`#${$(this).data("id")}`);
            let value = $(this).val().trim();
            value = getMonthNumberFromMonthName(value);

            // Remove before/after separator
            value = trimSign(value);
            value = replaceNonDigitToCharactor(value);

            // Add zero at first
            value = addZeroForSingleDigit(value);

            // replace non digit to characters
            value = removeNonDigit(value);

            // check first 8 digit input
            value = check8DigitDate(value, true);

            // check first 6 digit input
            value = check6DigitDate(value);

            // check first 4 digit input
            value = check4DigitDate(value);

            // Check date valid length
            value = checkValidDate(value);
            outputInput.val(value);
        });
    });

})();
