-- MySQL dump 10.13  Distrib 8.0.34, for Win64 (x86_64)
--
-- Host: 127.0.0.1    Database: seep
-- ------------------------------------------------------
-- Server version	8.0.35

/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!50503 SET NAMES utf8 */;
/*!40103 SET @OLD_TIME_ZONE=@@TIME_ZONE */;
/*!40103 SET TIME_ZONE='+00:00' */;
/*!40014 SET @OLD_UNIQUE_CHECKS=@@UNIQUE_CHECKS, UNIQUE_CHECKS=0 */;
/*!40014 SET @OLD_FOREIGN_KEY_CHECKS=@@FOREIGN_KEY_CHECKS, FOREIGN_KEY_CHECKS=0 */;
/*!40101 SET @OLD_SQL_MODE=@@SQL_MODE, SQL_MODE='NO_AUTO_VALUE_ON_ZERO' */;
/*!40111 SET @OLD_SQL_NOTES=@@SQL_NOTES, SQL_NOTES=0 */;

--
-- Table structure for table `admins`
--

DROP TABLE IF EXISTS `admins`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `admins` (
  `id_admin` char(36) CHARACTER SET utf8mb4 COLLATE utf8mb4_bin DEFAULT NULL,
  `numero_documento` int NOT NULL,
  `nombres` varchar(255) NOT NULL,
  `apellidos` varchar(255) NOT NULL,
  `rol_usuario` varchar(255) NOT NULL,
  `contrasena` varchar(255) NOT NULL,
  `createdAt` datetime NOT NULL,
  `updatedAt` datetime NOT NULL,
  PRIMARY KEY (`numero_documento`),
  UNIQUE KEY `admins_id_admin_numero_documento` (`id_admin`,`numero_documento`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `admins`
--

LOCK TABLES `admins` WRITE;
/*!40000 ALTER TABLE `admins` DISABLE KEYS */;
/*!40000 ALTER TABLE `admins` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `adminusers`
--

DROP TABLE IF EXISTS `adminusers`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `adminusers` (
  `id` char(36) CHARACTER SET utf8mb4 COLLATE utf8mb4_bin NOT NULL,
  `adminId` char(36) CHARACTER SET utf8mb4 COLLATE utf8mb4_bin NOT NULL,
  `fichaId` int NOT NULL,
  `aprendizId` char(36) CHARACTER SET utf8mb4 COLLATE utf8mb4_bin NOT NULL,
  `instructorId` char(36) CHARACTER SET utf8mb4 COLLATE utf8mb4_bin NOT NULL,
  `createdAt` datetime NOT NULL,
  `updatedAt` datetime NOT NULL,
  `AdminNumeroDocumento` int DEFAULT NULL,
  `FichaNumeroFicha` int DEFAULT NULL,
  `AprendiceNumeroDocumento` int DEFAULT NULL,
  `InstructoreIdInstructor` char(36) CHARACTER SET utf8mb4 COLLATE utf8mb4_bin DEFAULT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `AdminUsers_InstructoreIdInstructor_AdminNumeroDocumento_unique` (`AdminNumeroDocumento`,`InstructoreIdInstructor`),
  UNIQUE KEY `AdminUsers_FichaNumeroFicha_AdminNumeroDocumento_unique` (`FichaNumeroFicha`),
  UNIQUE KEY `AdminUsers_AprendiceNumeroDocumento_AdminNumeroDocumento_unique` (`AprendiceNumeroDocumento`),
  UNIQUE KEY `AdminUsersUniq` (`AdminNumeroDocumento`,`instructorId`),
  KEY `InstructoreIdInstructor` (`InstructoreIdInstructor`),
  CONSTRAINT `adminusers_ibfk_1` FOREIGN KEY (`AdminNumeroDocumento`) REFERENCES `admins` (`numero_documento`) ON DELETE CASCADE ON UPDATE CASCADE,
  CONSTRAINT `adminusers_ibfk_2` FOREIGN KEY (`FichaNumeroFicha`) REFERENCES `fichas` (`numero_ficha`) ON DELETE CASCADE ON UPDATE CASCADE,
  CONSTRAINT `adminusers_ibfk_3` FOREIGN KEY (`AprendiceNumeroDocumento`) REFERENCES `aprendices` (`numero_documento`) ON DELETE CASCADE ON UPDATE CASCADE,
  CONSTRAINT `adminusers_ibfk_4` FOREIGN KEY (`InstructoreIdInstructor`) REFERENCES `instructores` (`id_instructor`) ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `adminusers`
--

LOCK TABLES `adminusers` WRITE;
/*!40000 ALTER TABLE `adminusers` DISABLE KEYS */;
/*!40000 ALTER TABLE `adminusers` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `aprendices`
--

DROP TABLE IF EXISTS `aprendices`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `aprendices` (
  `id_aprendiz` char(36) CHARACTER SET utf8mb4 COLLATE utf8mb4_bin DEFAULT NULL,
  `id_empresa` char(36) CHARACTER SET utf8mb4 COLLATE utf8mb4_bin DEFAULT NULL,
  `numero_documento` int NOT NULL,
  `tipo_documento` varchar(255) NOT NULL,
  `fecha_expedicion` datetime NOT NULL,
  `lugar_expedicion` varchar(255) NOT NULL,
  `fecha_nacimiento` datetime NOT NULL,
  `nombres` varchar(255) NOT NULL,
  `apellidos` varchar(255) NOT NULL,
  `sexo` varchar(255) NOT NULL,
  `direccion_domicilio` varchar(255) NOT NULL,
  `municipio_domicilio` varchar(255) NOT NULL,
  `departamento_domicilio` varchar(255) NOT NULL,
  `telefonofijo_Contacto` int DEFAULT NULL,
  `numero_celular1` varchar(255) NOT NULL,
  `numero_celular2` varchar(255) DEFAULT NULL,
  `correo_electronico1` varchar(255) NOT NULL,
  `correo_electronico_sofia_plus` varchar(255) NOT NULL,
  `numero_ficha` int NOT NULL,
  `rol_usuario` varchar(255) NOT NULL,
  `estado` varchar(255) DEFAULT NULL,
  `contrasena` varchar(255) NOT NULL,
  `contrasena_temporal` tinyint(1) DEFAULT NULL,
  `createdAt` datetime NOT NULL,
  `updatedAt` datetime NOT NULL,
  `FichaNumeroFicha` int DEFAULT NULL,
  PRIMARY KEY (`numero_documento`),
  UNIQUE KEY `aprendices_id_aprendiz_numero_documento` (`id_aprendiz`,`numero_documento`),
  KEY `id_empresa` (`id_empresa`),
  KEY `numero_ficha` (`numero_ficha`),
  KEY `FichaNumeroFicha` (`FichaNumeroFicha`),
  CONSTRAINT `aprendices_ibfk_1` FOREIGN KEY (`id_empresa`) REFERENCES `empresas` (`id_empresa`) ON DELETE SET NULL ON UPDATE CASCADE,
  CONSTRAINT `aprendices_ibfk_2` FOREIGN KEY (`numero_ficha`) REFERENCES `fichas` (`numero_ficha`) ON DELETE CASCADE ON UPDATE CASCADE,
  CONSTRAINT `aprendices_ibfk_3` FOREIGN KEY (`FichaNumeroFicha`) REFERENCES `fichas` (`numero_ficha`) ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `aprendices`
--

LOCK TABLES `aprendices` WRITE;
/*!40000 ALTER TABLE `aprendices` DISABLE KEYS */;
INSERT INTO `aprendices` VALUES ('d969383a-7192-4b76-8d82-f88de5512026',NULL,3566565,'Cédula ','2000-01-01 00:00:00','Ciudad','1995-05-15 00:00:00','Brandon','Rendon Espinoza','Masculino','Calle 123','Ciudad','Departamento',1234567,'3106331650',NULL,'jabeltran6060@soy.sena.edu.co','andersonbeltrane283@gmail.com',2653755,'aprendiz',NULL,'$2a$10$a3i.Sayh5FP5VqUJ5X3No.iDGmh.olMgP8qL.w/c4DzFLQQPHQ7.a',1,'2024-07-05 19:12:57','2024-07-05 19:12:57',NULL);
/*!40000 ALTER TABLE `aprendices` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `bitacoras`
--

DROP TABLE IF EXISTS `bitacoras`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `bitacoras` (
  `id_bitacora` char(36) CHARACTER SET utf8mb4 COLLATE utf8mb4_bin NOT NULL,
  `numero_de_bitacora` varchar(255) NOT NULL,
  `archivo` varchar(255) NOT NULL,
  `id_aprendiz` char(36) CHARACTER SET utf8mb4 COLLATE utf8mb4_bin NOT NULL,
  `observaciones` text,
  `estado` tinyint(1) DEFAULT '0',
  `intentos` int DEFAULT '0',
  `createdAt` datetime NOT NULL,
  `updatedAt` datetime NOT NULL,
  `AprendiceNumeroDocumento` int DEFAULT NULL,
  PRIMARY KEY (`id_bitacora`),
  KEY `id_aprendiz` (`id_aprendiz`),
  KEY `AprendiceNumeroDocumento` (`AprendiceNumeroDocumento`),
  CONSTRAINT `bitacoras_ibfk_1` FOREIGN KEY (`id_aprendiz`) REFERENCES `aprendices` (`id_aprendiz`) ON DELETE CASCADE ON UPDATE CASCADE,
  CONSTRAINT `bitacoras_ibfk_2` FOREIGN KEY (`AprendiceNumeroDocumento`) REFERENCES `aprendices` (`numero_documento`) ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `bitacoras`
--

LOCK TABLES `bitacoras` WRITE;
/*!40000 ALTER TABLE `bitacoras` DISABLE KEYS */;
/*!40000 ALTER TABLE `bitacoras` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `documentos`
--

DROP TABLE IF EXISTS `documentos`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `documentos` (
  `id_documento` char(36) CHARACTER SET utf8mb4 COLLATE utf8mb4_bin NOT NULL,
  `tipo_documento` varchar(255) NOT NULL,
  `archivo` varchar(255) NOT NULL,
  `id_aprendiz` char(36) CHARACTER SET utf8mb4 COLLATE utf8mb4_bin NOT NULL,
  `createdAt` datetime NOT NULL,
  `updatedAt` datetime NOT NULL,
  `AprendiceNumeroDocumento` int DEFAULT NULL,
  PRIMARY KEY (`id_documento`),
  KEY `id_aprendiz` (`id_aprendiz`),
  KEY `AprendiceNumeroDocumento` (`AprendiceNumeroDocumento`),
  CONSTRAINT `documentos_ibfk_1` FOREIGN KEY (`id_aprendiz`) REFERENCES `aprendices` (`id_aprendiz`) ON DELETE CASCADE ON UPDATE CASCADE,
  CONSTRAINT `documentos_ibfk_2` FOREIGN KEY (`AprendiceNumeroDocumento`) REFERENCES `aprendices` (`numero_documento`) ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `documentos`
--

LOCK TABLES `documentos` WRITE;
/*!40000 ALTER TABLE `documentos` DISABLE KEYS */;
/*!40000 ALTER TABLE `documentos` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `empresas`
--

DROP TABLE IF EXISTS `empresas`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `empresas` (
  `id_empresa` char(36) CHARACTER SET utf8mb4 COLLATE utf8mb4_bin NOT NULL,
  `razon_social` varchar(255) NOT NULL,
  `nit_empresa` bigint NOT NULL,
  `direccion_empresa` varchar(255) NOT NULL,
  `nombre_jefe_inmediato` varchar(255) NOT NULL,
  `apellidos_jefe_inmediato` varchar(255) NOT NULL,
  `cargo_jefe_inmediato` varchar(255) NOT NULL,
  `telefono_jefe_inmediato` varchar(255) NOT NULL,
  `email_jefe_imediato` varchar(255) NOT NULL,
  `createdAt` datetime NOT NULL,
  `updatedAt` datetime NOT NULL,
  PRIMARY KEY (`id_empresa`),
  UNIQUE KEY `empresas_id_empresa_nit_empresa` (`id_empresa`,`nit_empresa`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `empresas`
--

LOCK TABLES `empresas` WRITE;
/*!40000 ALTER TABLE `empresas` DISABLE KEYS */;
/*!40000 ALTER TABLE `empresas` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `evaluaciones`
--

DROP TABLE IF EXISTS `evaluaciones`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `evaluaciones` (
  `id_evaluacion` char(36) CHARACTER SET utf8mb4 COLLATE utf8mb4_bin NOT NULL,
  `id_aprendiz` char(36) CHARACTER SET utf8mb4 COLLATE utf8mb4_bin NOT NULL,
  `actividades_desarrollar` json DEFAULT NULL,
  `evidencias_aprendizaje` json DEFAULT NULL,
  `fecha_actividad` json DEFAULT NULL,
  `lugar_actividad` json DEFAULT NULL,
  `observaciones_actividades` varchar(255) DEFAULT NULL,
  `nombre_ente_conformador` varchar(255) NOT NULL,
  `nombre_instructor` varchar(255) NOT NULL,
  `firma_ente_conformador` text,
  `firma_aprendiz` text,
  `firma_instructor_seguimiento` text,
  `tipo_informe` varchar(255) NOT NULL,
  `inicio_periodo_evaluado` datetime NOT NULL,
  `fin_periodo_evaluado` datetime NOT NULL,
  `relaciones_in_satisfactorio` varchar(255) DEFAULT NULL,
  `relaciones_in_por_mejorar` varchar(255) DEFAULT NULL,
  `relaciones_in_observaciones` varchar(255) DEFAULT NULL,
  `trabajo_equip_satisfactorio` varchar(255) DEFAULT NULL,
  `trabajo_equip_por_mejorar` varchar(255) DEFAULT NULL,
  `trabajo_equip_observaciones` varchar(255) DEFAULT NULL,
  `solucion_prob_satisfactorio` varchar(255) DEFAULT NULL,
  `solucion_prob_por_mejorar` varchar(255) DEFAULT NULL,
  `solucion_prob_observaciones` varchar(255) DEFAULT NULL,
  `cumplimiento_satisfactorio` varchar(255) DEFAULT NULL,
  `cumplimiento_por_mejorar` varchar(255) DEFAULT NULL,
  `cumplimiento_observaciones` varchar(255) DEFAULT NULL,
  `organizacion_satisfactorio` varchar(255) DEFAULT NULL,
  `organizacion_por_mejorar` varchar(255) DEFAULT NULL,
  `organizacion_observaciones` varchar(255) DEFAULT NULL,
  `trasnfe_cono_satisfactorio` varchar(255) DEFAULT NULL,
  `trasnfe_cono_por_mejorar` varchar(255) DEFAULT NULL,
  `trasnfe_cono_observaciones` varchar(255) DEFAULT NULL,
  `mejora_conti_satisfactorio` varchar(255) DEFAULT NULL,
  `mejora_conti_por_mejorar` varchar(255) DEFAULT NULL,
  `mejora_conti_observaciones` varchar(255) DEFAULT NULL,
  `fort_ocup_satisfactorio` varchar(255) DEFAULT NULL,
  `fort_ocup_por_mejorar` varchar(255) DEFAULT NULL,
  `fort_ocup_observaciones` varchar(255) DEFAULT NULL,
  `oport_calidad_satisfactorio` varchar(255) DEFAULT NULL,
  `oport_calidad_por_mejorar` varchar(255) DEFAULT NULL,
  `oport_calidad_observaciones` varchar(255) DEFAULT NULL,
  `respo_ambient_satisfactorio` varchar(255) DEFAULT NULL,
  `respo_ambient_por_mejorar` varchar(255) DEFAULT NULL,
  `respo_ambient_observaciones` varchar(255) DEFAULT NULL,
  `admin_recursos_satisfactorio` varchar(255) DEFAULT NULL,
  `admin_recursos_por_mejorar` varchar(255) DEFAULT NULL,
  `admin_recursos_observaciones` varchar(255) DEFAULT NULL,
  `seg_ocupacional_satisfactorio` varchar(255) DEFAULT NULL,
  `seg_ocupacional_por_mejorar` varchar(255) DEFAULT NULL,
  `seg_ocupacional_observaciones` varchar(255) DEFAULT NULL,
  `docs_etapro_satisfactorio` varchar(255) DEFAULT NULL,
  `docs_etapro_por_mejorar` varchar(255) DEFAULT NULL,
  `docs_etapro_observaciones` varchar(255) DEFAULT NULL,
  `Observaciones_ente_conf` varchar(255) DEFAULT NULL,
  `observaciones_aprendiz` varchar(255) DEFAULT NULL,
  `juicio_aprendiz` varchar(255) NOT NULL,
  `recono_especiales` varchar(255) NOT NULL,
  `especificar_recono` varchar(255) DEFAULT NULL,
  `createdAt` datetime NOT NULL,
  `updatedAt` datetime NOT NULL,
  PRIMARY KEY (`id_evaluacion`),
  UNIQUE KEY `evaluaciones_id_evaluacion` (`id_evaluacion`),
  KEY `id_aprendiz` (`id_aprendiz`),
  CONSTRAINT `evaluaciones_ibfk_1` FOREIGN KEY (`id_aprendiz`) REFERENCES `aprendices` (`id_aprendiz`) ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `evaluaciones`
--

LOCK TABLES `evaluaciones` WRITE;
/*!40000 ALTER TABLE `evaluaciones` DISABLE KEYS */;
/*!40000 ALTER TABLE `evaluaciones` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `fichas`
--

DROP TABLE IF EXISTS `fichas`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `fichas` (
  `id_ficha` char(36) CHARACTER SET utf8mb4 COLLATE utf8mb4_bin DEFAULT NULL,
  `numero_ficha` int NOT NULL,
  `programa_formacion` varchar(255) NOT NULL,
  `nivel_formacion` varchar(255) NOT NULL,
  `titulo_obtenido` varchar(255) NOT NULL,
  `nombre_regional` varchar(255) NOT NULL,
  `centro_formacion` varchar(255) NOT NULL,
  `fecha_inicio_lectiva` datetime NOT NULL,
  `fecha_fin_lectiva` datetime NOT NULL,
  `id_instructor` char(36) CHARACTER SET utf8mb4 COLLATE utf8mb4_bin DEFAULT NULL,
  `createdAt` datetime NOT NULL,
  `updatedAt` datetime NOT NULL,
  `InstructoreIdInstructor` char(36) CHARACTER SET utf8mb4 COLLATE utf8mb4_bin DEFAULT NULL,
  PRIMARY KEY (`numero_ficha`),
  KEY `id_instructor` (`id_instructor`),
  KEY `InstructoreIdInstructor` (`InstructoreIdInstructor`),
  CONSTRAINT `fichas_ibfk_1` FOREIGN KEY (`id_instructor`) REFERENCES `instructores` (`id_instructor`) ON DELETE CASCADE ON UPDATE CASCADE,
  CONSTRAINT `fichas_ibfk_2` FOREIGN KEY (`InstructoreIdInstructor`) REFERENCES `instructores` (`id_instructor`) ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `fichas`
--

LOCK TABLES `fichas` WRITE;
/*!40000 ALTER TABLE `fichas` DISABLE KEYS */;
INSERT INTO `fichas` VALUES ('81ee018e-4ac0-4a20-879d-feae7e50d0c2',2653755,'Análisis y Desarrollo de Software','Tecnológico','Tecnólogo en Análisis y Desarrollo de Software','Risaralda','Centro de Diseño e Innovación tecnológica','2022-10-12 00:00:00','2024-12-20 00:00:00',NULL,'2024-07-05 19:06:53','2024-07-05 19:06:53',NULL);
/*!40000 ALTER TABLE `fichas` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `instructores`
--

DROP TABLE IF EXISTS `instructores`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `instructores` (
  `id_instructor` char(36) CHARACTER SET utf8mb4 COLLATE utf8mb4_bin NOT NULL,
  `numero_documento` int NOT NULL,
  `tipo_documento` varchar(255) NOT NULL,
  `nombres` varchar(255) NOT NULL,
  `apellidos` varchar(255) NOT NULL,
  `correo_electronico1` varchar(255) NOT NULL,
  `numero_celular1` varchar(255) NOT NULL,
  `numero_celular2` varchar(255) DEFAULT NULL,
  `fichas_asignadas` varchar(255) DEFAULT NULL,
  `rol_usuario` varchar(255) NOT NULL,
  `contrasena` varchar(255) NOT NULL,
  `contrasena_temporal` tinyint(1) DEFAULT NULL,
  `createdAt` datetime NOT NULL,
  `updatedAt` datetime NOT NULL,
  PRIMARY KEY (`id_instructor`),
  UNIQUE KEY `numero_documento` (`numero_documento`),
  UNIQUE KEY `instructores_id_instructor_numero_documento` (`id_instructor`,`numero_documento`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `instructores`
--

LOCK TABLES `instructores` WRITE;
/*!40000 ALTER TABLE `instructores` DISABLE KEYS */;
INSERT INTO `instructores` VALUES ('bab1ac1f-9eb1-42e5-b2ef-6ccbbacc2cb9',1234567,'CC','Juan','Perez','jabeltran6060@misena.edu.co','1234567890',NULL,'2653755','instructor','$2a$10$PqY5uG3lcRQrR9pys/tRAep5q1XVemJF5nKE2F2ofzLo9MUKumTra',0,'2024-07-05 19:06:57','2024-07-05 19:12:35');
/*!40000 ALTER TABLE `instructores` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `visitas`
--

DROP TABLE IF EXISTS `visitas`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `visitas` (
  `id_visita` char(36) CHARACTER SET utf8mb4 COLLATE utf8mb4_bin NOT NULL,
  `tipo_visita` varchar(255) NOT NULL,
  `fecha` date NOT NULL,
  `hora_inicio` time NOT NULL,
  `hora_fin` time DEFAULT NULL,
  `lugar_visita` varchar(255) NOT NULL,
  `modalidad_visita` enum('Presencial','Virtual') NOT NULL,
  `motivo_cancelacion` varchar(255) DEFAULT NULL,
  `estado` enum('activo','cancelado') DEFAULT 'activo',
  `aprendiz` char(36) CHARACTER SET utf8mb4 COLLATE utf8mb4_bin NOT NULL,
  `createdAt` datetime NOT NULL,
  `updatedAt` datetime NOT NULL,
  `id_aprendiz` int DEFAULT NULL,
  `AprendiceNumeroDocumento` int DEFAULT NULL,
  PRIMARY KEY (`id_visita`),
  KEY `aprendiz` (`aprendiz`),
  KEY `id_aprendiz` (`id_aprendiz`),
  KEY `AprendiceNumeroDocumento` (`AprendiceNumeroDocumento`),
  CONSTRAINT `visitas_ibfk_1` FOREIGN KEY (`aprendiz`) REFERENCES `aprendices` (`id_aprendiz`),
  CONSTRAINT `visitas_ibfk_2` FOREIGN KEY (`id_aprendiz`) REFERENCES `aprendices` (`numero_documento`) ON DELETE SET NULL ON UPDATE CASCADE,
  CONSTRAINT `visitas_ibfk_3` FOREIGN KEY (`AprendiceNumeroDocumento`) REFERENCES `aprendices` (`numero_documento`) ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `visitas`
--

LOCK TABLES `visitas` WRITE;
/*!40000 ALTER TABLE `visitas` DISABLE KEYS */;
INSERT INTO `visitas` VALUES ('9d0ed5e9-b8e4-43a5-8815-c44208f7196b','Primera visita','2024-07-06','14:13:00','16:13:00','assas','Presencial',NULL,'activo','d969383a-7192-4b76-8d82-f88de5512026','2024-07-05 19:13:20','2024-07-05 19:13:20',NULL,NULL);
/*!40000 ALTER TABLE `visitas` ENABLE KEYS */;
UNLOCK TABLES;
/*!40103 SET TIME_ZONE=@OLD_TIME_ZONE */;

/*!40101 SET SQL_MODE=@OLD_SQL_MODE */;
/*!40014 SET FOREIGN_KEY_CHECKS=@OLD_FOREIGN_KEY_CHECKS */;
/*!40014 SET UNIQUE_CHECKS=@OLD_UNIQUE_CHECKS */;
/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
/*!40111 SET SQL_NOTES=@OLD_SQL_NOTES */;

-- Dump completed on 2024-07-11 19:02:42
