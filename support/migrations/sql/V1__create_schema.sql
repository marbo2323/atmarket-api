
/*
 * Tables
 * */
-- Create user table
create table "user"(
	id serial not null,
	is_admin boolean default false not null,
	first_name varchar(255) not null,
	last_name varchar(255) not null,
	email varchar(255) not null,
	password varchar(255) not null,
	created_at timestamp with time zone default ('now'::text)::timestamp with time zone not null
);

create table category(
	id serial not null,
	parent_id integer,
	name varchar(255) not null
);

-- Create article table
create table article(
	id serial not null,
	user_id integer not null,
	category_id integer not null,
	name varchar(255) not null,
	description varchar(500)	
);



/*
 * Constraints
 * */

-- user constraints
alter table  "user" add constraint  "user_pk" primary key (id);    
alter table "user" add constraint user_email_uk unique (email);  

-- category constraints
alter table category add constraint category_pk primary key (id);
alter table category add constraint category_parent_fk foreign key (parent_id) references category(id);
alter table category add constraint category_name_uk unique (name);

-- article constraints
alter table article add constraint article_pk primary key (id);
alter table article add constraint article_user_fk foreign key (user_id) references "user"(id);
alter table article add constraint article_category_fk foreign key (category_id) references category(id);



