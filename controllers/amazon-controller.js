"use strict";

const router = require("express").Router();
// const axios = require("axios");
const databaseConfig = require("../database");
const db = require("knex")(databaseConfig.config);
// const validateSession = require("../middleware/validate-session");
// const validateAdmin = require("../middleware/validate-admin");
const { IsEmpty, GetDateTime, FormatTrim } = require("../utilities/sharedFunctions");
const { convertBitTrueFalse } = require("../utilities/appFunctions");
const addLog = require("../utilities/addLog");
const addErrorLog = require("../utilities/addErrorLog");

const controllerName = "amazon";
const tableName = "amazon";
// const select = "*";
// const orderBy = [{ column: "createDate", order: "desc" }];

// const Parser = require("rss-parser");

const ProductAdvertisingAPIv1 = require("../amazon/index");

const credentials = require("../amazon");

let records;


/******************************
 ***** Get Amazon SDK *********
 ******************************/
// * Returns Amazon listings -- 12/31/2021 MF
router.get("/pkd", (request, response) => {

  // console.log(`${controllerName}-controller`, GetDateTime(), `get / ${tableName}`, "credentials", credentials);

  const numberOfResultsPages = 11;
  // const numberOfResultsPages = 2;

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
  // searchItemsRequest["Keywords"] = "Philip Dick";

  searchItemsRequest["Author"] = "Philip K. Dick";
  // searchItemsRequest["Author"] = "Philip Dick";

  /**
   * Specify the category in which search request is to be made
   * For more details, refer: https://webservices.amazon.com/paapi5/documentation/use-cases/organization-of-items-on-amazon/search-index.html
   */
  // searchItemsRequest["SearchIndex"] = "Books";

  /** Specify item count to be returned in search result */
  searchItemsRequest["ItemCount"] = 10;
  // searchItemsRequest["ItemPage"] = 1;

  searchItemsRequest["SortBy"] = "NewestArrivals";

  /**
   * Choose resources you want from SearchItemsResource enum
   * For more details, refer: https://webservices.amazon.com/paapi5/documentation/search-items.html#resources-parameter
   */
  //  searchItemsRequest["Resources"] = ["Images.Primary.Medium", "ItemInfo.Title", "Offers.Listings.Price"];
  searchItemsRequest["Resources"] = ["ItemInfo.Title", "Images.Primary.Large", "ItemInfo.ByLineInfo", "ItemInfo.Classifications", "ItemInfo.ContentInfo"];
  // searchItemsRequest["Resources"] = ["Images.Primary.Large", "Images.Primary.Medium", "Images.Primary.Small", "ItemInfo.Title", "ParentASIN", "ItemInfo.ByLineInfo", "ItemInfo.Classifications", "ItemInfo.ContentInfo", "ItemInfo.ContentRating", "ItemInfo.ExternalIds", "ItemInfo.Features", "ItemInfo.ManufactureInfo", "ItemInfo.ProductInfo", "ItemInfo.TechnicalInfo"];
  // * All Resources -- 01/01/2022 MF
  // searchItemsRequest["Resources"] = ["BrowseNodeInfo.BrowseNodes", "BrowseNodeInfo.BrowseNodes.Ancestor", "BrowseNodeInfo.BrowseNodes.SalesRank", "BrowseNodeInfo.WebsiteSalesRank", "Images.Primary.Small", "Images.Primary.Medium", "Images.Primary.Large", "Images.Variants.Small", "Images.Variants.Medium", "Images.Variants.Large", "ItemInfo.ByLineInfo", "ItemInfo.Classifications", "ItemInfo.ContentInfo", "ItemInfo.ContentRating", "ItemInfo.ExternalIds", "ItemInfo.Features", "ItemInfo.ManufactureInfo", "ItemInfo.ProductInfo", "ItemInfo.TechnicalInfo", "ItemInfo.Title", "ItemInfo.TradeInInfo", "Offers.Listings.Availability.MaxOrderQuantity", "Offers.Listings.Availability.Message", "Offers.Listings.Availability.MinOrderQuantity", "Offers.Listings.Availability.Type", "Offers.Listings.Condition", "Offers.Listings.Condition.ConditionNote", "Offers.Listings.Condition.SubCondition", "Offers.Listings.DeliveryInfo.IsAmazonFulfilled", "Offers.Listings.DeliveryInfo.IsFreeShippingEligible", "Offers.Listings.DeliveryInfo.IsPrimeEligible", "Offers.Listings.IsBuyBoxWinner", "Offers.Listings.LoyaltyPoints.Points", "Offers.Listings.MerchantInfo", "Offers.Listings.Price", "Offers.Listings.ProgramEligibility.IsPrimeExclusive", "Offers.Listings.ProgramEligibility.IsPrimePantry", "Offers.Listings.Promotions", "Offers.Listings.SavingBasis", "Offers.Summaries.HighestPrice", "Offers.Summaries.LowestPrice", "Offers.Summaries.OfferCount", "ParentASIN", "SearchRefinements"];

  function onSuccess(data) {

    let displayFilteredResults = true;

    // console.log("API called successfully.");

    let searchItemsResponse = ProductAdvertisingAPIv1.SearchItemsResponse.constructFromObject(data);

    if (displayFilteredResults === false) {

      // console.log("Complete Response: \n" + JSON.stringify(searchItemsResponse, null, 1));
      // console.log(JSON.stringify(searchItemsResponse, null, 1));
      console.log(`${controllerName}-controller`, GetDateTime(), `get / ${tableName}`, JSON.stringify(searchItemsResponse, null, 1));

    } else {

      if (searchItemsResponse["SearchResult"] !== undefined) {

        // console.log(`${controllerName}-controller`, GetDateTime(), `get / ${tableName}`, JSON.stringify(searchItemsResponse, null, 1));

        // let totalResultCount = searchItemsResponse["SearchResult"]["TotalResultCount"];
        // let searchURL = searchItemsResponse["SearchResult"]["SearchURL"];
        // let searchDate = GetDateTime();

        let itemArray = [];

        for (let i = 0; i < searchItemsResponse["SearchResult"]["Items"].length; i++) {

          let item_0 = searchItemsResponse["SearchResult"]["Items"][i];

          let itemObject = {};
          // let itemObject = { totalResultCount: totalResultCount, searchURL: searchURL, searchDate: searchDate };

          if (item_0 !== undefined) {

            // console.log(`${controllerName}-controller`, GetDateTime(), `get / ${tableName}`, "######################################################");

            if (item_0["ItemInfo"] !== undefined && item_0["ItemInfo"]["Title"] !== undefined && item_0["ItemInfo"]["Title"]["DisplayValue"] !== undefined
            ) {

              // console.log("Title: " + item_0["ItemInfo"]["Title"]["DisplayValue"]);

              itemObject.titleName = item_0["ItemInfo"]["Title"]["DisplayValue"];

            };

            if (item_0["ItemInfo"] !== undefined && item_0["ItemInfo"]["ByLineInfo"] !== undefined && item_0["ItemInfo"]["ByLineInfo"]["Contributors"] !== undefined
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

            if (item_0["ItemInfo"] !== undefined && item_0["ItemInfo"]["ContentInfo"] !== undefined && item_0["ItemInfo"]["ContentInfo"]["PublicationDate"] !== undefined
            ) {

              // console.log("PublicationDate: " + item_0["ItemInfo"]["ContentInfo"]["PublicationDate"]["DisplayValue"]);

              itemObject.publicationDate = item_0["ItemInfo"]["ContentInfo"]["PublicationDate"]["DisplayValue"];

            };

            if (item_0["ASIN"] !== undefined) {

              // console.log("ASIN: " + item_0["ASIN"]);

              itemObject.ASIN = item_0["ASIN"];

            };

            if (item_0["DetailPageURL"] !== undefined) {

              // console.log("DetailPageURL: " + item_0["DetailPageURL"]);

              itemObject.textLinkFull = item_0["DetailPageURL"];

            };

            if (item_0["Images"] !== undefined && item_0["Images"]["Primary"] !== undefined && item_0["Images"]["Primary"]["Large"] !== undefined) {

              // console.log("Images Primary Large URL: " + item_0["Images"]["Primary"]["Large"]["URL"]);

              itemObject.imageName = item_0["Images"]["Primary"]["Large"]["URL"];

            };

            // console.log(`${controllerName}-controller`, GetDateTime(), `get / ${tableName}`, "######################################################");

            itemArray.push(itemObject);

          };

        };

        // console.log(`${controllerName}-controller`, GetDateTime(), `get / ${tableName}`, itemArray);

        db(tableName)
          // * .returning() is not supported by mysql and will not have any effect. -- 08/13/2021 MF
          // .returning("*")
          .insert(itemArray)
          .then((records) => {
            console.log(`${controllerName}-controller`, GetDateTime(), "get / records", records);
            // * Returns the ID value of the added record. -- 08/13/2021 MF

            // if (IsEmpty(records) === false) {
            //   // console.log(`${controllerName}-controller`, GetDateTime(), "get / records", records);
            //   response.status(200).json({ primaryKeyID: records[0], transactionSuccess: true, errorOccurred: false, message: "Successfully added.", records: records });

            // } else {
            //   // console.log(`${controllerName}-controller`, GetDateTime(), "get / No Results");

            //   response.status(200).json({ primaryKeyID: null, transactionSuccess: false, errorOccurred: false, message: "Nothing to add." });

            // };

          })
          .catch((error) => {
            console.error(`${controllerName}-controller`, GetDateTime(), "get / error", error);

            // addErrorLog(`${controllerName}-controller`, "get /", records, error);
            // response.status(500).json({ transactionSuccess: false, errorOccurred: true, message: "Not successfully added." });

          });

      };

    };

    if (searchItemsResponse["Errors"] !== undefined) {

      // console.log("Errors:");
      console.log(`${controllerName}-controller`, GetDateTime(), `get / ${tableName}`, "Complete Error Response: " + JSON.stringify(searchItemsResponse["Errors"], null, 1));

      // console.log("Printing 1st Error:");
      // let error_0 = searchItemsResponse["Errors"][0];

      // console.log("Error Code: " + error_0["Code"]);
      // console.log("Error Message: " + error_0["Message"]);

    };

  };


  // function onError(error) {

  //   // console.log("Error calling PA-API 5.0!");
  //   console.log(`${controllerName}-controller`, GetDateTime(), `get / ${tableName}`, "Printing Full Error Object:\n" + JSON.stringify(error, null, 1));

  //   console.log(`${controllerName}-controller`, GetDateTime(), `get / ${tableName}`, "Status Code: " + error["status"]);

  //   if (error["response"] !== undefined && error["response"]["text"] !== undefined) {

  //     console.log(`${controllerName}-controller`, GetDateTime(), `get / ${tableName}`, "Error Object: " + JSON.stringify(error["response"]["text"], null, 1));

  //   };

  // };


  for (let i = 1; i < numberOfResultsPages; i++) {

    setTimeout(() => {

      searchItemsRequest["ItemPage"] = i;

      // console.log(`${controllerName}-controller`, GetDateTime(), `get / ${tableName}`, "Calling page " + i + " results.");

      api.searchItems(searchItemsRequest).then(

        function (data) {

          // console.log(`${controllerName}-controller`, GetDateTime(), `get / ${tableName}`, JSON.stringify(data));

          onSuccess(data);

        },
        function (error) {

          console.log(`${controllerName}-controller`, GetDateTime(), `get / ${tableName}`, "Printing Full Error Object:\n" + JSON.stringify(error, null, 1));

        }

      );

    }, i * 2000);

  };

  response.status(200).json({ transactionSuccess: true, errorOccurred: false, message: "Successfully retrieved records." });

});


module.exports = router;