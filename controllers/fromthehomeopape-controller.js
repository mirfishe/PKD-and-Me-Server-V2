"use strict";

const router = require("express").Router();
const databaseConfig = require("../database");
const db = require("knex")(databaseConfig.config);
// const validateSession = require("../middleware/validate-session");
const validateAdmin = require("../middleware/validate-admin");
const { isEmpty, getDateTime, formatTrim } = require("../utilities/sharedFunctions");
const { convertBitTrueFalse } = require("../utilities/applicationFunctions");
const addLog = require("../utilities/addLog");
const addErrorLog = require("../utilities/addErrorLog");

// const Parser = require('rss-parser');

const controllerName = "fromthehomeopape";
const tableName = "homeopapeRSS";
const select = ["itemID", "itemLink", "itemTitle", "itemContentSnippet", "itemPubDate", "viewed", "display", "alwaysFilter", "posted", "itemLinkFormatted"];
const limit = 20;
const displayWhere = { "display": true };
const postedWhere = { "posted": true };
const viewedWhere = { "viewed": false };
const orderBy = [{ column: "itemPubDate", order: "desc" }];

const componentName = `${controllerName}-controller`;

let records;


const formatItemLink = (itemLink) => {

  // SELECT itemLink, 
  // REPLACE(itemLink, 'https://www.google.com/url?rct=j&sa=t&url=', '') AS itemLinkFormatted
  // FROM homeopapeRSS

  // REPLACE(REPLACE(itemLink, 'https://www.google.com/url?rct=j&sa=t&url=', ''), '\%3F', '?')
  // REPLACE(REPLACE(REPLACE(itemLink, 'https://www.google.com/url?rct=j&sa=t&url=', ''), '\%3F', '?'), '\%26', '&')
  // REPLACE(REPLACE(REPLACE(REPLACE(itemLink, 'https://www.google.com/url?rct=j&sa=t&url=', ''), '\%3F', '?'), '\%26', '&'), '\%3D', '=')

  // REGEXP_REPLACE(REPLACE(REPLACE(REPLACE(REPLACE(itemLink, 'https://www.google.com/url?rct=j&sa=t&url=', ''), '\%3F', '?'), '\%26', '&'), '\%3D', '='), '[?&]ct=.*$', '')

  // REGEXP_REPLACE(REGEXP_REPLACE(REPLACE(REPLACE(REPLACE(REPLACE(itemLink, 'https://www.google.com/url?rct=j&sa=t&url=', ''), '\%3F', '?'), '\%26', '&'), '\%3D', '='), '[?&]ct=.*$', ''), '[?&]fbclid=.*$', '')

  // REGEXP_REPLACE(REGEXP_REPLACE(REGEXP_REPLACE(REPLACE(REPLACE(REPLACE(REPLACE(itemLink, 'https://www.google.com/url?rct=j&sa=t&url=', ''), '\%3F', '?'), '\%26', '&'), '\%3D', '='), '[?&]ct=.*$', ''), '[?&]fbclid=.*$', ''), '[?&]utm_medium=.*$', '')

  // REGEXP_REPLACE(REGEXP_REPLACE(REGEXP_REPLACE(REGEXP_REPLACE(REPLACE(REPLACE(REPLACE(REPLACE(itemLink, 'https://www.google.com/url?rct=j&sa=t&url=', ''), '\%3F', '?'), '\%26', '&'), '\%3D', '='), '[?&]ct=.*$', ''), '[?&]fbclid=.*$', ''), '[?&]utm_medium=.*$', ''), '[?&]utm_campaign=.*$', '')

  // REGEXP_REPLACE(REGEXP_REPLACE(REGEXP_REPLACE(REGEXP_REPLACE(REGEXP_REPLACE(REPLACE(REPLACE(REPLACE(REPLACE(itemLink, 'https://www.google.com/url?rct=j&sa=t&url=', ''), '\%3F', '?'), '\%26', '&'), '\%3D', '='), '[?&]ct=.*$', ''), '[?&]fbclid=.*$', ''), '[?&]utm_medium=.*$', ''), '[?&]utm_campaign=.*$', ''), '[?&]utm_source=.*$', '')

  // SELECT itemID, 
  // REGEXP_REPLACE(REGEXP_REPLACE(REGEXP_REPLACE(REGEXP_REPLACE(REGEXP_REPLACE(REPLACE(REPLACE(REPLACE(REPLACE(itemLink, 'https://www.google.com/url?rct=j&sa=t&url=', ''), '\%3F', '?'), '\%26', '&'), '\%3D', '='), '[?&]ct=.*$', ''), '[?&]fbclid=.*$', ''), '[?&]utm_medium=.*$', ''), '[?&]utm_campaign=.*$', ''), '[?&]utm_source=.*$', '') AS itemLinkFormatted
  // FROM homeopapeRSS

  // UPDATE homeopapeRSS
  // SET itemLinkFormatted = REGEXP_REPLACE(REGEXP_REPLACE(REGEXP_REPLACE(REGEXP_REPLACE(REGEXP_REPLACE(REPLACE(REPLACE(REPLACE(REPLACE(itemLink, 'https://www.google.com/url?rct=j&sa=t&url=', ''), '\%3F', '?'), '\%26', '&'), '\%3D', '='), '[?&]ct=.*$', ''), '[?&]fbclid=.*$', ''), '[?&]utm_medium=.*$', ''), '[?&]utm_campaign=.*$', ''), '[?&]utm_source=.*$', '')

  // UPDATE homeopapeRSSImport
  // SET itemLinkFormatted = REGEXP_REPLACE(REGEXP_REPLACE(REGEXP_REPLACE(REGEXP_REPLACE(REGEXP_REPLACE(REPLACE(REPLACE(REPLACE(REPLACE(itemLink, 'https://www.google.com/url?rct=j&sa=t&url=', ''), '\%3F', '?'), '\%26', '&'), '\%3D', '='), '[?&]ct=.*$', ''), '[?&]fbclid=.*$', ''), '[?&]utm_medium=.*$', ''), '[?&]utm_campaign=.*$', ''), '[?&]utm_source=.*$', '')

  // SELECT * FROM homeopapeRSS
  // WHERE itemLinkFormatted IN (
  // SELECT itemLinkFormatted FROM homeopapeRSS
  // GROUP BY itemLinkFormatted
  // HAVING COUNT(*) > 1)

  let param = "";
  let regExp = "";
  // let newURL = decodeURI(itemLink);
  let newURL = itemLink.replaceAll("https://www.google.com/url?rct=j&sa=t&url=", "");

  // * Remove &ct=ga&cd=CAIyGjFhOTgyNzMwYWNlOTE1ZDI6Y29tOmVuOlVT&usg=AFQjCNEhFPEPL8--91umtz1jWdrmBW2JZQ -- 06/26/2021 MF
  // * Google -- 06/26/2021 MF
  // * Removes everything after the ct= -- 06/26/2021 MF
  // * https://gist.github.com/hehe24h/acfa46c57bc4f37a5ca6814cb1652537 -- 06/26/2021 MF
  param = "ct";
  regExp = new RegExp("[?&]" + param + "=.*$");
  newURL = newURL.replace(regExp, "");
  newURL = newURL.replace("%3F", "?");
  newURL = newURL.replace("%3D", "=");

  newURL = newURL.replaceAll("\%3F", "?").replaceAll("\%26", "&").replaceAll("\%3D", "=");
  // let newURL = newURL.replaceAll("\%3F", "?").replaceAll("\%3f", "?").replaceAll("\%26", "&").replaceAll("\%3D", "=").replaceAll("\%3d", "=");

  // * Remove fbclid= -- 06/26/2021 MF
  // * FaceBook analytics and tracking -- 06/26/2021 MF
  // * Removes everything after the fbclid= -- 06/26/2021 MF
  // * https://gist.github.com/hehe24h/acfa46c57bc4f37a5ca6814cb1652537 -- 06/26/2021 MF
  param = "fbclid";
  regExp = new RegExp("[?&]" + param + "=.*$");
  newURL = newURL.replace(regExp, "");

  // * Remove utm_medium= -- 06/26/2021 MF
  // * Google Analytics and tracking -- 06/26/2021 MF
  // * Removes everything after the utm_medium= -- 06/26/2021 MF
  param = "utm_medium";
  regExp = new RegExp("[?&]" + param + "=.*$");
  newURL = newURL.replace(regExp, "");

  // * Remove utm_campaign= -- 06/26/2021 MF
  // * Google Analytics and tracking -- 06/26/2021 MF
  // * Removes everything after the utm_campaign= -- 06/26/2021 MF
  param = "utm_campaign";
  regExp = new RegExp("[?&]" + param + "=.*$");
  newURL = newURL.replace(regExp, "");

  // * Remove utm_source= -- 06/26/2021 MF
  // * Google Analytics and tracking -- 06/26/2021 MF
  // * Removes everything after the utm_source= -- 06/26/2021 MF
  param = "utm_source";
  regExp = new RegExp("[?&]" + param + "=.*$");
  newURL = newURL.replace(regExp, "");

  return newURL;

};


// const fetchNews = async () => {

//   // https://cors-anywhere.herokuapp.com -- 06/05/2021 MF
//   // https://stackoverflow.com/questions/43871637/no-access-control-allow-origin-header-is-present-on-the-requested-resource-whe -- 06/05/2021 MF
//   const proxyurl = "https://cors-anywhere.herokuapp.com/";

//   // let url = proxyurl;
//   let url;

//   // * Google Alert - Philip Dick New -- 06/05/2021 MF
//   let url = `${proxyurl}https://www.google.com/alerts/feeds/17849810695950872924/158424632588957664681`;
//   // let url = "https://www.google.com/alerts/feeds/17849810695950872924/15842463258895766468";
//   // * Google Alert - Philip Dick -- 06/05/2021 MF
//   // let url = `${proxyurl}https://www.google.com/alerts/feeds/17849810695950872924/2465476321108416249`;
//   // * Google Alert - Philip Dick All Except Web -- 06/05/2021 MF
//   // * Doesn't appear to work anymore. -- 06/05/2021 MF
//   // let url = `${proxyurl}https://www.google.com/alerts/feeds/17849810695950872924/11918400074382766835`;
//   // * Google Alert - Philip Dick News -- 06/05/2021 MF
//   // * Doesn't appear to work anymore. -- 06/05/2021 MF
//   // let url = `${proxyurl}https://www.google.com/alerts/feeds/17849810695950872924/17162147117770349674`;

//   let rssParser = new Parser({
//     // * Doesn't prevent the CORS error. -- 06/05/2021 MF
//     // headers: {
//     //   "access-control-allow-origin": "*", "access-control-allow-methods": "GET, POST, PUT, DELETE", "access-control-allow-headers": "Origin, X-Requested-With, Content-Type, Accept, Authorization"
//     // },
//     customFields: {
//       feed: ["id", "updated", "lastBuildDate"],
//       item: ["updated", "contentSnippet", "isoDate", "author"], // , "author.name", "name"
//     },
//     xml2js: {
//       emptyTag: '--EMPTY--',
//     }
//   });

// const feed = await rssParser.parseURL(url);

//   // <feed xmlns="http://www.w3.org/2005/Atom" xmlns:idx="urn:atom-extension:indexing">
//   // <id>tag:google.com,2005:reader/user/17849810695950872924/state/com.google/alerts/15842463258895766468</id>
//   // <title>Google Alert - Philip Dick New</title>
//   // <link href="https://www.google.com/alerts/feeds/17849810695950872924/15842463258895766468" rel="self"></link>
//   // <updated>2021-06-04T16:18:45Z</updated>
//   // <entry>
//   // <id>tag:google.com,2013:googlealerts/feed:12501224780620368192</id>
//   // <title type="html">This week in Concord history</title>
//   // <link href="https://www.google.com/url?rct=j&amp;sa=t&amp;url=https://www.theconcordinsider.com/2021/06/04/this-week-in-concord-history-502/&amp;ct=ga&amp;cd=CAIyGjUwMjhiYWRmMWQ5M2MzMGE6Y29tOmVuOlVT&amp;usg=AFQjCNGc3F9NBj810v400CL5oepfu5PTwQ"></link>
//   // <published>2021-06-04T14:26:15Z</published>
//   // <updated>2021-06-04T14:26:15Z</updated>
//   // <content type="html">Samuel Bell, on horseback, from Boscawen to the &lt;b&gt;new&lt;/b&gt; State House. ... fences to escape from the North State Street prison in Concord, &lt;b&gt;Philip Dick&lt;/b&gt;,&amp;nbsp;...</content>
//   // <author>
//   //     <name></name>
//   // </author>;
//   // </entry>

// // * Notes from https://github.com/rbren/rss-parser -- 06/05/2021 MF
// // * The contentSnippet field strips out HTML tags and unescapes HTML entities -- 06/05/2021
// // * The dc: prefix will be removed from all fields -- 06/05/2021
// // * Both dc:date and pubDate will be available in ISO 8601 format as isoDate -- 06/05/2021
// // * If author is specified, but not dc:creator, creator will be set to author (see article) -- 06/05/2021
// // * Atom's updated becomes lastBuildDate for consistency -- 06/05/2021

//   let itemsArray = [];

//   feed.items.forEach(item => {

//     let feedObject = {
//       feedID: feed.id,
//       feedTitle: feed.title,
//       feedLink: feed.link,
//       feedUpdated: feed.updated,
//       feedLastBuildDate: feed.lastBuildDate,
//       feedUrl: feed.feedUrl,
//       itemID: item.id,
//       itemTitle: item.title,
//       itemLink: item.link,
//       itemPubDate: item.pubDate,
//       itemUpdated: item.updated,
//       itemContent: item.content,
//       itemContentSnippet: item.contentSnippet,
//       itemISODate: item.isoDate,
//       itemCreator: item.creator,
//       itemAuthor: item.author,
//       itemLinkFormatted: formatItemLink(item.link)
//     };

//     itemsArray.push(feedObject);

//   });

//   return itemsArray;

// };


// DROP TABLE IF EXISTS`homeopapeRSSImport`;
// CREATE TABLE IF NOT EXISTS`homeopapeRSSImport`(
//   `homeopapeID` int NOT NULL AUTO_INCREMENT,
//   `createDate` datetime DEFAULT CURRENT_TIMESTAMP,
//   `feedID` varchar(100) DEFAULT NULL,
//   `feedTitle` varchar(1000) DEFAULT NULL,
//   `feedLink` varchar(1000) DEFAULT NULL,
//   `feedUpdated` datetime DEFAULT NULL,
//   `feedLastBuildDate` datetime DEFAULT NULL,
//   `feedUrl` varchar(1000) DEFAULT NULL,
//   `itemID` varchar(100) DEFAULT NULL,
//   `itemTitle` varchar(1000) DEFAULT NULL,
//   `itemLink` varchar(1000) DEFAULT NULL,
//   `itemPubDate` datetime DEFAULT NULL,
//   `itemUpdated` datetime DEFAULT NULL,
//   `itemContent` varchar(2000) DEFAULT NULL,
//   `itemContentSnippet` varchar(2000) DEFAULT NULL,
//   `itemISODate` datetime DEFAULT NULL,
//   `itemCreator` varchar(2000) DEFAULT NULL,
//   `itemAuthor` varchar(2000) DEFAULT NULL,
//   PRIMARY KEY(`homeopapeID`)
// ) ENGINE = InnoDB DEFAULT CHARSET = utf8mb4 COLLATE = utf8mb4_0900_ai_ci;

// DROP TABLE IF EXISTS `homeopapeRSS`;
// CREATE TABLE IF NOT EXISTS `homeopapeRSS` (
//   `homeopapeID` int NOT NULL AUTO_INCREMENT,
//   `createDate` datetime DEFAULT CURRENT_TIMESTAMP,
//   `display` tinyint DEFAULT '0',
//   `feedID` varchar(100) DEFAULT NULL,
//   `feedTitle` varchar(1000) DEFAULT NULL,
//   `feedLink` varchar(1000) DEFAULT NULL,
//   `feedUpdated` datetime DEFAULT NULL,
//   `feedLastBuildDate` datetime DEFAULT NULL,
//   `feedUrl` varchar(1000) DEFAULT NULL,
//   `itemID` varchar(100) DEFAULT NULL,
//   `itemTitle` varchar(1000) DEFAULT NULL,
//   `itemLink` varchar(1000) DEFAULT NULL,
//   `itemPubDate` datetime DEFAULT NULL,
//   `itemUpdated` datetime DEFAULT NULL,
//   `itemContent` varchar(2000) DEFAULT NULL,
//   `itemContentSnippet` varchar(2000) DEFAULT NULL,
//   `itemISODate` datetime DEFAULT NULL,
//   `itemCreator` varchar(2000) DEFAULT NULL,
//   `itemAuthor` varchar(2000) DEFAULT NULL,
//   PRIMARY KEY (`homeopapeID`)
// ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

// INSERT INTO homeopapeRSS (feedID, feedTitle, feedLink, feedUpdated, feedLastBuildDate, feedUrl, itemID, itemTitle, itemLink, itemPubDate, itemUpdated, itemContent, itemContentSnippet, itemISODate, itemCreator, itemAuthor)
// SELECT DISTINCT feedID, feedTitle, feedLink, feedUpdated, feedLastBuildDate, feedUrl, itemID, itemTitle, itemLink, itemPubDate, itemUpdated, itemContent, itemContentSnippet, itemISODate, itemCreator, itemAuthor FROM homeopapeRSSImport
// WHERE itemID NOT IN (SELECT itemID FROM homeopapeRSS)


/******************************
 ***** Get *********
 ******************************/
router.get("/", (request, response) => {

  // ! The Order By isn't sorting correctly because the data type of this column is text and not datetime due to issues with inserting into the datetime column on the productions server. -- 08/13/2021 MF
  // let sqlQuery = "SELECT DISTINCT itemLink, itemTitle, itemContentSnippet, itemPubDate FROM homeopapeRSS ORDER BY itemPubDate DESC";
  // let sqlQuery = `SELECT DISTINCT TOP ${topNumber} itemID, itemLink, itemTitle, itemContentSnippet, itemPubDate, viewed, display, alwaysFilter, posted FROM ${tableName} ORDER BY itemPubDate DESC`;
  // let sqlQuery = `SELECT DISTINCT itemID, itemLink, itemTitle, itemContentSnippet, itemPubDate, viewed, display, alwaysFilter, posted FROM ${tableName} ORDER BY itemPubDate DESC LIMIT ${topNumber}`;

  // db.raw(sqlQuery).toSQL();

  db.distinct(select)
    .from(tableName)
    .where(displayWhere)
    // ! The Order By isn't sorting correctly because the data type of this column is text and not datetime due to issues with inserting into the datetime column on the productions server. -- 08/13/2021 MF
    .orderBy(orderBy)
    // db.raw(sqlQuery)
    .then((records) => {

      records = convertBitTrueFalse(records);

      if (isEmpty(records) === false) {

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
 ***** Get New Items To Review  *********
 ******************************/
router.get("/review", (request, response) => {

  // ! The Order By isn't sorting correctly because the data type of this column is text and not datetime due to issues with inserting into the datetime column on the productions server. -- 08/13/2021 MF
  // let sqlQuery = "SELECT DISTINCT itemLink, itemTitle, itemContentSnippet, itemPubDate FROM homeopapeRSS ORDER BY itemPubDate DESC";
  // let sqlQuery = `SELECT DISTINCT TOP ${topNumber} itemID, itemLink, itemTitle, itemContentSnippet, itemPubDate, viewed, display, alwaysFilter, posted FROM ${tableName} ORDER BY itemPubDate DESC`;
  // let sqlQuery = `SELECT DISTINCT itemID, itemLink, itemTitle, itemContentSnippet, itemPubDate, viewed, display, alwaysFilter, posted FROM ${tableName} ORDER BY itemPubDate DESC LIMIT ${topNumber}`;

  // db.raw(sqlQuery).toSQL();

  db.distinct(select)
    .from(tableName)
    .where(viewedWhere)
    // ! The Order By isn't sorting correctly because the data type of this column is text and not datetime due to issues with inserting into the datetime column on the productions server. -- 08/13/2021 MF
    .orderBy(orderBy)
    // db.raw(sqlQuery)
    .then((records) => {

      records = convertBitTrueFalse(records);

      if (isEmpty(records) === false) {

        response.status(200).json({ transactionSuccess: true, errorOccurred: false, message: "Successfully retrieved records.", records: records });

      } else {

        response.status(200).json({ transactionSuccess: false, errorOccurred: false, message: "No records found." });

      };

    })
    .catch((error) => {

      console.error(componentName, getDateTime(), "get /review error", error);

      addErrorLog(componentName, "get /review", {}, error);
      response.status(500).json({ transactionSuccess: false, errorOccurred: true, message: "No records found." });

    });

});


/******************************
 ***** Get *********
 ******************************/
router.get("/top/:topNumber", (request, response) => {

  let topNumber = isEmpty(request.params.topNumber) === false ? request.params.topNumber : "";

  if (isNaN(formatTrim(topNumber)) === true) {

    topNumber = limit;

  } else {

    topNumber = parseInt(topNumber);

  };

  // // ! The Order By isn't sorting correctly because the data type of this column is text and not datetime due to issues with inserting into the datetime column on the productions server. -- 08/13/2021 MF
  // // let sqlQuery = "SELECT DISTINCT itemLink, itemTitle, itemContentSnippet, itemPubDate FROM homeopapeRSS ORDER BY itemPubDate DESC";
  // // let sqlQuery = `SELECT DISTINCT TOP ${topNumber} itemID, itemLink, itemTitle, itemContentSnippet, itemPubDate, viewed, display, alwaysFilter, posted FROM ${tableName} ORDER BY itemPubDate DESC`;
  // let sqlQuery = `SELECT DISTINCT itemID, itemLink, itemTitle, itemContentSnippet, itemPubDate, viewed, display, alwaysFilter, posted FROM ${tableName} ORDER BY itemPubDate DESC LIMIT ${topNumber}`;

  // // db.raw(sqlQuery).toSQL();

  // // db.distinct(select)
  // //   .from(tableName)
  // //   // ! The Order By isn't sorting correctly because the data type of this column is text and not datetime due to issues with inserting into the datetime column on the productions server. -- 08/13/2021 MF
  // //   .orderBy([{ column: "itemPubDate", order: "desc" }])
  // //   // .orderBy([{ column: "createDate", order: "desc" }])
  // db.raw(sqlQuery)
  db.distinct(select)
    .from(tableName)
    .limit(topNumber)
    .where(displayWhere)
    .orderBy(orderBy)
    .then((records) => {

      records = convertBitTrueFalse(records);

      if (isEmpty(records) === false) {

        response.status(200).json({ transactionSuccess: true, errorOccurred: false, message: "Successfully retrieved records.", records: records });

      } else {

        response.status(200).json({ transactionSuccess: false, errorOccurred: false, message: "No records found." });

      };

    })
    .catch((error) => {

      console.error(componentName, getDateTime(), "get /top/:topNumber error", error);

      addErrorLog(componentName, "get /top/:topNumber", { topNumber: topNumber }, error);
      response.status(500).json({ transactionSuccess: false, errorOccurred: true, message: "No records found." });

    });

});


/******************************
 ***** Get *********
 ******************************/
router.get("/posted/", (request, response) => {

  // let topNumber = isEmpty(request.params.topNumber) === false ? request.params.topNumber : "";

  // if (isNaN(formatTrim(topNumber)) === true) {

  //   topNumber = limit;

  // } else {

  //   topNumber = parseInt(topNumber);

  // };

  // // ! The Order By isn't sorting correctly because the data type of this column is text and not datetime due to issues with inserting into the datetime column on the productions server. -- 08/13/2021 MF
  // // let sqlQuery = "SELECT DISTINCT itemLink, itemTitle, itemContentSnippet, itemPubDate FROM homeopapeRSS ORDER BY itemPubDate DESC";
  // // let sqlQuery = `SELECT DISTINCT TOP ${topNumber} itemID, itemLink, itemTitle, itemContentSnippet, itemPubDate, viewed, display, alwaysFilter, posted FROM ${tableName} ORDER BY itemPubDate DESC`;
  // let sqlQuery = `SELECT DISTINCT itemID, itemLink, itemTitle, itemContentSnippet, itemPubDate, viewed, display, alwaysFilter, posted FROM ${tableName} ORDER BY itemPubDate DESC LIMIT ${topNumber}`;

  // // db.raw(sqlQuery).toSQL();

  // // db.distinct(select)
  // //   .from(tableName)
  // //   // ! The Order By isn't sorting correctly because the data type of this column is text and not datetime due to issues with inserting into the datetime column on the productions server. -- 08/13/2021 MF
  // //   .orderBy([{ column: "itemPubDate", order: "desc" }])
  // //   // .orderBy([{ column: "createDate", order: "desc" }])
  // db.raw(sqlQuery)
  db.distinct(select)
    .from(tableName)
    // .limit(topNumber)
    .where(postedWhere)
    .orderBy(orderBy)
    .then((records) => {

      records = convertBitTrueFalse(records);

      if (isEmpty(records) === false) {

        response.status(200).json({ transactionSuccess: true, errorOccurred: false, message: "Successfully retrieved records.", records: records });

      } else {

        response.status(200).json({ transactionSuccess: false, errorOccurred: false, message: "No records found." });

      };

    })
    .catch((error) => {

      console.error(componentName, getDateTime(), "get /top/:topNumber error", error);

      addErrorLog(componentName, "get /top/:topNumber", { topNumber: topNumber }, error);
      response.status(500).json({ transactionSuccess: false, errorOccurred: true, message: "No records found." });

    });

});


/******************************
 ***** Fetch  *********
 ******************************/
router.get("/new", (request, response) => {

  let Parser = require('rss-parser');
  let rssParser = new Parser({
    // * Doesn't prevent the CORS error. -- 06/05/2021 MF
    // headers: {
    //   "access-control-allow-origin": "*", "access-control-allow-methods": "GET, POST, PUT, DELETE", "access-control-allow-headers": "Origin, X-Requested-With, Content-Type, Accept, Authorization"
    // },
    customFields: {
      feed: ["id", "updated", "lastBuildDate"],
      item: ["updated", "contentSnippet", "isoDate", "author"], // , "author.name", "name"
    },
    xml2js: {
      emptyTag: '--EMPTY--',
    }
  });

  (async () => {

    // * Google Alert - Philip Dick New -- 06/05/2021 MF
    let url = "https://www.google.com/alerts/feeds/17849810695950872924/15842463258895766468";

    const feed = await rssParser.parseURL(url);

    // <feed xmlns="http://www.w3.org/2005/Atom" xmlns:idx="urn:atom-extension:indexing">
    // <id>tag:google.com,2005:reader/user/17849810695950872924/state/com.google/alerts/15842463258895766468</id>
    // <title>Google Alert - Philip Dick New</title>
    // <link href="https://www.google.com/alerts/feeds/17849810695950872924/15842463258895766468" rel="self"></link>
    // <updated>2021-06-04T16:18:45Z</updated>
    // <entry>
    // <id>tag:google.com,2013:googlealerts/feed:12501224780620368192</id>
    // <title type="html">This week in Concord history</title>
    // <link href="https://www.google.com/url?rct=j&amp;sa=t&amp;url=https://www.theconcordinsider.com/2021/06/04/this-week-in-concord-history-502/&amp;ct=ga&amp;cd=CAIyGjUwMjhiYWRmMWQ5M2MzMGE6Y29tOmVuOlVT&amp;usg=AFQjCNGc3F9NBj810v400CL5oepfu5PTwQ"></link>
    // <published>2021-06-04T14:26:15Z</published>
    // <updated>2021-06-04T14:26:15Z</updated>
    // <content type="html">Samuel Bell, on horseback, from Boscawen to the &lt;b&gt;new&lt;/b&gt; State House. ... fences to escape from the North State Street prison in Concord, &lt;b&gt;Philip Dick&lt;/b&gt;,&amp;nbsp;...</content>
    // <author>
    //     <name></name>
    // </author>;
    // </entry>

    // * Notes from https://github.com/rbren/rss-parser -- 06/05/2021 MF
    // * The contentSnippet field strips out HTML tags and unescapes HTML entities -- 06/05/2021
    // * The dc: prefix will be removed from all fields -- 06/05/2021
    // * Both dc:date and pubDate will be available in ISO 8601 format as isoDate -- 06/05/2021
    // * If author is specified, but not dc:creator, creator will be set to author (see article) -- 06/05/2021
    // * Atom's updated becomes lastBuildDate for consistency -- 06/05/2021

    // let itemsArray = [];

    feed.items.forEach(item => {

      // SELECT @@GLOBAL.sql_mode global, @@SESSION.sql_mode session;
      // SET sql_mode = '';
      // SET GLOBAL sql_mode = '';

      // * https://stackoverflow.com/questions/44304777/er-truncated-wrong-value-incorrect-datetime-value -- 06/05/2021 MF
      // * .replaceAll("T", " ").replaceAll("Z", "") are used to fix this issue. -- 06/09/2021 MF
      // * UnhandledPromiseRejectionWarning: TypeError: feed.updated.replaceAll is not a function -- 06/09/2021 MF

      let feedObject = {
        feedID: feed.id,
        feedTitle: feed.title,
        feedLink: feed.link,
        feedUpdated: feed.updated,
        feedLastBuildDate: feed.lastBuildDate,
        feedUrl: feed.feedUrl,
        itemID: item.id,
        itemTitle: item.title,
        itemLink: item.link,
        itemPubDate: item.pubDate,
        itemUpdated: item.updated,
        itemContent: item.content,
        itemContentSnippet: item.contentSnippet,
        itemISODate: item.isoDate,
        itemCreator: item.creator,
        itemAuthor: item.author,
        itemLinkFormatted: formatItemLink(item.link)
      };

      // itemsArray.push(feedObject);

      db("homeopapeRSSImport")
        // * .returning() is not supported by mysql and will not have any effect. -- 08/13/2021 MF
        // .returning(select)
        .insert(feedObject)
        .then((records) => {

          // records = convertBitTrueFalse(records);

          // addLog(componentName, `get /new ${url}`, { });

          // if (isEmpty(records) === false) {

          //   response.status(200).json({ primaryKeyID: records[0], transactionSuccess: true, errorOccurred: false, message: "Successfully added.", records: records });

          // } else {

          //   response.status(200).json({ primaryKeyID: null, transactionSuccess: false, errorOccurred: false, message: "Nothing to add." });

          // };

        })
        .catch((error) => {

          console.error(componentName, getDateTime(), "get /new error", error);

          addErrorLog(componentName, "get /new", {}, error);
          response.status(500).json({ transactionSuccess: false, errorOccurred: true, message: "Not successfully added." });

        });

    });

  })();


  (async () => {

    // * Google Alert - Philip Dick -- 06/05/2021 MF
    let url = "https://www.google.com/alerts/feeds/17849810695950872924/2465476321108416249";

    const feed = await rssParser.parseURL(url);

    // <feed xmlns="http://www.w3.org/2005/Atom" xmlns:idx="urn:atom-extension:indexing">
    // <id>tag:google.com,2005:reader/user/17849810695950872924/state/com.google/alerts/15842463258895766468</id>
    // <title>Google Alert - Philip Dick New</title>
    // <link href="https://www.google.com/alerts/feeds/17849810695950872924/15842463258895766468" rel="self"></link>
    // <updated>2021-06-04T16:18:45Z</updated>
    // <entry>
    // <id>tag:google.com,2013:googlealerts/feed:12501224780620368192</id>
    // <title type="html">This week in Concord history</title>
    // <link href="https://www.google.com/url?rct=j&amp;sa=t&amp;url=https://www.theconcordinsider.com/2021/06/04/this-week-in-concord-history-502/&amp;ct=ga&amp;cd=CAIyGjUwMjhiYWRmMWQ5M2MzMGE6Y29tOmVuOlVT&amp;usg=AFQjCNGc3F9NBj810v400CL5oepfu5PTwQ"></link>
    // <published>2021-06-04T14:26:15Z</published>
    // <updated>2021-06-04T14:26:15Z</updated>
    // <content type="html">Samuel Bell, on horseback, from Boscawen to the &lt;b&gt;new&lt;/b&gt; State House. ... fences to escape from the North State Street prison in Concord, &lt;b&gt;Philip Dick&lt;/b&gt;,&amp;nbsp;...</content>
    // <author>
    //     <name></name>
    // </author>;
    // </entry>

    // * Notes from https://github.com/rbren/rss-parser -- 06/05/2021 MF
    // * The contentSnippet field strips out HTML tags and unescapes HTML entities -- 06/05/2021
    // * The dc: prefix will be removed from all fields -- 06/05/2021
    // * Both dc:date and pubDate will be available in ISO 8601 format as isoDate -- 06/05/2021
    // * If author is specified, but not dc:creator, creator will be set to author (see article) -- 06/05/2021
    // * Atom's updated becomes lastBuildDate for consistency -- 06/05/2021

    // let itemsArray = [];

    feed.items.forEach(item => {

      // SELECT @@GLOBAL.sql_mode global, @@SESSION.sql_mode session;
      // SET sql_mode = '';
      // SET GLOBAL sql_mode = '';

      // * https://stackoverflow.com/questions/44304777/er-truncated-wrong-value-incorrect-datetime-value -- 06/05/2021 MF
      // * .replaceAll("T", " ").replaceAll("Z", "") are used to fix this issue. -- 06/09/2021 MF
      // * UnhandledPromiseRejectionWarning: TypeError: feed.updated.replaceAll is not a function -- 06/09/2021 MF
      // * https://www.designcise.com/web/tutorial/how-to-fix-replaceall-is-not-a-function-javascript-error -- 08/13/2021 MF

      let feedObject = {
        feedID: feed.id,
        feedTitle: feed.title,
        feedLink: feed.link,
        feedUpdated: feed.updated,
        feedLastBuildDate: feed.lastBuildDate,
        feedUrl: feed.feedUrl,
        itemID: item.id,
        itemTitle: item.title,
        itemLink: item.link,
        itemPubDate: item.pubDate,
        itemUpdated: item.updated,
        itemContent: item.content,
        itemContentSnippet: item.contentSnippet,
        itemISODate: item.isoDate,
        itemCreator: item.creator,
        itemAuthor: item.author,
        itemLinkFormatted: formatItemLink(item.link)
      };

      // itemsArray.push(feedObject);

      db("homeopapeRSSImport")
        // * .returning() is not supported by mysql and will not have any effect. -- 08/13/2021 MF
        // .returning(select)
        .insert(feedObject)
        .then((records) => {

          // records = convertBitTrueFalse(records);

          // addLog(componentName, `get /new ${url}`, { });

          // if (isEmpty(records) === false) {

          //   response.status(200).json({ primaryKeyID: records[0], transactionSuccess: true, errorOccurred: false, message: "Successfully added.", records: records });

          // } else {

          //   response.status(200).json({ primaryKeyID: null, transactionSuccess: false, errorOccurred: false, message: "Nothing to add." });

          // };

        })
        .catch((error) => {

          console.error(componentName, getDateTime(), "get /new error", error);

          addErrorLog(componentName, "get /new", {}, error);
          response.status(500).json({ transactionSuccess: false, errorOccurred: true, message: "Not successfully added." });

        });

    });

  })();


  (async () => {

    // * Google Alert - Philip Dick All Except Web -- 06/05/2021 MF
    // // * Doesn't appear to work anymore. -- 06/05/2021 MF
    let url = "https://www.google.com/alerts/feeds/17849810695950872924/11918400074382766835";

    const feed = await rssParser.parseURL(url);

    // <feed xmlns="http://www.w3.org/2005/Atom" xmlns:idx="urn:atom-extension:indexing">
    // <id>tag:google.com,2005:reader/user/17849810695950872924/state/com.google/alerts/15842463258895766468</id>
    // <title>Google Alert - Philip Dick New</title>
    // <link href="https://www.google.com/alerts/feeds/17849810695950872924/15842463258895766468" rel="self"></link>
    // <updated>2021-06-04T16:18:45Z</updated>
    // <entry>
    // <id>tag:google.com,2013:googlealerts/feed:12501224780620368192</id>
    // <title type="html">This week in Concord history</title>
    // <link href="https://www.google.com/url?rct=j&amp;sa=t&amp;url=https://www.theconcordinsider.com/2021/06/04/this-week-in-concord-history-502/&amp;ct=ga&amp;cd=CAIyGjUwMjhiYWRmMWQ5M2MzMGE6Y29tOmVuOlVT&amp;usg=AFQjCNGc3F9NBj810v400CL5oepfu5PTwQ"></link>
    // <published>2021-06-04T14:26:15Z</published>
    // <updated>2021-06-04T14:26:15Z</updated>
    // <content type="html">Samuel Bell, on horseback, from Boscawen to the &lt;b&gt;new&lt;/b&gt; State House. ... fences to escape from the North State Street prison in Concord, &lt;b&gt;Philip Dick&lt;/b&gt;,&amp;nbsp;...</content>
    // <author>
    //     <name></name>
    // </author>;
    // </entry>

    // * Notes from https://github.com/rbren/rss-parser -- 06/05/2021 MF
    // * The contentSnippet field strips out HTML tags and unescapes HTML entities -- 06/05/2021
    // * The dc: prefix will be removed from all fields -- 06/05/2021
    // * Both dc:date and pubDate will be available in ISO 8601 format as isoDate -- 06/05/2021
    // * If author is specified, but not dc:creator, creator will be set to author (see article) -- 06/05/2021
    // * Atom's updated becomes lastBuildDate for consistency -- 06/05/2021

    // let itemsArray = [];

    feed.items.forEach(item => {

      // SELECT @@GLOBAL.sql_mode global, @@SESSION.sql_mode session;
      // SET sql_mode = '';
      // SET GLOBAL sql_mode = '';

      // * https://stackoverflow.com/questions/44304777/er-truncated-wrong-value-incorrect-datetime-value -- 06/05/2021 MF
      // * .replaceAll("T", " ").replaceAll("Z", "") are used to fix this issue. -- 06/09/2021 MF
      // * UnhandledPromiseRejectionWarning: TypeError: feed.updated.replaceAll is not a function -- 06/09/2021 MF

      let feedObject = {
        feedID: feed.id,
        feedTitle: feed.title,
        feedLink: feed.link,
        feedUpdated: feed.updated,
        feedLastBuildDate: feed.lastBuildDate,
        feedUrl: feed.feedUrl,
        itemID: item.id,
        itemTitle: item.title,
        itemLink: item.link,
        itemPubDate: item.pubDate,
        itemUpdated: item.updated,
        itemContent: item.content,
        itemContentSnippet: item.contentSnippet,
        itemISODate: item.isoDate,
        itemCreator: item.creator,
        itemAuthor: item.author,
        itemLinkFormatted: formatItemLink(item.link)
      };

      // itemsArray.push(feedObject);

      db("homeopapeRSSImport")
        // * .returning() is not supported by mysql and will not have any effect. -- 08/13/2021 MF
        // .returning(select)
        .insert(feedObject)
        .then((records) => {

          // records = convertBitTrueFalse(records);

          // addLog(componentName, `get /new ${url}`, { });

          // if (isEmpty(records) === false) {

          //   response.status(200).json({ primaryKeyID: records[0], transactionSuccess: true, errorOccurred: false, message: "Successfully added.", records: records });

          // } else {

          //   response.status(200).json({ primaryKeyID: null, transactionSuccess: false, errorOccurred: false, message: "Nothing to add." });

          // };

        })
        .catch((error) => {

          console.error(componentName, getDateTime(), "get /new error", error);

          addErrorLog(componentName, "get /new", {}, error);
          response.status(500).json({ transactionSuccess: false, errorOccurred: true, message: "Not successfully added." });

        });

    });

  })();


  (async () => {

    // * Google Alert - Philip Dick News -- 06/05/2021 MF
    // // * Doesn't appear to work anymore. -- 06/05/2021 MF
    let url = "https://www.google.com/alerts/feeds/17849810695950872924/17162147117770349674";

    const feed = await rssParser.parseURL(url);

    // <feed xmlns="http://www.w3.org/2005/Atom" xmlns:idx="urn:atom-extension:indexing">
    // <id>tag:google.com,2005:reader/user/17849810695950872924/state/com.google/alerts/15842463258895766468</id>
    // <title>Google Alert - Philip Dick New</title>
    // <link href="https://www.google.com/alerts/feeds/17849810695950872924/15842463258895766468" rel="self"></link>
    // <updated>2021-06-04T16:18:45Z</updated>
    // <entry>
    // <id>tag:google.com,2013:googlealerts/feed:12501224780620368192</id>
    // <title type="html">This week in Concord history</title>
    // <link href="https://www.google.com/url?rct=j&amp;sa=t&amp;url=https://www.theconcordinsider.com/2021/06/04/this-week-in-concord-history-502/&amp;ct=ga&amp;cd=CAIyGjUwMjhiYWRmMWQ5M2MzMGE6Y29tOmVuOlVT&amp;usg=AFQjCNGc3F9NBj810v400CL5oepfu5PTwQ"></link>
    // <published>2021-06-04T14:26:15Z</published>
    // <updated>2021-06-04T14:26:15Z</updated>
    // <content type="html">Samuel Bell, on horseback, from Boscawen to the &lt;b&gt;new&lt;/b&gt; State House. ... fences to escape from the North State Street prison in Concord, &lt;b&gt;Philip Dick&lt;/b&gt;,&amp;nbsp;...</content>
    // <author>
    //     <name></name>
    // </author>;
    // </entry>

    // * Notes from https://github.com/rbren/rss-parser -- 06/05/2021 MF
    // * The contentSnippet field strips out HTML tags and unescapes HTML entities -- 06/05/2021
    // * The dc: prefix will be removed from all fields -- 06/05/2021
    // * Both dc:date and pubDate will be available in ISO 8601 format as isoDate -- 06/05/2021
    // * If author is specified, but not dc:creator, creator will be set to author (see article) -- 06/05/2021
    // * Atom's updated becomes lastBuildDate for consistency -- 06/05/2021

    // let itemsArray = [];

    feed.items.forEach(item => {

      // SELECT @@GLOBAL.sql_mode global, @@SESSION.sql_mode session;
      // SET sql_mode = '';
      // SET GLOBAL sql_mode = '';

      // * https://stackoverflow.com/questions/44304777/er-truncated-wrong-value-incorrect-datetime-value -- 06/05/2021 MF
      // * .replaceAll("T", " ").replaceAll("Z", "") are used to fix this issue. -- 06/09/2021 MF
      // * UnhandledPromiseRejectionWarning: TypeError: feed.updated.replaceAll is not a function -- 06/09/2021 MF

      let feedObject = {
        feedID: feed.id,
        feedTitle: feed.title,
        feedLink: feed.link,
        feedUpdated: feed.updated,
        feedLastBuildDate: feed.lastBuildDate,
        feedUrl: feed.feedUrl,
        itemID: item.id,
        itemTitle: item.title,
        itemLink: item.link,
        itemPubDate: item.pubDate,
        itemUpdated: item.updated,
        itemContent: item.content,
        itemContentSnippet: item.contentSnippet,
        itemISODate: item.isoDate,
        itemCreator: item.creator,
        itemAuthor: item.author,
        itemLinkFormatted: formatItemLink(item.link)
      };

      // itemsArray.push(feedObject);

      db("homeopapeRSSImport")
        // * .returning() is not supported by mysql and will not have any effect. -- 08/13/2021 MF
        // .returning(select)
        .insert(feedObject)
        .then((records) => {

          // records = convertBitTrueFalse(records);

          // addLog(componentName, `get /new ${url}`, { });

          // if (isEmpty(records) === false) {

          //   response.status(200).json({ primaryKeyID: records[0], transactionSuccess: true, errorOccurred: false, message: "Successfully added.", records: records });

          // } else {

          //   response.status(200).json({ primaryKeyID: null, transactionSuccess: false, errorOccurred: false, message: "Nothing to add." });

          // };

        })
        .catch((error) => {

          console.error(componentName, getDateTime(), "get /new error", error);

          addErrorLog(componentName, "get /new", {}, error);
          response.status(500).json({ transactionSuccess: false, errorOccurred: true, message: "Not successfully added." });

        });

    });

  })();


  (async () => {

    // * Google Alert - Blade Runner -- 06/05/2021 MF
    // // * Doesn't appear to work anymore. -- 06/05/2021 MF
    let url = "https://www.google.com/alerts/feeds/17849810695950872924/2707042161623420058";

    const feed = await rssParser.parseURL(url);

    // <feed xmlns="http://www.w3.org/2005/Atom" xmlns:idx="urn:atom-extension:indexing">
    // <id>tag:google.com,2005:reader/user/17849810695950872924/state/com.google/alerts/15842463258895766468</id>
    // <title>Google Alert - Philip Dick New</title>
    // <link href="https://www.google.com/alerts/feeds/17849810695950872924/15842463258895766468" rel="self"></link>
    // <updated>2021-06-04T16:18:45Z</updated>
    // <entry>
    // <id>tag:google.com,2013:googlealerts/feed:12501224780620368192</id>
    // <title type="html">This week in Concord history</title>
    // <link href="https://www.google.com/url?rct=j&amp;sa=t&amp;url=https://www.theconcordinsider.com/2021/06/04/this-week-in-concord-history-502/&amp;ct=ga&amp;cd=CAIyGjUwMjhiYWRmMWQ5M2MzMGE6Y29tOmVuOlVT&amp;usg=AFQjCNGc3F9NBj810v400CL5oepfu5PTwQ"></link>
    // <published>2021-06-04T14:26:15Z</published>
    // <updated>2021-06-04T14:26:15Z</updated>
    // <content type="html">Samuel Bell, on horseback, from Boscawen to the &lt;b&gt;new&lt;/b&gt; State House. ... fences to escape from the North State Street prison in Concord, &lt;b&gt;Philip Dick&lt;/b&gt;,&amp;nbsp;...</content>
    // <author>
    //     <name></name>
    // </author>;
    // </entry>

    // * Notes from https://github.com/rbren/rss-parser -- 06/05/2021 MF
    // * The contentSnippet field strips out HTML tags and unescapes HTML entities -- 06/05/2021
    // * The dc: prefix will be removed from all fields -- 06/05/2021
    // * Both dc:date and pubDate will be available in ISO 8601 format as isoDate -- 06/05/2021
    // * If author is specified, but not dc:creator, creator will be set to author (see article) -- 06/05/2021
    // * Atom's updated becomes lastBuildDate for consistency -- 06/05/2021

    // let itemsArray = [];

    feed.items.forEach(item => {

      // SELECT @@GLOBAL.sql_mode global, @@SESSION.sql_mode session;
      // SET sql_mode = '';
      // SET GLOBAL sql_mode = '';

      // * https://stackoverflow.com/questions/44304777/er-truncated-wrong-value-incorrect-datetime-value -- 06/05/2021 MF
      // * .replaceAll("T", " ").replaceAll("Z", "") are used to fix this issue. -- 06/09/2021 MF
      // * UnhandledPromiseRejectionWarning: TypeError: feed.updated.replaceAll is not a function -- 06/09/2021 MF

      let feedObject = {
        feedID: feed.id,
        feedTitle: feed.title,
        feedLink: feed.link,
        feedUpdated: feed.updated,
        feedLastBuildDate: feed.lastBuildDate,
        feedUrl: feed.feedUrl,
        itemID: item.id,
        itemTitle: item.title,
        itemLink: item.link,
        itemPubDate: item.pubDate,
        itemUpdated: item.updated,
        itemContent: item.content,
        itemContentSnippet: item.contentSnippet,
        itemISODate: item.isoDate,
        itemCreator: item.creator,
        itemAuthor: item.author,
        itemLinkFormatted: formatItemLink(item.link)
      };

      // itemsArray.push(feedObject);

      db("homeopapeRSSImport")
        // * .returning() is not supported by mysql and will not have any effect. -- 08/13/2021 MF
        // .returning(select)
        .insert(feedObject)
        .then((records) => {

          // records = convertBitTrueFalse(records);

          // addLog(componentName, `get /new ${url}`, { });

          // if (isEmpty(records) === false) {

          //   response.status(200).json({ primaryKeyID: records[0], transactionSuccess: true, errorOccurred: false, message: "Successfully added.", records: records });

          // } else {

          //   response.status(200).json({ primaryKeyID: null, transactionSuccess: false, errorOccurred: false, message: "Nothing to add." });

          // };

        })
        .catch((error) => {

          console.error(componentName, getDateTime(), "get /new error", error);

          addErrorLog(componentName, "get /new", {}, error);
          response.status(500).json({ transactionSuccess: false, errorOccurred: true, message: "Not successfully added." });

        });

    });

  })();

  addLog(componentName, "get /new ", { transactionSuccess: true, errorOccurred: false, message: `Successfully created ${tableName}.` });

  response.status(200).json({ transactionSuccess: true, errorOccurred: false, message: `Successfully created ${tableName}.` });

});


/******************************
 ***** Insert Fetch  *********
 ******************************/
router.get("/insert", (request, response) => {

  // INSERT INTO homeopapeRSS (feedID, feedTitle, feedLink, feedUpdated, feedLastBuildDate, feedUrl, itemID, itemTitle, itemLink, itemPubDate, itemUpdated, itemContent, itemContentSnippet, itemISODate, itemCreator, itemAuthor, itemLinkFormatted) SELECT DISTINCT feedID, feedTitle, feedLink, feedUpdated, feedLastBuildDate, feedUrl, itemID, itemTitle, itemLink, itemPubDate, itemUpdated, itemContent, itemContentSnippet, itemISODate, itemCreator, itemAuthor, itemLinkFormatted FROM homeopapeRSSImport WHERE itemID NOT IN (SELECT itemID FROM homeopapeRSS)

  let sqlQuery = "INSERT INTO homeopapeRSS (feedID, feedTitle, feedLink, feedUpdated, feedLastBuildDate, feedUrl, itemID, itemTitle, itemLink, itemPubDate, itemUpdated, itemContent, itemContentSnippet, itemISODate, itemCreator, itemAuthor, itemLinkFormatted) SELECT DISTINCT feedID, feedTitle, feedLink, feedUpdated, feedLastBuildDate, feedUrl, itemID, itemTitle, itemLink, itemPubDate, itemUpdated, itemContent, itemContentSnippet, itemISODate, itemCreator, itemAuthor, itemLinkFormatted FROM homeopapeRSSImport WHERE itemID NOT IN (SELECT itemID FROM homeopapeRSS)";

  // db.raw(sqlQuery).toSQL();

  db.raw(sqlQuery)
    .then((records) => {

      addLog(componentName, "get /insert", {});

      // records = convertBitTrueFalse(records);

      if (isEmpty(records) === false) {

        response.status(200).json({ primaryKeyID: records[0], transactionSuccess: true, errorOccurred: false, message: "Successfully added.", records: records });

      } else {

        response.status(200).json({ primaryKeyID: null, transactionSuccess: false, errorOccurred: false, message: "Nothing to add." });

      };

    })
    .catch((error) => {

      console.error(componentName, getDateTime(), "get /insert error", error);

      addErrorLog(componentName, "get /insert", {}, error);
      response.status(500).json({ transactionSuccess: false, errorOccurred: true, message: "Not successfully added." });

    });

});


/******************************
 ***** Update Fetch  *********
 ******************************/
router.get("/update", (request, response) => {

  // ! This SQL is specific to MySQL. -- 10/08/2022 MF
  let sqlQueryUpdateItemLinkDomain = "UPDATE homeopapeRSS SET itemLinkDomain = LEFT(REPLACE(REPLACE(REPLACE(REPLACE(REPLACE(REPLACE(itemLinkFormatted, 'https://www.', ''), 'http://www.', ''), 'https://m.', ''), 'http://m.', ''), 'https://', ''), 'http://', ''), LOCATE('/', REPLACE(REPLACE(REPLACE(REPLACE(REPLACE(REPLACE(itemLinkFormatted, 'https://www.', ''), 'http://www.', ''), 'https://m.', ''), 'http://m.', ''), 'https://', ''), 'http://', '')) - 1) WHERE itemLinkDomain IS NULL";
  // ! This SQL is specific to SQL Server. -- 10/08/2022 MF
  // let sqlQueryUpdateItemLinkDomain = "UPDATE homeopapeRSS SET itemLinkDomain = LEFT(REPLACE(REPLACE(REPLACE(REPLACE(REPLACE(REPLACE(itemLinkFormatted, 'https://www.', ''), 'http://www.', ''), 'https://m.', ''), 'http://m.', ''), 'https://', ''), 'http://', ''), CHARINDEX('/', REPLACE(REPLACE(REPLACE(REPLACE(REPLACE(REPLACE(itemLinkFormatted, 'https://www.', ''), 'http://www.', ''), 'https://m.', ''), 'http://m.', ''), 'https://', ''), 'http://', '')) - 1) WHERE itemLinkDomain IS NULL";

  // UPDATE homeopapeRSS SET viewed = 1, display = 0, alwaysFilter = 1 WHERE SUBSTRING_INDEX(SUBSTRING_INDEX(SUBSTRING_INDEX(SUBSTRING_INDEX(REPLACE(itemLink, 'https://www.google.com/url?rct=j&sa=t&url=', ''), '/', 3), '://', -1), '/', 1), '?', 1) IN (SELECT * FROM (SELECT DISTINCT SUBSTRING_INDEX(SUBSTRING_INDEX(SUBSTRING_INDEX(SUBSTRING_INDEX(REPLACE(itemLink, 'https://www.google.com/url?rct=j&sa=t&url=', ''), '/', 3), '://', -1), '/', 1), '?', 1) FROM homeopapeRSS WHERE alwaysFilter = 1) AS alwaysFiltered)

  // ! This SQL is specific to MySQL. -- 10/08/2022 MF
  // let sqlQueryAlwaysFiltered = "UPDATE homeopapeRSS SET viewed = 1, display = 0, alwaysFilter = 1 WHERE viewed = 0 AND SUBSTRING_INDEX(SUBSTRING_INDEX(SUBSTRING_INDEX(SUBSTRING_INDEX(REPLACE(itemLink, 'https://www.google.com/url?rct=j&sa=t&url=', ''), '/', 3), '://', -1), '/', 1), '?', 1) IN (SELECT * FROM (SELECT DISTINCT SUBSTRING_INDEX(SUBSTRING_INDEX(SUBSTRING_INDEX(SUBSTRING_INDEX(REPLACE(itemLink, 'https://www.google.com/url?rct=j&sa=t&url=', ''), '/', 3), '://', -1), '/', 1), '?', 1) FROM homeopapeRSS WHERE alwaysFilter = 1) AS alwaysFiltered)";
  let sqlQueryAlwaysFiltered = "UPDATE homeopapeRSS INNER JOIN (SELECT DISTINCT itemLinkDomain FROM homeopapeRSS WHERE alwaysFilter = 1) AS vw_homeopapeRSSAlwaysFilter ON homeopapeRSS.itemLinkDomain = vw_homeopapeRSSAlwaysFilter.itemLinkDomain SET viewed = 1, display = 0, alwaysFilter = 1 WHERE alwaysFilter = 0";
  // ! This SQL is specific to SQL Server. -- 10/08/2022 MF
  // let sqlQueryAlwaysFiltered = "UPDATE homeopapeRSS SET viewed = 1, display = 0, alwaysFilter = 1 FROM homeopapeRSS INNER JOIN (SELECT DISTINCT itemLinkDomain FROM homeopapeRSS WHERE alwaysFilter = 1) AS vw_homeopapeRSSAlwaysFilter ON homeopapeRSS.itemLinkDomain = vw_homeopapeRSSAlwaysFilter.itemLinkDomain WHERE alwaysFilter = 0";

  // db.raw(sqlQueryAlwaysFiltered).toSQL();

  // UPDATE homeopapeRSS SET viewed = 1, display = 0, alwaysFilter = 1 WHERE homeopapeID IN (SELECT * FROM (SELECT homeopapeID FROM homeopapeRSS WHERE itemLink LIKE '%.ebay.%' OR itemLink LIKE '%.reddit.%' OR itemLink LIKE '%.craigslist.%' OR itemLink LIKE '%.amazon.%' OR itemLink LIKE '%.audible.%' OR itemLink LIKE '%.pinterest.%' OR itemLink LIKE '%.twitter.%' OR itemLink LIKE '%.facebook.%' OR itemLink LIKE '%.tiktok.%' OR itemLink LIKE '%sites.google.%' OR itemLink LIKE '%books.google.%' OR itemLink LIKE '%elasticsearch.columbian.com%' OR itemLink LIKE '%news.ycombinator.com%' OR itemLink LIKE '%.overdrive.%') AS neverDisplay)

  // let sqlQueryNeverDisplay = "UPDATE homeopapeRSS SET viewed = 1, display = 0, alwaysFilter = 1 WHERE viewed = 0 AND homeopapeID IN (SELECT * FROM (SELECT homeopapeID FROM homeopapeRSS WHERE itemLink LIKE '%.ebay.%' OR itemLink LIKE '%.reddit.%' OR itemLink LIKE '%.craigslist.%' OR itemLink LIKE '%.amazon.%' OR itemLink LIKE '%.audible.%' OR itemLink LIKE '%.pinterest.%' OR itemLink LIKE '%.twitter.%' OR itemLink LIKE '%.facebook.%' OR itemLink LIKE '%.tiktok.%' OR itemLink LIKE '%sites.google.%' OR itemLink LIKE '%books.google.%' OR itemLink LIKE '%elasticsearch.columbian.com%' OR itemLink LIKE '%news.ycombinator.com%' OR itemLink LIKE '%.overdrive.%') AS neverDisplay)";
  // ! This SQL is specific to MySQL. -- 10/08/2022 MF
  let sqlQueryNeverDisplay = "UPDATE homeopapeRSS INNER JOIN vw_homeopapeRSSFilter ON homeopapeRSS.homeopapeID = vw_homeopapeRSSFilter.homeopapeID SET homeopapeRSS.viewed = vw_homeopapeRSSFilter.viewed, homeopapeRSS.display = vw_homeopapeRSSFilter.display, homeopapeRSS.alwaysFilter = vw_homeopapeRSSFilter.alwaysFilter WHERE homeopapeRSS.viewed <> 1 AND homeopapeRSS.display <> 1 AND homeopapeRSS.posted <> 1";
  // ! This SQL is specific to SQL Server. -- 10/08/2022 MF
  // let sqlQueryNeverDisplay = "UPDATE homeopapeRSS SET homeopapeRSS.viewed = vw_homeopapeRSSFilter.viewed, homeopapeRSS.display = vw_homeopapeRSSFilter.display, homeopapeRSS.alwaysFilter = vw_homeopapeRSSFilter.alwaysFilter FROM homeopapeRSS INNER JOIN vw_homeopapeRSSFilter ON homeopapeRSS.homeopapeID = vw_homeopapeRSSFilter.homeopapeID WHERE homeopapeRSS.viewed <> 1 AND homeopapeRSS.display <> 1 AND homeopapeRSS.posted <> 1";

  // db.raw(sqlQueryNeverDisplay).toSQL();

  // UPDATE homeopapeRSS SET viewed = 1, display = 0 WHERE homeopapeID IN (SELECT * FROM (SELECT homeopapeID FROM homeopapeRSS WHERE LOWER(itemTitle) LIKE '%pistorius%' OR LOWER(itemContentSnippet) LIKE '%pistorius%' OR LOWER(itemTitle) LIKE '%runner blade%' OR LOWER(itemContentSnippet) LIKE '%runner blade%' OR LOWER(itemTitle) LIKE '%major dp singh%' OR LOWER(itemContentSnippet) LIKE '%major dp singh%' OR LOWER(itemTitle) LIKE '%india''s first blade runner%' OR LOWER(itemContentSnippet) LIKE '%india''s first blade runner%' OR (LOWER(itemTitle) LIKE '%singh%' AND LOWER(itemTitle) LIKE '%blade runner%') OR (LOWER(itemContentSnippet) LIKE '%singh%' AND LOWER(itemContentSnippet) LIKE '%blade runner%') OR (LOWER(itemTitle) LIKE '%sahu%' AND LOWER(itemTitle) LIKE '%blade runner%') OR (LOWER(itemContentSnippet) LIKE '%sahu%' AND LOWER(itemContentSnippet) LIKE '%blade runner%')) AS neverDisplay)
  // // let sqlQueryHideStories = "UPDATE homeopapeRSS SET viewed = 1, display = 0 WHERE viewed = 0 AND homeopapeID IN (SELECT * FROM (SELECT homeopapeID FROM homeopapeRSS WHERE LOWER(itemTitle) LIKE '%\"road out of winter,\" winner of the 2021 philip k. dick award.%' OR LOWER(itemContentSnippet) LIKE '%\"road out of winter,\" winner of the 2021 philip k. dick award.%' or lower(itemTitle) LIKE '%blade runner: skinjobs, voxels, and future noir%' OR LOWER(itemContentSnippet) LIKE '%blade runner: skinjobs, voxels, and future noir%' OR LOWER(itemTitle) LIKE '%why blade runner 2049 is one of the best sequels of all time%' OR LOWER(itemContentSnippet) LIKE '%why blade runner 2049 is one of the best sequels of all time%' OR LOWER(itemTitle) LIKE '%split image of rick deckard in blade runner, et in et, and kirk in%' OR LOWER(itemContentSnippet) LIKE '%split image of rick deckard in blade runner, et in et, and kirk in%' OR LOWER(itemTitle) LIKE '%philip k. dick & hollywood: the essential movie adaptations%' OR LOWER(itemContentSnippet) LIKE '%philip k. dick & hollywood: the essential movie adaptations%' OR LOWER(itemTitle) LIKE '%phillip k. dick · space junk · the black knight satellite%' OR LOWER(itemContentSnippet) LIKE '%phillip k. dick · space junk · the black knight satellite%' OR LOWER(itemTitle) LIKE '%pistorius%' OR LOWER(itemContentSnippet) LIKE '%pistorius%' OR LOWER(itemTitle) LIKE '%runner blade%' OR LOWER(itemContentSnippet) LIKE '%runner blade%' OR LOWER(itemTitle) LIKE '%running blade%' OR LOWER(itemContentSnippet) LIKE '%running blade%' OR LOWER(itemTitle) LIKE '%major dp singh%' OR LOWER(itemContentSnippet) LIKE '%major dp singh%' OR LOWER(itemTitle) LIKE '%india''s first blade runner%' OR LOWER(itemContentSnippet) LIKE '%india''s first blade runner%' OR(LOWER(itemTitle) LIKE '%singh%' AND LOWER(itemTitle) LIKE '%blade runner%') OR(LOWER(itemContentSnippet) LIKE '%singh%' AND LOWER(itemContentSnippet) LIKE '%blade runner%') OR(LOWER(itemTitle) LIKE '%sahu%' AND LOWER(itemTitle) LIKE '%blade runner%') OR(LOWER(itemContentSnippet) LIKE '%sahu%' AND LOWER(itemContentSnippet) LIKE '%blade runner%') OR(LOWER(itemTitle) LIKE '%hunt-broersma%' AND LOWER(itemTitle) LIKE '%blade runner%') OR(LOWER(itemContentSnippet) LIKE '%hunt-broersma%' AND LOWER(itemContentSnippet) LIKE '%blade runner%') OR(LOWER(itemTitle) LIKE '%jerome%' AND LOWER(itemTitle) LIKE '%singleton%' AND LOWER(itemTitle) LIKE '%blade runner%') OR(LOWER(itemContentSnippet) LIKE '%jerome%' AND LOWER(itemContentSnippet) LIKE '%singleton%' AND LOWER(itemContentSnippet) LIKE '%blade runner%')) AS neverDisplay)";
  let sqlQueryHideStories = "UPDATE homeopapeRSS SET viewed = 1, display = 0 WHERE viewed = 0 AND homeopapeID IN (SELECT * FROM (SELECT homeopapeID FROM homeopapeRSS WHERE (LOWER(itemTitle) LIKE '%singh%' AND LOWER(itemTitle) LIKE '%blade runner%') OR (LOWER(itemContentSnippet) LIKE '%singh%' AND LOWER(itemContentSnippet) LIKE '%blade runner%') OR (LOWER(itemTitle) LIKE '%sahu%' AND LOWER(itemTitle) LIKE '%blade runner%') OR (LOWER(itemContentSnippet) LIKE '%sahu%' AND LOWER(itemContentSnippet) LIKE '%blade runner%') OR (LOWER(itemTitle) LIKE '%hunt-broersma%' AND LOWER(itemTitle) LIKE '%blade runner%') OR (LOWER(itemContentSnippet) LIKE '%hunt-broersma%' AND LOWER(itemContentSnippet) LIKE '%blade runner%') OR (LOWER(itemTitle) LIKE '%jerome%' AND LOWER(itemTitle) LIKE '%singleton%' AND LOWER(itemTitle) LIKE '%blade runner%') OR (LOWER(itemContentSnippet) LIKE '%jerome%' AND LOWER(itemContentSnippet) LIKE '%singleton%' AND LOWER(itemContentSnippet) LIKE '%blade runner%')) AS neverDisplay)";

  // db.raw(sqlQueryHideStories).toSQL();

  db.raw(sqlQueryUpdateItemLinkDomain)
    .then((records) => {

      addLog(componentName, "get /update sqlQueryUpdateItemLinkDomain", {});

      return db.raw(sqlQueryAlwaysFiltered);

    })
    .then((records) => {

      addLog(componentName, "get /update sqlQueryAlwaysFiltered", {});

      return db.raw(sqlQueryNeverDisplay);

    })
    .then((records) => {

      addLog(componentName, "get /update sqlQueryNeverDisplay", {});

      return db.raw(sqlQueryHideStories);

    })
    .then((records) => {

      addLog(componentName, "get /update sqlQueryHideStories", {});

      response.status(200).json({ transactionSuccess: true, errorOccurred: false, message: `Successfully updated ${tableName}.`, records: records });

    })
    .catch((error) => {

      console.error(componentName, getDateTime(), "get /update error", error);

      addErrorLog(componentName, "get /update", {}, error);
      response.status(500).json({ transactionSuccess: false, errorOccurred: true, message: "Not successfully updated." });

    });

});


/******************************
 ***** Mark All Viewed  *********
 ******************************/
router.get("/markviewed", (request, response) => {

  let sqlQuery = "UPDATE homeopapeRSS SET viewed = 1 WHERE viewed = 0";

  // db.raw(sqlQuery).toSQL();

  db.raw(sqlQuery)
    .then((records) => {

      // records = convertBitTrueFalse(records);

      if (isEmpty(records) === false) {

        response.status(200).json({ transactionSuccess: true, errorOccurred: false, message: `Successfully updated ${tableName}.`, records: records });

      } else {

        response.status(200).json({ transactionSuccess: false, errorOccurred: false, message: "Nothing to update." });

      };

    })
    .catch((error) => {

      console.error(componentName, getDateTime(), `get /markviewed error`, error);

      addErrorLog(componentName, "get /markviewed", {}, error);
      response.status(500).json({ transactionSuccess: false, errorOccurred: true, message: "Not successfully updated." });

    });

});


/******************************
 ***** Get Filters  *********
 ******************************/
router.get("/filter", (request, response) => {

  db.select("*")
    .from("homeopapeFilter")
    .orderBy([{ column: "filterText", order: "asc" }, { column: "filterLink", order: "asc" }])
    .then((records) => {

      records = convertBitTrueFalse(records);

      if (isEmpty(records) === false) {

        response.status(200).json({ transactionSuccess: true, errorOccurred: false, message: "Successfully retrieved records.", records: records });

      } else {

        response.status(200).json({ transactionSuccess: false, errorOccurred: false, message: "No records found." });

      };

    })
    .catch((error) => {

      console.error(componentName, getDateTime(), "get /filter error", error);

      addErrorLog(componentName, "get /filter", {}, error);
      response.status(500).json({ transactionSuccess: false, errorOccurred: true, message: "No records found." });

    });

});


/***************************
 *** Add  ***************
****************************/
router.post("/", validateAdmin, (request, response) => {

  const recordObject = {
    feedID: request.body.recordObject.feedID,
    feedTitle: request.body.recordObject.feedTitle,
    feedLink: request.body.recordObject.feedLink,
    feedUpdated: request.body.recordObject.feedUpdated,
    feedLastBuildDate: request.body.recordObject.feedLastBuildDate,
    feedUrl: request.body.recordObject.feedUrl,
    itemID: request.body.recordObject.itemID,
    itemTitle: request.body.recordObject.itemTitle,
    itemLink: request.body.recordObject.itemLink,
    itemPubDate: request.body.recordObject.itemPubDate,
    itemUpdated: request.body.recordObject.itemUpdated,
    itemContent: request.body.recordObject.itemContent,
    itemContentSnippet: request.body.recordObject.itemContentSnippet,
    itemISODate: request.body.recordObject.itemISODate,
    itemCreator: request.body.recordObject.itemCreator,
    itemAuthor: request.body.recordObject.itemAuthor,
    itemLinkFormatted: request.body.recordObject.itemLinkFormatted
  };

  db(tableName)
    // * .returning() is not supported by mysql and will not have any effect. -- 08/13/2021 MF
    // .returning(select)
    .insert(recordObject)
    .then((records) => {

      // records = convertBitTrueFalse(records);

      if (isEmpty(records) === false) {

        response.status(200).json({ primaryKeyID: records[0], transactionSuccess: true, errorOccurred: false, message: "Successfully added.", records: records });

      } else {

        response.status(200).json({ primaryKeyID: null, transactionSuccess: false, errorOccurred: false, message: "Nothing to add." });

      };

    })
    .catch((error) => {

      console.error(componentName, getDateTime(), "post / error", error);

      addErrorLog(componentName, "post /", request.body.recordObject, error);
      response.status(500).json({ transactionSuccess: false, errorOccurred: true, message: "Not successfully added." });

    });

});


/***************************
 *** Add Filter ***************
****************************/
router.post("/filter", (request, response) => {

  const recordObject = {
    filterLink: request.body.recordObject.filterLink,
    filterText: request.body.recordObject.filterText,
    viewed: request.body.recordObject.viewed,
    display: request.body.recordObject.display,
    alwaysFilter: request.body.recordObject.alwaysFilter
  };

  db("homeopapeFilter")
    // * .returning() is not supported by mysql and will not have any effect. -- 08/13/2021 MF
    // .returning(select)
    .insert(recordObject)
    .then((records) => {

      // records = convertBitTrueFalse(records);

      if (isEmpty(records) === false) {

        response.status(200).json({ primaryKeyID: records[0], transactionSuccess: true, errorOccurred: false, message: "Successfully added.", records: records });

      } else {

        response.status(200).json({ primaryKeyID: null, transactionSuccess: false, errorOccurred: false, message: "Nothing to add." });

      };

    })
    .catch((error) => {

      console.error(componentName, getDateTime(), "post /filter error", error);

      addErrorLog(componentName, "post /filter", {}, error);
      response.status(500).json({ transactionSuccess: false, errorOccurred: true, message: "Not successfully added." });

    });

});


/***************************
 ******* Hide Entry *******
 ***************************/
// * Allows the admin to display or not display an entry. -- 08/13/2021 MF
router.put("/display/:itemID", validateAdmin, (request, response) => {

  const recordObject = {
    display: request.body.recordObject.display
  };

  let itemID = `tag:google.com,2013:googlealerts/feed:${request.params.itemID}`;

  const where = { itemID: itemID };

  db(tableName)
    .where(where)
    // * .returning() is not supported by mysql and will not have any effect. -- 08/13/2021 MF
    // .returning(select)
    .update(recordObject)
    .then((records) => {

      // records = convertBitTrueFalse(records);

      if (isEmpty(records) === false) {

        response.status(200).json({ primaryKeyID: request.params.itemID, transactionSuccess: true, errorOccurred: false, message: "Successfully updated.", records: records });

      } else {

        response.status(200).json({ primaryKeyID: request.params.itemID, transactionSuccess: false, errorOccurred: false, message: "Nothing to update." });

      };

    })
    .catch((error) => {

      console.error(componentName, getDateTime(), `put /display/:itemID error`, error);

      addErrorLog(componentName, "put /display/:itemID", { itemID: request.params.itemID, recordObject: request.body.recordObject }, error);
      response.status(500).json({ transactionSuccess: false, errorOccurred: true, message: "Not successfully updated." });

    });

});


/***************************
 ******* Posted Entry *******
 ***************************/
// * Allows the admin to mark an entry as posted. -- 09/10/2021 MF
router.put("/posted/:itemID", validateAdmin, (request, response) => {

  const recordObject = {
    posted: request.body.recordObject.posted
  };

  let itemID = `tag:google.com,2013:googlealerts/feed:${request.params.itemID}`;

  const where = { itemID: itemID };

  db(tableName)
    .where(where)
    // * .returning() is not supported by mysql and will not have any effect. -- 08/13/2021 MF
    // .returning(select)
    .update(recordObject)
    .then((records) => {

      // records = convertBitTrueFalse(records);

      if (isEmpty(records) === false) {

        response.status(200).json({ primaryKeyID: request.params.itemID, transactionSuccess: true, errorOccurred: false, message: "Successfully updated.", records: records });

      } else {

        response.status(200).json({ primaryKeyID: request.params.itemID, transactionSuccess: false, errorOccurred: false, message: "Nothing to update." });

      };

    })
    .catch((error) => {

      console.error(componentName, getDateTime(), `put /posted/:itemID error`, error);

      addErrorLog(componentName, "put /posted/:itemID", { itemID: request.params.itemID, recordObject: request.body.recordObject }, error);
      response.status(500).json({ transactionSuccess: false, errorOccurred: true, message: "Not successfully updated." });

    });

});


/***************************
 ******* Always Filter Entry *******
 ***************************/
// * Allows the admin to mark an entry as always filter. -- 09/10/2021 MF
router.put("/alwaysFilter/:itemID", validateAdmin, (request, response) => {

  const recordObject = {
    alwaysFilter: request.body.recordObject.alwaysFilter
  };

  let itemID = `tag:google.com,2013:googlealerts/feed:${request.params.itemID}`;

  const where = { itemID: itemID };


  db(tableName)
    .where(where)
    // * .returning() is not supported by mysql and will not have any effect. -- 08/13/2021 MF
    // .returning(select)
    .update(recordObject)
    .then((records) => {

      // records = convertBitTrueFalse(records);

      if (isEmpty(records) === false) {

        response.status(200).json({ primaryKeyID: request.params.itemID, transactionSuccess: true, errorOccurred: false, message: "Successfully updated.", records: records });

      } else {

        response.status(200).json({ primaryKeyID: request.params.itemID, transactionSuccess: false, errorOccurred: false, message: "Nothing to update." });

      };

    })
    .catch((error) => {

      console.error(componentName, getDateTime(), `put /alwaysFilter/:itemID error`, error);

      addErrorLog(componentName, "put /alwaysFilter/:itemID", { itemID: request.params.itemID, recordObject: request.body.recordObject }, error);
      response.status(500).json({ transactionSuccess: false, errorOccurred: true, message: "Not successfully updated." });

    });

});


/***************************
 ******* Viewed Entry *******
 ***************************/
// * Allows the admin to mark an entry as viewed. -- 01/03/2022 MF
router.put("/viewed/:itemID", validateAdmin, (request, response) => {

  const recordObject = {
    viewed: request.body.recordObject.viewed
  };

  let itemID = `tag:google.com,2013:googlealerts/feed:${request.params.itemID}`;

  const where = { itemID: itemID };

  db(tableName)
    .where(where)
    // * .returning() is not supported by mysql and will not have any effect. -- 08/13/2021 MF
    // .returning(select)
    .update(recordObject)
    .then((records) => {

      // records = convertBitTrueFalse(records);

      if (isEmpty(records) === false) {

        response.status(200).json({ primaryKeyID: request.params.itemID, transactionSuccess: true, errorOccurred: false, message: "Successfully updated.", records: records });

      } else {

        response.status(200).json({ primaryKeyID: request.params.itemID, transactionSuccess: false, errorOccurred: false, message: "Nothing to update." });

      };

    })
    .catch((error) => {

      console.error(componentName, getDateTime(), `put /viewed/:itemID error`, error);

      addErrorLog(componentName, "put /viewed/:itemID", { itemID: request.params.itemID, recordObject: request.body.recordObject }, error);
      response.status(500).json({ transactionSuccess: false, errorOccurred: true, message: "Not successfully updated." });

    });

});


/***************************
 ******* Update Filter *******
 ***************************/
// * Allows the admin to update a filter. -- 01/03/2022 MF
router.put("/filter/:filterID", (request, response) => {

  const recordObject = {
    filterLink: request.body.recordObject.filterLink,
    filterText: request.body.recordObject.filterText,
    viewed: request.body.recordObject.viewed,
    display: request.body.recordObject.display,
    alwaysFilter: request.body.recordObject.alwaysFilter,
    active: request.body.recordObject.active
  };

  // * Check the parameters for SQL injection before creating the SQL statement. -- 08/09/2021 MF

  let filterID = isEmpty(request.params.filterID) === false ? request.params.filterID : "";

  if (isNaN(formatTrim(filterID)) === true) {

    filterID = 0;

  } else {

    filterID = parseInt(filterID);

  };

  const where = { filterID: filterID };

  db("homeopapeFilter")
    .where(where)
    // * .returning() is not supported by mysql and will not have any effect. -- 08/13/2021 MF
    // .returning(select)
    .update(recordObject)
    .then((records) => {

      // records = convertBitTrueFalse(records);

      if (isEmpty(records) === false) {

        response.status(200).json({ primaryKeyID: request.params.filterID, transactionSuccess: true, errorOccurred: false, message: "Successfully updated.", records: records });

      } else {

        response.status(200).json({ primaryKeyID: request.params.filterID, transactionSuccess: false, errorOccurred: false, message: "Nothing to update." });

      };

    })
    .catch((error) => {

      console.error(componentName, getDateTime(), `put /filter/:filterID error`, error);

      addErrorLog(componentName, "put /filter/:filterID", { filterID: request.params.filterID, recordObject: request.body.recordObject }, error);
      response.status(500).json({ transactionSuccess: false, errorOccurred: true, message: "Not successfully updated." });

    });

});


module.exports = router;