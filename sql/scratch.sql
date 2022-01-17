
SELECT DISTINCT SUBSTRING_INDEX(SUBSTRING_INDEX(SUBSTRING_INDEX(SUBSTRING_INDEX(REPLACE(itemLink, 'https://www.google.com/url?rct=j&sa=t&url=', ''), '/', 3), '://', -1), '/', 1), '?', 1) FROM homeopapeRSS WHERE alwaysFilter = 1

REPLACE(itemLink, 'https://www.google.com/url?rct=j&sa=t&url=', '')

SUBSTRING_INDEX(SUBSTRING_INDEX(SUBSTRING_INDEX(SUBSTRING_INDEX(REPLACE(itemLink, 'https://www.google.com/url?rct=j&sa=t&url=', ''), '/', 3), '://', -1), '/', 1), '?', 1)



SELECT SUBSTRING_INDEX(SUBSTRING_INDEX(SUBSTRING_INDEX(SUBSTRING_INDEX(REPLACE(itemLink, 'https://www.google.com/url?rct=j&sa=t&url=', ''), '/', 3), '://', -1), '/', 1), '?', 1) FROM homeopapeRSS WHERE SUBSTRING_INDEX(SUBSTRING_INDEX(SUBSTRING_INDEX(SUBSTRING_INDEX(REPLACE(itemLink, 'https://www.google.com/url?rct=j&sa=t&url=', ''), '/', 3), '://', -1), '/', 1), '?', 1) IN (SELECT DISTINCT SUBSTRING_INDEX(SUBSTRING_INDEX(SUBSTRING_INDEX(SUBSTRING_INDEX(REPLACE(itemLink, 'https://www.google.com/url?rct=j&sa=t&url=', ''), '/', 3), '://', -1), '/', 1), '?', 1) FROM homeopapeRSS WHERE alwaysFilter = 1)




UPDATE homeopapeRSS SET viewed = 1, display = 0, alwaysFilter = 1 WHERE SUBSTRING_INDEX(SUBSTRING_INDEX(SUBSTRING_INDEX(SUBSTRING_INDEX(REPLACE(itemLink, 'https://www.google.com/url?rct=j&sa=t&url=', ''), '/', 3), '://', -1), '/', 1), '?', 1) IN (SELECT * FROM (SELECT DISTINCT SUBSTRING_INDEX(SUBSTRING_INDEX(SUBSTRING_INDEX(SUBSTRING_INDEX(REPLACE(itemLink, 'https://www.google.com/url?rct=j&sa=t&url=', ''), '/', 3), '://', -1), '/', 1), '?', 1) FROM homeopapeRSS WHERE alwaysFilter = 1) AS alwaysFiltered)

UPDATE homeopapeRSS SET viewed = 1, display = 0, alwaysFilter = 1 WHERE homeopapeID IN (SELECT * FROM (SELECT homeopapeID FROM homeopapeRSS WHERE itemLink LIKE '%.ebay.%' OR itemLink LIKE '%.reddit.%' OR itemLink LIKE '%.craigslist.%' OR itemLink LIKE '%.amazon.%' OR itemLink LIKE '%.audible.%' OR itemLink LIKE '%.pinterest.%' OR itemLink LIKE '%.twitter.%' OR itemLink LIKE '%.facebook.%' OR itemLink LIKE '%.tiktok.%' OR itemLink LIKE '%sites.google.%' OR itemLink LIKE '%books.google.%' OR itemLink LIKE '%elasticsearch.columbian.com%' OR itemLink LIKE '%news.ycombinator.com%') AS neverDisplay)

UPDATE homeopapeRSS SET viewed = 1, display = 0 WHERE homeopapeID IN (SELECT * FROM (SELECT homeopapeID FROM homeopapeRSS WHERE LOWER(itemTitle) LIKE '%pistorius%' OR LOWER(itemContentSnippet) LIKE '%pistorius%') AS neverDisplay)

UPDATE homeopapeRSS SET viewed = 1, display = 0 WHERE homeopapeID IN (SELECT * FROM (SELECT homeopapeID FROM homeopapeRSS WHERE LOWER(itemTitle) LIKE '%major dp singh%' OR LOWER(itemContentSnippet) LIKE '%major dp singh%' OR LOWER(itemTitle) LIKE '%india''s first blade runner%' OR LOWER(itemContentSnippet) LIKE '%india''s first blade runner%' OR (LOWER(itemTitle) LIKE '%singh%' AND LOWER(itemTitle) LIKE '%blade runner%') OR (LOWER(itemContentSnippet) LIKE '%singh%' AND LOWER(itemContentSnippet) LIKE '%blade runner%')) AS neverDisplay)

UPDATE homeopapeRSS SET viewed = 1, display = 0 WHERE homeopapeID IN (SELECT * FROM (SELECT homeopapeID FROM homeopapeRSS WHERE LOWER(itemTitle) LIKE '%pistorius%' OR LOWER(itemContentSnippet) LIKE '%pistorius%' OR LOWER(itemTitle) LIKE '%major dp singh%' OR LOWER(itemContentSnippet) LIKE '%major dp singh%' OR LOWER(itemTitle) LIKE '%india''s first blade runner%' OR LOWER(itemContentSnippet) LIKE '%india''s first blade runner%' OR (LOWER(itemTitle) LIKE '%singh%' AND LOWER(itemTitle) LIKE '%blade runner%') OR (LOWER(itemContentSnippet) LIKE '%singh%' AND LOWER(itemContentSnippet) LIKE '%blade runner%')) AS neverDisplay)

