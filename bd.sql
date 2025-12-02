drop database oauth;

create database oauth;

use oauth;

create table users (
    id bigint primary key auto_increment,
    google_id varchar(255),
    username varchar(100) not null unique,
    email varchar(150) not null unique,
    password varchar(255),
    picture varchar(255),
    is_active boolean default false,
    created_at datetime default current_timestamp,
    updated_at datetime default current_timestamp on update current_timestamp,
    deleted_at datetime null
);

create table tokens (
    id int primary key auto_increment,
    user_id bigint not null,
    token varchar(255) not null,
    expires_at timestamp not null default (current_timestamp + interval 1 week),
    created_at timestamp default current_timestamp,

    constraint fk_user_tokens_user
        foreign key (user_id) references users(id)
        on delete cascade
);
