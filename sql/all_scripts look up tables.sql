
INSERT INTO categories ("category", "sortID", "createdAt", "updatedAt") values ('Novels', (SELECT CASE WHEN (SELECT COUNT("sortID") FROM categories) = 0 THEN 1 ELSE (SELECT MAX("sortID") + 1 FROM categories) END), NOW(), NOW());
INSERT INTO categories ("category", "sortID", "createdAt", "updatedAt") values ('Short Stories', (SELECT CASE WHEN (SELECT COUNT("sortID") FROM categories) = 0 THEN 1 ELSE (SELECT MAX("sortID") + 1 FROM categories) END), NOW(), NOW());
INSERT INTO categories ("category", "sortID", "createdAt", "updatedAt") values ('Non Fiction', (SELECT CASE WHEN (SELECT COUNT("sortID") FROM categories) = 0 THEN 1 ELSE (SELECT MAX("sortID") + 1 FROM categories) END), NOW(), NOW());
INSERT INTO categories ("category", "sortID", "createdAt", "updatedAt") values ('Secondary Resources', (SELECT CASE WHEN (SELECT COUNT("sortID") FROM categories) = 0 THEN 1 ELSE (SELECT MAX("sortID") + 1 FROM categories) END), NOW(), NOW());
INSERT INTO categories ("category", "sortID", "createdAt", "updatedAt") values ('Secondary Resources - Blade Runner', (SELECT CASE WHEN (SELECT COUNT("sortID") FROM categories) = 0 THEN 1 ELSE (SELECT MAX("sortID") + 1 FROM categories) END), NOW(), NOW());
INSERT INTO categories ("category", "sortID", "createdAt", "updatedAt") values ('Film', (SELECT CASE WHEN (SELECT COUNT("sortID") FROM categories) = 0 THEN 1 ELSE (SELECT MAX("sortID") + 1 FROM categories) END), NOW(), NOW());
INSERT INTO categories ("category", "sortID", "createdAt", "updatedAt") values ('Television', (SELECT CASE WHEN (SELECT COUNT("sortID") FROM categories) = 0 THEN 1 ELSE (SELECT MAX("sortID") + 1 FROM categories) END), NOW(), NOW());
INSERT INTO categories ("category", "sortID", "createdAt", "updatedAt") values ('Documentaries', (SELECT CASE WHEN (SELECT COUNT("sortID") FROM categories) = 0 THEN 1 ELSE (SELECT MAX("sortID") + 1 FROM categories) END), NOW(), NOW());
INSERT INTO categories ("category", "sortID", "createdAt", "updatedAt") values ('Radio', (SELECT CASE WHEN (SELECT COUNT("sortID") FROM categories) = 0 THEN 1 ELSE (SELECT MAX("sortID") + 1 FROM categories) END), NOW(), NOW());
INSERT INTO categories ("category", "sortID", "createdAt", "updatedAt") values ('Music', (SELECT CASE WHEN (SELECT COUNT("sortID") FROM categories) = 0 THEN 1 ELSE (SELECT MAX("sortID") + 1 FROM categories) END), NOW(), NOW());
INSERT INTO categories ("category", "sortID", "createdAt", "updatedAt") values ('Games', (SELECT CASE WHEN (SELECT COUNT("sortID") FROM categories) = 0 THEN 1 ELSE (SELECT MAX("sortID") + 1 FROM categories) END), NOW(), NOW());






INSERT INTO media ("media", "sortID", "createdAt", "updatedAt") values ('Paperback', (SELECT CASE WHEN (SELECT COUNT("sortID") FROM media) = 0 THEN 1 ELSE (SELECT MAX("sortID") + 1 FROM media) END), NOW(), NOW());
INSERT INTO media ("media", "sortID", "createdAt", "updatedAt") values ('Hardcover', (SELECT CASE WHEN (SELECT COUNT("sortID") FROM media) = 0 THEN 1 ELSE (SELECT MAX("sortID") + 1 FROM media) END), NOW(), NOW());
INSERT INTO media ("media", "sortID", "createdAt", "updatedAt") values ('Kindle', (SELECT CASE WHEN (SELECT COUNT("sortID") FROM media) = 0 THEN 1 ELSE (SELECT MAX("sortID") + 1 FROM media) END), NOW(), NOW());
INSERT INTO media ("media", "sortID", "createdAt", "updatedAt") values ('Audiobook', (SELECT CASE WHEN (SELECT COUNT("sortID") FROM media) = 0 THEN 1 ELSE (SELECT MAX("sortID") + 1 FROM media) END), NOW(), NOW());
INSERT INTO media ("media", "sortID", "createdAt", "updatedAt") values ('Audiobook CD', (SELECT CASE WHEN (SELECT COUNT("sortID") FROM media) = 0 THEN 1 ELSE (SELECT MAX("sortID") + 1 FROM media) END), NOW(), NOW());
INSERT INTO media ("media", "sortID", "createdAt", "updatedAt") values ('Film VHS', (SELECT CASE WHEN (SELECT COUNT("sortID") FROM media) = 0 THEN 1 ELSE (SELECT MAX("sortID") + 1 FROM media) END), NOW(), NOW());
INSERT INTO media ("media", "sortID", "createdAt", "updatedAt") values ('Film DVD', (SELECT CASE WHEN (SELECT COUNT("sortID") FROM media) = 0 THEN 1 ELSE (SELECT MAX("sortID") + 1 FROM media) END), NOW(), NOW());
INSERT INTO media ("media", "sortID", "createdAt", "updatedAt") values ('Film HD DVD', (SELECT CASE WHEN (SELECT COUNT("sortID") FROM media) = 0 THEN 1 ELSE (SELECT MAX("sortID") + 1 FROM media) END), NOW(), NOW());
INSERT INTO media ("media", "sortID", "createdAt", "updatedAt") values ('Film Blu-ray', (SELECT CASE WHEN (SELECT COUNT("sortID") FROM media) = 0 THEN 1 ELSE (SELECT MAX("sortID") + 1 FROM media) END), NOW(), NOW());
INSERT INTO media ("media", "sortID", "createdAt", "updatedAt") values ('Film 4K', (SELECT CASE WHEN (SELECT COUNT("sortID") FROM media) = 0 THEN 1 ELSE (SELECT MAX("sortID") + 1 FROM media) END), NOW(), NOW());
INSERT INTO media ("media", "sortID", "createdAt", "updatedAt") values ('Film Multi-Format', (SELECT CASE WHEN (SELECT COUNT("sortID") FROM media) = 0 THEN 1 ELSE (SELECT MAX("sortID") + 1 FROM media) END), NOW(), NOW());
INSERT INTO media ("media", "sortID", "createdAt", "updatedAt") values ('Film Download', (SELECT CASE WHEN (SELECT COUNT("sortID") FROM media) = 0 THEN 1 ELSE (SELECT MAX("sortID") + 1 FROM media) END), NOW(), NOW());
INSERT INTO media ("media", "sortID", "createdAt", "updatedAt") values ('Television VHS', (SELECT CASE WHEN (SELECT COUNT("sortID") FROM media) = 0 THEN 1 ELSE (SELECT MAX("sortID") + 1 FROM media) END), NOW(), NOW());
INSERT INTO media ("media", "sortID", "createdAt", "updatedAt") values ('Television DVD', (SELECT CASE WHEN (SELECT COUNT("sortID") FROM media) = 0 THEN 1 ELSE (SELECT MAX("sortID") + 1 FROM media) END), NOW(), NOW());
INSERT INTO media ("media", "sortID", "createdAt", "updatedAt") values ('Television HD DVD', (SELECT CASE WHEN (SELECT COUNT("sortID") FROM media) = 0 THEN 1 ELSE (SELECT MAX("sortID") + 1 FROM media) END), NOW(), NOW());
INSERT INTO media ("media", "sortID", "createdAt", "updatedAt") values ('Television Blu-ray', (SELECT CASE WHEN (SELECT COUNT("sortID") FROM media) = 0 THEN 1 ELSE (SELECT MAX("sortID") + 1 FROM media) END), NOW(), NOW());
INSERT INTO media ("media", "sortID", "createdAt", "updatedAt") values ('Television 4K', (SELECT CASE WHEN (SELECT COUNT("sortID") FROM media) = 0 THEN 1 ELSE (SELECT MAX("sortID") + 1 FROM media) END), NOW(), NOW());
INSERT INTO media ("media", "sortID", "createdAt", "updatedAt") values ('Television Multi-Format', (SELECT CASE WHEN (SELECT COUNT("sortID") FROM media) = 0 THEN 1 ELSE (SELECT MAX("sortID") + 1 FROM media) END), NOW(), NOW());
INSERT INTO media ("media", "sortID", "createdAt", "updatedAt") values ('Television Download', (SELECT CASE WHEN (SELECT COUNT("sortID") FROM media) = 0 THEN 1 ELSE (SELECT MAX("sortID") + 1 FROM media) END), NOW(), NOW());
INSERT INTO media ("media", "sortID", "createdAt", "updatedAt") values ('Documentaries VHS', (SELECT CASE WHEN (SELECT COUNT("sortID") FROM media) = 0 THEN 1 ELSE (SELECT MAX("sortID") + 1 FROM media) END), NOW(), NOW());
INSERT INTO media ("media", "sortID", "createdAt", "updatedAt") values ('Documentaries DVD', (SELECT CASE WHEN (SELECT COUNT("sortID") FROM media) = 0 THEN 1 ELSE (SELECT MAX("sortID") + 1 FROM media) END), NOW(), NOW());
INSERT INTO media ("media", "sortID", "createdAt", "updatedAt") values ('Documentaries HD DVD', (SELECT CASE WHEN (SELECT COUNT("sortID") FROM media) = 0 THEN 1 ELSE (SELECT MAX("sortID") + 1 FROM media) END), NOW(), NOW());
INSERT INTO media ("media", "sortID", "createdAt", "updatedAt") values ('Documentaries Blu-ray', (SELECT CASE WHEN (SELECT COUNT("sortID") FROM media) = 0 THEN 1 ELSE (SELECT MAX("sortID") + 1 FROM media) END), NOW(), NOW());
INSERT INTO media ("media", "sortID", "createdAt", "updatedAt") values ('Documentaries 4K', (SELECT CASE WHEN (SELECT COUNT("sortID") FROM media) = 0 THEN 1 ELSE (SELECT MAX("sortID") + 1 FROM media) END), NOW(), NOW());
INSERT INTO media ("media", "sortID", "createdAt", "updatedAt") values ('Documentaries Multi-Format', (SELECT CASE WHEN (SELECT COUNT("sortID") FROM media) = 0 THEN 1 ELSE (SELECT MAX("sortID") + 1 FROM media) END), NOW(), NOW());
INSERT INTO media ("media", "sortID", "createdAt", "updatedAt") values ('Documentaries Download', (SELECT CASE WHEN (SELECT COUNT("sortID") FROM media) = 0 THEN 1 ELSE (SELECT MAX("sortID") + 1 FROM media) END), NOW(), NOW());
INSERT INTO media ("media", "sortID", "createdAt", "updatedAt") values ('Music CD', (SELECT CASE WHEN (SELECT COUNT("sortID") FROM media) = 0 THEN 1 ELSE (SELECT MAX("sortID") + 1 FROM media) END), NOW(), NOW());
INSERT INTO media ("media", "sortID", "createdAt", "updatedAt") values ('Music MP3', (SELECT CASE WHEN (SELECT COUNT("sortID") FROM media) = 0 THEN 1 ELSE (SELECT MAX("sortID") + 1 FROM media) END), NOW(), NOW());
INSERT INTO media ("media", "sortID", "createdAt", "updatedAt") values ('Music Streaming', (SELECT CASE WHEN (SELECT COUNT("sortID") FROM media) = 0 THEN 1 ELSE (SELECT MAX("sortID") + 1 FROM media) END), NOW(), NOW());
INSERT INTO media ("media", "sortID", "createdAt", "updatedAt") values ('Video Game', (SELECT CASE WHEN (SELECT COUNT("sortID") FROM media) = 0 THEN 1 ELSE (SELECT MAX("sortID") + 1 FROM media) END), NOW(), NOW());
INSERT INTO media ("media", "sortID", "createdAt", "updatedAt") values ('Game', (SELECT CASE WHEN (SELECT COUNT("sortID") FROM media) = 0 THEN 1 ELSE (SELECT MAX("sortID") + 1 FROM media) END), NOW(), NOW());