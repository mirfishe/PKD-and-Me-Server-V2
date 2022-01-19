-- phpMyAdmin SQL Dump
-- version 4.9.5deb2
-- https://www.phpmyadmin.net/
--
-- Host: localhost:3306
-- Generation Time: Jan 19, 2022 at 12:26 AM
-- Server version: 8.0.27-0ubuntu0.20.04.1
-- PHP Version: 7.4.3

SET AUTOCOMMIT = 0;
START TRANSACTION;
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;

--
-- Database: "pkd-and-me"
--

-- --------------------------------------------------------

--
-- Table structure for table "alternateForms"
--

CREATE TABLE `alternateForms` (
  "termID" int NOT NULL,
  "alternateFormID" int NOT NULL,
  "createDate" datetime NOT NULL DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

-- --------------------------------------------------------

--
-- Table structure for table "amazon"
--

CREATE TABLE `amazon` (
  "ASIN" varchar(255) DEFAULT NULL,
  "titleName" text,
  "authorName" text,
  "publicationDate" varchar(255) DEFAULT NULL,
  "imageName" varchar(255) DEFAULT NULL,
  "textLinkFull" text,
  "active" tinyint(1) NOT NULL DEFAULT '1',
  "createDate" datetime NOT NULL DEFAULT CURRENT_TIMESTAMP,
  "updateDate" datetime NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

-- --------------------------------------------------------

--
-- Table structure for table "amazonImport"
--

CREATE TABLE `amazonImport` (
  "searchCategory" varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci NOT NULL,
  "totalResultCount" int DEFAULT NULL,
  "searchURL" varchar(255) DEFAULT NULL,
  "page" int DEFAULT NULL,
  "searchIndex" varchar(255) DEFAULT NULL,
  "sortBy" varchar(255) DEFAULT NULL,
  "ASIN" varchar(255) DEFAULT NULL,
  "titleName" text,
  "authorName" text,
  "publicationDate" varchar(255) DEFAULT NULL,
  "imageName" varchar(255) DEFAULT NULL,
  "textLinkFull" text,
  "active" tinyint(1) NOT NULL DEFAULT '1',
  "createDate" datetime NOT NULL DEFAULT CURRENT_TIMESTAMP,
  "updateDate" datetime NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

-- --------------------------------------------------------

--
-- Table structure for table "brokenLinks"
--

CREATE TABLE `brokenLinks` (
  "endpoint" varchar(500) DEFAULT NULL,
  "editionID" int DEFAULT NULL,
  "titleID" int DEFAULT NULL,
  "titleName" varchar(255) DEFAULT NULL,
  "imageName" varchar(500) DEFAULT NULL,
  "createDate" datetime DEFAULT NULL,
  "timestamp" datetime DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

-- --------------------------------------------------------

--
-- Table structure for table "categories"
--

CREATE TABLE `categories` (
  "categoryID" int NOT NULL,
  "category" varchar(255) NOT NULL,
  "sortID" int NOT NULL,
  "active" tinyint(1) NOT NULL DEFAULT '1',
  "createDate" datetime NOT NULL DEFAULT CURRENT_TIMESTAMP,
  "updateDate" datetime NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

-- --------------------------------------------------------

--
-- Table structure for table "comments"
--

CREATE TABLE `comments` (
  "commentID" int NOT NULL,
  "userID" int NOT NULL,
  "email" varchar(255) NOT NULL,
  "comment" text CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci,
  "dateEntered" datetime NOT NULL DEFAULT CURRENT_TIMESTAMP
) ENGINE=MyISAM DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

-- --------------------------------------------------------

--
-- Table structure for table "computerLogs"
--

CREATE TABLE `computerLogs` (
  "title" varchar(255) DEFAULT NULL,
  "href" varchar(500) DEFAULT NULL,
  "applicationVersion" varchar(50) DEFAULT NULL,
  "ipAddress" varchar(50) DEFAULT NULL,
  "lastAccessed" datetime DEFAULT NULL,
  "city" varchar(255) DEFAULT NULL,
  "state" varchar(255) DEFAULT NULL,
  "stateCode" varchar(50) DEFAULT NULL,
  "countryName" varchar(255) DEFAULT NULL,
  "countryCode" varchar(255) DEFAULT NULL,
  "continentName" varchar(255) DEFAULT NULL,
  "continentCode" varchar(255) DEFAULT NULL,
  "latitude" varchar(50) DEFAULT NULL,
  "longitude" varchar(50) DEFAULT NULL,
  "postal" varchar(50) DEFAULT NULL,
  "timestamp" datetime DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

-- --------------------------------------------------------

--
-- Table structure for table "editions"
--

CREATE TABLE `editions` (
  "editionID" int NOT NULL,
  "titleID" int NOT NULL,
  "mediaID" int NOT NULL,
  "publicationDate" date DEFAULT NULL,
  "imageName" varchar(255) DEFAULT NULL,
  "ASIN" varchar(255) DEFAULT NULL,
  "textLinkShort" text,
  "textLinkFull" text,
  "imageLinkSmall" text,
  "imageLinkMedium" text,
  "imageLinkLarge" text,
  "textImageLink" text,
  "active" tinyint(1) NOT NULL DEFAULT '1',
  "createDate" datetime NOT NULL DEFAULT CURRENT_TIMESTAMP,
  "updateDate" datetime NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

-- --------------------------------------------------------

--
-- Table structure for table "errorLogs"
--

CREATE TABLE `errorLogs` (
  "operation" varchar(255) DEFAULT NULL,
  "componentName" varchar(255) DEFAULT NULL,
  "transactionData" text,
  "errorData" text,
  "createDate" datetime DEFAULT NULL,
  "timestamp" datetime DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

-- --------------------------------------------------------

--
-- Table structure for table "homeopapeRSS"
--

CREATE TABLE `homeopapeRSS` (
  "homeopapeID" int NOT NULL,
  "createDate" datetime DEFAULT CURRENT_TIMESTAMP,
  "viewed" tinyint NOT NULL DEFAULT '0',
  "display" tinyint NOT NULL DEFAULT '0',
  "alwaysFilter" tinyint NOT NULL DEFAULT '0',
  "posted" tinyint NOT NULL DEFAULT '0',
  "feedID" varchar(100) DEFAULT NULL,
  "feedTitle" varchar(1000) DEFAULT NULL,
  "feedLink" varchar(1000) DEFAULT NULL,
  "feedUpdated" varchar(100) DEFAULT NULL,
  "feedLastBuildDate" varchar(100) DEFAULT NULL,
  "feedUrl" varchar(1000) DEFAULT NULL,
  "itemID" varchar(100) DEFAULT NULL,
  "itemTitle" varchar(1000) DEFAULT NULL,
  "itemLink" varchar(1000) DEFAULT NULL,
  "itemPubDate" varchar(100) DEFAULT NULL,
  "itemUpdated" varchar(100) DEFAULT NULL,
  "itemContent" varchar(2000) DEFAULT NULL,
  "itemContentSnippet" varchar(2000) DEFAULT NULL,
  "itemISODate" varchar(100) DEFAULT NULL,
  "itemCreator" varchar(2000) DEFAULT NULL,
  "itemAuthor" varchar(2000) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

-- --------------------------------------------------------

--
-- Table structure for table "homeopapeRSSImport"
--

CREATE TABLE `homeopapeRSSImport` (
  "homeopapeID" int NOT NULL,
  "createDate" datetime DEFAULT CURRENT_TIMESTAMP,
  "feedID" varchar(100) DEFAULT NULL,
  "feedTitle" varchar(1000) DEFAULT NULL,
  "feedLink" varchar(1000) DEFAULT NULL,
  "feedUpdated" varchar(100) DEFAULT NULL,
  "feedLastBuildDate" varchar(100) DEFAULT NULL,
  "feedUrl" varchar(1000) DEFAULT NULL,
  "itemID" varchar(100) DEFAULT NULL,
  "itemTitle" varchar(1000) DEFAULT NULL,
  "itemLink" varchar(1000) DEFAULT NULL,
  "itemPubDate" varchar(100) DEFAULT NULL,
  "itemUpdated" varchar(100) DEFAULT NULL,
  "itemContent" varchar(2000) DEFAULT NULL,
  "itemContentSnippet" varchar(2000) DEFAULT NULL,
  "itemISODate" varchar(100) DEFAULT NULL,
  "itemCreator" varchar(2000) DEFAULT NULL,
  "itemAuthor" varchar(2000) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

-- --------------------------------------------------------

--
-- Table structure for table "logs"
--

CREATE TABLE `logs` (
  "operation" varchar(255) DEFAULT NULL,
  "componentName" varchar(255) DEFAULT NULL,
  "transactionData" text,
  "createDate" datetime DEFAULT NULL,
  "timestamp" datetime DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

-- --------------------------------------------------------

--
-- Table structure for table "media"
--

CREATE TABLE `media` (
  "mediaID" int NOT NULL,
  "media" varchar(255) NOT NULL,
  "electronic" tinyint(1) NOT NULL DEFAULT '0',
  "sortID" int NOT NULL,
  "active" tinyint(1) NOT NULL DEFAULT '1',
  "createDate" datetime NOT NULL DEFAULT CURRENT_TIMESTAMP,
  "updateDate" datetime NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

-- --------------------------------------------------------

--
-- Table structure for table "synonyms"
--

CREATE TABLE `synonyms` (
  "termID" int NOT NULL,
  "synonymID" int NOT NULL,
  "createDate" datetime NOT NULL DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

-- --------------------------------------------------------

--
-- Table structure for table "termCategories"
--

CREATE TABLE `termCategories` (
  "termCategoryID" int NOT NULL,
  "termCategory" varchar(255) NOT NULL,
  "active" tinyint(1) NOT NULL DEFAULT '1',
  "createDate" datetime NOT NULL DEFAULT CURRENT_TIMESTAMP,
  "updateDate" datetime NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

-- --------------------------------------------------------

--
-- Table structure for table "terms"
--

CREATE TABLE `terms` (
  "termID" int NOT NULL,
  "term" varchar(255) NOT NULL,
  "termSort" varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci NOT NULL,
  "alternateForms" varchar(500) DEFAULT NULL,
  "definition" text,
  "partOfSpeech" varchar(200) DEFAULT NULL,
  "termCategoryID" int DEFAULT NULL,
  "parentTermID" int DEFAULT NULL,
  "active" tinyint(1) NOT NULL DEFAULT '1',
  "createDate" datetime NOT NULL DEFAULT CURRENT_TIMESTAMP,
  "updateDate" datetime NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

-- --------------------------------------------------------

--
-- Table structure for table "termsCategories"
--

CREATE TABLE `termsCategories` (
  "termID" int NOT NULL,
  "termCategoryID" int NOT NULL,
  "createDate" datetime NOT NULL DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

-- --------------------------------------------------------

--
-- Table structure for table "termsTitles"
--

CREATE TABLE `termsTitles` (
  "termID" int NOT NULL,
  "titleID" int NOT NULL,
  "quotation" text NOT NULL,
  "createDate" datetime NOT NULL DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

-- --------------------------------------------------------

--
-- Table structure for table "titles"
--

CREATE TABLE `titles` (
  "titleID" int NOT NULL,
  "titleName" varchar(255) NOT NULL,
  "titleSort" varchar(255) NOT NULL,
  "titleURL" varchar(255) NOT NULL,
  "authorFirstName" varchar(255) DEFAULT NULL,
  "authorLastName" varchar(255) DEFAULT NULL,
  "manuscriptTitle" varchar(255) DEFAULT NULL,
  "writtenDate" date DEFAULT NULL,
  "submissionDate" date DEFAULT NULL,
  "publicationDate" date DEFAULT NULL,
  "imageName" varchar(255) DEFAULT NULL,
  "categoryID" int NOT NULL,
  "shortDescription" text,
  "urlPKDWeb" varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci DEFAULT NULL,
  "active" tinyint(1) NOT NULL DEFAULT '1',
  "createDate" datetime NOT NULL DEFAULT CURRENT_TIMESTAMP,
  "updateDate" datetime NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

-- --------------------------------------------------------

--
-- Table structure for table "titlesText"
--

CREATE TABLE `titlesText` (
  "titleID" int DEFAULT NULL,
  "chapter" varchar(255) DEFAULT NULL,
  "titleText" longtext CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

-- --------------------------------------------------------

--
-- Table structure for table "titleSuggestions"
--

CREATE TABLE `titleSuggestions` (
  "titleSuggestionID" int NOT NULL,
  "userID" int NOT NULL,
  "email" varchar(255) NOT NULL,
  "titleName" varchar(255) NOT NULL,
  "titleURL" varchar(255) DEFAULT NULL,
  "authorFirstName" varchar(255) DEFAULT NULL,
  "authorLastName" varchar(255) DEFAULT NULL,
  "publicationDate" date DEFAULT NULL,
  "shortDescription" text CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci,
  "dateEntered" datetime NOT NULL DEFAULT CURRENT_TIMESTAMP
) ENGINE=MyISAM DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

-- --------------------------------------------------------

--
-- Table structure for table "userReviews"
--

CREATE TABLE `userReviews` (
  "reviewID" int NOT NULL,
  "userID" int NOT NULL,
  "updatedBy" int NOT NULL DEFAULT '0',
  "titleID" int NOT NULL,
  "read" tinyint(1) NOT NULL DEFAULT '0',
  "dateRead" date DEFAULT NULL,
  "rating" int DEFAULT NULL,
  "ranking" int DEFAULT NULL,
  "shortReview" varchar(255) DEFAULT NULL,
  "longReview" text,
  "owned" tinyint(1) NOT NULL DEFAULT '0',
  "datePurchased" date DEFAULT NULL,
  "active" tinyint(1) NOT NULL DEFAULT '1',
  "createDate" datetime NOT NULL DEFAULT CURRENT_TIMESTAMP,
  "updateDate" datetime NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

-- --------------------------------------------------------

--
-- Table structure for table "users"
--

CREATE TABLE `users` (
  "userID" int NOT NULL,
  "firstName" varchar(255) DEFAULT NULL,
  "lastName" varchar(255) DEFAULT NULL,
  "email" varchar(255) NOT NULL,
  "password" varchar(255) NOT NULL,
  "updatedBy" int DEFAULT NULL,
  "admin" tinyint(1) NOT NULL DEFAULT '0',
  "active" tinyint(1) NOT NULL DEFAULT '1',
  "createDate" datetime NOT NULL DEFAULT CURRENT_TIMESTAMP,
  "updateDate" datetime NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

--
-- Indexes for dumped tables
--

--
-- Indexes for table "categories"
--
ALTER TABLE "categories"
  ADD PRIMARY KEY ("categoryID");

--
-- Indexes for table "comments"
--
ALTER TABLE "comments"
  ADD PRIMARY KEY ("commentID");

--
-- Indexes for table "editions"
--
ALTER TABLE "editions"
  ADD PRIMARY KEY ("editionID"),
  ADD UNIQUE KEY "ASIN" ("ASIN"),
  ADD KEY "titleID" ("titleID"),
  ADD KEY "mediaID" ("mediaID");

--
-- Indexes for table "homeopapeRSS"
--
ALTER TABLE "homeopapeRSS"
  ADD PRIMARY KEY ("homeopapeID");

--
-- Indexes for table "homeopapeRSSImport"
--
ALTER TABLE "homeopapeRSSImport"
  ADD PRIMARY KEY ("homeopapeID");

--
-- Indexes for table "media"
--
ALTER TABLE "media"
  ADD PRIMARY KEY ("mediaID");

--
-- Indexes for table "titles"
--
ALTER TABLE "titles"
  ADD PRIMARY KEY ("titleID"),
  ADD UNIQUE KEY "titleURL" ("titleURL"),
  ADD KEY "categoryID" ("categoryID");

--
-- Indexes for table "titleSuggestions"
--
ALTER TABLE "titleSuggestions"
  ADD PRIMARY KEY ("titleSuggestionID");

--
-- Indexes for table "userReviews"
--
ALTER TABLE "userReviews"
  ADD PRIMARY KEY ("reviewID"),
  ADD KEY "userID" ("userID"),
  ADD KEY "updatedBy" ("updatedBy"),
  ADD KEY "titleID" ("titleID");

--
-- Indexes for table "users"
--
ALTER TABLE "users"
  ADD PRIMARY KEY ("userID"),
  ADD UNIQUE KEY "email" ("email"),
  ADD KEY "updatedBy" ("updatedBy");

--
-- AUTO_INCREMENT for dumped tables
--

--
-- AUTO_INCREMENT for table "categories"
--
ALTER TABLE "categories"
  MODIFY "categoryID" int NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table "comments"
--
ALTER TABLE "comments"
  MODIFY "commentID" int NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table "editions"
--
ALTER TABLE "editions"
  MODIFY "editionID" int NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table "homeopapeRSS"
--
ALTER TABLE "homeopapeRSS"
  MODIFY "homeopapeID" int NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table "homeopapeRSSImport"
--
ALTER TABLE "homeopapeRSSImport"
  MODIFY "homeopapeID" int NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table "media"
--
ALTER TABLE "media"
  MODIFY "mediaID" int NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table "titles"
--
ALTER TABLE "titles"
  MODIFY "titleID" int NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table "titleSuggestions"
--
ALTER TABLE "titleSuggestions"
  MODIFY "titleSuggestionID" int NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table "userReviews"
--
ALTER TABLE "userReviews"
  MODIFY "reviewID" int NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table "users"
--
ALTER TABLE "users"
  MODIFY "userID" int NOT NULL AUTO_INCREMENT;

--
-- Constraints for dumped tables
--

--
-- Constraints for table "editions"
--
ALTER TABLE "editions"
  ADD CONSTRAINT "editions_ibfk_1" FOREIGN KEY ("titleID") REFERENCES `titles` ("titleID") ON DELETE CASCADE ON UPDATE CASCADE,
  ADD CONSTRAINT "editions_ibfk_2" FOREIGN KEY ("mediaID") REFERENCES `media` ("mediaID") ON DELETE CASCADE ON UPDATE CASCADE;

--
-- Constraints for table "titles"
--
ALTER TABLE "titles"
  ADD CONSTRAINT "titles_ibfk_1" FOREIGN KEY ("categoryID") REFERENCES `categories` ("categoryID") ON DELETE CASCADE ON UPDATE CASCADE;

--
-- Constraints for table "userReviews"
--
ALTER TABLE "userReviews"
  ADD CONSTRAINT "userReviews_ibfk_1" FOREIGN KEY ("userID") REFERENCES `users` ("userID") ON DELETE CASCADE ON UPDATE CASCADE,
  ADD CONSTRAINT "userReviews_ibfk_2" FOREIGN KEY ("updatedBy") REFERENCES `users` ("userID") ON DELETE CASCADE ON UPDATE CASCADE,
  ADD CONSTRAINT "userReviews_ibfk_3" FOREIGN KEY ("titleID") REFERENCES `titles` ("titleID") ON DELETE CASCADE ON UPDATE CASCADE;

--
-- Constraints for table "users"
--
ALTER TABLE "users"
  ADD CONSTRAINT "users_ibfk_1" FOREIGN KEY ("updatedBy") REFERENCES `users` ("userID") ON DELETE SET NULL ON UPDATE CASCADE;
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
