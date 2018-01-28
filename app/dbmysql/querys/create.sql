-- USE dbgreenplace -- normalement la connection identifie deja la db utilisé 

CREATE TABLE tree 
  ( 
     `ownerid`               VARCHAR(19) CHARACTER SET utf8, 
     `recordid`              VARCHAR(40) CHARACTER SET utf8, 
     `geo_shape_coordinates` GEOMETRY, 
     `fields_patrimoine`     VARCHAR(22) CHARACTER SET utf8, 
     `fields_adresse`        VARCHAR(18) CHARACTER SET utf8, 
     `fields_id`             INT, 
     `fields_geo_point_2d`   NUMERIC(12, 10), 
     `geometry_type`         VARCHAR(5) CHARACTER SET utf8, 
     `geometry_coordinates`  NUMERIC(12, 10), 
     `record_timestamp`      VARCHAR(25) CHARACTER SET utf8, 
     PRIMARY KEY (recordid) 
  ) 