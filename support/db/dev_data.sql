





-- password: peterparkerpassword
-- for dev online bcrypt password can be generated  https://bcrypt.online/
-- bc pwd: $2y$10$Acagym.6qDUNy/iPhCycyuHVda/TyZr0azfXS0Tz7lpxxw5m5AnAy
insert into "user"(first_name, last_name, email, "password") values
('Peter','Parker','peter.parker@mail.com','$2y$10$Acagym.6qDUNy/iPhCycyuHVda/TyZr0azfXS0Tz7lpxxw5m5AnAy');

insert into "user"(first_name, last_name, email, "password") values
('Matt','Murdock','matt.murdockk@mail.com','$2a$10$QuSE6HaMk1XMmEEe259Zb.x/4izNKHawu.hPwbdX1.0dij7YBTnZW');

insert into "user"(first_name, last_name, email, "password") values
('Scott','Lang','scott.lang@mail.com','$2a$10$IERQzrdZlH83yRNSrBttp.6vLZjnPUGMRIHJHrqQmB9dOgwzRxTzm');

insert into "user"(first_name, last_name, email, "password") values
('Steve','Rogers','steve.rogers@mail.com','$2a$10$OxZeA9TP7uL5G3pRoeVhh.7F1PECaYWsM2D2SRyYqEaY5xsc9wafS');

insert into "user"(first_name, last_name, email, "password") values
('Stephen','Strange','stephen.strange@mail.com','$2a$10$OzcKd1eSiY5qrsADi3Mu9OeWaGO72Zo5dkhKXYZwFWAJCVnHCy116');

insert into "user"(first_name, last_name, email, "password") values
('Clint','Barton','clint.barton@mail.com','$2a$10$AeUIdeeZFpiqsLtmRo69Ou/sl50ziLFESYz.qyEiPqX7vG2Ggz52S');




select * from flyway_schema_history fsh ;
select * from role;
select * from "user";
select * from user_role;
/**/
--DELETE FROM "user" WHERE id = 2;



update "user" set is_admin = false where id=2;



-- get all truncatable tables
/*
SELECT table_name
    FROM information_schema.tables
    WHERE table_type='BASE TABLE'
    AND table_schema='public'
    AND table_name NOT IN ('flyway_schema_history') ;
*/


/* Truncate all tables 
DO $$
DECLARE row RECORD;
BEGIN
  FOR row IN SELECT table_name
    FROM information_schema.tables
    WHERE table_type='BASE TABLE'
    AND table_schema='public'
    AND table_name NOT IN ('flyway_schema_history') 
  LOOP 
    EXECUTE format('TRUNCATE TABLE %I CONTINUE IDENTITY CASCADE;',row.table_name);
  END LOOP;
END;
$$;
*/

/*
// Iron Man
 {        
    "firstName": "Tony",
    "lastName": "Stark",
    "email": "tony.stark@mail.com",
    "password":"tOny.s3cr3t!"
}
// Daredevil
 {        
    "firstName": "Matt",
    "lastName": "Murdock",
    "email": "matt.murdockk@mail.com",
    "password":"mA11.s3cr3t!"
}
// Ant-Man
 {        
    "firstName": "Scott",
    "lastName": "Lang",
    "email": "scott.lang@mail.com",
    "password":"s6O1.s3cr3t!"
}
//Captain America
 {        
    "firstName": "Steve",
    "lastName": "Rogers",
    "email": "steve.rogers@mail.com",
    "password":"s13V3.s3cr3t!"
}
// Doctor Strange
 {        
    "firstName": "Stephen",
    "lastName": "Strange",
    "email": "stephen.strange@mail.com",
    "password":"s13P4en.s3cr3t!"
}
//Hawkeye
 {        
    "firstName": "Clint",
    "lastName": "Barton",
    "email": "clint.barton@mail.com",
    "password":"cL1N5.s3cr3t!"
}
*/


