DROP DATABASE IF EXISTS TesteDemonlist;
CREATE DATABASE TesteDemonlist;
use TesteDemonlist;

CREATE TABLE levels
(
    id_lvl int not null primary key auto_increment,
	position_lvl int not null,
    name_lvl varchar(255) not null,
    creator_lvl varchar(255) not null,
    verifier_lvl varchar(255) not null,
    video_lvl varchar(255) not null,
    publisher_lvl varchar(255)
);

/*
DELIMITER $$
CREATE PROCEDURE InsertLevel(position_lvl int, name_lvl varchar(255), creator_lvl varchar(255), verifier_lvl varchar(255), video_lvl varchar(255), publisher_lvl varchar(255))
BEGIN
    INSERT INTO levels VALUES (null, position_lvl, name_lvl, creator_lvl, verifier_lvl, video_lvl, publisher_lvl);
END
$$ DELIMITER ;
*/

DELIMITER $$
CREATE PROCEDURE InsertLevel(new_position_lvl int, name_lvl varchar(255), creator_lvl varchar(255), verifier_lvl varchar(255), video_lvl varchar(255), publisher_lvl varchar(255))
BEGIN
    UPDATE levels SET position_lvl = position_lvl + 1 WHERE position_lvl >= new_position_lvl;
    INSERT INTO levels VALUES (null, new_position_lvl, name_lvl, creator_lvl, verifier_lvl, video_lvl, publisher_lvl);
END
$$ DELIMITER ;

DELIMITER $$
CREATE PROCEDURE DeleteLevel(position int)
BEGIN
    DECLARE deleted_position_lvl INT;
    SET deleted_position_lvl = (SELECT position_lvl FROM levels WHERE position_lvl = position LIMIT 1);
    DELETE FROM levels WHERE position_lvl = position;
    UPDATE levels SET position_lvl = position_lvl - 1 WHERE position_lvl > deleted_position_lvl;
END
$$ DELIMITER ;

CALL InsertLevel(1, 'Arcturus', 'maxfs', 'ultracauahd', 'https://youtu.be/a_Bqa8l9Xtc', null);
CALL InsertLevel(2, 'abicto', 'Jobalho', 'Jobalho', 'https://youtu.be/Er0cq6A_PE4', null);
CALL InsertLevel(3, 'Thinking Space', 'HidekiX', 'Atomic', 'https://youtu.be/iHf2nanWjvE', 'Atomic');
CALL InsertLevel(4, 'unasse', 'pirocona', 'Jobalho', 'https://youtu.be/UhC4IpC03U0', null);
CALL InsertLevel(5, 'Tenkai', 'HidekiX', 'Motor', 'https://youtu.be/AM2KHSZkjcc', null);
CALL InsertLevel(6, 'Beyond Hell', 'fakeblast', 'fakeblast', 'https://youtu.be/Q6GCkukQabQ', null);
CALL InsertLevel(7, 'Super Probably Dash', 'Laranjoo', 'Draquito', 'https://youtu.be/w8381Oc38lI', null);
CALL InsertLevel(8, 'Factory Realm X', 'HelpegasuS', 'Enzeux', 'https://youtu.be/bkreo_jag3E', null);
CALL InsertLevel(9, 'Astronaut Vortex', 'yuuchouze', 'SeptaGon7', 'https://youtu.be/QlzStci2rwQ', null);
CALL InsertLevel(10, 'Dolos', 'Enzeux', 'Enzeux', 'https://youtu.be/velFCMli60A', null);
CALL InsertLevel(11, 'Mind Blowing', 'yuuchouze', 'Luqualizer', 'https://youtu.be/TQ5kMyP2Ha0', null);
CALL InsertLevel(12, 'Convy', 'RafaBirds', 'L3on14az', 'https://youtu.be/mXzYW4rI0Pc', null);
CALL InsertLevel(13, 'The Zodiac', 'Jobalho', 'Jobalho', 'https://youtu.be/gRsd4yiL_8c', null);
CALL InsertLevel(14, 'ILOVECYAN', 'AVRG', 'iRaily', 'https://youtu.be/4uKEwdLnRck', null);
CALL InsertLevel(15, 'The Ultimate Demon', 'Vit12', 'LordVaderCraft', 'https://youtu.be/-HYXf6jRPR8', null);
CALL InsertLevel(16, 'Elusions', 'Dynamis96', 'Enzeux', 'https://youtu.be/VfyIl85Kh-g', null);
CALL InsertLevel(17, 'The Green', 'yuuchouze/maxfs', 'DibiiziCookie', 'https://youtu.be/ugZkRmwLGcw', 'insist');
CALL InsertLevel(18, 'Extermination Nation', 'yuuchouze', 'fakeblast', 'https://youtu.be/Q2Syva4rS-s', null);
CALL InsertLevel(19, 'Underground', 'HugoLa', 'MrTompson', 'https://youtu.be/e0L2gkVmWy8', null);
CALL InsertLevel(20, 'Eraser', 'LChaseR', 'LChaseR', 'https://youtu.be/kJmqWS9iVyA', null);
CALL InsertLevel(21, 'Death Machine', 'yuuchouze', 'RyuDieDragon', 'https://youtu.be/gT--CLIBvsQ', null);
CALL InsertLevel(22, 'Memory Zone', 'yuuchouze', 'ultracauahd', 'https://youtu.be/NEKHjleH3ig', null);
CALL InsertLevel(23, 'Intention', 'yuuchouze', 'Akane', 'https://youtu.be/OxjLXy-TzQs', 'Akane');
CALL InsertLevel(24, 'Black Tourmaline', 'OverDCE', 'ItzClover', 'https://youtu.be/lKTeVum3xjw', null);
CALL InsertLevel(25, 'CHALLUNGA FINALE', 'RafaBirds', 'RafaBirds', 'https://youtu.be/fFiIamH3Qxs', null);
CALL InsertLevel(26, 'Doideira', 'Jobalho', 'Jobalho', 'https://youtu.be/h1X5jKJ14_E', null);
CALL InsertLevel(27, 'Underwater Caves', 'RafaBirds', 'Jobalho', 'https://youtu.be/DwvCjaSpknI', null);
CALL InsertLevel(28, 'Rolas Tortas e Lisas', 'Jobalho', 'DibiiziCookie', 'https://youtu.be/U-6xpuA6o18', null);
CALL InsertLevel(29, 'Setesh', 'Nar247', 'tayrr', 'https://youtu.be/fHR8kSo7VH4', null);
CALL InsertLevel(30, 'Glacial Edge', 'HelpegasuS', 'Enzeux', 'https://youtu.be/yFG2HOp_nb4', 'Legoyoshi3');

#CALL InsertLevel(30, 'HellGate', 'Firy', 'ToastyPanda', 'https://youtu.be/L52J7vVfQyk', null);

select * from levels order by position_lvl;
