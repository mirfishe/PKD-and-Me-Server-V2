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

const controllerName = "fromthehomeopape";
const tableName = "homeopapeRSS";
// const select = "*";
// const orderBy = [{ column: "createDate", order: "desc" }];

// const Parser = require('rss-parser');

let records;


const formatItemLink = (itemLink) => {
  // console.log(controllerName, getDateTime(), "formatItemLink itemLink", itemLink);

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

  // if (/*newURL.includes("\%3F") === true || newURL.includes("\%3f") === true ||*/ newURL.includes("www.heavymetal.com")) {

  //   console.log(controllerName, getDateTime(), "formatPost itemLink.replaceAll(\"\%3F\", \"?\")", itemLink.replaceAll("\%3F", "?"));
  //   console.log(controllerName, getDateTime(), "formatPost itemLink.replaceAll(\"\%3F\", \"?\").replaceAll(\"\%3f\", \"?\").replaceAll(\"\%26\", \"&\").replaceAll(\"\%3D\", \"=\").replaceAll(\"\%3d\", \"=\")", itemLink.replaceAll("\%3F", "?").replaceAll("\%3f", "?").replaceAll("\%26", "&").replaceAll("\%3D", "=").replaceAll("\%3d", "="));
  //   console.log(controllerName, getDateTime(), "formatPost newURL", newURL);
  //   console.log(controllerName, getDateTime(), "formatPost decodeURI(itemLink)", decodeURI(itemLink));
  //   console.log(controllerName, getDateTime(), "formatPost decodeURI(newURL)", decodeURI(newURL));
  // };

  // * Remove fbclid= -- 06/26/2021 MF
  // * FaceBook analytics and tracking -- 06/26/2021 MF
  // * Removes everything after the fbclid= -- 06/26/2021 MF
  // * https://gist.github.com/hehe24h/acfa46c57bc4f37a5ca6814cb1652537 -- 06/26/2021 MF
  param = "fbclid";
  regExp = new RegExp("[?&]" + param + "=.*$");
  newURL = newURL.replace(regExp, "");
  // console.log(controllerName, getDateTime(), "formatPost newURL", newURL);

  // * Remove utm_medium= -- 06/26/2021 MF
  // * Google Analytics and tracking -- 06/26/2021 MF
  // * Removes everything after the utm_medium= -- 06/26/2021 MF
  param = "utm_medium";
  regExp = new RegExp("[?&]" + param + "=.*$");
  newURL = newURL.replace(regExp, "");
  // console.log(controllerName, getDateTime(), "formatPost newURL", newURL);

  // * Remove utm_campaign= -- 06/26/2021 MF
  // * Google Analytics and tracking -- 06/26/2021 MF
  // * Removes everything after the utm_campaign= -- 06/26/2021 MF
  param = "utm_campaign";
  regExp = new RegExp("[?&]" + param + "=.*$");
  newURL = newURL.replace(regExp, "");
  // console.log(controllerName, getDateTime(), "formatPost newURL", newURL);

  // * Remove utm_source= -- 06/26/2021 MF
  // * Google Analytics and tracking -- 06/26/2021 MF
  // * Removes everything after the utm_source= -- 06/26/2021 MF
  param = "utm_source";
  regExp = new RegExp("[?&]" + param + "=.*$");
  newURL = newURL.replace(regExp, "");
  // console.log(controllerName, getDateTime(), "formatPost newURL", newURL);

  // console.log(controllerName, getDateTime(), "formatItemLink newURL", newURL);

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

//   console.log(componentName, getDateTime(), "fetchNews feed", feed);
//   console.log(componentName, getDateTime(), "fetchNews feed.id", feed.id);
//   console.log(componentName, getDateTime(), "fetchNews feed.title", feed.title);
//   console.log(componentName, getDateTime(), "fetchNews feed.link", feed.link);
//   console.log(componentName, getDateTime(), "fetchNews feed.updated", feed.updated);
//   console.log(componentName, getDateTime(), "fetchNews feed.lastBuildDate", feed.lastBuildDate);

//   console.log(componentName, getDateTime(), "fetchNews feed.feedUrl", feed.feedUrl);

//   console.log(componentName, getDateTime(), "fetchNews feed.items", feed.items);

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

//     console.log(componentName, getDateTime(), "fetchNews item.id", item.id);
//     console.log(componentName, getDateTime(), "fetchNews item.title", item.title);
//     console.log(componentName, getDateTime(), "fetchNews item.link", item.link);
//     console.log(componentName, getDateTime(), "fetchNews item.pubDate", item.pubDate);
//     console.log(componentName, getDateTime(), "fetchNews item.updated", item.updated);
//     console.log(componentName, getDateTime(), "fetchNews item.content", item.content);
//     console.log(componentName, getDateTime(), "fetchNews item.contentSnippet", item.contentSnippet);
//     console.log(componentName, getDateTime(), "fetchNews item.isoDate", item.isoDate);
//     console.log(componentName, getDateTime(), "fetchNews item.creator", item.creator);
//     console.log(componentName, getDateTime(), "fetchNews item.author", item.author);
//     // console.log(componentName, getDateTime(), "fetchNews item.author.name", item.author.name);
//     // console.log(componentName, getDateTime(), "fetchNews item.name", item.name);

//     // console.log(componentName, getDateTime(), "fetchNews itemsArray", itemsArray);

//   });

//   console.log(componentName, getDateTime(), "fetchNews itemsArray", itemsArray);

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
  // let sqlQuery = `SELECT DISTINCT TOP ${topNumber }itemID, itemLink, itemTitle, itemContentSnippet, itemPubDate, viewed, display, alwaysFilter, posted FROM  ${tableName } ORDER BY itemPubDate DESC`;
  // let sqlQuery = `SELECT DISTINCT itemID, itemLink, itemTitle, itemContentSnippet, itemPubDate, viewed, display, alwaysFilter, posted FROM  ${tableName } ORDER BY itemPubDate DESC LIMIT ${topNumber}`;

  // db.raw(sqlQuery).toSQL();

  // console.log(`${controllerName}-controller`, getDateTime(), `get /:${controllerName}ID ${tableName}`, sqlQuery);

  db.distinct("itemID", "itemLink", "itemTitle", "itemContentSnippet", "itemPubDate", "viewed", "display", "alwaysFilter", "posted")
    .from(tableName)
    .where({ display: true })
    // ! The Order By isn't sorting correctly because the data type of this column is text and not datetime due to issues with inserting into the datetime column on the productions server. -- 08/13/2021 MF
    .orderBy([{ column: "itemPubDate", order: "desc" }])
    // .orderBy([{ column: "createDate", order: "desc" }])
    // db.raw(sqlQuery)
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
 ***** Get New Items To Review  *********
 ******************************/
router.get("/review", (request, response) => {

  // ! The Order By isn't sorting correctly because the data type of this column is text and not datetime due to issues with inserting into the datetime column on the productions server. -- 08/13/2021 MF
  // let sqlQuery = "SELECT DISTINCT itemLink, itemTitle, itemContentSnippet, itemPubDate FROM homeopapeRSS ORDER BY itemPubDate DESC";
  // let sqlQuery = `SELECT DISTINCT TOP ${topNumber }itemID, itemLink, itemTitle, itemContentSnippet, itemPubDate, viewed, display, alwaysFilter, posted FROM  ${tableName } ORDER BY itemPubDate DESC`;
  // let sqlQuery = `SELECT DISTINCT itemID, itemLink, itemTitle, itemContentSnippet, itemPubDate, viewed, display, alwaysFilter, posted FROM  ${tableName } ORDER BY itemPubDate DESC LIMIT ${topNumber}`;

  // db.raw(sqlQuery).toSQL();

  // console.log(`${controllerName}-controller`, getDateTime(), `get /review ${tableName}`, sqlQuery);

  db.distinct("itemID", "itemLink", "itemTitle", "itemContentSnippet", "itemPubDate", "viewed", "display", "alwaysFilter", "posted")
    .from(tableName)
    .where({ viewed: false })
    // ! The Order By isn't sorting correctly because the data type of this column is text and not datetime due to issues with inserting into the datetime column on the productions server. -- 08/13/2021 MF
    .orderBy([{ column: "itemPubDate", order: "desc" }])
    // .orderBy([{ column: "createDate", order: "desc" }])
    // db.raw(sqlQuery)
    .then((records) => {
      // console.log(`${controllerName}-controller`, getDateTime(), "", getDateTime(), `get /review ${tableName}`, records);

      records = convertBitTrueFalse(records);

      if (isEmpty(records) === false) {
        // console.log(`${controllerName}-controller`, getDateTime(), "", getDateTime(), `get /review ${tableName}`, records);

        response.status(200).json({ transactionSuccess: true, errorOccurred: false, message: "Successfully retrieved records.", records: records });

      } else {
        // console.log(`${controllerName}-controller`, getDateTime(), "get /review No Results");

        response.status(200).json({ transactionSuccess: false, errorOccurred: false, message: "No records found." });

      };

    })
    .catch((error) => {
      console.error(`${controllerName}-controller`, getDateTime(), "get /review error", error);

      addErrorLog(`${controllerName}-controller`, "get /review", records, error);
      response.status(500).json({ transactionSuccess: false, errorOccurred: true, message: "No records found." });

    });

});


/******************************
 ***** Get *********
 ******************************/
router.get("/top/:topNumber", (request, response) => {

  let topNumber = request.params.topNumber;

  if (isNaN(formatTrim(topNumber)) === true) {

    topNumber = 10;

  } else {

    topNumber = parseInt(topNumber);

  };

  // ! The Order By isn't sorting correctly because the data type of this column is text and not datetime due to issues with inserting into the datetime column on the productions server. -- 08/13/2021 MF
  // let sqlQuery = "SELECT DISTINCT itemLink, itemTitle, itemContentSnippet, itemPubDate FROM homeopapeRSS ORDER BY itemPubDate DESC";
  // let sqlQuery = `SELECT DISTINCT TOP ${topNumber }itemID, itemLink, itemTitle, itemContentSnippet, itemPubDate, viewed, display, alwaysFilter, posted FROM  ${tableName } ORDER BY itemPubDate DESC`;
  let sqlQuery = `SELECT DISTINCT itemID, itemLink, itemTitle, itemContentSnippet, itemPubDate, viewed, display, alwaysFilter, posted FROM ${tableName} ORDER BY itemPubDate DESC LIMIT ${topNumber}`;

  // db.raw(sqlQuery).toSQL();

  // console.log(`${controllerName}-controller`, getDateTime(), `get /top/:topNumber ${tableName}`, sqlQuery);

  // db.distinct("itemID", "itemLink", "itemTitle", "itemContentSnippet", "itemPubDate", "viewed", "display", "alwaysFilter", "posted")
  //   .from(tableName)
  //   // ! The Order By isn't sorting correctly because the data type of this column is text and not datetime due to issues with inserting into the datetime column on the productions server. -- 08/13/2021 MF
  //   .orderBy([{ column: "itemPubDate", order: "desc" }])
  //   // .orderBy([{ column: "createDate", order: "desc" }])
  db.raw(sqlQuery)
    .then((records) => {
      // console.log(`${controllerName}-controller`, getDateTime(), "", getDateTime(), `get /top/:topNumber ${tableName}`, records);

      records = convertBitTrueFalse(records);

      if (isEmpty(records) === false) {
        // console.log(`${controllerName}-controller`, getDateTime(), "", getDateTime(), `get /top/:topNumber ${tableName}`, records);

        response.status(200).json({ transactionSuccess: true, errorOccurred: false, message: "Successfully retrieved records.", records: records });

      } else {
        // console.log(`${controllerName}-controller`, getDateTime(), "get /top/:topNumber No Results");

        response.status(200).json({ transactionSuccess: false, errorOccurred: false, message: "No records found." });

      };

    })
    .catch((error) => {
      console.error(`${controllerName}-controller`, getDateTime(), "get /top/:topNumber error", error);

      addErrorLog(`${controllerName}-controller`, "get /top/:topNumber", records, error);
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

    // console.log(`${controllerName}-controller`, getDateTime(), "get /new feed", feed);
    // console.log(`${controllerName}-controller`, getDateTime(), "get /new feed.id", feed.id);
    // console.log(`${controllerName}-controller`, getDateTime(), "get /new feed.title", feed.title);
    // console.log(`${controllerName}-controller`, getDateTime(), "get /new feed.link", feed.link);
    // console.log(`${controllerName}-controller`, getDateTime(), "get /new feed.updated", feed.updated);
    // console.log(`${controllerName}-controller`, getDateTime(), "get /new feed.lastBuildDate", feed.lastBuildDate);

    // console.log(`${controllerName}-controller`, getDateTime(), "get /new feed.feedUrl", feed.feedUrl);

    // console.log(`${controllerName}-controller`, getDateTime(), "get /new feed.items", feed.items);

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

      // console.log(`${controllerName}-controller`, getDateTime(), "get /new item.id", item.id);
      // console.log(`${controllerName}-controller`, getDateTime(), "get /new item.title", item.title);
      // console.log(`${controllerName}-controller`, getDateTime(), "get /new item.link", item.link);
      // console.log(`${controllerName}-controller`, getDateTime(), "get /new item.pubDate", item.pubDate);
      // console.log(`${controllerName}-controller`, getDateTime(), "get /new item.updated", item.updated);
      // console.log(`${controllerName}-controller`, getDateTime(), "get /new item.content", item.content);
      // console.log(`${controllerName}-controller`, getDateTime(), "get /new item.contentSnippet", item.contentSnippet);
      // console.log(`${controllerName}-controller`, getDateTime(), "get /new item.isoDate", item.isoDate);
      // console.log(`${controllerName}-controller`, getDateTime(), "get /new item.creator", item.creator);
      // console.log(`${controllerName}-controller`, getDateTime(), "get /new item.author", item.author);
      // // console.log(`${controllerName}-controller`, getDateTime(), "get /new item.author.name", item.author.name);
      // // console.log(`${controllerName}-controller`, getDateTime(), "get /new item.name", item.name);

      // console.log(`${controllerName}-controller`, getDateTime(), "get /new itemsArray", itemsArray);

      db("homeopapeRSSImport")
        // * .returning() is not supported by mysql and will not have any effect. -- 08/13/2021 MF
        // .returning(select)
        .insert(feedObject)
        .then((records) => {
          // console.log(`${controllerName}-controller`, getDateTime(), "get /new records", records);
          // * Returns the ID value of the added record. -- 08/13/2021 MF

          // records = convertBitTrueFalse(records);

          // addLog(`${controllerName}-controller`, `get /new ${url}`, JSON.stringify({ records: records }));

          // if (isEmpty(records) === false) {
          //   // console.log(`${controllerName}-controller`, getDateTime(), "get /new records", records);

          //   response.status(200).json({ primaryKeyID: records[0], transactionSuccess: true, errorOccurred: false, message: "Successfully added.", records: records });

          // } else {
          //   // console.log(`${controllerName}-controller`, getDateTime(), "get /new No Results");

          //   response.status(200).json({ primaryKeyID: null, transactionSuccess: false, errorOccurred: false, message: "Nothing to add." });

          // };

        })
        .catch((error) => {
          console.error(`${controllerName}-controller`, getDateTime(), "get /new error", error);

          addErrorLog(`${controllerName}-controller`, "get /new", records, error);
          response.status(500).json({ transactionSuccess: false, errorOccurred: true, message: "Not successfully added." });

        });

    });

    // console.log(`${controllerName}-controller`, getDateTime(), "get /new itemsArray", itemsArray);

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

    // console.log(`${controllerName}-controller`, getDateTime(), "get /new feed", feed);
    // console.log(`${controllerName}-controller`, getDateTime(), "get /new feed.id", feed.id);
    // console.log(`${controllerName}-controller`, getDateTime(), "get /new feed.title", feed.title);
    // console.log(`${controllerName}-controller`, getDateTime(), "get /new feed.link", feed.link);
    // console.log(`${controllerName}-controller`, getDateTime(), "get /new feed.updated", feed.updated);
    // console.log(`${controllerName}-controller`, getDateTime(), "get /new feed.lastBuildDate", feed.lastBuildDate);

    // console.log(`${controllerName}-controller`, getDateTime(), "get /new feed.feedUrl", feed.feedUrl);

    // console.log(`${controllerName}-controller`, getDateTime(), "get /new feed.items", feed.items);

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

      // console.log(`${controllerName}-controller`, getDateTime(), "get /new item.id", item.id);
      // console.log(`${controllerName}-controller`, getDateTime(), "get /new item.title", item.title);
      // console.log(`${controllerName}-controller`, getDateTime(), "get /new item.link", item.link);
      // console.log(`${controllerName}-controller`, getDateTime(), "get /new item.pubDate", item.pubDate);
      // console.log(`${controllerName}-controller`, getDateTime(), "get /new item.updated", item.updated);
      // console.log(`${controllerName}-controller`, getDateTime(), "get /new item.content", item.content);
      // console.log(`${controllerName}-controller`, getDateTime(), "get /new item.contentSnippet", item.contentSnippet);
      // console.log(`${controllerName}-controller`, getDateTime(), "get /new item.isoDate", item.isoDate);
      // console.log(`${controllerName}-controller`, getDateTime(), "get /new item.creator", item.creator);
      // console.log(`${controllerName}-controller`, getDateTime(), "get /new item.author", item.author);
      // // console.log(`${controllerName}-controller`, getDateTime(), "get /new item.author.name", item.author.name);
      // // console.log(`${controllerName}-controller`, getDateTime(), "get /new item.name", item.name);

      // console.log(`${controllerName}-controller`, getDateTime(), "get /new itemsArray", itemsArray);

      db("homeopapeRSSImport")
        // * .returning() is not supported by mysql and will not have any effect. -- 08/13/2021 MF
        // .returning(select)
        .insert(feedObject)
        .then((records) => {
          // console.log(`${controllerName}-controller`, getDateTime(), "get /new records", records);
          // * Returns the ID value of the added record. -- 08/13/2021 MF

          // records = convertBitTrueFalse(records);

          // addLog(`${controllerName}-controller`, `get /new ${url}`, JSON.stringify({ records: records }));

          // if (isEmpty(records) === false) {
          //   // console.log(`${controllerName}-controller`, getDateTime(), "get /new records", records);

          //   response.status(200).json({ primaryKeyID: records[0], transactionSuccess: true, errorOccurred: false, message: "Successfully added.", records: records });

          // } else {
          //   // console.log(`${controllerName}-controller`, getDateTime(), "get /new No Results");

          //   response.status(200).json({ primaryKeyID: null, transactionSuccess: false, errorOccurred: false, message: "Nothing to add." });

          // };

        })
        .catch((error) => {
          console.error(`${controllerName}-controller`, getDateTime(), "get /new error", error);

          addErrorLog(`${controllerName}-controller`, "get /new", records, error);
          response.status(500).json({ transactionSuccess: false, errorOccurred: true, message: "Not successfully added." });

        });

    });

    // console.log(`${controllerName}-controller`, getDateTime(), "get /new itemsArray", itemsArray);

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

    // console.log(`${controllerName}-controller`, getDateTime(), "get /new feed", feed);
    // console.log(`${controllerName}-controller`, getDateTime(), "get /new feed.id", feed.id);
    // console.log(`${controllerName}-controller`, getDateTime(), "get /new feed.title", feed.title);
    // console.log(`${controllerName}-controller`, getDateTime(), "get /new feed.link", feed.link);
    // console.log(`${controllerName}-controller`, getDateTime(), "get /new feed.updated", feed.updated);
    // console.log(`${controllerName}-controller`, getDateTime(), "get /new feed.lastBuildDate", feed.lastBuildDate);

    // console.log(`${controllerName}-controller`, getDateTime(), "get /new feed.feedUrl", feed.feedUrl);

    // console.log(`${controllerName}-controller`, getDateTime(), "get /new feed.items", feed.items);

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

      // console.log(`${controllerName}-controller`, getDateTime(), "get /new item.id", item.id);
      // console.log(`${controllerName}-controller`, getDateTime(), "get /new item.title", item.title);
      // console.log(`${controllerName}-controller`, getDateTime(), "get /new item.link", item.link);
      // console.log(`${controllerName}-controller`, getDateTime(), "get /new item.pubDate", item.pubDate);
      // console.log(`${controllerName}-controller`, getDateTime(), "get /new item.updated", item.updated);
      // console.log(`${controllerName}-controller`, getDateTime(), "get /new item.content", item.content);
      // console.log(`${controllerName}-controller`, getDateTime(), "get /new item.contentSnippet", item.contentSnippet);
      // console.log(`${controllerName}-controller`, getDateTime(), "get /new item.isoDate", item.isoDate);
      // console.log(`${controllerName}-controller`, getDateTime(), "get /new item.creator", item.creator);
      // console.log(`${controllerName}-controller`, getDateTime(), "get /new item.author", item.author);
      // // console.log(`${controllerName}-controller`, getDateTime(), "get /new item.author.name", item.author.name);
      // // console.log(`${controllerName}-controller`, getDateTime(), "get /new item.name", item.name);

      // console.log(`${controllerName}-controller`, getDateTime(), "get /new itemsArray", itemsArray);

      db("homeopapeRSSImport")
        // * .returning() is not supported by mysql and will not have any effect. -- 08/13/2021 MF
        // .returning(select)
        .insert(feedObject)
        .then((records) => {
          // console.log(`${controllerName}-controller`, getDateTime(), "get /new records", records);
          // * Returns the ID value of the added record. -- 08/13/2021 MF

          // records = convertBitTrueFalse(records);

          // addLog(`${controllerName}-controller`, `get /new ${url}`, JSON.stringify({ records: records }));

          // if (isEmpty(records) === false) {
          //   // console.log(`${controllerName}-controller`, getDateTime(), "get /new records", records);

          //   response.status(200).json({ primaryKeyID: records[0], transactionSuccess: true, errorOccurred: false, message: "Successfully added.", records: records });

          // } else {
          //   // console.log(`${controllerName}-controller`, getDateTime(), "get /new No Results");

          //   response.status(200).json({ primaryKeyID: null, transactionSuccess: false, errorOccurred: false, message: "Nothing to add." });

          // };

        })
        .catch((error) => {
          console.error(`${controllerName}-controller`, getDateTime(), "get /new error", error);

          addErrorLog(`${controllerName}-controller`, "get /new", records, error);
          response.status(500).json({ transactionSuccess: false, errorOccurred: true, message: "Not successfully added." });

        });

    });

    // console.log(`${controllerName}-controller`, getDateTime(), "get /new itemsArray", itemsArray);

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

    // console.log(`${controllerName}-controller`, getDateTime(), "get /new feed", feed);
    // console.log(`${controllerName}-controller`, getDateTime(), "get /new feed.id", feed.id);
    // console.log(`${controllerName}-controller`, getDateTime(), "get /new feed.title", feed.title);
    // console.log(`${controllerName}-controller`, getDateTime(), "get /new feed.link", feed.link);
    // console.log(`${controllerName}-controller`, getDateTime(), "get /new feed.updated", feed.updated);
    // console.log(`${controllerName}-controller`, getDateTime(), "get /new feed.lastBuildDate", feed.lastBuildDate);

    // console.log(`${controllerName}-controller`, getDateTime(), "get /new feed.feedUrl", feed.feedUrl);

    // console.log(`${controllerName}-controller`, getDateTime(), "get /new feed.items", feed.items);

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

      // console.log(`${controllerName}-controller`, getDateTime(), "get /new item.id", item.id);
      // console.log(`${controllerName}-controller`, getDateTime(), "get /new item.title", item.title);
      // console.log(`${controllerName}-controller`, getDateTime(), "get /new item.link", item.link);
      // console.log(`${controllerName}-controller`, getDateTime(), "get /new item.pubDate", item.pubDate);
      // console.log(`${controllerName}-controller`, getDateTime(), "get /new item.updated", item.updated);
      // console.log(`${controllerName}-controller`, getDateTime(), "get /new item.content", item.content);
      // console.log(`${controllerName}-controller`, getDateTime(), "get /new item.contentSnippet", item.contentSnippet);
      // console.log(`${controllerName}-controller`, getDateTime(), "get /new item.isoDate", item.isoDate);
      // console.log(`${controllerName}-controller`, getDateTime(), "get /new item.creator", item.creator);
      // console.log(`${controllerName}-controller`, getDateTime(), "get /new item.author", item.author);
      // // console.log(`${controllerName}-controller`, getDateTime(), "get /new item.author.name", item.author.name);
      // // console.log(`${controllerName}-controller`, getDateTime(), "get /new item.name", item.name);

      // console.log(`${controllerName}-controller`, getDateTime(), "get /new itemsArray", itemsArray);

      db("homeopapeRSSImport")
        // * .returning() is not supported by mysql and will not have any effect. -- 08/13/2021 MF
        // .returning(select)
        .insert(feedObject)
        .then((records) => {
          // console.log(`${controllerName}-controller`, getDateTime(), "get /new records", records);
          // * Returns the ID value of the added record. -- 08/13/2021 MF

          // records = convertBitTrueFalse(records);

          // addLog(`${controllerName}-controller`, `get /new ${url}`, JSON.stringify({ records: records }));

          // if (isEmpty(records) === false) {
          //   // console.log(`${controllerName}-controller`, getDateTime(), "get /new records", records);

          //   response.status(200).json({ primaryKeyID: records[0], transactionSuccess: true, errorOccurred: false, message: "Successfully added.", records: records });

          // } else {
          //   // console.log(`${controllerName}-controller`, getDateTime(), "get /new No Results");

          //   response.status(200).json({ primaryKeyID: null, transactionSuccess: false, errorOccurred: false, message: "Nothing to add." });

          // };

        })
        .catch((error) => {
          console.error(`${controllerName}-controller`, getDateTime(), "get /new error", error);

          addErrorLog(`${controllerName}-controller`, "get /new", records, error);
          response.status(500).json({ transactionSuccess: false, errorOccurred: true, message: "Not successfully added." });

        });

    });

    // console.log(`${controllerName}-controller`, getDateTime(), "get /new itemsArray", itemsArray);

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

    // console.log(`${controllerName}-controller`, getDateTime(), "get /new feed", feed);
    // console.log(`${controllerName}-controller`, getDateTime(), "get /new feed.id", feed.id);
    // console.log(`${controllerName}-controller`, getDateTime(), "get /new feed.title", feed.title);
    // console.log(`${controllerName}-controller`, getDateTime(), "get /new feed.link", feed.link);
    // console.log(`${controllerName}-controller`, getDateTime(), "get /new feed.updated", feed.updated);
    // console.log(`${controllerName}-controller`, getDateTime(), "get /new feed.lastBuildDate", feed.lastBuildDate);

    // console.log(`${controllerName}-controller`, getDateTime(), "get /new feed.feedUrl", feed.feedUrl);

    // console.log(`${controllerName}-controller`, getDateTime(), "get /new feed.items", feed.items);

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

      // console.log(`${controllerName}-controller`, getDateTime(), "get /new item.id", item.id);
      // console.log(`${controllerName}-controller`, getDateTime(), "get /new item.title", item.title);
      // console.log(`${controllerName}-controller`, getDateTime(), "get /new item.link", item.link);
      // console.log(`${controllerName}-controller`, getDateTime(), "get /new item.pubDate", item.pubDate);
      // console.log(`${controllerName}-controller`, getDateTime(), "get /new item.updated", item.updated);
      // console.log(`${controllerName}-controller`, getDateTime(), "get /new item.content", item.content);
      // console.log(`${controllerName}-controller`, getDateTime(), "get /new item.contentSnippet", item.contentSnippet);
      // console.log(`${controllerName}-controller`, getDateTime(), "get /new item.isoDate", item.isoDate);
      // console.log(`${controllerName}-controller`, getDateTime(), "get /new item.creator", item.creator);
      // console.log(`${controllerName}-controller`, getDateTime(), "get /new item.author", item.author);
      // // console.log(`${controllerName}-controller`, getDateTime(), "get /new item.author.name", item.author.name);
      // // console.log(`${controllerName}-controller`, getDateTime(), "get /new item.name", item.name);

      // console.log(`${controllerName}-controller`, getDateTime(), "get /new itemsArray", itemsArray);

      db("homeopapeRSSImport")
        // * .returning() is not supported by mysql and will not have any effect. -- 08/13/2021 MF
        // .returning(select)
        .insert(feedObject)
        .then((records) => {
          // console.log(`${controllerName}-controller`, getDateTime(), "get /new records", records);
          // * Returns the ID value of the added record. -- 08/13/2021 MF

          // records = convertBitTrueFalse(records);

          // addLog(`${controllerName}-controller`, `get /new ${url}`, JSON.stringify({ records: records }));

          // if (isEmpty(records) === false) {
          //   // console.log(`${controllerName}-controller`, getDateTime(), "get /new records", records);

          //   response.status(200).json({ primaryKeyID: records[0], transactionSuccess: true, errorOccurred: false, message: "Successfully added.", records: records });

          // } else {
          //   // console.log(`${controllerName}-controller`, getDateTime(), "get /new No Results");

          //   response.status(200).json({ primaryKeyID: null, transactionSuccess: false, errorOccurred: false, message: "Nothing to add." });

          // };

        })
        .catch((error) => {
          console.error(`${controllerName}-controller`, getDateTime(), "get /new error", error);

          addErrorLog(`${controllerName}-controller`, "get /new", records, error);
          response.status(500).json({ transactionSuccess: false, errorOccurred: true, message: "Not successfully added." });

        });

    });

    // console.log(`${controllerName}-controller`, getDateTime(), "get /new itemsArray", itemsArray);

  })();

  addLog(`${controllerName}-controller`, "get /new ", JSON.stringify({ transactionSuccess: true, errorOccurred: false, message: `Successfully created ${tableName}.` }));

  response.status(200).json({ transactionSuccess: true, errorOccurred: false, message: `Successfully created ${tableName}.` });

});


/******************************
 ***** Insert Fetch  *********
 ******************************/
router.get("/insert", (request, response) => {

  // INSERT INTO homeopapeRSS (feedID, feedTitle, feedLink, feedUpdated, feedLastBuildDate, feedUrl, itemID, itemTitle, itemLink, itemPubDate, itemUpdated, itemContent, itemContentSnippet, itemISODate, itemCreator, itemAuthor, itemLinkFormatted) SELECT DISTINCT feedID, feedTitle, feedLink, feedUpdated, feedLastBuildDate, feedUrl, itemID, itemTitle, itemLink, itemPubDate, itemUpdated, itemContent, itemContentSnippet, itemISODate, itemCreator, itemAuthor, itemLinkFormatted FROM homeopapeRSSImport WHERE itemID NOT IN (SELECT itemID FROM homeopapeRSS)

  let sqlQuery = "INSERT INTO homeopapeRSS (feedID, feedTitle, feedLink, feedUpdated, feedLastBuildDate, feedUrl, itemID, itemTitle, itemLink, itemPubDate, itemUpdated, itemContent, itemContentSnippet, itemISODate, itemCreator, itemAuthor, itemLinkFormatted) SELECT DISTINCT feedID, feedTitle, feedLink, feedUpdated, feedLastBuildDate, feedUrl, itemID, itemTitle, itemLink, itemPubDate, itemUpdated, itemContent, itemContentSnippet, itemISODate, itemCreator, itemAuthor, itemLinkFormatted FROM homeopapeRSSImport WHERE itemID NOT IN (SELECT itemID FROM homeopapeRSS)";

  // db.raw(sqlQuery).toSQL();

  // console.log(`${controllerName}-controller`, getDateTime(), "get /insert", sqlQuery);

  db.raw(sqlQuery)
    .then((records) => {
      // console.log(`${controllerName}-controller`, getDateTime(), "get /insert records", records);
      // * Returns the ID value of the added record. -- 08/13/2021 MF

      addLog(`${controllerName}-controller`, "get /insert", JSON.stringify({ records: records }));

      // records = convertBitTrueFalse(records);

      if (isEmpty(records) === false) {
        // console.log(`${controllerName}-controller`, getDateTime(), "get /insert records", records);

        response.status(200).json({ primaryKeyID: records[0], transactionSuccess: true, errorOccurred: false, message: "Successfully added.", records: records });

      } else {
        // console.log(`${controllerName}-controller`, getDateTime(), "get /insert No Results");

        response.status(200).json({ primaryKeyID: null, transactionSuccess: false, errorOccurred: false, message: "Nothing to add." });

      };

    })
    .catch((error) => {
      console.error(`${controllerName}-controller`, getDateTime(), "get /insert error", error);

      addErrorLog(`${controllerName}-controller`, "get /insert", records, error);
      response.status(500).json({ transactionSuccess: false, errorOccurred: true, message: "Not successfully added." });

    });

});


/******************************
 ***** Update Fetch  *********
 ******************************/
router.get("/update", (request, response) => {

  // UPDATE homeopapeRSS SET viewed = 1, display = 0, alwaysFilter = 1 WHERE SUBSTRING_INDEX(SUBSTRING_INDEX(SUBSTRING_INDEX(SUBSTRING_INDEX(REPLACE(itemLink, 'https://www.google.com/url?rct=j&sa=t&url=', ''), '/', 3), '://', -1), '/', 1), '?', 1) IN (SELECT * FROM (SELECT DISTINCT SUBSTRING_INDEX(SUBSTRING_INDEX(SUBSTRING_INDEX(SUBSTRING_INDEX(REPLACE(itemLink, 'https://www.google.com/url?rct=j&sa=t&url=', ''), '/', 3), '://', -1), '/', 1), '?', 1) FROM homeopapeRSS WHERE alwaysFilter = 1) AS alwaysFiltered)

  let sqlQueryAlwaysFiltered = "UPDATE homeopapeRSS SET viewed = 1, display = 0, alwaysFilter = 1 WHERE SUBSTRING_INDEX(SUBSTRING_INDEX(SUBSTRING_INDEX(SUBSTRING_INDEX(REPLACE(itemLink, 'https://www.google.com/url?rct=j&sa=t&url=', ''), '/', 3), '://', -1), '/', 1), '?', 1) IN (SELECT * FROM (SELECT DISTINCT SUBSTRING_INDEX(SUBSTRING_INDEX(SUBSTRING_INDEX(SUBSTRING_INDEX(REPLACE(itemLink, 'https://www.google.com/url?rct=j&sa=t&url=', ''), '/', 3), '://', -1), '/', 1), '?', 1) FROM homeopapeRSS WHERE alwaysFilter = 1) AS alwaysFiltered)";

  // db.raw(sqlQueryAlwaysFiltered).toSQL();

  // console.log(`${controllerName}-controller`, getDateTime(), "get /update", sqlQueryAlwaysFiltered);


  // UPDATE homeopapeRSS SET viewed = 1, display = 0, alwaysFilter = 1 WHERE homeopapeID IN (SELECT * FROM (SELECT homeopapeID FROM homeopapeRSS WHERE itemLink LIKE '%.ebay.%' OR itemLink LIKE '%.reddit.%' OR itemLink LIKE '%.craigslist.%' OR itemLink LIKE '%.amazon.%' OR itemLink LIKE '%.audible.%' OR itemLink LIKE '%.pinterest.%' OR itemLink LIKE '%.twitter.%' OR itemLink LIKE '%.facebook.%' OR itemLink LIKE '%.tiktok.%' OR itemLink LIKE '%sites.google.%' OR itemLink LIKE '%books.google.%' OR itemLink LIKE '%elasticsearch.columbian.com%' OR itemLink LIKE '%news.ycombinator.com%' OR itemLink LIKE '%.overdrive.%') AS neverDisplay)

  let sqlQueryNeverDisplay = "UPDATE homeopapeRSS SET viewed = 1, display = 0, alwaysFilter = 1 WHERE homeopapeID IN (SELECT * FROM (SELECT homeopapeID FROM homeopapeRSS WHERE itemLink LIKE '%.ebay.%' OR itemLink LIKE '%.reddit.%' OR itemLink LIKE '%.craigslist.%' OR itemLink LIKE '%.amazon.%' OR itemLink LIKE '%.audible.%' OR itemLink LIKE '%.pinterest.%' OR itemLink LIKE '%.twitter.%' OR itemLink LIKE '%.facebook.%' OR itemLink LIKE '%.tiktok.%' OR itemLink LIKE '%sites.google.%' OR itemLink LIKE '%books.google.%' OR itemLink LIKE '%elasticsearch.columbian.com%' OR itemLink LIKE '%news.ycombinator.com%' OR itemLink LIKE '%.overdrive.%') AS neverDisplay)";

  // db.raw(sqlQueryNeverDisplay).toSQL();

  // console.log(`${controllerName}-controller`, getDateTime(), "get /update", sqlQueryNeverDisplay);


  // UPDATE homeopapeRSS SET viewed = 1, display = 0 WHERE homeopapeID IN (SELECT * FROM (SELECT homeopapeID FROM homeopapeRSS WHERE LOWER(itemTitle) LIKE '%pistorius%' OR LOWER(itemContentSnippet) LIKE '%pistorius%' OR LOWER(itemTitle) LIKE '%runner blade%' OR LOWER(itemContentSnippet) LIKE '%runner blade%' OR LOWER(itemTitle) LIKE '%major dp singh%' OR LOWER(itemContentSnippet) LIKE '%major dp singh%' OR LOWER(itemTitle) LIKE '%india''s first blade runner%' OR LOWER(itemContentSnippet) LIKE '%india''s first blade runner%' OR (LOWER(itemTitle) LIKE '%singh%' AND LOWER(itemTitle) LIKE '%blade runner%') OR (LOWER(itemContentSnippet) LIKE '%singh%' AND LOWER(itemContentSnippet) LIKE '%blade runner%') OR (LOWER(itemTitle) LIKE '%sahu%' AND LOWER(itemTitle) LIKE '%blade runner%') OR (LOWER(itemContentSnippet) LIKE '%sahu%' AND LOWER(itemContentSnippet) LIKE '%blade runner%')) AS neverDisplay)

  let sqlQueryHideStories = "UPDATE homeopapeRSS SET viewed = 1, display = 0 WHERE homeopapeID IN (SELECT * FROM (SELECT homeopapeID FROM homeopapeRSS WHERE LOWER(itemTitle) LIKE '%pistorius%' OR LOWER(itemContentSnippet) LIKE '%pistorius%' OR LOWER(itemTitle) LIKE '%runner blade%' OR LOWER(itemContentSnippet) LIKE '%runner blade%' OR LOWER(itemTitle) LIKE '%running blade%' OR LOWER(itemContentSnippet) LIKE '%running blade%' OR LOWER(itemTitle) LIKE '%major dp singh%' OR LOWER(itemContentSnippet) LIKE '%major dp singh%' OR LOWER(itemTitle) LIKE '%india''s first blade runner%' OR LOWER(itemContentSnippet) LIKE '%india''s first blade runner%' OR (LOWER(itemTitle) LIKE '%singh%' AND LOWER(itemTitle) LIKE '%blade runner%') OR (LOWER(itemContentSnippet) LIKE '%singh%' AND LOWER(itemContentSnippet) LIKE '%blade runner%') OR (LOWER(itemTitle) LIKE '%sahu%' AND LOWER(itemTitle) LIKE '%blade runner%') OR (LOWER(itemContentSnippet) LIKE '%sahu%' AND LOWER(itemContentSnippet) LIKE '%blade runner%') OR (LOWER(itemTitle) LIKE '%hunt-broersma%' AND LOWER(itemTitle) LIKE '%blade runner%') OR (LOWER(itemContentSnippet) LIKE '%hunt-broersma%' AND LOWER(itemContentSnippet) LIKE '%blade runner%') OR (LOWER(itemTitle) LIKE '%jerome%' AND LOWER(itemTitle) LIKE '%singleton%' AND LOWER(itemTitle) LIKE '%blade runner%') OR (LOWER(itemContentSnippet) LIKE '%jerome%' AND LOWER(itemContentSnippet) LIKE '%singleton%' AND LOWER(itemContentSnippet) LIKE '%blade runner%')) AS neverDisplay)";

  // db.raw(sqlQueryHideStories).toSQL();

  // console.log(`${controllerName}-controller`, getDateTime(), "get /update", sqlQueryHideStories);


  db.raw(sqlQueryAlwaysFiltered)
    .then((records) => {
      // console.log(`${controllerName}-controller`, getDateTime(), "get /update records", records);

      addLog(`${controllerName}-controller`, "get /update sqlQueryAlwaysFiltered", JSON.stringify({ records: records }));

      return db.raw(sqlQueryNeverDisplay);

    })
    .then((records) => {
      // console.log(`${controllerName}-controller`, getDateTime(), "get /update records", records);

      addLog(`${controllerName}-controller`, "get /update sqlQueryNeverDisplay", JSON.stringify({ records: records }));

      return db.raw(sqlQueryHideStories);

    })
    .then((records) => {
      // console.log(`${controllerName}-controller`, getDateTime(), "get /update records", records);

      addLog(`${controllerName}-controller`, "get /update sqlQueryHideStories", JSON.stringify({ records: records }));

      response.status(200).json({ transactionSuccess: true, errorOccurred: false, message: `Successfully updated ${tableName}.`, records: records });

    })
    .catch((error) => {
      console.error(`${controllerName}-controller`, getDateTime(), "get /update error", error);

      addErrorLog(`${controllerName}-controller`, "get /update", records, error);
      response.status(500).json({ transactionSuccess: false, errorOccurred: true, message: "Not successfully updated." });

    });

});


/******************************
 ***** Mark All Viewed  *********
 ******************************/
router.get("/markviewed", (request, response) => {

  let sqlQuery = "UPDATE homeopapeRSS SET viewed = 1 WHERE viewed = 0";

  // db.raw(sqlQuery).toSQL();

  // console.log(`${controllerName}-controller`, getDateTime(), `get /markviewed`, sqlQuery);

  db.raw(sqlQuery)
    .then((records) => {
      // console.log(`${controllerName}-controller`, getDateTime(), "", getDateTime(), `get /markviewed`, records);

      // records = convertBitTrueFalse(records);

      if (isEmpty(records) === false) {
        // console.log(`${controllerName}-controller`, getDateTime(), "", getDateTime(), `get /markviewed`, records);

        response.status(200).json({ transactionSuccess: true, errorOccurred: false, message: `Successfully updated ${tableName}.`, records: records });

      } else {
        // console.log(`${controllerName}-controller`, getDateTime(), `get /markviewed No Results`);

        response.status(200).json({ transactionSuccess: false, errorOccurred: false, message: "Nothing to update." });

      };

    })
    .catch((error) => {
      console.error(`${controllerName}-controller`, getDateTime(), `get /markviewed error`, error);

      addErrorLog(`${controllerName}-controller`, "get /markviewed", records, error);
      response.status(500).json({ transactionSuccess: false, errorOccurred: true, message: "Not successfully updated." });

    });

});


/* ******************************
 *** Add  ***************
*********************************/
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
      // console.log(`${controllerName}-controller`, getDateTime(), "post / records", records);
      // * Returns the ID value of the added record. -- 08/13/2021 MF

      // records = convertBitTrueFalse(records);

      if (isEmpty(records) === false) {
        // console.log(`${controllerName}-controller`, getDateTime(), "post / records", records);

        response.status(200).json({ primaryKeyID: records[0], transactionSuccess: true, errorOccurred: false, message: "Successfully added.", records: records });

      } else {
        // console.log(`${controllerName}-controller`, getDateTime(), "post / No Results");

        response.status(200).json({ primaryKeyID: null, transactionSuccess: false, errorOccurred: false, message: "Nothing to add." });

      };

    })
    .catch((error) => {
      console.error(`${controllerName}-controller`, getDateTime(), "post / error", error);

      addErrorLog(`${controllerName}-controller`, "post /", records, error);
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

  // itemID.replace("tag:google.com,2013:googlealerts/feed:", "");

  // const where = { itemID: request.params.itemID };
  const where = { itemID: itemID };

  // console.log(`${controllerName}-controller`, getDateTime(), `put /display/:itemID itemID`, itemID);

  db(tableName)
    .where(where)
    // * .returning() is not supported by mysql and will not have any effect. -- 08/13/2021 MF
    // .returning(select)
    .update(recordObject)
    .then((records) => {
      // console.log(`${controllerName}-controller`, getDateTime(), `put /display/:itemID records`, records);
      // * Returns the number of updated records. -- 08/13/2021 MF

      // records = convertBitTrueFalse(records);

      if (isEmpty(records) === false) {
        // console.log(`${controllerName}-controller`, getDateTime(), `put /display/:itemID records`, records);

        response.status(200).json({ primaryKeyID: request.params.itemID, transactionSuccess: true, errorOccurred: false, message: "Successfully updated.", records: records });

      } else {
        // console.log(`${controllerName}-controller`, getDateTime(), `put /display/:itemID No Results`);

        response.status(200).json({ primaryKeyID: request.params.itemID, transactionSuccess: false, errorOccurred: false, message: "Nothing to update." });

      };

    })
    .catch((error) => {
      console.error(`${controllerName}-controller`, getDateTime(), `put /display/:itemID error`, error);

      addErrorLog(`${controllerName}-controller`, "put /display/:itemID", records, error);
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

  // itemID.replace("tag:google.com,2013:googlealerts/feed:", "");

  // const where = { itemID: request.params.itemID };
  const where = { itemID: itemID };

  // console.log(`${controllerName}-controller`, getDateTime(), `put /posted/:itemID itemID`, itemID);

  db(tableName)
    .where(where)
    // * .returning() is not supported by mysql and will not have any effect. -- 08/13/2021 MF
    // .returning(select)
    .update(recordObject)
    .then((records) => {
      // console.log(`${controllerName}-controller`, getDateTime(), `put /posted/:itemID records`, records);
      // * Returns the number of updated records. -- 08/13/2021 MF

      // records = convertBitTrueFalse(records);

      if (isEmpty(records) === false) {
        // console.log(`${controllerName}-controller`, getDateTime(), `put /posted/:itemID records`, records);

        response.status(200).json({ primaryKeyID: request.params.itemID, transactionSuccess: true, errorOccurred: false, message: "Successfully updated.", records: records });

      } else {
        // console.log(`${controllerName}-controller`, getDateTime(), `put /posted/:itemID No Results`);

        response.status(200).json({ primaryKeyID: request.params.itemID, transactionSuccess: false, errorOccurred: false, message: "Nothing to update." });

      };

    })
    .catch((error) => {
      console.error(`${controllerName}-controller`, getDateTime(), `put /posted/:itemID error`, error);

      addErrorLog(`${controllerName}-controller`, "put /posted/:itemID", records, error);
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

  // itemID.replace("tag:google.com,2013:googlealerts/feed:", "");

  // const where = { itemID: request.params.itemID };
  const where = { itemID: itemID };

  // console.log(`${controllerName}-controller`, getDateTime(), `put /alwaysFilter/:itemID itemID`, itemID);

  db(tableName)
    .where(where)
    // * .returning() is not supported by mysql and will not have any effect. -- 08/13/2021 MF
    // .returning(select)
    .update(recordObject)
    .then((records) => {
      // console.log(`${controllerName}-controller`, getDateTime(), `put /alwaysFilter/:itemID records`, records);
      // * Returns the number of updated records. -- 08/13/2021 MF

      // records = convertBitTrueFalse(records);

      if (isEmpty(records) === false) {
        // console.log(`${controllerName}-controller`, getDateTime(), `put /alwaysFilter/:itemID records`, records);

        response.status(200).json({ primaryKeyID: request.params.itemID, transactionSuccess: true, errorOccurred: false, message: "Successfully updated.", records: records });

      } else {
        // console.log(`${controllerName}-controller`, getDateTime(), `put /alwaysFilter/:itemID No Results`);

        response.status(200).json({ primaryKeyID: request.params.itemID, transactionSuccess: false, errorOccurred: false, message: "Nothing to update." });

      };

    })
    .catch((error) => {
      console.error(`${controllerName}-controller`, getDateTime(), `put /alwaysFilter/:itemID error`, error);

      addErrorLog(`${controllerName}-controller`, "put /alwaysFilter/:itemID", records, error);
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

  // itemID.replace("tag:google.com,2013:googlealerts/feed:", "");

  // const where = { itemID: request.params.itemID };
  const where = { itemID: itemID };

  // console.log(`${controllerName}-controller`, getDateTime(), `put /viewed/:itemID itemID`, itemID);

  db(tableName)
    .where(where)
    // * .returning() is not supported by mysql and will not have any effect. -- 08/13/2021 MF
    // .returning(select)
    .update(recordObject)
    .then((records) => {
      // console.log(`${controllerName}-controller`, getDateTime(), `put /viewed/:itemID records`, records);
      // * Returns the number of updated records. -- 08/13/2021 MF

      // records = convertBitTrueFalse(records);

      if (isEmpty(records) === false) {
        // console.log(`${controllerName}-controller`, getDateTime(), `put /viewed/:itemID records`, records);

        response.status(200).json({ primaryKeyID: request.params.itemID, transactionSuccess: true, errorOccurred: false, message: "Successfully updated.", records: records });

      } else {
        // console.log(`${controllerName}-controller`, getDateTime(), `put /viewed/:itemID No Results`);

        response.status(200).json({ primaryKeyID: request.params.itemID, transactionSuccess: false, errorOccurred: false, message: "Nothing to update." });

      };

    })
    .catch((error) => {
      console.error(`${controllerName}-controller`, getDateTime(), `put /viewed/:itemID error`, error);

      addErrorLog(`${controllerName}-controller`, "put /viewed/:itemID", records, error);
      response.status(500).json({ transactionSuccess: false, errorOccurred: true, message: "Not successfully updated." });

    });

});


module.exports = router;