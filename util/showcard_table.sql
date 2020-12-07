use showcard;

CREATE TABLE IF NOT EXISTS `user` (
	`id` INT NOT NULL AUTO_INCREMENT,
	`provider` VARCHAR(255),
	`email` VARCHAR(255) NOT NULL UNIQUE,
	`name` VARCHAR(255),
    `password` VARCHAR(255),
    `created_at` BIGINT,
    `active` BOOLEAN,
	PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

CREATE TABLE IF NOT EXISTS `card` (
	`id` VARCHAR(255) NOT NULL,
	`owner` INT,
	`title` VARCHAR(255),
    `created_at` BIGINT,
    `saved_at` BIGINT,
    `shared` BOOLEAN,
	`member_count` INT,
    `picture` VARCHAR(255),
    PRIMARY KEY (`id`),
    FOREIGN KEY (`owner`) REFERENCES `user`(`id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

CREATE TABLE IF NOT EXISTS `canvas_done` (
	`id` INT NOT NULL AUTO_INCREMENT,
    `card_id` VARCHAR(255),
    `user_id` INT,
    `user_name` VARCHAR(255),
    `action` VARCHAR(255),
    `canvas` LONGTEXT,
    `init` BOOLEAN,
    PRIMARY KEY (`id`),
    FOREIGN KEY (`card_id`) REFERENCES `card`(`id`) ON DELETE CASCADE,
	FOREIGN KEY (`user_id`) REFERENCES `user`(`id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

CREATE TABLE IF NOT EXISTS `canvas_undo` (
	`id` INT NOT NULL AUTO_INCREMENT,
    `card_id` VARCHAR(255),
    `user_id` INT,
    `user_name` VARCHAR(255),
    `action` VARCHAR(255),
    `canvas` LONGTEXT,
	`init` BOOLEAN,
    PRIMARY KEY (`id`),
    FOREIGN KEY (`card_id`) REFERENCES `card`(`id`) ON DELETE CASCADE,
	FOREIGN KEY (`user_id`) REFERENCES `user`(`id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

SET sql_safe_updates=0;