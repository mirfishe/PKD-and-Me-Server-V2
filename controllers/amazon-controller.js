"use strict";

const router = require("express").Router();
// const axios = require("axios");
const databaseConfig = require("../database");
const db = require("knex")(databaseConfig.config);
// const validateSession = require("../middleware/validate-session");
const validateAdmin = require("../middleware/validate-admin");
const { isEmpty, getDateTime, isNonEmptyArray, formatTrim } = require("../utilities/sharedFunctions");
const { convertBitTrueFalse } = require("../utilities/applicationFunctions");
const addLog = require("../utilities/addLog");
const addErrorLog = require("../utilities/addErrorLog");

const controllerName = "amazon";
const tableName = "amazon";
// const select = "*";
// const limit = 20;
// const activeWhere = { "active": true };
// const viewedWhere = { "viewed": false };
// const authorWhere = { "authorName": "Dick, Philip K." };
// const orderBy = [{ column: "authorName", order: "asc" }, { column: "titleName", order: "asc" }];

// const Parser = require("rss-parser");

const ProductAdvertisingAPIv1 = require("../amazon/index");

const credentials = require("../amazon");

const componentName = `${controllerName}-controller`;

let records;

// INSERT INTO amazon (ASIN, titleName, authorName, publicationDate, imageName, textLinkFull)
// SELECT DISTINCT ASIN, titleName, authorName, publicationDate, imageName, textLinkFull FROM amazonImport
// WHERE ASIN NOT IN (SELECT ASIN FROM amazon)


/******************************
 ***** Get Amazon Items *********
 ******************************/
router.get("/", (request, response) => {

  let sqlQuery = "SELECT * FROM amazon INNER JOIN (SELECT ASIN, GROUP_CONCAT(searchIndex) AS searchIndex FROM (SELECT DISTINCT ASIN, searchIndex FROM amazonImport WHERE searchIndex IS NOT NULL ORDER BY searchIndex) AS searchIndexDistinct GROUP BY ASIN) AS amazonSearchIndex ON amazon.ASIN = amazonSearchIndex.ASIN WHERE active = 1 AND merchant = 'Amazon' ORDER BY viewed, createDate, authorName, titleName";

  // db.raw(sqlQuery).toSQL();

  // db.select(select)
  //   .from(tableName)
  //   // .limit(limit)
  //   // .where(activeWhere)
  //   .where(viewedWhere)
  //   // .where(authorWhere)
  //   .orderBy(orderBy)
  db.raw(sqlQuery)
    .then((results) => {

      records = convertBitTrueFalse(results);

      if (isNonEmptyArray(records) === true) {

        response.status(200).json({ transactionSuccess: true, errorOccurred: false, message: "Successfully retrieved records.", records: records });

      } else {

        response.status(200).json({ transactionSuccess: false, errorOccurred: false, message: "No records found." });

      };

    })
    .catch((error) => {

      console.error(componentName, getDateTime(), "get / error", error);

      addErrorLog(componentName, "get /", {}, error);
      response.status(500).json({ transactionSuccess: false, errorOccurred: true, message: "No records found." });

    });

});

/******************************
 ***** Get Amazon Items *********
 ******************************/
router.get("/all", (request, response) => {

  let sqlQuery = "SELECT * FROM amazon INNER JOIN (SELECT ASIN, GROUP_CONCAT(searchIndex) AS searchIndex FROM (SELECT DISTINCT ASIN, searchIndex FROM amazonImport WHERE searchIndex IS NOT NULL ORDER BY searchIndex) AS searchIndexDistinct GROUP BY ASIN) AS amazonSearchIndex ON amazon.ASIN = amazonSearchIndex.ASIN WHERE active = 1 AND merchant = 'All' ORDER BY viewed, createDate, authorName, titleName";

  // db.raw(sqlQuery).toSQL();

  // db.select(select)
  //   .from(tableName)
  //   // .limit(limit)
  //   // .where(activeWhere)
  //   .where(viewedWhere)
  //   // .where(authorWhere)
  //   .orderBy(orderBy)
  db.raw(sqlQuery)
    .then((results) => {

      records = convertBitTrueFalse(results);

      if (isNonEmptyArray(records) === true) {

        response.status(200).json({ transactionSuccess: true, errorOccurred: false, message: "Successfully retrieved records.", records: records });

      } else {

        response.status(200).json({ transactionSuccess: false, errorOccurred: false, message: "No records found." });

      };

    })
    .catch((error) => {

      console.error(componentName, getDateTime(), "get /all error", error);

      addErrorLog(componentName, "get /all", {}, error);
      response.status(500).json({ transactionSuccess: false, errorOccurred: true, message: "No records found." });

    });

});


/******************************
 ***** Get Amazon SDK *********
 ******************************/
router.get("/item/:arrayNumber", (request, response) => {

  let arrayNumber = isEmpty(request.params.arrayNumber) === false ? request.params.arrayNumber : "";

  if (isEmpty(arrayNumber) === true) {

    arrayNumber = "0";

  };

  let merchant = "";

  // merchant = "All";
  // merchant = "Amazon";

  if (isEmpty(merchant) === true) {

    merchant = "Amazon";

  };

  // const numberOfResultsPages = 11;
  // const numberOfResultsPages = 2;

  // let waitTime = 10000; // * 10 seconds -- 01/09/2022 MF

  let defaultClient = ProductAdvertisingAPIv1.ApiClient.instance;

  // Specify your credentials here. These are used to create and sign the request.
  defaultClient.accessKey = credentials.accessKey;
  defaultClient.secretKey = credentials.secretKey;

  /**
   * PAAPI Host and Region to which you want to send request.
   * For more details refer: https://webservices.amazon.com/paapi5/documentation/common-request-parameters.html#host-and-region
   */
  defaultClient.host = credentials.host;
  defaultClient.region = credentials.region;

  let api = new ProductAdvertisingAPIv1.DefaultApi();

  // Request Initialization

  let getItemsRequest = new ProductAdvertisingAPIv1.GetItemsRequest();

  /** Enter your partner tag (store/tracking id) and partner type */
  getItemsRequest["PartnerTag"] = credentials.PartnerTag;
  getItemsRequest["PartnerType"] = credentials.PartnerType;

  getItemsRequest["Merchant"] = merchant;

  /** Enter the Item IDs for which item information is desired */
  if (arrayNumber === "0") {

    getItemsRequest["ItemIds"] = ["0765316919", "076531696X", "057513271X", "B005LVQZD4", "B00C2UOI72", "B009V9EFMA", "B00C2TUAFC", "B01EVQLDKE", "B00C2WLOMW", "B008O7JZ16"];

  } else if (arrayNumber === "1") {

    getItemsRequest["ItemIds"] = ["B01EVP6JS6", "B01EVQ9W7A", "B005WOHHWI", "B01EVPKXQK", "B01EVQLDIG", "B01EVQSW58", "B087MW9117", "B01EVQSZVE", "B009DBV9Z2", "B00HARTOLC"];

  } else if (arrayNumber === "2") {

    getItemsRequest["ItemIds"] = ["B009E6O66K", "B01EVQYGF8", "B005WOG10C", "B00CSXRFPU", "B00WIV5LPI", "B01EVPKWPC", "B00714Q3NQ", "B00940HUE6", "B005WOFIPG", "B009DBVKHE"];

  } else if (arrayNumber === "3") {

    getItemsRequest["ItemIds"] = ["B008ETL5R6", "B00906CD1Y", "B01EVQYEK0", "B00CT5GGIE", "B018Y22HG0", "B01EVOZUCS", "B01EVO5EWY", "B01EVP6BXY", "B0781291F2", "1596063408"];

  } else if (arrayNumber === "4") {

    getItemsRequest["ItemIds"] = ["1596065125", "1607012022", "1607012030", "1400096073", "0806526300", "B00CB5WAIM", "0806523794", "080653799X", "1840239689", "1455814741"];

  } else if (arrayNumber === "5") {

    getItemsRequest["ItemIds"] = ["1480595098", "B00DER5H9K", "148059511X", "1480595128", "147330573X", "B00ATUWTL4", "B00HUBKURU", "1480595144", "B00CBPBDIA", "1452847231"];

  } else if (arrayNumber === "6") {

    getItemsRequest["ItemIds"] = ["B004Z13Q1U", "1434103048", "B00CCEE35A", "1482767368", "B000XUDH1Q", "1455814466", "1543661041", "1501289438", "1455814296", "1480594423"];

  } else if (arrayNumber === "7") {

    getItemsRequest["ItemIds"] = ["1501289535", "1501279971", "1501290215", "1501293400", "0739342754", "148059444X", "150128939X", "1501289551", "1480594407", "1469251922"];

  } else if (arrayNumber === "8") {

    getItemsRequest["ItemIds"] = ["1455814504", "1501289527", "1501289373", "0765316951", "1480594261", "1501289578", "0544916085", "1511382996", "1501289543", "1480594288"];

  } else if (arrayNumber === "9") {

    getItemsRequest["ItemIds"] = ["B002A77UUO", "148059430X", "1480594326", "1501289411", "1455814415", "145581475X", "1455814598", "145581444X", "057513206X", "1501289586"];

  } else if (arrayNumber === "10") {

    getItemsRequest["ItemIds"] = ["150128942X", "150128004X", "073932392X", "1501289489", "1501289497", "1455840394", "1501289462", "1455814555", "1480594466", "1455840300"];

  } else if (arrayNumber === "11") {

    getItemsRequest["ItemIds"] = ["1501289470", "1501289500", "1501289519", "150128956X", "B01GI5EYFC", "153063265X", "0803218605", "1411633490", "B01GZBFVR4", "0934558310"];

  } else if (arrayNumber === "12") {

    getItemsRequest["ItemIds"] = ["0816666660", "B0054X4ALI", "0415962420", "0415887771", "B001OFK1PE", "B000003GI2", "B01BU13W6G", "0313292957", "B000QXDBG6", "0853236283"];

  } else if (arrayNumber === "13") {

    getItemsRequest["ItemIds"] = ["1442110279", "B00BAH7Y56", "B005LXC91Y", "1508741492", "1430324376", "0761826734", "0810862123", "B0025VK8AY", "B00MNEDT5O", "B083G6CVZB"];

  } else if (arrayNumber === "14") {

    getItemsRequest["ItemIds"] = ["1461142695", "B004YTMQ32", "B07M8XVB6G", "0786448830", "B004Z0UN44", "1137414588", "B08BT6DBKT", "B085HC97WQ", "B075WXGWHL", "B08CCGTJ92"];

  } else if (arrayNumber === "15") {

    getItemsRequest["ItemIds"] = ["160964350X", "0812694716", "0231161735", "B008O7CVZ8", "1138625302", "B07T3FZPH6", "1904764312", "0415485851", "B00XCKX0JI", "1903663792"];

  } else if (arrayNumber === "16") {

    getItemsRequest["ItemIds"] = ["1861713568", "B0088UU30G", "B0071W4T1G", "1941071007", "1782206078", "B07CJSFX4X", "B085XNYL1M", "1350028274", "B013KW4F1Y", "1886404259"];

  } else if (arrayNumber === "17") { // ! Problem "B015XIE47S" -- 03/02/2022 MF

    getItemsRequest["ItemIds"] = ["B00K4PWS2Y", "1886404100", "B00KK33W0W", "B00FRJXO3E", "B00KN1CHG6", "1629236578", "1463896794", "1987781619", "B0197858WA"];

  } else if (arrayNumber === "18") {

    getItemsRequest["ItemIds"] = ["099330608X", "B07JH58YSV", "1478101946", "1502725681", "1795272848", "B0065J693C", "B00XI058LU", "B0154ELKBY", "B086VYW41B", "B086VXYZNH"];

  } else if (arrayNumber === "19") {

    getItemsRequest["ItemIds"] = ["B086VXJWGC", "B086VX98GP", "0812699637", "B0728D7KHY", "B089VMBBKH", "B000SW4DLM", "1531883346", "B00070FX5U", "B00QSHWYWQ", "B08HPHL4JB"];

  } else if (arrayNumber === "20") {

    getItemsRequest["ItemIds"] = ["B001DUIZIA", "B001MVYUSE", "B0024OBJTG", "B01F9RF1LQ", "B00009ZYC0", "B00A2FSXHK", "B0035WTJFW", "B074NZD92D", "B000NIF51S", "B000MS6NV0"];

  } else if (arrayNumber === "21") {

    getItemsRequest["ItemIds"] = ["B072ZKW1MK", "B072ZLXV7T", "B000YKFJ66", "B004WCTLNY", "B0055OK2T0", "B0092QITO2", "0061686360", "B0024CF0EI", "B004XQV7ZE", "0982761902"];

  } else if (arrayNumber === "22") {

    getItemsRequest["ItemIds"] = ["B004R9QSJ2", "1416556966", "B01LZP68UH", "1664453946", "0345501160", "B001E70RVK", "B00P2RP9WA", "1933846542", "B018JOI6WW", "1587150751"];

  } else if (arrayNumber === "23") {

    getItemsRequest["ItemIds"] = ["B083G6MMGN", "B08HNGRYMK", "B01BGXXBAA", "B007VB69SS", "B01BGXXBHI", "B071WRJ1VB", "B072QLMDPX", "B002SGYPS2", "1861715242", "1861714254"];

  } else if (arrayNumber === "24") {

    getItemsRequest["ItemIds"] = ["0990573370", "B01M0R96OL", "B07ZHNRRGS", "B08QRKV8GW", "B09422NMGD", "B08R1DD383", "0765316919", "076531696X", "057513271X"];

  } else if (arrayNumber === "25") {

    getItemsRequest["ItemIds"] = ["B005LVQZD4", "B00C2UOI72", "B009V9EFMA", "B00C2TUAFC", "B01EVQLDKE", "B00C2WLOMW", "B008O7JZ16", "B01EVP6JS6", "B01EVQ9W7A", "B005WOHHWI"];

  } else if (arrayNumber === "26") {

    getItemsRequest["ItemIds"] = ["B01EVPKXQK", "B01EVQLDIG", "B01EVQSW58", "B087MW9117", "B01EVQSZVE", "B009DBV9Z2", "B00HARTOLC", "B009E6O66K", "B01EVQYGF8", "B005WOG10C"];

  } else if (arrayNumber === "27") {

    getItemsRequest["ItemIds"] = ["B00CSXRFPU", "B00WIV5LPI", "B01EVPKWPC", "B00714Q3NQ", "B00940HUE6", "B005WOFIPG", "B009DBVKHE", "B008ETL5R6", "B00906CD1Y", "B01EVQYEK0"];

  } else if (arrayNumber === "28") {

    getItemsRequest["ItemIds"] = ["B00CT5GGIE", "B018Y22HG0", "B01EVOZUCS", "B01EVO5EWY", "B01EVP6BXY", "B0781291F2", "1596063408", "1596065125", "1607012022", "1607012030"];

  } else if (arrayNumber === "29") {

    getItemsRequest["ItemIds"] = ["1400096073", "0806526300", "B00CB5WAIM", "0806523794", "080653799X", "1840239689", "1455814741", "1480595098", "B00DER5H9K", "148059511X"];

  } else if (arrayNumber === "30") {

    getItemsRequest["ItemIds"] = ["1480595128", "147330573X", "B00ATUWTL4", "B00HUBKURU", "1480595144", "B00CBPBDIA", "1452847231", "B004Z13Q1U", "1434103048", "B00CCEE35A"];

  } else if (arrayNumber === "31") {

    getItemsRequest["ItemIds"] = ["1482767368", "B000XUDH1Q", "1455814466", "1543661041", "1501289438", "1455814296", "1480594423", "1501289535", "1501279971", "1501290215"];

  } else if (arrayNumber === "32") {

    getItemsRequest["ItemIds"] = ["1501293400", "0739342754", "148059444X", "150128939X", "1501289551", "1480594407", "1469251922", "1455814504", "1501289527", "1501289373"];

  } else if (arrayNumber === "33") {

    getItemsRequest["ItemIds"] = ["0765316951", "1480594261", "1501289578", "0544916085", "1511382996", "1501289543", "1480594288", "B002A77UUO", "148059430X", "1480594326"];

  } else if (arrayNumber === "34") {

    getItemsRequest["ItemIds"] = ["1501289411", "1455814415", "145581475X", "1455814598", "145581444X", "057513206X", "1501289586", "150128942X", "150128004X", "073932392X"];

  } else if (arrayNumber === "35") {

    getItemsRequest["ItemIds"] = ["1501289489", "1501289497", "1455840394", "1501289462", "1455814555", "1480594466", "1455840300", "1501289470", "1501289500", "1501289519"];

  } else if (arrayNumber === "36") {

    getItemsRequest["ItemIds"] = ["150128956X", "B01GI5EYFC", "153063265X", "0803218605", "1411633490", "B01GZBFVR4", "0934558310", "0816666660", "B0054X4ALI", "0415962420"];

  } else if (arrayNumber === "37") {

    getItemsRequest["ItemIds"] = ["0415887771", "B001OFK1PE", "B000003GI2", "B01BU13W6G", "0313292957", "B000QXDBG6", "0853236283", "1442110279", "B00BAH7Y56", "B005LXC91Y"];

  } else if (arrayNumber === "38") {

    getItemsRequest["ItemIds"] = ["1508741492", "1430324376", "0761826734", "0810862123", "B0025VK8AY", "B00MNEDT5O", "B083G6CVZB", "1461142695", "B004YTMQ32", "B07M8XVB6G"];

  } else if (arrayNumber === "39") {

    getItemsRequest["ItemIds"] = ["0786448830", "B004Z0UN44", "1137414588", "B08BT6DBKT", "B085HC97WQ", "B075WXGWHL", "B08CCGTJ92", "160964350X", "0812694716", "0231161735"];

  } else if (arrayNumber === "40") {

    getItemsRequest["ItemIds"] = ["B008O7CVZ8", "1138625302", "B07T3FZPH6", "1904764312", "0415485851", "B00XCKX0JI", "1903663792", "1861713568", "B0088UU30G", "B0071W4T1G"];

  } else if (arrayNumber === "41") {

    getItemsRequest["ItemIds"] = ["1941071007", "1782206078", "B07CJSFX4X", "B085XNYL1M", "1350028274", "B013KW4F1Y", "1886404259", "B00K4PWS2Y", "1886404100", "B00KK33W0W"];

  } else if (arrayNumber === "42") { // ! Problem "B015XIE47S" -- 03/02/2022 MF

    getItemsRequest["ItemIds"] = ["B00FRJXO3E", "B00KN1CHG6", "1629236578", "1463896794", "1987781619", "B0197858WA", "099330608X", "B07JH58YSV", "1478101946"];

  } else if (arrayNumber === "43") {

    getItemsRequest["ItemIds"] = ["1502725681", "1795272848", "B0065J693C", "B00XI058LU", "B0154ELKBY", "B086VYW41B", "B086VXYZNH", "B086VXJWGC", "B086VX98GP", "0812699637"];

  } else if (arrayNumber === "44") {

    getItemsRequest["ItemIds"] = ["B0728D7KHY", "B089VMBBKH", "B000SW4DLM", "1531883346", "B00070FX5U", "B00QSHWYWQ", "B08HPHL4JB", "B001DUIZIA", "B001MVYUSE", "B0024OBJTG"];

  } else if (arrayNumber === "45") {

    getItemsRequest["ItemIds"] = ["B01F9RF1LQ", "B00009ZYC0", "B00A2FSXHK", "B0035WTJFW", "B074NZD92D", "B000NIF51S", "B000MS6NV0", "B072ZKW1MK", "B072ZLXV7T", "B000YKFJ66"];

  } else if (arrayNumber === "46") {

    getItemsRequest["ItemIds"] = ["B004WCTLNY", "B0055OK2T0", "B0092QITO2", "0061686360", "B0024CF0EI", "B004XQV7ZE", "0982761902", "B004R9QSJ2", "1416556966", "B01LZP68UH"];

  } else if (arrayNumber === "47") {

    getItemsRequest["ItemIds"] = ["1664453946", "0345501160", "B001E70RVK", "B00P2RP9WA", "1933846542", "B018JOI6WW", "1587150751", "B083G6MMGN", "B08HNGRYMK", "B01BGXXBAA"];

  } else if (arrayNumber === "48") {

    getItemsRequest["ItemIds"] = ["B007VB69SS", "B01BGXXBHI", "B071WRJ1VB", "B072QLMDPX", "B002SGYPS2", "1861715242", "1861714254", "0990573370", "B01M0R96OL", "B07ZHNRRGS"];

  } else if (arrayNumber === "49") {

    getItemsRequest["ItemIds"] = ["B08QRKV8GW", "B09422NMGD", "B08R1DD383", "1629638838"];

  } else if (arrayNumber === "50") {

    getItemsRequest["ItemIds"] = ["0990573370"];

  } else if (arrayNumber === "51") {

    getItemsRequest["ItemIds"] = ["B01M0R96OL"];

  } else if (arrayNumber === "52") {

    getItemsRequest["ItemIds"] = ["B07ZHNRRGS"];

  } else if (arrayNumber === "53") {

    getItemsRequest["ItemIds"] = ["B08QRKV8GW"];

  } else if (arrayNumber === "54") {

    getItemsRequest["ItemIds"] = ["B09422NMGD"];

  } else if (arrayNumber === "55") {

    getItemsRequest["ItemIds"] = ["B08R1DD383"];

  } else if (arrayNumber === "56") {

    getItemsRequest["ItemIds"] = ["1629638838"];

  } else if (arrayNumber === "57") {

    getItemsRequest["ItemIds"] = ["0765316919"];

  } else if (arrayNumber === "58") {

    getItemsRequest["ItemIds"] = ["076531696X"];

  } else if (arrayNumber === "59") {

    getItemsRequest["ItemIds"] = ["057513271X"];

  };

  getItemsRequest["Condition"] = "New";

  /**
   * Choose resources you want from GetItemsResource enum
   * For more details, refer: https://webservices.amazon.com/paapi5/documentation/get-items.html#resources-parameter
   */
  //  getItemsRequest["Resources"] = ["Images.Primary.Medium", "ItemInfo.Title", "Offers.Listings.Price"];
  // * Most recent values used. -- 03/05/2022 MF
  getItemsRequest["Resources"] = ["ItemInfo.Title", "Images.Primary.Large", "ItemInfo.ByLineInfo", "ItemInfo.Classifications", "ItemInfo.ContentInfo"];
  // getItemsRequest["Resources"] = ["Images.Primary.Large", "Images.Primary.Medium", "Images.Primary.Small", "ItemInfo.Title", "ParentASIN", "ItemInfo.ByLineInfo", "ItemInfo.Classifications", "ItemInfo.ContentInfo", "ItemInfo.ContentRating", "ItemInfo.ExternalIds", "ItemInfo.Features", "ItemInfo.ManufactureInfo", "ItemInfo.ProductInfo", "ItemInfo.TechnicalInfo"];
  // * All Resources -- 01/01/2022 MF
  // getItemsRequest["Resources"] = ["BrowseNodeInfo.BrowseNodes", "BrowseNodeInfo.BrowseNodes.Ancestor", "BrowseNodeInfo.BrowseNodes.SalesRank", "BrowseNodeInfo.WebsiteSalesRank", "Images.Primary.Small", "Images.Primary.Medium", "Images.Primary.Large", "Images.Variants.Small", "Images.Variants.Medium", "Images.Variants.Large", "ItemInfo.ByLineInfo", "ItemInfo.Classifications", "ItemInfo.ContentInfo", "ItemInfo.ContentRating", "ItemInfo.ExternalIds", "ItemInfo.Features", "ItemInfo.ManufactureInfo", "ItemInfo.ProductInfo", "ItemInfo.TechnicalInfo", "ItemInfo.Title", "ItemInfo.TradeInInfo", "Offers.Listings.Availability.MaxOrderQuantity", "Offers.Listings.Availability.Message", "Offers.Listings.Availability.MinOrderQuantity", "Offers.Listings.Availability.Type", "Offers.Listings.Condition", "Offers.Listings.Condition.ConditionNote", "Offers.Listings.Condition.SubCondition", "Offers.Listings.DeliveryInfo.IsAmazonFulfilled", "Offers.Listings.DeliveryInfo.IsFreeShippingEligible", "Offers.Listings.DeliveryInfo.IsPrimeEligible", "Offers.Listings.IsBuyBoxWinner", "Offers.Listings.LoyaltyPoints.Points", "Offers.Listings.MerchantInfo", "Offers.Listings.Price", "Offers.Listings.ProgramEligibility.IsPrimeExclusive", "Offers.Listings.ProgramEligibility.IsPrimePantry", "Offers.Listings.Promotions", "Offers.Listings.SavingBasis", "Offers.Summaries.HighestPrice", "Offers.Summaries.LowestPrice", "Offers.Summaries.OfferCount", "ParentASIN", "SearchRefinements"];
  // * All Resources from Amazon Scratchpad -- 03/05/2022 MF
  // getItemsRequest["Resources"] = ["BrowseNodeInfo.BrowseNodes", "BrowseNodeInfo.BrowseNodes.Ancestor", "BrowseNodeInfo.BrowseNodes.SalesRank", "BrowseNodeInfo.WebsiteSalesRank", "CustomerReviews.Count", "CustomerReviews.StarRating", "Images.Primary.Small", "Images.Primary.Medium", "Images.Primary.Large", "Images.Variants.Small", "Images.Variants.Medium", "Images.Variants.Large", "ItemInfo.ByLineInfo", "ItemInfo.ContentInfo", "ItemInfo.ContentRating", "ItemInfo.Classifications", "ItemInfo.ExternalIds", "ItemInfo.Features", "ItemInfo.ManufactureInfo", "ItemInfo.ProductInfo", "ItemInfo.TechnicalInfo", "ItemInfo.Title", "ItemInfo.TradeInInfo", "Offers.Listings.Availability.MaxOrderQuantity", "Offers.Listings.Availability.Message", "Offers.Listings.Availability.MinOrderQuantity", "Offers.Listings.Availability.Type", "Offers.Listings.Condition", "Offers.Listings.Condition.ConditionNote", "Offers.Listings.Condition.SubCondition", "Offers.Listings.DeliveryInfo.IsAmazonFulfilled", "Offers.Listings.DeliveryInfo.IsFreeShippingEligible", "Offers.Listings.DeliveryInfo.IsPrimeEligible", "Offers.Listings.DeliveryInfo.ShippingCharges", "Offers.Listings.IsBuyBoxWinner", "Offers.Listings.LoyaltyPoints.Points", "Offers.Listings.MerchantInfo", "Offers.Listings.Price", "Offers.Listings.ProgramEligibility.IsPrimeExclusive", "Offers.Listings.ProgramEligibility.IsPrimePantry", "Offers.Listings.Promotions", "Offers.Listings.SavingBasis", "Offers.Summaries.HighestPrice", "Offers.Summaries.LowestPrice", "Offers.Summaries.OfferCount", "ParentASIN", "RentalOffers.Listings.Availability.MaxOrderQuantity", "RentalOffers.Listings.Availability.Message", "RentalOffers.Listings.Availability.MinOrderQuantity", "RentalOffers.Listings.Availability.Type", "RentalOffers.Listings.BasePrice", "RentalOffers.Listings.Condition", "RentalOffers.Listings.Condition.ConditionNote", "RentalOffers.Listings.Condition.SubCondition", "RentalOffers.Listings.DeliveryInfo.IsAmazonFulfilled", "RentalOffers.Listings.DeliveryInfo.IsFreeShippingEligible", "RentalOffers.Listings.DeliveryInfo.IsPrimeEligible", "RentalOffers.Listings.DeliveryInfo.ShippingCharges", "RentalOffers.Listings.MerchantInfo", "SearchRefinements"];

  /**
* Function to parse GetItemsResponse into an object with key as ASIN
*/
  function parseResponse(itemsResponseList) {

    let mappedResponse = {};

    if (isNonEmptyArray(itemsResponseList) === true) {

      for (let i in itemsResponseList) {

        if (itemsResponseList.hasOwnProperty(i) === true) {

          mappedResponse[itemsResponseList[i]["ASIN"]] = itemsResponseList[i];

        };

      };

    };

    return mappedResponse;

  };

  function onSuccess(data) {

    let getItemsResponse = ProductAdvertisingAPIv1.GetItemsResponse.constructFromObject(data);

    if (isEmpty(getItemsResponse["ItemsResult"]) === false) {

      let totalResultCount = 10; // searchItemsResponse["SearchResult"]["TotalResultCount"];
      let searchURL = "Get Item"; // searchItemsResponse["SearchResult"]["SearchURL"];
      // let searchDate = getDateTime();

      let itemArray = [];

      let response_list = parseResponse(getItemsResponse["ItemsResult"]["Items"]);

      if (isNonEmptyArray(getItemsRequest["ItemIds"]) === true) {

        for (let i in getItemsRequest["ItemIds"]) {

          if (getItemsRequest["ItemIds"].hasOwnProperty(i) === true) {

            let itemId = getItemsRequest["ItemIds"][i];

            if (itemId in response_list) {

              let item = response_list[itemId];

              if (isEmpty(item) === false) {

                // let itemObject = {};
                // let itemObject = { searchCategory: "Get Item" };
                let itemObject = { searchCategory: "Get Item", totalResultCount: totalResultCount, searchURL: searchURL, page: 0, searchIndex: "Get Item", sortBy: "Get Item", merchant: merchant, responseContent: JSON.stringify(item) };
                // let itemObject = { totalResultCount: totalResultCount, searchURL: searchURL, searchDate: searchDate };

                if (isEmpty(item["ItemInfo"]) === false && isEmpty(item["ItemInfo"]["Title"]) === false && isEmpty(item["ItemInfo"]["Title"]["DisplayValue"]) === false
                ) {

                  itemObject.titleName = item["ItemInfo"]["Title"]["DisplayValue"];

                };

                if (isEmpty(item["ItemInfo"]) === false && isEmpty(item["ItemInfo"]["ByLineInfo"]) === false && isEmpty(item["ItemInfo"]["ByLineInfo"]["Contributors"]) === false
                ) {

                  if (isNonEmptyArray(item["ItemInfo"]["ByLineInfo"]["Contributors"]) === true) {

                    for (let j = 0; j < item["ItemInfo"]["ByLineInfo"]["Contributors"].length; j++) {

                      if (j !== 0) {

                        itemObject.authorName = itemObject.authorName + "," + item["ItemInfo"]["ByLineInfo"]["Contributors"][j]["Name"];

                      } else {

                        itemObject.authorName = item["ItemInfo"]["ByLineInfo"]["Contributors"][j]["Name"];

                      };

                    };

                  };

                };

                if (isEmpty(item["ItemInfo"]) === false && isEmpty(item["ItemInfo"]["ContentInfo"]) === false && isEmpty(item["ItemInfo"]["ContentInfo"]["PublicationDate"]) === false
                ) {

                  itemObject.publicationDate = item["ItemInfo"]["ContentInfo"]["PublicationDate"]["DisplayValue"];

                };

                if (isEmpty(item["ASIN"]) === false) {

                  itemObject.ASIN = item["ASIN"];

                };

                if (isEmpty(item["DetailPageURL"]) === false) {

                  itemObject.textLinkFull = item["DetailPageURL"];

                };

                if (isEmpty(item["Images"]) === false && isEmpty(item["Images"]["Primary"]) === false && isEmpty(item["Images"]["Primary"]["Large"]) === false) {

                  itemObject.imageName = item["Images"]["Primary"]["Large"]["URL"];

                };

                itemArray.push(itemObject);

              };

            } else {

              console.log("Item not found, check errors");

            };

          };

        };

      };

      if (isEmpty(itemArray) === false) {

        db("amazonImport")
          // * .returning() is not supported by mysql and will not have any effect. -- 08/13/2021 MF
          // .returning("*")
          .insert(itemArray)
          .then((results) => {

            addLog(componentName, "get / insert", { arrayNumber: arrayNumber });

            // if (isEmpty(records) === false) {

            //   response.status(200).json({ primaryKeyID: records[0], transactionSuccess: true, errorOccurred: false, message: "Successfully added.", records: records });

            // } else {

            //   response.status(200).json({ primaryKeyID: null, transactionSuccess: false, errorOccurred: false, message: "Nothing to add." });

            // };

          })
          .catch((error) => {

            console.error(componentName, getDateTime(), "get /item/:arrayNumber error", error);

            addErrorLog(componentName, "get /item/:arrayNumber", { arrayNumber: arrayNumber }, error);
            // response.status(500).json({ transactionSuccess: false, errorOccurred: true, message: "Not successfully added." });

          });

      };

    };

    if (isEmpty(getItemsResponse["Errors"]) === false) {

      // console.error("Errors:");
      console.error(componentName, getDateTime(), "get /item/:arrayNumber", JSON.stringify({ searchCategory: "Get Item", searchIndex: "Get Item", sortBy: "Get Item" }), "Complete Error Response: " + JSON.stringify(getItemsResponse["Errors"], null, 1));

      addErrorLog(componentName, "get /item/:arrayNumber getItemsResponse[\"Errors\"]", { searchCategory: "Get Item", searchIndex: "Get Item", sortBy: "Get Item" }, getItemsResponse["Errors"]);

      // console.error("Printing 1st Error:");
      // let error_0 = getItemsResponse["Errors"][0];

      // console.error("Error Code: " + error_0["Code"]);
      // console.error("Error Message: " + error_0["Message"]);

    };

  };

  function onError(error) {

    console.log("Error calling PA-API 5.0!");
    console.log("Printing Full Error Object:\n" + JSON.stringify(error, null, 1));
    console.log("Status Code: " + error["status"]);

    if (error["response"] !== undefined && error["response"]["text"] !== undefined) {

      console.log("Error Object: " + JSON.stringify(error["response"]["text"], null, 1));

    };

  };

  api.getItems(getItemsRequest).then(

    function (data) {

      onSuccess(data);

    },

    function (error) {

      onError(error);

    }

  );

  response.status(200).json({ transactionSuccess: true, errorOccurred: false, message: "Successfully retrieved records." });

});


/******************************
 ***** Get Amazon SDK *********
 ******************************/
router.get("/:searchItem/:searchIndex/:sort/:merchant", (request, response) => {

  let searchItem = isEmpty(request.params.searchItem) === false ? request.params.searchItem : "";

  let searchIndex = isEmpty(request.params.searchIndex) === false ? request.params.searchIndex : "";

  let sort = isEmpty(request.params.sort) === false ? request.params.sort : "";

  let merchant = isEmpty(request.params.merchant) === false ? request.params.merchant : "";

  let searchCategory = "";
  let searchAuthor = "";
  let searchKeywords = "";
  // let searchIndex = "";
  let sortBy = "";

  if (searchItem === "authorPhilipKDick") {

    searchCategory = "Author Philip K. Dick";
    searchAuthor = "Philip K. Dick";
    // searchAuthor = "Philip Dick";

  } else if (searchItem === "keywordsPhilipDick") {

    searchCategory = "Keywords Philip Dick";
    searchKeywords = "Philip Dick";

  } else if (searchItem === "keywordsBladeRunner") {

    searchCategory = "Keywords Blade Runner";
    searchKeywords = "Blade Runner";

  };

  if (isEmpty(searchIndex) === true) {

    searchIndex = "All";

  };

  // searchIndex = "All";
  // searchIndex = "AmazonVideo";
  // searchIndex = "Books";
  // searchIndex = "Collectibles";
  // searchIndex = "DigitalMusic";
  // searchIndex = "DigitalEducationalResources";
  // searchIndex = "KindleStore";
  // searchIndex = "MobileApps";
  // searchIndex = "MoviesAndTV";
  // searchIndex = "Music";
  // searchIndex = "ToysAndGames";
  // searchIndex = "VHS";
  // searchIndex = "VideoGames";

  // let searchIndexAmazonVideo = false;
  // let searchIndexBooks = true;
  // let searchIndexCollectibles = true;
  // let searchIndexDigitalMusic = false;
  // let searchIndexDigitalEducationalResources = false;
  // let searchIndexKindleStore = true;
  // let searchIndexMobileApps = false;
  // let searchIndexMoviesAndTV = false;
  // let searchIndexMusic = false;
  // let searchIndexToysAndGames = false;
  // let searchIndexVHS = false;
  // let searchIndexVideoGames = false;

  if (sort === "AvgCustomerReviews") {

    sortBy = "AvgCustomerReviews";

  } else if (sort === "Featured") {

    sortBy = "Featured";

  } else if (sort === "NewestArrivals") {

    sortBy = "NewestArrivals";

  } else if (sort === "PriceHighToLow") {

    sortBy = "Price:HighToLow";

  } else if (sort === "PriceLowToHigh") {

    sortBy = "Price:LowToHigh";

  } else if (sort === "Relevance") {

    sortBy = "Relevance";

  };

  // merchant = "All";
  // merchant = "Amazon";

  if (isEmpty(merchant) === true) {

    merchant = "Amazon";

  };

  const numberOfResultsPages = 11;
  // const numberOfResultsPages = 2;

  // let waitTime = 10000; // * 10 seconds -- 01/09/2022 MF
  // let waitTime = 20000; // * 20 seconds -- 01/09/2022 MF
  let waitTime = 30000; // * 30 seconds -- 01/09/2022 MF
  // let waitTime = 60000; // * 1 minutes -- 01/09/2022 MF
  // let waitTime = 180000; // * 3 minutes -- 01/09/2022 MF
  // let waitTime = 300000; // * 5 minutes -- 01/09/2022 MF


  let defaultClient = ProductAdvertisingAPIv1.ApiClient.instance;

  // Specify your credentials here. These are used to create and sign the request.
  defaultClient.accessKey = credentials.accessKey;
  defaultClient.secretKey = credentials.secretKey;

  /**
   * PAAPI Host and Region to which you want to send request.
   * For more details refer: https://webservices.amazon.com/paapi5/documentation/common-request-parameters.html#host-and-region
   */
  defaultClient.host = credentials.host;
  defaultClient.region = credentials.region;

  let api = new ProductAdvertisingAPIv1.DefaultApi();

  // Request Initialization

  let searchItemsRequest = new ProductAdvertisingAPIv1.SearchItemsRequest();

  /** Enter your partner tag (store/tracking id) and partner type */
  searchItemsRequest["PartnerTag"] = credentials.PartnerTag;
  searchItemsRequest["PartnerType"] = credentials.PartnerType;

  searchItemsRequest["Merchant"] = merchant;

  /** Specify Keywords */
  if (isEmpty(searchKeywords) === false) {

    searchItemsRequest["Keywords"] = searchKeywords;

  } else if (isEmpty(searchAuthor) === false) {

    searchItemsRequest["Author"] = searchAuthor;

  };

  /**
   * Specify the category in which search request is to be made
   * For more details, refer: https://webservices.amazon.com/paapi5/documentation/use-cases/organization-of-items-on-amazon/search-index.html
   */
  // searchItemsRequest["SearchIndex"] = "Books";
  if (isEmpty(searchIndex) === false) {

    searchItemsRequest["SearchIndex"] = searchIndex;

  };

  if (isEmpty(sortBy) === false) {

    searchItemsRequest["SortBy"] = sortBy;

  };

  /** Specify item count to be returned in search result */
  // searchItemsRequest["ItemPage"] = 1;
  // searchItemsRequest["ItemCount"] = 5;
  searchItemsRequest["ItemCount"] = 10;

  /**
   * Choose resources you want from SearchItemsResource enum
   * For more details, refer: https://webservices.amazon.com/paapi5/documentation/search-items.html#resources-parameter
   */
  //  searchItemsRequest["Resources"] = ["Images.Primary.Medium", "ItemInfo.Title", "Offers.Listings.Price"];
  // * Most recent values used. -- 03/05/2022 MF
  searchItemsRequest["Resources"] = ["ItemInfo.Title", "Images.Primary.Large", "ItemInfo.ByLineInfo", "ItemInfo.Classifications", "ItemInfo.ContentInfo"];
  // searchItemsRequest["Resources"] = ["Images.Primary.Large", "Images.Primary.Medium", "Images.Primary.Small", "ItemInfo.Title", "ParentASIN", "ItemInfo.ByLineInfo", "ItemInfo.Classifications", "ItemInfo.ContentInfo", "ItemInfo.ContentRating", "ItemInfo.ExternalIds", "ItemInfo.Features", "ItemInfo.ManufactureInfo", "ItemInfo.ProductInfo", "ItemInfo.TechnicalInfo"];
  // * All Resources -- 01/01/2022 MF
  // searchItemsRequest["Resources"] = ["BrowseNodeInfo.BrowseNodes", "BrowseNodeInfo.BrowseNodes.Ancestor", "BrowseNodeInfo.BrowseNodes.SalesRank", "BrowseNodeInfo.WebsiteSalesRank", "Images.Primary.Small", "Images.Primary.Medium", "Images.Primary.Large", "Images.Variants.Small", "Images.Variants.Medium", "Images.Variants.Large", "ItemInfo.ByLineInfo", "ItemInfo.Classifications", "ItemInfo.ContentInfo", "ItemInfo.ContentRating", "ItemInfo.ExternalIds", "ItemInfo.Features", "ItemInfo.ManufactureInfo", "ItemInfo.ProductInfo", "ItemInfo.TechnicalInfo", "ItemInfo.Title", "ItemInfo.TradeInInfo", "Offers.Listings.Availability.MaxOrderQuantity", "Offers.Listings.Availability.Message", "Offers.Listings.Availability.MinOrderQuantity", "Offers.Listings.Availability.Type", "Offers.Listings.Condition", "Offers.Listings.Condition.ConditionNote", "Offers.Listings.Condition.SubCondition", "Offers.Listings.DeliveryInfo.IsAmazonFulfilled", "Offers.Listings.DeliveryInfo.IsFreeShippingEligible", "Offers.Listings.DeliveryInfo.IsPrimeEligible", "Offers.Listings.IsBuyBoxWinner", "Offers.Listings.LoyaltyPoints.Points", "Offers.Listings.MerchantInfo", "Offers.Listings.Price", "Offers.Listings.ProgramEligibility.IsPrimeExclusive", "Offers.Listings.ProgramEligibility.IsPrimePantry", "Offers.Listings.Promotions", "Offers.Listings.SavingBasis", "Offers.Summaries.HighestPrice", "Offers.Summaries.LowestPrice", "Offers.Summaries.OfferCount", "ParentASIN", "SearchRefinements"];
  // * All Resources from Amazon Scratchpad -- 03/05/2022 MF
  // searchItemsRequest["Resources"] = ["BrowseNodeInfo.BrowseNodes", "BrowseNodeInfo.BrowseNodes.Ancestor", "BrowseNodeInfo.BrowseNodes.SalesRank", "BrowseNodeInfo.WebsiteSalesRank", "CustomerReviews.Count", "CustomerReviews.StarRating", "Images.Primary.Small", "Images.Primary.Medium", "Images.Primary.Large", "Images.Variants.Small", "Images.Variants.Medium", "Images.Variants.Large", "ItemInfo.ByLineInfo", "ItemInfo.ContentInfo", "ItemInfo.ContentRating", "ItemInfo.Classifications", "ItemInfo.ExternalIds", "ItemInfo.Features", "ItemInfo.ManufactureInfo", "ItemInfo.ProductInfo", "ItemInfo.TechnicalInfo", "ItemInfo.Title", "ItemInfo.TradeInInfo", "Offers.Listings.Availability.MaxOrderQuantity", "Offers.Listings.Availability.Message", "Offers.Listings.Availability.MinOrderQuantity", "Offers.Listings.Availability.Type", "Offers.Listings.Condition", "Offers.Listings.Condition.ConditionNote", "Offers.Listings.Condition.SubCondition", "Offers.Listings.DeliveryInfo.IsAmazonFulfilled", "Offers.Listings.DeliveryInfo.IsFreeShippingEligible", "Offers.Listings.DeliveryInfo.IsPrimeEligible", "Offers.Listings.DeliveryInfo.ShippingCharges", "Offers.Listings.IsBuyBoxWinner", "Offers.Listings.LoyaltyPoints.Points", "Offers.Listings.MerchantInfo", "Offers.Listings.Price", "Offers.Listings.ProgramEligibility.IsPrimeExclusive", "Offers.Listings.ProgramEligibility.IsPrimePantry", "Offers.Listings.Promotions", "Offers.Listings.SavingBasis", "Offers.Summaries.HighestPrice", "Offers.Summaries.LowestPrice", "Offers.Summaries.OfferCount", "ParentASIN", "RentalOffers.Listings.Availability.MaxOrderQuantity", "RentalOffers.Listings.Availability.Message", "RentalOffers.Listings.Availability.MinOrderQuantity", "RentalOffers.Listings.Availability.Type", "RentalOffers.Listings.BasePrice", "RentalOffers.Listings.Condition", "RentalOffers.Listings.Condition.ConditionNote", "RentalOffers.Listings.Condition.SubCondition", "RentalOffers.Listings.DeliveryInfo.IsAmazonFulfilled", "RentalOffers.Listings.DeliveryInfo.IsFreeShippingEligible", "RentalOffers.Listings.DeliveryInfo.IsPrimeEligible", "RentalOffers.Listings.DeliveryInfo.ShippingCharges", "RentalOffers.Listings.MerchantInfo", "SearchRefinements"];

  function onSuccess(data, page, searchCategory, searchIndex, sortBy) {

    let displayFilteredResults = true;

    if (process.env.NODE_ENV === "development") {

      console.log(componentName, getDateTime(), "API called successfully.");

    };

    let searchItemsResponse = ProductAdvertisingAPIv1.SearchItemsResponse.constructFromObject(data);

    if (displayFilteredResults === false) {

      if (process.env.NODE_ENV === "development") {

        console.log(componentName, getDateTime(), "Complete Response: \n" + JSON.stringify(searchItemsResponse, null, 1));
        console.log(componentName, getDateTime(), JSON.stringify(searchItemsResponse, null, 1));
        console.log(componentName, getDateTime(), "get /:searchItem/:searchIndex/:sort/:merchant", JSON.stringify(searchItemsResponse, null, 1));

      };

    } else {

      if (isEmpty(searchItemsResponse["SearchResult"]) === false) {

        if (process.env.NODE_ENV === "development") {

          console.log(componentName, getDateTime(), "get /:searchItem/:searchIndex/:sort/:merchant", JSON.stringify(searchItemsResponse, null, 1));

        };

        let totalResultCount = searchItemsResponse["SearchResult"]["TotalResultCount"];
        let searchURL = searchItemsResponse["SearchResult"]["SearchURL"];
        // let searchDate = getDateTime();

        let itemArray = [];

        if (isEmpty(searchItemsResponse["SearchResult"]["Items"]) === false) {

          if (isNonEmptyArray(searchItemsResponse["SearchResult"]["Items"]) === true) {

            for (let i = 0; i < searchItemsResponse["SearchResult"]["Items"].length; i++) {

              let item_0 = searchItemsResponse["SearchResult"]["Items"][i];

              // let itemObject = {};
              // let itemObject = { searchCategory: searchCategory };
              let itemObject = { searchCategory: searchCategory, totalResultCount: totalResultCount, searchURL: searchURL, page: page, searchIndex: searchIndex, sortBy: sortBy, merchant: merchant, responseContent: JSON.stringify(item_0) };
              // let itemObject = { totalResultCount: totalResultCount, searchURL: searchURL, searchDate: searchDate };

              if (isEmpty(item_0) === false) {

                if (isEmpty(item_0["ItemInfo"]) === false && isEmpty(item_0["ItemInfo"]["Title"]) === false && isEmpty(item_0["ItemInfo"]["Title"]["DisplayValue"]) === false
                ) {

                  itemObject.titleName = item_0["ItemInfo"]["Title"]["DisplayValue"];

                };

                if (isEmpty(item_0["ItemInfo"]) === false && isEmpty(item_0["ItemInfo"]["ByLineInfo"]) === false && isEmpty(item_0["ItemInfo"]["ByLineInfo"]["Contributors"]) === false
                ) {

                  if (isNonEmptyArray(item_0["ItemInfo"]["ByLineInfo"]["Contributors"]) === true) {

                    for (let j = 0; j < item_0["ItemInfo"]["ByLineInfo"]["Contributors"].length; j++) {

                      if (j !== 0) {

                        itemObject.authorName = itemObject.authorName + "," + item_0["ItemInfo"]["ByLineInfo"]["Contributors"][j]["Name"];

                      } else {

                        itemObject.authorName = item_0["ItemInfo"]["ByLineInfo"]["Contributors"][j]["Name"];

                      };

                    };

                  };

                };

                if (isEmpty(item_0["ItemInfo"]) === false && isEmpty(item_0["ItemInfo"]["ContentInfo"]) === false && isEmpty(item_0["ItemInfo"]["ContentInfo"]["PublicationDate"]) === false
                ) {

                  itemObject.publicationDate = item_0["ItemInfo"]["ContentInfo"]["PublicationDate"]["DisplayValue"];

                };

                if (isEmpty(item_0["ASIN"]) === false) {

                  itemObject.ASIN = item_0["ASIN"];

                };

                if (isEmpty(item_0["DetailPageURL"]) === false) {

                  itemObject.textLinkFull = item_0["DetailPageURL"];

                };

                if (isEmpty(item_0["Images"]) === false && isEmpty(item_0["Images"]["Primary"]) === false && isEmpty(item_0["Images"]["Primary"]["Large"]) === false) {

                  itemObject.imageName = item_0["Images"]["Primary"]["Large"]["URL"];

                };

                itemArray.push(itemObject);

              };

            };

          };

        };

        if (isEmpty(itemArray) === false) {

          db("amazonImport")
            // * .returning() is not supported by mysql and will not have any effect. -- 08/13/2021 MF
            // .returning("*")
            .insert(itemArray)
            .then((results) => {

              addLog(componentName, "get /:searchItem/:searchIndex/:sort/:merchant", { searchItem: request.params.searchItem, searchIndex: request.params.searchIndex, sort: request.params.sort, merchant: request.params.merchant, searchCategory: searchCategory, searchIndex: searchIndex, sortBy: sortBy });

              // if (isEmpty(records) === false) {

              //   response.status(200).json({ primaryKeyID: records[0], transactionSuccess: true, errorOccurred: false, message: "Successfully added.", records: records });

              // } else {

              //   response.status(200).json({ primaryKeyID: null, transactionSuccess: false, errorOccurred: false, message: "Nothing to add." });

              // };

            })
            .catch((error) => {

              console.error(componentName, getDateTime(), "get /:searchItem/:searchIndex/:sort/:merchant error", error);

              addErrorLog(componentName, "get /:searchItem/:searchIndex/:sort/:merchant", { searchItem: request.params.searchItem, searchIndex: request.params.searchIndex, sort: request.params.sort, merchant: request.params.merchant, searchCategory: searchCategory, searchIndex: searchIndex, sortBy: sortBy }, error);
              // response.status(500).json({ transactionSuccess: false, errorOccurred: true, message: "Not successfully added." });

            });

        };

      };

    };

    if (isEmpty(searchItemsResponse["Errors"]) === false) {

      // console.error("Errors:");
      console.error(componentName, getDateTime(), "get /:searchItem/:searchIndex/:sort/:merchant", JSON.stringify({ searchCategory: searchCategory, searchIndex: searchIndex, sortBy: sortBy }), "Complete Error Response: " + JSON.stringify(searchItemsResponse["Errors"], null, 1));

      addErrorLog(componentName, "get /:searchItem/:searchIndex/:sort/:merchant searchItemsResponse[\"Errors\"]", { searchItem: request.params.searchItem, searchIndex: request.params.searchIndex, sort: request.params.sort, merchant: request.params.merchant, searchCategory: searchCategory, searchIndex: searchIndex, sortBy: sortBy }, searchItemsResponse["Errors"]);

      // console.error("Printing 1st Error:");
      // let error_0 = searchItemsResponse["Errors"][0];

      // console.error("Error Code: " + error_0["Code"]);
      // console.error("Error Message: " + error_0["Message"]);

    };

  };

  // * https://stackoverflow.com/questions/3583724/how-do-i-add-a-delay-in-a-javascript-loop -- 01/02/2022 MF
  // * Returns a Promise that resolves after "ms" Milliseconds. -- 01/02/2022
  const timer = milliseconds => new Promise(response => setTimeout(response, milliseconds));

  // * We need to wrap the loop into an async function for this to work. -- 01/02/2022
  async function load() {

    if (isEmpty(numberOfResultsPages) === false) {

      for (let i = 1; i < numberOfResultsPages; i++) {

        searchItemsRequest["ItemPage"] = i;

        if (process.env.NODE_ENV === "development") {

          console.log(componentName, getDateTime(), "get /:searchItem/:searchIndex/:sort/:merchant", "Calling page " + i + " results.");

        };

        addLog(componentName, "get /:searchItem/:searchIndex/:sort/:merchant", { searchItem: request.params.searchItem, searchIndex: request.params.searchIndex, sort: request.params.sort, merchant: request.params.merchant, page: i, searchCategory: searchCategory, searchIndex: searchIndex, sortBy: sortBy });

        api.searchItems(searchItemsRequest).then(

          function (data) {

            if (process.env.NODE_ENV === "development") {

              console.log(componentName, getDateTime(), "get /:searchItem/:searchIndex/:sort/:merchant", JSON.stringify(data));

            };

            onSuccess(data, i, searchCategory, searchIndex, sortBy);

            addLog(componentName, "get /:searchItem/:searchIndex/:sort/:merchant data", { searchItem: request.params.searchItem, searchIndex: request.params.searchIndex, sort: request.params.sort, merchant: request.params.merchant, page: i, searchCategory: searchCategory, searchIndex: searchIndex, sortBy: sortBy, data: data });

          },
          function (error) {

            console.error(componentName, getDateTime(), "get /:searchItem/:searchIndex/:sort/:merchant", JSON.stringify({ page: i, searchCategory: searchCategory, searchIndex: searchIndex, sortBy: sortBy }), "Printing Full Error Object:\n" + JSON.stringify(error, null, 1));

            addErrorLog(componentName, "get /:searchItem/:searchIndex/:sort/:merchant error", { searchItem: request.params.searchItem, searchIndex: request.params.searchIndex, sort: request.params.sort, merchant: request.params.merchant, page: i, searchCategory: searchCategory, searchIndex: searchIndex, sortBy: sortBy }, error);

          }

        );

        // * Then the created Promise can be awaited. -- 01/02/2022
        await timer(waitTime);

      };

    };

  };

  load();

  response.status(200).json({ transactionSuccess: true, errorOccurred: false, message: "Successfully retrieved records." });

});


/******************************
 ***** Insert Amazon SDK *********
 ******************************/
router.get("/insert", (request, response) => {

  let sqlQuery = "INSERT INTO amazon (ASIN, titleName, authorName, publicationDate, imageName, textLinkFull, merchant) SELECT DISTINCT ASIN, titleName, authorName, publicationDate, imageName, textLinkFull, merchant FROM amazonImport WHERE ASIN NOT IN (SELECT ASIN FROM amazon) AND ASIN NOT IN (SELECT ASIN FROM editions)";

  // db.raw(sqlQuery).toSQL();

  // db.select(select)
  //   .from(tableName)
  //   // .limit(limit)
  //   // .where(activeWhere)
  //   .where(viewedWhere)
  //   // .where(authorWhere)
  //   .orderBy(orderBy)
  db.raw(sqlQuery)
    .then((results) => {

      // records = convertBitTrueFalse(results);
      records = results;

      if (isEmpty(records) === false) {

        response.status(200).json({ transactionSuccess: true, errorOccurred: false, message: "Successfully retrieved records.", records: records });

      } else {

        response.status(200).json({ transactionSuccess: false, errorOccurred: false, message: "No records found." });

      };

    })
    .catch((error) => {

      console.error(componentName, getDateTime(), "get /insert error", error);

      addErrorLog(componentName, "get /insert", {}, error);
      response.status(500).json({ transactionSuccess: false, errorOccurred: true, message: "No records found." });

    });

});


/******************************
 ***** Update Amazon SDK *********
 ******************************/
router.get("/update", (request, response) => {

  let sqlQuery = "UPDATE amazon SET merchant = 'Amazon' WHERE ASIN IN (SELECT ASIN FROM amazonImport WHERE merchant = 'Amazon')";

  // db.raw(sqlQuery).toSQL();

  let sqlQueryElectronicMedia = "UPDATE amazon SET merchant = 'Amazon' WHERE ASIN IN (SELECT ASIN FROM amazonImport WHERE searchIndex IN ('KindleStore', 'AmazonVideo', 'DigitalMusic', 'MobileApps'))";

  // db.raw(sqlQueryElectronicMedia).toSQL();

  db.raw(sqlQuery)
    .then((results) => {

      addLog(componentName, "get /update sqlQuery", {});

      return db.raw(sqlQueryElectronicMedia);

    })
    .then((results) => {

      // records = convertBitTrueFalse(results);
      records = results;

      addLog(componentName, "get /update sqlQueryElectronicMedia", {});

      response.status(200).json({ transactionSuccess: true, errorOccurred: false, message: `Successfully updated ${tableName}.`, records: records });

    })
    .catch((error) => {

      console.error(componentName, getDateTime(), "get /update error", error);

      addErrorLog(componentName, "get /update", {}, error);
      response.status(500).json({ transactionSuccess: false, errorOccurred: true, message: "Not successfully updated." });

    });

});


/***************************
 ******* Active/Inactive Item *******
 ***************************/
router.put("/active/:ASIN", validateAdmin, (request, response) => {

  const recordObject = {
    active: request.body.recordObject.active
  };

  // * Check the parameters for SQL injection before creating the SQL statement. -- 08/09/2021 MF

  let ASIN = isEmpty(request.params.ASIN) === false ? request.params.ASIN : "";

  const where = { ASIN: ASIN };

  db(tableName)
    .where(where)
    // * .returning() is not supported by mysql and will not have any effect. -- 08/13/2021 MF
    // .returning(select)
    .update(recordObject)
    .then((results) => {

      // records = convertBitTrueFalse(results);
      records = results;

      if (isEmpty(records) === false) {

        response.status(200).json({ primaryKeyID: request.params.ASIN, transactionSuccess: true, errorOccurred: false, message: "Successfully updated.", records: records });

      } else {

        response.status(200).json({ primaryKeyID: request.params.ASIN, transactionSuccess: false, errorOccurred: false, message: "Nothing to update." });

      };

    })
    .catch((error) => {

      console.error(componentName, getDateTime(), `put /active/:ASIN error`, error);

      addErrorLog(componentName, "put /active/:ASIN", { ASIN: request.params.ASIN, recordObject: request.body.recordObject }, error);
      response.status(500).json({ transactionSuccess: false, errorOccurred: true, message: "Not successfully updated." });

    });

});


/***************************
 ******* Viewed Item *******
 ***************************/
router.put("/viewed/:ASIN", validateAdmin, (request, response) => {

  const recordObject = {
    viewed: request.body.recordObject.viewed
  };

  // * Check the parameters for SQL injection before creating the SQL statement. -- 08/09/2021 MF

  let ASIN = isEmpty(request.params.ASIN) === false ? request.params.ASIN : "";

  const where = { ASIN: ASIN };

  db(tableName)
    .where(where)
    // * .returning() is not supported by mysql and will not have any effect. -- 08/13/2021 MF
    // .returning(select)
    .update(recordObject)
    .then((results) => {

      // records = convertBitTrueFalse(results);
      records = results;

      if (isEmpty(records) === false) {

        response.status(200).json({ primaryKeyID: request.params.ASIN, transactionSuccess: true, errorOccurred: false, message: "Successfully updated.", records: records });

      } else {

        response.status(200).json({ primaryKeyID: request.params.ASIN, transactionSuccess: false, errorOccurred: false, message: "Nothing to update." });

      };

    })
    .catch((error) => {

      console.error(componentName, getDateTime(), `put /viewed/:ASIN error`, error);

      addErrorLog(componentName, "put /viewed/:ASIN", { ASIN: request.params.ASIN, recordObject: request.body.recordObject }, error);
      response.status(500).json({ transactionSuccess: false, errorOccurred: true, message: "Not successfully updated." });

    });

});



module.exports = router;