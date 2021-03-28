--checking for active editions in inactive titles
select * from editions
where "titleID" in (select "titleID" from titles where active = false);

--checking for active titles in inactive categories
select * from titles
where "categoryID" in (select "categoryID" from categories where active = false);

--checking for active editions in inactive media
select * from editions
where "mediaID" in (select "mediaID" from media where active = false);