
-- CREATE TABLE `titles` (
--   `titleID` int NOT NULL,
--   `titleName` varchar(255) NOT NULL,
--   `titleSort` varchar(255) NOT NULL,
--   `titleURL` varchar(255) NOT NULL,
--   `authorFirstName` varchar(255) DEFAULT NULL,
--   `authorLastName` varchar(255) DEFAULT NULL,
--   `submissionDate` date DEFAULT NULL,
--   `publicationDate` date DEFAULT NULL,
--   `imageName` varchar(255) DEFAULT NULL,
--   `categoryID` int NOT NULL,
--   `shortDescription` text,
--   `urlPKDWeb` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci DEFAULT NULL,
--   `active` tinyint(1) NOT NULL DEFAULT '1',
--   `createDate` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP,
--   `updateDate` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
-- ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

-- INSERT INTO `titles` (`titleID`, `titleName`, `titleSort`, `titleURL`, `authorFirstName`, `authorLastName`, `submissionDate`, `publicationDate`, `imageName`, `categoryID`, `shortDescription`, `urlPKDWeb`, `active`, `createDate`) VALUES
-- (1, 'The Broken Bubble', 'broken bubble, the', 'The-Broken-Bubble', 'Philip K.', 'Dick', '1956-11-13', '1988-07-01', 'https://philipdick.com/images/covers/TheBrokenBubble.jpg', 1, 'Four people\'s lives intertwine and collide in this early novel from one of the SF greats\r\n\r\nSan Francisco in the 1950s, a turning point in American culture: the rise of rock and roll and the teenage lifestyle. Jim Briskin is a disc jockey on radio KOIF. He\'s still in love with his ex-wife, Pat - even though she\'s about to marry someone else at the station - and she\'s vacillating between them. But when he takes her to visit the desperate household of two of his teenage fans, she seduces the boy into abandoning his pregnant wife - who then claims Jim as her protector and support.\r\n\r\nAnd all around them the cultural upheaval of postwar American society is manifest, by teenage outcasts who have a remote-controlled Nazi automobile they use to bump into the rich kids\' cars; by Thisbe Holt, the dancer who performs for conventioneers by stuffing herself inside a clear plastic bubble; by blaring used-car ads and the conflict between generations.\r\n\r\nDick gives us a vision of redemption tempered with layered ironies and a lot of real humour.', 'https://1999pkdweb.philipdick.com/broken.htm', 1, '2020-10-19 03:10:31'),
-- (2, 'Clans of the Alphane Moon', 'clans of the alphane moon', 'Clans-Of-The-Alphane-Moon', 'Philip K.', 'Dick', 1964-01-16', '1964-11-01', 'https://philipdick.com/images/covers/ClansOfTheAlphaneMoon.jpg', 1, 'On a planet run by escapees from a mental institution, the doctors who arrive to restore order may be the craziest of all.\r\n\r\nFor years, the third moon in the Alphane system was used as a psychiatric hospital. But when war broke out between Earth and the Alphanes, the hospital was left unguarded and the inmates set up their own society, made up of competing factions based around each mental illness. When Earth sends a delegation to take back the colony, they find enclaves of depressives, schizophrenics, paranoiacs, and other mentally ill people coming together to repel what they see as a foreign invasion. Meanwhile, back on Earth, CIA agent Chuck Rittersdorf and his wife Mary are going through a bitter divorce, with Chuck losing everything. But when Chuck is assigned to clandestinely control an android accompanying Mary to the Alphane moon, he sees an opportunity to get his revenge.', 'https://1999pkdweb.philipdick.com/CLANS%20OF%20THE%20ALPHANE%20MOON.htm', 1, '2020-10-19 03:10:31');

-- SELECT * FROM `titles` WHERE titleName LIKE '%minority%';

-- DELETE FROM titles WHERE titleID > 264;

-- ALTER TABLE titles AUTO_INCREMENT = 1;


-- INSERT INTO `titles` (`titleName`, `titleSort`, `titleURL`, `authorFirstName`, `authorLastName`, `categoryID`, `active`) VALUES
-- ('Beyond Lies the Wub', 'beyond lies the wub', 'Beyond-Lies-The-Wub', 'Philip K.', 'Dick', 12, 0);

-- INSERT INTO `titles` (`titleName`, `titleSort`, `titleURL`, `authorFirstName`, `authorLastName`, `categoryID`, `active`) VALUES
-- ('The Gun', 'gun, the', 'The-Gun', 'Philip K.', 'Dick', 12, 0);

-- INSERT INTO `titles` (`titleName`, `titleSort`, `titleURL`, `authorFirstName`, `authorLastName`, `categoryID`, `active`) VALUES
-- ('The Little Movement', 'little movement, the', 'The-Little-Movement', 'Philip K.', 'Dick', 12, 0);

-- -- INSERT INTO `titles` (`titleName`, `titleSort`, `titleURL`, `authorFirstName`, `authorLastName`, `categoryID`, `active`) VALUES
-- -- ('The Skull', 'skull, the', 'The-Skull', 'Philip K.', 'Dick', 12, 0);

-- INSERT INTO `titles` (`titleName`, `titleSort`, `titleURL`, `authorFirstName`, `authorLastName`, `categoryID`, `active`) VALUES
-- ('The Variable Man', 'variable man, the', 'The-Variable-Man', 'Philip K.', 'Dick', 12, 0);

-- INSERT INTO `titles` (`titleName`, `titleSort`, `titleURL`, `authorFirstName`, `authorLastName`, `categoryID`, `active`) VALUES
-- ('The Builder', 'builder, the', 'The-Builder', 'Philip K.', 'Dick', 12, 0);

-- INSERT INTO `titles` (`titleName`, `titleSort`, `titleURL`, `authorFirstName`, `authorLastName`, `categoryID`, `active`) VALUES
-- ('Colony', 'colony', 'Colony', 'Philip K.', 'Dick', 12, 0);

-- INSERT INTO `titles` (`titleName`, `titleSort`, `titleURL`, `authorFirstName`, `authorLastName`, `categoryID`, `active`) VALUES
-- ('The Commuter', 'commuter, the', 'The-Commuter', 'Philip K.', 'Dick', 12, 0);

-- INSERT INTO `titles` (`titleName`, `titleSort`, `titleURL`, `authorFirstName`, `authorLastName`, `categoryID`, `active`) VALUES
-- ('The Cookie Lady', 'cookie lady, the', 'The-Cookie-Lady', 'Philip K.', 'Dick', 12, 0);

-- INSERT INTO `titles` (`titleName`, `titleSort`, `titleURL`, `authorFirstName`, `authorLastName`, `categoryID`, `active`) VALUES
-- ('The Cosmic Poachers', 'cosmic poachers, the', 'The-Cosmic-Poachers', 'Philip K.', 'Dick', 12, 0);

-- INSERT INTO `titles` (`titleName`, `titleSort`, `titleURL`, `authorFirstName`, `authorLastName`, `categoryID`, `active`) VALUES
-- ('The Defenders', 'defenders, the', 'The-Defenders', 'Philip K.', 'Dick', 12, 0);

-- INSERT INTO `titles` (`titleName`, `titleSort`, `titleURL`, `authorFirstName`, `authorLastName`, `categoryID`, `active`) VALUES
-- ('Expendable', 'expendable', 'Expendable', 'Philip K.', 'Dick', 12, 0);

-- INSERT INTO `titles` (`titleName`, `titleSort`, `titleURL`, `authorFirstName`, `authorLastName`, `categoryID`, `active`) VALUES
-- ('The Eyes Have It', 'eyes have it, the', 'The-Eyes-Have-It', 'Philip K.', 'Dick', 12, 0);

-- INSERT INTO `titles` (`titleName`, `titleSort`, `titleURL`, `authorFirstName`, `authorLastName`, `categoryID`, `active`) VALUES
-- ('The Great C', 'great c, the', 'The-Great-C', 'Philip K.', 'Dick', 12, 0);

-- INSERT INTO `titles` (`titleName`, `titleSort`, `titleURL`, `authorFirstName`, `authorLastName`, `categoryID`, `active`) VALUES
-- ('The Hanging Stranger', 'hanging stranger, the', 'The-Hanging-Stranger', 'Philip K.', 'Dick', 12, 0);

-- INSERT INTO `titles` (`titleName`, `titleSort`, `titleURL`, `authorFirstName`, `authorLastName`, `categoryID`, `active`) VALUES
-- ('The Impossible Planet', 'impossible planet, the', 'The-Impossible-Planet', 'Philip K.', 'Dick', 12, 0);

-- INSERT INTO `titles` (`titleName`, `titleSort`, `titleURL`, `authorFirstName`, `authorLastName`, `categoryID`, `active`) VALUES
-- ('Impostor', 'impostor', 'Impostor', 'Philip K.', 'Dick', 12, 0);

-- INSERT INTO `titles` (`titleName`, `titleSort`, `titleURL`, `authorFirstName`, `authorLastName`, `categoryID`, `active`) VALUES
-- ('The Indefatigable Frog', 'indefatigable frog, the', 'The-Indefatigable-Frog', 'Philip K.', 'Dick', 12, 0);

-- INSERT INTO `titles` (`titleName`, `titleSort`, `titleURL`, `authorFirstName`, `authorLastName`, `categoryID`, `active`) VALUES
-- ('The Infinites', 'infinites, the', 'The-Infinites', 'Philip K.', 'Dick', 12, 0);

-- INSERT INTO `titles` (`titleName`, `titleSort`, `titleURL`, `authorFirstName`, `authorLastName`, `categoryID`, `active`) VALUES
-- ('The King of the Elves', 'king of the elves, the', 'The-King-Of-The-Elves', 'Philip K.', 'Dick', 12, 0);

-- INSERT INTO `titles` (`titleName`, `titleSort`, `titleURL`, `authorFirstName`, `authorLastName`, `categoryID`, `active`) VALUES
-- ('Martians Come in Clouds', 'martians come in clouds', 'Martians-Come-In-Clouds', 'Philip K.', 'Dick', 12, 0);

-- INSERT INTO `titles` (`titleName`, `titleSort`, `titleURL`, `authorFirstName`, `authorLastName`, `categoryID`, `active`) VALUES
-- ('Mr. Spaceship', 'mr. spaceship', 'Mr-Spaceship', 'Philip K.', 'Dick', 12, 0);

-- INSERT INTO `titles` (`titleName`, `titleSort`, `titleURL`, `authorFirstName`, `authorLastName`, `categoryID`, `active`) VALUES
-- ('Out in the Garden', 'out in the garden', 'Out-In-The-Garden', 'Philip K.', 'Dick', 12, 0);

-- INSERT INTO `titles` (`titleName`, `titleSort`, `titleURL`, `authorFirstName`, `authorLastName`, `categoryID`, `active`) VALUES
-- ('Paycheck', 'paycheck', 'Paycheck', 'Philip K.', 'Dick', 12, 0);

-- INSERT INTO `titles` (`titleName`, `titleSort`, `titleURL`, `authorFirstName`, `authorLastName`, `categoryID`, `active`) VALUES
-- ('Piper in the Woods', 'piper in the woods', 'Piper-In-The-Woods', 'Philip K.', 'Dick', 12, 0);

-- INSERT INTO `titles` (`titleName`, `titleSort`, `titleURL`, `authorFirstName`, `authorLastName`, `categoryID`, `active`) VALUES
-- ('Planet for Transients', 'planet for transients', 'Planet-For-Transients', 'Philip K.', 'Dick', 12, 0);

-- INSERT INTO `titles` (`titleName`, `titleSort`, `titleURL`, `authorFirstName`, `authorLastName`, `categoryID`, `active`) VALUES
-- ('The Preserving Machine', 'preserving machine, the', 'The-Preserving-Machine', 'Philip K.', 'Dick', 12, 0);

-- INSERT INTO `titles` (`titleName`, `titleSort`, `titleURL`, `authorFirstName`, `authorLastName`, `categoryID`, `active`) VALUES
-- ('Project: Earth', 'project: earth', 'Project:-Earth', 'Philip K.', 'Dick', 12, 0);

-- INSERT INTO `titles` (`titleName`, `titleSort`, `titleURL`, `authorFirstName`, `authorLastName`, `categoryID`, `active`) VALUES
-- ('Roog', 'roog', 'Roog', 'Philip K.', 'Dick', 12, 0);

-- -- INSERT INTO `titles` (`titleName`, `titleSort`, `titleURL`, `authorFirstName`, `authorLastName`, `categoryID`, `active`) VALUES
-- -- ('Second Variety', 'second variety', 'Second-Variety', 'Philip K.', 'Dick', 12, 0);

-- INSERT INTO `titles` (`titleName`, `titleSort`, `titleURL`, `authorFirstName`, `authorLastName`, `categoryID`, `active`) VALUES
-- ('Some Kinds of Life', 'some kinds of life', 'Some-Kinds-Of-Life', 'Philip K.', 'Dick', 12, 0);

-- INSERT INTO `titles` (`titleName`, `titleSort`, `titleURL`, `authorFirstName`, `authorLastName`, `categoryID`, `active`) VALUES
-- ('Tony and the Beetles', 'tony and the beetles', 'Tony-And-The-Beetles', 'Philip K.', 'Dick', 12, 0);

-- INSERT INTO `titles` (`titleName`, `titleSort`, `titleURL`, `authorFirstName`, `authorLastName`, `categoryID`, `active`) VALUES
-- ('The Trouble with Bubbles', 'trouble with bubbles, the', 'The-Trouble-With-Bubbles', 'Philip K.', 'Dick', 12, 0);

-- INSERT INTO `titles` (`titleName`, `titleSort`, `titleURL`, `authorFirstName`, `authorLastName`, `categoryID`, `active`) VALUES
-- ('The World She Wanted', 'world she wanted, the', 'The-World-She-Wanted', 'Philip K.', 'Dick', 12, 0);

-- -- INSERT INTO `titles` (`titleName`, `titleSort`, `titleURL`, `authorFirstName`, `authorLastName`, `categoryID`, `active`) VALUES
-- -- ('Adjustment Team', 'adjustment team', 'Adjustment-Team', 'Philip K.', 'Dick', 12, 0);

-- INSERT INTO `titles` (`titleName`, `titleSort`, `titleURL`, `authorFirstName`, `authorLastName`, `categoryID`, `active`) VALUES
-- ('Beyond the Door', 'beyond the door', 'Beyond-The-Door', 'Philip K.', 'Dick', 12, 0);

-- INSERT INTO `titles` (`titleName`, `titleSort`, `titleURL`, `authorFirstName`, `authorLastName`, `categoryID`, `active`) VALUES
-- ('Breakfast at Twilight', 'breakfast at twilight', 'Breakfast-At-Twilight', 'Philip K.', 'Dick', 12, 0);

-- INSERT INTO `titles` (`titleName`, `titleSort`, `titleURL`, `authorFirstName`, `authorLastName`, `categoryID`, `active`) VALUES
-- ('The Crawlers', 'crawlers, the', 'The-Crawlers', 'Philip K.', 'Dick', 12, 0);

-- INSERT INTO `titles` (`titleName`, `titleSort`, `titleURL`, `authorFirstName`, `authorLastName`, `categoryID`, `active`) VALUES
-- ('The Crystal Crypt', 'crystal crypt, the', 'The-Crystal-Crypt', 'Philip K.', 'Dick', 12, 0);

-- INSERT INTO `titles` (`titleName`, `titleSort`, `titleURL`, `authorFirstName`, `authorLastName`, `categoryID`, `active`) VALUES
-- ('Exhibit Piece', 'exhibit piece', 'Exhibit-Piece', 'Philip K.', 'Dick', 12, 0);

-- INSERT INTO `titles` (`titleName`, `titleSort`, `titleURL`, `authorFirstName`, `authorLastName`, `categoryID`, `active`) VALUES
-- ('The Father-thing', 'father-thing, the', 'The-Father-Thing', 'Philip K.', 'Dick', 12, 0);

-- INSERT INTO `titles` (`titleName`, `titleSort`, `titleURL`, `authorFirstName`, `authorLastName`, `categoryID`, `active`) VALUES
-- ('The Golden Man', 'golden man, the', 'The-Golden-Man', 'Philip K.', 'Dick', 12, 0);

-- INSERT INTO `titles` (`titleName`, `titleSort`, `titleURL`, `authorFirstName`, `authorLastName`, `categoryID`, `active`) VALUES
-- ('James P. Crow', 'james p. crow', 'James-P-Crow', 'Philip K.', 'Dick', 12, 0);

-- INSERT INTO `titles` (`titleName`, `titleSort`, `titleURL`, `authorFirstName`, `authorLastName`, `categoryID`, `active`) VALUES
-- ('Jon''s World', 'jon''s world', 'Jon''s-World', 'Philip K.', 'Dick', 12, 0);

-- INSERT INTO `titles` (`titleName`, `titleSort`, `titleURL`, `authorFirstName`, `authorLastName`, `categoryID`, `active`) VALUES
-- ('The Last of the Masters', 'last of the masters, the', 'The-Last-Of-The-Masters', 'Philip K.', 'Dick', 12, 0);

-- INSERT INTO `titles` (`titleName`, `titleSort`, `titleURL`, `authorFirstName`, `authorLastName`, `categoryID`, `active`) VALUES
-- ('Meddler', 'meddler', 'Meddler', 'Philip K.', 'Dick', 12, 0);

-- INSERT INTO `titles` (`titleName`, `titleSort`, `titleURL`, `authorFirstName`, `authorLastName`, `categoryID`, `active`) VALUES
-- ('Of Withered Apples', 'of withered apples', 'Of-Withered-Apples', 'Philip K.', 'Dick', 12, 0);

-- INSERT INTO `titles` (`titleName`, `titleSort`, `titleURL`, `authorFirstName`, `authorLastName`, `categoryID`, `active`) VALUES
-- ('A Present for Pat', 'present for pat, a', 'A-Present-For-Pat', 'Philip K.', 'Dick', 12, 0);

-- INSERT INTO `titles` (`titleName`, `titleSort`, `titleURL`, `authorFirstName`, `authorLastName`, `categoryID`, `active`) VALUES
-- ('Prize Ship', 'prize ship', 'Prize-Ship', 'Philip K.', 'Dick', 12, 0);

-- INSERT INTO `titles` (`titleName`, `titleSort`, `titleURL`, `authorFirstName`, `authorLastName`, `categoryID`, `active`) VALUES
-- ('Progeny', 'progeny', 'Progeny', 'Philip K.', 'Dick', 12, 0);

-- INSERT INTO `titles` (`titleName`, `titleSort`, `titleURL`, `authorFirstName`, `authorLastName`, `categoryID`, `active`) VALUES
-- ('Prominent Author', 'prominent author', 'Prominent-Author', 'Philip K.', 'Dick', 12, 0);

-- INSERT INTO `titles` (`titleName`, `titleSort`, `titleURL`, `authorFirstName`, `authorLastName`, `categoryID`, `active`) VALUES
-- ('Sales Pitch', 'sales pitch', 'Sales-Pitch', 'Philip K.', 'Dick', 12, 0);

-- INSERT INTO `titles` (`titleName`, `titleSort`, `titleURL`, `authorFirstName`, `authorLastName`, `categoryID`, `active`) VALUES
-- ('Shell Game', 'shell game', 'Shell-Game', 'Philip K.', 'Dick', 12, 0);

-- INSERT INTO `titles` (`titleName`, `titleSort`, `titleURL`, `authorFirstName`, `authorLastName`, `categoryID`, `active`) VALUES
-- ('The Short Happy Life of the Brown Oxford', 'short happy life of the brown oxford, the', 'The-Short-Happy-Life-Of-The-Brown-Oxford', 'Philip K.', 'Dick', 12, 0);

-- INSERT INTO `titles` (`titleName`, `titleSort`, `titleURL`, `authorFirstName`, `authorLastName`, `categoryID`, `active`) VALUES
-- ('Small Town', 'small town', 'Small-Town', 'Philip K.', 'Dick', 12, 0);

-- INSERT INTO `titles` (`titleName`, `titleSort`, `titleURL`, `authorFirstName`, `authorLastName`, `categoryID`, `active`) VALUES
-- ('Souvenir', 'souvenir', 'Souvenir', 'Philip K.', 'Dick', 12, 0);

-- INSERT INTO `titles` (`titleName`, `titleSort`, `titleURL`, `authorFirstName`, `authorLastName`, `categoryID`, `active`) VALUES
-- ('Strange Eden', 'strange eden', 'Strange-Eden', 'Philip K.', 'Dick', 12, 0);

-- INSERT INTO `titles` (`titleName`, `titleSort`, `titleURL`, `authorFirstName`, `authorLastName`, `categoryID`, `active`) VALUES
-- ('Survey Team', 'survey team', 'Survey-Team', 'Philip K.', 'Dick', 12, 0);

-- INSERT INTO `titles` (`titleName`, `titleSort`, `titleURL`, `authorFirstName`, `authorLastName`, `categoryID`, `active`) VALUES
-- ('Time Pawn', 'time pawn', 'Time-Pawn', 'Philip K.', 'Dick', 12, 0);

-- INSERT INTO `titles` (`titleName`, `titleSort`, `titleURL`, `authorFirstName`, `authorLastName`, `categoryID`, `active`) VALUES
-- ('The Turning Wheel', 'turning wheel, the', 'The-Turning-Wheel', 'Philip K.', 'Dick', 12, 0);

-- -- INSERT INTO `titles` (`titleName`, `titleSort`, `titleURL`, `authorFirstName`, `authorLastName`, `categoryID`, `active`) VALUES
-- -- ('Upon the Dull Earth', 'upon the dull earth', 'Upon-The-Dull-Earth', 'Philip K.', 'Dick', 12, 0);

-- INSERT INTO `titles` (`titleName`, `titleSort`, `titleURL`, `authorFirstName`, `authorLastName`, `categoryID`, `active`) VALUES
-- ('A World of Talent', 'world of talent, a', 'A-World-Of-Talent', 'Philip K.', 'Dick', 12, 0);

-- INSERT INTO `titles` (`titleName`, `titleSort`, `titleURL`, `authorFirstName`, `authorLastName`, `categoryID`, `active`) VALUES
-- ('Autofac', 'autofac', 'Autofac', 'Philip K.', 'Dick', 12, 0);

-- INSERT INTO `titles` (`titleName`, `titleSort`, `titleURL`, `authorFirstName`, `authorLastName`, `categoryID`, `active`) VALUES
-- ('Captive Market', 'captive market', 'Captive-Market', 'Philip K.', 'Dick', 12, 0);

-- INSERT INTO `titles` (`titleName`, `titleSort`, `titleURL`, `authorFirstName`, `authorLastName`, `categoryID`, `active`) VALUES
-- ('The Chromium Fence', 'chromium fence, the', 'The-Chromium-Fence', 'Philip K.', 'Dick', 12, 0);

-- INSERT INTO `titles` (`titleName`, `titleSort`, `titleURL`, `authorFirstName`, `authorLastName`, `categoryID`, `active`) VALUES
-- ('Foster, You''re Dead!', 'foster, you''re dead!', 'Foster-You-re-Dead!', 'Philip K.', 'Dick', 12, 0);

-- INSERT INTO `titles` (`titleName`, `titleSort`, `titleURL`, `authorFirstName`, `authorLastName`, `categoryID`, `active`) VALUES
-- ('The Hood Maker', 'hood maker, the', 'The-Hood-Maker', 'Philip K.', 'Dick', 12, 0);

-- INSERT INTO `titles` (`titleName`, `titleSort`, `titleURL`, `authorFirstName`, `authorLastName`, `categoryID`, `active`) VALUES
-- ('Human Is', 'human is', 'Human-Is', 'Philip K.', 'Dick', 12, 0);

-- INSERT INTO `titles` (`titleName`, `titleSort`, `titleURL`, `authorFirstName`, `authorLastName`, `categoryID`, `active`) VALUES
-- ('The Mold of Yancy', 'mold of yancy, the', 'The-Mold-Of-Yancy', 'Philip K.', 'Dick', 12, 0);

-- INSERT INTO `titles` (`titleName`, `titleSort`, `titleURL`, `authorFirstName`, `authorLastName`, `categoryID`, `active`) VALUES
-- ('Nanny', 'nanny', 'Nanny', 'Philip K.', 'Dick', 12, 0);

-- INSERT INTO `titles` (`titleName`, `titleSort`, `titleURL`, `authorFirstName`, `authorLastName`, `categoryID`, `active`) VALUES
-- ('Psi-man Heal My Child!', 'psi-man heal my child!', 'Psi-Man-Heal-My-Child!', 'Philip K.', 'Dick', 12, 0);

-- INSERT INTO `titles` (`titleName`, `titleSort`, `titleURL`, `authorFirstName`, `authorLastName`, `categoryID`, `active`) VALUES
-- ('Service Call', 'service call', 'Service-Call', 'Philip K.', 'Dick', 12, 0);

-- INSERT INTO `titles` (`titleName`, `titleSort`, `titleURL`, `authorFirstName`, `authorLastName`, `categoryID`, `active`) VALUES
-- ('A Surface Raid', 'surface raid, a', 'A-Surface-Raid', 'Philip K.', 'Dick', 12, 0);

-- INSERT INTO `titles` (`titleName`, `titleSort`, `titleURL`, `authorFirstName`, `authorLastName`, `categoryID`, `active`) VALUES
-- ('Vulcan''s Hammer', 'vulcan''s hammer', 'Vulcan-s-Hammer', 'Philip K.', 'Dick', 12, 0);

-- INSERT INTO `titles` (`titleName`, `titleSort`, `titleURL`, `authorFirstName`, `authorLastName`, `categoryID`, `active`) VALUES
-- ('War Veteran', 'war veteran', 'War-Veteran', 'Philip K.', 'Dick', 12, 0);

-- INSERT INTO `titles` (`titleName`, `titleSort`, `titleURL`, `authorFirstName`, `authorLastName`, `categoryID`, `active`) VALUES
-- ('A Glass of Darkness', 'glass of darkness, a', 'A-Glass-Of-Darkness', 'Philip K.', 'Dick', 12, 0);

-- -- INSERT INTO `titles` (`titleName`, `titleSort`, `titleURL`, `authorFirstName`, `authorLastName`, `categoryID`, `active`) VALUES
-- -- ('The Minority Report', 'minority report, the', 'The-Minority-Report', 'Philip K.', 'Dick', 12, 0);

-- INSERT INTO `titles` (`titleName`, `titleSort`, `titleURL`, `authorFirstName`, `authorLastName`, `categoryID`, `active`) VALUES
-- ('Pay for the Printer', 'pay for the printer', 'Pay-For-The-Printer', 'Philip K.', 'Dick', 12, 0);

-- INSERT INTO `titles` (`titleName`, `titleSort`, `titleURL`, `authorFirstName`, `authorLastName`, `categoryID`, `active`) VALUES
-- ('To Serve the Master', 'to serve the master', 'To-Serve-The-Master', 'Philip K.', 'Dick', 12, 0);

-- INSERT INTO `titles` (`titleName`, `titleSort`, `titleURL`, `authorFirstName`, `authorLastName`, `categoryID`, `active`) VALUES
-- ('Misadjustment', 'misadjustment', 'Misadjustment', 'Philip K.', 'Dick', 12, 0);

-- INSERT INTO `titles` (`titleName`, `titleSort`, `titleURL`, `authorFirstName`, `authorLastName`, `categoryID`, `active`) VALUES
-- ('The Unreconstructed M', 'unreconstructed m, the', 'The-Unreconstructed-M', 'Philip K.', 'Dick', 12, 0);

-- INSERT INTO `titles` (`titleName`, `titleSort`, `titleURL`, `authorFirstName`, `authorLastName`, `categoryID`, `active`) VALUES
-- ('Null-O', 'null-o', 'Null-O', 'Philip K.', 'Dick', 12, 0);

-- INSERT INTO `titles` (`titleName`, `titleSort`, `titleURL`, `authorFirstName`, `authorLastName`, `categoryID`, `active`) VALUES
-- ('Explorers We', 'explorers we', 'Explorers-We', 'Philip K.', 'Dick', 12, 0);

-- INSERT INTO `titles` (`titleName`, `titleSort`, `titleURL`, `authorFirstName`, `authorLastName`, `categoryID`, `active`) VALUES
-- ('Fair Game', 'fair game', 'Fair-Game', 'Philip K.', 'Dick', 12, 0);

-- INSERT INTO `titles` (`titleName`, `titleSort`, `titleURL`, `authorFirstName`, `authorLastName`, `categoryID`, `active`) VALUES
-- ('Recall Mechanism', 'recall mechanism', 'Recall-Mechanism', 'Philip K.', 'Dick', 12, 0);

-- INSERT INTO `titles` (`titleName`, `titleSort`, `titleURL`, `authorFirstName`, `authorLastName`, `categoryID`, `active`) VALUES
-- ('War Game', 'war game', 'War-Game', 'Philip K.', 'Dick', 12, 0);

-- INSERT INTO `titles` (`titleName`, `titleSort`, `titleURL`, `authorFirstName`, `authorLastName`, `categoryID`, `active`) VALUES
-- ('All We Marsmen', 'all we marsmen', 'All-We-Marsmen', 'Philip K.', 'Dick', 12, 0);

-- INSERT INTO `titles` (`titleName`, `titleSort`, `titleURL`, `authorFirstName`, `authorLastName`, `categoryID`, `active`) VALUES
-- ('The Days of Perky Pat', 'days of perky pat, the', 'The-Days-Of-Perky-Pat', 'Philip K.', 'Dick', 12, 0);

-- INSERT INTO `titles` (`titleName`, `titleSort`, `titleURL`, `authorFirstName`, `authorLastName`, `categoryID`, `active`) VALUES
-- ('If There Were No Benny Cemoli', 'if there were no benny cemoli', 'If-There-Were-No-Benny-Cemoli', 'Philip K.', 'Dick', 12, 0);

-- INSERT INTO `titles` (`titleName`, `titleSort`, `titleURL`, `authorFirstName`, `authorLastName`, `categoryID`, `active`) VALUES
-- ('Stand-by', 'stand-by', 'Stand-By', 'Philip K.', 'Dick', 12, 0);

-- INSERT INTO `titles` (`titleName`, `titleSort`, `titleURL`, `authorFirstName`, `authorLastName`, `categoryID`, `active`) VALUES
-- ('What''ll We Do With Ragland Park?', 'what''ll we do with ragland park?', 'What-ll-We-Do-With-Ragland-Park?', 'Philip K.', 'Dick', 12, 0);

-- INSERT INTO `titles` (`titleName`, `titleSort`, `titleURL`, `authorFirstName`, `authorLastName`, `categoryID`, `active`) VALUES
-- ('Cantata 140', 'cantata 140', 'Cantata-140', 'Philip K.', 'Dick', 12, 0);

-- INSERT INTO `titles` (`titleName`, `titleSort`, `titleURL`, `authorFirstName`, `authorLastName`, `categoryID`, `active`) VALUES
-- ('A Game of Unchance', 'game of unchance, a', 'A-Game-Of-Unchance', 'Philip K.', 'Dick', 12, 0);

-- INSERT INTO `titles` (`titleName`, `titleSort`, `titleURL`, `authorFirstName`, `authorLastName`, `categoryID`, `active`) VALUES
-- ('The Little Black Box', 'little black box, the', 'The-Little-Black-Box', 'Philip K.', 'Dick', 12, 0);

-- INSERT INTO `titles` (`titleName`, `titleSort`, `titleURL`, `authorFirstName`, `authorLastName`, `categoryID`, `active`) VALUES
-- ('Novelty Act', 'novelty act', 'Novelty-Act', 'Philip K.', 'Dick', 12, 0);

-- INSERT INTO `titles` (`titleName`, `titleSort`, `titleURL`, `authorFirstName`, `authorLastName`, `categoryID`, `active`) VALUES
-- ('Oh, to be a Blobel!', 'oh, to be a blobel!', 'Oh-To-Be-A-Blobel!', 'Philip K.', 'Dick', 12, 0);

-- INSERT INTO `titles` (`titleName`, `titleSort`, `titleURL`, `authorFirstName`, `authorLastName`, `categoryID`, `active`) VALUES
-- ('Orpheus with Clay Feet', 'orpheus with clay feet', 'Orpheus-With-Clay-Feet', 'Philip K.', 'Dick', 12, 0);

-- INSERT INTO `titles` (`titleName`, `titleSort`, `titleURL`, `authorFirstName`, `authorLastName`, `categoryID`, `active`) VALUES
-- ('Precious Artifact', 'precious artifact', 'Precious-Artifact', 'Philip K.', 'Dick', 12, 0);

-- INSERT INTO `titles` (`titleName`, `titleSort`, `titleURL`, `authorFirstName`, `authorLastName`, `categoryID`, `active`) VALUES
-- ('The Unteleported Man', 'unteleported man, the', 'The-Unteleported-Man', 'Philip K.', 'Dick', 12, 0);

-- INSERT INTO `titles` (`titleName`, `titleSort`, `titleURL`, `authorFirstName`, `authorLastName`, `categoryID`, `active`) VALUES
-- ('The War with the Fnools', 'war with the fnools, the', 'The-War-With-The-Fnools', 'Philip K.', 'Dick', 12, 0);

-- INSERT INTO `titles` (`titleName`, `titleSort`, `titleURL`, `authorFirstName`, `authorLastName`, `categoryID`, `active`) VALUES
-- ('Waterspider', 'waterspider', 'Waterspider', 'Philip K.', 'Dick', 12, 0);

-- INSERT INTO `titles` (`titleName`, `titleSort`, `titleURL`, `authorFirstName`, `authorLastName`, `categoryID`, `active`) VALUES
-- ('What the Dead Men Say', 'what the dead men say', 'What-The-Dead-Men-Say', 'Philip K.', 'Dick', 12, 0);

-- INSERT INTO `titles` (`titleName`, `titleSort`, `titleURL`, `authorFirstName`, `authorLastName`, `categoryID`, `active`) VALUES
-- ('Project Plowshare', 'project plowshare', 'Project-Plowshare', 'Philip K.', 'Dick', 12, 0);

-- INSERT INTO `titles` (`titleName`, `titleSort`, `titleURL`, `authorFirstName`, `authorLastName`, `categoryID`, `active`) VALUES
-- ('Retreat Syndrome', 'retreat syndrome', 'Retreat-Syndrome', 'Philip K.', 'Dick', 12, 0);

-- INSERT INTO `titles` (`titleName`, `titleSort`, `titleURL`, `authorFirstName`, `authorLastName`, `categoryID`, `active`) VALUES
-- ('Holy Quarrel', 'holy quarrel', 'Holy-Quarrel', 'Philip K.', 'Dick', 12, 0);

-- INSERT INTO `titles` (`titleName`, `titleSort`, `titleURL`, `authorFirstName`, `authorLastName`, `categoryID`, `active`) VALUES
-- ('We Can Remember It for You Wholesale', 'we can remember it for you wholesale', 'We-Can-Remember-It-For-You-Wholesale', 'Philip K.', 'Dick', 12, 0);

-- INSERT INTO `titles` (`titleName`, `titleSort`, `titleURL`, `authorFirstName`, `authorLastName`, `categoryID`, `active`) VALUES
-- ('Your Appointment Will Be Yesterday', 'your appointment will be yesterday', 'Your-Appointment-Will-Be-Yesterday', 'Philip K.', 'Dick', 12, 0);

-- INSERT INTO `titles` (`titleName`, `titleSort`, `titleURL`, `authorFirstName`, `authorLastName`, `categoryID`, `active`) VALUES
-- ('Faith of Our Fathers', 'faith of our fathers', 'Faith-Of-Our-Fathers', 'Philip K.', 'Dick', 12, 0);

-- INSERT INTO `titles` (`titleName`, `titleSort`, `titleURL`, `authorFirstName`, `authorLastName`, `categoryID`, `active`) VALUES
-- ('Return Match', 'return match', 'Return-Match', 'Philip K.', 'Dick', 12, 0);

-- INSERT INTO `titles` (`titleName`, `titleSort`, `titleURL`, `authorFirstName`, `authorLastName`, `categoryID`, `active`) VALUES
-- ('Not By Its Cover', 'not by its cover', 'Not-By-Its-Cover', 'Philip K.', 'Dick', 12, 0);

-- INSERT INTO `titles` (`titleName`, `titleSort`, `titleURL`, `authorFirstName`, `authorLastName`, `categoryID`, `active`) VALUES
-- ('The Story To End All Stories', 'story to end all stories, the', 'The-Story-To-End-All-Stories', 'Philip K.', 'Dick', 12, 0);

-- INSERT INTO `titles` (`titleName`, `titleSort`, `titleURL`, `authorFirstName`, `authorLastName`, `categoryID`, `active`) VALUES
-- ('A. Lincoln, Simulacrum', 'a. lincoln, simulacrum', 'A-Lincoln-Simulacrum', 'Philip K.', 'Dick', 12, 0);

-- INSERT INTO `titles` (`titleName`, `titleSort`, `titleURL`, `authorFirstName`, `authorLastName`, `categoryID`, `active`) VALUES
-- ('The Electric Ant', 'electric ant, the', 'The-Electric-Ant', 'Philip K.', 'Dick', 12, 0);

-- INSERT INTO `titles` (`titleName`, `titleSort`, `titleURL`, `authorFirstName`, `authorLastName`, `categoryID`, `active`) VALUES
-- ('Cadbury, the Beaver Who Lacked', 'cadbury, the beaver who lacked', 'Cadbury-The-Beaver-Who-Lacked', 'Philip K.', 'Dick', 12, 0);

-- INSERT INTO `titles` (`titleName`, `titleSort`, `titleURL`, `authorFirstName`, `authorLastName`, `categoryID`, `active`) VALUES
-- ('The Different Stages of Love', 'different stages of love, the', 'The-Different-Stages-Of-Love', 'Philip K.', 'Dick', 12, 0);

-- INSERT INTO `titles` (`titleName`, `titleSort`, `titleURL`, `authorFirstName`, `authorLastName`, `categoryID`, `active`) VALUES
-- ('The Pre-persons', 'pre-persons, the', 'The-Pre-Persons', 'Philip K.', 'Dick', 12, 0);

-- INSERT INTO `titles` (`titleName`, `titleSort`, `titleURL`, `authorFirstName`, `authorLastName`, `categoryID`, `active`) VALUES
-- ('A Little Something For Us Tempunauts', 'little something for us tempunauts, a', 'A-Little-Something-For-Us-Tempunauts', 'Philip K.', 'Dick', 12, 0);

-- INSERT INTO `titles` (`titleName`, `titleSort`, `titleURL`, `authorFirstName`, `authorLastName`, `categoryID`, `active`) VALUES
-- ('The Exit Door Leads In', 'exit door leads in, the', 'The-Exit-Door-Leads-In', 'Philip K.', 'Dick', 12, 0);

-- INSERT INTO `titles` (`titleName`, `titleSort`, `titleURL`, `authorFirstName`, `authorLastName`, `categoryID`, `active`) VALUES
-- ('I Hope I Shall Arrive Soon', 'i hope i shall arrive soon', 'I-Hope-I-Shall-Arrive-Soon', 'Philip K.', 'Dick', 12, 0);

-- INSERT INTO `titles` (`titleName`, `titleSort`, `titleURL`, `authorFirstName`, `authorLastName`, `categoryID`, `active`) VALUES
-- ('Rautavaara''s Case', 'rautavaara''s case', 'Rautavaara-s-Case', 'Philip K.', 'Dick', 12, 0);

-- INSERT INTO `titles` (`titleName`, `titleSort`, `titleURL`, `authorFirstName`, `authorLastName`, `categoryID`, `active`) VALUES
-- ('Chains of Air, Web of Aether', 'chains of air, web of aether', 'Chains-Of-Air-Web-Of-Aether', 'Philip K.', 'Dick', 12, 0);

-- INSERT INTO `titles` (`titleName`, `titleSort`, `titleURL`, `authorFirstName`, `authorLastName`, `categoryID`, `active`) VALUES
-- ('The Alien Mind', 'alien mind, the', 'The-Alien-Mind', 'Philip K.', 'Dick', 12, 0);

-- INSERT INTO `titles` (`titleName`, `titleSort`, `titleURL`, `authorFirstName`, `authorLastName`, `categoryID`, `active`) VALUES
-- ('Strange Memories Of Death', 'strange memories of death', 'Strange-Memories-Of-Death', 'Philip K.', 'Dick', 12, 0);

-- INSERT INTO `titles` (`titleName`, `titleSort`, `titleURL`, `authorFirstName`, `authorLastName`, `categoryID`, `active`) VALUES
-- ('The Day Mr. Computer Fell Out of Its Tree', 'day mr. computer fell out of its tree, the', 'The-Day-Mr-Computer-Fell-Out-Of-Its-Tree', 'Philip K.', 'Dick', 12, 0);

-- INSERT INTO `titles` (`titleName`, `titleSort`, `titleURL`, `authorFirstName`, `authorLastName`, `categoryID`, `active`) VALUES
-- ('The Eye of The Sibyl', 'eye of the sibyl, the', 'The-Eye-Of-The-Sibyl', 'Philip K.', 'Dick', 12, 0);

-- INSERT INTO `titles` (`titleName`, `titleSort`, `titleURL`, `authorFirstName`, `authorLastName`, `categoryID`, `active`) VALUES
-- ('Fawn, Look Back', 'fawn, look back', 'Fawn-Look-Back', 'Philip K.', 'Dick', 12, 0);

-- INSERT INTO `titles` (`titleName`, `titleSort`, `titleURL`, `authorFirstName`, `authorLastName`, `categoryID`, `active`) VALUES
-- ('Stability', 'stability', 'Stability', 'Philip K.', 'Dick', 12, 0);

-- INSERT INTO `titles` (`titleName`, `titleSort`, `titleURL`, `authorFirstName`, `authorLastName`, `categoryID`, `active`) VALUES
-- ('Goodbye, Vincent', 'goodbye, vincent', 'Goodbye-Vincent', 'Philip K.', 'Dick', 12, 0);

-- INSERT INTO `titles` (`titleName`, `titleSort`, `titleURL`, `authorFirstName`, `authorLastName`, `categoryID`, `active`) VALUES
-- ('Menace React', 'menace react', 'Menace-React', 'Philip K.', 'Dick', 12, 0);


SELECT * FROM `titles` WHERE titleName LIKE '%minority%';

DELETE FROM titles WHERE titleID > 264;

ALTER TABLE titles AUTO_INCREMENT = 1;


INSERT INTO `titles` (`titleID`, `titleName`, `titleSort`, `titleURL`, `authorFirstName`, `authorLastName`, `submissionDate`, `publicationDate`, `imageName`, `categoryID`, `shortDescription`, `urlPKDWeb`, `active`) VALUES
(352, 'A Game of Unchance', 'game of unchance, a', 'A-Game-Of-Unchance', 'Philip K.', 'Dick', STR_TO_DATE('11/9/1963','%m/%d/%Y'), STR_TO_DATE('7/1/1964','%m/%d/%Y'), NULL, 12, NULL, 'https://1999pkdweb.philipdick.com/A%20Game%20Of%20Unchance.htm', 0);

INSERT INTO `titles` (`titleID`, `titleName`, `titleSort`, `titleURL`, `authorFirstName`, `authorLastName`, `submissionDate`, `publicationDate`, `imageName`, `categoryID`, `shortDescription`, `urlPKDWeb`, `active`) VALUES
(336, 'A Glass of Darkness', 'glass of darkness, a', 'A-Glass-Of-Darkness', 'Philip K.', 'Dick', NULL, NULL, NULL, 12, NULL, 'https://1999pkdweb.philipdick.com/A%20Glass%20Of%20Darkness.htm', 0);

INSERT INTO `titles` (`titleID`, `titleName`, `titleSort`, `titleURL`, `authorFirstName`, `authorLastName`, `submissionDate`, `publicationDate`, `imageName`, `categoryID`, `shortDescription`, `urlPKDWeb`, `active`) VALUES
(376, 'A Little Something For Us Tempunauts', 'little something for us tempunauts, a', 'A-Little-Something-For-Us-Tempunauts', 'Philip K.', 'Dick', STR_TO_DATE('2/13/1973','%m/%d/%Y'), STR_TO_DATE('1/1/1974','%m/%d/%Y'), NULL, 12, NULL, 'https://1999pkdweb.philipdick.com/A%20Little%20Something%20For%20Us%20Tempunauts.htm', 0);

INSERT INTO `titles` (`titleID`, `titleName`, `titleSort`, `titleURL`, `authorFirstName`, `authorLastName`, `submissionDate`, `publicationDate`, `imageName`, `categoryID`, `shortDescription`, `urlPKDWeb`, `active`) VALUES
(309, 'A Present for Pat', 'present for pat, a', 'A-Present-For-Pat', 'Philip K.', 'Dick', STR_TO_DATE('1/17/1953','%m/%d/%Y'), STR_TO_DATE('1/1/1954','%m/%d/%Y'), NULL, 12, NULL, 'https://1999pkdweb.philipdick.com/A%20Present%20For%20Pat.htm', 0);

INSERT INTO `titles` (`titleID`, `titleName`, `titleSort`, `titleURL`, `authorFirstName`, `authorLastName`, `submissionDate`, `publicationDate`, `imageName`, `categoryID`, `shortDescription`, `urlPKDWeb`, `active`) VALUES
(333, 'A Surface Raid', 'surface raid, a', 'A-Surface-Raid', 'Philip K.', 'Dick', STR_TO_DATE('12/2/1952','%m/%d/%Y'), STR_TO_DATE('7/1/1955','%m/%d/%Y'), NULL, 12, NULL, 'https://1999pkdweb.philipdick.com/A%20Surface%20Raid.htm', 0);

INSERT INTO `titles` (`titleID`, `titleName`, `titleSort`, `titleURL`, `authorFirstName`, `authorLastName`, `submissionDate`, `publicationDate`, `imageName`, `categoryID`, `shortDescription`, `urlPKDWeb`, `active`) VALUES
(322, 'A World of Talent', 'world of talent, a', 'A-World-Of-Talent', 'Philip K.', 'Dick', STR_TO_DATE('6/4/1954','%m/%d/%Y'), STR_TO_DATE('10/1/1954','%m/%d/%Y'), NULL, 12, NULL, 'https://1999pkdweb.philipdick.com/A%20World%20Of%20Talent.htm', 0);

INSERT INTO `titles` (`titleID`, `titleName`, `titleSort`, `titleURL`, `authorFirstName`, `authorLastName`, `submissionDate`, `publicationDate`, `imageName`, `categoryID`, `shortDescription`, `urlPKDWeb`, `active`) VALUES
(371, 'A. Lincoln, Simulacrum', 'a. lincoln, simulacrum', 'A-Lincoln-Simulacrum', 'Philip K.', 'Dick', NULL, NULL, NULL, 12, NULL, 'https://1999pkdweb.philipdick.com/A.%20Lincoln,%20Simulacrum.htm', 0);

INSERT INTO `titles` (`titleID`, `titleName`, `titleSort`, `titleURL`, `authorFirstName`, `authorLastName`, `submissionDate`, `publicationDate`, `imageName`, `categoryID`, `shortDescription`, `urlPKDWeb`, `active`) VALUES
(346, 'All We Marsmen', 'all we marsmen', 'All-We-Marsmen', 'Philip K.', 'Dick', NULL, NULL, NULL, 12, NULL, 'https://1999pkdweb.philipdick.com/All%20We%20Marsmen.htm', 0);

INSERT INTO `titles` (`titleID`, `titleName`, `titleSort`, `titleURL`, `authorFirstName`, `authorLastName`, `submissionDate`, `publicationDate`, `imageName`, `categoryID`, `shortDescription`, `urlPKDWeb`, `active`) VALUES
(323, 'Autofac', 'autofac', 'Autofac', 'Philip K.', 'Dick', STR_TO_DATE('10/11/1954','%m/%d/%Y'), STR_TO_DATE('11/1/1955','%m/%d/%Y'), NULL, 12, NULL, 'https://1999pkdweb.philipdick.com/autofac.htm', 0);

INSERT INTO `titles` (`titleID`, `titleName`, `titleSort`, `titleURL`, `authorFirstName`, `authorLastName`, `submissionDate`, `publicationDate`, `imageName`, `categoryID`, `shortDescription`, `urlPKDWeb`, `active`) VALUES
(265, 'Beyond Lies the Wub', 'beyond lies the wub', 'Beyond-Lies-The-Wub', 'Philip K.', 'Dick', NULL, STR_TO_DATE('7/1/1952','%m/%d/%Y'), NULL, 12, NULL, 'https://1999pkdweb.philipdick.com/Beyond%20Lies%20The%20Wub.htm', 0);

INSERT INTO `titles` (`titleID`, `titleName`, `titleSort`, `titleURL`, `authorFirstName`, `authorLastName`, `submissionDate`, `publicationDate`, `imageName`, `categoryID`, `shortDescription`, `urlPKDWeb`, `active`) VALUES
(297, 'Beyond the Door', 'beyond the door', 'Beyond-The-Door', 'Philip K.', 'Dick', STR_TO_DATE('8/29/1952','%m/%d/%Y'), STR_TO_DATE('1/1/1954','%m/%d/%Y'), NULL, 12, NULL, 'https://1999pkdweb.philipdick.com/Beyond%20The%20Door.htm', 0);

INSERT INTO `titles` (`titleID`, `titleName`, `titleSort`, `titleURL`, `authorFirstName`, `authorLastName`, `submissionDate`, `publicationDate`, `imageName`, `categoryID`, `shortDescription`, `urlPKDWeb`, `active`) VALUES
(298, 'Breakfast at Twilight', 'breakfast at twilight', 'Breakfast-At-Twilight', 'Philip K.', 'Dick', STR_TO_DATE('1/17/1953','%m/%d/%Y'), STR_TO_DATE('7/1/1954','%m/%d/%Y'), NULL, 12, NULL, 'https://1999pkdweb.philipdick.com/Breakfast%20At%20Twilight.htm', 0);

INSERT INTO `titles` (`titleID`, `titleName`, `titleSort`, `titleURL`, `authorFirstName`, `authorLastName`, `submissionDate`, `publicationDate`, `imageName`, `categoryID`, `shortDescription`, `urlPKDWeb`, `active`) VALUES
(373, 'Cadbury, the Beaver Who Lacked', 'cadbury, the beaver who lacked', 'Cadbury-The-Beaver-Who-Lacked', 'Philip K.', 'Dick', STR_TO_DATE('12/1/1971','%m/%d/%Y'), NULL, NULL, 12, NULL, 'https://1999pkdweb.philipdick.com/Cadbury,%20The%20Beaver%20Who%20Lacked.htm', 0);

INSERT INTO `titles` (`titleID`, `titleName`, `titleSort`, `titleURL`, `authorFirstName`, `authorLastName`, `submissionDate`, `publicationDate`, `imageName`, `categoryID`, `shortDescription`, `urlPKDWeb`, `active`) VALUES
(351, 'Cantata 140', 'cantata 140', 'Cantata-140', 'Philip K.', 'Dick', NULL, NULL, NULL, 12, NULL, 'https://1999pkdweb.philipdick.com/Cantata%20140.htm', 0);

INSERT INTO `titles` (`titleID`, `titleName`, `titleSort`, `titleURL`, `authorFirstName`, `authorLastName`, `submissionDate`, `publicationDate`, `imageName`, `categoryID`, `shortDescription`, `urlPKDWeb`, `active`) VALUES
(324, 'Captive Market', 'captive market', 'Captive-Market', 'Philip K.', 'Dick', STR_TO_DATE('10/18/1954','%m/%d/%Y'), STR_TO_DATE('4/1/1955','%m/%d/%Y'), NULL, 12, NULL, 'https://1999pkdweb.philipdick.com/Captive%20Market.htm', 0);

INSERT INTO `titles` (`titleID`, `titleName`, `titleSort`, `titleURL`, `authorFirstName`, `authorLastName`, `submissionDate`, `publicationDate`, `imageName`, `categoryID`, `shortDescription`, `urlPKDWeb`, `active`) VALUES
(380, 'Chains of Air, Web of Aether', 'chains of air, web of aether', 'Chains-Of-Air-Web-Of-Aether', 'Philip K.', 'Dick', STR_TO_DATE('7/9/1979','%m/%d/%Y'), STR_TO_DATE('1/1/1980','%m/%d/%Y'), NULL, 12, NULL, 'https://1999pkdweb.philipdick.com/Chains%20Of%20Air,%20Web%20Of%20Aether.htm', 0);

INSERT INTO `titles` (`titleID`, `titleName`, `titleSort`, `titleURL`, `authorFirstName`, `authorLastName`, `submissionDate`, `publicationDate`, `imageName`, `categoryID`, `shortDescription`, `urlPKDWeb`, `active`) VALUES
(270, 'Colony', 'colony', 'Colony', 'Philip K.', 'Dick', STR_TO_DATE('8/11/1952','%m/%d/%Y'), STR_TO_DATE('6/1/1953','%m/%d/%Y'), NULL, 12, NULL, 'https://1999pkdweb.philipdick.com/colony.htm', 0);

INSERT INTO `titles` (`titleID`, `titleName`, `titleSort`, `titleURL`, `authorFirstName`, `authorLastName`, `submissionDate`, `publicationDate`, `imageName`, `categoryID`, `shortDescription`, `urlPKDWeb`, `active`) VALUES
(301, 'Exhibit Piece', 'exhibit piece', 'Exhibit-Piece', 'Philip K.', 'Dick', STR_TO_DATE('10/21/1953','%m/%d/%Y'), STR_TO_DATE('8/1/1954','%m/%d/%Y'), NULL, 12, NULL, 'https://1999pkdweb.philipdick.com/Exhibit%20Piece.htm', 0);

INSERT INTO `titles` (`titleID`, `titleName`, `titleSort`, `titleURL`, `authorFirstName`, `authorLastName`, `submissionDate`, `publicationDate`, `imageName`, `categoryID`, `shortDescription`, `urlPKDWeb`, `active`) VALUES
(275, 'Expendable', 'expendable', 'Expendable', 'Philip K.', 'Dick', NULL, STR_TO_DATE('7/1/1953','%m/%d/%Y'), NULL, 12, NULL, 'https://1999pkdweb.philipdick.com/Expendable.htm', 0);

INSERT INTO `titles` (`titleID`, `titleName`, `titleSort`, `titleURL`, `authorFirstName`, `authorLastName`, `submissionDate`, `publicationDate`, `imageName`, `categoryID`, `shortDescription`, `urlPKDWeb`, `active`) VALUES
(342, 'Explorers We', 'explorers we', 'Explorers-We', 'Philip K.', 'Dick', STR_TO_DATE('5/6/1958','%m/%d/%Y'), STR_TO_DATE('1/1/1959','%m/%d/%Y'), NULL, 12, NULL, 'https://1999pkdweb.philipdick.com/Explorers%20We.htm', 0);

INSERT INTO `titles` (`titleID`, `titleName`, `titleSort`, `titleURL`, `authorFirstName`, `authorLastName`, `submissionDate`, `publicationDate`, `imageName`, `categoryID`, `shortDescription`, `urlPKDWeb`, `active`) VALUES
(343, 'Fair Game', 'fair game', 'Fair-Game', 'Philip K.', 'Dick', STR_TO_DATE('4/21/1953','%m/%d/%Y'), STR_TO_DATE('9/1/1959','%m/%d/%Y'), NULL, 12, NULL, 'https://1999pkdweb.philipdick.com/Fair%20Game.htm', 0);

INSERT INTO `titles` (`titleID`, `titleName`, `titleSort`, `titleURL`, `authorFirstName`, `authorLastName`, `submissionDate`, `publicationDate`, `imageName`, `categoryID`, `shortDescription`, `urlPKDWeb`, `active`) VALUES
(367, 'Faith of Our Fathers', 'faith of our fathers', 'Faith-Of-Our-Fathers', 'Philip K.', 'Dick', STR_TO_DATE('1/17/1966','%m/%d/%Y'), STR_TO_DATE('1/1/1967','%m/%d/%Y'), NULL, 12, NULL, 'https://1999pkdweb.philipdick.com/Faith%20Of%20Our%20Fathers.htm', 0);

INSERT INTO `titles` (`titleID`, `titleName`, `titleSort`, `titleURL`, `authorFirstName`, `authorLastName`, `submissionDate`, `publicationDate`, `imageName`, `categoryID`, `shortDescription`, `urlPKDWeb`, `active`) VALUES
(385, 'Fawn, Look Back', 'fawn, look back', 'Fawn-Look-Back', 'Philip K.', 'Dick', NULL, NULL, NULL, 12, NULL, 'https://1999pkdweb.philipdick.com/Fawn%20Look%20Back.htm', 0);

INSERT INTO `titles` (`titleID`, `titleName`, `titleSort`, `titleURL`, `authorFirstName`, `authorLastName`, `submissionDate`, `publicationDate`, `imageName`, `categoryID`, `shortDescription`, `urlPKDWeb`, `active`) VALUES
(326, 'Foster, You''re Dead!', 'foster, you''re dead!', 'Foster-You-re-Dead-', 'Philip K.', 'Dick', STR_TO_DATE('12/31/1953','%m/%d/%Y'), STR_TO_DATE('1/1/1955','%m/%d/%Y'), NULL, 12, NULL, 'https://1999pkdweb.philipdick.com/Foster%20Youre%20Dead.htm', 0);

INSERT INTO `titles` (`titleID`, `titleName`, `titleSort`, `titleURL`, `authorFirstName`, `authorLastName`, `submissionDate`, `publicationDate`, `imageName`, `categoryID`, `shortDescription`, `urlPKDWeb`, `active`) VALUES
(387, 'Goodbye, Vincent', 'goodbye, vincent', 'Goodbye-Vincent', 'Philip K.', 'Dick', NULL, NULL, NULL, 12, NULL, 'https://1999pkdweb.philipdick.com/Goodbye,%20Vincent.htm', 0);

INSERT INTO `titles` (`titleID`, `titleName`, `titleSort`, `titleURL`, `authorFirstName`, `authorLastName`, `submissionDate`, `publicationDate`, `imageName`, `categoryID`, `shortDescription`, `urlPKDWeb`, `active`) VALUES
(364, 'Holy Quarrel', 'holy quarrel', 'Holy-Quarrel', 'Philip K.', 'Dick', STR_TO_DATE('9/13/1965','%m/%d/%Y'), STR_TO_DATE('5/1/1966','%m/%d/%Y'), NULL, 12, NULL, 'https://1999pkdweb.philipdick.com/Holy%20Quarrel.htm', 0);

INSERT INTO `titles` (`titleID`, `titleName`, `titleSort`, `titleURL`, `authorFirstName`, `authorLastName`, `submissionDate`, `publicationDate`, `imageName`, `categoryID`, `shortDescription`, `urlPKDWeb`, `active`) VALUES
(328, 'Human Is', 'human is', 'Human-Is', 'Philip K.', 'Dick', STR_TO_DATE('2/2/1953','%m/%d/%Y'), STR_TO_DATE('12/1/1955','%m/%d/%Y'), NULL, 12, NULL, 'https://1999pkdweb.philipdick.com/Human%20Is.htm', 0);

INSERT INTO `titles` (`titleID`, `titleName`, `titleSort`, `titleURL`, `authorFirstName`, `authorLastName`, `submissionDate`, `publicationDate`, `imageName`, `categoryID`, `shortDescription`, `urlPKDWeb`, `active`) VALUES
(378, 'I Hope I Shall Arrive Soon', 'i hope i shall arrive soon', 'I-Hope-I-Shall-Arrive-Soon', 'Philip K.', 'Dick', STR_TO_DATE('4/24/1980','%m/%d/%Y'), STR_TO_DATE('12/1/1980','%m/%d/%Y'), NULL, 12, NULL, 'https://1999pkdweb.philipdick.com/I%20HOPE%20I%20SHALL%20ARRIVE%20SOON.htm', 0);

INSERT INTO `titles` (`titleID`, `titleName`, `titleSort`, `titleURL`, `authorFirstName`, `authorLastName`, `submissionDate`, `publicationDate`, `imageName`, `categoryID`, `shortDescription`, `urlPKDWeb`, `active`) VALUES
(348, 'If There Were No Benny Cemoli', 'if there were no benny cemoli', 'If-There-Were-No-Benny-Cemoli', 'Philip K.', 'Dick', STR_TO_DATE('2/27/1963','%m/%d/%Y'), STR_TO_DATE('12/1/1963','%m/%d/%Y'), NULL, 12, NULL, 'https://1999pkdweb.philipdick.com/If%20There%20Were%20No%20Benny%20Cemoli.htm', 0);

INSERT INTO `titles` (`titleID`, `titleName`, `titleSort`, `titleURL`, `authorFirstName`, `authorLastName`, `submissionDate`, `publicationDate`, `imageName`, `categoryID`, `shortDescription`, `urlPKDWeb`, `active`) VALUES
(280, 'Impostor', 'impostor', 'Impostor', 'Philip K.', 'Dick', STR_TO_DATE('2/24/1953','%m/%d/%Y'), STR_TO_DATE('6/1/1953','%m/%d/%Y'), NULL, 12, NULL, 'https://1999pkdweb.philipdick.com/impostor.htm', 0);

INSERT INTO `titles` (`titleID`, `titleName`, `titleSort`, `titleURL`, `authorFirstName`, `authorLastName`, `submissionDate`, `publicationDate`, `imageName`, `categoryID`, `shortDescription`, `urlPKDWeb`, `active`) VALUES
(304, 'James P. Crow', 'james p. crow', 'James-P-Crow', 'Philip K.', 'Dick', STR_TO_DATE('3/17/1953','%m/%d/%Y'), STR_TO_DATE('5/1/1954','%m/%d/%Y'), NULL, 12, NULL, 'https://1999pkdweb.philipdick.com/James%20P%20Crow.htm', 0);

INSERT INTO `titles` (`titleID`, `titleName`, `titleSort`, `titleURL`, `authorFirstName`, `authorLastName`, `submissionDate`, `publicationDate`, `imageName`, `categoryID`, `shortDescription`, `urlPKDWeb`, `active`) VALUES
(305, 'Jon''s World', 'jon''s world', 'Jon-s-World', 'Philip K.', 'Dick', STR_TO_DATE('10/21/1952','%m/%d/%Y'), STR_TO_DATE('1/1/1954','%m/%d/%Y'), NULL, 12, NULL, 'https://1999pkdweb.philipdick.com/Jons%20World.htm', 0);

INSERT INTO `titles` (`titleID`, `titleName`, `titleSort`, `titleURL`, `authorFirstName`, `authorLastName`, `submissionDate`, `publicationDate`, `imageName`, `categoryID`, `shortDescription`, `urlPKDWeb`, `active`) VALUES
(284, 'Martians Come in Clouds', 'martians come in clouds', 'Martians-Come-In-Clouds', 'Philip K.', 'Dick', STR_TO_DATE('11/5/1952','%m/%d/%Y'), STR_TO_DATE('6/1/1954','%m/%d/%Y'), NULL, 12, NULL, 'https://1999pkdweb.philipdick.com/Martians%20Come%20In%20Clouds.htm', 0);

INSERT INTO `titles` (`titleID`, `titleName`, `titleSort`, `titleURL`, `authorFirstName`, `authorLastName`, `submissionDate`, `publicationDate`, `imageName`, `categoryID`, `shortDescription`, `urlPKDWeb`, `active`) VALUES
(307, 'Meddler', 'meddler', 'Meddler', 'Philip K.', 'Dick', STR_TO_DATE('7/24/1952','%m/%d/%Y'), STR_TO_DATE('10/1/1954','%m/%d/%Y'), NULL, 12, NULL, 'https://1999pkdweb.philipdick.com/meddler.htm', 0);

INSERT INTO `titles` (`titleID`, `titleName`, `titleSort`, `titleURL`, `authorFirstName`, `authorLastName`, `submissionDate`, `publicationDate`, `imageName`, `categoryID`, `shortDescription`, `urlPKDWeb`, `active`) VALUES
(388, 'Menace React', 'menace react', 'Menace-React', 'Philip K.', 'Dick', NULL, NULL, NULL, 12, NULL, NULL, 0);

INSERT INTO `titles` (`titleID`, `titleName`, `titleSort`, `titleURL`, `authorFirstName`, `authorLastName`, `submissionDate`, `publicationDate`, `imageName`, `categoryID`, `shortDescription`, `urlPKDWeb`, `active`) VALUES
(339, 'Misadjustment', 'misadjustment', 'Misadjustment', 'Philip K.', 'Dick', STR_TO_DATE('5/14/1954','%m/%d/%Y'), STR_TO_DATE('2/1/1957','%m/%d/%Y'), NULL, 12, NULL, 'https://1999pkdweb.philipdick.com/Misadjustment.htm', 0);

INSERT INTO `titles` (`titleID`, `titleName`, `titleSort`, `titleURL`, `authorFirstName`, `authorLastName`, `submissionDate`, `publicationDate`, `imageName`, `categoryID`, `shortDescription`, `urlPKDWeb`, `active`) VALUES
(285, 'Mr. Spaceship', 'mr. spaceship', 'Mr-Spaceship', 'Philip K.', 'Dick', NULL, STR_TO_DATE('1/1/1953','%m/%d/%Y'), NULL, 12, NULL, 'https://1999pkdweb.philipdick.com/Mr%20Spaceship.htm', 0);

INSERT INTO `titles` (`titleID`, `titleName`, `titleSort`, `titleURL`, `authorFirstName`, `authorLastName`, `submissionDate`, `publicationDate`, `imageName`, `categoryID`, `shortDescription`, `urlPKDWeb`, `active`) VALUES
(330, 'Nanny', 'nanny', 'Nanny', 'Philip K.', 'Dick', STR_TO_DATE('8/26/1952','%m/%d/%Y'), STR_TO_DATE('3/1/1955','%m/%d/%Y'), NULL, 12, NULL, 'https://1999pkdweb.philipdick.com/nanny.htm', 0);

INSERT INTO `titles` (`titleID`, `titleName`, `titleSort`, `titleURL`, `authorFirstName`, `authorLastName`, `submissionDate`, `publicationDate`, `imageName`, `categoryID`, `shortDescription`, `urlPKDWeb`, `active`) VALUES
(369, 'Not By Its Cover', 'not by its cover', 'Not-By-Its-Cover', 'Philip K.', 'Dick', STR_TO_DATE('9/21/1965','%m/%d/%Y'), STR_TO_DATE('6/1/1968','%m/%d/%Y'), NULL, 12, NULL, 'https://1999pkdweb.philipdick.com/Not%20By%20Its%20Cover.htm', 0);

INSERT INTO `titles` (`titleID`, `titleName`, `titleSort`, `titleURL`, `authorFirstName`, `authorLastName`, `submissionDate`, `publicationDate`, `imageName`, `categoryID`, `shortDescription`, `urlPKDWeb`, `active`) VALUES
(354, 'Novelty Act', 'novelty act', 'Novelty-Act', 'Philip K.', 'Dick', STR_TO_DATE('3/23/1963','%m/%d/%Y'), STR_TO_DATE('2/1/1964','%m/%d/%Y'), NULL, 12, NULL, 'https://1999pkdweb.philipdick.com/Novelty%20Act.htm', 0);

INSERT INTO `titles` (`titleID`, `titleName`, `titleSort`, `titleURL`, `authorFirstName`, `authorLastName`, `submissionDate`, `publicationDate`, `imageName`, `categoryID`, `shortDescription`, `urlPKDWeb`, `active`) VALUES
(341, 'Null-O', 'null-o', 'Null-O', 'Philip K.', 'Dick', STR_TO_DATE('8/31/1953','%m/%d/%Y'), STR_TO_DATE('12/1/1958','%m/%d/%Y'), NULL, 12, NULL, 'https://1999pkdweb.philipdick.com/Null%20O.htm', 0);

INSERT INTO `titles` (`titleID`, `titleName`, `titleSort`, `titleURL`, `authorFirstName`, `authorLastName`, `submissionDate`, `publicationDate`, `imageName`, `categoryID`, `shortDescription`, `urlPKDWeb`, `active`) VALUES
(308, 'Of Withered Apples', 'of withered apples', 'Of-Withered-Apples', 'Philip K.', 'Dick', STR_TO_DATE('1/26/1953','%m/%d/%Y'), STR_TO_DATE('7/1/1954','%m/%d/%Y'), NULL, 12, NULL, 'https://1999pkdweb.philipdick.com/Of%20Withered%20Apples.htm', 0);

INSERT INTO `titles` (`titleID`, `titleName`, `titleSort`, `titleURL`, `authorFirstName`, `authorLastName`, `submissionDate`, `publicationDate`, `imageName`, `categoryID`, `shortDescription`, `urlPKDWeb`, `active`) VALUES
(355, 'Oh, to be a Blobel!', 'oh, to be a blobel!', 'Oh-To-Be-A-Blobel-', 'Philip K.', 'Dick', STR_TO_DATE('5/6/1963','%m/%d/%Y'), STR_TO_DATE('2/1/1964','%m/%d/%Y'), NULL, 12, NULL, 'https://1999pkdweb.philipdick.com/Oh%20To%20Be%20A%20Blobel.htm', 0);

INSERT INTO `titles` (`titleID`, `titleName`, `titleSort`, `titleURL`, `authorFirstName`, `authorLastName`, `submissionDate`, `publicationDate`, `imageName`, `categoryID`, `shortDescription`, `urlPKDWeb`, `active`) VALUES
(356, 'Orpheus with Clay Feet', 'orpheus with clay feet', 'Orpheus-With-Clay-Feet', 'Philip K.', 'Dick', STR_TO_DATE('4/16/1963','%m/%d/%Y'), STR_TO_DATE('1/1/1964','%m/%d/%Y'), NULL, 12, NULL, 'https://1999pkdweb.philipdick.com/Orpheus%20With%20Clay%20Feet.htm', 0);

INSERT INTO `titles` (`titleID`, `titleName`, `titleSort`, `titleURL`, `authorFirstName`, `authorLastName`, `submissionDate`, `publicationDate`, `imageName`, `categoryID`, `shortDescription`, `urlPKDWeb`, `active`) VALUES
(286, 'Out in the Garden', 'out in the garden', 'Out-In-The-Garden', 'Philip K.', 'Dick', STR_TO_DATE('7/31/1952','%m/%d/%Y'), STR_TO_DATE('8/1/1953','%m/%d/%Y'), NULL, 12, NULL, 'https://1999pkdweb.philipdick.com/Out%20In%20The%20Garden.htm', 0);

INSERT INTO `titles` (`titleID`, `titleName`, `titleSort`, `titleURL`, `authorFirstName`, `authorLastName`, `submissionDate`, `publicationDate`, `imageName`, `categoryID`, `shortDescription`, `urlPKDWeb`, `active`) VALUES
(337, 'Pay for the Printer', 'pay for the printer', 'Pay-For-The-Printer', 'Philip K.', 'Dick', STR_TO_DATE('1/28/1954','%m/%d/%Y'), STR_TO_DATE('10/1/1956','%m/%d/%Y'), NULL, 12, NULL, 'https://1999pkdweb.philipdick.com/Pay%20For%20The%20Printer.htm', 0);

INSERT INTO `titles` (`titleID`, `titleName`, `titleSort`, `titleURL`, `authorFirstName`, `authorLastName`, `submissionDate`, `publicationDate`, `imageName`, `categoryID`, `shortDescription`, `urlPKDWeb`, `active`) VALUES
(287, 'Paycheck', 'paycheck', 'Paycheck', 'Philip K.', 'Dick', STR_TO_DATE('7/31/1952','%m/%d/%Y'), STR_TO_DATE('6/1/1953','%m/%d/%Y'), NULL, 12, NULL, 'https://1999pkdweb.philipdick.com/paycheck.htm', 0);

INSERT INTO `titles` (`titleID`, `titleName`, `titleSort`, `titleURL`, `authorFirstName`, `authorLastName`, `submissionDate`, `publicationDate`, `imageName`, `categoryID`, `shortDescription`, `urlPKDWeb`, `active`) VALUES
(288, 'Piper in the Woods', 'piper in the woods', 'Piper-In-The-Woods', 'Philip K.', 'Dick', NULL, STR_TO_DATE('2/1/1953','%m/%d/%Y'), NULL, 12, NULL, 'https://1999pkdweb.philipdick.com/Piper%20In%20The%20Woods.htm', 0);

INSERT INTO `titles` (`titleID`, `titleName`, `titleSort`, `titleURL`, `authorFirstName`, `authorLastName`, `submissionDate`, `publicationDate`, `imageName`, `categoryID`, `shortDescription`, `urlPKDWeb`, `active`) VALUES
(289, 'Planet for Transients', 'planet for transients', 'Planet-For-Transients', 'Philip K.', 'Dick', STR_TO_DATE('3/23/1953','%m/%d/%Y'), STR_TO_DATE('10/1/1953','%m/%d/%Y'), NULL, 12, NULL, 'https://1999pkdweb.philipdick.com/Planet%20For%20Transients.htm', 0);

INSERT INTO `titles` (`titleID`, `titleName`, `titleSort`, `titleURL`, `authorFirstName`, `authorLastName`, `submissionDate`, `publicationDate`, `imageName`, `categoryID`, `shortDescription`, `urlPKDWeb`, `active`) VALUES
(357, 'Precious Artifact', 'precious artifact', 'Precious-Artifact', 'Philip K.', 'Dick', STR_TO_DATE('12/9/1963','%m/%d/%Y'), STR_TO_DATE('10/1/1964','%m/%d/%Y'), NULL, 12, NULL, 'https://1999pkdweb.philipdick.com/Precious%20Artifact.htm', 0);

INSERT INTO `titles` (`titleID`, `titleName`, `titleSort`, `titleURL`, `authorFirstName`, `authorLastName`, `submissionDate`, `publicationDate`, `imageName`, `categoryID`, `shortDescription`, `urlPKDWeb`, `active`) VALUES
(310, 'Prize Ship', 'prize ship', 'Prize-Ship', 'Philip K.', 'Dick', STR_TO_DATE('8/14/1952','%m/%d/%Y'), STR_TO_DATE('12/1/1954','%m/%d/%Y'), NULL, 12, NULL, 'https://1999pkdweb.philipdick.com/Prize%20Ship.htm', 0);

INSERT INTO `titles` (`titleID`, `titleName`, `titleSort`, `titleURL`, `authorFirstName`, `authorLastName`, `submissionDate`, `publicationDate`, `imageName`, `categoryID`, `shortDescription`, `urlPKDWeb`, `active`) VALUES
(311, 'Progeny', 'progeny', 'Progeny', 'Philip K.', 'Dick', STR_TO_DATE('11/3/1952','%m/%d/%Y'), STR_TO_DATE('11/1/1954','%m/%d/%Y'), NULL, 12, NULL, 'https://1999pkdweb.philipdick.com/progeny.htm', 0);

INSERT INTO `titles` (`titleID`, `titleName`, `titleSort`, `titleURL`, `authorFirstName`, `authorLastName`, `submissionDate`, `publicationDate`, `imageName`, `categoryID`, `shortDescription`, `urlPKDWeb`, `active`) VALUES
(362, 'Project Plowshare', 'project plowshare', 'Project-Plowshare', 'Philip K.', 'Dick', NULL, NULL, NULL, 12, NULL, 'https://1999pkdweb.philipdick.com/Project%20Earth.htm', 0);

INSERT INTO `titles` (`titleID`, `titleName`, `titleSort`, `titleURL`, `authorFirstName`, `authorLastName`, `submissionDate`, `publicationDate`, `imageName`, `categoryID`, `shortDescription`, `urlPKDWeb`, `active`) VALUES
(291, 'Project: Earth', 'project: earth', 'Project:-Earth', 'Philip K.', 'Dick', STR_TO_DATE('1/6/1953','%m/%d/%Y'), STR_TO_DATE('12/1/1953','%m/%d/%Y'), NULL, 12, NULL, 'https://1999pkdweb.philipdick.com/Project%20Plowshare.htm', 0);

INSERT INTO `titles` (`titleID`, `titleName`, `titleSort`, `titleURL`, `authorFirstName`, `authorLastName`, `submissionDate`, `publicationDate`, `imageName`, `categoryID`, `shortDescription`, `urlPKDWeb`, `active`) VALUES
(312, 'Prominent Author', 'prominent author', 'Prominent-Author', 'Philip K.', 'Dick', STR_TO_DATE('4/20/1953','%m/%d/%Y'), STR_TO_DATE('5/1/1954','%m/%d/%Y'), NULL, 12, NULL, 'https://1999pkdweb.philipdick.com/Prominent%20Author.htm', 0);

INSERT INTO `titles` (`titleID`, `titleName`, `titleSort`, `titleURL`, `authorFirstName`, `authorLastName`, `submissionDate`, `publicationDate`, `imageName`, `categoryID`, `shortDescription`, `urlPKDWeb`, `active`) VALUES
(331, 'Psi-man Heal My Child!', 'psi-man heal my child!', 'Psi-Man-Heal-My-Child-', 'Philip K.', 'Dick', STR_TO_DATE('6/8/1954','%m/%d/%Y'), STR_TO_DATE('11/1/1955','%m/%d/%Y'), NULL, 12, NULL, 'https://1999pkdweb.philipdick.com/Psi-Man%20Heal%20My%20Child.htm', 0);

INSERT INTO `titles` (`titleID`, `titleName`, `titleSort`, `titleURL`, `authorFirstName`, `authorLastName`, `submissionDate`, `publicationDate`, `imageName`, `categoryID`, `shortDescription`, `urlPKDWeb`, `active`) VALUES
(379, 'Rautavaara''s Case', 'rautavaara''s case', 'Rautavaara-s-Case', 'Philip K.', 'Dick', STR_TO_DATE('5/13/1980','%m/%d/%Y'), STR_TO_DATE('10/1/1980','%m/%d/%Y'), NULL, 12, NULL, 'https://1999pkdweb.philipdick.com/Rautavaaras%20Case.htm', 0);

INSERT INTO `titles` (`titleID`, `titleName`, `titleSort`, `titleURL`, `authorFirstName`, `authorLastName`, `submissionDate`, `publicationDate`, `imageName`, `categoryID`, `shortDescription`, `urlPKDWeb`, `active`) VALUES
(344, 'Recall Mechanism', 'recall mechanism', 'Recall-Mechanism', 'Philip K.', 'Dick', NULL, STR_TO_DATE('7/1/1959','%m/%d/%Y'), NULL, 12, NULL, 'https://1999pkdweb.philipdick.com/Recall%20Mechanism.htm', 0);

INSERT INTO `titles` (`titleID`, `titleName`, `titleSort`, `titleURL`, `authorFirstName`, `authorLastName`, `submissionDate`, `publicationDate`, `imageName`, `categoryID`, `shortDescription`, `urlPKDWeb`, `active`) VALUES
(363, 'Retreat Syndrome', 'retreat syndrome', 'Retreat-Syndrome', 'Philip K.', 'Dick', STR_TO_DATE('12/23/1963','%m/%d/%Y'), STR_TO_DATE('1/1/1965','%m/%d/%Y'), NULL, 12, NULL, 'https://1999pkdweb.philipdick.com/Retreat%20Syndrome.htm', 0);

INSERT INTO `titles` (`titleID`, `titleName`, `titleSort`, `titleURL`, `authorFirstName`, `authorLastName`, `submissionDate`, `publicationDate`, `imageName`, `categoryID`, `shortDescription`, `urlPKDWeb`, `active`) VALUES
(368, 'Return Match', 'return match', 'Return-Match', 'Philip K.', 'Dick', STR_TO_DATE('10/14/1965','%m/%d/%Y'), STR_TO_DATE('2/1/1967','%m/%d/%Y'), NULL, 12, NULL, 'https://1999pkdweb.philipdick.com/Return%20Match.htm', 0);

INSERT INTO `titles` (`titleID`, `titleName`, `titleSort`, `titleURL`, `authorFirstName`, `authorLastName`, `submissionDate`, `publicationDate`, `imageName`, `categoryID`, `shortDescription`, `urlPKDWeb`, `active`) VALUES
(292, 'Roog', 'roog', 'Roog', 'Philip K.', 'Dick', STR_TO_DATE('11/1/1951','%m/%d/%Y'), STR_TO_DATE('2/1/1953','%m/%d/%Y'), NULL, 12, NULL, 'https://1999pkdweb.philipdick.com/roog.htm', 0);

INSERT INTO `titles` (`titleID`, `titleName`, `titleSort`, `titleURL`, `authorFirstName`, `authorLastName`, `submissionDate`, `publicationDate`, `imageName`, `categoryID`, `shortDescription`, `urlPKDWeb`, `active`) VALUES
(313, 'Sales Pitch', 'sales pitch', 'Sales-Pitch', 'Philip K.', 'Dick', STR_TO_DATE('11/19/1953','%m/%d/%Y'), STR_TO_DATE('6/1/1954','%m/%d/%Y'), NULL, 12, NULL, 'https://1999pkdweb.philipdick.com/Sales%20Pitch.htm', 0);

INSERT INTO `titles` (`titleID`, `titleName`, `titleSort`, `titleURL`, `authorFirstName`, `authorLastName`, `submissionDate`, `publicationDate`, `imageName`, `categoryID`, `shortDescription`, `urlPKDWeb`, `active`) VALUES
(332, 'Service Call', 'service call', 'Service-Call', 'Philip K.', 'Dick', STR_TO_DATE('10/11/1954','%m/%d/%Y'), STR_TO_DATE('7/1/1955','%m/%d/%Y'), NULL, 12, NULL, 'https://1999pkdweb.philipdick.com/Service%20Call.htm', 0);

INSERT INTO `titles` (`titleID`, `titleName`, `titleSort`, `titleURL`, `authorFirstName`, `authorLastName`, `submissionDate`, `publicationDate`, `imageName`, `categoryID`, `shortDescription`, `urlPKDWeb`, `active`) VALUES
(314, 'Shell Game', 'shell game', 'Shell-Game', 'Philip K.', 'Dick', STR_TO_DATE('12/22/1953','%m/%d/%Y'), STR_TO_DATE('9/1/1954','%m/%d/%Y'), NULL, 12, NULL, 'https://1999pkdweb.philipdick.com/Shell%20Game.htm', 0);

INSERT INTO `titles` (`titleID`, `titleName`, `titleSort`, `titleURL`, `authorFirstName`, `authorLastName`, `submissionDate`, `publicationDate`, `imageName`, `categoryID`, `shortDescription`, `urlPKDWeb`, `active`) VALUES
(316, 'Small Town', 'small town', 'Small-Town', 'Philip K.', 'Dick', STR_TO_DATE('3/23/1953','%m/%d/%Y'), STR_TO_DATE('5/1/1954','%m/%d/%Y'), NULL, 12, NULL, 'https://1999pkdweb.philipdick.com/Small%20Town.htm', 0);

INSERT INTO `titles` (`titleID`, `titleName`, `titleSort`, `titleURL`, `authorFirstName`, `authorLastName`, `submissionDate`, `publicationDate`, `imageName`, `categoryID`, `shortDescription`, `urlPKDWeb`, `active`) VALUES
(293, 'Some Kinds of Life', 'some kinds of life', 'Some-Kinds-Of-Life', 'Philip K.', 'Dick', STR_TO_DATE('11/3/1952','%m/%d/%Y'), STR_TO_DATE('10/1/1953','%m/%d/%Y'), NULL, 12, NULL, 'https://1999pkdweb.philipdick.com/Some%20Kinds%20Of%20Life.htm', 0);

INSERT INTO `titles` (`titleID`, `titleName`, `titleSort`, `titleURL`, `authorFirstName`, `authorLastName`, `submissionDate`, `publicationDate`, `imageName`, `categoryID`, `shortDescription`, `urlPKDWeb`, `active`) VALUES
(317, 'Souvenir', 'souvenir', 'Souvenir', 'Philip K.', 'Dick', STR_TO_DATE('3/26/1953','%m/%d/%Y'), STR_TO_DATE('10/1/1954','%m/%d/%Y'), NULL, 12, NULL, 'https://1999pkdweb.philipdick.com/souvenir.htm', 0);

INSERT INTO `titles` (`titleID`, `titleName`, `titleSort`, `titleURL`, `authorFirstName`, `authorLastName`, `submissionDate`, `publicationDate`, `imageName`, `categoryID`, `shortDescription`, `urlPKDWeb`, `active`) VALUES
(386, 'Stability', 'stability', 'Stability', 'Philip K.', 'Dick', NULL, NULL, NULL, 12, NULL, 'https://1999pkdweb.philipdick.com/Stability.htm', 0);

INSERT INTO `titles` (`titleID`, `titleName`, `titleSort`, `titleURL`, `authorFirstName`, `authorLastName`, `submissionDate`, `publicationDate`, `imageName`, `categoryID`, `shortDescription`, `urlPKDWeb`, `active`) VALUES
(349, 'Stand-by', 'stand-by', 'Stand-By', 'Philip K.', 'Dick', STR_TO_DATE('4/18/1963','%m/%d/%Y'), STR_TO_DATE('10/1/1963','%m/%d/%Y'), NULL, 12, NULL, 'https://1999pkdweb.philipdick.com/stand-by.htm', 0);

INSERT INTO `titles` (`titleID`, `titleName`, `titleSort`, `titleURL`, `authorFirstName`, `authorLastName`, `submissionDate`, `publicationDate`, `imageName`, `categoryID`, `shortDescription`, `urlPKDWeb`, `active`) VALUES
(318, 'Strange Eden', 'strange eden', 'Strange-Eden', 'Philip K.', 'Dick', STR_TO_DATE('8/4/1953','%m/%d/%Y'), STR_TO_DATE('12/1/1954','%m/%d/%Y'), NULL, 12, NULL, 'https://1999pkdweb.philipdick.com/Strange%20Eden.htm', 0);

INSERT INTO `titles` (`titleID`, `titleName`, `titleSort`, `titleURL`, `authorFirstName`, `authorLastName`, `submissionDate`, `publicationDate`, `imageName`, `categoryID`, `shortDescription`, `urlPKDWeb`, `active`) VALUES
(382, 'Strange Memories Of Death', 'strange memories of death', 'Strange-Memories-Of-Death', 'Philip K.', 'Dick', STR_TO_DATE('3/27/1980','%m/%d/%Y'), STR_TO_DATE('6/1/1984','%m/%d/%Y'), NULL, 12, NULL, 'https://1999pkdweb.philipdick.com/Strange%20Memories%20Of%20Death.htm', 0);

INSERT INTO `titles` (`titleID`, `titleName`, `titleSort`, `titleURL`, `authorFirstName`, `authorLastName`, `submissionDate`, `publicationDate`, `imageName`, `categoryID`, `shortDescription`, `urlPKDWeb`, `active`) VALUES
(319, 'Survey Team', 'survey team', 'Survey-Team', 'Philip K.', 'Dick', STR_TO_DATE('4/3/1953','%m/%d/%Y'), STR_TO_DATE('5/1/1954','%m/%d/%Y'), NULL, 12, NULL, 'https://1999pkdweb.philipdick.com/Survey%20Team.htm', 0);

INSERT INTO `titles` (`titleID`, `titleName`, `titleSort`, `titleURL`, `authorFirstName`, `authorLastName`, `submissionDate`, `publicationDate`, `imageName`, `categoryID`, `shortDescription`, `urlPKDWeb`, `active`) VALUES
(381, 'The Alien Mind', 'alien mind, the', 'The-Alien-Mind', 'Philip K.', 'Dick', NULL, STR_TO_DATE('2/20/1981','%m/%d/%Y'), NULL, 12, NULL, 'https://1999pkdweb.philipdick.com/the%20alien%20mind.htm', 0);

INSERT INTO `titles` (`titleID`, `titleName`, `titleSort`, `titleURL`, `authorFirstName`, `authorLastName`, `submissionDate`, `publicationDate`, `imageName`, `categoryID`, `shortDescription`, `urlPKDWeb`, `active`) VALUES
(269, 'The Builder', 'builder, the', 'The-Builder', 'Philip K.', 'Dick', STR_TO_DATE('7/23/1952','%m/%d/%Y'), STR_TO_DATE('12/1/1953','%m/%d/%Y'), NULL, 12, NULL, 'https://1999pkdweb.philipdick.com/The%20Builder.htm', 0);

INSERT INTO `titles` (`titleID`, `titleName`, `titleSort`, `titleURL`, `authorFirstName`, `authorLastName`, `submissionDate`, `publicationDate`, `imageName`, `categoryID`, `shortDescription`, `urlPKDWeb`, `active`) VALUES
(325, 'The Chromium Fence', 'chromium fence, the', 'The-Chromium-Fence', 'Philip K.', 'Dick', STR_TO_DATE('4/9/1954','%m/%d/%Y'), STR_TO_DATE('7/1/1955','%m/%d/%Y'), NULL, 12, NULL, 'https://1999pkdweb.philipdick.com/The%20Chromium%20Fence.htm', 0);

INSERT INTO `titles` (`titleID`, `titleName`, `titleSort`, `titleURL`, `authorFirstName`, `authorLastName`, `submissionDate`, `publicationDate`, `imageName`, `categoryID`, `shortDescription`, `urlPKDWeb`, `active`) VALUES
(271, 'The Commuter', 'commuter, the', 'The-Commuter', 'Philip K.', 'Dick', STR_TO_DATE('11/19/1952','%m/%d/%Y'), STR_TO_DATE('8/1/1953','%m/%d/%Y'), NULL, 12, NULL, 'https://1999pkdweb.philipdick.com/The%20Commuter.htm', 0);

INSERT INTO `titles` (`titleID`, `titleName`, `titleSort`, `titleURL`, `authorFirstName`, `authorLastName`, `submissionDate`, `publicationDate`, `imageName`, `categoryID`, `shortDescription`, `urlPKDWeb`, `active`) VALUES
(272, 'The Cookie Lady', 'cookie lady, the', 'The-Cookie-Lady', 'Philip K.', 'Dick', STR_TO_DATE('8/27/1952','%m/%d/%Y'), STR_TO_DATE('6/1/1953','%m/%d/%Y'), NULL, 12, NULL, NULL, 0);

INSERT INTO `titles` (`titleID`, `titleName`, `titleSort`, `titleURL`, `authorFirstName`, `authorLastName`, `submissionDate`, `publicationDate`, `imageName`, `categoryID`, `shortDescription`, `urlPKDWeb`, `active`) VALUES
(273, 'The Cosmic Poachers', 'cosmic poachers, the', 'The-Cosmic-Poachers', 'Philip K.', 'Dick', STR_TO_DATE('10/22/1952','%m/%d/%Y'), STR_TO_DATE('7/1/1953','%m/%d/%Y'), NULL, 12, NULL, 'https://1999pkdweb.philipdick.com/The%20Cosmic%20Poachers.htm', 0);

INSERT INTO `titles` (`titleID`, `titleName`, `titleSort`, `titleURL`, `authorFirstName`, `authorLastName`, `submissionDate`, `publicationDate`, `imageName`, `categoryID`, `shortDescription`, `urlPKDWeb`, `active`) VALUES
(299, 'The Crawlers', 'crawlers, the', 'The-Crawlers', 'Philip K.', 'Dick', STR_TO_DATE('10/29/1953','%m/%d/%Y'), STR_TO_DATE('7/1/1954','%m/%d/%Y'), NULL, 12, NULL, 'https://1999pkdweb.philipdick.com/The%20Crawlers.htm', 0);

INSERT INTO `titles` (`titleID`, `titleName`, `titleSort`, `titleURL`, `authorFirstName`, `authorLastName`, `submissionDate`, `publicationDate`, `imageName`, `categoryID`, `shortDescription`, `urlPKDWeb`, `active`) VALUES
(300, 'The Crystal Crypt', 'crystal crypt, the', 'The-Crystal-Crypt', 'Philip K.', 'Dick', NULL, STR_TO_DATE('1/1/1954','%m/%d/%Y'), NULL, 12, NULL, 'https://1999pkdweb.philipdick.com/The%20Crystal%20Crypt.htm', 0);

INSERT INTO `titles` (`titleID`, `titleName`, `titleSort`, `titleURL`, `authorFirstName`, `authorLastName`, `submissionDate`, `publicationDate`, `imageName`, `categoryID`, `shortDescription`, `urlPKDWeb`, `active`) VALUES
(383, 'The Day Mr. Computer Fell Out of Its Tree', 'day mr. computer fell out of its tree, the', 'The-Day-Mr-Computer-Fell-Out-Of-Its-Tree', 'Philip K.', 'Dick', NULL, NULL, NULL, 12, NULL, 'https://1999pkdweb.philipdick.com/The%20Day%20Mr.%20Computer%20Fell%20Out%20Of%20Its%20Tree.htm', 0);

INSERT INTO `titles` (`titleID`, `titleName`, `titleSort`, `titleURL`, `authorFirstName`, `authorLastName`, `submissionDate`, `publicationDate`, `imageName`, `categoryID`, `shortDescription`, `urlPKDWeb`, `active`) VALUES
(347, 'The Days of Perky Pat', 'days of perky pat, the', 'The-Days-Of-Perky-Pat', 'Philip K.', 'Dick', STR_TO_DATE('4/18/1963','%m/%d/%Y'), STR_TO_DATE('12/1/1963','%m/%d/%Y'), NULL, 12, NULL, 'https://1999pkdweb.philipdick.com/The%20Days%20Of%20Perky%20Pat.htm', 0);

INSERT INTO `titles` (`titleID`, `titleName`, `titleSort`, `titleURL`, `authorFirstName`, `authorLastName`, `submissionDate`, `publicationDate`, `imageName`, `categoryID`, `shortDescription`, `urlPKDWeb`, `active`) VALUES
(274, 'The Defenders', 'defenders, the', 'The-Defenders', 'Philip K.', 'Dick', NULL, STR_TO_DATE('1/1/1953','%m/%d/%Y'), NULL, 12, NULL, 'https://1999pkdweb.philipdick.com/The%20Defenders.htm', 0);

INSERT INTO `titles` (`titleID`, `titleName`, `titleSort`, `titleURL`, `authorFirstName`, `authorLastName`, `submissionDate`, `publicationDate`, `imageName`, `categoryID`, `shortDescription`, `urlPKDWeb`, `active`) VALUES
(374, 'The Different Stages of Love', 'different stages of love, the', 'The-Different-Stages-Of-Love', 'Philip K.', 'Dick', NULL, NULL, NULL, 12, NULL, 'https://1999pkdweb.philipdick.com/The%20Different%20Stages%20Of%20Love.htm', 0);

INSERT INTO `titles` (`titleID`, `titleName`, `titleSort`, `titleURL`, `authorFirstName`, `authorLastName`, `submissionDate`, `publicationDate`, `imageName`, `categoryID`, `shortDescription`, `urlPKDWeb`, `active`) VALUES
(372, 'The Electric Ant', 'electric ant, the', 'The-Electric-Ant', 'Philip K.', 'Dick', STR_TO_DATE('12/4/1968','%m/%d/%Y'), STR_TO_DATE('10/1/1969','%m/%d/%Y'), NULL, 12, NULL, 'https://1999pkdweb.philipdick.com/The%20Electric%20Ant.htm', 0);

INSERT INTO `titles` (`titleID`, `titleName`, `titleSort`, `titleURL`, `authorFirstName`, `authorLastName`, `submissionDate`, `publicationDate`, `imageName`, `categoryID`, `shortDescription`, `urlPKDWeb`, `active`) VALUES
(377, 'The Exit Door Leads In', 'exit door leads in, the', 'The-Exit-Door-Leads-In', 'Philip K.', 'Dick', STR_TO_DATE('6/21/1979','%m/%d/%Y'), STR_TO_DATE('9/1/1979','%m/%d/%Y'), NULL, 12, NULL, 'https://1999pkdweb.philipdick.com/The%20Exit%20Door%20Leads%20In.htm', 0);

INSERT INTO `titles` (`titleID`, `titleName`, `titleSort`, `titleURL`, `authorFirstName`, `authorLastName`, `submissionDate`, `publicationDate`, `imageName`, `categoryID`, `shortDescription`, `urlPKDWeb`, `active`) VALUES
(384, 'The Eye of The Sibyl', 'eye of the sibyl, the', 'The-Eye-Of-The-Sibyl', 'Philip K.', 'Dick', STR_TO_DATE('5/15/1975','%m/%d/%Y'), NULL, NULL, 12, NULL, 'https://1999pkdweb.philipdick.com/The%20Eye%20Of%20The%20Sibyl.htm', 0);

INSERT INTO `titles` (`titleID`, `titleName`, `titleSort`, `titleURL`, `authorFirstName`, `authorLastName`, `submissionDate`, `publicationDate`, `imageName`, `categoryID`, `shortDescription`, `urlPKDWeb`, `active`) VALUES
(276, 'The Eyes Have It', 'eyes have it, the', 'The-Eyes-Have-It', 'Philip K.', 'Dick', STR_TO_DATE('5/13/1953','%m/%d/%Y'), STR_TO_DATE('1/1/1953','%m/%d/%Y'), NULL, 12, NULL, 'https://1999pkdweb.philipdick.com/The%20Eyes%20Have%20It.htm', 0);

INSERT INTO `titles` (`titleID`, `titleName`, `titleSort`, `titleURL`, `authorFirstName`, `authorLastName`, `submissionDate`, `publicationDate`, `imageName`, `categoryID`, `shortDescription`, `urlPKDWeb`, `active`) VALUES
(302, 'The Father-thing', 'father-thing, the', 'The-Father-Thing', 'Philip K.', 'Dick', STR_TO_DATE('7/21/1953','%m/%d/%Y'), STR_TO_DATE('12/1/1954','%m/%d/%Y'), NULL, 12, NULL, 'https://1999pkdweb.philipdick.com/The%20Father-Thing.htm', 0);

INSERT INTO `titles` (`titleID`, `titleName`, `titleSort`, `titleURL`, `authorFirstName`, `authorLastName`, `submissionDate`, `publicationDate`, `imageName`, `categoryID`, `shortDescription`, `urlPKDWeb`, `active`) VALUES
(303, 'The Golden Man', 'golden man, the', 'The-Golden-Man', 'Philip K.', 'Dick', STR_TO_DATE('6/24/1953','%m/%d/%Y'), STR_TO_DATE('4/1/1954','%m/%d/%Y'), NULL, 12, NULL, 'https://1999pkdweb.philipdick.com/THE%20GOLDEN%20MAN.htm', 0);

INSERT INTO `titles` (`titleID`, `titleName`, `titleSort`, `titleURL`, `authorFirstName`, `authorLastName`, `submissionDate`, `publicationDate`, `imageName`, `categoryID`, `shortDescription`, `urlPKDWeb`, `active`) VALUES
(277, 'The Great C', 'great c, the', 'The-Great-C', 'Philip K.', 'Dick', STR_TO_DATE('7/31/1952','%m/%d/%Y'), STR_TO_DATE('9/1/1953','%m/%d/%Y'), NULL, 12, NULL, 'https://1999pkdweb.philipdick.com/The%20Great%20C.htm', 0);

INSERT INTO `titles` (`titleID`, `titleName`, `titleSort`, `titleURL`, `authorFirstName`, `authorLastName`, `submissionDate`, `publicationDate`, `imageName`, `categoryID`, `shortDescription`, `urlPKDWeb`, `active`) VALUES
(266, 'The Gun', 'gun, the', 'The-Gun', 'Philip K.', 'Dick', NULL, STR_TO_DATE('9/1/1952','%m/%d/%Y'), NULL, 12, NULL, 'https://1999pkdweb.philipdick.com/The%20Gun.htm', 0);

INSERT INTO `titles` (`titleID`, `titleName`, `titleSort`, `titleURL`, `authorFirstName`, `authorLastName`, `submissionDate`, `publicationDate`, `imageName`, `categoryID`, `shortDescription`, `urlPKDWeb`, `active`) VALUES
(278, 'The Hanging Stranger', 'hanging stranger, the', 'The-Hanging-Stranger', 'Philip K.', 'Dick', STR_TO_DATE('5/4/1953','%m/%d/%Y'), STR_TO_DATE('12/1/1953','%m/%d/%Y'), NULL, 12, NULL, 'https://1999pkdweb.philipdick.com/The%20Hanging%20Stranger.htm', 0);

INSERT INTO `titles` (`titleID`, `titleName`, `titleSort`, `titleURL`, `authorFirstName`, `authorLastName`, `submissionDate`, `publicationDate`, `imageName`, `categoryID`, `shortDescription`, `urlPKDWeb`, `active`) VALUES
(327, 'The Hood Maker', 'hood maker, the', 'The-Hood-Maker', 'Philip K.', 'Dick', STR_TO_DATE('1/26/1953','%m/%d/%Y'), STR_TO_DATE('6/1/1955','%m/%d/%Y'), NULL, 12, NULL, 'https://1999pkdweb.philipdick.com/The%20Hood%20Maker.htm', 0);

INSERT INTO `titles` (`titleID`, `titleName`, `titleSort`, `titleURL`, `authorFirstName`, `authorLastName`, `submissionDate`, `publicationDate`, `imageName`, `categoryID`, `shortDescription`, `urlPKDWeb`, `active`) VALUES
(279, 'The Impossible Planet', 'impossible planet, the', 'The-Impossible-Planet', 'Philip K.', 'Dick', STR_TO_DATE('2/11/1953','%m/%d/%Y'), STR_TO_DATE('10/1/1953','%m/%d/%Y'), NULL, 12, NULL, 'https://1999pkdweb.philipdick.com/The%20Impossible%20Planet.htm', 0);

INSERT INTO `titles` (`titleID`, `titleName`, `titleSort`, `titleURL`, `authorFirstName`, `authorLastName`, `submissionDate`, `publicationDate`, `imageName`, `categoryID`, `shortDescription`, `urlPKDWeb`, `active`) VALUES
(281, 'The Indefatigable Frog', 'indefatigable frog, the', 'The-Indefatigable-Frog', 'Philip K.', 'Dick', NULL, STR_TO_DATE('7/1/1953','%m/%d/%Y'), NULL, 12, NULL, 'https://1999pkdweb.philipdick.com/The%20Indefatigable%20Frog.htm', 0);

INSERT INTO `titles` (`titleID`, `titleName`, `titleSort`, `titleURL`, `authorFirstName`, `authorLastName`, `submissionDate`, `publicationDate`, `imageName`, `categoryID`, `shortDescription`, `urlPKDWeb`, `active`) VALUES
(282, 'The Infinites', 'infinites, the', 'The-Infinites', 'Philip K.', 'Dick', NULL, STR_TO_DATE('5/1/1953','%m/%d/%Y'), NULL, 12, NULL, 'https://1999pkdweb.philipdick.com/The%20Infinities.htm', 0);

INSERT INTO `titles` (`titleID`, `titleName`, `titleSort`, `titleURL`, `authorFirstName`, `authorLastName`, `submissionDate`, `publicationDate`, `imageName`, `categoryID`, `shortDescription`, `urlPKDWeb`, `active`) VALUES
(283, 'The King of the Elves', 'king of the elves, the', 'The-King-Of-The-Elves', 'Philip K.', 'Dick', STR_TO_DATE('8/4/1952','%m/%d/%Y'), STR_TO_DATE('9/1/1953','%m/%d/%Y'), NULL, 12, NULL, 'https://1999pkdweb.philipdick.com/The%20King%20Of%20The%20Elves.htm', 0);

INSERT INTO `titles` (`titleID`, `titleName`, `titleSort`, `titleURL`, `authorFirstName`, `authorLastName`, `submissionDate`, `publicationDate`, `imageName`, `categoryID`, `shortDescription`, `urlPKDWeb`, `active`) VALUES
(306, 'The Last of the Masters', 'last of the masters, the', 'The-Last-Of-The-Masters', 'Philip K.', 'Dick', STR_TO_DATE('7/15/1953','%m/%d/%Y'), STR_TO_DATE('11/1/1954','%m/%d/%Y'), NULL, 12, NULL, 'https://1999pkdweb.philipdick.com/The%20Last%20Of%20The%20Master.htm', 0);

INSERT INTO `titles` (`titleID`, `titleName`, `titleSort`, `titleURL`, `authorFirstName`, `authorLastName`, `submissionDate`, `publicationDate`, `imageName`, `categoryID`, `shortDescription`, `urlPKDWeb`, `active`) VALUES
(353, 'The Little Black Box', 'little black box, the', 'The-Little-Black-Box', 'Philip K.', 'Dick', STR_TO_DATE('5/6/1963','%m/%d/%Y'), STR_TO_DATE('8/1/1964','%m/%d/%Y'), NULL, 12, NULL, 'https://1999pkdweb.philipdick.com/The%20Little%20Black%20Box.htm', 0);

INSERT INTO `titles` (`titleID`, `titleName`, `titleSort`, `titleURL`, `authorFirstName`, `authorLastName`, `submissionDate`, `publicationDate`, `imageName`, `categoryID`, `shortDescription`, `urlPKDWeb`, `active`) VALUES
(267, 'The Little Movement', 'little movement, the', 'The-Little-Movement', 'Philip K.', 'Dick', NULL, STR_TO_DATE('11/1/1952','%m/%d/%Y'), NULL, 12, NULL, 'https://1999pkdweb.philipdick.com/The%20Little%20Movement.htm', 0);

INSERT INTO `titles` (`titleID`, `titleName`, `titleSort`, `titleURL`, `authorFirstName`, `authorLastName`, `submissionDate`, `publicationDate`, `imageName`, `categoryID`, `shortDescription`, `urlPKDWeb`, `active`) VALUES
(329, 'The Mold of Yancy', 'mold of yancy, the', 'The-Mold-Of-Yancy', 'Philip K.', 'Dick', STR_TO_DATE('10/18/1954','%m/%d/%Y'), STR_TO_DATE('8/1/1955','%m/%d/%Y'), NULL, 12, NULL, 'https://1999pkdweb.philipdick.com/The%20Mold%20Of%20Yancy.htm', 0);

INSERT INTO `titles` (`titleID`, `titleName`, `titleSort`, `titleURL`, `authorFirstName`, `authorLastName`, `submissionDate`, `publicationDate`, `imageName`, `categoryID`, `shortDescription`, `urlPKDWeb`, `active`) VALUES
(375, 'The Pre-persons', 'pre-persons, the', 'The-Pre-Persons', 'Philip K.', 'Dick', STR_TO_DATE('12/20/1973','%m/%d/%Y'), STR_TO_DATE('10/1/1974','%m/%d/%Y'), NULL, 12, NULL, 'https://1999pkdweb.philipdick.com/The%20Pre%20Persons.htm', 0);

INSERT INTO `titles` (`titleID`, `titleName`, `titleSort`, `titleURL`, `authorFirstName`, `authorLastName`, `submissionDate`, `publicationDate`, `imageName`, `categoryID`, `shortDescription`, `urlPKDWeb`, `active`) VALUES
(290, 'The Preserving Machine', 'preserving machine, the', 'The-Preserving-Machine', 'Philip K.', 'Dick', NULL, STR_TO_DATE('6/1/1953','%m/%d/%Y'), NULL, 12, NULL, 'https://1999pkdweb.philipdick.com/The%20Preserving%20Machine.htm', 0);

INSERT INTO `titles` (`titleID`, `titleName`, `titleSort`, `titleURL`, `authorFirstName`, `authorLastName`, `submissionDate`, `publicationDate`, `imageName`, `categoryID`, `shortDescription`, `urlPKDWeb`, `active`) VALUES
(315, 'The Short Happy Life of the Brown Oxford', 'short happy life of the brown oxford, the', 'The-Short-Happy-Life-Of-The-Brown-Oxford', 'Philip K.', 'Dick', NULL, STR_TO_DATE('1/1/1954','%m/%d/%Y'), NULL, 12, NULL, 'https://1999pkdweb.philipdick.com/The%20Short%20Happy%20%20Life%20Of%20The%20Brown%20Oxford.htm', 0);

INSERT INTO `titles` (`titleID`, `titleName`, `titleSort`, `titleURL`, `authorFirstName`, `authorLastName`, `submissionDate`, `publicationDate`, `imageName`, `categoryID`, `shortDescription`, `urlPKDWeb`, `active`) VALUES
(370, 'The Story To End All Stories', 'story to end all stories, the', 'The-Story-To-End-All-Stories', 'Philip K.', 'Dick', NULL, STR_TO_DATE('9/1/1968','%m/%d/%Y'), NULL, 12, NULL, 'https://1999pkdweb.philipdick.com/The%20Story%20To%20End%20All%20Stories.htm', 0);

INSERT INTO `titles` (`titleID`, `titleName`, `titleSort`, `titleURL`, `authorFirstName`, `authorLastName`, `submissionDate`, `publicationDate`, `imageName`, `categoryID`, `shortDescription`, `urlPKDWeb`, `active`) VALUES
(295, 'The Trouble with Bubbles', 'trouble with bubbles, the', 'The-Trouble-With-Bubbles', 'Philip K.', 'Dick', STR_TO_DATE('1/13/1953','%m/%d/%Y'), STR_TO_DATE('9/1/1953','%m/%d/%Y'), NULL, 12, NULL, 'https://1999pkdweb.philipdick.com/The%20Trouble%20With%20Bubbles.htm', 0);

INSERT INTO `titles` (`titleID`, `titleName`, `titleSort`, `titleURL`, `authorFirstName`, `authorLastName`, `submissionDate`, `publicationDate`, `imageName`, `categoryID`, `shortDescription`, `urlPKDWeb`, `active`) VALUES
(321, 'The Turning Wheel', 'turning wheel, the', 'The-Turning-Wheel', 'Philip K.', 'Dick', STR_TO_DATE('7/8/1953','%m/%d/%Y'), STR_TO_DATE('1/1/1954','%m/%d/%Y'), NULL, 12, NULL, 'https://1999pkdweb.philipdick.com/The%20Turning%20Wheel.htm', 0);

INSERT INTO `titles` (`titleID`, `titleName`, `titleSort`, `titleURL`, `authorFirstName`, `authorLastName`, `submissionDate`, `publicationDate`, `imageName`, `categoryID`, `shortDescription`, `urlPKDWeb`, `active`) VALUES
(340, 'The Unreconstructed M', 'unreconstructed m, the', 'The-Unreconstructed-M', 'Philip K.', 'Dick', STR_TO_DATE('6/2/1955','%m/%d/%Y'), STR_TO_DATE('1/1/1957','%m/%d/%Y'), NULL, 12, NULL, 'https://1999pkdweb.philipdick.com/The%20Unreconstructed%20M.htm', 0);

INSERT INTO `titles` (`titleID`, `titleName`, `titleSort`, `titleURL`, `authorFirstName`, `authorLastName`, `submissionDate`, `publicationDate`, `imageName`, `categoryID`, `shortDescription`, `urlPKDWeb`, `active`) VALUES
(358, 'The Unteleported Man', 'unteleported man, the', 'The-Unteleported-Man', 'Philip K.', 'Dick', NULL, NULL, NULL, 12, NULL, 'https://1999pkdweb.philipdick.com/The%20Unteleported%20Man.htm', 0);

INSERT INTO `titles` (`titleID`, `titleName`, `titleSort`, `titleURL`, `authorFirstName`, `authorLastName`, `submissionDate`, `publicationDate`, `imageName`, `categoryID`, `shortDescription`, `urlPKDWeb`, `active`) VALUES
(268, 'The Variable Man', 'variable man, the', 'The-Variable-Man', 'Philip K.', 'Dick', NULL, STR_TO_DATE('7/1/1953','%m/%d/%Y'), NULL, 12, NULL, 'https://1999pkdweb.philipdick.com/THE%20VARIABLE%20MAN.htm', 0);

INSERT INTO `titles` (`titleID`, `titleName`, `titleSort`, `titleURL`, `authorFirstName`, `authorLastName`, `submissionDate`, `publicationDate`, `imageName`, `categoryID`, `shortDescription`, `urlPKDWeb`, `active`) VALUES
(359, 'The War with the Fnools', 'war with the fnools, the', 'The-War-With-The-Fnools', 'Philip K.', 'Dick', NULL, STR_TO_DATE('3/1/1964','%m/%d/%Y'), NULL, 12, NULL, 'https://1999pkdweb.philipdick.com/The%20War%20With%20The%20Fnools.htm', 0);

INSERT INTO `titles` (`titleID`, `titleName`, `titleSort`, `titleURL`, `authorFirstName`, `authorLastName`, `submissionDate`, `publicationDate`, `imageName`, `categoryID`, `shortDescription`, `urlPKDWeb`, `active`) VALUES
(296, 'The World She Wanted', 'world she wanted, the', 'The-World-She-Wanted', 'Philip K.', 'Dick', STR_TO_DATE('11/24/1952','%m/%d/%Y'), STR_TO_DATE('5/1/1953','%m/%d/%Y'), NULL, 12, NULL, 'https://1999pkdweb.philipdick.com/The%20World%20She%20Wanted.htm', 0);

INSERT INTO `titles` (`titleID`, `titleName`, `titleSort`, `titleURL`, `authorFirstName`, `authorLastName`, `submissionDate`, `publicationDate`, `imageName`, `categoryID`, `shortDescription`, `urlPKDWeb`, `active`) VALUES
(320, 'Time Pawn', 'time pawn', 'Time-Pawn', 'Philip K.', 'Dick', NULL, NULL, NULL, 12, NULL, 'https://1999pkdweb.philipdick.com/Time%20Pawn.htm', 0);

INSERT INTO `titles` (`titleID`, `titleName`, `titleSort`, `titleURL`, `authorFirstName`, `authorLastName`, `submissionDate`, `publicationDate`, `imageName`, `categoryID`, `shortDescription`, `urlPKDWeb`, `active`) VALUES
(338, 'To Serve the Master', 'to serve the master', 'To-Serve-The-Master', 'Philip K.', 'Dick', STR_TO_DATE('10/21/1953','%m/%d/%Y'), STR_TO_DATE('2/1/1956','%m/%d/%Y'), NULL, 12, NULL, 'https://1999pkdweb.philipdick.com/To%20Serve%20The%20Master.htm', 0);

INSERT INTO `titles` (`titleID`, `titleName`, `titleSort`, `titleURL`, `authorFirstName`, `authorLastName`, `submissionDate`, `publicationDate`, `imageName`, `categoryID`, `shortDescription`, `urlPKDWeb`, `active`) VALUES
(294, 'Tony and the Beetles', 'tony and the beetles', 'Tony-And-The-Beetles', 'Philip K.', 'Dick', STR_TO_DATE('8/31/1953','%m/%d/%Y'), STR_TO_DATE('1/1/1953','%m/%d/%Y'), NULL, 12, NULL, 'https://1999pkdweb.philipdick.com/Tony%20And%20The%20Beetles.htm', 0);

INSERT INTO `titles` (`titleID`, `titleName`, `titleSort`, `titleURL`, `authorFirstName`, `authorLastName`, `submissionDate`, `publicationDate`, `imageName`, `categoryID`, `shortDescription`, `urlPKDWeb`, `active`) VALUES
(334, 'Vulcan''s Hammer', 'vulcan''s hammer', 'Vulcan-s-Hammer', 'Philip K.', 'Dick', NULL, NULL, NULL, 12, NULL, 'https://1999pkdweb.philipdick.com/VULCANS%20HAMMER.htm', 0);

INSERT INTO `titles` (`titleID`, `titleName`, `titleSort`, `titleURL`, `authorFirstName`, `authorLastName`, `submissionDate`, `publicationDate`, `imageName`, `categoryID`, `shortDescription`, `urlPKDWeb`, `active`) VALUES
(345, 'War Game', 'war game', 'War-Game', 'Philip K.', 'Dick', STR_TO_DATE('10/31/1958','%m/%d/%Y'), STR_TO_DATE('12/1/1959','%m/%d/%Y'), NULL, 12, NULL, 'https://1999pkdweb.philipdick.com/War%20Game.htm', 0);

INSERT INTO `titles` (`titleID`, `titleName`, `titleSort`, `titleURL`, `authorFirstName`, `authorLastName`, `submissionDate`, `publicationDate`, `imageName`, `categoryID`, `shortDescription`, `urlPKDWeb`, `active`) VALUES
(335, 'War Veteran', 'war veteran', 'War-Veteran', 'Philip K.', 'Dick', STR_TO_DATE('2/17/1954','%m/%d/%Y'), STR_TO_DATE('3/1/1955','%m/%d/%Y'), NULL, 12, NULL, 'https://1999pkdweb.philipdick.com/War%20Veteran.htm', 0);

INSERT INTO `titles` (`titleID`, `titleName`, `titleSort`, `titleURL`, `authorFirstName`, `authorLastName`, `submissionDate`, `publicationDate`, `imageName`, `categoryID`, `shortDescription`, `urlPKDWeb`, `active`) VALUES
(360, 'Waterspider', 'waterspider', 'Waterspider', 'Philip K.', 'Dick', STR_TO_DATE('4/10/1963','%m/%d/%Y'), STR_TO_DATE('1/1/1964','%m/%d/%Y'), NULL, 12, NULL, 'https://1999pkdweb.philipdick.com/Waterspider.htm', 0);

INSERT INTO `titles` (`titleID`, `titleName`, `titleSort`, `titleURL`, `authorFirstName`, `authorLastName`, `submissionDate`, `publicationDate`, `imageName`, `categoryID`, `shortDescription`, `urlPKDWeb`, `active`) VALUES
(365, 'We Can Remember It for You Wholesale', 'we can remember it for you wholesale', 'We-Can-Remember-It-For-You-Wholesale', 'Philip K.', 'Dick', NULL, NULL, NULL, 12, NULL, 'https://1999pkdweb.philipdick.com/We%20Can%20Remember%20It%20For%20You%20Wholesale.htm', 0);

INSERT INTO `titles` (`titleID`, `titleName`, `titleSort`, `titleURL`, `authorFirstName`, `authorLastName`, `submissionDate`, `publicationDate`, `imageName`, `categoryID`, `shortDescription`, `urlPKDWeb`, `active`) VALUES
(361, 'What the Dead Men Say', 'what the dead men say', 'What-The-Dead-Men-Say', 'Philip K.', 'Dick', STR_TO_DATE('4/15/1963','%m/%d/%Y'), STR_TO_DATE('6/1/1964','%m/%d/%Y'), NULL, 12, NULL, 'https://1999pkdweb.philipdick.com/What%20The%20Dead%20Men%20Say.htm', 0);

INSERT INTO `titles` (`titleID`, `titleName`, `titleSort`, `titleURL`, `authorFirstName`, `authorLastName`, `submissionDate`, `publicationDate`, `imageName`, `categoryID`, `shortDescription`, `urlPKDWeb`, `active`) VALUES
(350, 'What''ll We Do With Ragland Park?', 'what''ll we do with ragland park?', 'What-ll-We-Do-With-Ragland-Park-', 'Philip K.', 'Dick', STR_TO_DATE('4/29/1963','%m/%d/%Y'), STR_TO_DATE('11/1/1963','%m/%d/%Y'), NULL, 12, NULL, 'https://1999pkdweb.philipdick.com/Whatll%20We%20Do%20With%20Ragland%20Park.htm', 0);

INSERT INTO `titles` (`titleID`, `titleName`, `titleSort`, `titleURL`, `authorFirstName`, `authorLastName`, `submissionDate`, `publicationDate`, `imageName`, `categoryID`, `shortDescription`, `urlPKDWeb`, `active`) VALUES
(366, 'Your Appointment Will Be Yesterday', 'your appointment will be yesterday', 'Your-Appointment-Will-Be-Yesterday', 'Philip K.', 'Dick', STR_TO_DATE('8/27/1965','%m/%d/%Y'), STR_TO_DATE('8/1/1966','%m/%d/%Y'), NULL, 12, NULL, 'https://1999pkdweb.philipdick.com/Your%20Appointment%20Will%20Be%20Yesterday.htm', 0);




-- 320 Time Pawn
-- 334 Vulcan's Hammer
-- 336 A Glass of Darkness
-- 346 All We Marsmen
-- 351 Cantata-140
-- 358 The Unteleported Man
-- 362 Project Plowshare
-- 365 We Can Remember It For You Wholesale 09/13/1965, 04/01/1966
-- 371 A. Lincoln, Simulacrum
-- 374 The Different Stages of Love
-- 383 The Day Mr. Computer Fell Out of Its Tree
-- 385 Fawn, Look Back
-- 386 Stability
-- 387 Goodbye, Vincent
-- 388 Menace React

-- 320 Time Pawn
-- 334 Vulcan's Hammer
-- 336 A Glass of Darkness
-- 346 All We Marsmen
-- 351 Cantata-140
-- 358 The Unteleported Man
-- 362 Project Plowshare
-- 371 A. Lincoln, Simulacrum

-- add written date
-- manascript submit date
-- publishdate

-- manuscript title

-- add term sort
