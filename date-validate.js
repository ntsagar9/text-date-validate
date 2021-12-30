
(function () {
    const DATE_ERROR_MESSAGE = "INVALID INPUT - TYPE AGAIN";
    const DATE_SEPARATOR = "-";
    const SHORT_MONTHS = ["jan", "feb", "mar", "apr", "may", "jun", "jul", "aug", "sep", "oct", "nov", "dec"];
    const FULL_MONTHS = ["january", "february", "march", "april", "may", "june", "july", "august", "september", "october", "november", "december"];
    const THIS_DAYS = ["this monday", "this tuesday", "this wednesday", "this thursday", "this friday", "this saturday", "this sunday"];
    const NEXT_DAYS = ["next monday", "next tuesday", "next wednesday", "next thursday", "next friday", "next saturday", "next sunday"];
    const monthWithout31Date = [4, 6, 9, 11];

    // Get month number in 2 digits
    function getMonthIn2Digits(monthNumber) {
        return monthNumber <= 9 ? `0${monthNumber}` : `${monthNumber}`;
    }

    function addDayFromToday(addDay = 1){
        var today = new Date();
        var nextweek = new Date(today.getFullYear(), today.getMonth(), today.getDate()+addDay);
        return nextweek;
    }

    // get formated date from new Date()
    function dateToFormated(dateObj) {
        const day = dateObj.getDate();
        const month = dateObj.getMonth() + 1;
        const year = dateObj.getFullYear();

        return `${year}-${getMonthIn2Digits(month)}-${getMonthIn2Digits(day)}`
    }

    function getThisDayOfTheWeek(textdate, excludeToday = true, refDate = new Date()) {
        let sundayIsFirst = [...THIS_DAYS];
        sundayIsFirst.pop();
        sundayIsFirst = ["this sunday", ...sundayIsFirst];
        const dayOfWeek = sundayIsFirst.indexOf(textdate);
        if (dayOfWeek < 0) return;

        refDate.setHours(0,0,0,0);
        refDate.setDate(refDate.getDate() + +!!excludeToday + 
                        (dayOfWeek + 7 - refDate.getDay() - +!!excludeToday) % 7);
        return refDate;
    }

    function getNextWeekDayOfTheWeek(textdate, excludeToday = true, refDate = new Date()) {
        let sundayIsFirst = [...NEXT_DAYS];
        sundayIsFirst.pop();
        sundayIsFirst = ["next sunday", ...sundayIsFirst];
        const dayOfWeek = sundayIsFirst.indexOf(textdate);
        if (dayOfWeek < 0) return;

        // count day from next week
        const week = 14;

        refDate.setHours(0,0,0,0);
        refDate.setDate(refDate.getDate() + +!!excludeToday + 
                        (dayOfWeek + week - refDate.getDay() - +!!excludeToday) % week);
        return refDate;
    }

    // Get date from text patterns
    // Example today, tomorrow, this sunday, this monday etc.
    function getDateFromTextPatterns(text = "") {
        const smallText = text.toLowerCase();        
        if(smallText.includes("today")) {
            return dateToFormated(new Date());
        } else if(smallText.includes("day after tomorrow")) {
            return dateToFormated(addDayFromToday(3));
        } else if(smallText == ("tomorrow")) {
            return dateToFormated(addDayFromToday(1));
        } else if (THIS_DAYS.includes(smallText)) {
            return dateToFormated(getThisDayOfTheWeek(smallText, false));
        } else if (NEXT_DAYS.includes(smallText)) {
            return dateToFormated(getNextWeekDayOfTheWeek(smallText, false));
        }


        return false;
    }

    // Get number of month by month name
    function getMonthNumberFromMonthName(text = "") {
        const smallText = text.toLowerCase();
        let isOnFUllMonth = false;
        FULL_MONTHS.map((fm, index) => {
            if (smallText.includes(fm)) {
                isOnFUllMonth = true;
                const monthReplace = new RegExp(fm);
                const month = getMonthIn2Digits(index + 1);
                text = smallText.replace(monthReplace, month);
            }
        });
        if (!isOnFUllMonth) {
            SHORT_MONTHS.map((sm, index) => {
                if (smallText.includes(sm)) {
                    const monthReplace = new RegExp(sm);
                    const month = getMonthIn2Digits(index + 1);
                    text = smallText.replace(monthReplace, month);
                }
            });
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
            const yearFigure = Number(fourDigitFigure[0]);
            const monthFigure = Number(fourDigitFigure[1]);
            const dayFigure = Number(fourDigitFigure[2]);
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
            if (!monthDayFigure && dayMonthFigure) {
                text = `${dayFigure}-${monthFigure}`;
                const swipeFormat = monthFigure;
                monthFigure = dayFigure;
                dayFigure = swipeFormat;
            }

            const todayTime = new Date(`${TODAY_DATE_OBJ.year}-${TODAY_DATE_OBJ.month}-${TODAY_DATE_OBJ.day}`).getTime();
            const textTime = new Date(`${TODAY_DATE_OBJ.year}-${monthFigure}-${dayFigure}`).getTime();

            if (todayTime < textTime) {
                // If input is a larger number than "Today" then set current year
                text = `${TODAY_DATE_OBJ.year}-${text}`;
            } else if (todayTime >= textTime) {
                // If input is the same or smaller than "Today" then set next year
                text = `${TODAY_DATE_OBJ.year + 1}-${text}`;
            }
        }
        // Return YYYY-MM-DD
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

            // get Year from first 2 digit
            const yyyy = (Number(monthFigure) + 2000);
            const isYear = yyyy <= (TODAY_DATE_OBJ.year + 3) && (TODAY_DATE_OBJ.year - 3) <= yyyy;

            // Register as MM-DD-YY
            // monthFigure = month
            // dayFigure = day
            const monthDayFigure = !isYear && monthFigure >= 1 && monthFigure <= 12 && dayFigure >= 1 && dayFigure <= 31;

            // Register as DD-MM-YY
            // monthFigure = day
            // dayFigure = month
            const dayMonthFigure = !isYear && monthFigure >= 1 && monthFigure <= 31 && dayFigure >= 1 && dayFigure <= 12;

            // Register as YY-MM-DD
            // dayFigure = month
            // yearFigure = day
            const yearMonthDayFigure = isYear && yearFigure >= 1 && yearFigure <= 31 && dayFigure >= 1 && dayFigure <= 12;

            if (!monthDayFigure && !dayMonthFigure && !yearMonthDayFigure) {
                console.log("[INVALID from check6DigitDate]");
                return DATE_ERROR_MESSAGE;
            }

            if (dayMonthFigure && !monthDayFigure && !yearMonthDayFigure) {
                let year = Number(yearFigure);
                if (year < 80) {
                    year += 2000;
                }

                // DD-MM-YY convert into YYYY-MM-DD
                text = `${year}-${dayFigure}-${monthFigure}`;
            } else if (yearMonthDayFigure) {
                let year = Number(monthFigure);
                if (year < 80) {
                    year += 2000;
                }
                // YY-MM-DD convert into YYYY-MM-DD
                text = `${year}-${dayFigure}-${yearFigure}`;
            } else if(monthDayFigure) {
                let year = Number(yearFigure);
                if (year < 80) {
                    year += 2000;
                }
                // MM-DD-YY convert into YYYY-MM-DD
                text = `${year}-${monthFigure}-${dayFigure}`;
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
            console.log(">>dayMonthFigure>>>", dayMonthFigure);
            console.log(">>monthDayFigure>>>", monthDayFigure);

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

            if (dayMonthFigure && !monthDayFigure) {
                // DD-MM-YYYY convert into YYYY-MM-DD
                text = `${yearFigure}-${monthFigure}-${dayFigure}`;
            } else if(monthDayFigure) {
                // MM-DD-YYYY convert into YYYY-MM-DD
                text = `${yearFigure}-${monthFigure}-${dayFigure}`;
            }

        }

        return text;
    }

    function getFormatedDate(value = "") {
        let textDate = value.trim();
        const patternDate = getDateFromTextPatterns(textDate);
        if (patternDate) {
            textDate = patternDate;
        } else {
            textDate = getMonthNumberFromMonthName(textDate);
    
            // Remove before/after separator
            textDate = trimSign(textDate);
            textDate = replaceNonDigitToCharactor(textDate);
    
            // Add zero at first
            textDate = addZeroForSingleDigit(textDate);
    
            // replace non digit to characters
            textDate = removeNonDigit(textDate);
    
            // check first 8 digit input
            textDate = check8DigitDate(textDate, true);
    
            // check first 6 digit input
            textDate = check6DigitDate(textDate);
    
            // check first 4 digit input
            textDate = check4DigitDate(textDate);
        }
        
        // Check date valid length
        textDate = checkValidDate(textDate);
        
        return textDate;
    }
    
    
    $(document).ready(function () {
        console.log("Script loaded");
        
        const dateInputs = $("[data-date-text]");
        dateInputs.on("keyup", function () {
            const outputInput = $(`#${$(this).data("id")}`);
            const value = getFormatedDate($(this).val());
            outputInput.val(value);
        });
    });

})();
