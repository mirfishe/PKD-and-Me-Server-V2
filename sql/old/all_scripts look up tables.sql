
INSERT INTO categories ("category", "sortID", "createDate", "updateDate") values ('Novels', (SELECT CASE WHEN (SELECT COUNT("sortID") FROM categories) = 0 THEN 1 ELSE (SELECT MAX("sortID") + 1 FROM categories) END), NOW(), NOW());
INSERT INTO categories ("category", "sortID", "createDate", "updateDate") values ('Short Stories', (SELECT CASE WHEN (SELECT COUNT("sortID") FROM categories) = 0 THEN 1 ELSE (SELECT MAX("sortID") + 1 FROM categories) END), NOW(), NOW());
INSERT INTO categories ("category", "sortID", "createDate", "updateDate") values ('Non Fiction', (SELECT CASE WHEN (SELECT COUNT("sortID") FROM categories) = 0 THEN 1 ELSE (SELECT MAX("sortID") + 1 FROM categories) END), NOW(), NOW());
INSERT INTO categories ("category", "sortID", "createDate", "updateDate") values ('Secondary Resources', (SELECT CASE WHEN (SELECT COUNT("sortID") FROM categories) = 0 THEN 1 ELSE (SELECT MAX("sortID") + 1 FROM categories) END), NOW(), NOW());
INSERT INTO categories ("category", "sortID", "createDate", "updateDate") values ('Secondary Resources - Blade Runner', (SELECT CASE WHEN (SELECT COUNT("sortID") FROM categories) = 0 THEN 1 ELSE (SELECT MAX("sortID") + 1 FROM categories) END), NOW(), NOW());
INSERT INTO categories ("category", "sortID", "createDate", "updateDate") values ('Film', (SELECT CASE WHEN (SELECT COUNT("sortID") FROM categories) = 0 THEN 1 ELSE (SELECT MAX("sortID") + 1 FROM categories) END), NOW(), NOW());
INSERT INTO categories ("category", "sortID", "createDate", "updateDate") values ('Television', (SELECT CASE WHEN (SELECT COUNT("sortID") FROM categories) = 0 THEN 1 ELSE (SELECT MAX("sortID") + 1 FROM categories) END), NOW(), NOW());
INSERT INTO categories ("category", "sortID", "createDate", "updateDate") values ('Documentaries', (SELECT CASE WHEN (SELECT COUNT("sortID") FROM categories) = 0 THEN 1 ELSE (SELECT MAX("sortID") + 1 FROM categories) END), NOW(), NOW());
INSERT INTO categories ("category", "sortID", "createDate", "updateDate") values ('Radio', (SELECT CASE WHEN (SELECT COUNT("sortID") FROM categories) = 0 THEN 1 ELSE (SELECT MAX("sortID") + 1 FROM categories) END), NOW(), NOW());
INSERT INTO categories ("category", "sortID", "createDate", "updateDate") values ('Music', (SELECT CASE WHEN (SELECT COUNT("sortID") FROM categories) = 0 THEN 1 ELSE (SELECT MAX("sortID") + 1 FROM categories) END), NOW(), NOW());
INSERT INTO categories ("category", "sortID", "createDate", "updateDate") values ('Games', (SELECT CASE WHEN (SELECT COUNT("sortID") FROM categories) = 0 THEN 1 ELSE (SELECT MAX("sortID") + 1 FROM categories) END), NOW(), NOW());






INSERT INTO media ("media", "sortID", "createDate", "updateDate") values ('Paperback', (SELECT CASE WHEN (SELECT COUNT("sortID") FROM media) = 0 THEN 1 ELSE (SELECT MAX("sortID") + 1 FROM media) END), NOW(), NOW());
INSERT INTO media ("media", "sortID", "createDate", "updateDate") values ('Hardcover', (SELECT CASE WHEN (SELECT COUNT("sortID") FROM media) = 0 THEN 1 ELSE (SELECT MAX("sortID") + 1 FROM media) END), NOW(), NOW());
INSERT INTO media ("media", "sortID", "createDate", "updateDate") values ('Kindle', (SELECT CASE WHEN (SELECT COUNT("sortID") FROM media) = 0 THEN 1 ELSE (SELECT MAX("sortID") + 1 FROM media) END), NOW(), NOW());
INSERT INTO media ("media", "sortID", "createDate", "updateDate") values ('Audiobook', (SELECT CASE WHEN (SELECT COUNT("sortID") FROM media) = 0 THEN 1 ELSE (SELECT MAX("sortID") + 1 FROM media) END), NOW(), NOW());
INSERT INTO media ("media", "sortID", "createDate", "updateDate") values ('Audiobook CD', (SELECT CASE WHEN (SELECT COUNT("sortID") FROM media) = 0 THEN 1 ELSE (SELECT MAX("sortID") + 1 FROM media) END), NOW(), NOW());
INSERT INTO media ("media", "sortID", "createDate", "updateDate") values ('Film VHS', (SELECT CASE WHEN (SELECT COUNT("sortID") FROM media) = 0 THEN 1 ELSE (SELECT MAX("sortID") + 1 FROM media) END), NOW(), NOW());
INSERT INTO media ("media", "sortID", "createDate", "updateDate") values ('Film DVD', (SELECT CASE WHEN (SELECT COUNT("sortID") FROM media) = 0 THEN 1 ELSE (SELECT MAX("sortID") + 1 FROM media) END), NOW(), NOW());
INSERT INTO media ("media", "sortID", "createDate", "updateDate") values ('Film HD DVD', (SELECT CASE WHEN (SELECT COUNT("sortID") FROM media) = 0 THEN 1 ELSE (SELECT MAX("sortID") + 1 FROM media) END), NOW(), NOW());
INSERT INTO media ("media", "sortID", "createDate", "updateDate") values ('Film Blu-ray', (SELECT CASE WHEN (SELECT COUNT("sortID") FROM media) = 0 THEN 1 ELSE (SELECT MAX("sortID") + 1 FROM media) END), NOW(), NOW());
INSERT INTO media ("media", "sortID", "createDate", "updateDate") values ('Film 4K', (SELECT CASE WHEN (SELECT COUNT("sortID") FROM media) = 0 THEN 1 ELSE (SELECT MAX("sortID") + 1 FROM media) END), NOW(), NOW());
INSERT INTO media ("media", "sortID", "createDate", "updateDate") values ('Film Multi-Format', (SELECT CASE WHEN (SELECT COUNT("sortID") FROM media) = 0 THEN 1 ELSE (SELECT MAX("sortID") + 1 FROM media) END), NOW(), NOW());
INSERT INTO media ("media", "sortID", "createDate", "updateDate") values ('Film Download', (SELECT CASE WHEN (SELECT COUNT("sortID") FROM media) = 0 THEN 1 ELSE (SELECT MAX("sortID") + 1 FROM media) END), NOW(), NOW());
INSERT INTO media ("media", "sortID", "createDate", "updateDate") values ('Television VHS', (SELECT CASE WHEN (SELECT COUNT("sortID") FROM media) = 0 THEN 1 ELSE (SELECT MAX("sortID") + 1 FROM media) END), NOW(), NOW());
INSERT INTO media ("media", "sortID", "createDate", "updateDate") values ('Television DVD', (SELECT CASE WHEN (SELECT COUNT("sortID") FROM media) = 0 THEN 1 ELSE (SELECT MAX("sortID") + 1 FROM media) END), NOW(), NOW());
INSERT INTO media ("media", "sortID", "createDate", "updateDate") values ('Television HD DVD', (SELECT CASE WHEN (SELECT COUNT("sortID") FROM media) = 0 THEN 1 ELSE (SELECT MAX("sortID") + 1 FROM media) END), NOW(), NOW());
INSERT INTO media ("media", "sortID", "createDate", "updateDate") values ('Television Blu-ray', (SELECT CASE WHEN (SELECT COUNT("sortID") FROM media) = 0 THEN 1 ELSE (SELECT MAX("sortID") + 1 FROM media) END), NOW(), NOW());
INSERT INTO media ("media", "sortID", "createDate", "updateDate") values ('Television 4K', (SELECT CASE WHEN (SELECT COUNT("sortID") FROM media) = 0 THEN 1 ELSE (SELECT MAX("sortID") + 1 FROM media) END), NOW(), NOW());
INSERT INTO media ("media", "sortID", "createDate", "updateDate") values ('Television Multi-Format', (SELECT CASE WHEN (SELECT COUNT("sortID") FROM media) = 0 THEN 1 ELSE (SELECT MAX("sortID") + 1 FROM media) END), NOW(), NOW());
INSERT INTO media ("media", "sortID", "createDate", "updateDate") values ('Television Download', (SELECT CASE WHEN (SELECT COUNT("sortID") FROM media) = 0 THEN 1 ELSE (SELECT MAX("sortID") + 1 FROM media) END), NOW(), NOW());
INSERT INTO media ("media", "sortID", "createDate", "updateDate") values ('Documentaries VHS', (SELECT CASE WHEN (SELECT COUNT("sortID") FROM media) = 0 THEN 1 ELSE (SELECT MAX("sortID") + 1 FROM media) END), NOW(), NOW());
INSERT INTO media ("media", "sortID", "createDate", "updateDate") values ('Documentaries DVD', (SELECT CASE WHEN (SELECT COUNT("sortID") FROM media) = 0 THEN 1 ELSE (SELECT MAX("sortID") + 1 FROM media) END), NOW(), NOW());
INSERT INTO media ("media", "sortID", "createDate", "updateDate") values ('Documentaries HD DVD', (SELECT CASE WHEN (SELECT COUNT("sortID") FROM media) = 0 THEN 1 ELSE (SELECT MAX("sortID") + 1 FROM media) END), NOW(), NOW());
INSERT INTO media ("media", "sortID", "createDate", "updateDate") values ('Documentaries Blu-ray', (SELECT CASE WHEN (SELECT COUNT("sortID") FROM media) = 0 THEN 1 ELSE (SELECT MAX("sortID") + 1 FROM media) END), NOW(), NOW());
INSERT INTO media ("media", "sortID", "createDate", "updateDate") values ('Documentaries 4K', (SELECT CASE WHEN (SELECT COUNT("sortID") FROM media) = 0 THEN 1 ELSE (SELECT MAX("sortID") + 1 FROM media) END), NOW(), NOW());
INSERT INTO media ("media", "sortID", "createDate", "updateDate") values ('Documentaries Multi-Format', (SELECT CASE WHEN (SELECT COUNT("sortID") FROM media) = 0 THEN 1 ELSE (SELECT MAX("sortID") + 1 FROM media) END), NOW(), NOW());
INSERT INTO media ("media", "sortID", "createDate", "updateDate") values ('Documentaries Download', (SELECT CASE WHEN (SELECT COUNT("sortID") FROM media) = 0 THEN 1 ELSE (SELECT MAX("sortID") + 1 FROM media) END), NOW(), NOW());
INSERT INTO media ("media", "sortID", "createDate", "updateDate") values ('Music CD', (SELECT CASE WHEN (SELECT COUNT("sortID") FROM media) = 0 THEN 1 ELSE (SELECT MAX("sortID") + 1 FROM media) END), NOW(), NOW());
INSERT INTO media ("media", "sortID", "createDate", "updateDate") values ('Music MP3', (SELECT CASE WHEN (SELECT COUNT("sortID") FROM media) = 0 THEN 1 ELSE (SELECT MAX("sortID") + 1 FROM media) END), NOW(), NOW());
INSERT INTO media ("media", "sortID", "createDate", "updateDate") values ('Music Streaming', (SELECT CASE WHEN (SELECT COUNT("sortID") FROM media) = 0 THEN 1 ELSE (SELECT MAX("sortID") + 1 FROM media) END), NOW(), NOW());
INSERT INTO media ("media", "sortID", "createDate", "updateDate") values ('Video Game', (SELECT CASE WHEN (SELECT COUNT("sortID") FROM media) = 0 THEN 1 ELSE (SELECT MAX("sortID") + 1 FROM media) END), NOW(), NOW());
INSERT INTO media ("media", "sortID", "createDate", "updateDate") values ('Game', (SELECT CASE WHEN (SELECT COUNT("sortID") FROM media) = 0 THEN 1 ELSE (SELECT MAX("sortID") + 1 FROM media) END), NOW(), NOW());