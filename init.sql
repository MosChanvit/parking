
CREATE DATABASE IF NOT EXISTS parking;

USE parking;

-- phpMyAdmin SQL Dump
-- version 5.1.3
-- https://www.phpmyadmin.net/
--
-- Host: db
-- Generation Time: Mar 07, 2022 at 09:42 AM
-- Server version: 8.0.15
-- PHP Version: 8.0.15

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
START TRANSACTION;
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;

--
-- Database: `parking`
--

-- --------------------------------------------------------

--
-- Table structure for table `record`
--

CREATE TABLE `record` (
  `id` int(11) NOT NULL,
  `size` varchar(1) NOT NULL,
  `slot` int(11) NOT NULL,
  `license_plate` varchar(50) NOT NULL,
  `status` tinyint(1) NOT NULL,
  `time` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

--
-- Dumping data for table `record`
--

INSERT INTO `record` (`id`, `size`, `slot`, `license_plate`, `status`, `time`) VALUES
(1, 'L', 1, 'AA 187', 1, '2022-03-04 15:21:38'),
(2, 'L', 5, 'AA 187', 1, '2022-03-04 15:21:50'),
(3, 'L', 2, 'DD 187', 1, '2022-03-04 16:33:54'),
(4, 'L', 3, '', 0, '2022-03-04 15:21:51'),
(5, 'L', 4, 'AA 187', 1, '2022-03-04 15:21:52'),
(6, 'L', 6, 'CC 187', 1, '2022-03-04 16:30:47'),
(7, 'L', 7, 'CC 187', 1, '2022-03-04 16:31:52'),
(8, 'L', 8, 'CC 187', 1, '2022-03-04 16:32:10'),
(9, 'L', 9, 'DD 187', 1, '2022-03-04 16:34:18'),
(10, 'S', 1, 'DD 187', 1, '2022-03-04 17:48:03'),
(11, 'M', 1, '', 0, '2022-03-04 18:04:12');

-- --------------------------------------------------------

--
-- Table structure for table `type_car`
--

CREATE TABLE `type_car` (
  `size` varchar(10) CHARACTER SET utf8 COLLATE utf8_general_ci NOT NULL,
  `count` int(11) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

--
-- Dumping data for table `type_car`
--

INSERT INTO `type_car` (`size`, `count`) VALUES
('L', 9),
('M', 8),
('S', 7);

--
-- Indexes for dumped tables
--

--
-- Indexes for table `record`
--
ALTER TABLE `record`
  ADD UNIQUE KEY `id` (`id`);

--
-- Indexes for table `type_car`
--
ALTER TABLE `type_car`
  ADD PRIMARY KEY (`size`),
  ADD UNIQUE KEY `Size` (`size`);

--
-- AUTO_INCREMENT for dumped tables
--

--
-- AUTO_INCREMENT for table `record`
--
ALTER TABLE `record`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=12;
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
