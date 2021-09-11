  
  SELECT titles.*, categories.*, userReviews.*, userReviews.updatedBy AS userReviewUpdatedBy, userReviews.active AS userReviewActive, userReviews.createDate AS userReviewCreateDate, userReviews.updateDate AS userReviewUpdatedDate, titles.titleID, titles.publicationDate AS titlePublicationDate, titles.imageName AS titleImageName, titles.active AS titleActive, titles.createDate AS titleCreateDate, titles.updateDate AS titleUpdatedDate, categories.sortID AS categorySortID, categories.active AS categoryActive, categories.createDate AS categoryCreateDate, categories.updateDate AS categoryUpdatedDate FROM titles LEFT OUTER JOIN userReviews ON userReviews.titleID = titles.titleID LEFT OUTER JOIN categories ON categories.categoryID = titles.categoryID 
  WHERE userReviews.userID = 2 AND
  (userReviews.active = 1 OR userReviews.active IS null) 
  AND titles.active = 'true'
  AND categories.active = 'true'

  UNION ALL
  
  SELECT titles.*, categories.*, null AS reviewID, null AS userID, null AS updatedB, null AS titleID, null AS 'read', null AS dateRead, null AS rating, null AS ranking, null AS shortReview, null AS longReview, null AS owned, null AS datePurchASed, null AS active, null AS createDate, null AS updateDate, null AS userReviewUpdatedBy, null AS userReviewActive, null AS userReviewCreateDate, null AS userReviewUpdatedDate, titles.titleID, titles.publicationDate AS titlePublicationDate, titles.imageName AS titleImageName, titles.active AS titleActive, titles.createDate AS titleCreateDate, titles.updateDate AS titleUpdatedDate, categories.sortID AS categorySortID, categories.active AS categoryActive, categories.createDate AS categoryCreateDate, categories.updateDate AS categoryUpdatedDate
  FROM titles
  LEFT OUTER JOIN userReviews ON userReviews.titleID = titles.titleID
  LEFT OUTER JOIN categories ON categories.categoryID = titles.categoryID 
  WHERE titles.titleID NOT IN (
  SELECT titles.titleID
  FROM titles
  LEFT OUTER JOIN userReviews ON userReviews.titleID = titles.titleID
  LEFT OUTER JOIN categories ON categories.categoryID = titles.categoryID 
  WHERE userReviews.userID = 2 AND
  (userReviews.active = 1 OR userReviews.active IS null) 
  AND titles.active = 'true'
  AND categories.active = 'true'
  )
  AND titles.active = 'true'
  AND categories.active = 'true'
  
  ORDER BY titleSort ASC
