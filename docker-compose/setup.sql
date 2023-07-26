CREATE TABLE public.users (
	id bigserial NOT NULL,
    full_name text,
    "email" varchar(255) NULL,
    password text,
    state text,
    last_login_time timestamptz NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT user_pkey PRIMARY KEY (id)
);

CREATE TABLE public.publishers (
	id bigserial NOT NULL,
    "name" text NULL,
    url text NOT NULL,
    state text NOT NULL,
    country text NOT NULL,
    create_time timestamptz NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT publishers_pkey PRIMARY KEY (id)
);

CREATE TABLE public.articles (
     id bigserial NOT NULL,
     title text NOT NULL,
     slug text NOT NULL,
     perex text NOT NULL,
     state text NOT NULL,
     create_time timestamptz NULL DEFAULT CURRENT_TIMESTAMP,
     publish_time timestamptz NULL,
     author_id bigint NULL,
     publisher_id bigint NULL,
     CONSTRAINT articles_pkey PRIMARY KEY (id),
     CONSTRAINT articles_author_id_foreign FOREIGN KEY (author_id) REFERENCES public.users(id) ON DELETE SET NULL
);

CREATE TABLE public.topics (
    id bigserial NOT NULL,
    "name" text NULL,
    is_active boolean NOT NULL,
    CONSTRAINT topics_pkey PRIMARY KEY (id)
);

CREATE TABLE public.articles_topics (
   id bigserial NOT NULL,
   article_id bigint NOT NULL,
   topic_id bigint NOT NULL,
   CONSTRAINT articles_topics_pkey PRIMARY KEY (id),
   CONSTRAINT articles_topics_topic_id_foreign FOREIGN KEY (topic_id) REFERENCES public.topics(id) ON DELETE SET NULL,
   CONSTRAINT articles_topics_article_id_foreign FOREIGN KEY (article_id) REFERENCES public.articles(id) ON DELETE SET NULL
);
