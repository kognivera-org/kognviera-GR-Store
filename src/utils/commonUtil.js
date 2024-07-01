import html2canvas from "html2canvas";
import axios from "axios";
import _ from "lodash";
import uuid from "uuid/v4";
import appconfig from "../config/appconfig";
import moment from "moment";
import { globalstylesheets, stylesheets } from "../config/stylesheets";

const pdfObj = null;
const CommonUtil = {
  getBrand() {
    const user = this.getCurrentStoreUser();
    return (user && user.brandName) || "LP";
  },
  getChannel() {
    return "INSTORE";
  },

  isDashboardUserValid(dashboardUser) {
    return (
      (dashboardUser && dashboardUser.dashboardUserName !== "storeuser") ||
      (dashboardUser.dashboardUserRole &&
        dashboardUser.dashboardUserRole.toLowerCase() === "fraudes")
    );
  },

  browserRefresh(e) {
    const dialogText = "Dialog text here";
    e.returnValue = dialogText;
    return dialogText;
  },
  isObjectEmpty(obj) {
    // console.log(obj);
    for (const prop in obj) {
      if (obj.hasOwnProperty(prop)) {
        return false;
      }
    }
    return true;
  },

  getLabel(labels, key, placeholderValues) {
    if (placeholderValues && Object.keys(placeholderValues).length) {
      let labelVal = labels
        ? labels[key]
          ? labels.showKey === "true"
            ? key + "---" + labels[key]
            : labels[key]
          : key
        : key;
      labelVal = this.replacePlaceholderValues(labelVal, placeholderValues);
      return labelVal;
    }
    return labels
      ? labels[key]
        ? labels.showKey === "true"
          ? key + "---" + labels[key]
          : labels[key]
        : key
      : key;
  },
  replacePlaceholderValues(labelStr, placeholderValues) {
    const keys = Object.keys(placeholderValues);
    for (let i = 0; i < keys.length; i++) {
      const placeholder = "<" + keys[i] + ">";
      if (labelStr.indexOf(placeholder) !== -1) {
        labelStr = labelStr.replace(placeholder, placeholderValues[keys[i]]);
      }
    }
    return labelStr;
  },
  getPropertyValueByEventType(eventType, propertyName, eventCategories) {
    let propertyValue = null;
    if (eventCategories && eventCategories.eventConfigurations) {
      const eventConfig = eventCategories.eventConfigurations.filter(
        (config, index) => eventType === config.name
      );
      propertyValue =
        eventConfig && eventConfig.length > 0
          ? eventConfig[0][propertyName]
          : undefined;
    }
    return propertyValue;
  },

  // winProps is optional
  // downloadPrint(param, fileName, className, callBackFunc, winProps) {
  //   let winprops = 'width=1000,height=500';
  //   if (winProps) {
  //     winprops = winProps;
  //   }
  //   const cName = className ? '&classname=' + className : '';
  //   const req = callBackFunc ? '&req=' + callBackFunc : '';
  //   if (param && param === 'download') {
  //     window.open(`/downloadprint?content=${param}&fileName=${fileName}${cName}`, '_blank', winprops);
  //   } else if (param && param === 'print') {
  //     window.open(`/downloadprint?content=${param}&fileName=${fileName}${cName}`, 'PRINT', '_blank', winprops);
  //   } else if (param && param === 'sendmail') {
  //     window.open(`/downloadprint?content=${param}&fileName=${fileName}${cName}${req}`, '_blank', winprops);
  //   }
  // },

  generatePdf(ctlToPrint, useIframe, callBack) {
    const input = document.getElementById("divGenerateHtmlDownloadPrint"); // document.querySelector(ctlToPrint);
    if (input) {
      html2canvas(ctlToPrint, {
        useCORS: true,
        width: 1300,
        windowWidth: 1300,
        scale: 1,
        imageTimeout: 50000,
      })
        .then((canvas) => {
          if (useIframe) {
            canvas.toBlob((blob) => {
              const url = window.URL.createObjectURL(blob, {
                type: "application/pdf",
              });
              callBack && callBack(url);
            });
          } else {
            const imgData = canvas.toDataURL("image/jpeg");
            const imgWidth = 210;
            const imgheight = (canvas.height * imgWidth) / canvas.width;
            const width = this.pdfObj.internal.pageSize.getWidth();
            const position = 5;
            this.pdfObj.addImage(
              imgData,
              "jpeg",
              0,
              position,
              width,
              imgheight
            );
            callBack && callBack(this.pdfObj);
          }
        })
        .catch((error) => {
          console.error("errrorrrr", error);
        });
    }
  },

  downloadPdf(elem, fileName, usePageHeader, footerText, callback, useIframe) {
    this.createPdf(
      elem,
      fileName,
      usePageHeader,
      footerText,
      false,
      callback,
      useIframe
    );
  },

  createPdf(
    elem,
    fileName,
    usePageHeader,
    footerText,
    isForMail,
    callback,
    useIframe
  ) {
    const {jsPDF} = require("jspdf");
    var splitHtml = require('split-html');
    //const splitHtml = require("split-html");
    const pdf = new jsPDF("p", "mm", "a4");
    this.pdfObj = pdf;
    const htmlDom = document.querySelector(elem);
    const innerHTML = htmlDom.innerHTML;
    let htmlArray = innerHTML.split('pageBreak') //splitHtml(innerHTML, ".pageBreak");
    htmlArray = htmlArray.filter(
      (ele) => ele !== '<span class="pageBreak"></span>'
    );
    this.createPdfHtml(
      0,
      htmlArray,
      usePageHeader,
      elem,
      footerText,
      (resPdf) => {
        if (!isForMail) {
          if (useIframe) {
            callback && callback(resPdf);
            this.pdfObj = null;
          } else {
            this.pdfObj.save(fileName);
            this.pdfObj = null;
            callback && callback();
          }
        } else {
          callback && callback(resPdf);
          this.pdfObj = null;
        }
      },
      useIframe
    );
  },

  createPdfHtml(
    i,
    htmlArray,
    usePageHeader,
    elem,
    footerText,
    callBack,
    useIframe
  ) {
    const html = `<div class="mainContainer" style="width: ${
      useIframe ? "1090px" : "1170px"
    }; margin-left: auto; margin-right: auto;">${htmlArray[i]}</div>`;
    const selectedbrand = document.getElementById("selectedbrandid");
    const brand = (selectedbrand && selectedbrand.value) || this.getBrand();
    const assets = appconfig.assets;
    if (html && html.indexOf("pageBreak") === -1) {
      const divEle = document.createElement("div");
      divEle.id = "divGenerateHtmlDownloadPrint";
      divEle.style.position = "absolute";
      divEle.style.top = "-999999px";
      divEle.style.width = !useIframe && "100%";
      if (usePageHeader === "false" || elem !== ".toDownload") {
        const header = `<div class="container" style="width: ${
          useIframe ? "1090px" : "1170px"
        }; margin-left: auto; margin-right: auto;">
    <div class="row pdfclass">
      <div class="col-sm-6 LPLogo">
        <img src="${assets}/images/logo-${brand}.png" alt="Liverpool Logo" />
      </div>
      <div class="col-sm-6 LPGRLogo text-right">
        ${this.formatDate(Date.now(), "monthName")}<br/>
        <img src="${assets}/images/logoMesa.png" alt="Logo Mesa" />
      </div>
    </div>
  </div>`;
        const footer = !useIframe
          ? `<div style="display:block; margin: 0 35px 15px;" class="pdfFooter">
      <div class="col-sm-6" style="font-size: 20px; float: left; text-align:left;">
          ${footerText}
      </div>
      <div class="col-sm-6" style="font-size: 20px; float: right; text-align:right;">
          Página <span class="pageNumber">${
            i + 1
          }</span> de <span class="totalPages">${htmlArray.length}</span>
      </div>
  </div>`
          : "";
        divEle.innerHTML = header + html + footer;
      } else {
        divEle.innerHTML = html;
      }
      document.getElementsByTagName("BODY")[0].appendChild(divEle);
      document
        .querySelectorAll(
          "#divGenerateHtmlDownloadPrint .exclude-for-print-download"
        )
        .forEach((element) => {
          element.classList.add("display-none");
        });
      let marginTop =
        1717 -
        document.querySelector("#divGenerateHtmlDownloadPrint .mainContainer")
          .clientHeight;
      marginTop = marginTop >= 0 ? marginTop : 0;
      const footerDiv = document.querySelector(
        "#divGenerateHtmlDownloadPrint .pdfFooter"
      );
      if (footerDiv) {
        footerDiv.style.marginTop = marginTop + "px";
      }
      if (htmlArray.length === 1 && !useIframe) {
        this.generateMultiPagePdf(divEle, (resPdf) => {
          divEle.parentNode.removeChild(divEle);
          callBack && callBack(resPdf);
        });
      } else {
        this.generatePdf(divEle, useIframe, (resPdf) => {
          if (resPdf) {
            divEle.parentNode.removeChild(divEle);
            if (useIframe) {
              callBack && callBack(resPdf);
            } else {
              i += 1;
              if (i < htmlArray.length) {
                this.pdfObj.addPage();
                this.createPdfHtml(
                  i,
                  htmlArray,
                  usePageHeader,
                  elem,
                  footerText,
                  callBack
                );
              } else {
                callBack && callBack(resPdf);
              }
            }
          }
        });
      }
    }
  },

  generateMultiPagePdf(ctlToPrint, callBack) {
    if (ctlToPrint) {
      html2canvas(ctlToPrint, {
        useCORS: true,
        width: 1300,
        windowWidth: 1300,
        scale: 1,
        imageTimeout: 50000,
      })
        .then((canvas) => {
          const imgData = canvas.toDataURL("image/jpeg");
          const imgWidth = 210;
          const imgheight = (canvas.height * imgWidth) / canvas.width;
          const width = this.pdfObj.internal.pageSize.getWidth();
          const pageHeight = this.pdfObj.internal.pageSize.getHeight();
          let heightLeft = imgheight;
          let position = 5;
          const pages = Math.ceil(imgheight / pageHeight);
          this.pdfObj.addImage(imgData, "jpeg", 0, position, width, imgheight);
          heightLeft -= pageHeight;
          while (heightLeft >= 0) {
            position = heightLeft - imgheight;
            this.pdfObj.addPage();
            this.pdfObj.addImage(
              imgData,
              "jpeg",
              0,
              position,
              width,
              imgheight
            );
            heightLeft -= pageHeight;
          }
          callBack && callBack(this.pdfObj);
        })
        .catch((error) => {
          console.error("errrorrrr", error);
        });
    }
  },
  generatePdfContent(elem) {
    const outerDiv = document.createElement("div");
    const divEle = document.createElement("div");
    divEle.id = "divGenerateHtmlDownloadPrint";
    divEle.style.position = "absolute";
    const selectedbrand = document.getElementById("selectedbrandid");
    const brand = (selectedbrand && selectedbrand.value) || this.getBrand();
    const input = document.querySelector(elem);
    if (input) {
      const cloned = input.cloneNode(true);
      const head = document.getElementsByTagName("head");
      divEle.appendChild(head[0].cloneNode(true));
      divEle.appendChild(cloned);
      divEle
        .querySelectorAll(
          "#divGenerateHtmlDownloadPrint .exclude-for-print-download"
        )
        .forEach((element) => {
          element.style = "display:none";
        });
      const headerElem = divEle.querySelector(".nav-wrap");
      if (headerElem) {
        headerElem.style = "display:none";
      }
      outerDiv.appendChild(divEle);
      // document.getElementsByTagName('BODY')[0].appendChild(outerDiv);
    }
    return outerDiv;
  },

  generateHtml(elem, usePageHeader) {
    const divEle = document.createElement("div");
    divEle.id = "divGenerateHtmlDownloadPrint";
    divEle.style.position = "absolute";
    divEle.style.top = "-999999px";
    const selectedbrand = document.getElementById("selectedbrandid");
    const brand = (selectedbrand && selectedbrand.value) || this.getBrand();
    if (usePageHeader === "false" || elem !== ".toDownload") {
      const assets = appconfig.assets;
      divEle.innerHTML = `<div class="container">
      <div class="row pdfclass">
        <div class="col-sm-6 LPLogo">
          <img src="${assets}/images/logo-${brand}.png" alt="Liverpool Logo" />
        </div>
        <div class="col-sm-6 LPGRLogo text-right">
          ${this.formatDate(Date.now(), "monthName")}<br/>
          <img src="${assets}/images/logoMesa.png" alt="Logo Mesa" />
        </div>
      </div>
    </div>`;
    }
    const input = document.querySelector(elem);
    if (input) {
      const cloned = input.cloneNode(true);
      divEle.appendChild(cloned);
      document.getElementsByTagName("BODY")[0].appendChild(divEle);
      document
        .querySelectorAll(
          "#divGenerateHtmlDownloadPrint .exclude-for-print-download"
        )
        .forEach((element) => {
          element.classList.add("display-none");
        });
    }
    return divEle;
  },

  printPage(elem) {
    setTimeout(() => {
      const printwindow = window.open("", "PRINT", "width=1000,height=500");

      printwindow.document.write("<html><head>");
      let cssLinks = "";
      for (let i = 0; i < document.styleSheets.length; i++) {
        const sheet = document.styleSheets[i];
        cssLinks +=
          '<link rel="stylesheet" type="text/css" href="' + sheet.href + '" />';
      }
      printwindow.document.write("<html><head>");
      printwindow.document.write(cssLinks);
      printwindow.document.write("</head><body>");
      const divEle = this.generateHtml(elem);
      // printwindow.document.write(document.querySelector(elem).innerHTML);
      printwindow.document.write(divEle.innerHTML);
      printwindow.document.write("</body></html>");

      printwindow.document.close(); // necessary for IE >= 10
      printwindow.focus(); // necessary for IE >= 10*/

      setTimeout(() => {
        printwindow.print();
        printwindow.close();
      }, 500);

      return true;
    }, 500);
  },
  mailPdf(elem, fileName, usePageHeader, footerText, callBack) {
    setTimeout(() => {
      if (typeof callBack === "function") {
        const divEle = this.generateHtml(elem, usePageHeader);
        this.createPdf(
          elem,
          fileName,
          usePageHeader,
          footerText,
          true,
          (pdf) => {
            if (pdf) {
              callBack(fileName, pdf.output("blob"));
            }
          }
        );
      }
    }, 500);
  },

  // generatePdfHiddenHtml(ctlToPrint, fileName) {
  //   const PdfConverter = require('jspdf');
  //   const input = document.querySelector(ctlToPrint);
  //   // var doc = new PdfConverter('p', 'pt', 'letter', true);
  //   const doc = new PdfConverter('p', 'pt');

  //   doc.fromHTML(input, 10, 10, {
  //     width: 550,
  //   }, (dispose) => {
  //     setTimeout(() => {
  //       doc.save(fileName);
  //     }, 2000);
  //   });
  // },
  getCurrency(val) {
    const curencySymbol = "$";
    const value =
      curencySymbol +
      parseFloat(0 + val)
        .toFixed(2)
        .replace(/(\d)(?=(\d{3})+\.)/g, "$1,");
    return value;
  },
  formatDate(date, format) {
    let _output = "";
    let _date;

    if (isNaN(date)) {
      _date = new Date(date);
    } else {
      _date = new Date(+date);
    }
    if (format === "dd/mm/yyyy") {
      _output = `${_date.getDate()}/${
        _date.getMonth() + 1
      }/${_date.getFullYear()}`;
    } else if (format === "time") {
      _output = _date.getTime();
    } else if (format === "hour12") {
      _output = _date.toLocaleString("en-US", {
        hour: "numeric",
        hour12: true,
      });
    } else if (format === "hour24") {
      _output = _date.toLocaleString("en-US", {
        hour: "numeric",
        hour12: false,
      });
    } else if (format === "monthName") {
      const spanishMonths = [
        "enero",
        "febrero",
        "marzo",
        "abril",
        "mayo",
        "junio",
        "julio",
        "agosto",
        "septiembre",
        "octubre",
        "noviembre",
        "diciembre",
      ];
      _output = `${_date.getDate()} ${
        spanishMonths[_date.getMonth()]
      } del ${_date.getFullYear()}`;
    }

    return _output;
  },
  getESDate(
    date,
    options = {
      weekday: "long",
      year: "numeric",
      month: "long",
      day: "numeric",
    }
  ) {
    const dateObj = new Date(date);
    return dateObj.toLocaleDateString("es-MX", options);
  },
  generateRedirect(route, params) {
    let x = "/" + route;
    if (params) {
      _.mapKeys(params, (value, key) => {
        x = x.replace(`/:${key}`, `/${value}`);
      });
    }
    return x;
  },
  getCurrentStoreUser() {
    if (typeof window !== "undefined") {
      const userObj = window.localStorage.getItem("user");
      return (
        userObj &&
        userObj != "null" &&
        userObj != "undefined" &&
        JSON.parse(userObj)
      );
    }
    return null;
  },
  async triggerPostRequest(url, type, values) {
    try {
      const _values = {
        brand: this.getBrand(),
        channel: this.getChannel(),
        ...values,
      };
      const config = {
        method: type.toUpperCase(),
        url,
        json: true,
        data: type.toLowerCase() === "post" ? _values : undefined,
        params: type.toLowerCase() === "get" ? _values : undefined,
        headers: {
          "x-correlation-id": uuid(Date.now()),
        },
      };
      const response = await axios(config);
      return !response ||
        !response.data ||
        response.data.status === "failure" ||
        (response.data.status &&
          response.data.status.status &&
          response.data.status.status.toLowerCase() === "failure")
        ? { error: response.data, headers: response.headers }
        : { data: response.data, headers: response.headers };
    } catch (error) {
      return { error };
    }
  },
  async triggerFormDataPostRequest(url, type, formData) {
    try {
      formData.append("brand", this.getBrand());
      formData.append("channel", this.getChannel());

      const config = {
        method: type.toUpperCase(),
        url,
        data: formData,
        // headers: { 'content-type': 'multipart/form-data' },
      };
      const response = await axios(config);
      return !response ||
        !response.data ||
        response.data.status === "failure" ||
        (response.data.status &&
          response.data.status.status &&
          response.data.status.status.toLowerCase() === "failure")
        ? { error: response.data, headers: response.headers }
        : { data: response.data, headers: response.headers };
    } catch (error) {
      return { error };
    }
  },

  isAccountSystemAvailable(start, end, current) {
    if (start && end) {
      const startHours = new Date(+start).getHours();
      const startMinutes = new Date(+start).getMinutes();

      const endHours = new Date(+end).getHours();
      const endMinutes = new Date(+end).getMinutes();

      const currentHours = new Date(+current).getHours();
      const currentMinutes = new Date(+current).getMinutes();

      const startValue = +(startHours + ("0" + startMinutes).slice(-2));
      const endValue = +(endHours + ("0" + endMinutes).slice(-2));
      const currentValue = +(currentHours + ("0" + currentMinutes).slice(-2));

      // console.log('isAccountSystemAvailable', currentValue, startValue, endValue);
      // if (currentValue >= startValue && currentValue <= endValue) {
      //   return true;
      // }
      if (startValue < endValue) {
        if (currentValue >= startValue && currentValue <= endValue) {
          return true;
        }
      } else if (
        (currentValue >= 0 && currentValue <= endValue) ||
        (currentValue >= startValue && currentValue <= 2359)
      ) {
        return true;
      }
    }
    return false;
  },

  isBonusAvailable(eventDetailsInfo) {
    const eventcategory = eventDetailsInfo && eventDetailsInfo.eventCategory;
    const creationdate =
      eventDetailsInfo &&
      eventDetailsInfo.additionalInfo &&
      eventDetailsInfo.additionalInfo.creationDate;
    const creationDateObj = moment(creationdate, "DD/MM/YYYY");
    const enddate = moment("01/04/2018", "DD/MM/YYYY");

    if (
      eventcategory === appconfig.eventCategory.OPENEVENT &&
      creationDateObj.isValid() &&
      creationDateObj.isBefore(enddate)
    ) {
      return true;
    } else if (eventcategory === appconfig.eventCategory.CELEBRATION) {
      return true;
    }
    return false;
  },

  errorScrollUp() {
    document.querySelector(".alertError") &&
      document
        .querySelector(".alertError")
        .scrollIntoView({ block: "start", behavior: "smooth" });
  },

  goToTop() {
    window.scrollTo(0, 0);
  },

  mask(number, unmasked) {
    return (
      (number &&
        number.replace(
          new RegExp(".(?=.{" + (unmasked || 4) + ",}$)", "g"),
          "*"
        )) ||
      ""
    );
  },
};
export default CommonUtil;
