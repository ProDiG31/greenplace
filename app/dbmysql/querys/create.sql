-- USE dbgreenplace -- normalement la connection identifie deja la db utilisé 

CREATE TABLE tree 
  ( 
     user_id INT NOT NULL, 
     record_id INT NOT NULL AUTO_INCREMENT, 
     geo_shape_coordinates GEOMETRY, 
     fields_patrimoine VARCHAR(22) CHARACTER SET utf8, 
     fields_adresse VARCHAR(18) CHARACTER SET utf8, 
     fields_geo_point_2d NUMERIC(12, 10), 
     geometry_type VARCHAR(5) CHARACTER SET utf8, 
     geometry_coordinates NUMERIC(12, 10), 
     record_timestamp VARCHAR(25) CHARACTER SET utf8, 
     PRIMARY KEY (recordid),
     FOREIGN KEY (ownerid) REFERENCES user(user_id)
  ) 

CREATE TABLE user 
  (
    user_id INT NOT NULL AUTO_INCREMENT, 
    email VARCHAR(80) NOT NULL,
    display_name VARCHAR(50) NOT NULL,
    password CHAR(41) NOT NULL,
    PRIMARY KEY (user_id),
    UNIQUE INDEX (email)
  )