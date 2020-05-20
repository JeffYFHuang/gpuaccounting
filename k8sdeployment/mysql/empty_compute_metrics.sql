-- MySQL dump 10.13  Distrib 5.5.62, for debian-linux-gnu (x86_64)
--
-- Host: localhost    Database: computemetrics
-- ------------------------------------------------------
-- Server version	5.5.62-0ubuntu0.14.04.1-log

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
-- Table structure for table `containergpus`
--

DROP TABLE IF EXISTS `containergpus`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `containergpus` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `container_id` int(11) NOT NULL,
  `gpu_id` int(11) NOT NULL,
  `nspid` bigint(11) NOT NULL,
  `pod_id` int(11) NOT NULL,
  PRIMARY KEY (`id`),
  KEY `FKb0emfviivlu8vsur52o2wa7l6` (`pod_id`),
  KEY `FKpdtqbhvsrq1pqsf2whvlx10vi` (`container_id`),
  CONSTRAINT `FKb0emfviivlu8vsur52o2wa7l6` FOREIGN KEY (`pod_id`) REFERENCES `pods` (`id`),
  CONSTRAINT `FKpdtqbhvsrq1pqsf2whvlx10vi` FOREIGN KEY (`container_id`) REFERENCES `containers` (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=37 DEFAULT CHARSET=latin1;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `containergpus`
--

LOCK TABLES `containergpus` WRITE;
/*!40000 ALTER TABLE `containergpus` DISABLE KEYS */;
/*!40000 ALTER TABLE `containergpus` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `containers`
--

DROP TABLE IF EXISTS `containers`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `containers` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `limits_cpu` int(4) DEFAULT NULL,
  `limits_memory` char(32) DEFAULT NULL,
  `limits_nvidia_com_gpu` int(4) DEFAULT NULL,
  `name` char(32) NOT NULL,
  `nspid` bigint(11) NOT NULL,
  `pod_id` int(11) NOT NULL,
  `requests_cpu` char(16) DEFAULT NULL,
  `requests_memory` char(32) DEFAULT NULL,
  `requests_nvidia_com_gpu` int(4) DEFAULT NULL,
  `query_time` char(32) DEFAULT NULL,
  PRIMARY KEY (`id`),
  KEY `FK6h1l3d9se1jcntipe4yh1hipd` (`pod_id`),
  CONSTRAINT `FK6h1l3d9se1jcntipe4yh1hipd` FOREIGN KEY (`pod_id`) REFERENCES `pods` (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=36 DEFAULT CHARSET=latin1;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `containers`
--

LOCK TABLES `containers` WRITE;
/*!40000 ALTER TABLE `containers` DISABLE KEYS */;
/*!40000 ALTER TABLE `containers` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `gpumetrics`
--

DROP TABLE IF EXISTS `gpumetrics`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `gpumetrics` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `gpu_id` int(11) NOT NULL,
  `memory_used` int(4) DEFAULT NULL,
  `power_draw` int(4) DEFAULT NULL,
  `query_time` char(32) NOT NULL,
  `temperature_gpu` int(4) DEFAULT NULL,
  `utilization_gpu` int(4) DEFAULT NULL,
  PRIMARY KEY (`id`),
  KEY `FKoseya5wq6pv2wuoq8l7is3qbb` (`gpu_id`),
  CONSTRAINT `FKoseya5wq6pv2wuoq8l7is3qbb` FOREIGN KEY (`gpu_id`) REFERENCES `gpus` (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=1239853 DEFAULT CHARSET=latin1;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `gpumetrics`
--

LOCK TABLES `gpumetrics` WRITE;
/*!40000 ALTER TABLE `gpumetrics` DISABLE KEYS */;
/*!40000 ALTER TABLE `gpumetrics` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `gpus`
--

DROP TABLE IF EXISTS `gpus`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `gpus` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `enforced_power_limit` int(4) DEFAULT NULL,
  `hostname` char(32) NOT NULL,
  `memory_total` int(4) DEFAULT NULL,
  `name` char(32) NOT NULL,
  `uuid` char(64) NOT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=33 DEFAULT CHARSET=latin1;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `gpus`
--

LOCK TABLES `gpus` WRITE;
/*!40000 ALTER TABLE `gpus` DISABLE KEYS */;
/*!40000 ALTER TABLE `gpus` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `hibernate_sequence`
--

DROP TABLE IF EXISTS `hibernate_sequence`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `hibernate_sequence` (
  `next_val` bigint(20) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=latin1;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `hibernate_sequence`
--

LOCK TABLES `hibernate_sequence` WRITE;
/*!40000 ALTER TABLE `hibernate_sequence` DISABLE KEYS */;
/*!40000 ALTER TABLE `hibernate_sequence` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `namespaces`
--

DROP TABLE IF EXISTS `namespaces`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `namespaces` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `limits_cpu` int(4) DEFAULT NULL,
  `limits_memory` char(32) DEFAULT NULL,
  `limits_nvidia_com_gpu` int(4) DEFAULT NULL,
  `name` char(32) NOT NULL,
  `owner` char(64) DEFAULT NULL,
  `requests_cpu` int(4) DEFAULT NULL,
  `requests_memory` char(32) DEFAULT NULL,
  `requests_nvidia_com_gpu` int(4) DEFAULT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=13 DEFAULT CHARSET=latin1;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `namespaces`
--

LOCK TABLES `namespaces` WRITE;
/*!40000 ALTER TABLE `namespaces` DISABLE KEYS */;
/*!40000 ALTER TABLE `namespaces` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `namespaceusedresourcequotas`
--

DROP TABLE IF EXISTS `namespaceusedresourcequotas`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `namespaceusedresourcequotas` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `limits_cpu` char(16) DEFAULT NULL,
  `limits_memory` char(32) DEFAULT NULL,
  `limits_nvidia_com_gpu` int(4) DEFAULT NULL,
  `namespace_id` int(11) NOT NULL,
  `query_time` char(32) NOT NULL,
  `requests_cpu` char(16) DEFAULT NULL,
  `requests_memory` char(32) DEFAULT NULL,
  `requests_nvidia_com_gpu` int(4) DEFAULT NULL,
  `start_time` char(32) DEFAULT NULL,
  PRIMARY KEY (`id`),
  KEY `FK9oeip41uvtd1yxl6mcv4e0xr4` (`namespace_id`),
  CONSTRAINT `FK9oeip41uvtd1yxl6mcv4e0xr4` FOREIGN KEY (`namespace_id`) REFERENCES `namespaces` (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=42 DEFAULT CHARSET=latin1;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `namespaceusedresourcequotas`
--

LOCK TABLES `namespaceusedresourcequotas` WRITE;
/*!40000 ALTER TABLE `namespaceusedresourcequotas` DISABLE KEYS */;
/*!40000 ALTER TABLE `namespaceusedresourcequotas` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `pods`
--

DROP TABLE IF EXISTS `pods`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `pods` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `hostname` char(32) DEFAULT NULL,
  `name` char(32) NOT NULL,
  `namespace_id` int(11) NOT NULL,
  `phase` char(16) DEFAULT NULL,
  `start_time` char(32) DEFAULT NULL,
  `query_time` char(32) DEFAULT NULL,
  PRIMARY KEY (`id`),
  KEY `FKmbqtvoug66itrqmc9pddgqnom` (`namespace_id`),
  CONSTRAINT `FKmbqtvoug66itrqmc9pddgqnom` FOREIGN KEY (`namespace_id`) REFERENCES `namespaces` (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=21 DEFAULT CHARSET=latin1;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `pods`
--

LOCK TABLES `pods` WRITE;
/*!40000 ALTER TABLE `pods` DISABLE KEYS */;
/*!40000 ALTER TABLE `pods` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `processes`
--

DROP TABLE IF EXISTS `processes`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `processes` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `command` char(32) DEFAULT NULL,
  `container_id` int(11) NOT NULL,
  `full_command` char(255) DEFAULT NULL,
  `nspid` bigint(11) NOT NULL,
  `pid` int(11) NOT NULL,
  `start_time` char(32) NOT NULL,
  `query_time` char(32) DEFAULT NULL,
  PRIMARY KEY (`id`),
  KEY `FK6xwhck2e0h3up7a7s8i1y0shf` (`container_id`),
  CONSTRAINT `FK6xwhck2e0h3up7a7s8i1y0shf` FOREIGN KEY (`container_id`) REFERENCES `containers` (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=24 DEFAULT CHARSET=latin1;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `processes`
--

LOCK TABLES `processes` WRITE;
/*!40000 ALTER TABLE `processes` DISABLE KEYS */;
/*!40000 ALTER TABLE `processes` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `processmetrics`
--

DROP TABLE IF EXISTS `processmetrics`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `processmetrics` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `cpu_memory_usage` bigint(11) DEFAULT NULL,
  `cpu_percent` float DEFAULT NULL,
  `gpu_memory_usage` int(4) DEFAULT NULL,
  `gpumetric_id` int(11) NOT NULL,
  `process_id` int(11) NOT NULL,
  `query_time` char(32) NOT NULL,
  PRIMARY KEY (`id`),
  KEY `FK7lt7modcy5ntttbhx4a93leyq` (`gpumetric_id`),
  CONSTRAINT `FK7lt7modcy5ntttbhx4a93leyq` FOREIGN KEY (`gpumetric_id`) REFERENCES `gpumetrics` (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=107843 DEFAULT CHARSET=latin1;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `processmetrics`
--

LOCK TABLES `processmetrics` WRITE;
/*!40000 ALTER TABLE `processmetrics` DISABLE KEYS */;
/*!40000 ALTER TABLE `processmetrics` ENABLE KEYS */;
UNLOCK TABLES;
/*!40103 SET TIME_ZONE=@OLD_TIME_ZONE */;

/*!40101 SET SQL_MODE=@OLD_SQL_MODE */;
/*!40014 SET FOREIGN_KEY_CHECKS=@OLD_FOREIGN_KEY_CHECKS */;
/*!40014 SET UNIQUE_CHECKS=@OLD_UNIQUE_CHECKS */;
/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
/*!40111 SET SQL_NOTES=@OLD_SQL_NOTES */;

-- Dump completed on 2020-05-05 13:44:39
