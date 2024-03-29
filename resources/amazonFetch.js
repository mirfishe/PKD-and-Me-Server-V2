"use strict";

const axios = require("axios");
const { IsEmpty, getDateTime } = require("../utilities/sharedFunctions");

const componentName = "amazonFetch";

let baseURL = "https://api.philipdick.com";

let environmentMode = process.argv[2];

if (environmentMode === 'development') {

  baseURL = "http://localhost:4000";

};

if (environmentMode === 'development' || process.env.NODE_ENV === "development") {

  // * These are supplied in the node command. -- 08/15/2021 MF
  // console.log(componentName, getDateTime(), "process.argv[0]", process.argv[0]);
  // console.log(componentName, getDateTime(), "process.argv[1]", process.argv[1]);
  console.log(componentName, getDateTime(), "process.argv[2]", process.argv[2]);
  console.log(componentName, getDateTime(), "process.argv[3]", process.argv[3]);

};

let urlArrayFull = ["/amazon/authorPhilipKDick/All/AvgCustomerReviews", "/amazon/authorPhilipKDick/All/Featured", "/amazon/authorPhilipKDick/All/NewestArrivals", "/amazon/authorPhilipKDick/All/Price:HighToLow", "/amazon/authorPhilipKDick/All/Price:LowToHigh", "/amazon/authorPhilipKDick/All/Relevance", "/amazon/authorPhilipKDick/AmazonVideo/AvgCustomerReviews", "/amazon/authorPhilipKDick/AmazonVideo/Featured", "/amazon/authorPhilipKDick/AmazonVideo/NewestArrivals", "/amazon/authorPhilipKDick/AmazonVideo/Price:HighToLow", "/amazon/authorPhilipKDick/AmazonVideo/Price:LowToHigh", "/amazon/authorPhilipKDick/AmazonVideo/Relevance", "/amazon/authorPhilipKDick/Books/AvgCustomerReviews", "/amazon/authorPhilipKDick/Books/Featured", "/amazon/authorPhilipKDick/Books/NewestArrivals", "/amazon/authorPhilipKDick/Books/Price:HighToLow", "/amazon/authorPhilipKDick/Books/Price:LowToHigh", "/amazon/authorPhilipKDick/Books/Relevance", "/amazon/authorPhilipKDick/Collectibles/AvgCustomerReviews", "/amazon/authorPhilipKDick/Collectibles/Featured", "/amazon/authorPhilipKDick/Collectibles/NewestArrivals", "/amazon/authorPhilipKDick/Collectibles/Price:HighToLow", "/amazon/authorPhilipKDick/Collectibles/Price:LowToHigh", "/amazon/authorPhilipKDick/Collectibles/Relevance", "/amazon/authorPhilipKDick/DigitalMusic/AvgCustomerReviews", "/amazon/authorPhilipKDick/DigitalMusic/Featured", "/amazon/authorPhilipKDick/DigitalMusic/NewestArrivals", "/amazon/authorPhilipKDick/DigitalMusic/Price:HighToLow", "/amazon/authorPhilipKDick/DigitalMusic/Price:LowToHigh", "/amazon/authorPhilipKDick/DigitalMusic/Relevance", "/amazon/authorPhilipKDick/DigitalEducationalResources/AvgCustomerReviews", "/amazon/authorPhilipKDick/DigitalEducationalResources/Featured", "/amazon/authorPhilipKDick/DigitalEducationalResources/NewestArrivals", "/amazon/authorPhilipKDick/DigitalEducationalResources/Price:HighToLow", "/amazon/authorPhilipKDick/DigitalEducationalResources/Price:LowToHigh", "/amazon/authorPhilipKDick/DigitalEducationalResources/Relevance", "/amazon/authorPhilipKDick/KindleStore/AvgCustomerReviews", "/amazon/authorPhilipKDick/KindleStore/Featured", "/amazon/authorPhilipKDick/KindleStore/NewestArrivals", "/amazon/authorPhilipKDick/KindleStore/Price:HighToLow", "/amazon/authorPhilipKDick/KindleStore/Price:LowToHigh", "/amazon/authorPhilipKDick/KindleStore/Relevance", "/amazon/authorPhilipKDick/MobileApps/AvgCustomerReviews", "/amazon/authorPhilipKDick/MobileApps/Featured", "/amazon/authorPhilipKDick/MobileApps/NewestArrivals", "/amazon/authorPhilipKDick/MobileApps/Price:HighToLow", "/amazon/authorPhilipKDick/MobileApps/Price:LowToHigh", "/amazon/authorPhilipKDick/MobileApps/Relevance", "/amazon/authorPhilipKDick/MoviesAndTV/AvgCustomerReviews", "/amazon/authorPhilipKDick/MoviesAndTV/Featured", "/amazon/authorPhilipKDick/MoviesAndTV/NewestArrivals", "/amazon/authorPhilipKDick/MoviesAndTV/Price:HighToLow", "/amazon/authorPhilipKDick/MoviesAndTV/Price:LowToHigh", "/amazon/authorPhilipKDick/MoviesAndTV/Relevance", "/amazon/authorPhilipKDick/Music/AvgCustomerReviews", "/amazon/authorPhilipKDick/Music/Featured", "/amazon/authorPhilipKDick/Music/NewestArrivals", "/amazon/authorPhilipKDick/Music/Price:HighToLow", "/amazon/authorPhilipKDick/Music/Price:LowToHigh", "/amazon/authorPhilipKDick/Music/Relevance", "/amazon/authorPhilipKDick/ToysAndGames/AvgCustomerReviews", "/amazon/authorPhilipKDick/ToysAndGames/Featured", "/amazon/authorPhilipKDick/ToysAndGames/NewestArrivals", "/amazon/authorPhilipKDick/ToysAndGames/Price:HighToLow", "/amazon/authorPhilipKDick/ToysAndGames/Price:LowToHigh", "/amazon/authorPhilipKDick/ToysAndGames/Relevance", "/amazon/authorPhilipKDick/VHS/AvgCustomerReviews", "/amazon/authorPhilipKDick/VHS/Featured", "/amazon/authorPhilipKDick/VHS/NewestArrivals", "/amazon/authorPhilipKDick/VHS/Price:HighToLow", "/amazon/authorPhilipKDick/VHS/Price:LowToHigh", "/amazon/authorPhilipKDick/VHS/Relevance", "/amazon/authorPhilipKDick/VideoGames/AvgCustomerReviews", "/amazon/authorPhilipKDick/VideoGames/Featured", "/amazon/authorPhilipKDick/VideoGames/NewestArrivals", "/amazon/authorPhilipKDick/VideoGames/Price:HighToLow", "/amazon/authorPhilipKDick/VideoGames/Price:LowToHigh", "/amazon/authorPhilipKDick/VideoGames/Relevance", "/amazon/keywordsPhilipDick/All/AvgCustomerReviews", "/amazon/keywordsPhilipDick/All/Featured", "/amazon/keywordsPhilipDick/All/NewestArrivals", "/amazon/keywordsPhilipDick/All/Price:HighToLow", "/amazon/keywordsPhilipDick/All/Price:LowToHigh", "/amazon/keywordsPhilipDick/All/Relevance", "/amazon/keywordsPhilipDick/AmazonVideo/AvgCustomerReviews", "/amazon/keywordsPhilipDick/AmazonVideo/Featured", "/amazon/keywordsPhilipDick/AmazonVideo/NewestArrivals", "/amazon/keywordsPhilipDick/AmazonVideo/Price:HighToLow", "/amazon/keywordsPhilipDick/AmazonVideo/Price:LowToHigh", "/amazon/keywordsPhilipDick/AmazonVideo/Relevance", "/amazon/keywordsPhilipDick/Books/AvgCustomerReviews", "/amazon/keywordsPhilipDick/Books/Featured", "/amazon/keywordsPhilipDick/Books/NewestArrivals", "/amazon/keywordsPhilipDick/Books/Price:HighToLow", "/amazon/keywordsPhilipDick/Books/Price:LowToHigh", "/amazon/keywordsPhilipDick/Books/Relevance", "/amazon/keywordsPhilipDick/Collectibles/AvgCustomerReviews", "/amazon/keywordsPhilipDick/Collectibles/Featured", "/amazon/keywordsPhilipDick/Collectibles/NewestArrivals", "/amazon/keywordsPhilipDick/Collectibles/Price:HighToLow", "/amazon/keywordsPhilipDick/Collectibles/Price:LowToHigh", "/amazon/keywordsPhilipDick/Collectibles/Relevance", "/amazon/keywordsPhilipDick/DigitalMusic/AvgCustomerReviews", "/amazon/keywordsPhilipDick/DigitalMusic/Featured", "/amazon/keywordsPhilipDick/DigitalMusic/NewestArrivals", "/amazon/keywordsPhilipDick/DigitalMusic/Price:HighToLow", "/amazon/keywordsPhilipDick/DigitalMusic/Price:LowToHigh", "/amazon/keywordsPhilipDick/DigitalMusic/Relevance", "/amazon/keywordsPhilipDick/DigitalEducationalResources/AvgCustomerReviews", "/amazon/keywordsPhilipDick/DigitalEducationalResources/Featured", "/amazon/keywordsPhilipDick/DigitalEducationalResources/NewestArrivals", "/amazon/keywordsPhilipDick/DigitalEducationalResources/Price:HighToLow", "/amazon/keywordsPhilipDick/DigitalEducationalResources/Price:LowToHigh", "/amazon/keywordsPhilipDick/DigitalEducationalResources/Relevance", "/amazon/keywordsPhilipDick/KindleStore/AvgCustomerReviews", "/amazon/keywordsPhilipDick/KindleStore/Featured", "/amazon/keywordsPhilipDick/KindleStore/NewestArrivals", "/amazon/keywordsPhilipDick/KindleStore/Price:HighToLow", "/amazon/keywordsPhilipDick/KindleStore/Price:LowToHigh", "/amazon/keywordsPhilipDick/KindleStore/Relevance", "/amazon/keywordsPhilipDick/MobileApps/AvgCustomerReviews", "/amazon/keywordsPhilipDick/MobileApps/Featured", "/amazon/keywordsPhilipDick/MobileApps/NewestArrivals", "/amazon/keywordsPhilipDick/MobileApps/Price:HighToLow", "/amazon/keywordsPhilipDick/MobileApps/Price:LowToHigh", "/amazon/keywordsPhilipDick/MobileApps/Relevance", "/amazon/keywordsPhilipDick/MoviesAndTV/AvgCustomerReviews", "/amazon/keywordsPhilipDick/MoviesAndTV/Featured", "/amazon/keywordsPhilipDick/MoviesAndTV/NewestArrivals", "/amazon/keywordsPhilipDick/MoviesAndTV/Price:HighToLow", "/amazon/keywordsPhilipDick/MoviesAndTV/Price:LowToHigh", "/amazon/keywordsPhilipDick/MoviesAndTV/Relevance", "/amazon/keywordsPhilipDick/Music/AvgCustomerReviews", "/amazon/keywordsPhilipDick/Music/Featured", "/amazon/keywordsPhilipDick/Music/NewestArrivals", "/amazon/keywordsPhilipDick/Music/Price:HighToLow", "/amazon/keywordsPhilipDick/Music/Price:LowToHigh", "/amazon/keywordsPhilipDick/Music/Relevance", "/amazon/keywordsPhilipDick/ToysAndGames/AvgCustomerReviews", "/amazon/keywordsPhilipDick/ToysAndGames/Featured", "/amazon/keywordsPhilipDick/ToysAndGames/NewestArrivals", "/amazon/keywordsPhilipDick/ToysAndGames/Price:HighToLow", "/amazon/keywordsPhilipDick/ToysAndGames/Price:LowToHigh", "/amazon/keywordsPhilipDick/ToysAndGames/Relevance", "/amazon/keywordsPhilipDick/VHS/AvgCustomerReviews", "/amazon/keywordsPhilipDick/VHS/Featured", "/amazon/keywordsPhilipDick/VHS/NewestArrivals", "/amazon/keywordsPhilipDick/VHS/Price:HighToLow", "/amazon/keywordsPhilipDick/VHS/Price:LowToHigh", "/amazon/keywordsPhilipDick/VHS/Relevance", "/amazon/keywordsPhilipDick/VideoGames/AvgCustomerReviews", "/amazon/keywordsPhilipDick/VideoGames/Featured", "/amazon/keywordsPhilipDick/VideoGames/NewestArrivals", "/amazon/keywordsPhilipDick/VideoGames/Price:HighToLow", "/amazon/keywordsPhilipDick/VideoGames/Price:LowToHigh", "/amazon/keywordsPhilipDick/VideoGames/Relevance", "/amazon/keywordsBladeRunner/All/AvgCustomerReviews", "/amazon/keywordsBladeRunner/All/Featured", "/amazon/keywordsBladeRunner/All/NewestArrivals", "/amazon/keywordsBladeRunner/All/Price:HighToLow", "/amazon/keywordsBladeRunner/All/Price:LowToHigh", "/amazon/keywordsBladeRunner/All/Relevance", "/amazon/keywordsBladeRunner/AmazonVideo/AvgCustomerReviews", "/amazon/keywordsBladeRunner/AmazonVideo/Featured", "/amazon/keywordsBladeRunner/AmazonVideo/NewestArrivals", "/amazon/keywordsBladeRunner/AmazonVideo/Price:HighToLow", "/amazon/keywordsBladeRunner/AmazonVideo/Price:LowToHigh", "/amazon/keywordsBladeRunner/AmazonVideo/Relevance", "/amazon/keywordsBladeRunner/Books/AvgCustomerReviews", "/amazon/keywordsBladeRunner/Books/Featured", "/amazon/keywordsBladeRunner/Books/NewestArrivals", "/amazon/keywordsBladeRunner/Books/Price:HighToLow", "/amazon/keywordsBladeRunner/Books/Price:LowToHigh", "/amazon/keywordsBladeRunner/Books/Relevance", "/amazon/keywordsBladeRunner/Collectibles/AvgCustomerReviews", "/amazon/keywordsBladeRunner/Collectibles/Featured", "/amazon/keywordsBladeRunner/Collectibles/NewestArrivals", "/amazon/keywordsBladeRunner/Collectibles/Price:HighToLow", "/amazon/keywordsBladeRunner/Collectibles/Price:LowToHigh", "/amazon/keywordsBladeRunner/Collectibles/Relevance", "/amazon/keywordsBladeRunner/DigitalMusic/AvgCustomerReviews", "/amazon/keywordsBladeRunner/DigitalMusic/Featured", "/amazon/keywordsBladeRunner/DigitalMusic/NewestArrivals", "/amazon/keywordsBladeRunner/DigitalMusic/Price:HighToLow", "/amazon/keywordsBladeRunner/DigitalMusic/Price:LowToHigh", "/amazon/keywordsBladeRunner/DigitalMusic/Relevance", "/amazon/keywordsBladeRunner/DigitalEducationalResources/AvgCustomerReviews", "/amazon/keywordsBladeRunner/DigitalEducationalResources/Featured", "/amazon/keywordsBladeRunner/DigitalEducationalResources/NewestArrivals", "/amazon/keywordsBladeRunner/DigitalEducationalResources/Price:HighToLow", "/amazon/keywordsBladeRunner/DigitalEducationalResources/Price:LowToHigh", "/amazon/keywordsBladeRunner/DigitalEducationalResources/Relevance", "/amazon/keywordsBladeRunner/KindleStore/AvgCustomerReviews", "/amazon/keywordsBladeRunner/KindleStore/Featured", "/amazon/keywordsBladeRunner/KindleStore/NewestArrivals", "/amazon/keywordsBladeRunner/KindleStore/Price:HighToLow", "/amazon/keywordsBladeRunner/KindleStore/Price:LowToHigh", "/amazon/keywordsBladeRunner/KindleStore/Relevance", "/amazon/keywordsBladeRunner/MobileApps/AvgCustomerReviews", "/amazon/keywordsBladeRunner/MobileApps/Featured", "/amazon/keywordsBladeRunner/MobileApps/NewestArrivals", "/amazon/keywordsBladeRunner/MobileApps/Price:HighToLow", "/amazon/keywordsBladeRunner/MobileApps/Price:LowToHigh", "/amazon/keywordsBladeRunner/MobileApps/Relevance", "/amazon/keywordsBladeRunner/MoviesAndTV/AvgCustomerReviews", "/amazon/keywordsBladeRunner/MoviesAndTV/Featured", "/amazon/keywordsBladeRunner/MoviesAndTV/NewestArrivals", "/amazon/keywordsBladeRunner/MoviesAndTV/Price:HighToLow", "/amazon/keywordsBladeRunner/MoviesAndTV/Price:LowToHigh", "/amazon/keywordsBladeRunner/MoviesAndTV/Relevance", "/amazon/keywordsBladeRunner/Music/AvgCustomerReviews", "/amazon/keywordsBladeRunner/Music/Featured", "/amazon/keywordsBladeRunner/Music/NewestArrivals", "/amazon/keywordsBladeRunner/Music/Price:HighToLow", "/amazon/keywordsBladeRunner/Music/Price:LowToHigh", "/amazon/keywordsBladeRunner/Music/Relevance", "/amazon/keywordsBladeRunner/ToysAndGames/AvgCustomerReviews", "/amazon/keywordsBladeRunner/ToysAndGames/Featured", "/amazon/keywordsBladeRunner/ToysAndGames/NewestArrivals", "/amazon/keywordsBladeRunner/ToysAndGames/Price:HighToLow", "/amazon/keywordsBladeRunner/ToysAndGames/Price:LowToHigh", "/amazon/keywordsBladeRunner/ToysAndGames/Relevance", "/amazon/keywordsBladeRunner/VHS/AvgCustomerReviews", "/amazon/keywordsBladeRunner/VHS/Featured", "/amazon/keywordsBladeRunner/VHS/NewestArrivals", "/amazon/keywordsBladeRunner/VHS/Price:HighToLow", "/amazon/keywordsBladeRunner/VHS/Price:LowToHigh", "/amazon/keywordsBladeRunner/VHS/Relevance", "/amazon/keywordsBladeRunner/VideoGames/AvgCustomerReviews", "/amazon/keywordsBladeRunner/VideoGames/Featured", "/amazon/keywordsBladeRunner/VideoGames/NewestArrivals", "/amazon/keywordsBladeRunner/VideoGames/Price:HighToLow", "/amazon/keywordsBladeRunner/VideoGames/Price:LowToHigh", "/amazon/keywordsBladeRunner/VideoGames/Relevance"];

let urlArrayFiltered = ["/amazon/authorPhilipKDick/All/AvgCustomerReviews", "/amazon/authorPhilipKDick/All/Featured", "/amazon/authorPhilipKDick/All/NewestArrivals", "/amazon/authorPhilipKDick/All/Price:HighToLow", "/amazon/authorPhilipKDick/All/Price:LowToHigh", "/amazon/authorPhilipKDick/All/Relevance", "/amazon/authorPhilipKDick/AmazonVideo/AvgCustomerReviews", "/amazon/authorPhilipKDick/AmazonVideo/Featured", "/amazon/authorPhilipKDick/AmazonVideo/NewestArrivals", "/amazon/authorPhilipKDick/AmazonVideo/Price:HighToLow", "/amazon/authorPhilipKDick/AmazonVideo/Price:LowToHigh", "/amazon/authorPhilipKDick/AmazonVideo/Relevance", "/amazon/authorPhilipKDick/Books/AvgCustomerReviews", "/amazon/authorPhilipKDick/Books/Featured", "/amazon/authorPhilipKDick/Books/NewestArrivals", "/amazon/authorPhilipKDick/Books/Price:HighToLow", "/amazon/authorPhilipKDick/Books/Price:LowToHigh", "/amazon/authorPhilipKDick/Books/Relevance", "/amazon/authorPhilipKDick/Collectibles/AvgCustomerReviews", "/amazon/authorPhilipKDick/Collectibles/Featured", "/amazon/authorPhilipKDick/Collectibles/NewestArrivals", "/amazon/authorPhilipKDick/Collectibles/Price:HighToLow", "/amazon/authorPhilipKDick/Collectibles/Price:LowToHigh", "/amazon/authorPhilipKDick/Collectibles/Relevance", "/amazon/authorPhilipKDick/KindleStore/AvgCustomerReviews", "/amazon/authorPhilipKDick/KindleStore/Featured", "/amazon/authorPhilipKDick/KindleStore/NewestArrivals", "/amazon/authorPhilipKDick/KindleStore/Price:HighToLow", "/amazon/authorPhilipKDick/KindleStore/Price:LowToHigh", "/amazon/authorPhilipKDick/KindleStore/Relevance", "/amazon/authorPhilipKDick/MoviesAndTV/AvgCustomerReviews", "/amazon/authorPhilipKDick/MoviesAndTV/Featured", "/amazon/authorPhilipKDick/MoviesAndTV/NewestArrivals", "/amazon/authorPhilipKDick/MoviesAndTV/Price:HighToLow", "/amazon/authorPhilipKDick/MoviesAndTV/Price:LowToHigh", "/amazon/authorPhilipKDick/MoviesAndTV/Relevance", "/amazon/keywordsPhilipDick/All/AvgCustomerReviews", "/amazon/keywordsPhilipDick/All/Featured", "/amazon/keywordsPhilipDick/All/NewestArrivals", "/amazon/keywordsPhilipDick/All/Price:HighToLow", "/amazon/keywordsPhilipDick/All/Price:LowToHigh", "/amazon/keywordsPhilipDick/All/Relevance", "/amazon/keywordsPhilipDick/AmazonVideo/AvgCustomerReviews", "/amazon/keywordsPhilipDick/AmazonVideo/Featured", "/amazon/keywordsPhilipDick/AmazonVideo/NewestArrivals", "/amazon/keywordsPhilipDick/AmazonVideo/Price:HighToLow", "/amazon/keywordsPhilipDick/AmazonVideo/Price:LowToHigh", "/amazon/keywordsPhilipDick/AmazonVideo/Relevance", "/amazon/keywordsPhilipDick/Books/AvgCustomerReviews", "/amazon/keywordsPhilipDick/Books/Featured", "/amazon/keywordsPhilipDick/Books/NewestArrivals", "/amazon/keywordsPhilipDick/Books/Price:HighToLow", "/amazon/keywordsPhilipDick/Books/Price:LowToHigh", "/amazon/keywordsPhilipDick/Books/Relevance", "/amazon/keywordsPhilipDick/Collectibles/AvgCustomerReviews", "/amazon/keywordsPhilipDick/Collectibles/Featured", "/amazon/keywordsPhilipDick/Collectibles/NewestArrivals", "/amazon/keywordsPhilipDick/Collectibles/Price:HighToLow", "/amazon/keywordsPhilipDick/Collectibles/Price:LowToHigh", "/amazon/keywordsPhilipDick/Collectibles/Relevance", "/amazon/keywordsPhilipDick/KindleStore/AvgCustomerReviews", "/amazon/keywordsPhilipDick/KindleStore/Featured", "/amazon/keywordsPhilipDick/KindleStore/NewestArrivals", "/amazon/keywordsPhilipDick/KindleStore/Price:HighToLow", "/amazon/keywordsPhilipDick/KindleStore/Price:LowToHigh", "/amazon/keywordsPhilipDick/KindleStore/Relevance", "/amazon/keywordsPhilipDick/MoviesAndTV/AvgCustomerReviews", "/amazon/keywordsPhilipDick/MoviesAndTV/Featured", "/amazon/keywordsPhilipDick/MoviesAndTV/NewestArrivals", "/amazon/keywordsPhilipDick/MoviesAndTV/Price:HighToLow", "/amazon/keywordsPhilipDick/MoviesAndTV/Price:LowToHigh", "/amazon/keywordsPhilipDick/MoviesAndTV/Relevance", "/amazon/keywordsBladeRunner/All/AvgCustomerReviews", "/amazon/keywordsBladeRunner/All/Featured", "/amazon/keywordsBladeRunner/All/NewestArrivals", "/amazon/keywordsBladeRunner/All/Price:HighToLow", "/amazon/keywordsBladeRunner/All/Price:LowToHigh", "/amazon/keywordsBladeRunner/All/Relevance", "/amazon/keywordsBladeRunner/AmazonVideo/AvgCustomerReviews", "/amazon/keywordsBladeRunner/AmazonVideo/Featured", "/amazon/keywordsBladeRunner/AmazonVideo/NewestArrivals", "/amazon/keywordsBladeRunner/AmazonVideo/Price:HighToLow", "/amazon/keywordsBladeRunner/AmazonVideo/Price:LowToHigh", "/amazon/keywordsBladeRunner/AmazonVideo/Relevance", "/amazon/keywordsBladeRunner/Books/AvgCustomerReviews", "/amazon/keywordsBladeRunner/Books/Featured", "/amazon/keywordsBladeRunner/Books/NewestArrivals", "/amazon/keywordsBladeRunner/Books/Price:HighToLow", "/amazon/keywordsBladeRunner/Books/Price:LowToHigh", "/amazon/keywordsBladeRunner/Books/Relevance", "/amazon/keywordsBladeRunner/Collectibles/AvgCustomerReviews", "/amazon/keywordsBladeRunner/Collectibles/Featured", "/amazon/keywordsBladeRunner/Collectibles/NewestArrivals", "/amazon/keywordsBladeRunner/Collectibles/Price:HighToLow", "/amazon/keywordsBladeRunner/Collectibles/Price:LowToHigh", "/amazon/keywordsBladeRunner/Collectibles/Relevance", "/amazon/keywordsBladeRunner/KindleStore/AvgCustomerReviews", "/amazon/keywordsBladeRunner/KindleStore/Featured", "/amazon/keywordsBladeRunner/KindleStore/NewestArrivals", "/amazon/keywordsBladeRunner/KindleStore/Price:HighToLow", "/amazon/keywordsBladeRunner/KindleStore/Price:LowToHigh", "/amazon/keywordsBladeRunner/KindleStore/Relevance", "/amazon/keywordsBladeRunner/MoviesAndTV/AvgCustomerReviews", "/amazon/keywordsBladeRunner/MoviesAndTV/Featured", "/amazon/keywordsBladeRunner/MoviesAndTV/NewestArrivals", "/amazon/keywordsBladeRunner/MoviesAndTV/Price:HighToLow", "/amazon/keywordsBladeRunner/MoviesAndTV/Price:LowToHigh", "/amazon/keywordsBladeRunner/MoviesAndTV/Relevance"];

let urlArrayFilteredNewestArrivals = ["/amazon/authorPhilipKDick/All/NewestArrivals", "/amazon/authorPhilipKDick/AmazonVideo/NewestArrivals", "/amazon/authorPhilipKDick/Books/NewestArrivals", "/amazon/authorPhilipKDick/Collectibles/NewestArrivals", "/amazon/authorPhilipKDick/DigitalMusic/NewestArrivals", "/amazon/authorPhilipKDick/DigitalEducationalResources/NewestArrivals", "/amazon/authorPhilipKDick/KindleStore/NewestArrivals", "/amazon/authorPhilipKDick/MobileApps/NewestArrivals", "/amazon/authorPhilipKDick/MoviesAndTV/NewestArrivals", "/amazon/authorPhilipKDick/Music/NewestArrivals", "/amazon/authorPhilipKDick/ToysAndGames/NewestArrivals", "/amazon/authorPhilipKDick/VHS/NewestArrivals", "/amazon/authorPhilipKDick/VideoGames/NewestArrivals", "/amazon/keywordsPhilipDick/All/NewestArrivals", "/amazon/keywordsPhilipDick/AmazonVideo/NewestArrivals", "/amazon/keywordsPhilipDick/Books/NewestArrivals", "/amazon/keywordsPhilipDick/Collectibles/NewestArrivals", "/amazon/keywordsPhilipDick/DigitalMusic/NewestArrivals", "/amazon/keywordsPhilipDick/DigitalEducationalResources/NewestArrivals", "/amazon/keywordsPhilipDick/KindleStore/NewestArrivals", "/amazon/keywordsPhilipDick/MobileApps/NewestArrivals", "/amazon/keywordsPhilipDick/MoviesAndTV/NewestArrivals", "/amazon/keywordsPhilipDick/Music/NewestArrivals", "/amazon/keywordsPhilipDick/ToysAndGames/NewestArrivals", "/amazon/keywordsPhilipDick/VHS/NewestArrivals", "/amazon/keywordsPhilipDick/VideoGames/NewestArrivals", "/amazon/keywordsBladeRunner/All/NewestArrivals", "/amazon/keywordsBladeRunner/AmazonVideo/NewestArrivals", "/amazon/keywordsBladeRunner/Books/NewestArrivals", "/amazon/keywordsBladeRunner/Collectibles/NewestArrivals", "/amazon/keywordsBladeRunner/DigitalMusic/NewestArrivals", "/amazon/keywordsBladeRunner/DigitalEducationalResources/NewestArrivals", "/amazon/keywordsBladeRunner/KindleStore/NewestArrivals", "/amazon/keywordsBladeRunner/MobileApps/NewestArrivals", "/amazon/keywordsBladeRunner/MoviesAndTV/NewestArrivals", "/amazon/keywordsBladeRunner/Music/NewestArrivals", "/amazon/keywordsBladeRunner/ToysAndGames/NewestArrivals", "/amazon/keywordsBladeRunner/VHS/NewestArrivals", "/amazon/keywordsBladeRunner/VideoGames/NewestArrivals"];

// let urlArraySelected = [...urlArrayFull];
let urlArraySelected = [...urlArrayFiltered];
// let urlArraySelected = [...urlArrayFilteredNewestArrivals];

let urlArray = urlArraySelected.map((a) => (
  { sort: Math.random(), value: a }
))
  .sort((a, b) => a.sort - b.sort)
  .map((a) => a.value);

// let urlArray = urlArrayFiltered.map((a) => (
//   { sort: Math.random(), value: a }
// ))
//   .sort((a, b) => a.sort - b.sort)
//   .map((a) => a.value);

// let urlArray = urlArrayFilteredNewestArrivals.map((a) => (
//   { sort: Math.random(), value: a }
// ))
//   .sort((a, b) => a.sort - b.sort)
//   .map((a) => a.value);

// let waitTime = 10000; // * 10 seconds -- 01/09/2022 MF
// let waitTime = 60000; // * 1 minutes -- 01/09/2022 MF
// let waitTime = 180000; // * 3 minutes -- 01/09/2022 MF
// let waitTime = 300000; // * 5 minutes -- 01/09/2022 MF
let waitTime = 600000; // * 10 minutes -- 01/09/2022 MF

// * https://stackoverflow.com/questions/3583724/how-do-i-add-a-delay-in-a-javascript-loop -- 01/02/2022 MF
// * Returns a Promise that resolves after "ms" Milliseconds. -- 01/02/2022
const timer = milliseconds => new Promise(response => setTimeout(response, milliseconds));

let merchant = process.argv[3];

// merchant = "All";
// merchant = "Amazon";

if (merchant === "" || merchant === null || merchant === undefined) {

  merchant = "Amazon";

};

// * We need to wrap the loop into an async function for this to work. -- 01/02/2022
async function load() {

  for (let i = 1; i < urlArray.length; i++) {

    if (environmentMode === 'development' || process.env.NODE_ENV === "development") {

      console.log(getDateTime(), i, "of", urlArray.length, "baseURL + urlArray[i] + `/${merchant}`", baseURL + urlArray[i] + `/${merchant}`);

    };

    axios.get(baseURL + urlArray[i] + `/${merchant}`,
      {
        headers: {
          "Content-Type": "application/json"
        }
      })
      .then((results) => {

        if (environmentMode === 'development' || process.env.NODE_ENV === "development") {

          console.log(getDateTime(), "results.data", results.data);

        };

      })
      .catch((error) => {

        console.error(getDateTime(), "error", error);

        // if (IsEmpty(error.request) === false) {

        //   console.error(getDateTime(), "error.request", error.request);

        // } else if (IsEmpty(error.response) === false) {

        //   console.error(getDateTime(), "error.response", error.response);

        // };

        // if (IsEmpty(error.response) === false && IsEmpty(error.response.data) === false) {

        //   console.error(getDateTime(), "error.response.data", error.response.data);

        // };

        // if (IsEmpty(error.response) === false && IsEmpty(error.response.data) === false && IsEmpty(error.response.data.errors) === false) {

        //   console.error(getDateTime(), "error.response.data.errors", error.response.data.errors);

        // };

      });

    // * Then the created Promise can be awaited. -- 01/02/2022
    await timer(waitTime);

  };

};

load();
