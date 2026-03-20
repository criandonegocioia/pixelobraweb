-- Inicialização dos bancos de dados MySQL
-- Executado automaticamente na primeira inicialização do container

-- Banco principal do Pixel Obra
CREATE DATABASE IF NOT EXISTS `pixelobra`
  CHARACTER SET utf8mb4
  COLLATE utf8mb4_unicode_ci;

-- Banco da Evolution API (WhatsApp)
CREATE DATABASE IF NOT EXISTS `evolution`
  CHARACTER SET utf8mb4
  COLLATE utf8mb4_unicode_ci;

-- Garante permissões do usuário em ambos
GRANT ALL PRIVILEGES ON `pixelobra`.* TO 'pixelobra'@'%';
GRANT ALL PRIVILEGES ON `evolution`.* TO 'pixelobra'@'%';
FLUSH PRIVILEGES;

-- ── Tabelas do Agente Pixel ──────────────────────────

USE `pixelobra`;

-- Sessões de conversa (memória persistente do agente)
CREATE TABLE IF NOT EXISTS `conversation_sessions` (
  `id` INT AUTO_INCREMENT PRIMARY KEY,
  `contact` VARCHAR(128) NOT NULL,
  `channel` ENUM('whatsapp','instagram','email') NOT NULL,
  `previousResponseId` VARCHAR(128) NOT NULL,
  `createdAt` TIMESTAMP DEFAULT CURRENT_TIMESTAMP NOT NULL,
  `updatedAt` TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP NOT NULL
) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- Leads (Sales Intelligence)
CREATE TABLE IF NOT EXISTS `leads` (
  `id` INT AUTO_INCREMENT PRIMARY KEY,
  `contact` VARCHAR(128) NOT NULL,
  `name` VARCHAR(255),
  `channel` ENUM('whatsapp','instagram','email') NOT NULL,
  `classification` ENUM('hot','warm','cold') NOT NULL DEFAULT 'cold',
  `lastMessage` TEXT,
  `lastInteraction` TIMESTAMP DEFAULT CURRENT_TIMESTAMP NOT NULL,
  `nextFollowUp` TIMESTAMP NULL,
  `followUpStage` INT NOT NULL DEFAULT 0,
  `status` ENUM('open','responded','closed','converted') NOT NULL DEFAULT 'open',
  `createdAt` TIMESTAMP DEFAULT CURRENT_TIMESTAMP NOT NULL,
  `updatedAt` TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP NOT NULL
) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

