
-- https://stackoverflow.com/questions/11731655/how-to-do-a-count-on-a-union-query
SELECT urls.linkName, COUNT(*) AS linknamecount
FROM (
	SELECT REPLACE(category, ' ', '-') AS linkname FROM categories
	UNION ALL
	SELECT REPLACE(media, ' ', '-') AS linkname FROM media
	UNION ALL
	SELECT "titleURL" AS linkname FROM titles
) AS urls
GROUP BY linkname
ORDER BY linknamecount DESC, linkname


-- https://stackoverflow.com/questions/1266666/using-union-and-count-together-in-sql-query
SELECT urls.linkName, COUNT(*) AS linknamecount
FROM (
	SELECT category AS linkname FROM categories
	UNION
	SELECT media AS linkname FROM media
	UNION
	SELECT "titleURL" AS linkname FROM titles
) AS urls
GROUP BY linkname
ORDER BY linknamecount, linkname


SELECT REPLACE(urls.linkName, ' ', '-') AS linkname, COUNT(*) AS linknamecount
FROM (
	SELECT category AS linkname FROM categories
	UNION
	SELECT media AS linkname FROM media
	UNION
	SELECT "titleURL" AS linkname FROM titles
) AS urls
GROUP BY linkname
ORDER BY linknamecount, linkname