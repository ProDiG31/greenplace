USE dbgreenplace; 

CREATE TABLE IF NOT EXISTS user 
( 
  user_id      INT NOT NULL auto_increment, 
  email        VARCHAR(80) NOT NULL, 
  display_name VARCHAR(50) NOT NULL, 
  password     VARCHAR(60) NOT NULL, 
  PRIMARY KEY (user_id), 
  UNIQUE INDEX (email) 
); 

CREATE TABLE IF NOT EXISTS tree 
( 
  user_id               INT NOT NULL, 
  tree_id               INT NOT NULL auto_increment, 
  geo_shape_coordinates GEOMETRY, 
  patrimoine            VARCHAR(22) CHARACTER SET utf8, 
  adresse               VARCHAR(18) CHARACTER SET utf8, 
  geometry_point        GEOMETRY, 
  record_date           DATETIME DEFAULT CURRENT_TIMESTAMP, 
  PRIMARY KEY (tree_id), 
  FOREIGN KEY (user_id) REFERENCES user(user_id) 
); 