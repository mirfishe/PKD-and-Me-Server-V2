"use strict";

const router = require("express").Router();
// const axios = require("axios");
const databaseConfig = require("../database");
const db = require("knex")(databaseConfig.config);
// const validateSession = require("../middleware/validate-session");
const validateAdmin = require("../middleware/validate-admin");
const { isEmpty, getDateTime, formatTrim } = require("../utilities/sharedFunctions");
const { convertBitTrueFalse } = require("../utilities/applicationFunctions");
const addLog = require("../utilities/addLog");
const addErrorLog = require("../utilities/addErrorLog");

const controllerName = "amazon";
const tableName = "amazon";
const select = "*";
// const limit = 20;
const activeWhere = { "active": true };
const viewedWhere = { "viewed": false };
// const authorWhere = { "authorName": "Dick, Philip K." };
const orderBy = [{ column: "authorName", order: "asc" }, { column: "titleName", order: "asc" }];

// const Parser = require("rss-parser");

const ProductAdvertisingAPIv1 = require("../amazon/index");

const credentials = require("../amazon");

let records;

// INSERT INTO amazon (ASIN, titleName, authorName, publicationDate, imageName, textLinkFull)
// SELECT DISTINCT ASIN, titleName, authorName, publicationDate, imageName, textLinkFull FROM amazonImport
// WHERE ASIN NOT IN (SELECT ASIN FROM amazon)


/******************************
 ***** Get *********
 ******************************/
router.get("/", (request, response) => {

  let sqlQuery = `SELECT * FROM amazon INNER JOIN (SELECT ASIN, GROUP_CONCAT(searchIndex) AS searchIndex FROM (SELECT DISTINCT ASIN, searchIndex FROM amazonImport WHERE searchIndex IS NOT NULL ORDER BY searchIndex) AS searchIndexDistinct GROUP BY ASIN) AS amazonSearchIndex ON amazon.ASIN = amazonSearchIndex.ASIN WHERE viewed = 0`;

  // db.raw(sqlQuery).toSQL();

  // console.log(`${controllerName}-controller`, getDateTime(), `get /:${controllerName}ID ${tableName}`, sqlQuery);

  // db.select(select)
  //   .from(tableName)
  //   // .limit(limit)
  //   // .where(activeWhere)
  //   .where(viewedWhere)
  //   // .where(authorWhere)
  //   .orderBy(orderBy)
  db.raw(sqlQuery)
    .then((records) => {
      // console.log(`${controllerName}-controller`, getDateTime(), "", getDateTime(), `get /${tableName}`, records);

      records = convertBitTrueFalse(records);

      if (isEmpty(records) === false) {
        // console.log(`${controllerName}-controller`, getDateTime(), "", getDateTime(), `get /${tableName}`, records);

        response.status(200).json({ transactionSuccess: true, errorOccurred: false, message: "Successfully retrieved records.", records: records });

      } else {
        // console.log(`${controllerName}-controller`, getDateTime(), "get / No Results");

        response.status(200).json({ transactionSuccess: false, errorOccurred: false, message: "No records found." });

      };

    })
    .catch((error) => {
      console.error(`${controllerName}-controller`, getDateTime(), "get / error", error);

      addErrorLog(`${controllerName}-controller`, "get /", records, error);
      response.status(500).json({ transactionSuccess: false, errorOccurred: true, message: "No records found." });

    });

});


/******************************
 ***** Get Amazon SDK *********
 ******************************/
// * Returns Amazon listings -- 12/31/2021 MF
router.get("/:searchItem/:searchIndex/:sort", (request, response) => {

  let searchItem = request.params.searchItem;
  let searchIndex = request.params.searchIndex;
  let sort = request.params.sort;
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

  // console.log(`${controllerName}-controller`, getDateTime(), `get / ${tableName}`, "searchCategory", searchCategory);
  // console.log(`${controllerName}-controller`, getDateTime(), `get / ${tableName}`, "searchIndex", searchIndex);
  // console.log(`${controllerName}-controller`, getDateTime(), `get / ${tableName}`, "sortBy", sortBy);

  // console.log(`${controllerName}-controller`, getDateTime(), `get / ${tableName}`, "credentials", credentials);

  // const numberOfResultsPages = 11;
  const numberOfResultsPages = 2;

  let waitTime = 10000; // * 10 seconds -- 01/09/2022 MF

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
  searchItemsRequest["ItemCount"] = 10;
  // searchItemsRequest["ItemPage"] = 1;

  /**
   * Choose resources you want from SearchItemsResource enum
   * For more details, refer: https://webservices.amazon.com/paapi5/documentation/search-items.html#resources-parameter
   */
  //  searchItemsRequest["Resources"] = ["Images.Primary.Medium", "ItemInfo.Title", "Offers.Listings.Price"];
  searchItemsRequest["Resources"] = ["ItemInfo.Title", "Images.Primary.Large", "ItemInfo.ByLineInfo", "ItemInfo.Classifications", "ItemInfo.ContentInfo"];
  // searchItemsRequest["Resources"] = ["Images.Primary.Large", "Images.Primary.Medium", "Images.Primary.Small", "ItemInfo.Title", "ParentASIN", "ItemInfo.ByLineInfo", "ItemInfo.Classifications", "ItemInfo.ContentInfo", "ItemInfo.ContentRating", "ItemInfo.ExternalIds", "ItemInfo.Features", "ItemInfo.ManufactureInfo", "ItemInfo.ProductInfo", "ItemInfo.TechnicalInfo"];
  // * All Resources -- 01/01/2022 MF
  // searchItemsRequest["Resources"] = ["BrowseNodeInfo.BrowseNodes", "BrowseNodeInfo.BrowseNodes.Ancestor", "BrowseNodeInfo.BrowseNodes.SalesRank", "BrowseNodeInfo.WebsiteSalesRank", "Images.Primary.Small", "Images.Primary.Medium", "Images.Primary.Large", "Images.Variants.Small", "Images.Variants.Medium", "Images.Variants.Large", "ItemInfo.ByLineInfo", "ItemInfo.Classifications", "ItemInfo.ContentInfo", "ItemInfo.ContentRating", "ItemInfo.ExternalIds", "ItemInfo.Features", "ItemInfo.ManufactureInfo", "ItemInfo.ProductInfo", "ItemInfo.TechnicalInfo", "ItemInfo.Title", "ItemInfo.TradeInInfo", "Offers.Listings.Availability.MaxOrderQuantity", "Offers.Listings.Availability.Message", "Offers.Listings.Availability.MinOrderQuantity", "Offers.Listings.Availability.Type", "Offers.Listings.Condition", "Offers.Listings.Condition.ConditionNote", "Offers.Listings.Condition.SubCondition", "Offers.Listings.DeliveryInfo.IsAmazonFulfilled", "Offers.Listings.DeliveryInfo.IsFreeShippingEligible", "Offers.Listings.DeliveryInfo.IsPrimeEligible", "Offers.Listings.IsBuyBoxWinner", "Offers.Listings.LoyaltyPoints.Points", "Offers.Listings.MerchantInfo", "Offers.Listings.Price", "Offers.Listings.ProgramEligibility.IsPrimeExclusive", "Offers.Listings.ProgramEligibility.IsPrimePantry", "Offers.Listings.Promotions", "Offers.Listings.SavingBasis", "Offers.Summaries.HighestPrice", "Offers.Summaries.LowestPrice", "Offers.Summaries.OfferCount", "ParentASIN", "SearchRefinements"];

  function onSuccess(data, page, searchCategory, searchIndex, sortBy) {

    let displayFilteredResults = true;

    // console.log("API called successfully.");

    let searchItemsResponse = ProductAdvertisingAPIv1.SearchItemsResponse.constructFromObject(data);

    if (displayFilteredResults === false) {

      // console.log("Complete Response: \n" + JSON.stringify(searchItemsResponse, null, 1));
      // console.log(JSON.stringify(searchItemsResponse, null, 1));
      console.log(`${controllerName}-controller`, getDateTime(), `get / ${tableName}`, JSON.stringify(searchItemsResponse, null, 1));

    } else {

      if (isEmpty(searchItemsResponse["SearchResult"]) === false) {

        // console.log(`${controllerName}-controller`, getDateTime(), `get / ${tableName}`, JSON.stringify(searchItemsResponse, null, 1));

        let totalResultCount = searchItemsResponse["SearchResult"]["TotalResultCount"];
        let searchURL = searchItemsResponse["SearchResult"]["SearchURL"];
        // let searchDate = getDateTime();

        let itemArray = [];

        if (isEmpty(searchItemsResponse["SearchResult"]["Items"]) === false) {

          for (let i = 0; i < searchItemsResponse["SearchResult"]["Items"].length; i++) {

            let item_0 = searchItemsResponse["SearchResult"]["Items"][i];

            // let itemObject = {};
            // let itemObject = { searchCategory: searchCategory };
            let itemObject = { searchCategory: searchCategory, totalResultCount: totalResultCount, searchURL: searchURL, page: page, searchIndex: searchIndex, sortBy: sortBy };
            // let itemObject = { totalResultCount: totalResultCount, searchURL: searchURL, searchDate: searchDate };

            if (isEmpty(item_0) === false) {

              // console.log(`${controllerName}-controller`, getDateTime(), `get / ${tableName}`, "######################################################");

              if (isEmpty(item_0["ItemInfo"]) === false && isEmpty(item_0["ItemInfo"]["Title"]) === false && isEmpty(item_0["ItemInfo"]["Title"]["displayValue"]) === false
              ) {

                // console.log("Title: " + item_0["ItemInfo"]["Title"]["displayValue"]);

                itemObject.titleName = item_0["ItemInfo"]["Title"]["displayValue"];

              };

              if (isEmpty(item_0["ItemInfo"]) === false && isEmpty(item_0["ItemInfo"]["ByLineInfo"]) === false && isEmpty(item_0["ItemInfo"]["ByLineInfo"]["Contributors"]) === false
              ) {

                for (let j = 0; j < item_0["ItemInfo"]["ByLineInfo"]["Contributors"].length; j++) {

                  // console.log("ByLineInfo Contributors Name: " + item_0["ItemInfo"]["ByLineInfo"]["Contributors"][j]["Name"]);
                  // console.log("ByLineInfo Contributors Role: " + item_0["ItemInfo"]["ByLineInfo"]["Contributors"][j]["Role"]);

                  if (j !== 0) {

                    itemObject.authorName = itemObject.authorName + "," + item_0["ItemInfo"]["ByLineInfo"]["Contributors"][j]["Name"];

                  } else {

                    itemObject.authorName = item_0["ItemInfo"]["ByLineInfo"]["Contributors"][j]["Name"];

                  };

                };

              };

              if (isEmpty(item_0["ItemInfo"]) === false && isEmpty(item_0["ItemInfo"]["ContentInfo"]) === false && isEmpty(item_0["ItemInfo"]["ContentInfo"]["PublicationDate"]) === false
              ) {

                // console.log("PublicationDate: " + item_0["ItemInfo"]["ContentInfo"]["PublicationDate"]["displayValue"]);

                itemObject.publicationDate = item_0["ItemInfo"]["ContentInfo"]["PublicationDate"]["displayValue"];

              };

              if (isEmpty(item_0["ASIN"]) === false) {

                // console.log("ASIN: " + item_0["ASIN"]);

                itemObject.ASIN = item_0["ASIN"];

              };

              if (isEmpty(item_0["DetailPageURL"]) === false) {

                // console.log("DetailPageURL: " + item_0["DetailPageURL"]);

                itemObject.textLinkFull = item_0["DetailPageURL"];

              };

              if (isEmpty(item_0["Images"]) === false && isEmpty(item_0["Images"]["Primary"]) === false && isEmpty(item_0["Images"]["Primary"]["Large"]) === false) {

                // console.log("Images Primary Large URL: " + item_0["Images"]["Primary"]["Large"]["URL"]);

                itemObject.imageName = item_0["Images"]["Primary"]["Large"]["URL"];

              };

              // console.log(`${controllerName}-controller`, getDateTime(), `get / ${tableName}`, "######################################################");

              itemArray.push(itemObject);

            };

          };

        };

        // console.log(`${controllerName}-controller`, getDateTime(), `get / ${tableName}`, itemArray);

        db("amazonImport")
          // * .returning() is not supported by mysql and will not have any effect. -- 08/13/2021 MF
          // .returning("*")
          .insert(itemArray)
          .then((records) => {
            // console.log(`${controllerName}-controller`, getDateTime(), "get / records", records);
            // * Returns the ID value of the added record. -- 08/13/2021 MF

            addLog(`${controllerName}-controller`, "get / insert", JSON.stringify({ records: records }));

            // if (isEmpty(records) === false) {
            //   // console.log(`${controllerName}-controller`, getDateTime(), "get / records", records);
            //   response.status(200).json({ primaryKeyID: records[0], transactionSuccess: true, errorOccurred: false, message: "Successfully added.", records: records });

            // } else {
            //   // console.log(`${controllerName}-controller`, getDateTime(), "get / No Results");

            //   response.status(200).json({ primaryKeyID: null, transactionSuccess: false, errorOccurred: false, message: "Nothing to add." });

            // };

          })
          .catch((error) => {
            console.error(`${controllerName}-controller`, getDateTime(), "get / error", error);

            addErrorLog(`${controllerName}-controller`, "get /", records, error);
            // response.status(500).json({ transactionSuccess: false, errorOccurred: true, message: "Not successfully added." });

          });

      };

    };

    if (isEmpty(searchItemsResponse["Errors"]) === false) {

      // console.error("Errors:");
      console.error(`${controllerName}-controller`, getDateTime(), `get / ${tableName}`, JSON.stringify({ searchCategory: searchCategory, searchIndex: searchIndex, sortBy: sortBy }), "Complete Error Response: " + JSON.stringify(searchItemsResponse["Errors"], null, 1));

      addErrorLog(`${controllerName}-controller`, "get / searchItemsResponse[\"Errors\"]", JSON.stringify({ searchCategory: searchCategory, searchIndex: searchIndex, sortBy: sortBy }), JSON.stringify(searchItemsResponse["Errors"], null, 1));

      // console.error("Printing 1st Error:");
      // let error_0 = searchItemsResponse["Errors"][0];

      // console.error("Error Code: " + error_0["Code"]);
      // console.error("Error Message: " + error_0["Message"]);

    };

  };


  // for (let i = 1; i < numberOfResultsPages; i++) {

  //   setTimeout(() => {

  //     searchItemsRequest["ItemPage"] = i;

  //     // console.log(`${controllerName}-controller`, getDateTime(), `get / ${tableName}`, "Calling page " + i + " results.");

  //     addLog(`${controllerName}-controller`, "get /", JSON.stringify({ page: i, searchCategory: searchCategory, searchIndex: searchIndex, sortBy: sortBy }));

  //     api.searchItems(searchItemsRequest).then(

  //       function (data) {

  //         // console.log(`${controllerName}-controller`, getDateTime(), `get / ${tableName}`, JSON.stringify(data));

  //         onSuccess(data);

  //         addLog(`${controllerName}-controller`, "get / data", JSON.stringify({ page: i, searchCategory: searchCategory, searchIndex: searchIndex, sortBy: sortBy, data: data }));

  //       },
  //       function (error) {

  //         console.error(`${controllerName}-controller`, getDateTime(), `get / ${tableName}`, JSON.stringify({ page: i, searchCategory: searchCategory, searchIndex: searchIndex, sortBy: sortBy }), "Printing Full Error Object:\n" + JSON.stringify(error, null, 1));

  //         addErrorLog(`${controllerName}-controller`, "get / error", JSON.stringify({ page: i, searchCategory: searchCategory, searchIndex: searchIndex, sortBy: sortBy }), JSON.stringify(error, null, 1));

  //       }

  //     );

  //   }, i * 5000);

  // };


  // * https://stackoverflow.com/questions/3583724/how-do-i-add-a-delay-in-a-javascript-loop -- 01/02/2022 MF
  // * Returns a Promise that resolves after "ms" Milliseconds. -- 01/02/2022
  const timer = milliseconds => new Promise(response => setTimeout(response, milliseconds));

  // * We need to wrap the loop into an async function for this to work. -- 01/02/2022
  async function load() {

    for (let i = 1; i < numberOfResultsPages; i++) {

      // console.log(i);

      searchItemsRequest["ItemPage"] = i;

      console.log(`${controllerName}-controller`, getDateTime(), `get / ${tableName}`, "Calling page " + i + " results.");

      addLog(`${controllerName}-controller`, "get /", JSON.stringify({ page: i, searchCategory: searchCategory, searchIndex: searchIndex, sortBy: sortBy }));

      api.searchItems(searchItemsRequest).then(

        function (data) {

          console.log(`${controllerName}-controller`, getDateTime(), `get / ${tableName}`, JSON.stringify(data));

          onSuccess(data, i, searchCategory, searchIndex, sortBy);

          addLog(`${controllerName}-controller`, "get / data", JSON.stringify({ page: i, searchCategory: searchCategory, searchIndex: searchIndex, sortBy: sortBy, data: data }));

        },
        function (error) {

          console.error(`${controllerName}-controller`, getDateTime(), `get / ${tableName}`, JSON.stringify({ page: i, searchCategory: searchCategory, searchIndex: searchIndex, sortBy: sortBy }), "Printing Full Error Object:\n" + JSON.stringify(error, null, 1));

          addErrorLog(`${controllerName}-controller`, "get / error", JSON.stringify({ page: i, searchCategory: searchCategory, searchIndex: searchIndex, sortBy: sortBy }), JSON.stringify(error, null, 1));

        }

      );

      // * Then the created Promise can be awaited. -- 01/02/2022
      await timer(waitTime);

    };

  };

  load();


  // if (searchIndexAmazonVideo === true) {

  //   setTimeout(() => {

  //     searchIndex = "AmazonVideo";
  //     // searchIndex = "Books";
  //     // searchIndex = "Collectibles";
  //     // searchIndex = "DigitalMusic";
  //     // searchIndex = "DigitalEducationalResources";
  //     // searchIndex = "KindleStore";
  //     // searchIndex = "MobileApps";
  //     // searchIndex = "MoviesAndTV";
  //     // searchIndex = "Music";
  //     // searchIndex = "ToysAndGames";
  //     // searchIndex = "VHS";
  //     // searchIndex = "VideoGames";
  //     searchItemsRequest["SearchIndex"] = searchIndex;

  //     console.log(`${controllerName}-controller`, getDateTime(), `get / ${tableName}`, "searchIndex", searchIndex);

  //     for (let i = 1; i < numberOfResultsPages; i++) {

  //       setTimeout(() => {

  //         searchItemsRequest["ItemPage"] = i;

  //         // console.log(`${controllerName}-controller`, getDateTime(), `get / ${tableName}`, "Calling page " + i + " results.");

  //         addLog(`${controllerName}-controller`, "get /", JSON.stringify({ page: i, searchCategory: searchCategory, searchIndex: searchIndex, sortBy: sortBy }));

  //         api.searchItems(searchItemsRequest).then(

  //           function (data) {

  //             // console.log(`${controllerName}-controller`, getDateTime(), `get / ${tableName}`, JSON.stringify(data));

  //             onSuccess(data);

  //             addLog(`${controllerName}-controller`, "get / data", JSON.stringify({ page: i, searchCategory: searchCategory, searchIndex: searchIndex, sortBy: sortBy, data: data }));

  //           },
  //           function (error) {

  //             console.error(`${controllerName}-controller`, getDateTime(), `get / ${tableName}`, JSON.stringify({ page: i, searchCategory: searchCategory, searchIndex: searchIndex, sortBy: sortBy }), "Printing Full Error Object:\n" + JSON.stringify(error, null, 1));

  //             addErrorLog(`${controllerName}-controller`, "get / error", JSON.stringify({ page: i, searchCategory: searchCategory, searchIndex: searchIndex, sortBy: sortBy }), JSON.stringify(error, null, 1));

  //           }

  //         );

  //       }, i * 2000);

  //     };

  //   }, 2 * numberOfResultsPages * 2000);

  // };


  // if (searchIndexBooks === true) {

  //   setTimeout(() => {

  //     // searchIndex = "AmazonVideo";
  //     searchIndex = "Books";
  //     // searchIndex = "Collectibles";
  //     // searchIndex = "DigitalMusic";
  //     // searchIndex = "DigitalEducationalResources";
  //     // searchIndex = "KindleStore";
  //     // searchIndex = "MobileApps";
  //     // searchIndex = "MoviesAndTV";
  //     // searchIndex = "Music";
  //     // searchIndex = "ToysAndGames";
  //     // searchIndex = "VHS";
  //     // searchIndex = "VideoGames";
  //     searchItemsRequest["SearchIndex"] = searchIndex;

  //     console.log(`${controllerName}-controller`, getDateTime(), `get / ${tableName}`, "searchIndex", searchIndex);

  //     for (let i = 1; i < numberOfResultsPages; i++) {

  //       setTimeout(() => {

  //         searchItemsRequest["ItemPage"] = i;

  //         // console.log(`${controllerName}-controller`, getDateTime(), `get / ${tableName}`, "Calling page " + i + " results.");

  //         addLog(`${controllerName}-controller`, "get /", JSON.stringify({ page: i, searchCategory: searchCategory, searchIndex: searchIndex, sortBy: sortBy }));

  //         api.searchItems(searchItemsRequest).then(

  //           function (data) {

  //             // console.log(`${controllerName}-controller`, getDateTime(), `get / ${tableName}`, JSON.stringify(data));

  //             onSuccess(data);

  //             addLog(`${controllerName}-controller`, "get / data", JSON.stringify({ page: i, searchCategory: searchCategory, searchIndex: searchIndex, sortBy: sortBy, data: data }));

  //           },
  //           function (error) {

  //             console.error(`${controllerName}-controller`, getDateTime(), `get / ${tableName}`, JSON.stringify({ page: i, searchCategory: searchCategory, searchIndex: searchIndex, sortBy: sortBy }), "Printing Full Error Object:\n" + JSON.stringify(error, null, 1));

  //             addErrorLog(`${controllerName}-controller`, "get / error", JSON.stringify({ page: i, searchCategory: searchCategory, searchIndex: searchIndex, sortBy: sortBy }), JSON.stringify(error, null, 1));

  //           }

  //         );

  //       }, i * 2000);

  //     };

  //   }, 3 * numberOfResultsPages * 2000);

  // };


  // if (searchIndexCollectibles === true) {

  //   setTimeout(() => {

  //     // searchIndex = "AmazonVideo";
  //     // searchIndex = "Books";
  //     searchIndex = "Collectibles";
  //     // searchIndex = "DigitalMusic";
  //     // searchIndex = "DigitalEducationalResources";
  //     // searchIndex = "KindleStore";
  //     // searchIndex = "MobileApps";
  //     // searchIndex = "MoviesAndTV";
  //     // searchIndex = "Music";
  //     // searchIndex = "ToysAndGames";
  //     // searchIndex = "VHS";
  //     // searchIndex = "VideoGames";
  //     searchItemsRequest["SearchIndex"] = searchIndex;

  //     console.log(`${controllerName}-controller`, getDateTime(), `get / ${tableName}`, "searchIndex", searchIndex);

  //     for (let i = 1; i < numberOfResultsPages; i++) {

  //       setTimeout(() => {

  //         searchItemsRequest["ItemPage"] = i;

  //         // console.log(`${controllerName}-controller`, getDateTime(), `get / ${tableName}`, "Calling page " + i + " results.");

  //         addLog(`${controllerName}-controller`, "get /", JSON.stringify({ page: i, searchCategory: searchCategory, searchIndex: searchIndex, sortBy: sortBy }));

  //         api.searchItems(searchItemsRequest).then(

  //           function (data) {

  //             // console.log(`${controllerName}-controller`, getDateTime(), `get / ${tableName}`, JSON.stringify(data));

  //             onSuccess(data);

  //             addLog(`${controllerName}-controller`, "get / data", JSON.stringify({ page: i, searchCategory: searchCategory, searchIndex: searchIndex, sortBy: sortBy, data: data }));

  //           },
  //           function (error) {

  //             console.error(`${controllerName}-controller`, getDateTime(), `get / ${tableName}`, JSON.stringify({ page: i, searchCategory: searchCategory, searchIndex: searchIndex, sortBy: sortBy }), "Printing Full Error Object:\n" + JSON.stringify(error, null, 1));

  //             addErrorLog(`${controllerName}-controller`, "get / error", JSON.stringify({ page: i, searchCategory: searchCategory, searchIndex: searchIndex, sortBy: sortBy }), JSON.stringify(error, null, 1));

  //           }

  //         );

  //       }, i * 2000);

  //     };

  //   }, 4 * numberOfResultsPages * 2000);

  // };


  // if (searchIndexDigitalMusic === true) {

  //   setTimeout(() => {

  //     // searchIndex = "AmazonVideo";
  //     // searchIndex = "Books";
  //     // searchIndex = "Collectibles";
  //     searchIndex = "DigitalMusic";
  //     // searchIndex = "DigitalEducationalResources";
  //     // searchIndex = "KindleStore";
  //     // searchIndex = "MobileApps";
  //     // searchIndex = "MoviesAndTV";
  //     // searchIndex = "Music";
  //     // searchIndex = "ToysAndGames";
  //     // searchIndex = "VHS";
  //     // searchIndex = "VideoGames";
  //     searchItemsRequest["SearchIndex"] = searchIndex;

  //     console.log(`${controllerName}-controller`, getDateTime(), `get / ${tableName}`, "searchIndex", searchIndex);

  //     for (let i = 1; i < numberOfResultsPages; i++) {

  //       setTimeout(() => {

  //         searchItemsRequest["ItemPage"] = i;

  //         // console.log(`${controllerName}-controller`, getDateTime(), `get / ${tableName}`, "Calling page " + i + " results.");

  //         addLog(`${controllerName}-controller`, "get /", JSON.stringify({ page: i, searchCategory: searchCategory, searchIndex: searchIndex, sortBy: sortBy }));

  //         api.searchItems(searchItemsRequest).then(

  //           function (data) {

  //             // console.log(`${controllerName}-controller`, getDateTime(), `get / ${tableName}`, JSON.stringify(data));

  //             onSuccess(data);

  //             addLog(`${controllerName}-controller`, "get / data", JSON.stringify({ page: i, searchCategory: searchCategory, searchIndex: searchIndex, sortBy: sortBy, data: data }));

  //           },
  //           function (error) {

  //             console.error(`${controllerName}-controller`, getDateTime(), `get / ${tableName}`, JSON.stringify({ page: i, searchCategory: searchCategory, searchIndex: searchIndex, sortBy: sortBy }), "Printing Full Error Object:\n" + JSON.stringify(error, null, 1));

  //             addErrorLog(`${controllerName}-controller`, "get / error", JSON.stringify({ page: i, searchCategory: searchCategory, searchIndex: searchIndex, sortBy: sortBy }), JSON.stringify(error, null, 1));

  //           }

  //         );

  //       }, i * 2000);

  //     };

  //   }, 5 * numberOfResultsPages * 2000);

  // };


  // if (searchIndexDigitalEducationalResources === true) {

  //   setTimeout(() => {

  //     // searchIndex = "AmazonVideo";
  //     // searchIndex = "Books";
  //     // searchIndex = "Collectibles";
  //     // searchIndex = "DigitalMusic";
  //     searchIndex = "DigitalEducationalResources";
  //     // searchIndex = "KindleStore";
  //     // searchIndex = "MobileApps";
  //     // searchIndex = "MoviesAndTV";
  //     // searchIndex = "Music";
  //     // searchIndex = "ToysAndGames";
  //     // searchIndex = "VHS";
  //     // searchIndex = "VideoGames";
  //     searchItemsRequest["SearchIndex"] = searchIndex;

  //     console.log(`${controllerName}-controller`, getDateTime(), `get / ${tableName}`, "searchIndex", searchIndex);

  //     for (let i = 1; i < numberOfResultsPages; i++) {

  //       setTimeout(() => {

  //         searchItemsRequest["ItemPage"] = i;

  //         // console.log(`${controllerName}-controller`, getDateTime(), `get / ${tableName}`, "Calling page " + i + " results.");

  //         addLog(`${controllerName}-controller`, "get /", JSON.stringify({ page: i, searchCategory: searchCategory, searchIndex: searchIndex, sortBy: sortBy }));

  //         api.searchItems(searchItemsRequest).then(

  //           function (data) {

  //             // console.log(`${controllerName}-controller`, getDateTime(), `get / ${tableName}`, JSON.stringify(data));

  //             onSuccess(data);

  //             addLog(`${controllerName}-controller`, "get / data", JSON.stringify({ page: i, searchCategory: searchCategory, searchIndex: searchIndex, sortBy: sortBy, data: data }));

  //           },
  //           function (error) {

  //             console.error(`${controllerName}-controller`, getDateTime(), `get / ${tableName}`, JSON.stringify({ page: i, searchCategory: searchCategory, searchIndex: searchIndex, sortBy: sortBy }), "Printing Full Error Object:\n" + JSON.stringify(error, null, 1));

  //             addErrorLog(`${controllerName}-controller`, "get / error", JSON.stringify({ page: i, searchCategory: searchCategory, searchIndex: searchIndex, sortBy: sortBy }), JSON.stringify(error, null, 1));

  //           }

  //         );

  //       }, i * 2000);

  //     };

  //   }, 6 * numberOfResultsPages * 2000);

  // };


  // if (searchIndexKindleStore === true) {

  //   setTimeout(() => {

  //     // searchIndex = "AmazonVideo";
  //     // searchIndex = "Books";
  //     // searchIndex = "Collectibles";
  //     // searchIndex = "DigitalMusic";
  //     // searchIndex = "DigitalEducationalResources";
  //     searchIndex = "KindleStore";
  //     // searchIndex = "MobileApps";
  //     // searchIndex = "MoviesAndTV";
  //     // searchIndex = "Music";
  //     // searchIndex = "ToysAndGames";
  //     // searchIndex = "VHS";
  //     // searchIndex = "VideoGames";
  //     searchItemsRequest["SearchIndex"] = searchIndex;

  //     console.log(`${controllerName}-controller`, getDateTime(), `get / ${tableName}`, "searchIndex", searchIndex);

  //     for (let i = 1; i < numberOfResultsPages; i++) {

  //       setTimeout(() => {

  //         searchItemsRequest["ItemPage"] = i;

  //         // console.log(`${controllerName}-controller`, getDateTime(), `get / ${tableName}`, "Calling page " + i + " results.");

  //         addLog(`${controllerName}-controller`, "get /", JSON.stringify({ page: i, searchCategory: searchCategory, searchIndex: searchIndex, sortBy: sortBy }));

  //         api.searchItems(searchItemsRequest).then(

  //           function (data) {

  //             // console.log(`${controllerName}-controller`, getDateTime(), `get / ${tableName}`, JSON.stringify(data));

  //             onSuccess(data);

  //             addLog(`${controllerName}-controller`, "get / data", JSON.stringify({ page: i, searchCategory: searchCategory, searchIndex: searchIndex, sortBy: sortBy, data: data }));

  //           },
  //           function (error) {

  //             console.error(`${controllerName}-controller`, getDateTime(), `get / ${tableName}`, JSON.stringify({ page: i, searchCategory: searchCategory, searchIndex: searchIndex, sortBy: sortBy }), "Printing Full Error Object:\n" + JSON.stringify(error, null, 1));

  //             addErrorLog(`${controllerName}-controller`, "get / error", JSON.stringify({ page: i, searchCategory: searchCategory, searchIndex: searchIndex, sortBy: sortBy }), JSON.stringify(error, null, 1));

  //           }

  //         );

  //       }, i * 2000);

  //     };

  //   }, 7 * numberOfResultsPages * 2000);

  // };


  // if (searchIndexMobileApps === true) {

  //   setTimeout(() => {

  //     // searchIndex = "AmazonVideo";
  //     // searchIndex = "Books";
  //     // searchIndex = "Collectibles";
  //     // searchIndex = "DigitalMusic";
  //     // searchIndex = "DigitalEducationalResources";
  //     // searchIndex = "KindleStore";
  //     searchIndex = "MobileApps";
  //     // searchIndex = "MoviesAndTV";
  //     // searchIndex = "Music";
  //     // searchIndex = "ToysAndGames";
  //     // searchIndex = "VHS";
  //     // searchIndex = "VideoGames";
  //     searchItemsRequest["SearchIndex"] = searchIndex;

  //     console.log(`${controllerName}-controller`, getDateTime(), `get / ${tableName}`, "searchIndex", searchIndex);

  //     for (let i = 1; i < numberOfResultsPages; i++) {

  //       setTimeout(() => {

  //         searchItemsRequest["ItemPage"] = i;

  //         // console.log(`${controllerName}-controller`, getDateTime(), `get / ${tableName}`, "Calling page " + i + " results.");

  //         addLog(`${controllerName}-controller`, "get /", JSON.stringify({ page: i, searchCategory: searchCategory, searchIndex: searchIndex, sortBy: sortBy }));

  //         api.searchItems(searchItemsRequest).then(

  //           function (data) {

  //             // console.log(`${controllerName}-controller`, getDateTime(), `get / ${tableName}`, JSON.stringify(data));

  //             onSuccess(data);

  //             addLog(`${controllerName}-controller`, "get / data", JSON.stringify({ page: i, searchCategory: searchCategory, searchIndex: searchIndex, sortBy: sortBy, data: data }));

  //           },
  //           function (error) {

  //             console.error(`${controllerName}-controller`, getDateTime(), `get / ${tableName}`, JSON.stringify({ page: i, searchCategory: searchCategory, searchIndex: searchIndex, sortBy: sortBy }), "Printing Full Error Object:\n" + JSON.stringify(error, null, 1));

  //             addErrorLog(`${controllerName}-controller`, "get / error", JSON.stringify({ page: i, searchCategory: searchCategory, searchIndex: searchIndex, sortBy: sortBy }), JSON.stringify(error, null, 1));

  //           }

  //         );

  //       }, i * 2000);

  //     };

  //   }, 8 * numberOfResultsPages * 2000);

  // };


  // if (searchIndexMoviesAndTV === true) {

  //   setTimeout(() => {

  //     // searchIndex = "AmazonVideo";
  //     // searchIndex = "Books";
  //     // searchIndex = "Collectibles";
  //     // searchIndex = "DigitalMusic";
  //     // searchIndex = "DigitalEducationalResources";
  //     // searchIndex = "KindleStore";
  //     // searchIndex = "MobileApps";
  //     searchIndex = "MoviesAndTV";
  //     // searchIndex = "Music";
  //     // searchIndex = "ToysAndGames";
  //     // searchIndex = "VHS";
  //     // searchIndex = "VideoGames";
  //     searchItemsRequest["SearchIndex"] = searchIndex;

  //     console.log(`${controllerName}-controller`, getDateTime(), `get / ${tableName}`, "searchIndex", searchIndex);

  //     for (let i = 1; i < numberOfResultsPages; i++) {

  //       setTimeout(() => {

  //         searchItemsRequest["ItemPage"] = i;

  //         // console.log(`${controllerName}-controller`, getDateTime(), `get / ${tableName}`, "Calling page " + i + " results.");

  //         addLog(`${controllerName}-controller`, "get /", JSON.stringify({ page: i, searchCategory: searchCategory, searchIndex: searchIndex, sortBy: sortBy }));

  //         api.searchItems(searchItemsRequest).then(

  //           function (data) {

  //             // console.log(`${controllerName}-controller`, getDateTime(), `get / ${tableName}`, JSON.stringify(data));

  //             onSuccess(data);

  //             addLog(`${controllerName}-controller`, "get / data", JSON.stringify({ page: i, searchCategory: searchCategory, searchIndex: searchIndex, sortBy: sortBy, data: data }));

  //           },
  //           function (error) {

  //             console.error(`${controllerName}-controller`, getDateTime(), `get / ${tableName}`, JSON.stringify({ page: i, searchCategory: searchCategory, searchIndex: searchIndex, sortBy: sortBy }), "Printing Full Error Object:\n" + JSON.stringify(error, null, 1));

  //             addErrorLog(`${controllerName}-controller`, "get / error", JSON.stringify({ page: i, searchCategory: searchCategory, searchIndex: searchIndex, sortBy: sortBy }), JSON.stringify(error, null, 1));

  //           }

  //         );

  //       }, i * 2000);

  //     };

  //   }, 9 * numberOfResultsPages * 2000);

  // };


  // if (searchIndexMusic === true) {

  //   setTimeout(() => {

  //     // searchIndex = "AmazonVideo";
  //     // searchIndex = "Books";
  //     // searchIndex = "Collectibles";
  //     // searchIndex = "DigitalMusic";
  //     // searchIndex = "DigitalEducationalResources";
  //     // searchIndex = "KindleStore";
  //     // searchIndex = "MobileApps";
  //     // searchIndex = "MoviesAndTV";
  //     searchIndex = "Music";
  //     // searchIndex = "ToysAndGames";
  //     // searchIndex = "VHS";
  //     // searchIndex = "VideoGames";
  //     searchItemsRequest["SearchIndex"] = searchIndex;

  //     console.log(`${controllerName}-controller`, getDateTime(), `get / ${tableName}`, "searchIndex", searchIndex);

  //     for (let i = 1; i < numberOfResultsPages; i++) {

  //       setTimeout(() => {

  //         searchItemsRequest["ItemPage"] = i;

  //         // console.log(`${controllerName}-controller`, getDateTime(), `get / ${tableName}`, "Calling page " + i + " results.");

  //         addLog(`${controllerName}-controller`, "get /", JSON.stringify({ page: i, searchCategory: searchCategory, searchIndex: searchIndex, sortBy: sortBy }));

  //         api.searchItems(searchItemsRequest).then(

  //           function (data) {

  //             // console.log(`${controllerName}-controller`, getDateTime(), `get / ${tableName}`, JSON.stringify(data));

  //             onSuccess(data);

  //             addLog(`${controllerName}-controller`, "get / data", JSON.stringify({ page: i, searchCategory: searchCategory, searchIndex: searchIndex, sortBy: sortBy, data: data }));

  //           },
  //           function (error) {

  //             console.error(`${controllerName}-controller`, getDateTime(), `get / ${tableName}`, JSON.stringify({ page: i, searchCategory: searchCategory, searchIndex: searchIndex, sortBy: sortBy }), "Printing Full Error Object:\n" + JSON.stringify(error, null, 1));

  //             addErrorLog(`${controllerName}-controller`, "get / error", JSON.stringify({ page: i, searchCategory: searchCategory, searchIndex: searchIndex, sortBy: sortBy }), JSON.stringify(error, null, 1));

  //           }

  //         );

  //       }, i * 2000);

  //     };

  //   }, 10 * numberOfResultsPages * 2000);

  // };


  // if (searchIndexToysAndGames === true) {

  //   setTimeout(() => {

  //     // searchIndex = "AmazonVideo";
  //     // searchIndex = "Books";
  //     // searchIndex = "Collectibles";
  //     // searchIndex = "DigitalMusic";
  //     // searchIndex = "DigitalEducationalResources";
  //     // searchIndex = "KindleStore";
  //     // searchIndex = "MobileApps";
  //     // searchIndex = "MoviesAndTV";
  //     // searchIndex = "Music";
  //     searchIndex = "ToysAndGames";
  //     // searchIndex = "VHS";
  //     // searchIndex = "VideoGames";
  //     searchItemsRequest["SearchIndex"] = searchIndex;

  //     console.log(`${controllerName}-controller`, getDateTime(), `get / ${tableName}`, "searchIndex", searchIndex);

  //     for (let i = 1; i < numberOfResultsPages; i++) {

  //       setTimeout(() => {

  //         searchItemsRequest["ItemPage"] = i;

  //         // console.log(`${controllerName}-controller`, getDateTime(), `get / ${tableName}`, "Calling page " + i + " results.");

  //         addLog(`${controllerName}-controller`, "get /", JSON.stringify({ page: i, searchCategory: searchCategory, searchIndex: searchIndex, sortBy: sortBy }));

  //         api.searchItems(searchItemsRequest).then(

  //           function (data) {

  //             // console.log(`${controllerName}-controller`, getDateTime(), `get / ${tableName}`, JSON.stringify(data));

  //             onSuccess(data);

  //             addLog(`${controllerName}-controller`, "get / data", JSON.stringify({ page: i, searchCategory: searchCategory, searchIndex: searchIndex, sortBy: sortBy, data: data }));

  //           },
  //           function (error) {

  //             console.error(`${controllerName}-controller`, getDateTime(), `get / ${tableName}`, JSON.stringify({ page: i, searchCategory: searchCategory, searchIndex: searchIndex, sortBy: sortBy }), "Printing Full Error Object:\n" + JSON.stringify(error, null, 1));

  //             addErrorLog(`${controllerName}-controller`, "get / error", JSON.stringify({ page: i, searchCategory: searchCategory, searchIndex: searchIndex, sortBy: sortBy }), JSON.stringify(error, null, 1));

  //           }

  //         );

  //       }, i * 2000);

  //     };

  //   }, 11 * numberOfResultsPages * 2000);

  // };


  // if (searchIndexVHS === true) {

  //   setTimeout(() => {

  //     // searchIndex = "AmazonVideo";
  //     // searchIndex = "Books";
  //     // searchIndex = "Collectibles";
  //     // searchIndex = "DigitalMusic";
  //     // searchIndex = "DigitalEducationalResources";
  //     // searchIndex = "KindleStore";
  //     // searchIndex = "MobileApps";
  //     // searchIndex = "MoviesAndTV";
  //     // searchIndex = "Music";
  //     // searchIndex = "ToysAndGames";
  //     searchIndex = "VHS";
  //     // searchIndex = "VideoGames";
  //     searchItemsRequest["SearchIndex"] = searchIndex;

  //     console.log(`${controllerName}-controller`, getDateTime(), `get / ${tableName}`, "searchIndex", searchIndex);

  //     for (let i = 1; i < numberOfResultsPages; i++) {

  //       setTimeout(() => {

  //         searchItemsRequest["ItemPage"] = i;

  //         // console.log(`${controllerName}-controller`, getDateTime(), `get / ${tableName}`, "Calling page " + i + " results.");

  //         addLog(`${controllerName}-controller`, "get /", JSON.stringify({ page: i, searchCategory: searchCategory, searchIndex: searchIndex, sortBy: sortBy }));

  //         api.searchItems(searchItemsRequest).then(

  //           function (data) {

  //             // console.log(`${controllerName}-controller`, getDateTime(), `get / ${tableName}`, JSON.stringify(data));

  //             onSuccess(data);

  //             addLog(`${controllerName}-controller`, "get / data", JSON.stringify({ page: i, searchCategory: searchCategory, searchIndex: searchIndex, sortBy: sortBy, data: data }));

  //           },
  //           function (error) {

  //             console.error(`${controllerName}-controller`, getDateTime(), `get / ${tableName}`, JSON.stringify({ page: i, searchCategory: searchCategory, searchIndex: searchIndex, sortBy: sortBy }), "Printing Full Error Object:\n" + JSON.stringify(error, null, 1));

  //             addErrorLog(`${controllerName}-controller`, "get / error", JSON.stringify({ page: i, searchCategory: searchCategory, searchIndex: searchIndex, sortBy: sortBy }), JSON.stringify(error, null, 1));

  //           }

  //         );

  //       }, i * 2000);

  //     };

  //   }, 12 * numberOfResultsPages * 2000);

  // };


  // if (searchIndexVideoGames === true) {

  //   setTimeout(() => {

  //     // searchIndex = "AmazonVideo";
  //     // searchIndex = "Books";
  //     // searchIndex = "Collectibles";
  //     // searchIndex = "DigitalMusic";
  //     // searchIndex = "DigitalEducationalResources";
  //     // searchIndex = "KindleStore";
  //     // searchIndex = "MobileApps";
  //     // searchIndex = "MoviesAndTV";
  //     // searchIndex = "Music";
  //     // searchIndex = "ToysAndGames";
  //     // searchIndex = "VHS";
  //     searchIndex = "VideoGames";
  //     searchItemsRequest["SearchIndex"] = searchIndex;

  //     console.log(`${controllerName}-controller`, getDateTime(), `get / ${tableName}`, "searchIndex", searchIndex);

  //     for (let i = 1; i < numberOfResultsPages; i++) {

  //       setTimeout(() => {

  //         searchItemsRequest["ItemPage"] = i;

  //         // console.log(`${controllerName}-controller`, getDateTime(), `get / ${tableName}`, "Calling page " + i + " results.");

  //         addLog(`${controllerName}-controller`, "get /", JSON.stringify({ page: i, searchCategory: searchCategory, searchIndex: searchIndex, sortBy: sortBy }));

  //         api.searchItems(searchItemsRequest).then(

  //           function (data) {

  //             // console.log(`${controllerName}-controller`, getDateTime(), `get / ${tableName}`, JSON.stringify(data));

  //             onSuccess(data);

  //             addLog(`${controllerName}-controller`, "get / data", JSON.stringify({ page: i, searchCategory: searchCategory, searchIndex: searchIndex, sortBy: sortBy, data: data }));

  //           },
  //           function (error) {

  //             console.error(`${controllerName}-controller`, getDateTime(), `get / ${tableName}`, JSON.stringify({ page: i, searchCategory: searchCategory, searchIndex: searchIndex, sortBy: sortBy }), "Printing Full Error Object:\n" + JSON.stringify(error, null, 1));

  //             addErrorLog(`${controllerName}-controller`, "get / error", JSON.stringify({ page: i, searchCategory: searchCategory, searchIndex: searchIndex, sortBy: sortBy }), JSON.stringify(error, null, 1));

  //           }

  //         );

  //       }, i * 2000);

  //     };

  //   }, 13 * numberOfResultsPages * 2000);

  // };


  response.status(200).json({ transactionSuccess: true, errorOccurred: false, message: "Successfully retrieved records." });

});


/***************************
 ******* Active/Inactive Item *******
 ***************************/
// * Allows the admin to mark an item as active/inactive. -- 01/03/2022 MF
router.put("/active/:ASIN", validateAdmin, (request, response) => {

  const recordObject = {
    active: request.body.recordObject.active
  };

  const where = { ASIN: request.params.ASIN };

  // console.log(`${controllerName}-controller`, getDateTime(), `put /active/:ASIN ASIN`, ASIN);

  db(tableName)
    .where(where)
    // * .returning() is not supported by mysql and will not have any effect. -- 08/13/2021 MF
    // .returning(select)
    .update(recordObject)
    .then((records) => {
      // console.log(`${controllerName}-controller`, getDateTime(), `put /active/:ASIN records`, records);
      // * Returns the number of updated records. -- 08/13/2021 MF

      // records = convertBitTrueFalse(records);

      if (isEmpty(records) === false) {
        // console.log(`${controllerName}-controller`, getDateTime(), `put /active/:ASIN records`, records);

        response.status(200).json({ primaryKeyID: request.params.ASIN, transactionSuccess: true, errorOccurred: false, message: "Successfully updated.", records: records });

      } else {
        // console.log(`${controllerName}-controller`, getDateTime(), `put /active/:ASIN No Results`);

        response.status(200).json({ primaryKeyID: request.params.ASIN, transactionSuccess: false, errorOccurred: false, message: "Nothing to update." });

      };

    })
    .catch((error) => {
      console.error(`${controllerName}-controller`, getDateTime(), `put /active/:ASIN error`, error);

      addErrorLog(`${controllerName}-controller`, "put /active/:ASIN", records, error);
      response.status(500).json({ transactionSuccess: false, errorOccurred: true, message: "Not successfully updated." });

    });

});


/***************************
 ******* Viewed Item *******
 ***************************/
// * Allows the admin to mark an entry as viewed. -- 01/03/2022 MF
router.put("/viewed/:ASIN", validateAdmin, (request, response) => {

  const recordObject = {
    viewed: request.body.recordObject.viewed
  };

  const where = { ASIN: request.params.ASIN };

  // console.log(`${controllerName}-controller`, getDateTime(), `put /viewed/:ASIN ASIN`, ASIN);

  db(tableName)
    .where(where)
    // * .returning() is not supported by mysql and will not have any effect. -- 08/13/2021 MF
    // .returning(select)
    .update(recordObject)
    .then((records) => {
      // console.log(`${controllerName}-controller`, getDateTime(), `put /viewed/:ASIN records`, records);
      // * Returns the number of updated records. -- 08/13/2021 MF

      // records = convertBitTrueFalse(records);

      if (isEmpty(records) === false) {
        // console.log(`${controllerName}-controller`, getDateTime(), `put /viewed/:ASIN records`, records);

        response.status(200).json({ primaryKeyID: request.params.ASIN, transactionSuccess: true, errorOccurred: false, message: "Successfully updated.", records: records });

      } else {
        // console.log(`${controllerName}-controller`, getDateTime(), `put /viewed/:ASIN No Results`);

        response.status(200).json({ primaryKeyID: request.params.ASIN, transactionSuccess: false, errorOccurred: false, message: "Nothing to update." });

      };

    })
    .catch((error) => {
      console.error(`${controllerName}-controller`, getDateTime(), `put /viewed/:ASIN error`, error);

      addErrorLog(`${controllerName}-controller`, "put /viewed/:ASIN", records, error);
      response.status(500).json({ transactionSuccess: false, errorOccurred: true, message: "Not successfully updated." });

    });

});



module.exports = router;