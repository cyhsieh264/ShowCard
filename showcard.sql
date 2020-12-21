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
  `member_count` int(11) DEFAULT NULL,
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
-- Table structure for table `template`
--

DROP TABLE IF EXISTS `template`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `template` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `title` varchar(255) DEFAULT NULL,
  `objects` longtext,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=3 DEFAULT CHARSET=utf8;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `template`
--

LOCK TABLES `template` WRITE;
/*!40000 ALTER TABLE `template` DISABLE KEYS */;
INSERT INTO `template` VALUES (1,'Santa Claus On The Way','\"[\'{\"type\":\"image\",\"version\":\"4.2.0\",\"originX\":\"left\",\"originY\":\"top\",\"left\":0,\"top\":0,\"width\":540,\"height\":540,\"fill\":\"rgb(0,0,0)\",\"stroke\":null,\"strokeWidth\":0,\"strokeDashArray\":null,\"strokeLineCap\":\"butt\",\"strokeDashOffset\":0,\"strokeLineJoin\":\"miter\",\"strokeMiterLimit\":4,\"scaleX\":1,\"scaleY\":1,\"angle\":0,\"flipX\":false,\"flipY\":false,\"opacity\":1,\"shadow\":null,\"visible\":true,\"backgroundColor\":\"\",\"fillRule\":\"nonzero\",\"paintFirst\":\"fill\",\"globalCompositeOperation\":\"source-over\",\"skewX\":0,\"skewY\":0,\"evented\":false,\"selectable\":true,\"objId\":\"r68z16iddato6mm\",\"user\":\"admin\",\"isBackground\":true,\"src\":\"http://localhost:3000/images/assets/backgrounds/color_background_2.png\",\"crossOrigin\":null,\"filters\":[]}\', \'{\"type\":\"image\",\"version\":\"4.2.0\",\"originX\":\"left\",\"originY\":\"top\",\"left\":291.07,\"top\":295.07,\"width\":400,\"height\":400,\"fill\":\"rgb(0,0,0)\",\"stroke\":null,\"strokeWidth\":0,\"strokeDashArray\":null,\"strokeLineCap\":\"butt\",\"strokeDashOffset\":0,\"strokeLineJoin\":\"miter\",\"strokeMiterLimit\":4,\"scaleX\":0.58,\"scaleY\":0.58,\"angle\":0,\"flipX\":false,\"flipY\":false,\"opacity\":1,\"shadow\":null,\"visible\":true,\"backgroundColor\":\"\",\"fillRule\":\"nonzero\",\"paintFirst\":\"fill\",\"globalCompositeOperation\":\"source-over\",\"skewX\":0,\"skewY\":0,\"evented\":true,\"selectable\":true,\"objId\":\"spqki0mzwzodqv\",\"user\":\"admin\",\"src\":\"http://localhost:3000/images/assets/icons/christmas_presents.png\",\"crossOrigin\":null,\"filters\":[]}\', \'{\"type\":\"image\",\"version\":\"4.2.0\",\"originX\":\"left\",\"originY\":\"top\",\"left\":7,\"top\":2,\"width\":520,\"height\":100,\"fill\":\"rgb(0,0,0)\",\"stroke\":null,\"strokeWidth\":0,\"strokeDashArray\":null,\"strokeLineCap\":\"butt\",\"strokeDashOffset\":0,\"strokeLineJoin\":\"miter\",\"strokeMiterLimit\":4,\"scaleX\":1,\"scaleY\":1,\"angle\":0,\"flipX\":false,\"flipY\":false,\"opacity\":1,\"shadow\":null,\"visible\":true,\"backgroundColor\":\"\",\"fillRule\":\"nonzero\",\"paintFirst\":\"fill\",\"globalCompositeOperation\":\"source-over\",\"skewX\":0,\"skewY\":0,\"evented\":true,\"selectable\":true,\"objId\":\"uq6o3zmbm3qp1fh\",\"user\":\"admin\",\"src\":\"http://localhost:3000/images/assets/icons/christmas_light_border.png\",\"crossOrigin\":null,\"filters\":[]}\', \'{\"type\":\"image\",\"version\":\"4.2.0\",\"originX\":\"left\",\"originY\":\"top\",\"left\":8,\"top\":284.81,\"width\":400,\"height\":400,\"fill\":\"rgb(0,0,0)\",\"stroke\":null,\"strokeWidth\":0,\"strokeDashArray\":null,\"strokeLineCap\":\"butt\",\"strokeDashOffset\":0,\"strokeLineJoin\":\"miter\",\"strokeMiterLimit\":4,\"scaleX\":0.64,\"scaleY\":0.64,\"angle\":0,\"flipX\":false,\"flipY\":false,\"opacity\":1,\"shadow\":null,\"visible\":true,\"backgroundColor\":\"\",\"fillRule\":\"nonzero\",\"paintFirst\":\"fill\",\"globalCompositeOperation\":\"source-over\",\"skewX\":0,\"skewY\":0,\"evented\":true,\"selectable\":true,\"objId\":\"ws9cc5uznzaqydm\",\"user\":\"admin\",\"src\":\"http://localhost:3000/images/assets/icons/santa_claus_1.png\",\"crossOrigin\":null,\"filters\":[]}\', \'{\"type\":\"image\",\"version\":\"4.2.0\",\"originX\":\"left\",\"originY\":\"top\",\"left\":38,\"top\":183,\"width\":256,\"height\":256,\"fill\":\"rgb(0,0,0)\",\"stroke\":null,\"strokeWidth\":0,\"strokeDashArray\":null,\"strokeLineCap\":\"butt\",\"strokeDashOffset\":0,\"strokeLineJoin\":\"miter\",\"strokeMiterLimit\":4,\"scaleX\":0.28,\"scaleY\":0.28,\"angle\":0,\"flipX\":false,\"flipY\":false,\"opacity\":1,\"shadow\":null,\"visible\":true,\"backgroundColor\":\"\",\"fillRule\":\"nonzero\",\"paintFirst\":\"fill\",\"globalCompositeOperation\":\"source-over\",\"skewX\":0,\"skewY\":0,\"evented\":true,\"selectable\":true,\"objId\":\"icrwzn36clp8vg\",\"user\":\"admin\",\"src\":\"http://localhost:3000/images/assets/icons/mistletoe_1.png\",\"crossOrigin\":null,\"filters\":[]}\', \'{\"type\":\"textbox\",\"version\":\"4.2.0\",\"originX\":\"left\",\"originY\":\"top\",\"left\":100.23,\"top\":198.14,\"width\":477.38,\"height\":45.2,\"fill\":\"#071b3b\",\"stroke\":null,\"strokeWidth\":1,\"strokeDashArray\":null,\"strokeLineCap\":\"butt\",\"strokeDashOffset\":0,\"strokeLineJoin\":\"miter\",\"strokeMiterLimit\":4,\"scaleX\":0.89,\"scaleY\":0.89,\"angle\":0,\"flipX\":false,\"flipY\":false,\"opacity\":1,\"shadow\":null,\"visible\":true,\"backgroundColor\":\"\",\"fillRule\":\"nonzero\",\"paintFirst\":\"fill\",\"globalCompositeOperation\":\"source-over\",\"skewX\":0,\"skewY\":0,\"text\":\"MERRY CHRISTMAS\",\"textAlign\":\"center\",\"textLines\":[\"MERRY CHRISTMAS\"],\"fontFamily\":\"Delicious\",\"evented\":true,\"selectable\":true,\"objId\":\"jkz6lkfe14krkba\",\"user\":\"admin\",\"isBackground\":false,\"styles\":{}}\'\n]\"'),(2,'X\'mas Greeting','\"[\'{\"type\":\"image\",\"version\":\"4.2.0\",\"originX\":\"left\",\"originY\":\"top\",\"left\":0,\"top\":0,\"width\":540,\"height\":540,\"fill\":\"rgb(0,0,0)\",\"stroke\":null,\"strokeWidth\":0,\"strokeDashArray\":null,\"strokeLineCap\":\"butt\",\"strokeDashOffset\":0,\"strokeLineJoin\":\"miter\",\"strokeMiterLimit\":4,\"scaleX\":1,\"scaleY\":1,\"angle\":0,\"flipX\":false,\"flipY\":false,\"opacity\":1,\"shadow\":null,\"visible\":true,\"backgroundColor\":\"\",\"fillRule\":\"nonzero\",\"paintFirst\":\"fill\",\"globalCompositeOperation\":\"source-over\",\"skewX\":0,\"skewY\":0,\"evented\":false,\"selectable\":true,\"objId\":\"e40n6t1nrqc993c\",\"user\":\"admin\",\"isBackground\":true,\"src\":\"http://localhost:3000/images/assets/backgrounds/background_1.jpg\",\"crossOrigin\":null,\"filters\":[]}\', \'{\"type\":\"image\",\"version\":\"4.2.0\",\"originX\":\"left\",\"originY\":\"top\",\"left\":418.69,\"top\":21,\"width\":256,\"height\":256,\"fill\":\"rgb(0,0,0)\",\"stroke\":null,\"strokeWidth\":0,\"strokeDashArray\":null,\"strokeLineCap\":\"butt\",\"strokeDashOffset\":0,\"strokeLineJoin\":\"miter\",\"strokeMiterLimit\":4,\"scaleX\":0.34,\"scaleY\":0.34,\"angle\":0,\"flipX\":false,\"flipY\":false,\"opacity\":1,\"shadow\":null,\"visible\":true,\"backgroundColor\":\"\",\"fillRule\":\"nonzero\",\"paintFirst\":\"fill\",\"globalCompositeOperation\":\"source-over\",\"skewX\":0,\"skewY\":0,\"evented\":true,\"selectable\":true,\"objId\":\"o5x9ccfkemmbzhm\",\"user\":\"admin\",\"src\":\"http://localhost:3000/images/assets/icons/mistletoe_1.png\",\"crossOrigin\":null,\"filters\":[]}\', \'{\"type\":\"image\",\"version\":\"4.2.0\",\"originX\":\"left\",\"originY\":\"top\",\"left\":18,\"top\":130,\"width\":520,\"height\":400,\"fill\":\"rgb(0,0,0)\",\"stroke\":null,\"strokeWidth\":0,\"strokeDashArray\":null,\"strokeLineCap\":\"butt\",\"strokeDashOffset\":0,\"strokeLineJoin\":\"miter\",\"strokeMiterLimit\":4,\"scaleX\":1,\"scaleY\":1,\"angle\":0,\"flipX\":false,\"flipY\":false,\"opacity\":1,\"shadow\":null,\"visible\":true,\"backgroundColor\":\"\",\"fillRule\":\"nonzero\",\"paintFirst\":\"fill\",\"globalCompositeOperation\":\"source-over\",\"skewX\":0,\"skewY\":0,\"evented\":true,\"selectable\":true,\"objId\":\"7nvb6jjydw99olz\",\"user\":\"admin\",\"src\":\"http://localhost:3000/images/assets/icons/christmas_greeting.png\",\"crossOrigin\":null,\"filters\":[]}\', \'{\"type\":\"textbox\",\"version\":\"4.2.0\",\"originX\":\"left\",\"originY\":\"top\",\"left\":53,\"top\":342.62,\"width\":300,\"height\":97.63,\"fill\":\"#171507\",\"stroke\":null,\"strokeWidth\":1,\"strokeDashArray\":null,\"strokeLineCap\":\"butt\",\"strokeDashOffset\":0,\"strokeLineJoin\":\"miter\",\"strokeMiterLimit\":4,\"scaleX\":1.17,\"scaleY\":1.17,\"angle\":0,\"flipX\":false,\"flipY\":false,\"opacity\":1,\"shadow\":null,\"visible\":true,\"backgroundColor\":\"\",\"fillRule\":\"nonzero\",\"paintFirst\":\"fill\",\"globalCompositeOperation\":\"source-over\",\"skewX\":0,\"skewY\":0,\"text\":\"Merry\\\\nChristmas\",\"textAlign\":\"center\",\"textLines\":[\"Merry\",\"Christmas\"],\"fontFamily\":\"Delicious\",\"evented\":true,\"selectable\":true,\"objId\":\"d30kibqt2oq9y1u\",\"user\":\"admin\",\"isBackground\":false,\"styles\":{}}\'\n]\"');
/*!40000 ALTER TABLE `template` ENABLE KEYS */;
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
) ENGINE=InnoDB AUTO_INCREMENT=3 DEFAULT CHARSET=utf8;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `user`
--

LOCK TABLES `user` WRITE;
/*!40000 ALTER TABLE `user` DISABLE KEYS */;
INSERT INTO `user` VALUES (1,'native','chiayi@test.com','ChiaYi','$2b$08$UruwzOTX2RGbH59gG.0ASeHw480nfAozBdtKH6LyPeOhlHfUK14FK',1608537332705,1),(2,'native','bba@test.com','bba','$2b$08$DTb46W28ClF1hJil0OKAhe2LAf.I3gPmVpHF4X7xNuBMhUO1DBHzm',1608537669130,1);
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

-- Dump completed on 2020-12-21 16:09:14
