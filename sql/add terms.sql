
-- SELECT TOP (1000) [titleID]
--       ,[titleName]
--       ,[titleSort]
--       ,[titleURL]
--       ,[authorFirstName]
--       ,[authorLastName]
--       ,[submissionDate]
--       ,[publicationDate]
--       ,[imageName]
--       ,[categoryID]
--       ,[shortDescription]
--       ,[urlPKDweb]
--       ,[active]
--       ,[createDate]
--       ,[updateDate]
--   FROM [pkd-and-me].[dbo].[titles]
--   WHERE authorFirstName like '%Philip K.%' AND categoryID in (1, 12)
--   ORDER BY titleName

-- [^a-zA-Z]autofac[^a-zA-Z]

-- SELECT term, titleName FROM terms
-- LEFT OUTER JOIN termsCategories ON terms.termID = termsCategories.termID
-- LEFT OUTER JOIN termCategories ON termsCategories.termCategoryID = termCategories.termCategoryID
-- LEFT OUTER JOIN synonyms ON terms.termID = synonyms.termID
-- LEFT OUTER JOIN alternateForms ON terms.termID = alternateForms.termID
-- LEFT OUTER JOIN termsTitles ON terms.termID = termsTitles.termID
-- LEFT OUTER JOIN titles ON termsTitles.titleID = titles.titleID

-- SELECT terms.termID, terms.term, terms.definition, terms.partOfSpeech, terms.parentTermID, termCategories.termCategoryID, termCategories.termCategory, synonyms.termID, synonyms.synonymID, alternateForms.termID, alternateForms.alternateFormID, titles.titleID, titles.titleName, titles.titleSort, titles.titleURL, titles.authorFirstName, titles.authorLastName, titles.submissionDate, titles.publicationDate, titles.imageName, titles.categoryID, titles.shortDescription, titles.urlPKDWeb FROM terms
-- LEFT OUTER JOIN termsCategories ON terms.termID = termsCategories.termID
-- LEFT OUTER JOIN termCategories ON termsCategories.termCategoryID = termCategories.termCategoryID
-- LEFT OUTER JOIN synonyms ON terms.termID = synonyms.termID
-- LEFT OUTER JOIN alternateForms ON terms.termID = alternateForms.termID
-- LEFT OUTER JOIN termsTitles ON terms.termID = termsTitles.termID
-- LEFT OUTER JOIN titles ON termsTitles.titleID = titles.titleID

-- SELECT terms.termID, terms.term, terms.definition, terms.partOfSpeech,
-- terms.parentTermID, termsParent.term AS termParent,
-- termCategories.termCategoryID, termCategories.termCategory,
-- synonyms.synonymID, termsSynonyms.term AS termsSynonym,
-- alternateForms.alternateFormID, termsAlternateForms.term AS termsAlternateForm,
-- titles.titleID, titles.titleName, titles.titleSort, titles.titleURL, titles.authorFirstName, titles.authorLastName, titles.submissionDate, titles.publicationDate, titles.imageName, titles.categoryID, titles.shortDescription, titles.urlPKDWeb
-- FROM terms
-- LEFT OUTER JOIN terms AS termsParent ON terms.parentTermID = termsParent.termID
-- LEFT OUTER JOIN termsCategories ON terms.termID = termsCategories.termID
-- LEFT OUTER JOIN termCategories ON termsCategories.termCategoryID = termCategories.termCategoryID
-- LEFT OUTER JOIN synonyms ON terms.termID = synonyms.termID
-- LEFT OUTER JOIN terms AS termsSynonyms ON synonyms.synonymID = termsSynonyms.termID
-- LEFT OUTER JOIN alternateForms ON terms.termID = alternateForms.termID
-- LEFT OUTER JOIN terms AS termsAlternateForms ON alternateForms.alternateFormID = termsAlternateForms.termID
-- LEFT OUTER JOIN termsTitles ON terms.termID = termsTitles.termID
-- LEFT OUTER JOIN titles ON termsTitles.titleID = titles.titleID

CREATE TABLE `terms` (
  `termID` int NOT NULL,
  `term` varchar(255) NOT NULL,
-- pronounce
-- alternate forms / parent term / related to the same table?
	`alternateForms` varchar(500) NULL,
  `definition` text, -- multiple?
	`partOfSpeech` varchar(200) NULL,
-- category: technology, curse word, etc.
-- `termCategoryID` int NULL,
	`parentTermID` int NULL,
  `active` tinyint(1) NOT NULL DEFAULT '1',
  `createDate` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `updateDate` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;


CREATE TABLE `termsTitles` (
  `termID` int NOT NULL,
  `titleID` int NOT NULL,
-- quotation with the word
  `quotation` text, -- multiple?
  `createDate` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

CREATE TABLE `termCategories` (
  `termCategoryID` int NOT NULL,
  `termCategory` varchar(255) NOT NULL,
  `active` tinyint(1) NOT NULL DEFAULT '1',
  `createDate` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `updateDate` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

CREATE TABLE `termsCategories` (
  `termID` int NOT NULL,
  `termCategoryID` int NOT NULL,
  `createDate` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

-- synonyms relate back to a parent definition?
-- would synonyms have a slightly different definition?
CREATE TABLE `synonyms` (
  `termID` int NOT NULL,
  `synonymID` int NOT NULL,
  `createDate` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;


-- alternateForms relate back to a parent definition?
CREATE TABLE `alternateForms` (
  `termID` int NOT NULL,
  `alternateFormID` int NOT NULL,
  `createDate` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;


--
-- Indexes for table `terms`
--
ALTER TABLE `terms`
  ADD PRIMARY KEY (`termID`);

--
-- AUTO_INCREMENT for table `terms`
--
ALTER TABLE `terms`
  MODIFY `termID` int NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=21;

--
-- Indexes for table `termCategories`
--
ALTER TABLE `termCategories`
  ADD PRIMARY KEY (`termCategoryID`);

--
-- AUTO_INCREMENT for table `termCategories`
--
ALTER TABLE `termCategories`
  MODIFY `termCategoryID` int NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=21;




ALTER TABLE [dbo].[terms] DROP CONSTRAINT [DF_terms_createDate]
GO
ALTER TABLE [dbo].[terms] DROP CONSTRAINT [DF_terms_updateDate]
GO
ALTER TABLE [dbo].[terms] DROP CONSTRAINT [DF_terms_active]
GO
ALTER TABLE [dbo].[termsCategories] DROP CONSTRAINT [DF_termsCategories_createDate]
GO
ALTER TABLE [dbo].[termCategories] DROP CONSTRAINT [DF_termCategories_createDate]
GO
ALTER TABLE [dbo].[termCategories] DROP CONSTRAINT [DF_termCategories_updateDate]
GO
ALTER TABLE [dbo].[termCategories] DROP CONSTRAINT [DF_termCategories_active]
GO
ALTER TABLE [dbo].[termsTitles] DROP CONSTRAINT [DF_termsTitles_createDate]
GO
ALTER TABLE [dbo].[synonyms] DROP CONSTRAINT [DF_synonyms_createDate]
GO
ALTER TABLE [dbo].[alternateForms] DROP CONSTRAINT [DF_alternateForms_createDate]
GO
IF  EXISTS (SELECT * FROM sys.objects WHERE object_id = OBJECT_ID(N'[dbo].[terms]') AND type in (N'U'))
DROP TABLE [dbo].[terms]
GO
IF  EXISTS (SELECT * FROM sys.objects WHERE object_id = OBJECT_ID(N'[dbo].[termsCategories]') AND type in (N'U'))
DROP TABLE [dbo].[termsCategories]
GO
IF  EXISTS (SELECT * FROM sys.objects WHERE object_id = OBJECT_ID(N'[dbo].[termCategories]') AND type in (N'U'))
DROP TABLE [dbo].[termCategories]
GO
IF  EXISTS (SELECT * FROM sys.objects WHERE object_id = OBJECT_ID(N'[dbo].[termsTitles]') AND type in (N'U'))
DROP TABLE [dbo].[termsTitles]
GO
IF  EXISTS (SELECT * FROM sys.objects WHERE object_id = OBJECT_ID(N'[dbo].[synonyms]') AND type in (N'U'))
DROP TABLE [dbo].[synonyms]
GO
IF  EXISTS (SELECT * FROM sys.objects WHERE object_id = OBJECT_ID(N'[dbo].[alternateForms]') AND type in (N'U'))
DROP TABLE [dbo].[alternateForms]
GO
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
CREATE TABLE [dbo].[terms](
	[termID] [int] IDENTITY(1,1) NOT NULL,
	[term] [varchar](200) NULL,
	[alternateForms] [varchar](500) NULL,
  [definition] [nvarchar](max) NULL,
	[partOfSpeech] [varchar](200) NULL,
	-- [termCategoryID] [int] NULL,
	[parentTermID] [int] NULL,
	[active] [bit] NOT NULL,
	[createDate] [datetime] NULL,
	[updateDate] [datetime] NULL
) ON [PRIMARY] TEXTIMAGE_ON [PRIMARY]
GO
ALTER TABLE [dbo].[terms] ADD  CONSTRAINT [DF_terms_createDate]  DEFAULT (getdate()) FOR [createDate]
GO
ALTER TABLE [dbo].[terms] ADD  CONSTRAINT [DF_terms_updateDate]  DEFAULT (getdate()) FOR [updateDate]
GO
ALTER TABLE [dbo].[terms] ADD  CONSTRAINT [DF_terms_active]  DEFAULT ((1)) FOR [active]
GO
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
CREATE TABLE [dbo].[termCategories](
	[termCategoryID] [int] IDENTITY(1,1) NOT NULL,
	[termCategory] [varchar](200) NULL,
	[active] [bit] NOT NULL,
	[createDate] [datetime] NULL,
	[updateDate] [datetime] NULL
) ON [PRIMARY]
GO
ALTER TABLE [dbo].[termCategories] ADD  CONSTRAINT [DF_termCategories_createDate]  DEFAULT (getdate()) FOR [createDate]
GO
ALTER TABLE [dbo].[termCategories] ADD  CONSTRAINT [DF_termCategories_updateDate]  DEFAULT (getdate()) FOR [updateDate]
GO
ALTER TABLE [dbo].[termCategories] ADD  CONSTRAINT [DF_termCategories_active]  DEFAULT ((1)) FOR [active]
GO
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
CREATE TABLE [dbo].[termsCategories](
	[termID] [int] NOT NULL,
	[termCategoryID] [int] NOT NULL,
  [createDate] [datetime] NULL
) ON [PRIMARY]
GO
ALTER TABLE [dbo].[termsCategories] ADD  CONSTRAINT [DF_termsCategories_createDate]  DEFAULT (getdate()) FOR [createDate]
GO
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
CREATE TABLE [dbo].[termsTitles](
	[termID] [int] NOT NULL,
	[titleID] [int] NOT NULL,
  [quotation] [nvarchar](max) NULL,
  [createDate] [datetime] NULL
) ON [PRIMARY]
GO
ALTER TABLE [dbo].[termsTitles] ADD  CONSTRAINT [DF_termsTitles_createDate]  DEFAULT (getdate()) FOR [createDate]
GO
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
CREATE TABLE [dbo].[synonyms](
	[termID] [int] NOT NULL,
	[synonymID] [int] NOT NULL,
  [createDate] [datetime] NULL
) ON [PRIMARY]
GO
ALTER TABLE [dbo].[synonyms] ADD  CONSTRAINT [DF_synonyms_createDate]  DEFAULT (getdate()) FOR [createDate]
GO
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
CREATE TABLE [dbo].[alternateForms](
	[termID] [int] NOT NULL,
	[alternateFormID] [int] NOT NULL,
  [createDate] [datetime] NULL
) ON [PRIMARY]
GO
ALTER TABLE [dbo].[alternateForms] ADD  CONSTRAINT [DF_alternateForms_createDate]  DEFAULT (getdate()) FOR [createDate]
GO










INSERT synonyms (termID, synonymID) VALUES (1, 2);
INSERT synonyms (termID, synonymID) VALUES (1, 3);
INSERT synonyms (termID, synonymID) VALUES (2, 1);
INSERT synonyms (termID, synonymID) VALUES (2, 3);
INSERT synonyms (termID, synonymID) VALUES (3, 1);
INSERT synonyms (termID, synonymID) VALUES (3, 2);

INSERT alternateForms (termID, alternateFormID) VALUES (1, 2);
INSERT alternateForms (termID, alternateFormID) VALUES (1, 3);

INSERT termCategories (termCategoryID, termCategory, active) VALUES (1, N'Technology', 1);

INSERT termsCategories (termID, termCategoryID) VALUES (1, 1);
INSERT termsCategories (termID, termCategoryID) VALUES (2, 1);
INSERT termsCategories (termID, termCategoryID) VALUES (3, 1);
INSERT termsCategories (termID, termCategoryID) VALUES (5, 1);
INSERT termsCategories (termID, termCategoryID) VALUES (6, 1);

INSERT terms (termID, term, alternateForms, definition, partOfSpeech, termCategoryID, parentTermID, active) VALUES (1, N'homeopape', N'''pape, pape', N'newspaper', N'noun', 1, NULL, 1);
INSERT terms (termID, term, alternateForms, definition, partOfSpeech, termCategoryID, parentTermID, active) VALUES (2, N'''pape', N'pape', N'abbreviation of homeopape', N'noun', 1, 1, 1);
INSERT terms (termID, term, alternateForms, definition, partOfSpeech, termCategoryID, parentTermID, active) VALUES (3, N'pape', N'''pape', N'abbreviation of homeopape', N'noun', 1, 1, 1);
INSERT terms (termID, term, alternateForms, definition, partOfSpeech, termCategoryID, parentTermID, active) VALUES (4, N'conapt', NULL, N'condominium apartment', N'noun', NULL, NULL, 1);
INSERT terms (termID, term, alternateForms, definition, partOfSpeech, termCategoryID, parentTermID, active) VALUES (5, N'artiforg', NULL, N'artificial organ', N'noun', 1, NULL, 1);
INSERT terms (termID, term, alternateForms, definition, partOfSpeech, termCategoryID, parentTermID, active) VALUES (6, N'autofac', NULL, N'automatic factory', N'noun', 1, NULL, 1);

INSERT termsTitles (termID, titleID) VALUES (1, 27);
INSERT termsTitles (termID, titleID) VALUES (2, 27);
INSERT termsTitles (termID, titleID) VALUES (1, 15);
INSERT termsTitles (termID, titleID) VALUES (1, 2);
INSERT termsTitles (termID, titleID) VALUES (1, 9);
INSERT termsTitles (termID, titleID) VALUES (1, 6);
INSERT termsTitles (termID, titleID) VALUES (1, 186);
INSERT termsTitles (termID, titleID) VALUES (1, 29);
INSERT termsTitles (termID, titleID) VALUES (1, 35);
INSERT termsTitles (termID, titleID) VALUES (1, 45);
INSERT termsTitles (termID, titleID) VALUES (1, 38);
INSERT termsTitles (termID, titleID) VALUES (1, 39);
INSERT termsTitles (termID, titleID) VALUES (2, 19);
INSERT termsTitles (termID, titleID) VALUES (2, 35);
INSERT termsTitles (termID, titleID) VALUES (2, 2);
INSERT termsTitles (termID, titleID) VALUES (2, 5);
INSERT termsTitles (termID, titleID) VALUES (2, 45);
INSERT termsTitles (termID, titleID) VALUES (2, 38);
INSERT termsTitles (termID, titleID) VALUES (3, 27);
INSERT termsTitles (termID, titleID) VALUES (3, 6);
INSERT termsTitles (termID, titleID) VALUES (3, 39);
INSERT termsTitles (termID, titleID) VALUES (5, 27);
INSERT termsTitles (termID, titleID) VALUES (5, 29);
INSERT termsTitles (termID, titleID) VALUES (6, 2);
INSERT termsTitles (termID, titleID) VALUES (6, 7);
INSERT termsTitles (termID, titleID) VALUES (6, 9);
INSERT termsTitles (termID, titleID) VALUES (6, 19);
INSERT termsTitles (termID, titleID) VALUES (6, 27);
INSERT termsTitles (termID, titleID) VALUES (6, 6);
INSERT termsTitles (termID, titleID) VALUES (6, 15);
INSERT termsTitles (termID, titleID) VALUES (6, 21);
INSERT termsTitles (termID, titleID) VALUES (6, 29);
INSERT termsTitles (termID, titleID) VALUES (6, 35);
INSERT termsTitles (termID, titleID) VALUES (6, 45);
INSERT termsTitles (termID, titleID) VALUES (4, 2);
INSERT termsTitles (termID, titleID) VALUES (4, 5);
INSERT termsTitles (termID, titleID) VALUES (4, 8);
INSERT termsTitles (termID, titleID) VALUES (4, 19);
INSERT termsTitles (termID, titleID) VALUES (4, 27);
INSERT termsTitles (termID, titleID) VALUES (4, 6);
INSERT termsTitles (termID, titleID) VALUES (4, 15);
INSERT termsTitles (termID, titleID) VALUES (4, 29);
INSERT termsTitles (termID, titleID) VALUES (4, 33);
INSERT termsTitles (termID, titleID) VALUES (4, 35);
INSERT termsTitles (termID, titleID) VALUES (4, 45);
INSERT termsTitles (termID, titleID) VALUES (4, 38);
INSERT termsTitles (termID, titleID) VALUES (4, 39);
INSERT termsTitles (termID, titleID) VALUES (6, 323);
INSERT termsTitles (termID, titleID) VALUES (4, 367);
INSERT termsTitles (termID, titleID) VALUES (4, 364);
INSERT termsTitles (termID, titleID) VALUES (4, 357);
INSERT termsTitles (termID, titleID) VALUES (4, 363);
INSERT termsTitles (termID, titleID) VALUES (4, 368);
INSERT termsTitles (termID, titleID) VALUES (4, 383);
INSERT termsTitles (termID, titleID) VALUES (4, 365);
INSERT termsTitles (termID, titleID) VALUES (1, 348);
INSERT termsTitles (termID, titleID) VALUES (1, 357);
INSERT termsTitles (termID, titleID) VALUES (1, 363);
INSERT termsTitles (termID, titleID) VALUES (1, 350);
INSERT termsTitles (termID, titleID) VALUES (3, 348);
