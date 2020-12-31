-- MySQL dump 10.13  Distrib 5.7.30, for macos10.14 (x86_64)
--
-- Host: localhost    Database: showcard
-- ------------------------------------------------------
-- Server version	5.7.30

/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8 */;
/*!40103 SET @OLD_TIME_ZONE=@@TIME_ZONE */;
/*!40103 SET TIME_ZONE='+00:00' */;
/*!40014 SET @OLD_UNIQUE_CHECKS=@@UNIQUE_CHECKS, UNIQUE_CHECKS=0 */;
/*!40014 SET @OLD_FOREIGN_KEY_CHECKS=@@FOREIGN_KEY_CHECKS, FOREIGN_KEY_CHECKS=0 */;
/*!40101 SET @OLD_SQL_MODE=@@SQL_MODE, SQL_MODE='NO_AUTO_VALUE_ON_ZERO' */;
/*!40111 SET @OLD_SQL_NOTES=@@SQL_NOTES, SQL_NOTES=0 */;

--
-- Table structure for table `asset`
--

DROP TABLE IF EXISTS `asset`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `asset` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `title` varchar(255) DEFAULT NULL,
  `file_format` varchar(10) DEFAULT NULL,
  `category` varchar(30) DEFAULT NULL,
  `width` int(11) DEFAULT NULL,
  `height` int(11) DEFAULT NULL,
  `left_position` int(11) DEFAULT NULL,
  `top_position` int(11) DEFAULT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=39 DEFAULT CHARSET=utf8;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `asset`
--

LOCK TABLES `asset` WRITE;
/*!40000 ALTER TABLE `asset` DISABLE KEYS */;
INSERT INTO `asset` VALUES (1,'color_background_1','.png','background',540,540,0,0),(2,'color_background_2','.png','background',540,540,0,0),(3,'color_background_3','.png','background',540,540,0,0),(4,'color_background_4','.png','background',540,540,0,0),(5,'color_background_5','.png','background',540,540,0,0),(6,'color_background_6','.png','background',540,540,0,0),(7,'background_1','.jpg','background',540,540,0,0),(8,'background_2','.jpg','background',540,540,0,0),(9,'background_3','.jpg','background',540,540,0,0),(10,'background_4','.jpg','background',540,540,0,0),(11,'background_5','.jpg','background',540,540,0,0),(12,'background_6','.jpg','background',540,540,0,0),(13,'background_7','.jpg','background',540,540,0,0),(14,'background_8','.jpg','background',540,540,0,0),(15,'background_9','.jpg','background',540,540,0,0),(16,'background_10','.jpg','background',540,540,0,0),(17,'background_11','.jpg','background',540,540,0,0),(18,'background_12','.jpg','background',540,540,0,0),(19,'christmas_hat','.png','icon',256,256,150,150),(20,'mistletoe','.png','icon',256,256,150,150),(21,'christmas_presents','.png','icon',400,400,70,100),(22,'christmas_sock','.png','icon',256,256,150,150),(23,'candy_cane','.png','icon',256,256,150,150),(24,'gingerbread_man','.png','icon',256,256,150,150),(25,'santa_claus_1','.png','icon',400,400,70,100),(26,'santa_claus_2','.png','icon',400,400,70,100),(27,'christmas_decoration_border','.png','icon',524,245,8,20),(28,'christmas_light_border','.png','icon',520,100,10,20),(29,'heart','.png','icon',300,300,120,120),(30,'plane','.png','icon',256,256,140,140),(31,'sun','.png','icon',300,300,120,120),(32,'humanity','.png','icon',450,450,40,40),(33,'beach','.png','icon',400,400,70,70),(34,'mountain','.png','icon',450,450,45,45),(35,'photo','.png','icon',300,300,120,120),(36,'camera','.png','icon',256,256,140,140),(37,'trophy','.png','icon',300,300,120,120),(38,'leaf','.png','icon',300,300,120,120);
/*!40000 ALTER TABLE `asset` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `canvas_done`
--

DROP TABLE IF EXISTS `canvas_done`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `canvas_done` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `card_id` varchar(255) DEFAULT NULL,
  `user_id` int(11) DEFAULT NULL,
  `action` varchar(255) DEFAULT NULL,
  `obj_id` varchar(255) DEFAULT NULL,
  `obj_type` varchar(255) DEFAULT NULL,
  `object` longtext,
  `is_background` tinyint(1) DEFAULT NULL,
  PRIMARY KEY (`id`),
  KEY `card_id` (`card_id`),
  KEY `user_id` (`user_id`),
  CONSTRAINT `canvas_done_ibfk_1` FOREIGN KEY (`card_id`) REFERENCES `card` (`id`) ON DELETE CASCADE,
  CONSTRAINT `canvas_done_ibfk_2` FOREIGN KEY (`user_id`) REFERENCES `user` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `canvas_done`
--

LOCK TABLES `canvas_done` WRITE;
/*!40000 ALTER TABLE `canvas_done` DISABLE KEYS */;
/*!40000 ALTER TABLE `canvas_done` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `canvas_undo`
--

DROP TABLE IF EXISTS `canvas_undo`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `canvas_undo` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `card_id` varchar(255) DEFAULT NULL,
  `user_id` int(11) DEFAULT NULL,
  `action` varchar(255) DEFAULT NULL,
  `obj_id` varchar(255) DEFAULT NULL,
  `obj_type` varchar(255) DEFAULT NULL,
  `object` longtext,
  `is_background` tinyint(1) DEFAULT NULL,
  PRIMARY KEY (`id`),
  KEY `card_id` (`card_id`),
  KEY `user_id` (`user_id`),
  CONSTRAINT `canvas_undo_ibfk_1` FOREIGN KEY (`card_id`) REFERENCES `card` (`id`) ON DELETE CASCADE,
  CONSTRAINT `canvas_undo_ibfk_2` FOREIGN KEY (`user_id`) REFERENCES `user` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `canvas_undo`
--

LOCK TABLES `canvas_undo` WRITE;
/*!40000 ALTER TABLE `canvas_undo` DISABLE KEYS */;
/*!40000 ALTER TABLE `canvas_undo` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `card`
--

DROP TABLE IF EXISTS `card`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `card` (
  `id` varchar(255) NOT NULL,
  `owner` int(11) DEFAULT NULL,
  `title` varchar(255) DEFAULT NULL,
  `created_at` bigint(20) DEFAULT NULL,
  `saved_at` bigint(20) DEFAULT NULL,
  `shared` tinyint(1) DEFAULT NULL,
  `picture` varchar(255) DEFAULT NULL,
  PRIMARY KEY (`id`),
  KEY `owner` (`owner`),
  CONSTRAINT `card_ibfk_1` FOREIGN KEY (`owner`) REFERENCES `user` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `card`
--

LOCK TABLES `card` WRITE;
/*!40000 ALTER TABLE `card` DISABLE KEYS */;
/*!40000 ALTER TABLE `card` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `user`
--

DROP TABLE IF EXISTS `user`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `user` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `provider` varchar(255) DEFAULT NULL,
  `email` varchar(255) NOT NULL,
  `name` varchar(255) DEFAULT NULL,
  `password` varchar(255) DEFAULT NULL,
  `created_at` bigint(20) DEFAULT NULL,
  `active` tinyint(1) DEFAULT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `email` (`email`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `user`
--

LOCK TABLES `user` WRITE;
/*!40000 ALTER TABLE `user` DISABLE KEYS */;
/*!40000 ALTER TABLE `user` ENABLE KEYS */;
UNLOCK TABLES;
/*!40103 SET TIME_ZONE=@OLD_TIME_ZONE */;

/*!40101 SET SQL_MODE=@OLD_SQL_MODE */;
/*!40014 SET FOREIGN_KEY_CHECKS=@OLD_FOREIGN_KEY_CHECKS */;
/*!40014 SET UNIQUE_CHECKS=@OLD_UNIQUE_CHECKS */;
/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
/*!40111 SET SQL_NOTES=@OLD_SQL_NOTES */;

-- Dump completed on 2020-12-31 12:01:13
