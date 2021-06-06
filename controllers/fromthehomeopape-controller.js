const router = require("express").Router();
const dbConfig = require("../db");
const db = require("knex")(dbConfig.config);
const validateSession = require("../middleware/validate-session");
const validateAdmin = require("../middleware/validate-admin");

const IsEmpty = require("../utilities/isEmpty");
const GetDateTime = require("../utilities/getDateTime");
const convertBitTrueFalse = require("../utilities/convertBitTrueFalse");

const controllerName = "fromthehomeopape";
const tableName = "homeopapeRSS";
const select = "*";
const orderBy = [{ column: "createDate", order: "desc" }];

// const Parser = require('rss-parser');


// const fetchNews = async () => {
//   // console.log(componentName, GetDateTime(), "fetchNews");

//   // https://cors-anywhere.herokuapp.com
//   // https://stackoverflow.com/questions/43871637/no-access-control-allow-origin-header-is-present-on-the-requested-resource-whe
//   const proxyurl = "https://cors-anywhere.herokuapp.com/";

//   // let url = proxyurl;
//   let url;

//   // * Google Alert - Philip Dick New
//   url = proxyurl + "https://www.google.com/alerts/feeds/17849810695950872924/15842463258895766468";
//   // url = "https://www.google.com/alerts/feeds/17849810695950872924/15842463258895766468";
//   // * Google Alert - Philip Dick
//   // url = proxyurl + "https://www.google.com/alerts/feeds/17849810695950872924/2465476321108416249";
//   // * Google Alert - Philip Dick All Except Web
//   // * Doesn't appear to work anymore.
//   // url = proxyurl + "https://www.google.com/alerts/feeds/17849810695950872924/11918400074382766835";
//   // * Google Alert - Philip Dick News
//   // * Doesn't appear to work anymore.
//   // url = proxyurl + "https://www.google.com/alerts/feeds/17849810695950872924/17162147117770349674";

//   let rssParser = new Parser({
//     // * Doesn't prevent the CORS error.
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

//   const feed = await rssParser.parseURL(url);

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

//   // Notes from https://github.com/rbren/rss-parser
//   // The contentSnippet field strips out HTML tags and unescapes HTML entities
//   // The dc: prefix will be removed from all fields
//   // Both dc:date and pubDate will be available in ISO 8601 format as isoDate
//   // If author is specified, but not dc:creator, creator will be set to author (see article)
//   // Atom's updated becomes lastBuildDate for consistency

//   console.log(componentName, GetDateTime(), "fetchNews feed", feed);
//   console.log(componentName, GetDateTime(), "fetchNews feed.id", feed.id);
//   console.log(componentName, GetDateTime(), "fetchNews feed.title", feed.title);
//   console.log(componentName, GetDateTime(), "fetchNews feed.link", feed.link);
//   console.log(componentName, GetDateTime(), "fetchNews feed.updated", feed.updated);
//   console.log(componentName, GetDateTime(), "fetchNews feed.lastBuildDate", feed.lastBuildDate);

//   console.log(componentName, GetDateTime(), "fetchNews feed.feedUrl", feed.feedUrl);

//   console.log(componentName, GetDateTime(), "fetchNews feed.items", feed.items);

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
//       itemAuthor: item.author
//     };

//     itemsArray.push(feedObject);

//     console.log(componentName, GetDateTime(), "fetchNews item.id", item.id);
//     console.log(componentName, GetDateTime(), "fetchNews item.title", item.title);
//     console.log(componentName, GetDateTime(), "fetchNews item.link", item.link);
//     console.log(componentName, GetDateTime(), "fetchNews item.pubDate", item.pubDate);
//     console.log(componentName, GetDateTime(), "fetchNews item.updated", item.updated);
//     console.log(componentName, GetDateTime(), "fetchNews item.content", item.content);
//     console.log(componentName, GetDateTime(), "fetchNews item.contentSnippet", item.contentSnippet);
//     console.log(componentName, GetDateTime(), "fetchNews item.isoDate", item.isoDate);
//     console.log(componentName, GetDateTime(), "fetchNews item.creator", item.creator);
//     console.log(componentName, GetDateTime(), "fetchNews item.author", item.author);
//     // console.log(componentName, GetDateTime(), "fetchNews item.author.name", item.author.name);
//     // console.log(componentName, GetDateTime(), "fetchNews item.name", item.name);

//     // console.log(componentName, GetDateTime(), "fetchNews itemsArray", itemsArray);

//   });

//   console.log(componentName, GetDateTime(), "fetchNews itemsArray", itemsArray);

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
router.get("/", (req, res) => {

  // let sqlQuery = "SELECT DISTINCT itemLink, itemTitle, itemContentSnippet, itemPubDate FROM homeopapeRSS ORDER BY itemPubDate DESC";

  // db.raw(sqlQuery).toSQL();

  // console.log(controllerName + "-controller", getDateTime(), "get /:" + controllerName + "ID " + tableName, sqlQuery);

  db.distinct("itemID", "itemLink", "itemTitle", "itemContentSnippet", "itemPubDate")
    .from(tableName)
    .orderBy([{ column: "itemPubDate", order: "desc" }])
    .then((records) => {
      console.log(controllerName + "-controller", GetDateTime(), "", GetDateTime(), " get /" + tableName, records);

      // records = convertBitTrueFalse(records);

      if (records.length > 0) {
        // console.log(controllerName + "-controller", GetDateTime(), "", GetDateTime(), " get /" + tableName, records);

        res.status(200).json({ resultsFound: true, message: "Successfully retrieved " + tableName + ".", records: records });

      } else {
        // console.log(controllerName + "-controller", GetDateTime(), " get /No Results");

        // res.status(200).send("No " + tableName + " found.");
        // res.status(200).send({resultsFound: false, message: "No " + tableName + " found."})
        res.status(200).json({ resultsFound: false, message: "No " + tableName + " found." });

      };

    })
    .catch((error) => {
      console.log(controllerName + "-controller", GetDateTime(), " get /list error", error);
      res.status(500).json({ resultsFound: false, message: "No " + tableName + " found.", error: error });
    });

});


/******************************
 ***** Fetch  *********
 ******************************/
router.get("/new", (req, res) => {

  let Parser = require('rss-parser');
  let rssParser = new Parser({
    // * Doesn't prevent the CORS error.
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

    // * Google Alert - Philip Dick New
    url = "https://www.google.com/alerts/feeds/17849810695950872924/15842463258895766468";

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

    // Notes from https://github.com/rbren/rss-parser
    // The contentSnippet field strips out HTML tags and unescapes HTML entities
    // The dc: prefix will be removed from all fields
    // Both dc:date and pubDate will be available in ISO 8601 format as isoDate
    // If author is specified, but not dc:creator, creator will be set to author (see article)
    // Atom's updated becomes lastBuildDate for consistency

    // console.log(controllerName + "-controller", GetDateTime(), " get / feed", feed);
    // console.log(controllerName + "-controller", GetDateTime(), " get / feed.id", feed.id);
    // console.log(controllerName + "-controller", GetDateTime(), " get / feed.title", feed.title);
    // console.log(controllerName + "-controller", GetDateTime(), " get / feed.link", feed.link);
    // console.log(controllerName + "-controller", GetDateTime(), " get / feed.updated", feed.updated);
    // console.log(controllerName + "-controller", GetDateTime(), " get / feed.lastBuildDate", feed.lastBuildDate);

    // console.log(controllerName + "-controller", GetDateTime(), " get / feed.feedUrl", feed.feedUrl);

    // console.log(controllerName + "-controller", GetDateTime(), " get / feed.items", feed.items);

    // let itemsArray = [];

    feed.items.forEach(item => {

      // SELECT @@GLOBAL.sql_mode global, @@SESSION.sql_mode session;
      // SET sql_mode = '';
      // SET GLOBAL sql_mode = '';

      // * https://stackoverflow.com/questions/44304777/er-truncated-wrong-value-incorrect-datetime-value
      // * .replaceAll("T", " ").replaceAll("Z", "") are used to fix this issue.

      let feedObject = {
        feedID: feed.id,
        feedTitle: feed.title,
        feedLink: feed.link,
        feedUpdated: feed.updated.replaceAll("Z", ""),
        feedLastBuildDate: feed.lastBuildDate.replaceAll("Z", ""),
        feedUrl: feed.feedUrl,
        itemID: item.id,
        itemTitle: item.title,
        itemLink: item.link,
        itemPubDate: item.pubDate.replaceAll("T", " ").replaceAll("Z", ""),
        itemUpdated: item.updated.replaceAll("T", " ").replaceAll("Z", ""),
        itemContent: item.content,
        itemContentSnippet: item.contentSnippet,
        itemISODate: item.isoDate.replaceAll("T", " ").replaceAll("Z", ""),
        itemCreator: item.creator,
        itemAuthor: item.author
      };

      // itemsArray.push(feedObject);

      // console.log(controllerName + "-controller", GetDateTime(), " get / item.id", item.id);
      // console.log(controllerName + "-controller", GetDateTime(), " get / item.title", item.title);
      // console.log(controllerName + "-controller", GetDateTime(), " get / item.link", item.link);
      // console.log(controllerName + "-controller", GetDateTime(), " get / item.pubDate", item.pubDate);
      // console.log(controllerName + "-controller", GetDateTime(), " get / item.updated", item.updated);
      // console.log(controllerName + "-controller", GetDateTime(), " get / item.content", item.content);
      // console.log(controllerName + "-controller", GetDateTime(), " get / item.contentSnippet", item.contentSnippet);
      // console.log(controllerName + "-controller", GetDateTime(), " get / item.isoDate", item.isoDate);
      // console.log(controllerName + "-controller", GetDateTime(), " get / item.creator", item.creator);
      // console.log(controllerName + "-controller", GetDateTime(), " get / item.author", item.author);
      // // console.log(controllerName + "-controller", GetDateTime(), " get / item.author.name", item.author.name);
      // // console.log(controllerName + "-controller", GetDateTime(), " get / item.name", item.name);

      // console.log(controllerName + "-controller", GetDateTime(), " get / itemsArray", itemsArray);

      db("homeopapeRSSImport")
        // * .returning() is not supported by mysql and will not have any effect.
        // .returning(select)
        .insert(feedObject)
        .then((records) => {
          console.log(controllerName + "-controller", GetDateTime(), " post / records", records);
          // * Returns the ID value of the added record.

          // records = convertBitTrueFalse(records);

          if (records > 0) {
            // console.log(controllerName + "-controller", GetDateTime(), " post / records", records);

            // res.status(200).json({ recordAdded: true, message: "Successfully created " + tableName + ".", records: [feedObject] });

          } else {
            // console.log(controllerName + "-controller", GetDateTime(), " post / No Results");

            // res.status(200).send("No records found.");
            // res.status(200).send({resultsFound: false, message: "No records found."})
            // res.status(200).json({ recordAdded: false, message: "Nothing to add.", records: [feedObject] });

          };

        })
        .catch((error) => {
          console.log(controllerName + "-controller", GetDateTime(), " post / error", error);
          res.status(500).json({ recordAdded: false, message: "Not successfully created " + tableName, error: error });
        });

    });

    // console.log(controllerName + "-controller", GetDateTime(), " get / itemsArray", itemsArray);

  })();


  (async () => {

    // * Google Alert - Philip Dick
    url = "https://www.google.com/alerts/feeds/17849810695950872924/2465476321108416249";

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

    // Notes from https://github.com/rbren/rss-parser
    // The contentSnippet field strips out HTML tags and unescapes HTML entities
    // The dc: prefix will be removed from all fields
    // Both dc:date and pubDate will be available in ISO 8601 format as isoDate
    // If author is specified, but not dc:creator, creator will be set to author (see article)
    // Atom's updated becomes lastBuildDate for consistency

    // console.log(controllerName + "-controller", GetDateTime(), " get / feed", feed);
    // console.log(controllerName + "-controller", GetDateTime(), " get / feed.id", feed.id);
    // console.log(controllerName + "-controller", GetDateTime(), " get / feed.title", feed.title);
    // console.log(controllerName + "-controller", GetDateTime(), " get / feed.link", feed.link);
    // console.log(controllerName + "-controller", GetDateTime(), " get / feed.updated", feed.updated);
    // console.log(controllerName + "-controller", GetDateTime(), " get / feed.lastBuildDate", feed.lastBuildDate);

    // console.log(controllerName + "-controller", GetDateTime(), " get / feed.feedUrl", feed.feedUrl);

    // console.log(controllerName + "-controller", GetDateTime(), " get / feed.items", feed.items);

    // let itemsArray = [];

    feed.items.forEach(item => {

      // SELECT @@GLOBAL.sql_mode global, @@SESSION.sql_mode session;
      // SET sql_mode = '';
      // SET GLOBAL sql_mode = '';

      // * https://stackoverflow.com/questions/44304777/er-truncated-wrong-value-incorrect-datetime-value
      // * .replaceAll("T", " ").replaceAll("Z", "") are used to fix this issue.

      let feedObject = {
        feedID: feed.id,
        feedTitle: feed.title,
        feedLink: feed.link,
        feedUpdated: feed.updated.replaceAll("Z", ""),
        feedLastBuildDate: feed.lastBuildDate.replaceAll("Z", ""),
        feedUrl: feed.feedUrl,
        itemID: item.id,
        itemTitle: item.title,
        itemLink: item.link,
        itemPubDate: item.pubDate.replaceAll("T", " ").replaceAll("Z", ""),
        itemUpdated: item.updated.replaceAll("T", " ").replaceAll("Z", ""),
        itemContent: item.content,
        itemContentSnippet: item.contentSnippet,
        itemISODate: item.isoDate.replaceAll("T", " ").replaceAll("Z", ""),
        itemCreator: item.creator,
        itemAuthor: item.author
      };

      // itemsArray.push(feedObject);

      // console.log(controllerName + "-controller", GetDateTime(), " get / item.id", item.id);
      // console.log(controllerName + "-controller", GetDateTime(), " get / item.title", item.title);
      // console.log(controllerName + "-controller", GetDateTime(), " get / item.link", item.link);
      // console.log(controllerName + "-controller", GetDateTime(), " get / item.pubDate", item.pubDate);
      // console.log(controllerName + "-controller", GetDateTime(), " get / item.updated", item.updated);
      // console.log(controllerName + "-controller", GetDateTime(), " get / item.content", item.content);
      // console.log(controllerName + "-controller", GetDateTime(), " get / item.contentSnippet", item.contentSnippet);
      // console.log(controllerName + "-controller", GetDateTime(), " get / item.isoDate", item.isoDate);
      // console.log(controllerName + "-controller", GetDateTime(), " get / item.creator", item.creator);
      // console.log(controllerName + "-controller", GetDateTime(), " get / item.author", item.author);
      // // console.log(controllerName + "-controller", GetDateTime(), " get / item.author.name", item.author.name);
      // // console.log(controllerName + "-controller", GetDateTime(), " get / item.name", item.name);

      // console.log(controllerName + "-controller", GetDateTime(), " get / itemsArray", itemsArray);

      db("homeopapeRSSImport")
        // * .returning() is not supported by mysql and will not have any effect.
        // .returning(select)
        .insert(feedObject)
        .then((records) => {
          console.log(controllerName + "-controller", GetDateTime(), " post / records", records);
          // * Returns the ID value of the added record.

          // records = convertBitTrueFalse(records);

          if (records > 0) {
            // console.log(controllerName + "-controller", GetDateTime(), " post / records", records);

            // res.status(200).json({ recordAdded: true, message: "Successfully created " + tableName + ".", records: [feedObject] });

          } else {
            // console.log(controllerName + "-controller", GetDateTime(), " post / No Results");

            // res.status(200).send("No records found.");
            // res.status(200).send({resultsFound: false, message: "No records found."})
            // res.status(200).json({ recordAdded: false, message: "Nothing to add.", records: [feedObject] });

          };

        })
        .catch((error) => {
          console.log(controllerName + "-controller", GetDateTime(), " post / error", error);
          res.status(500).json({ recordAdded: false, message: "Not successfully created " + tableName, error: error });
        });

    });

    // console.log(controllerName + "-controller", GetDateTime(), " get / itemsArray", itemsArray);

  })();

  // res.status(200).json({ recordAdded: true, message: "Successfully created " + tableName + "." });

});


/******************************
 ***** Fetch  *********
 ******************************/
router.get("/update", (req, res) => {

  // INSERT INTO homeopapeRSS (feedID, feedTitle, feedLink, feedUpdated, feedLastBuildDate, feedUrl, itemID, itemTitle, itemLink, itemPubDate, itemUpdated, itemContent, itemContentSnippet, itemISODate, itemCreator, itemAuthor) SELECT DISTINCT feedID, feedTitle, feedLink, feedUpdated, feedLastBuildDate, feedUrl, itemID, itemTitle, itemLink, itemPubDate, itemUpdated, itemContent, itemContentSnippet, itemISODate, itemCreator, itemAuthor FROM homeopapeRSSImport WHERE itemID NOT IN (SELECT itemID FROM homeopapeRSS)

  let sqlQuery = "INSERT INTO homeopapeRSS (feedID, feedTitle, feedLink, feedUpdated, feedLastBuildDate, feedUrl, itemID, itemTitle, itemLink, itemPubDate, itemUpdated, itemContent, itemContentSnippet, itemISODate, itemCreator, itemAuthor) SELECT DISTINCT feedID, feedTitle, feedLink, feedUpdated, feedLastBuildDate, feedUrl, itemID, itemTitle, itemLink, itemPubDate, itemUpdated, itemContent, itemContentSnippet, itemISODate, itemCreator, itemAuthor FROM homeopapeRSSImport WHERE itemID NOT IN (SELECT itemID FROM homeopapeRSS)";

  db.raw(sqlQuery).toSQL();

  console.log(controllerName + "-controller", getDateTime(), "get /:" + controllerName + "ID " + tableName, sqlQuery);

  db.raw(sqlQuery)
    .then((records) => {
      console.log(controllerName + "-controller", GetDateTime(), " post / records", records);
      // * Returns the ID value of the added record.

      // records = convertBitTrueFalse(records);

      if (records > 0) {
        // console.log(controllerName + "-controller", GetDateTime(), " post / records", records);

        res.status(200).json({ recordAdded: true, message: "Successfully created " + tableName + ".", records: records });

      } else {
        // console.log(controllerName + "-controller", GetDateTime(), " post / No Results");

        // res.status(200).send("No records found.");
        // res.status(200).send({resultsFound: false, message: "No records found."})
        res.status(200).json({ recordAdded: false, message: "Nothing to add.", records: records });

      };

    })
    .catch((error) => {
      console.log(controllerName + "-controller", GetDateTime(), " post / error", error);
      // res.status(500).json({ recordAdded: false, message: "Not successfully created " + tableName, error: error });
    });

});


/* ******************************
 *** Add  ***************
*********************************/
router.post("/", (req, res) => {

  const recordObject = {
    feedID: req.body.recordObject.feedID,
    feedTitle: req.body.recordObject.feedTitle,
    feedLink: req.body.recordObject.feedLink,
    feedUpdated: req.body.recordObject.feedUpdated,
    feedLastBuildDate: req.body.recordObject.feedLastBuildDate,
    feedUrl: req.body.recordObject.feedUrl,
    itemID: req.body.recordObject.itemID,
    itemTitle: req.body.recordObject.itemTitle,
    itemLink: req.body.recordObject.itemLink,
    itemPubDate: req.body.recordObject.itemPubDate,
    itemUpdated: req.body.recordObject.itemUpdated,
    itemContent: req.body.recordObject.itemContent,
    itemContentSnippet: req.body.recordObject.itemContentSnippet,
    itemISODate: req.body.recordObject.itemISODate,
    itemCreator: req.body.recordObject.itemCreator,
    itemAuthor: req.body.recordObject.itemAuthor
  };

  db(tableName)
    // * .returning() is not supported by mysql and will not have any effect.
    // .returning(select)
    .insert(recordObject)
    .then((records) => {
      // console.log(controllerName + "-controller", GetDateTime(), " post / records", records);
      // * Returns the ID value of the added record.

      // records = convertBitTrueFalse(records);

      if (records > 0) {
        // console.log(controllerName + "-controller", GetDateTime(), " post / records", records);

        res.status(200).json({ recordAdded: true, message: "Successfully created " + tableName + ".", records: [recordObject] });

      } else {
        // console.log(controllerName + "-controller", GetDateTime(), " post / No Results");

        // res.status(200).send("No records found.");
        // res.status(200).send({resultsFound: false, message: "No records found."})
        res.status(200).json({ recordAdded: false, message: "Nothing to add.", records: [recordObject] });

      };

    })
    .catch((error) => {
      console.log(controllerName + "-controller", GetDateTime(), " post / error", error);
      res.status(500).json({ recordAdded: false, message: "Not successfully created " + tableName, error: error });
    });

});


module.exports = router;