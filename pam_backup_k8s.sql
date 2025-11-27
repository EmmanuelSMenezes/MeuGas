--
-- PostgreSQL database dump
--

\restrict J7QbzAq3f0qaDRln72wN7VcjqBtxGZXXLZJ5pPowFBwnu0XDAVGJ2tciYwS2GZc

-- Dumped from database version 17.2 (Debian 17.2-1.pgdg110+1)
-- Dumped by pg_dump version 17.7

SET statement_timeout = 0;
SET lock_timeout = 0;
SET idle_in_transaction_session_timeout = 0;
SET transaction_timeout = 0;
SET client_encoding = 'UTF8';
SET standard_conforming_strings = on;
SELECT pg_catalog.set_config('search_path', '', false);
SET check_function_bodies = false;
SET xmloption = content;
SET client_min_messages = warning;
SET row_security = off;

--
-- Name: administrator; Type: SCHEMA; Schema: -; Owner: postgres
--

CREATE SCHEMA administrator;


ALTER SCHEMA administrator OWNER TO postgres;

--
-- Name: authentication; Type: SCHEMA; Schema: -; Owner: postgres
--

CREATE SCHEMA authentication;


ALTER SCHEMA authentication OWNER TO postgres;

--
-- Name: billing; Type: SCHEMA; Schema: -; Owner: postgres
--

CREATE SCHEMA billing;


ALTER SCHEMA billing OWNER TO postgres;

--
-- Name: catalog; Type: SCHEMA; Schema: -; Owner: postgres
--

CREATE SCHEMA catalog;


ALTER SCHEMA catalog OWNER TO postgres;

--
-- Name: communication; Type: SCHEMA; Schema: -; Owner: postgres
--

CREATE SCHEMA communication;


ALTER SCHEMA communication OWNER TO postgres;

--
-- Name: consumer; Type: SCHEMA; Schema: -; Owner: postgres
--

CREATE SCHEMA consumer;


ALTER SCHEMA consumer OWNER TO postgres;

--
-- Name: logistics; Type: SCHEMA; Schema: -; Owner: postgres
--

CREATE SCHEMA logistics;


ALTER SCHEMA logistics OWNER TO postgres;

--
-- Name: orders; Type: SCHEMA; Schema: -; Owner: postgres
--

CREATE SCHEMA orders;


ALTER SCHEMA orders OWNER TO postgres;

--
-- Name: partner; Type: SCHEMA; Schema: -; Owner: postgres
--

CREATE SCHEMA partner;


ALTER SCHEMA partner OWNER TO postgres;

--
-- Name: report; Type: SCHEMA; Schema: -; Owner: postgres
--

CREATE SCHEMA report;


ALTER SCHEMA report OWNER TO postgres;

--
-- Name: reputation; Type: SCHEMA; Schema: -; Owner: postgres
--

CREATE SCHEMA reputation;


ALTER SCHEMA reputation OWNER TO postgres;

--
-- Name: cube; Type: EXTENSION; Schema: -; Owner: -
--

CREATE EXTENSION IF NOT EXISTS cube WITH SCHEMA logistics;


--
-- Name: EXTENSION cube; Type: COMMENT; Schema: -; Owner: 
--

COMMENT ON EXTENSION cube IS 'data type for multidimensional cubes';


--
-- Name: earthdistance; Type: EXTENSION; Schema: -; Owner: -
--

CREATE EXTENSION IF NOT EXISTS earthdistance WITH SCHEMA logistics;


--
-- Name: EXTENSION earthdistance; Type: COMMENT; Schema: -; Owner: 
--

COMMENT ON EXTENSION earthdistance IS 'calculate great-circle distances on the surface of the Earth';


--
-- Name: postgis; Type: EXTENSION; Schema: -; Owner: -
--

CREATE EXTENSION IF NOT EXISTS postgis WITH SCHEMA logistics;


--
-- Name: EXTENSION postgis; Type: COMMENT; Schema: -; Owner: 
--

COMMENT ON EXTENSION postgis IS 'PostGIS geometry and geography spatial types and functions';


--
-- Name: unaccent; Type: EXTENSION; Schema: -; Owner: -
--

CREATE EXTENSION IF NOT EXISTS unaccent WITH SCHEMA public;


--
-- Name: EXTENSION unaccent; Type: COMMENT; Schema: -; Owner: 
--

COMMENT ON EXTENSION unaccent IS 'text search dictionary that removes accents';


--
-- Name: uuid-ossp; Type: EXTENSION; Schema: -; Owner: -
--

CREATE EXTENSION IF NOT EXISTS "uuid-ossp" WITH SCHEMA authentication;


--
-- Name: EXTENSION "uuid-ossp"; Type: COMMENT; Schema: -; Owner: 
--

COMMENT ON EXTENSION "uuid-ossp" IS 'generate universally unique identifiers (UUIDs)';


--
-- Name: earth; Type: DOMAIN; Schema: public; Owner: postgres
--

CREATE DOMAIN public.earth AS logistics.cube
	CONSTRAINT not_3d CHECK ((logistics.cube_dim(VALUE) <= 3))
	CONSTRAINT not_point CHECK (logistics.cube_is_point(VALUE))
	CONSTRAINT on_surface CHECK ((abs(((logistics.cube_distance(VALUE, '(0)'::logistics.cube) / logistics.earth()) - '1'::double precision)) < '1e-06'::double precision));


ALTER DOMAIN public.earth OWNER TO postgres;

--
-- Name: uuid_generate_v4(); Type: FUNCTION; Schema: billing; Owner: postgres
--





--
-- Name: uuid_generate_v4(); Type: FUNCTION; Schema: catalog; Owner: postgres
--





--
-- Name: distancia_km(numeric, numeric, numeric, numeric); Type: FUNCTION; Schema: logistics; Owner: postgres
--





--
-- Name: uuid_generate_v4(); Type: FUNCTION; Schema: partner; Owner: postgres
--





--
-- Name: uuid_generate_v4(); Type: FUNCTION; Schema: report; Owner: postgres
--





--
-- Name: uuid_generate_v4(); Type: FUNCTION; Schema: reputation; Owner: postgres
--





SET default_tablespace = '';

SET default_table_access_method = heap;

--
-- Name: administrator; Type: TABLE; Schema: administrator; Owner: postgres
--

CREATE TABLE administrator.administrator (
    admin_id uuid DEFAULT public.uuid_generate_v4() NOT NULL,
    user_id uuid NOT NULL
);


ALTER TABLE administrator.administrator OWNER TO postgres;

--
-- Name: interest_rate_setting; Type: TABLE; Schema: administrator; Owner: postgres
--

CREATE TABLE administrator.interest_rate_setting (
    interest_rate_setting_id uuid DEFAULT public.uuid_generate_v4() NOT NULL,
    admin_id uuid NOT NULL,
    service_fee numeric(4,2) NOT NULL,
    card_fee numeric(4,2) NOT NULL,
    created_by uuid,
    created_at timestamp without time zone DEFAULT CURRENT_TIMESTAMP,
    updated_by uuid,
    updated_at timestamp without time zone
);


ALTER TABLE administrator.interest_rate_setting OWNER TO postgres;

--
-- Name: collaborator; Type: TABLE; Schema: authentication; Owner: postgres
--

CREATE TABLE authentication.collaborator (
    collaborator_id uuid DEFAULT public.uuid_generate_v4() NOT NULL,
    active boolean DEFAULT true,
    user_id uuid NOT NULL,
    sponsor_id uuid NOT NULL,
    created_at timestamp without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
    updated_at timestamp without time zone,
    phone_verified boolean DEFAULT false,
    created_by uuid NOT NULL
);


ALTER TABLE authentication.collaborator OWNER TO postgres;

--
-- Name: otp; Type: TABLE; Schema: authentication; Owner: postgres
--

CREATE TABLE authentication.otp (
    otp_id uuid DEFAULT public.uuid_generate_v4() NOT NULL,
    user_id uuid NOT NULL,
    otp character varying NOT NULL,
    expiry timestamp without time zone NOT NULL,
    used boolean DEFAULT false,
    created_at timestamp without time zone DEFAULT CURRENT_TIMESTAMP,
    updated_at timestamp without time zone,
    type integer NOT NULL
);


ALTER TABLE authentication.otp OWNER TO postgres;

--
-- Name: profile; Type: TABLE; Schema: authentication; Owner: postgres
--

CREATE TABLE authentication.profile (
    profile_id uuid DEFAULT public.uuid_generate_v4() NOT NULL,
    fullname character varying(255) NOT NULL,
    avatar character varying(400),
    document character varying(14) NOT NULL,
    active boolean DEFAULT true,
    created_at timestamp without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
    deleted_at timestamp without time zone,
    updated_at timestamp without time zone,
    user_id uuid NOT NULL
);


ALTER TABLE authentication.profile OWNER TO postgres;

--
-- Name: role; Type: TABLE; Schema: authentication; Owner: postgres
--

CREATE TABLE authentication.role (
    role_id uuid DEFAULT public.uuid_generate_v4() NOT NULL,
    description character varying(45) NOT NULL,
    tag character varying(6) NOT NULL,
    active boolean DEFAULT true,
    created_at timestamp without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
    deleted_at timestamp without time zone,
    updated_at timestamp without time zone
);


ALTER TABLE authentication.role OWNER TO postgres;

--
-- Name: user; Type: TABLE; Schema: authentication; Owner: postgres
--

CREATE TABLE authentication."user" (
    user_id uuid DEFAULT public.uuid_generate_v4() NOT NULL,
    email character varying(255) NOT NULL,
    phone character varying(11),
    password character varying(400) NOT NULL,
    active boolean DEFAULT true,
    password_generated boolean,
    last_login timestamp without time zone,
    created_at timestamp without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
    deleted_at timestamp without time zone,
    updated_at timestamp without time zone,
    role_id uuid NOT NULL,
    phone_verified boolean DEFAULT false
);


ALTER TABLE authentication."user" OWNER TO postgres;

--
-- Name: access_token_history; Type: TABLE; Schema: billing; Owner: postgres
--

CREATE TABLE billing.access_token_history (
    access_token_history_id uuid DEFAULT public.uuid_generate_v4() NOT NULL,
    response json NOT NULL,
    partner_id uuid NOT NULL,
    created_by uuid NOT NULL,
    created_at timestamp without time zone DEFAULT now() NOT NULL
);


ALTER TABLE billing.access_token_history OWNER TO postgres;

--
-- Name: identifier_billing_payment_options; Type: SEQUENCE; Schema: billing; Owner: postgres
--

CREATE SEQUENCE billing.identifier_billing_payment_options
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE billing.identifier_billing_payment_options OWNER TO postgres;

--
-- Name: pagseguro_value_minimum; Type: TABLE; Schema: billing; Owner: postgres
--

CREATE TABLE billing.pagseguro_value_minimum (
    pagseguro_value_minimum_id uuid DEFAULT public.uuid_generate_v4() NOT NULL,
    partner_id uuid NOT NULL,
    value_minimum_standard numeric DEFAULT 8 NOT NULL,
    value_minimum numeric DEFAULT 8 NOT NULL,
    created_by uuid NOT NULL,
    created_at timestamp without time zone DEFAULT now(),
    updated_by uuid,
    updated_at timestamp without time zone
);


ALTER TABLE billing.pagseguro_value_minimum OWNER TO postgres;

--
-- Name: payment; Type: TABLE; Schema: billing; Owner: postgres
--

CREATE TABLE billing.payment (
    payment_id uuid DEFAULT public.uuid_generate_v4() NOT NULL,
    payment_options_id uuid NOT NULL,
    order_id uuid NOT NULL,
    created_by uuid NOT NULL,
    created_at timestamp without time zone DEFAULT CURRENT_TIMESTAMP,
    updated_by uuid,
    updated_at timestamp without time zone,
    installments integer DEFAULT 1,
    amount_paid numeric,
    payment_situation_id uuid DEFAULT '28571130-38e5-4e58-ba91-883bb9c2cae3'::uuid NOT NULL
);


ALTER TABLE billing.payment OWNER TO postgres;

--
-- Name: payment_history; Type: TABLE; Schema: billing; Owner: postgres
--

CREATE TABLE billing.payment_history (
    pagseguro_id uuid DEFAULT public.uuid_generate_v4() NOT NULL,
    order_id uuid NOT NULL,
    response json NOT NULL,
    status integer NOT NULL,
    request json,
    created_at timestamp without time zone
);


ALTER TABLE billing.payment_history OWNER TO postgres;

--
-- Name: payment_local; Type: TABLE; Schema: billing; Owner: postgres
--

CREATE TABLE billing.payment_local (
    payment_local_id uuid DEFAULT public.uuid_generate_v4() NOT NULL,
    payment_local_name character varying(100) NOT NULL
);


ALTER TABLE billing.payment_local OWNER TO postgres;

--
-- Name: payment_options; Type: TABLE; Schema: billing; Owner: postgres
--

CREATE TABLE billing.payment_options (
    payment_options_id uuid DEFAULT public.uuid_generate_v4() NOT NULL,
    identifier integer DEFAULT nextval('billing.identifier_billing_payment_options'::regclass) NOT NULL,
    description character varying NOT NULL,
    active boolean DEFAULT true NOT NULL,
    created_by uuid NOT NULL,
    created_at timestamp without time zone DEFAULT CURRENT_TIMESTAMP,
    updated_by uuid,
    updated_at date
);


ALTER TABLE billing.payment_options OWNER TO postgres;

--
-- Name: payment_options_local; Type: TABLE; Schema: billing; Owner: postgres
--

CREATE TABLE billing.payment_options_local (
    payment_options_local_id uuid DEFAULT public.uuid_generate_v4() NOT NULL,
    payment_local_id uuid NOT NULL,
    created_by uuid NOT NULL,
    created_at timestamp without time zone DEFAULT now(),
    updated_by uuid,
    updated_at timestamp without time zone,
    payment_options_id uuid NOT NULL
);


ALTER TABLE billing.payment_options_local OWNER TO postgres;

--
-- Name: payment_order; Type: TABLE; Schema: billing; Owner: postgres
--

CREATE TABLE billing.payment_order (
    payment_order_id uuid DEFAULT public.uuid_generate_v4() NOT NULL,
    order_id uuid NOT NULL,
    amount_paid numeric(5,2) NOT NULL,
    created_by uuid NOT NULL,
    created_at timestamp without time zone DEFAULT CURRENT_TIMESTAMP,
    updated_by uuid,
    updated_at timestamp without time zone,
    payment_situation_id uuid DEFAULT '28571130-38e5-4e58-ba91-883bb9c2cae3'::uuid NOT NULL
);


ALTER TABLE billing.payment_order OWNER TO postgres;

--
-- Name: payment_situation; Type: TABLE; Schema: billing; Owner: postgres
--

CREATE TABLE billing.payment_situation (
    payment_situation_id uuid DEFAULT public.uuid_generate_v4() NOT NULL,
    description character varying NOT NULL,
    active boolean DEFAULT true NOT NULL,
    created_by uuid NOT NULL,
    created_at timestamp without time zone DEFAULT CURRENT_TIMESTAMP,
    updated_by uuid,
    updated_at timestamp without time zone
);


ALTER TABLE billing.payment_situation OWNER TO postgres;

--
-- Name: identifier_product; Type: SEQUENCE; Schema: catalog; Owner: postgres
--

CREATE SEQUENCE catalog.identifier_product
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE catalog.identifier_product OWNER TO postgres;

--
-- Name: base_product; Type: TABLE; Schema: catalog; Owner: postgres
--

CREATE TABLE catalog.base_product (
    product_id uuid DEFAULT public.uuid_generate_v4() NOT NULL,
    name character varying NOT NULL,
    minimum_price numeric(9,2),
    description character varying,
    note character varying,
    created_by uuid NOT NULL,
    created_at timestamp without time zone DEFAULT CURRENT_TIMESTAMP,
    updated_by uuid,
    updated_at timestamp without time zone,
    identifier integer DEFAULT nextval('catalog.identifier_product'::regclass),
    active boolean DEFAULT true NOT NULL,
    type character varying NOT NULL,
    admin_id uuid NOT NULL,
    url character varying
);


ALTER TABLE catalog.base_product OWNER TO postgres;

--
-- Name: identifier_category; Type: SEQUENCE; Schema: catalog; Owner: postgres
--

CREATE SEQUENCE catalog.identifier_category
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE catalog.identifier_category OWNER TO postgres;

--
-- Name: category; Type: TABLE; Schema: catalog; Owner: postgres
--

CREATE TABLE catalog.category (
    category_id uuid DEFAULT public.uuid_generate_v4() NOT NULL,
    identifier integer DEFAULT nextval('catalog.identifier_category'::regclass),
    description character varying(60) NOT NULL,
    category_parent_id uuid,
    created_by uuid NOT NULL,
    updated_by uuid,
    created_at timestamp without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
    updated_at timestamp without time zone,
    active boolean DEFAULT true NOT NULL
);


ALTER TABLE catalog.category OWNER TO postgres;

--
-- Name: category_base_product; Type: TABLE; Schema: catalog; Owner: postgres
--

CREATE TABLE catalog.category_base_product (
    category_base_product_id uuid DEFAULT public.uuid_generate_v4() NOT NULL,
    category_id uuid NOT NULL,
    product_id uuid NOT NULL,
    created_by uuid NOT NULL,
    created_at timestamp without time zone DEFAULT CURRENT_TIMESTAMP,
    updated_by uuid,
    updated_at timestamp without time zone,
    category_parent_id uuid
);


ALTER TABLE catalog.category_base_product OWNER TO postgres;

--
-- Name: identifier_product_partner; Type: SEQUENCE; Schema: catalog; Owner: postgres
--

CREATE SEQUENCE catalog.identifier_product_partner
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE catalog.identifier_product_partner OWNER TO postgres;

--
-- Name: input; Type: TABLE; Schema: catalog; Owner: postgres
--

CREATE TABLE catalog.input (
    input_id uuid DEFAULT public.uuid_generate_v4() NOT NULL,
    name character varying(60) NOT NULL,
    created_by uuid NOT NULL,
    created_at timestamp without time zone DEFAULT CURRENT_TIMESTAMP,
    update_by uuid,
    update_at timestamp without time zone,
    product_id uuid NOT NULL,
    editable boolean NOT NULL,
    enable boolean NOT NULL
);


ALTER TABLE catalog.input OWNER TO postgres;

--
-- Name: product; Type: TABLE; Schema: catalog; Owner: postgres
--

CREATE TABLE catalog.product (
    product_id uuid DEFAULT public.uuid_generate_v4() NOT NULL,
    base_product_id uuid NOT NULL,
    image_default uuid,
    description character varying,
    price numeric(9,2) NOT NULL,
    created_by uuid NOT NULL,
    created_at timestamp without time zone DEFAULT CURRENT_TIMESTAMP,
    updated_by uuid,
    updated_at timestamp without time zone,
    active boolean DEFAULT false NOT NULL,
    name character varying NOT NULL,
    identifier integer DEFAULT nextval('catalog.identifier_product_partner'::regclass) NOT NULL,
    sale_price numeric(9,2) DEFAULT 0,
    reviewer boolean DEFAULT false NOT NULL
);


ALTER TABLE catalog.product OWNER TO postgres;

--
-- Name: product_branch; Type: TABLE; Schema: catalog; Owner: postgres
--

CREATE TABLE catalog.product_branch (
    product_branch_id uuid DEFAULT public.uuid_generate_v4() NOT NULL,
    product_id uuid NOT NULL,
    branch_id uuid NOT NULL,
    created_by uuid NOT NULL,
    created_at timestamp without time zone DEFAULT CURRENT_TIMESTAMP,
    updated_by uuid,
    updated_at timestamp without time zone
);


ALTER TABLE catalog.product_branch OWNER TO postgres;

--
-- Name: product_image; Type: TABLE; Schema: catalog; Owner: postgres
--

CREATE TABLE catalog.product_image (
    product_image_id uuid DEFAULT public.uuid_generate_v4() NOT NULL,
    url character varying NOT NULL,
    created_by uuid NOT NULL,
    created_at timestamp without time zone DEFAULT CURRENT_TIMESTAMP,
    updated_by uuid,
    updated_at timestamp without time zone
);


ALTER TABLE catalog.product_image OWNER TO postgres;

--
-- Name: product_image_product; Type: TABLE; Schema: catalog; Owner: postgres
--

CREATE TABLE catalog.product_image_product (
    product_image_product_id uuid DEFAULT public.uuid_generate_v4() NOT NULL,
    product_id uuid NOT NULL,
    product_image_id uuid NOT NULL,
    created_by uuid NOT NULL,
    created_at timestamp without time zone DEFAULT CURRENT_TIMESTAMP,
    updated_by uuid,
    updated_at timestamp without time zone
);


ALTER TABLE catalog.product_image_product OWNER TO postgres;

--
-- Name: chat; Type: TABLE; Schema: communication; Owner: postgres
--

CREATE TABLE communication.chat (
    chat_id uuid DEFAULT public.uuid_generate_v4() NOT NULL,
    description character varying(100) NOT NULL,
    created_at timestamp without time zone DEFAULT CURRENT_TIMESTAMP,
    updated_at timestamp without time zone,
    created_by uuid NOT NULL,
    closed timestamp without time zone,
    closed_by uuid,
    order_id uuid
);


ALTER TABLE communication.chat OWNER TO postgres;

--
-- Name: chat_member; Type: TABLE; Schema: communication; Owner: postgres
--

CREATE TABLE communication.chat_member (
    chat_member_id uuid DEFAULT public.uuid_generate_v4() NOT NULL,
    chat_id uuid NOT NULL,
    user_id uuid,
    created_at timestamp without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL
);


ALTER TABLE communication.chat_member OWNER TO postgres;

--
-- Name: message; Type: TABLE; Schema: communication; Owner: postgres
--

CREATE TABLE communication.message (
    message_id uuid DEFAULT public.uuid_generate_v4() NOT NULL,
    chat_id uuid NOT NULL,
    created_by uuid NOT NULL,
    sender_id uuid,
    message_type uuid NOT NULL,
    read_at timestamp without time zone,
    created_at timestamp without time zone DEFAULT CURRENT_TIMESTAMP,
    content character varying NOT NULL
);


ALTER TABLE communication.message OWNER TO postgres;

--
-- Name: message_type; Type: TABLE; Schema: communication; Owner: postgres
--

CREATE TABLE communication.message_type (
    message_type_id uuid DEFAULT public.uuid_generate_v4() NOT NULL,
    description character varying NOT NULL,
    tag character varying NOT NULL
);


ALTER TABLE communication.message_type OWNER TO postgres;

--
-- Name: notification; Type: TABLE; Schema: communication; Owner: postgres
--

CREATE TABLE communication.notification (
    notification_id uuid DEFAULT public.uuid_generate_v4() NOT NULL,
    title character varying NOT NULL,
    description character varying NOT NULL,
    read_at timestamp without time zone,
    user_id uuid NOT NULL,
    type character varying DEFAULT 'INFO'::character varying NOT NULL,
    aux_content character varying,
    created_at timestamp without time zone DEFAULT CURRENT_TIMESTAMP
);


ALTER TABLE communication.notification OWNER TO postgres;

--
-- Name: address; Type: TABLE; Schema: consumer; Owner: postgres
--

CREATE TABLE consumer.address (
    address_id uuid DEFAULT public.uuid_generate_v4() NOT NULL,
    street character varying(200) NOT NULL,
    number character varying(5) NOT NULL,
    complement character varying(200),
    district character varying(50) NOT NULL,
    city character varying(50) NOT NULL,
    state character varying(100) NOT NULL,
    zip_code character varying(8) NOT NULL,
    active boolean DEFAULT true NOT NULL,
    created_at timestamp without time zone DEFAULT CURRENT_TIMESTAMP,
    deleted_at timestamp without time zone,
    updated_at timestamp without time zone,
    latitude character varying,
    longitude character varying,
    consumer_id uuid NOT NULL,
    description character varying NOT NULL
);


ALTER TABLE consumer.address OWNER TO postgres;

--
-- Name: card; Type: TABLE; Schema: consumer; Owner: postgres
--

CREATE TABLE consumer.card (
    card_id uuid DEFAULT public.uuid_generate_v4() NOT NULL,
    consumer_id uuid NOT NULL,
    number character varying NOT NULL,
    validity character varying(7) NOT NULL,
    active boolean DEFAULT true NOT NULL,
    created_by uuid,
    created_at timestamp without time zone DEFAULT CURRENT_TIMESTAMP,
    updated_by uuid,
    updated_at timestamp without time zone,
    name character varying NOT NULL,
    document character varying NOT NULL,
    encrypted character varying
);


ALTER TABLE consumer.card OWNER TO postgres;

--
-- Name: consumer; Type: TABLE; Schema: consumer; Owner: postgres
--

CREATE TABLE consumer.consumer (
    consumer_id uuid DEFAULT public.uuid_generate_v4() NOT NULL,
    legal_name character varying(200) NOT NULL,
    fantasy_name character varying(100),
    document character varying(14) NOT NULL,
    email character varying(100) NOT NULL,
    phone_number character varying(11) NOT NULL,
    active boolean DEFAULT true,
    created_at timestamp without time zone DEFAULT CURRENT_TIMESTAMP,
    deleted_at timestamp without time zone,
    updated_at timestamp without time zone,
    user_id uuid NOT NULL,
    default_address uuid
);


ALTER TABLE consumer.consumer OWNER TO postgres;

--
-- Name: style_consumer; Type: TABLE; Schema: consumer; Owner: postgres
--

CREATE TABLE consumer.style_consumer (
    style_consumer_id uuid DEFAULT public.uuid_generate_v4() NOT NULL,
    "primary" character varying,
    text character varying,
    primarybackground character varying DEFAULT 'hsl(0, 0%, 90.9%)'::character varying,
    secondary character varying DEFAULT '#D5573B'::character varying,
    black character varying DEFAULT '#242424'::character varying,
    gray character varying DEFAULT '#707070'::character varying,
    lightgray character varying DEFAULT 'hsl(0, 0%, 94.9%)'::character varying,
    white character varying DEFAULT '#fff'::character varying,
    background character varying DEFAULT '#fbfbfb'::character varying,
    shadow character varying DEFAULT '#00000020'::character varying,
    shadowprimary character varying DEFAULT '#007EA715'::character varying,
    success character varying DEFAULT '#03ac13'::character varying,
    danger character varying DEFAULT '#ca3433'::character varying,
    warning character varying DEFAULT '#ffbb33'::character varying,
    blue character varying DEFAULT '#007EA7'::character varying,
    shadowblue character varying DEFAULT '#007EA715'::character varying,
    gold character varying DEFAULT '#fe7914'::character varying,
    orange character varying DEFAULT '#FFA500'::character varying,
    light_italic character varying DEFAULT 'Poppins_300Light_Italic'::character varying,
    light character varying DEFAULT 'Poppins_300Light'::character varying,
    italic character varying DEFAULT 'Poppins_400Regular_Italic'::character varying,
    regular character varying DEFAULT 'Poppins_400Regular'::character varying,
    medium character varying DEFAULT 'Poppins_500Medium'::character varying,
    bold character varying DEFAULT 'Poppins_700Bold'::character varying,
    created_by uuid NOT NULL,
    created_at timestamp without time zone DEFAULT CURRENT_TIMESTAMP,
    updated_by uuid,
    updated_at timestamp without time zone,
    admin_id uuid NOT NULL
);


ALTER TABLE consumer.style_consumer OWNER TO postgres;

--
-- Name: actuation_area; Type: TABLE; Schema: logistics; Owner: postgres
--

CREATE TABLE logistics.actuation_area (
    actuation_area_id uuid DEFAULT public.uuid_generate_v4() NOT NULL,
    geometry text NOT NULL,
    partner_id uuid NOT NULL,
    created_by uuid NOT NULL,
    created_at timestamp without time zone DEFAULT CURRENT_TIMESTAMP,
    updated_at timestamp without time zone,
    active boolean DEFAULT true NOT NULL,
    name character varying NOT NULL,
    updated_by uuid,
    branch_id uuid NOT NULL
);


ALTER TABLE logistics.actuation_area OWNER TO postgres;

--
-- Name: actuation_area_config; Type: TABLE; Schema: logistics; Owner: postgres
--

CREATE TABLE logistics.actuation_area_config (
    actuation_area_config_id uuid DEFAULT public.uuid_generate_v4() NOT NULL,
    actuation_area_id uuid NOT NULL,
    start_hour character varying(5) NOT NULL,
    end_hour character varying(5) NOT NULL,
    created_at timestamp without time zone DEFAULT CURRENT_TIMESTAMP,
    updated_at date,
    created_by uuid NOT NULL,
    updated_by uuid
);


ALTER TABLE logistics.actuation_area_config OWNER TO postgres;

--
-- Name: actuation_area_delivery_option; Type: TABLE; Schema: logistics; Owner: postgres
--

CREATE TABLE logistics.actuation_area_delivery_option (
    delivery_option_id uuid DEFAULT public.uuid_generate_v4() NOT NULL,
    name character varying NOT NULL,
    created_by uuid NOT NULL,
    created_at timestamp without time zone DEFAULT CURRENT_TIMESTAMP,
    updated_by uuid,
    updated_at timestamp without time zone,
    active boolean DEFAULT true NOT NULL
);


ALTER TABLE logistics.actuation_area_delivery_option OWNER TO postgres;

--
-- Name: actuation_area_payments; Type: TABLE; Schema: logistics; Owner: postgres
--

CREATE TABLE logistics.actuation_area_payments (
    actuation_area_payments_id uuid DEFAULT public.uuid_generate_v4() NOT NULL,
    actuation_area_config_id uuid NOT NULL,
    payment_options_id uuid NOT NULL,
    active boolean DEFAULT true,
    created_by uuid NOT NULL,
    created_at timestamp without time zone DEFAULT now(),
    updated_by uuid,
    updated_at timestamp without time zone
);


ALTER TABLE logistics.actuation_area_payments OWNER TO postgres;

--
-- Name: actuation_area_shipping; Type: TABLE; Schema: logistics; Owner: postgres
--

CREATE TABLE logistics.actuation_area_shipping (
    actuation_area_shipping_id uuid DEFAULT public.uuid_generate_v4() NOT NULL,
    actuation_area_config_id uuid NOT NULL,
    delivery_option_id uuid NOT NULL,
    created_by uuid NOT NULL,
    created_at timestamp without time zone DEFAULT CURRENT_TIMESTAMP,
    updated_by uuid,
    updated_at timestamp without time zone,
    value numeric DEFAULT 0 NOT NULL,
    active boolean DEFAULT true NOT NULL,
    shipping_free boolean
);


ALTER TABLE logistics.actuation_area_shipping OWNER TO postgres;

--
-- Name: working_day; Type: TABLE; Schema: logistics; Owner: postgres
--

CREATE TABLE logistics.working_day (
    working_day_id uuid DEFAULT public.uuid_generate_v4() NOT NULL,
    day_number integer NOT NULL,
    created_by uuid NOT NULL,
    created_at timestamp without time zone DEFAULT CURRENT_TIMESTAMP,
    actuation_area_config_id uuid NOT NULL,
    updated_by uuid,
    updated_at timestamp without time zone
);


ALTER TABLE logistics.working_day OWNER TO postgres;

--
-- Name: address; Type: TABLE; Schema: orders; Owner: postgres
--

CREATE TABLE orders.address (
    address_id uuid DEFAULT public.uuid_generate_v4() NOT NULL,
    street character varying(200) NOT NULL,
    number character varying(5) NOT NULL,
    complement character varying(200),
    district character varying(50) NOT NULL,
    city character varying(50) NOT NULL,
    state character varying(100) NOT NULL,
    zip_code character varying(8) NOT NULL,
    active boolean DEFAULT true NOT NULL,
    created_at timestamp without time zone DEFAULT CURRENT_TIMESTAMP,
    updated_at timestamp without time zone,
    latitude character varying(20),
    longitude character varying(20)
);


ALTER TABLE orders.address OWNER TO postgres;

--
-- Name: order_branch; Type: TABLE; Schema: orders; Owner: postgres
--

CREATE TABLE orders.order_branch (
    order_branch_id uuid DEFAULT public.uuid_generate_v4() NOT NULL,
    order_id uuid NOT NULL,
    branch_id uuid NOT NULL,
    branch_name character varying NOT NULL,
    document character varying NOT NULL,
    partner_id uuid,
    phone character varying NOT NULL
);


ALTER TABLE orders.order_branch OWNER TO postgres;

--
-- Name: order_consumer; Type: TABLE; Schema: orders; Owner: postgres
--

CREATE TABLE orders.order_consumer (
    order_address_id uuid DEFAULT public.uuid_generate_v4() NOT NULL,
    order_id uuid NOT NULL,
    address_id uuid,
    street character varying NOT NULL,
    number character varying NOT NULL,
    complement character varying,
    district character varying NOT NULL,
    city character varying NOT NULL,
    state character varying NOT NULL,
    zip_code character varying NOT NULL,
    latitude character varying,
    longitude character varying,
    consumer_id uuid NOT NULL,
    legal_name character varying NOT NULL,
    fantasy_name character varying NOT NULL,
    document character varying NOT NULL,
    email character varying NOT NULL,
    phone_number character varying NOT NULL
);


ALTER TABLE orders.order_consumer OWNER TO postgres;

--
-- Name: order_number; Type: SEQUENCE; Schema: orders; Owner: postgres
--

CREATE SEQUENCE orders.order_number
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE orders.order_number OWNER TO postgres;

--
-- Name: order_shipping; Type: TABLE; Schema: orders; Owner: postgres
--

CREATE TABLE orders.order_shipping (
    order_shipping_id uuid DEFAULT public.uuid_generate_v4() NOT NULL,
    order_id uuid NOT NULL,
    delivery_option_id uuid NOT NULL,
    name character varying NOT NULL,
    value numeric NOT NULL,
    created_by uuid NOT NULL,
    created_at timestamp without time zone DEFAULT CURRENT_TIMESTAMP,
    updated_by uuid,
    updated_at timestamp without time zone,
    shipping_free boolean NOT NULL
);


ALTER TABLE orders.order_shipping OWNER TO postgres;

--
-- Name: orders; Type: TABLE; Schema: orders; Owner: postgres
--

CREATE TABLE orders.orders (
    order_id uuid DEFAULT public.uuid_generate_v4() NOT NULL,
    order_number bigint DEFAULT nextval('orders.order_number'::regclass) NOT NULL,
    freight numeric,
    amount numeric,
    address_id uuid,
    observation character varying,
    created_at timestamp without time zone DEFAULT now(),
    shipping_company_id uuid,
    order_status_id uuid DEFAULT 'd71cb62a-28dd-44a8-a008-9d7d7d1af810'::uuid NOT NULL,
    updated_at timestamp without time zone,
    created_by uuid NOT NULL,
    updated_by uuid,
    branch_id uuid,
    change numeric,
    consumer_id uuid NOT NULL,
    service_fee numeric(4,2) NOT NULL,
    card_fee numeric(4,2) NOT NULL
);


ALTER TABLE orders.orders OWNER TO postgres;

--
-- Name: orders_itens; Type: TABLE; Schema: orders; Owner: postgres
--

CREATE TABLE orders.orders_itens (
    order_item_id uuid DEFAULT public.uuid_generate_v4() NOT NULL,
    product_name character varying(200) NOT NULL,
    quantity integer DEFAULT 1 NOT NULL,
    product_value numeric,
    product_id uuid NOT NULL,
    order_id uuid NOT NULL
);


ALTER TABLE orders.orders_itens OWNER TO postgres;

--
-- Name: orders_status; Type: TABLE; Schema: orders; Owner: postgres
--

CREATE TABLE orders.orders_status (
    order_status_id uuid DEFAULT public.uuid_generate_v4() NOT NULL,
    name character varying NOT NULL,
    active boolean DEFAULT true NOT NULL,
    created_by uuid NOT NULL,
    created_at timestamp without time zone DEFAULT CURRENT_TIMESTAMP,
    update_by uuid,
    updated_at character varying
);


ALTER TABLE orders.orders_status OWNER TO postgres;

--
-- Name: orders_status_history; Type: TABLE; Schema: orders; Owner: postgres
--

CREATE TABLE orders.orders_status_history (
    order_status_history_id uuid DEFAULT public.uuid_generate_v4() NOT NULL,
    order_id uuid NOT NULL,
    order_status_id uuid NOT NULL,
    created_by uuid NOT NULL,
    created_at timestamp without time zone DEFAULT CURRENT_TIMESTAMP,
    updated_by uuid,
    updated_at timestamp without time zone
);


ALTER TABLE orders.orders_status_history OWNER TO postgres;

--
-- Name: shipping_company; Type: TABLE; Schema: orders; Owner: postgres
--

CREATE TABLE orders.shipping_company (
    shipping_company_id uuid DEFAULT public.uuid_generate_v4() NOT NULL,
    company_name character varying(200) NOT NULL,
    document character varying(20) NOT NULL,
    address_id uuid NOT NULL
);


ALTER TABLE orders.shipping_company OWNER TO postgres;

--
-- Name: address; Type: TABLE; Schema: partner; Owner: postgres
--

CREATE TABLE partner.address (
    address_id uuid DEFAULT public.uuid_generate_v4() NOT NULL,
    street character varying(200) NOT NULL,
    number character varying(5) NOT NULL,
    complement character varying(200),
    district character varying(50) NOT NULL,
    city character varying(50) NOT NULL,
    state character varying(100) NOT NULL,
    zip_code character varying NOT NULL,
    active boolean DEFAULT true NOT NULL,
    created_at timestamp without time zone DEFAULT CURRENT_TIMESTAMP,
    updated_at timestamp without time zone,
    latitude character varying,
    longitude character varying,
    branch_id uuid NOT NULL,
    created_by uuid NOT NULL,
    updated_by uuid
);


ALTER TABLE partner.address OWNER TO postgres;

--
-- Name: bank_details; Type: TABLE; Schema: partner; Owner: postgres
--

CREATE TABLE partner.bank_details (
    bank_details_id uuid DEFAULT public.uuid_generate_v4() NOT NULL,
    partner_id uuid NOT NULL,
    bank character varying,
    agency character varying,
    account_number character varying,
    active boolean DEFAULT true,
    created_by uuid,
    created_at timestamp without time zone DEFAULT CURRENT_TIMESTAMP,
    updated_by uuid,
    updated_at timestamp without time zone,
    account_id character varying
);


ALTER TABLE partner.bank_details OWNER TO postgres;

--
-- Name: branch; Type: TABLE; Schema: partner; Owner: postgres
--

CREATE TABLE partner.branch (
    branch_id uuid DEFAULT public.uuid_generate_v4() NOT NULL,
    branch_name character varying(150) NOT NULL,
    document character varying(14),
    partner_id uuid NOT NULL,
    phone character varying,
    created_by uuid NOT NULL,
    created_at timestamp without time zone DEFAULT CURRENT_TIMESTAMP,
    updated_by uuid,
    updated_at timestamp without time zone,
    active boolean DEFAULT true NOT NULL
);


ALTER TABLE partner.branch OWNER TO postgres;

--
-- Name: identifier_partner; Type: SEQUENCE; Schema: partner; Owner: postgres
--

CREATE SEQUENCE partner.identifier_partner
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE partner.identifier_partner OWNER TO postgres;

--
-- Name: partner; Type: TABLE; Schema: partner; Owner: postgres
--

CREATE TABLE partner.partner (
    partner_id uuid DEFAULT public.uuid_generate_v4() NOT NULL,
    legal_name character varying(200) NOT NULL,
    fantasy_name character varying(100),
    document character varying(14) NOT NULL,
    email character varying(100) NOT NULL,
    phone_number character varying(11) NOT NULL,
    active boolean DEFAULT true NOT NULL,
    created_at timestamp without time zone DEFAULT CURRENT_TIMESTAMP,
    updated_at timestamp without time zone,
    user_id uuid NOT NULL,
    created_by uuid NOT NULL,
    admin_id uuid NOT NULL,
    updated_by uuid,
    identifier integer DEFAULT nextval('partner.identifier_partner'::regclass) NOT NULL,
    service_fee numeric(4,2) DEFAULT 0.02 NOT NULL,
    card_fee numeric(4,2) DEFAULT 0.01 NOT NULL
);


ALTER TABLE partner.partner OWNER TO postgres;

--
-- Name: style_partner; Type: TABLE; Schema: partner; Owner: postgres
--

CREATE TABLE partner.style_partner (
    style_partner_id uuid DEFAULT public.uuid_generate_v4() NOT NULL,
    admin_id uuid NOT NULL,
    lighter character varying,
    light character varying,
    main character varying,
    dark character varying,
    darker character varying,
    contrasttext character varying,
    created_by uuid NOT NULL,
    created_at timestamp without time zone DEFAULT CURRENT_TIMESTAMP,
    updated_by uuid,
    updated_at timestamp without time zone,
    logo character varying
);


ALTER TABLE partner.style_partner OWNER TO postgres;

--
-- Name: mysequence; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.mysequence
    START WITH 100
    INCREMENT BY 5
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.mysequence OWNER TO postgres;

--
-- Name: report; Type: TABLE; Schema: report; Owner: postgres
--

CREATE TABLE report.report (
    report_id uuid DEFAULT public.uuid_generate_v4() NOT NULL,
    name character varying NOT NULL,
    created_by uuid NOT NULL,
    created_at timestamp without time zone DEFAULT CURRENT_TIMESTAMP,
    updated_by uuid,
    updated_at timestamp without time zone,
    active boolean DEFAULT true NOT NULL,
    description character varying
);


ALTER TABLE report.report OWNER TO postgres;

--
-- Name: report_filter; Type: TABLE; Schema: report; Owner: postgres
--

CREATE TABLE report.report_filter (
    report_filter_id uuid DEFAULT public.uuid_generate_v4() NOT NULL,
    filter_name character varying,
    report_id uuid NOT NULL,
    created_by uuid NOT NULL,
    created_at timestamp without time zone DEFAULT CURRENT_TIMESTAMP,
    updated_by uuid,
    updated_at timestamp without time zone
);


ALTER TABLE report.report_filter OWNER TO postgres;

--
-- Name: branch_rating; Type: TABLE; Schema: reputation; Owner: postgres
--

CREATE TABLE reputation.branch_rating (
    branch_rating_id uuid DEFAULT public.uuid_generate_v4() NOT NULL,
    rating_id uuid NOT NULL,
    branch_id uuid NOT NULL,
    created_by uuid NOT NULL,
    created_at timestamp without time zone DEFAULT CURRENT_TIMESTAMP,
    updated_by uuid,
    update_at timestamp without time zone
);


ALTER TABLE reputation.branch_rating OWNER TO postgres;

--
-- Name: rating; Type: TABLE; Schema: reputation; Owner: postgres
--

CREATE TABLE reputation.rating (
    rating_id uuid DEFAULT public.uuid_generate_v4() NOT NULL,
    user_id uuid,
    rating_type_id uuid DEFAULT '4c09f612-6d27-496a-8ee2-85027319f017'::uuid NOT NULL,
    rating_value integer DEFAULT 0 NOT NULL,
    note character varying,
    created_by uuid NOT NULL,
    created_at timestamp without time zone DEFAULT CURRENT_TIMESTAMP,
    updated_by uuid,
    updated_at timestamp without time zone
);


ALTER TABLE reputation.rating OWNER TO postgres;

--
-- Name: rating_type; Type: TABLE; Schema: reputation; Owner: postgres
--

CREATE TABLE reputation.rating_type (
    rating_type_id uuid DEFAULT public.uuid_generate_v4() NOT NULL,
    name character varying(100) NOT NULL,
    description character varying,
    max_value integer DEFAULT 5 NOT NULL,
    created_by uuid NOT NULL,
    created_at timestamp without time zone DEFAULT CURRENT_TIMESTAMP,
    updated_by uuid,
    updated_at timestamp without time zone,
    min_value integer DEFAULT 0 NOT NULL
);


ALTER TABLE reputation.rating_type OWNER TO postgres;

--
-- Data for Name: administrator; Type: TABLE DATA; Schema: administrator; Owner: postgres
--

COPY administrator.administrator (admin_id, user_id) FROM stdin;
e92f9c8d-3665-49bb-a1a3-2658e9b9361e	e92f9c8d-3665-49bb-a1a3-2658e9b9361e
\.


--
-- Data for Name: interest_rate_setting; Type: TABLE DATA; Schema: administrator; Owner: postgres
--

COPY administrator.interest_rate_setting (interest_rate_setting_id, admin_id, service_fee, card_fee, created_by, created_at, updated_by, updated_at) FROM stdin;
1ac0a836-8443-4904-bb4b-03eef7642622	e92f9c8d-3665-49bb-a1a3-2658e9b9361e	0.05	0.03	e92f9c8d-3665-49bb-a1a3-2658e9b9361e	2023-09-22 12:47:53.389752	e92f9c8d-3665-49bb-a1a3-2658e9b9361e	2024-12-28 13:57:30.722643
\.


--
-- Data for Name: collaborator; Type: TABLE DATA; Schema: authentication; Owner: postgres
--

COPY authentication.collaborator (collaborator_id, active, user_id, sponsor_id, created_at, updated_at, phone_verified, created_by) FROM stdin;
\.


--
-- Data for Name: otp; Type: TABLE DATA; Schema: authentication; Owner: postgres
--

COPY authentication.otp (otp_id, user_id, otp, expiry, used, created_at, updated_at, type) FROM stdin;
6e9a9d43-e425-47ce-bc8f-0180cc047baf	6e08015e-4827-47d2-86e1-bd8e655b8aae	AQAAAAEAACcQAAAAEEMF9LgAhT34Dq04+mzUzPNX/Unaz5BqAhu8/s8z4xZwUbt5giyZmo3INxLsqlAMDA==	2024-01-08 21:32:15.779945	t	2024-01-08 20:32:15.779945	2024-01-08 20:32:42.219026	1
51210438-e8a1-4008-b91e-6d1583e73ac2	0807c18b-c59d-4e03-8c27-3f00f106393d	AQAAAAEAACcQAAAAEK/ntpIWucXUa+QVGf8cL8K+X+cCOkgAJBoyJ/UZhKDlDarrd15QrcJzHovZG5QjUA==	2024-01-09 21:53:57.459381	t	2024-01-09 20:53:57.459381	2024-01-09 20:54:39.068007	1
5ea57206-d2e6-4152-b261-09d84401ffa1	ac506204-19fd-480b-a622-142d74f56538	AQAAAAEAACcQAAAAEGLSfKVkdRl3Bcdc7polDuDXvZ8nqb9sUnzmBEz0VIa8k9rDSoVnH7wQPaxC2UMk9g==	2024-09-12 15:53:57.891185	t	2024-09-12 14:53:57.891185	2024-09-12 14:54:17.341918	1
14e861ad-9ff6-4d81-8588-12cbe449615b	82b00d87-8474-4cae-9974-36c7e4e22dea	AQAAAAEAACcQAAAAEGbDG476g3UyyViNT0VcJ2P4MPLrfezvkP5MFzo7cM7RzriKC9+XRY7aIgmyI2u5sA==	2024-10-08 11:13:26.737361	t	2024-10-08 10:13:26.737361	2024-10-08 10:14:12.411094	1
ccd97ab5-217b-433c-a07c-d712b45414fd	2e61165e-7b59-4526-8911-d3817e307515	AQAAAAEAACcQAAAAEFf4DsbFzbN1NEVdGD3yluZD3WXF8LI0b3GE+aQSh4ODGGIjm0+HK4goHfCnHZe2PA==	2024-10-18 21:03:37.335101	f	2024-10-18 20:03:37.335101	\N	1
7dc56c46-5172-4631-ac5e-c9708db983f7	2e61165e-7b59-4526-8911-d3817e307515	AQAAAAEAACcQAAAAEIZZUQQZX34pvvxRPoyNPkqIM3gzlgUwaeI6Q+GQi6k5cvm4ny5Mo4QDKzGEECwQ3g==	2024-10-18 21:08:40.791856	t	2024-10-18 20:08:40.791856	2024-10-18 20:08:55.042164	1
aa8e9ada-2a54-495e-b4eb-91b5ee9a10a9	ac506204-19fd-480b-a622-142d74f56538	AQAAAAEAACcQAAAAEA+bw7KQ3wqAEsa7evUZCUztlqgk1nbYiDsivDB9EghLDoUeVaUGijmq/XYNNlRNdg==	2025-01-29 20:56:01.781914	t	2025-01-29 19:56:01.781914	2025-01-29 19:56:57.044125	1
824b7fe3-50bc-4062-a1e6-0864a0b0cea9	f5f1fae0-8fda-4e38-a8cf-43c48a354e06	AQAAAAEAACcQAAAAEIHiic7kpfp6MM+7qc1j/5OX7sQf4GcMqTGeKp6OVaA5B6wA2zhVYc17OTEcnNUE9w==	2025-01-30 19:58:34.580932	t	2025-01-30 18:58:34.580932	2025-01-30 18:58:53.337028	1
96264e47-0b88-4e30-b921-835962cb7ed5	c1303a50-8e09-4d41-b314-b78e0dfa0b43	AQAAAAEAACcQAAAAEO1eEoXARe0GmgU3IoOVMrsmaZjHyB8tpz0/iqBt+1U29Svh1tFwTzNMZNAOAmqbiA==	2025-01-31 17:09:06.764503	t	2025-01-31 16:09:06.764503	2025-01-31 16:09:22.101902	1
18317d84-9ced-4afd-9b66-e38b0d4a5037	08873f3f-42b8-4bc1-8156-c144d5c76542	AQAAAAEAACcQAAAAEM4jjqDUQy1VBQH9ruyBWeiqYxyxCR5gVC+BGZwzGQPDMm1VqojMYoHVyeelkHv+Jg==	2025-01-31 22:32:25.314318	t	2025-01-31 21:32:25.314318	2025-01-31 21:34:49.776461	1
a8050d04-43ba-4a95-9d1c-316c8def649f	61aaf7cd-526d-4850-81e2-4bf1cd4f7eb5	AQAAAAEAACcQAAAAEPCBicpypEaf1ZNA2yFUHef0x+ViQ16byyOpEWDz21FnelawyULafMzSwXYfu7ySxg==	2025-02-04 18:00:29.955357	t	2025-02-04 17:00:29.955357	2025-02-04 17:00:41.537503	1
985001d1-5473-4d63-8ebf-c13f5c0229f5	08873f3f-42b8-4bc1-8156-c144d5c76542	AQAAAAEAACcQAAAAEF3PCWvivE06k9cV/cih1fovSx8oPNtvTpyjSmPZ9of4puHlWa2qjN3CHDePXb/mtQ==	2025-02-25 07:33:58.261338	t	2025-02-25 06:33:58.261338	2025-02-25 06:34:42.289177	1
67a3263f-9927-48e4-8ff7-3c69b07d2cf6	08873f3f-42b8-4bc1-8156-c144d5c76542	AQAAAAEAACcQAAAAECSdHrsEI1NdbSwdIF2NY3YLRGJX/zVsinvTqOPLia5sJ0k3LzhoGJNdgtQERQkcTQ==	2025-02-26 21:55:30.382824	f	2025-02-26 20:55:30.382824	\N	1
332c8045-cdb7-46c6-99bd-0a55d846f9e1	aaa2ae61-b95b-472c-9426-61a3297c2904	AQAAAAEAACcQAAAAEPfoWXBwLm8GaF0b4qEJoPTHV5sbOZnajCd19Sg0m2SqKualcJRgLhDRKDNrgyyIBg==	2025-03-15 20:17:43.272229	f	2025-03-15 19:17:43.272229	\N	1
dae49ad8-b647-42fb-9f54-7fbb93d4dc26	ac506204-19fd-480b-a622-142d74f56538	AQAAAAEAACcQAAAAELdmDk9jD76NuPZvrtVkrti73SSvPgzFi9jYRZ6XaCLa6rXxh5fOycAUnYz4/1u/GQ==	2025-07-02 22:16:55.899502	f	2025-07-02 21:16:55.899502	\N	1
fc3ed85d-779c-4865-bce9-405943f56d64	ac506204-19fd-480b-a622-142d74f56538	AQAAAAEAACcQAAAAEEdgFer2wUrJf9G4wRi2f8bptbczbzba8zqmK+F0QDFnp87QP78kqA4CjoAXfcxKng==	2025-07-03 00:15:05.849796	f	2025-07-02 23:15:05.849796	\N	1
9c66ed3e-2118-441c-90b3-9cacc539b4d4	f4818f3f-c988-4d5e-b27a-cf18f3832d96	AQAAAAEAACcQAAAAEBK4PsdXDTJqwJ0ZAz2V8tgCxMTLonZDmq/UPPXBSwcPoeRj8hGFWMbxGZdekFB61A==	2025-10-09 16:39:46.683631	f	2025-10-09 15:39:46.683631	\N	1
13ad4900-d4b7-4771-b908-032bd3051641	f4818f3f-c988-4d5e-b27a-cf18f3832d96	AQAAAAEAACcQAAAAEL2L5HKY6OuLyQM+Zgqu9DzsA3L/sDbxvryN0S3SBBKR+Mn9ZjTch8Vg0kxdoe304Q==	2025-10-09 16:41:26.642812	f	2025-10-09 15:41:26.642812	\N	1
9db1053a-70ad-4304-af80-76a31ab7a453	f4818f3f-c988-4d5e-b27a-cf18f3832d96	AQAAAAEAACcQAAAAEBsHD6EghJBVq0AHE0jCZovqOXIHO0iluM713qsgxauIbz4x+acaFCmeFVSae0vJVQ==	2025-10-09 16:44:11.332654	f	2025-10-09 15:44:11.332654	\N	1
13dda5c3-678c-474d-ae32-fe313e45c2fb	f4818f3f-c988-4d5e-b27a-cf18f3832d96	AQAAAAEAACcQAAAAEFkfKjGPwhMyWvTx/bIBkAFq+C9YGpL4FVL07jOPzy2vT/O9Aiq0Q0bG0+YV1EJoFQ==	2025-10-09 16:45:35.080523	f	2025-10-09 15:45:35.080523	\N	1
cbad4bc8-1edc-4dfc-9f6a-b849a158a1ab	459d61a4-6498-4c87-944c-5cc3d3083225	AQAAAAEAACcQAAAAEADFuqElydVlqabpkO3u/O0n3o3xwVnmpoZMttxXUeymmiS7h+CFzNbgh87iAhHEiw==	2025-10-09 17:45:46.883546	f	2025-10-09 16:45:46.883546	\N	1
71ce1219-bdc3-4114-9657-58de86440711	459d61a4-6498-4c87-944c-5cc3d3083225	AQAAAAEAACcQAAAAEI+I3D2IzYjGkvozl0QXr80EczViSvz8WnMkt9p/opLAGCd/wGeQKxqo0ZqkR7hzsw==	2025-10-09 17:49:49.105392	f	2025-10-09 16:49:49.105392	\N	1
35b9672e-7c9f-4fbd-b4b5-34d9f4d3836a	459d61a4-6498-4c87-944c-5cc3d3083225	AQAAAAEAACcQAAAAEEOhxhE1+KTCEGg8uJ6JqjQ1SoN+U25fkri5HRRu7SrYYI+qJJVhwVxQTNkdAy/25Q==	2025-10-09 17:51:59.246506	f	2025-10-09 16:51:59.246506	\N	1
\.


--
-- Data for Name: profile; Type: TABLE DATA; Schema: authentication; Owner: postgres
--

COPY authentication.profile (profile_id, fullname, avatar, document, active, created_at, deleted_at, updated_at, user_id) FROM stdin;
9b7f96f4-d540-4d8b-b238-d1ba75eddc3e	Keila Amada	\N	01359188479	t	2023-09-22 13:22:15.69523	\N	\N	438660b4-ca9b-46c3-820b-7e3324fa8d50
ff9c044d-f639-46ba-8145-9f48b3637949	Parceiro Piloto	\N	30201563000109	t	2024-01-08 18:14:16.270286	\N	\N	606964f8-a57b-4917-9d96-f3b3bc339c18
74247012-c4d1-45f9-9c92-44ff810bf56e	Henry Vaccari Sargiani		48081495835	t	2024-01-08 20:32:03.561084	\N	2024-01-08 20:32:42.227161	6e08015e-4827-47d2-86e1-bd8e655b8aae
907fd310-c227-4a38-91e4-e6c49ef8f370	Matheus 		49296055806	t	2024-01-09 20:53:51.962356	\N	2024-01-09 20:54:39.079827	0807c18b-c59d-4e03-8c27-3f00f106393d
5fd8732d-e8fd-476d-9569-c4e4299ba5fc	Teste Emmanuel	\N	39745467820	t	2024-08-27 15:33:04.635401	\N	\N	887b9307-588b-4575-a197-43a6b9e9d62a
07cef27f-916a-4968-88a3-3714c99e9669	Tiago Sargiani		27242723825	t	2024-10-08 10:13:23.058911	\N	2024-10-08 10:14:12.41495	82b00d87-8474-4cae-9974-36c7e4e22dea
a01d4802-8f1e-404c-9c6a-4d9cb2bb2d52	Ot├ívio Brisolla		34498969898	t	2024-10-18 20:03:33.573056	\N	2024-10-18 20:08:55.045777	2e61165e-7b59-4526-8911-d3817e307515
3dd60cd4-0264-4c6b-9a9e-b20ff93126be	Administrador	http://k8s-pamprodu-nlbminio-ca306643a3-e0d10c71f9283f75.elb.us-east-1.amazonaws.com:9000/avatarimages/user.png?AWSAccessKeyId=minio&Expires=33251435784&Signature=CV4qVn4CdaP35pgpxg1uBmtrZLY%3D	23172939000139	t	2023-08-03 21:22:35.712915	\N	2024-12-13 15:17:34.37801	e92f9c8d-3665-49bb-a1a3-2658e9b9361e
c89c66ea-364a-4150-999f-f088a22bf01d	Emmanuel menezes		39745467820	t	2024-09-12 14:53:47.276304	\N	2025-01-29 19:56:57.048832	ac506204-19fd-480b-a622-142d74f56538
c6c90af0-aba8-4f85-99c6-ceabc9b60e17	Emmanuel Menezes	https://minio.gasinho.com.br:9000/avatarimages/image%202%20(1).png?AWSAccessKeyId=minio&Expires=33263547730&Signature=uBwCrXrZUx%2BpBG58b55V06%2F0a5M%3D	35712298864	t	2024-12-13 19:45:43.852686	\N	2025-01-30 18:22:09.83328	aaa2ae61-b95b-472c-9426-61a3297c2904
65b0893c-b5df-40c2-86d4-7976a1c9ea80	Renato Gomes		18707398840	t	2025-01-30 18:58:30.151865	\N	2025-01-30 18:58:53.341421	f5f1fae0-8fda-4e38-a8cf-43c48a354e06
d6ebbde3-3108-4d24-9f19-3ab6a55794e0	Thiago Pereira Silva Guedes		34576156837	t	2025-01-31 16:09:04.670414	\N	2025-01-31 16:09:22.107144	c1303a50-8e09-4d41-b314-b78e0dfa0b43
8348ac5b-5141-4b76-9dd2-8dfadf8a2826	Kelbe		34576156837	t	2025-02-04 17:00:28.164191	\N	2025-02-04 17:00:41.542324	61aaf7cd-526d-4850-81e2-4bf1cd4f7eb5
d4785f03-e28a-4aa3-a121-9644de09cdd0	Wagner 		03742374176	t	2025-01-31 21:32:22.330492	\N	2025-02-25 06:34:42.294474	08873f3f-42b8-4bc1-8156-c144d5c76542
ec71db4d-bb18-4e51-9fda-7acefdad23d6	Ian Botelho da Motta 	\N	10206461798	t	2025-10-09 15:39:41.633136	\N	\N	f4818f3f-c988-4d5e-b27a-cf18f3832d96
4c7a8d30-ab74-4696-a7cd-b0ff85fec9a2	Paulo Rog├®rio Fernandes Buzzo	\N	19261105874	t	2025-10-09 16:45:35.819724	\N	\N	459d61a4-6498-4c87-944c-5cc3d3083225
\.


--
-- Data for Name: role; Type: TABLE DATA; Schema: authentication; Owner: postgres
--

COPY authentication.role (role_id, description, tag, active, created_at, deleted_at, updated_at) FROM stdin;
3409cb1c-00e1-4f69-a74f-2f9ef01bf558	Administrator	ADM	t	2023-08-03 21:22:21.893715	\N	\N
26d9b950-b886-4e7c-b672-46c368ede199	Consumer	CONS	t	2023-08-03 21:22:21.893715	\N	\N
fb9cfe17-eb9d-417a-9db5-b6e24d618383	Partner	PART	t	2023-08-03 21:22:21.893715	\N	\N
\.


--
-- Data for Name: user; Type: TABLE DATA; Schema: authentication; Owner: postgres
--

COPY authentication."user" (user_id, email, phone, password, active, password_generated, last_login, created_at, deleted_at, updated_at, role_id, phone_verified) FROM stdin;
6e08015e-4827-47d2-86e1-bd8e655b8aae	henry.vaccari@esmenezes.com.br	11961768383	AQAAAAEAACcQAAAAEFdOEnNzKSuNgbxze2cRNrYvs9c/rAUxCeUjYF/99JqGjyXQTMO8gACkJtw3vrH9cg==	t	f	\N	2024-01-08 20:32:03.561084	\N	2024-01-08 20:32:42.227161	26d9b950-b886-4e7c-b672-46c368ede199	t
0807c18b-c59d-4e03-8c27-3f00f106393d	teteuzo2916@gmail.com	11950599018	AQAAAAEAACcQAAAAEOaixmNI84vChKv9775vfENvH2kaFpQrB8cOKDuVVy8wGYd1JNew8Icezu5o+qWzZw==	t	f	\N	2024-01-09 20:53:51.962356	\N	2024-01-09 20:54:39.079827	26d9b950-b886-4e7c-b672-46c368ede199	t
2e61165e-7b59-4526-8911-d3817e307515	otavio.polatto@gmail.com	11972340266	AQAAAAEAACcQAAAAEOsPGXBIqJ/QBLkdTsGvwk2B6blRuVrkyc7I9vxmd1vu7f+rYCPgV5F7DsBKAKfN8g==	t	f	\N	2024-10-18 20:03:33.573056	\N	2024-10-18 20:08:55.045777	26d9b950-b886-4e7c-b672-46c368ede199	t
e92f9c8d-3665-49bb-a1a3-2658e9b9361e	dev.esmenezes@gmail.com	11973892831	AQAAAAEAACcQAAAAEMrMl7BQibz5AfGWHQsJjQ1iwBXDoYc4Xk9hB5V+EJl3csI/PSyFLEJbEc8aNdhQbA==	t	f	\N	2023-08-03 21:22:30.488381	\N	2024-12-13 15:17:34.37801	3409cb1c-00e1-4f69-a74f-2f9ef01bf558	f
82b00d87-8474-4cae-9974-36c7e4e22dea	tiago.sargiani@gmail.com	11982084614	AQAAAAEAACcQAAAAEGQ/+ZtJeVzpa4LclFOIiP309I6fp1PUCP52e0gdo3F2LZC/hzTo/woZVh8YuJxAUA==	t	f	\N	2024-10-08 10:13:23.058911	\N	2024-10-08 10:14:12.41495	26d9b950-b886-4e7c-b672-46c368ede199	t
606964f8-a57b-4917-9d96-f3b3bc339c18	emmanuelmenezes@esmenezes.com.br	11973892831	AQAAAAEAACcQAAAAEMrMl7BQibz5AfGWHQsJjQ1iwBXDoYc4Xk9hB5V+EJl3csI/PSyFLEJbEc8aNdhQbA==	t	f	\N	2024-01-08 18:14:16.270286	\N	2024-10-04 19:59:39.428038	fb9cfe17-eb9d-417a-9db5-b6e24d618383	f
887b9307-588b-4575-a197-43a6b9e9d62a	emmanuel.s.menezes@gmail.com	11999888899	AQAAAAEAACcQAAAAEMrMl7BQibz5AfGWHQsJjQ1iwBXDoYc4Xk9hB5V+EJl3csI/PSyFLEJbEc8aNdhQbA==	t	f	\N	2024-08-27 15:33:04.635401	\N	\N	fb9cfe17-eb9d-417a-9db5-b6e24d618383	f
ac506204-19fd-480b-a622-142d74f56538	emmanuel.s.menezes@gmail.com	11973892831	AQAAAAEAACcQAAAAEMrMl7BQibz5AfGWHQsJjQ1iwBXDoYc4Xk9hB5V+EJl3csI/PSyFLEJbEc8aNdhQbA==	t	f	\N	2024-09-12 14:53:47.276304	\N	2025-01-29 19:57:23.926878	26d9b950-b886-4e7c-b672-46c368ede199	t
f5f1fae0-8fda-4e38-a8cf-43c48a354e06	renatogomes@me.com	11947388308	AQAAAAEAACcQAAAAEESODqLP5mwC5Eapg9QlVMMO1j3wyLTu+6naWI6DaeVF2pKjVVTdRq88NFEZb6/COw==	t	f	\N	2025-01-30 18:58:30.151865	\N	2025-01-30 18:58:53.341421	26d9b950-b886-4e7c-b672-46c368ede199	t
c1303a50-8e09-4d41-b314-b78e0dfa0b43	thiago.router@gmail.com	11977338511	AQAAAAEAACcQAAAAEGtYZvkggpMF5ADkrKCoGZHEvJ532oEbsBmfB7XV15XA/rfW+orh4nuStefCO+nSug==	t	f	\N	2025-01-31 16:09:04.670414	\N	2025-01-31 16:09:22.107144	26d9b950-b886-4e7c-b672-46c368ede199	t
f4818f3f-c988-4d5e-b27a-cf18f3832d96	ianb.motta@gmail.com	21997450503	AQAAAAEAACcQAAAAEHTM1vl+oyfZy1pPZTeq7uzTQwVts63H0segdUO2E83i7I5nL99AZ3ev0a69nlXbLQ==	t	f	\N	2025-10-09 15:39:41.633136	\N	\N	26d9b950-b886-4e7c-b672-46c368ede199	f
459d61a4-6498-4c87-944c-5cc3d3083225	paulobuzzo@hotmail.com	11982711050	AQAAAAEAACcQAAAAEIHzk/YPJzQqrFVS/+G9BCRurw2Kxfpugdl6It2G++DholALNfWRvXRN9L9jOUYU0w==	t	f	\N	2025-10-09 16:45:35.819724	\N	\N	26d9b950-b886-4e7c-b672-46c368ede199	f
61aaf7cd-526d-4850-81e2-4bf1cd4f7eb5	bizerrakelba@gmail.com	88998120086	AQAAAAEAACcQAAAAEBub5yDth7BcfnJeR8M6n7CA6dk5eqZhdZ9mcd83LjKY2XJZKoMEyqNlIfcO4V7e6w==	t	f	\N	2025-02-04 17:00:28.164191	\N	2025-02-04 17:00:41.542324	26d9b950-b886-4e7c-b672-46c368ede199	t
08873f3f-42b8-4bc1-8156-c144d5c76542	aewinformatica@gmail.com	61992015350	AQAAAAEAACcQAAAAEOsPGXBIqJ/QBLkdTsGvwk2B6blRuVrkyc7I9vxmd1vu7f+rYCPgV5F7DsBKAKfN8g==	t	f	\N	2025-01-31 21:32:22.330492	\N	2025-02-25 06:35:52.50396	fb9cfe17-eb9d-417a-9db5-b6e24d618383	t
438660b4-ca9b-46c3-820b-7e3324fa8d50	keilaaaaaaaa999@gmail.com	61992015350	AQAAAAEAACcQAAAAEOsPGXBIqJ/QBLkdTsGvwk2B6blRuVrkyc7I9vxmd1vu7f+rYCPgV5F7DsBKAKfN8g==	t	f	\N	2023-09-22 13:22:15.69523	\N	2023-09-22 13:22:58.571616	fb9cfe17-eb9d-417a-9db5-b6e24d618383	f
aaa2ae61-b95b-472c-9426-61a3297c2904	emmanuel.s.menezes+10@gmail.com	11998650135	AQAAAAEAACcQAAAAEMrMl7BQibz5AfGWHQsJjQ1iwBXDoYc4Xk9hB5V+EJl3csI/PSyFLEJbEc8aNdhQbA==	t	f	\N	2024-12-13 19:45:43.852686	\N	2025-01-30 18:22:09.83328	fb9cfe17-eb9d-417a-9db5-b6e24d618383	t
\.


--
-- Data for Name: access_token_history; Type: TABLE DATA; Schema: billing; Owner: postgres
--

COPY billing.access_token_history (access_token_history_id, response, partner_id, created_by, created_at) FROM stdin;
\.


--
-- Data for Name: pagseguro_value_minimum; Type: TABLE DATA; Schema: billing; Owner: postgres
--

COPY billing.pagseguro_value_minimum (pagseguro_value_minimum_id, partner_id, value_minimum_standard, value_minimum, created_by, created_at, updated_by, updated_at) FROM stdin;
70354049-a038-427b-970e-90e44cd30afe	ae565ea8-440c-4063-9885-3192863fd0b6	8	8	e92f9c8d-3665-49bb-a1a3-2658e9b9361e	2024-12-13 19:45:44.482694	aaa2ae61-b95b-472c-9426-61a3297c2904	2025-02-01 16:55:19.296203
\.


--
-- Data for Name: payment; Type: TABLE DATA; Schema: billing; Owner: postgres
--

COPY billing.payment (payment_id, payment_options_id, order_id, created_by, created_at, updated_by, updated_at, installments, amount_paid, payment_situation_id) FROM stdin;
3869d0d5-96b6-4f49-aa30-d869be7b9cb1	17647417-2bfe-4e5d-96b8-53342dfe8443	a4e080bd-d6c4-4b0b-b824-f4ff8dcbada3	7071c9e2-ce05-42c2-9ffc-73cb6d16148e	2024-09-12 19:45:54.400324	\N	\N	1	80	28571130-38e5-4e58-ba91-883bb9c2cae3
c6f83c45-afeb-4dc2-aa82-7a14755babff	ec50fa62-d353-4cd9-8fad-b55ed491c2a5	29a5bdf0-85b1-47be-acde-5e6b75eb9e15	7071c9e2-ce05-42c2-9ffc-73cb6d16148e	2024-09-12 21:35:00.242535	\N	\N	1	70	28571130-38e5-4e58-ba91-883bb9c2cae3
3a2a583b-b458-4318-b81a-aa6e3746cf18	17647417-2bfe-4e5d-96b8-53342dfe8443	2e57fd30-7c82-45cc-94e3-1ddccd7680f5	7071c9e2-ce05-42c2-9ffc-73cb6d16148e	2024-09-12 21:44:02.537781	\N	\N	1	70	28571130-38e5-4e58-ba91-883bb9c2cae3
6a3a9138-aa27-434a-80f8-665061dcffa1	ec50fa62-d353-4cd9-8fad-b55ed491c2a5	2b47442c-2ce6-4791-bf19-ac37930ecfeb	7071c9e2-ce05-42c2-9ffc-73cb6d16148e	2024-09-25 14:12:13.555404	\N	\N	1	70	28571130-38e5-4e58-ba91-883bb9c2cae3
309e6ef2-f24d-4d94-8cbe-fec750a357bf	68e05062-eb22-42b1-bdba-b0de058de52e	c92da6c8-5181-4ee3-8062-98466d5b4348	5714ee22-66e2-4fe0-8f0e-4be4652dcbed	2024-10-18 21:20:51.483129	\N	\N	1	349.3	28571130-38e5-4e58-ba91-883bb9c2cae3
40b42da1-526c-4417-95e6-5f14ba837d80	8bfcd959-f9a6-4514-a164-e325de3970a4	22ba0fbd-1d80-418a-af70-9445425b205a	5714ee22-66e2-4fe0-8f0e-4be4652dcbed	2024-10-18 21:36:29.656406	\N	\N	1	607	28571130-38e5-4e58-ba91-883bb9c2cae3
d97127a6-1d8a-4147-80e8-263c5727d0a6	68e05062-eb22-42b1-bdba-b0de058de52e	13e8c878-3b5d-4fe3-b7a3-822b994f5e08	5714ee22-66e2-4fe0-8f0e-4be4652dcbed	2024-10-18 21:39:18.299014	\N	\N	1	199.6	28571130-38e5-4e58-ba91-883bb9c2cae3
652fcfe9-ff48-4146-b105-77d3d0267fde	8bfcd959-f9a6-4514-a164-e325de3970a4	ac3539b1-40e8-40ed-8cce-f0675d071e59	5af9a155-8d87-4d31-a1d2-552056257c26	2024-10-19 19:26:34.076862	\N	\N	1	250.89999999999998	28571130-38e5-4e58-ba91-883bb9c2cae3
4fba08f7-d051-4e0b-9537-6098b21ed798	df0884de-ebf6-4eac-bda5-7d35eba0d6e5	9c53f225-953e-4846-8fe7-ef65ebefa5d9	5af9a155-8d87-4d31-a1d2-552056257c26	2024-10-19 19:49:20.599307	\N	\N	1	314.3	28571130-38e5-4e58-ba91-883bb9c2cae3
d1edf443-7512-4864-ba03-5099a2dc7c3b	df0884de-ebf6-4eac-bda5-7d35eba0d6e5	4b4e0425-e0fc-4563-bf8d-7ca2e76345fe	5af9a155-8d87-4d31-a1d2-552056257c26	2024-10-19 19:51:06.640438	\N	\N	1	1280	28571130-38e5-4e58-ba91-883bb9c2cae3
c1110546-e71c-4d7e-bcab-99f7a37be3b9	8bfcd959-f9a6-4514-a164-e325de3970a4	b08a7f55-7fe7-4342-a400-85bdebbe2950	5714ee22-66e2-4fe0-8f0e-4be4652dcbed	2025-01-24 18:40:03.077969	\N	\N	1	162	28571130-38e5-4e58-ba91-883bb9c2cae3
e17c02d9-5e1e-4cc3-bcb8-ae36c9031769	df0884de-ebf6-4eac-bda5-7d35eba0d6e5	25c50978-b904-49e4-b804-25874a26fd92	7071c9e2-ce05-42c2-9ffc-73cb6d16148e	2025-01-30 18:48:08.762523	\N	\N	1	155	28571130-38e5-4e58-ba91-883bb9c2cae3
96e766d9-0022-40e5-a6be-f074efb51036	8bfcd959-f9a6-4514-a164-e325de3970a4	6fcc0770-25b3-437d-b162-7959f2e3cda8	7071c9e2-ce05-42c2-9ffc-73cb6d16148e	2025-01-30 18:53:05.395234	\N	\N	1	140	28571130-38e5-4e58-ba91-883bb9c2cae3
e3c3b18b-ea78-48e6-9ee3-f7e4d384c69c	8bfcd959-f9a6-4514-a164-e325de3970a4	f3f89699-ef53-486f-9d8f-017769a583b8	7071c9e2-ce05-42c2-9ffc-73cb6d16148e	2025-01-31 02:45:54.515994	\N	\N	1	295	28571130-38e5-4e58-ba91-883bb9c2cae3
eb944c86-a1c8-4110-9d70-82f066704be2	8bfcd959-f9a6-4514-a164-e325de3970a4	38fb7db8-d759-48ad-8615-d800b6ae1199	7071c9e2-ce05-42c2-9ffc-73cb6d16148e	2025-01-31 13:22:05.740519	\N	\N	1	15	28571130-38e5-4e58-ba91-883bb9c2cae3
ffcd8495-b204-4eaf-ab1c-254be17072aa	17647417-2bfe-4e5d-96b8-53342dfe8443	e2e25c6c-84eb-4d64-9ca1-66fd633a93d8	7071c9e2-ce05-42c2-9ffc-73cb6d16148e	2025-01-31 15:48:30.875101	\N	\N	1	140	28571130-38e5-4e58-ba91-883bb9c2cae3
f62470f8-be89-45f4-ace6-d2c63a7bcc2e	17647417-2bfe-4e5d-96b8-53342dfe8443	c6ba6696-f485-4a8c-b2e8-5c3ba7b5becb	7071c9e2-ce05-42c2-9ffc-73cb6d16148e	2025-01-31 15:56:10.15344	\N	\N	1	280	28571130-38e5-4e58-ba91-883bb9c2cae3
1bc5b3c9-ade8-4c80-8776-1a0ce6f0d529	8bfcd959-f9a6-4514-a164-e325de3970a4	e22b8380-0e1e-4cd0-bd59-612531377798	84713a3f-0af7-41ce-aae4-fc17f8be6bad	2025-01-31 18:10:03.278937	84713a3f-0af7-41ce-aae4-fc17f8be6bad	2025-01-31 18:11:00.014253	1	10	28571130-38e5-4e58-ba91-883bb9c2cae3
c37b4550-a114-4f09-aa00-84755611c2e2	8bfcd959-f9a6-4514-a164-e325de3970a4	b8255007-9755-4006-8414-1ed9264fe686	84713a3f-0af7-41ce-aae4-fc17f8be6bad	2025-01-31 18:12:54.684338	\N	\N	1	130	28571130-38e5-4e58-ba91-883bb9c2cae3
442e06dc-d515-4947-8210-555cfd86d966	df0884de-ebf6-4eac-bda5-7d35eba0d6e5	8a1b853c-f019-4cf7-9df4-5e81479b7500	6398c87e-08be-46c9-b3cb-02f1c6de27f8	2025-02-01 16:58:33.139229	\N	\N	1	260	28571130-38e5-4e58-ba91-883bb9c2cae3
c6a70454-501a-438a-9878-9ed648e700d3	8bfcd959-f9a6-4514-a164-e325de3970a4	3a3dcf01-9ae9-41b1-a856-6213e5203ee2	84713a3f-0af7-41ce-aae4-fc17f8be6bad	2025-02-01 17:24:08.690221	\N	\N	1	130	28571130-38e5-4e58-ba91-883bb9c2cae3
61cbaa89-9194-4181-887a-d5bbc81e3771	8bfcd959-f9a6-4514-a164-e325de3970a4	2e161bbd-0339-44b3-9824-289c342803be	84713a3f-0af7-41ce-aae4-fc17f8be6bad	2025-02-02 16:39:59.642332	\N	\N	1	390	28571130-38e5-4e58-ba91-883bb9c2cae3
1d3a7a6c-4dfc-47b6-85b2-4111fbe9479d	ec50fa62-d353-4cd9-8fad-b55ed491c2a5	cd59c5bf-e966-497a-a404-7570e1ea8218	9883e2f8-b0f2-43d3-bdbe-d2d601180eb0	2025-02-04 17:10:07.380651	\N	\N	1	140	28571130-38e5-4e58-ba91-883bb9c2cae3
bf056121-d90e-4fcb-92c6-be9643dadf3a	df0884de-ebf6-4eac-bda5-7d35eba0d6e5	8225b508-fecb-4b23-b774-304489d32fa2	84713a3f-0af7-41ce-aae4-fc17f8be6bad	2025-02-04 17:12:40.906399	\N	\N	1	140	28571130-38e5-4e58-ba91-883bb9c2cae3
fdae052f-0588-4d92-9a10-bdae4bf5940d	8bfcd959-f9a6-4514-a164-e325de3970a4	ad248838-9ad6-477f-81b7-ae21f67dfa73	7071c9e2-ce05-42c2-9ffc-73cb6d16148e	2025-02-04 22:20:54.983794	\N	\N	1	140	28571130-38e5-4e58-ba91-883bb9c2cae3
fd84ebc0-114c-42fe-a7a8-c7702fc130f3	8bfcd959-f9a6-4514-a164-e325de3970a4	3415dfa8-7ffb-4a15-af79-32de48e4b38c	7071c9e2-ce05-42c2-9ffc-73cb6d16148e	2025-02-04 22:38:40.493965	\N	\N	1	170	28571130-38e5-4e58-ba91-883bb9c2cae3
53bceef9-bb98-4391-92a2-ea767335f3c4	17647417-2bfe-4e5d-96b8-53342dfe8443	2771c0c3-1195-436e-8cdc-bd10744b5763	7071c9e2-ce05-42c2-9ffc-73cb6d16148e	2025-02-22 17:44:51.534478	\N	\N	1	140	28571130-38e5-4e58-ba91-883bb9c2cae3
aae24e86-6937-454b-83f1-47fe3269fe98	8bfcd959-f9a6-4514-a164-e325de3970a4	f74616e9-9dc9-4d48-abac-89470f3272b3	84713a3f-0af7-41ce-aae4-fc17f8be6bad	2025-03-04 16:31:37.84049	\N	\N	1	140	28571130-38e5-4e58-ba91-883bb9c2cae3
91600085-43db-4c66-965d-b6fde2efdd90	17647417-2bfe-4e5d-96b8-53342dfe8443	31fd2d1b-f1e6-4675-913d-d5281356d652	7071c9e2-ce05-42c2-9ffc-73cb6d16148e	2025-03-17 20:59:16.505155	\N	\N	1	140	28571130-38e5-4e58-ba91-883bb9c2cae3
8dc32c26-2d90-4293-a55b-e1b868509b0d	8bfcd959-f9a6-4514-a164-e325de3970a4	7c9baa86-30d2-478f-ae53-8efa8df79e31	7071c9e2-ce05-42c2-9ffc-73cb6d16148e	2025-03-17 21:30:59.873848	\N	\N	1	140	28571130-38e5-4e58-ba91-883bb9c2cae3
a722fec5-8626-40fa-b069-b2310d0aeeeb	8bfcd959-f9a6-4514-a164-e325de3970a4	4510bfd1-7f06-4072-be52-3bd155b8bd90	7071c9e2-ce05-42c2-9ffc-73cb6d16148e	2025-03-17 21:31:01.30993	\N	\N	1	140	28571130-38e5-4e58-ba91-883bb9c2cae3
947d5dee-1161-40af-b18c-bd841773c456	17647417-2bfe-4e5d-96b8-53342dfe8443	8aec5427-18aa-46b7-ac79-cde5da3c9dd1	7071c9e2-ce05-42c2-9ffc-73cb6d16148e	2025-06-08 23:48:57.606406	\N	\N	1	140	28571130-38e5-4e58-ba91-883bb9c2cae3
8acb700a-efcc-4991-b387-b8d4236670b2	17647417-2bfe-4e5d-96b8-53342dfe8443	d28d89bd-f19e-4603-8aaf-7cb4074cb6b4	7071c9e2-ce05-42c2-9ffc-73cb6d16148e	2025-07-02 21:23:27.302963	\N	\N	1	15	28571130-38e5-4e58-ba91-883bb9c2cae3
af2ba124-4c77-408d-8d7e-74e22aa9bbd1	8bfcd959-f9a6-4514-a164-e325de3970a4	bdbdff91-5827-4a20-8fcc-07e178c8b272	7071c9e2-ce05-42c2-9ffc-73cb6d16148e	2025-07-02 23:36:53.798824	\N	\N	1	140	28571130-38e5-4e58-ba91-883bb9c2cae3
\.


--
-- Data for Name: payment_history; Type: TABLE DATA; Schema: billing; Owner: postgres
--

COPY billing.payment_history (pagseguro_id, order_id, response, status, request, created_at) FROM stdin;
5ef56f5b-15f9-4680-9b54-1415a3d7cfb1	29a5bdf0-85b1-47be-acde-5e6b75eb9e15	{"id":"ORDE_4C869553-EEA9-4ED2-85EA-48ADF2861C40","reference_id":"29a5bdf0-85b1-47be-acde-5e6b75eb9e15","created_at":"2024-09-12T18:35:00.941-03:00","customer":{"name":"Emmanuel menezes","email":"emmanuel.s.menezes@gmail.com","tax_id":"39745467820"},"qr_codes":[{"id":"QRCO_6E6A8CCE-325C-4186-A266-67E5A19414CC","expiration_date":"2024-09-12T18:50:00.000-03:00","amount":{"value":7000},"text":"00020101021226830014br.gov.bcb.pix2561api.pagseguro.com/pix/v2/6E6A8CCE-325C-4186-A266-67E5A19414CC27600016BR.COM.PAGSEGURO01366E6A8CCE-325C-4186-A266-67E5A19414CC520473795303986540570.005802BR5922E S MENEZES INFORMATIC6007Barueri62070503***6304F4C7","arrangements":["PIX"],"links":[{"rel":"QRCODE.PNG","href":"https://api.pagseguro.com/qrcode/QRCO_6E6A8CCE-325C-4186-A266-67E5A19414CC/png","media":"image/png","type":"GET"},{"rel":"QRCODE.BASE64","href":"https://api.pagseguro.com/qrcode/QRCO_6E6A8CCE-325C-4186-A266-67E5A19414CC/base64","media":"text/plain","type":"GET"}]}],"notification_urls":[],"links":[{"rel":"SELF","href":"https://api.pagseguro.com/orders/ORDE_4C869553-EEA9-4ED2-85EA-48ADF2861C40","media":"application/json","type":"GET"},{"rel":"PAY","href":"https://api.pagseguro.com/orders/ORDE_4C869553-EEA9-4ED2-85EA-48ADF2861C40/pay","media":"application/json","type":"POST"}]}	5	{"customer":{"name":"Emmanuel menezes","email":"emmanuel.s.menezes@gmail.com","tax_id":"39745467820"},"reference_id":"29a5bdf0-85b1-47be-acde-5e6b75eb9e15","qr_codes":[{"amount":{"value":"7000"},"expiration_date":"2024-09-12T21:50:00+00:00"}],"notification_urls":null}	\N
de945b59-0159-4beb-bb78-2977027dea0f	2b47442c-2ce6-4791-bf19-ac37930ecfeb	{"id":"ORDE_CE28A52F-23A8-4248-9748-6F552E8E667E","reference_id":"2b47442c-2ce6-4791-bf19-ac37930ecfeb","created_at":"2024-09-25T11:12:13.748-03:00","customer":{"name":"Emmanuel menezes","email":"emmanuel.s.menezes@gmail.com","tax_id":"39745467820"},"qr_codes":[{"id":"QRCO_07A108C6-9EF2-4F8C-8C22-69D6C8147F11","expiration_date":"2024-09-25T11:27:13.000-03:00","amount":{"value":7000},"text":"00020101021226830014br.gov.bcb.pix2561api.pagseguro.com/pix/v2/07A108C6-9EF2-4F8C-8C22-69D6C8147F1127600016BR.COM.PAGSEGURO013607A108C6-9EF2-4F8C-8C22-69D6C8147F11520473795303986540570.005802BR5922E S MENEZES INFORMATIC6007Barueri62070503***630497A1","arrangements":["PIX"],"links":[{"rel":"QRCODE.PNG","href":"https://api.pagseguro.com/qrcode/QRCO_07A108C6-9EF2-4F8C-8C22-69D6C8147F11/png","media":"image/png","type":"GET"},{"rel":"QRCODE.BASE64","href":"https://api.pagseguro.com/qrcode/QRCO_07A108C6-9EF2-4F8C-8C22-69D6C8147F11/base64","media":"text/plain","type":"GET"}]}],"notification_urls":[],"links":[{"rel":"SELF","href":"https://api.pagseguro.com/orders/ORDE_CE28A52F-23A8-4248-9748-6F552E8E667E","media":"application/json","type":"GET"},{"rel":"PAY","href":"https://api.pagseguro.com/orders/ORDE_CE28A52F-23A8-4248-9748-6F552E8E667E/pay","media":"application/json","type":"POST"}]}	5	{"customer":{"name":"Emmanuel menezes","email":"emmanuel.s.menezes@gmail.com","tax_id":"39745467820"},"reference_id":"2b47442c-2ce6-4791-bf19-ac37930ecfeb","qr_codes":[{"amount":{"value":"7000"},"expiration_date":"2024-09-25T14:27:13+00:00"}],"notification_urls":null}	\N
6a35af0a-8637-4f19-a55c-95c2ac181e7c	c92da6c8-5181-4ee3-8062-98466d5b4348	{"error_messages":[{"code":"40002","error":"SELLER_ACCOUNT_REQUIRED","description":"One or more split receivers cannot receive payments."}]}	-1	{"reference_id":"c92da6c8-5181-4ee3-8062-98466d5b4348","customer":{"name":"Ot├ívio Brisolla","email":"otavio.polatto@gmail.com","tax_id":"34498969898"},"charges":[{"reference_id":"c92da6c8-5181-4ee3-8062-98466d5b4348","description":"PAM Plataform - Distribuidora Le Maroli Ltda","amount":{"value":34930,"currency":"BRL"},"payment_method":{"type":"CREDIT_CARD","installments":1,"capture":true,"card":{"encrypted":"VRxBUfganbXqcgE+0RCAtDe2U+aDdmlSkrFin5zqF55xCah/5rqLnmiLb9x0ongVWQ315F8lbUPzy1Bo23Ee5bwLZBOloID9J5ABrYPGUqHDfUhlqrU6jCvOPpclo7U1Jm4AT0/gRJtHGR2OZLlgZShSNf7hAi1x9ShoaTfjxP85tYH6AwA8EzU9bhsY+LzVlBn3dKv9X8RYEwG5+JxJ1cjqedsek3OUNwqn3eUg5595Y2/XJppjEzTxdr7Cv6f5QNfOoxWAKgnWj8hxf6ZGmp0vcOnJRWF82lYvpMUYHqB8LMyYuIUMwj24p5qvveXATxT5la1E4f9uSgD+lDFZ0g==","store":false,"holder":{"name":"Otavio Brisolla"}},"soft_descriptor":"PAM_Plataform"},"splits":{"method":"FIXED","receivers":[{"account":{"id":"ACCO_154E7861-0018-436D-B1B3-7787C4413D6C"},"amount":{"value":2445}},{"account":{"id":"ACCO_2ABF3FD2-EE4B-41D4-8174-0E539251B8DC"},"amount":{"value":32484}}]}}],"items":[{"reference_id":"8683e8c7-a897-4157-b23c-85e634e6a932","name":"VAQUINHA - COLE├ç├âO BONECAS MILKINHAS CL├üSSICAS","quantity":7,"unit_amount":4990}],"shipping":{"address":{"street":"Estr. Mun. Du├¡lio Sai","number":"1089","complement":"N/A","locality":"Da Lagoa","city":"Itupeva","region_code":"SP","country":"BRA","postal_code":"13296374"}}}	\N
7750189f-9e4a-41d1-b86d-66d781218e9e	13e8c878-3b5d-4fe3-b7a3-822b994f5e08	{"error_messages":[{"code":"40002","error":"SELLER_ACCOUNT_REQUIRED","description":"One or more split receivers cannot receive payments."}]}	-1	{"reference_id":"13e8c878-3b5d-4fe3-b7a3-822b994f5e08","customer":{"name":"Ot├ívio Brisolla","email":"otavio.polatto@gmail.com","tax_id":"34498969898"},"charges":[{"reference_id":"13e8c878-3b5d-4fe3-b7a3-822b994f5e08","description":"PAM Plataform - Distribuidora Le Maroli Ltda","amount":{"value":19960,"currency":"BRL"},"payment_method":{"type":"CREDIT_CARD","installments":1,"capture":true,"card":{"encrypted":"rlkEnWtIX10M2EmHsS9DH+HHQZoSl9XrrkKyvReqxQgc5sR5G9qWTpmDQEXMmgldHpsgf+yzSyywraVuES4KPcfNZxEAQHf6hrzqYIqN03O1V0FnlDcoaGme0J7XnEUo4ixdWEtXHdsEiJUJjQJKurf6u8wLeMz4Z4YGzgNODq2t7fOgu/QkVD1WDmgbHiE7yYFE9d1SQikyBLCk4o+3iqTgF9UcJu6UFvQfG3/ykX785+qUHNWRouR7PgVyoCnNVsYmYy3MenunU1fSkfurtYd5UYiIIIUSJtGlImRouPe1XBWU2ImdCXXczj/GXmQL+iIcURxxYcG3odf8ysmVcw==","store":false,"holder":{"name":"Otavio Brisolla"}},"soft_descriptor":"PAM_Plataform"},"splits":{"method":"FIXED","receivers":[{"account":{"id":"ACCO_154E7861-0018-436D-B1B3-7787C4413D6C"},"amount":{"value":1397}},{"account":{"id":"ACCO_2ABF3FD2-EE4B-41D4-8174-0E539251B8DC"},"amount":{"value":18562}}]}}],"items":[{"reference_id":"8683e8c7-a897-4157-b23c-85e634e6a932","name":"VAQUINHA - COLE├ç├âO BONECAS MILKINHAS CL├üSSICAS","quantity":1,"unit_amount":4990},{"reference_id":"2da85380-4f4f-4c39-9fb8-ef018ca25635","name":"NEGRA - COLE├ç├âO BONECAS MILKINHAS - REF. 2772","quantity":3,"unit_amount":4990}],"shipping":{"address":{"street":"Estr. Mun. Du├¡lio Sai","number":"1089","complement":"N/A","locality":"Da Lagoa","city":"Itupeva","region_code":"SP","country":"BRA","postal_code":"13296374"}}}	\N
450e3a27-7952-407a-9340-23409ba215d3	e22b8380-0e1e-4cd0-bd59-612531377798	{"error_messages":[{"code":"UNAUTHORIZED","description":"Invalid credential. Review AUTHORIZATION header"}]}	5	{"customer":{"name":"Thiago Pereira Silva Guedes","email":"thiago.router@gmail.com","tax_id":"34576156837"},"reference_id":"e22b8380-0e1e-4cd0-bd59-612531377798","qr_codes":[{"amount":{"value":"1000"},"expiration_date":"2025-01-31T18:25:03+00:00"}],"notification_urls":null}	\N
02c10624-b2c1-4dbe-89db-3d826ed381d3	cd59c5bf-e966-497a-a404-7570e1ea8218	{"error_messages":[{"code":"UNAUTHORIZED","description":"Invalid credential. Review AUTHORIZATION header"}]}	5	{"customer":{"name":"Kelbe","email":"bizerrakelba@gmail.com","tax_id":"34576156837"},"reference_id":"cd59c5bf-e966-497a-a404-7570e1ea8218","qr_codes":[{"amount":{"value":"14000"},"expiration_date":"2025-02-04T17:25:07+00:00"}],"notification_urls":null}	\N
\.


--
-- Data for Name: payment_local; Type: TABLE DATA; Schema: billing; Owner: postgres
--

COPY billing.payment_local (payment_local_id, payment_local_name) FROM stdin;
1880eca5-e912-49ba-bbc6-146014974219	Pagamento no Aplicativo
34496a35-a666-4b79-aa83-fb5b88afea73	Pagamento na Entrega
\.


--
-- Data for Name: payment_options; Type: TABLE DATA; Schema: billing; Owner: postgres
--

COPY billing.payment_options (payment_options_id, identifier, description, active, created_by, created_at, updated_by, updated_at) FROM stdin;
e134e680-7cbf-4f03-977a-19aa3473f671	1	Dinheiro	t	e92f9c8d-3665-49bb-a1a3-2658e9b9361e	2023-08-28 22:46:48.157048	\N	\N
8bde2b66-b4b2-49c2-9380-d81b1e36e192	2	Cart├úo Cr├®dito 	t	e92f9c8d-3665-49bb-a1a3-2658e9b9361e	2023-08-28 22:47:09.443594	\N	\N
a3e87118-66be-4708-890a-ed8a042fd77d	3	Cart├úo D├®bito	t	e92f9c8d-3665-49bb-a1a3-2658e9b9361e	2023-08-28 22:47:23.321389	\N	\N
021f875e-d776-4d90-bce5-499fd86223a0	4	Pix	f	e92f9c8d-3665-49bb-a1a3-2658e9b9361e	2023-08-28 22:48:37.768897	\N	\N
68e05062-eb22-42b1-bdba-b0de058de52e	26	Cart├úo de Cr├®dito	t	e92f9c8d-3665-49bb-a1a3-2658e9b9361e	2023-09-22 11:46:17.686207	e92f9c8d-3665-49bb-a1a3-2658e9b9361e	2024-10-08
df0884de-ebf6-4eac-bda5-7d35eba0d6e5	22	Pix	t	9b8d4a19-2384-4d82-a1e6-1c28a3c91f6b	2023-09-06 23:06:40.430168	e92f9c8d-3665-49bb-a1a3-2658e9b9361e	2024-10-08
17647417-2bfe-4e5d-96b8-53342dfe8443	25	Cart├úo de Cr├®dito	t	e92f9c8d-3665-49bb-a1a3-2658e9b9361e	2023-09-22 14:40:40.187029	e92f9c8d-3665-49bb-a1a3-2658e9b9361e	2024-10-19
c336dc68-88ba-49c9-a9ca-dcc89952acb6	28	Cart├úo de D├®bito	f	e92f9c8d-3665-49bb-a1a3-2658e9b9361e	2023-09-28 10:02:00.901779	e92f9c8d-3665-49bb-a1a3-2658e9b9361e	2024-10-19
ec50fa62-d353-4cd9-8fad-b55ed491c2a5	23	Pix	t	e92f9c8d-3665-49bb-a1a3-2658e9b9361e	2023-09-06 20:15:18.457865	e92f9c8d-3665-49bb-a1a3-2658e9b9361e	2025-01-29
8bfcd959-f9a6-4514-a164-e325de3970a4	30	Dinheiro	t	e92f9c8d-3665-49bb-a1a3-2658e9b9361e	2024-01-12 10:34:48.791111	e92f9c8d-3665-49bb-a1a3-2658e9b9361e	2025-01-29
a5a97723-1eb8-4f15-8672-36ba33c2e76e	31	Apple Pay	t	e92f9c8d-3665-49bb-a1a3-2658e9b9361e	2025-02-01 16:31:41.460487	\N	\N
0912edb5-2a41-4ac7-8ea5-c33cfbc58102	32	Vale g├ís	t	e92f9c8d-3665-49bb-a1a3-2658e9b9361e	2025-06-06 19:36:39.988959	\N	\N
db6e5961-dc58-4967-a861-29520049378d	33	Troca por servi├ºos	t	e92f9c8d-3665-49bb-a1a3-2658e9b9361e	2025-07-02 22:32:14.643612	\N	\N
\.


--
-- Data for Name: payment_options_local; Type: TABLE DATA; Schema: billing; Owner: postgres
--

COPY billing.payment_options_local (payment_options_local_id, payment_local_id, created_by, created_at, updated_by, updated_at, payment_options_id) FROM stdin;
9f2700f7-aefa-4a38-8af0-da9cef34790d	34496a35-a666-4b79-aa83-fb5b88afea73	9b8d4a19-2384-4d82-a1e6-1c28a3c91f6b	2023-09-06 23:06:40.430168	\N	\N	df0884de-ebf6-4eac-bda5-7d35eba0d6e5
79503ec9-464b-4b07-a4e6-0ae853617423	1880eca5-e912-49ba-bbc6-146014974219	e92f9c8d-3665-49bb-a1a3-2658e9b9361e	2023-09-06 20:32:45.228264	\N	\N	ec50fa62-d353-4cd9-8fad-b55ed491c2a5
11e1af62-5de9-4193-8246-425dac8398ea	34496a35-a666-4b79-aa83-fb5b88afea73	e92f9c8d-3665-49bb-a1a3-2658e9b9361e	2023-09-22 14:40:40.187029	\N	\N	17647417-2bfe-4e5d-96b8-53342dfe8443
97593f0f-756e-4065-a97c-97b785ba7b03	1880eca5-e912-49ba-bbc6-146014974219	e92f9c8d-3665-49bb-a1a3-2658e9b9361e	2023-09-22 11:47:57.016145	\N	\N	68e05062-eb22-42b1-bdba-b0de058de52e
2fbde314-6f84-4642-ba8b-4385e043bcb9	1880eca5-e912-49ba-bbc6-146014974219	e92f9c8d-3665-49bb-a1a3-2658e9b9361e	2023-09-28 10:02:06.312814	\N	\N	c336dc68-88ba-49c9-a9ca-dcc89952acb6
ab0e3b8e-08b9-4767-935a-4f7f05274651	34496a35-a666-4b79-aa83-fb5b88afea73	e92f9c8d-3665-49bb-a1a3-2658e9b9361e	2024-01-12 10:34:48.791111	\N	\N	8bfcd959-f9a6-4514-a164-e325de3970a4
b88d52b5-89d5-4a00-a9f6-507d64782f9f	34496a35-a666-4b79-aa83-fb5b88afea73	e92f9c8d-3665-49bb-a1a3-2658e9b9361e	2025-02-01 16:31:41.460487	\N	\N	a5a97723-1eb8-4f15-8672-36ba33c2e76e
eaeecd32-8463-4569-9a6b-9c989811745d	34496a35-a666-4b79-aa83-fb5b88afea73	e92f9c8d-3665-49bb-a1a3-2658e9b9361e	2025-06-06 19:36:39.988959	\N	\N	0912edb5-2a41-4ac7-8ea5-c33cfbc58102
30cf770f-b88f-469b-bdcd-54595bfe3240	34496a35-a666-4b79-aa83-fb5b88afea73	e92f9c8d-3665-49bb-a1a3-2658e9b9361e	2025-07-02 22:32:14.643612	\N	\N	db6e5961-dc58-4967-a861-29520049378d
\.


--
-- Data for Name: payment_order; Type: TABLE DATA; Schema: billing; Owner: postgres
--

COPY billing.payment_order (payment_order_id, order_id, amount_paid, created_by, created_at, updated_by, updated_at, payment_situation_id) FROM stdin;
\.


--
-- Data for Name: payment_situation; Type: TABLE DATA; Schema: billing; Owner: postgres
--

COPY billing.payment_situation (payment_situation_id, description, active, created_by, created_at, updated_by, updated_at) FROM stdin;
28571130-38e5-4e58-ba91-883bb9c2cae3	Aguardando pagamento	t	e92f9c8d-3665-49bb-a1a3-2658e9b9361e	2023-06-02 09:33:26.781	\N	\N
479dfbfa-660a-4a96-b93a-05082ced6299	Pago	t	e92f9c8d-3665-49bb-a1a3-2658e9b9361e	2023-06-02 09:33:49.05	\N	\N
\.


--
-- Data for Name: base_product; Type: TABLE DATA; Schema: catalog; Owner: postgres
--

COPY catalog.base_product (product_id, name, minimum_price, description, note, created_by, created_at, updated_by, updated_at, identifier, active, type, admin_id, url) FROM stdin;
7c0ae8ee-bb0c-4c24-817d-bf0fb4675b35	Botij├úo de g├ís  P13	40.00	Peso: 13Kg\nDi├ómetro: 360 mm\nAltura: 476 mm\n\nAplica├º├úo: Fog├Áes Dom├®sticos e Comerciais.	P13	e92f9c8d-3665-49bb-a1a3-2658e9b9361e	2025-01-29 18:11:18.591349	e92f9c8d-3665-49bb-a1a3-2658e9b9361e	2025-01-29 18:11:44.324596	254	f	p	e92f9c8d-3665-49bb-a1a3-2658e9b9361e	\N
6b344552-679c-443e-b480-da70f768887a	Botij├úo de g├ís  P13	40.00	Peso: 13Kg\nDi├ómetro: 360 mm\nAltura: 476 mm\n\nAplica├º├úo: Fog├Áes Dom├®sticos e Comerciais.	P13	e92f9c8d-3665-49bb-a1a3-2658e9b9361e	2025-01-29 18:10:54.295326	e92f9c8d-3665-49bb-a1a3-2658e9b9361e	2025-01-29 18:11:47.932201	253	f	p	e92f9c8d-3665-49bb-a1a3-2658e9b9361e	\N
9445b89e-fff3-4a4c-9423-074858000354	Botij├úo de g├ís  P13	40.00	Peso: 13Kg\nDi├ómetro: 360 mm\nAltura: 476 mm\n\nAplica├º├úo: Fog├Áes Dom├®sticos e Comerciais.	P13	e92f9c8d-3665-49bb-a1a3-2658e9b9361e	2025-01-29 18:10:49.343106	e92f9c8d-3665-49bb-a1a3-2658e9b9361e	2025-01-29 18:11:51.629536	252	f	p	e92f9c8d-3665-49bb-a1a3-2658e9b9361e	\N
ce004a4f-f74c-40c7-ba37-6f9ede1fbc05	Instala├º├úo de G├ís	10.00	teste	Instala├º├úo de terceiro	e92f9c8d-3665-49bb-a1a3-2658e9b9361e	2025-07-02 22:28:45.951622	e92f9c8d-3665-49bb-a1a3-2658e9b9361e	2025-09-09 23:26:32.664751	261	t	s	e92f9c8d-3665-49bb-a1a3-2658e9b9361e	https://minio.gasinho.com.br:9000/productbaseimages/servico-inst-gas.jpeg?AWSAccessKeyId=minio&Expires=33282833193&Signature=1cHSe4uzcDEy0y09KiFh%2B7Lvv3c%3D
931d3d29-c334-4e2c-af78-19fbf596357a	Botij├úo de g├ís  P45	100.00	Peso: 45Kg\nDi├ómetro: 376,5 mm\nAltura: 1.299 mm\n\nAplica├º├úo: Condom├¡nios, restaurantes, bares, ind├║strias, hospitais, entre outras.		e92f9c8d-3665-49bb-a1a3-2658e9b9361e	2025-01-29 18:14:54.807666	e92f9c8d-3665-49bb-a1a3-2658e9b9361e	2025-01-29 20:15:23.299309	256	t	p	e92f9c8d-3665-49bb-a1a3-2658e9b9361e	https://minio.gasinho.com.br:9000/productbaseimages/botijao_de_gas_13_kg_novo_consigaz_cozinha_1570687212_26b8_600x600.jpg?AWSAccessKeyId=minio&Expires=33263468124&Signature=XjbZpJ%2FMBBG%2FYiYV92gmmKr34Po%3D
f88215b2-d815-4a0a-989a-540957a0f22a	Instala├º├úo de G├ís	10.00	Instala├º├úo		e92f9c8d-3665-49bb-a1a3-2658e9b9361e	2025-02-04 22:10:55.568789	e92f9c8d-3665-49bb-a1a3-2658e9b9361e	2025-02-04 22:11:11.971696	258	f	s	e92f9c8d-3665-49bb-a1a3-2658e9b9361e	https://minio.gasinho.com.br:9000/productbaseimages/istockphoto-1976975305-612x612.jpg?AWSAccessKeyId=minio&Expires=33263993456&Signature=j3PnPGqgBt7voz%2F43xTFwSGZiaU%3D
347f71ae-606c-4eb0-affc-50751a9ae171	Instala├º├úo	0.10	Instala├º├úo		e92f9c8d-3665-49bb-a1a3-2658e9b9361e	2025-02-04 22:12:13.726496	\N	\N	259	t	s	e92f9c8d-3665-49bb-a1a3-2658e9b9361e	\N
b587e1c2-5000-4e7f-ba6f-0c36201deab7	Instala├º├úo	0.10	Instala├º├úo		e92f9c8d-3665-49bb-a1a3-2658e9b9361e	2025-02-04 22:12:20.536679	\N	\N	260	t	s	e92f9c8d-3665-49bb-a1a3-2658e9b9361e	https://minio.gasinho.com.br:9000/productbaseimages/istockphoto-1976975305-612x612.jpg?AWSAccessKeyId=minio&Expires=33263993541&Signature=CUZst7WQ9nJdjPgJM91GRmQigi0%3D
112af419-ad17-41ba-9a61-3531b1e53f40	Gal├úo de ├ígua 20 L	5.00	├ügua Alcalina \nPh 9.78\n		e92f9c8d-3665-49bb-a1a3-2658e9b9361e	2025-01-29 18:17:08.475651	e92f9c8d-3665-49bb-a1a3-2658e9b9361e	2025-09-09 23:24:29.766069	257	t	p	e92f9c8d-3665-49bb-a1a3-2658e9b9361e	https://minio.gasinho.com.br:9000/productbaseimages/galao-agua.jpeg?AWSAccessKeyId=minio&Expires=33282833071&Signature=kGTna9%2BdiW0aNE5vyLEjf4HqTYA%3D
f72eadfd-8bad-4385-bc43-2cbf19dcc4dd	Botij├úo de G├ís  P13	40.00	Peso: 13Kg\nDi├ómetro: 360 mm\nAltura: 476 mm\n\nAplica├º├úo: Fog├Áes Dom├®sticos e Comerciais.		e92f9c8d-3665-49bb-a1a3-2658e9b9361e	2025-01-29 18:10:34.365282	e92f9c8d-3665-49bb-a1a3-2658e9b9361e	2025-09-09 23:25:18.010463	251	t	p	e92f9c8d-3665-49bb-a1a3-2658e9b9361e	https://minio.gasinho.com.br:9000/productbaseimages/botijao-p13.jpeg?AWSAccessKeyId=minio&Expires=33282833118&Signature=ijUjtykw6I6iEr1aRSDNl6lozKs%3D
b5e4f988-6acf-4759-91de-9c8772f9b837	Botij├úo de g├ís  P20	80.00	Peso: 20Kg\nDi├ómetro: 310 mm\nAltura: 878 mm\n\nAplica├º├úo: Empilhadeiras		e92f9c8d-3665-49bb-a1a3-2658e9b9361e	2025-01-29 18:13:39.983808	e92f9c8d-3665-49bb-a1a3-2658e9b9361e	2025-09-09 23:25:50.086133	255	t	p	e92f9c8d-3665-49bb-a1a3-2658e9b9361e	https://minio.gasinho.com.br:9000/productbaseimages/botijao-p20.jpeg?AWSAccessKeyId=minio&Expires=33282833150&Signature=RSEzatq6PSZYUVRH2SnjA%2BVv4yU%3D
\.


--
-- Data for Name: category; Type: TABLE DATA; Schema: catalog; Owner: postgres
--

COPY catalog.category (category_id, identifier, description, category_parent_id, created_by, updated_by, created_at, updated_at, active) FROM stdin;
aefd5887-2fbe-4f8d-96af-6774c61499d4	35	├ügua	\N	e92f9c8d-3665-49bb-a1a3-2658e9b9361e	\N	2025-01-29 17:58:07.063202	\N	t
731e75e0-0b0f-4b5a-9025-312a4b0e7a6e	36	Utens├¡lios	\N	e92f9c8d-3665-49bb-a1a3-2658e9b9361e	\N	2025-01-29 17:58:25.433959	\N	t
8b22b748-735b-4f15-8a0c-f9ee1c7b914f	37	Revenda	4f4cd3dd-3d9c-46e4-8e56-0ae229428526	e92f9c8d-3665-49bb-a1a3-2658e9b9361e	e92f9c8d-3665-49bb-a1a3-2658e9b9361e	2025-01-29 18:11:37.177447	2025-01-29 18:12:05.542373	f
4f4cd3dd-3d9c-46e4-8e56-0ae229428526	34	G├ís	\N	e92f9c8d-3665-49bb-a1a3-2658e9b9361e	e92f9c8d-3665-49bb-a1a3-2658e9b9361e	2025-01-29 17:58:00.849123	2025-01-31 02:26:06.355326	t
d06374d5-eac1-4b5e-aaa3-f7ac68f809e7	38	Copag├ís	4f4cd3dd-3d9c-46e4-8e56-0ae229428526	e92f9c8d-3665-49bb-a1a3-2658e9b9361e	\N	2025-07-02 22:25:43.237439	\N	t
0fa38a30-721f-4f5f-8f39-f94948bebcc6	39	Regulardor	731e75e0-0b0f-4b5a-9025-312a4b0e7a6e	e92f9c8d-3665-49bb-a1a3-2658e9b9361e	\N	2025-07-02 22:26:24.276067	\N	t
59c1a696-0978-4753-975d-1f91db44beb5	40	Servi├ºos	\N	e92f9c8d-3665-49bb-a1a3-2658e9b9361e	\N	2025-07-02 22:27:19.542007	\N	t
\.


--
-- Data for Name: category_base_product; Type: TABLE DATA; Schema: catalog; Owner: postgres
--

COPY catalog.category_base_product (category_base_product_id, category_id, product_id, created_by, created_at, updated_by, updated_at, category_parent_id) FROM stdin;
2bf22911-a158-4315-9997-e704f6a39078	4f4cd3dd-3d9c-46e4-8e56-0ae229428526	7c0ae8ee-bb0c-4c24-817d-bf0fb4675b35	e92f9c8d-3665-49bb-a1a3-2658e9b9361e	2025-01-29 18:11:18.591349	e92f9c8d-3665-49bb-a1a3-2658e9b9361e	2025-01-29 18:11:44.324596	\N
5d22f551-0e6a-43d3-82d3-14bce76840b6	4f4cd3dd-3d9c-46e4-8e56-0ae229428526	6b344552-679c-443e-b480-da70f768887a	e92f9c8d-3665-49bb-a1a3-2658e9b9361e	2025-01-29 18:10:54.295326	e92f9c8d-3665-49bb-a1a3-2658e9b9361e	2025-01-29 18:11:47.932201	\N
abb7a6a0-447a-45aa-a147-4f1a1dde1aa9	4f4cd3dd-3d9c-46e4-8e56-0ae229428526	9445b89e-fff3-4a4c-9423-074858000354	e92f9c8d-3665-49bb-a1a3-2658e9b9361e	2025-01-29 18:10:49.343106	e92f9c8d-3665-49bb-a1a3-2658e9b9361e	2025-01-29 18:11:51.629536	\N
27875603-613c-4a56-bdd8-3f2db6039e17	4f4cd3dd-3d9c-46e4-8e56-0ae229428526	931d3d29-c334-4e2c-af78-19fbf596357a	e92f9c8d-3665-49bb-a1a3-2658e9b9361e	2025-01-29 18:14:54.807666	e92f9c8d-3665-49bb-a1a3-2658e9b9361e	2025-01-29 20:15:23.299309	\N
d2700b7a-7932-4706-a2cc-68a8f29cd569	4f4cd3dd-3d9c-46e4-8e56-0ae229428526	f88215b2-d815-4a0a-989a-540957a0f22a	e92f9c8d-3665-49bb-a1a3-2658e9b9361e	2025-02-04 22:10:55.568789	e92f9c8d-3665-49bb-a1a3-2658e9b9361e	2025-02-04 22:11:11.971696	\N
3d916ee5-cae0-43d5-a6fd-93582a040dd1	4f4cd3dd-3d9c-46e4-8e56-0ae229428526	347f71ae-606c-4eb0-affc-50751a9ae171	e92f9c8d-3665-49bb-a1a3-2658e9b9361e	2025-02-04 22:12:13.726496	\N	\N	\N
eb4e1564-e551-46c2-999a-343f0c0f4efb	4f4cd3dd-3d9c-46e4-8e56-0ae229428526	b587e1c2-5000-4e7f-ba6f-0c36201deab7	e92f9c8d-3665-49bb-a1a3-2658e9b9361e	2025-02-04 22:12:20.536679	\N	\N	\N
70ddac80-dac5-46fb-8eab-020874a03a11	aefd5887-2fbe-4f8d-96af-6774c61499d4	112af419-ad17-41ba-9a61-3531b1e53f40	e92f9c8d-3665-49bb-a1a3-2658e9b9361e	2025-01-29 18:17:08.475651	e92f9c8d-3665-49bb-a1a3-2658e9b9361e	2025-09-09 23:24:29.766069	\N
b88f0a1f-4609-418f-83b2-b74d1a1bd459	4f4cd3dd-3d9c-46e4-8e56-0ae229428526	f72eadfd-8bad-4385-bc43-2cbf19dcc4dd	e92f9c8d-3665-49bb-a1a3-2658e9b9361e	2025-01-29 18:10:34.365282	e92f9c8d-3665-49bb-a1a3-2658e9b9361e	2025-09-09 23:25:18.010463	\N
ced16a1f-725b-4be9-8dcb-9a6ce17f87c4	4f4cd3dd-3d9c-46e4-8e56-0ae229428526	b5e4f988-6acf-4759-91de-9c8772f9b837	e92f9c8d-3665-49bb-a1a3-2658e9b9361e	2025-01-29 18:13:39.983808	e92f9c8d-3665-49bb-a1a3-2658e9b9361e	2025-09-09 23:25:50.086133	\N
7f0d24b7-1078-41ee-a56e-8ea35802bc0a	59c1a696-0978-4753-975d-1f91db44beb5	ce004a4f-f74c-40c7-ba37-6f9ede1fbc05	e92f9c8d-3665-49bb-a1a3-2658e9b9361e	2025-07-02 22:28:45.951622	e92f9c8d-3665-49bb-a1a3-2658e9b9361e	2025-09-09 23:26:32.664751	\N
\.


--
-- Data for Name: input; Type: TABLE DATA; Schema: catalog; Owner: postgres
--

COPY catalog.input (input_id, name, created_by, created_at, update_by, update_at, product_id, editable, enable) FROM stdin;
\.


--
-- Data for Name: product; Type: TABLE DATA; Schema: catalog; Owner: postgres
--

COPY catalog.product (product_id, base_product_id, image_default, description, price, created_by, created_at, updated_by, updated_at, active, name, identifier, sale_price, reviewer) FROM stdin;
8c2bbc72-e836-4b94-a4e4-cb05f9944df6	b5e4f988-6acf-4759-91de-9c8772f9b837	\N	Peso: 20Kg\nDi├ómetro: 310 mm\nAltura: 878 mm\n\nAplica├º├úo: Empilhadeiras	80.00	e92f9c8d-3665-49bb-a1a3-2658e9b9361e	2025-01-30 16:16:44.967609	\N	\N	f	Botij├úo de g├ís  P20	259	0.00	f
c3fdb35e-b0d6-4317-90e0-c54ac27c7e15	f72eadfd-8bad-4385-bc43-2cbf19dcc4dd	14776a09-f336-4608-918e-4509eb8714c7	Peso: 13Kg\nDi├ómetro: 360 mm\nAltura: 476 mm\n\nAplica├º├úo: Fog├Áes Dom├®sticos e Comerciais.	140.00	e92f9c8d-3665-49bb-a1a3-2658e9b9361e	2025-01-29 18:40:58.747012	aaa2ae61-b95b-472c-9426-61a3297c2904	2025-07-02 21:39:19.248987	t	Botij├úo de g├ís  P13	257	140.00	f
3e154e2c-c84a-4f62-81ff-8155651c659f	112af419-ad17-41ba-9a61-3531b1e53f40	\N	├ügua Alcalina \nPh 9.78\n	5.00	e92f9c8d-3665-49bb-a1a3-2658e9b9361e	2025-07-02 22:43:45.785076	\N	\N	f	Gal├úo de ├ígua 20 L	267	0.00	f
c016eb45-fc23-40cf-b88e-ee52d35fa50a	b5e4f988-6acf-4759-91de-9c8772f9b837	\N	Peso: 20Kg\nDi├ómetro: 310 mm\nAltura: 878 mm\n\nAplica├º├úo: Empilhadeiras	80.00	e92f9c8d-3665-49bb-a1a3-2658e9b9361e	2025-07-02 22:43:50.562819	\N	\N	f	Botij├úo de g├ís  P20	268	0.00	f
22be1807-edbc-434e-8cb8-e3146fbb07d8	112af419-ad17-41ba-9a61-3531b1e53f40	ce5132a7-0ba5-461f-8bff-c17390e22ac8	├ügua Alcalina\nPh 9.78\n	15.00	e92f9c8d-3665-49bb-a1a3-2658e9b9361e	2025-01-29 18:41:00.786964	aaa2ae61-b95b-472c-9426-61a3297c2904	2025-01-30 18:27:51.142247	t	Gal├úo de ├ígua 20 L	258	15.00	f
ab78ae3b-b91f-456b-aa04-cf668addd7df	f72eadfd-8bad-4385-bc43-2cbf19dcc4dd	\N	Peso: 13Kg\nDi├ómetro: 360 mm\nAltura: 476 mm\n\nAplica├º├úo: Fog├Áes Dom├®sticos e Comerciais.	40.00	e92f9c8d-3665-49bb-a1a3-2658e9b9361e	2025-07-02 22:43:55.117119	\N	\N	f	Botij├úo de G├ís  P13	269	0.00	f
84162830-b62b-4507-914f-002211db71d9	b5e4f988-6acf-4759-91de-9c8772f9b837	4cc3371f-9cca-40ad-ab47-6bf345d940e1	Peso: 20Kg\nDi├ómetro: 310 mm\nAltura: 878 mm\n\nAplica├º├úo: Empilhadeiras	130.00	e92f9c8d-3665-49bb-a1a3-2658e9b9361e	2025-01-31 17:49:28.131815	aaa2ae61-b95b-472c-9426-61a3297c2904	2025-01-31 17:51:34.729664	t	Botij├úo de g├ís  P20	260	130.00	f
37a5804c-1d25-44ef-a1dd-46c1c55981e6	ce004a4f-f74c-40c7-ba37-6f9ede1fbc05	\N	teste	10.00	e92f9c8d-3665-49bb-a1a3-2658e9b9361e	2025-07-02 22:43:59.615165	\N	\N	f	Instala├º├úo de G├ís	270	0.00	f
18408bd4-964c-4edb-b5c6-0ec22732900b	112af419-ad17-41ba-9a61-3531b1e53f40	d838f15c-958b-4662-b4ce-5f015b92e5e0	├ügua Alcalina\nPh 9.78\n	5.00	e92f9c8d-3665-49bb-a1a3-2658e9b9361e	2025-01-31 17:49:32.210081	aaa2ae61-b95b-472c-9426-61a3297c2904	2025-01-31 17:53:50.44717	t	Gal├úo de ├ígua 20 L	262	5.00	f
edcd2190-25f2-41da-979a-2e591958b275	931d3d29-c334-4e2c-af78-19fbf596357a	\N	Peso: 45Kg\nDi├ómetro: 376,5 mm\nAltura: 1.299 mm\n\nAplica├º├úo: Condom├¡nios, restaurantes, bares, ind├║strias, hospitais, entre outras.	100.00	e92f9c8d-3665-49bb-a1a3-2658e9b9361e	2025-02-01 16:34:43.866911	\N	\N	f	Botij├úo de g├ís  P45	264	0.00	f
570fd9e3-4886-4832-9c48-8a65cd6c0732	b5e4f988-6acf-4759-91de-9c8772f9b837	\N	Peso: 20Kg\nDi├ómetro: 310 mm\nAltura: 878 mm\n\nAplica├º├úo: Empilhadeiras	80.00	e92f9c8d-3665-49bb-a1a3-2658e9b9361e	2025-07-02 22:44:13.683557	\N	\N	f	Botij├úo de g├ís  P20	271	0.00	f
721e27cc-e329-464c-8b06-bed054661e0a	b587e1c2-5000-4e7f-ba6f-0c36201deab7	116f5629-7a35-4467-85da-0e0fa1153bbd	Instala├º├úo	100.00	e92f9c8d-3665-49bb-a1a3-2658e9b9361e	2025-02-04 22:12:35.155812	aaa2ae61-b95b-472c-9426-61a3297c2904	2025-07-02 22:46:00.78497	t	Instala├º├úo	265	117.39	f
608ff189-e590-4461-a14c-e1d48a9f6c4c	347f71ae-606c-4eb0-affc-50751a9ae171	\N	Instala├º├úo	0.10	e92f9c8d-3665-49bb-a1a3-2658e9b9361e	2025-03-14 13:46:41.941505	\N	\N	f	Instala├º├úo	266	0.00	f
\.


--
-- Data for Name: product_branch; Type: TABLE DATA; Schema: catalog; Owner: postgres
--

COPY catalog.product_branch (product_branch_id, product_id, branch_id, created_by, created_at, updated_by, updated_at) FROM stdin;
acf0e8c9-8f39-460b-8bfc-f5c2c85a34e6	c3fdb35e-b0d6-4317-90e0-c54ac27c7e15	c1096081-fa43-4681-a242-c014a916914a	e92f9c8d-3665-49bb-a1a3-2658e9b9361e	2025-01-29 18:40:58.747012	\N	\N
695d58b7-1319-40f4-b48f-829788373680	22be1807-edbc-434e-8cb8-e3146fbb07d8	c1096081-fa43-4681-a242-c014a916914a	e92f9c8d-3665-49bb-a1a3-2658e9b9361e	2025-01-29 18:41:00.786964	\N	\N
c52eaeb8-5577-4ac9-9fe2-bf22ca37f268	8c2bbc72-e836-4b94-a4e4-cb05f9944df6	c1096081-fa43-4681-a242-c014a916914a	e92f9c8d-3665-49bb-a1a3-2658e9b9361e	2025-01-30 16:16:44.967609	\N	\N
efc9b3d6-843f-4884-835e-48d5db46fc1e	edcd2190-25f2-41da-979a-2e591958b275	c1096081-fa43-4681-a242-c014a916914a	e92f9c8d-3665-49bb-a1a3-2658e9b9361e	2025-02-01 16:34:43.866911	\N	\N
46913844-77d2-40ea-8997-f893c338a7df	721e27cc-e329-464c-8b06-bed054661e0a	c1096081-fa43-4681-a242-c014a916914a	e92f9c8d-3665-49bb-a1a3-2658e9b9361e	2025-02-04 22:12:35.155812	\N	\N
e4f658a5-8fd4-4abf-85f9-449d62cc5449	608ff189-e590-4461-a14c-e1d48a9f6c4c	c1096081-fa43-4681-a242-c014a916914a	e92f9c8d-3665-49bb-a1a3-2658e9b9361e	2025-03-14 13:46:41.941505	\N	\N
5db4a008-3caf-4abd-9f66-167dcf84e9c9	3e154e2c-c84a-4f62-81ff-8155651c659f	3cb508e3-618d-4eed-ac11-7eee9484613c	e92f9c8d-3665-49bb-a1a3-2658e9b9361e	2025-07-02 22:43:45.785076	\N	\N
0d9a14b2-05d0-4946-b715-09ea09a7228a	c016eb45-fc23-40cf-b88e-ee52d35fa50a	3cb508e3-618d-4eed-ac11-7eee9484613c	e92f9c8d-3665-49bb-a1a3-2658e9b9361e	2025-07-02 22:43:50.562819	\N	\N
0456f022-9f84-4cec-91b0-a9449317a5bc	ab78ae3b-b91f-456b-aa04-cf668addd7df	3cb508e3-618d-4eed-ac11-7eee9484613c	e92f9c8d-3665-49bb-a1a3-2658e9b9361e	2025-07-02 22:43:55.117119	\N	\N
33bbab1e-32a6-4dcc-aa08-3302450394fe	37a5804c-1d25-44ef-a1dd-46c1c55981e6	3cb508e3-618d-4eed-ac11-7eee9484613c	e92f9c8d-3665-49bb-a1a3-2658e9b9361e	2025-07-02 22:43:59.615165	\N	\N
db225975-9fb5-4c2e-bd0e-ed1bff56ee57	570fd9e3-4886-4832-9c48-8a65cd6c0732	fc51dc14-dc03-496e-8c95-d44cb7e35d21	e92f9c8d-3665-49bb-a1a3-2658e9b9361e	2025-07-02 22:44:13.683557	\N	\N
\.


--
-- Data for Name: product_image; Type: TABLE DATA; Schema: catalog; Owner: postgres
--

COPY catalog.product_image (product_image_id, url, created_by, created_at, updated_by, updated_at) FROM stdin;
14776a09-f336-4608-918e-4509eb8714c7	https://minio.gasinho.com.br:9000/productbaseimages/Botijao-de-Gas-de-Cozinha-13-quilos-em-Betim-e-Contagem-1.webp?AWSAccessKeyId=minio&Expires=33263547999&Signature=%2BzH31xy290lP3MbT8V8YZjz%2FZXI%3D	aaa2ae61-b95b-472c-9426-61a3297c2904	2025-01-30 18:26:38.644659	\N	\N
ce5132a7-0ba5-461f-8bff-c17390e22ac8	https://minio.gasinho.com.br:9000/productbaseimages/istockphoto-1976975305-612x612.jpg?AWSAccessKeyId=minio&Expires=33263548071&Signature=%2FYqIK6Q7%2BP%2Bw5BoK6LFMcDOKIQ4%3D	aaa2ae61-b95b-472c-9426-61a3297c2904	2025-01-30 18:27:51.142247	\N	\N
4cc3371f-9cca-40ad-ab47-6bf345d940e1	https://minio.gasinho.com.br:9000/productbaseimages/gas-cylinder-3d-render-illustration-600nw-2518638471.webp?AWSAccessKeyId=minio&Expires=33263632289&Signature=0DP34dxXxOa%2BZ7ttC5dNB9HQeRU%3D	aaa2ae61-b95b-472c-9426-61a3297c2904	2025-01-31 17:51:28.676288	\N	\N
d838f15c-958b-4662-b4ce-5f015b92e5e0	https://minio.gasinho.com.br:9000/productbaseimages/istockphoto-474108366-612x612.jpg?AWSAccessKeyId=minio&Expires=33263632430&Signature=3EADN%2Fz2ijFgG0w0OFQs85qVDg4%3D	aaa2ae61-b95b-472c-9426-61a3297c2904	2025-01-31 17:53:50.44717	\N	\N
116f5629-7a35-4467-85da-0e0fa1153bbd	https://minio.gasinho.com.br:9000/productbaseimages/istockphoto-1976975305-612x612.jpg?AWSAccessKeyId=minio&Expires=33263993606&Signature=bYyvp1EmxYbnCAyU4mjHQdG%2B2%2FQ%3D	aaa2ae61-b95b-472c-9426-61a3297c2904	2025-02-04 22:13:26.326716	\N	\N
\.


--
-- Data for Name: product_image_product; Type: TABLE DATA; Schema: catalog; Owner: postgres
--

COPY catalog.product_image_product (product_image_product_id, product_id, product_image_id, created_by, created_at, updated_by, updated_at) FROM stdin;
1aeac95a-4570-4101-8e5e-08be544b8e40	c3fdb35e-b0d6-4317-90e0-c54ac27c7e15	14776a09-f336-4608-918e-4509eb8714c7	aaa2ae61-b95b-472c-9426-61a3297c2904	2025-01-30 18:26:38.644659	\N	\N
0e42405c-4468-4db3-91fa-370e964136c0	22be1807-edbc-434e-8cb8-e3146fbb07d8	ce5132a7-0ba5-461f-8bff-c17390e22ac8	aaa2ae61-b95b-472c-9426-61a3297c2904	2025-01-30 18:27:51.142247	\N	\N
6f44a4ed-d4d0-412a-889d-292aab47789b	84162830-b62b-4507-914f-002211db71d9	4cc3371f-9cca-40ad-ab47-6bf345d940e1	aaa2ae61-b95b-472c-9426-61a3297c2904	2025-01-31 17:51:28.676288	\N	\N
06349765-eaf9-4583-b72b-112617e7f4a2	18408bd4-964c-4edb-b5c6-0ec22732900b	d838f15c-958b-4662-b4ce-5f015b92e5e0	aaa2ae61-b95b-472c-9426-61a3297c2904	2025-01-31 17:53:50.44717	\N	\N
45d4d431-65ae-44e9-97de-bd7f28b61f53	721e27cc-e329-464c-8b06-bed054661e0a	116f5629-7a35-4467-85da-0e0fa1153bbd	aaa2ae61-b95b-472c-9426-61a3297c2904	2025-02-04 22:13:26.326716	\N	\N
\.


--
-- Data for Name: chat; Type: TABLE DATA; Schema: communication; Owner: postgres
--

COPY communication.chat (chat_id, description, created_at, updated_at, created_by, closed, closed_by, order_id) FROM stdin;
d6e8acaa-0170-41c9-8dfb-e310d2e2feeb	Usu├írio Exclu├¡do - Parceiro Piloto	2024-08-28 20:06:10.500437	2024-10-07 16:21:22.212138	b9e496b7-11e0-4350-98ef-7718b612993f	2024-10-07 16:21:22.212138	b9e496b7-11e0-4350-98ef-7718b612993f	\N
96ef063c-83cc-4c08-a732-52bd7529b2f5	Usu├írio Exclu├¡do - Parceiro Piloto	2024-09-12 19:46:53.232883	2024-10-07 16:21:22.212138	b9e496b7-11e0-4350-98ef-7718b612993f	2024-10-07 16:21:22.212138	b9e496b7-11e0-4350-98ef-7718b612993f	a4e080bd-d6c4-4b0b-b824-f4ff8dcbada3
da41719d-10b0-4917-a4dd-859afccd8f71	Usu├írio Exclu├¡do - Thiago Guedes	2024-09-12 14:30:28.935413	2024-10-07 16:21:41.195676	f13796a3-7ad6-4e78-a2ee-787dbde5acd2	2024-10-07 16:21:41.195676	f13796a3-7ad6-4e78-a2ee-787dbde5acd2	\N
b041e2eb-c688-4ee7-aa29-563e9477fd34		2025-01-24 17:59:32.25215	\N	aaa2ae61-b95b-472c-9426-61a3297c2904	\N	\N	\N
0649a90f-2b53-42bc-869e-bc67f18e4690	Usu├írio Exclu├¡do - Distribuidora Le Maroli Ltda	2024-10-05 23:44:35.398448	2025-01-29 17:56:36.374227	b70c1540-93bc-4e05-a67d-211752c2de20	2025-01-29 17:56:36.374227	b70c1540-93bc-4e05-a67d-211752c2de20	\N
01ed63fa-09b0-47f8-ba1e-1df8c7118cbd	Usu├írio Exclu├¡do - Distribuidora Le Maroli Ltda	2024-10-19 19:27:43.867162	2025-01-29 17:56:36.374227	b70c1540-93bc-4e05-a67d-211752c2de20	2025-01-29 17:56:36.374227	b70c1540-93bc-4e05-a67d-211752c2de20	ac3539b1-40e8-40ed-8cce-f0675d071e59
5e053da7-a4ff-4a3f-ac89-18c28b6311d3	Usu├írio Exclu├¡do - Distribuidora Le Maroli Ltda	2024-10-19 19:51:18.736025	2025-01-29 17:56:36.374227	b70c1540-93bc-4e05-a67d-211752c2de20	2025-01-29 17:56:36.374227	b70c1540-93bc-4e05-a67d-211752c2de20	9c53f225-953e-4846-8fe7-ef65ebefa5d9
93287493-2cfa-42d2-be05-8458edd060d0	Pedido n┬║: 70	2025-01-30 18:51:37.905007	\N	aaa2ae61-b95b-472c-9426-61a3297c2904	2025-01-30 18:51:46.344187	aaa2ae61-b95b-472c-9426-61a3297c2904	25c50978-b904-49e4-b804-25874a26fd92
515a8ce7-3b8c-458c-aed6-8558d82440be	Pedido n┬║: 71	2025-01-30 18:54:47.453572	\N	aaa2ae61-b95b-472c-9426-61a3297c2904	\N	\N	6fcc0770-25b3-437d-b162-7959f2e3cda8
d87e3367-f3fe-4c77-86a3-5ce29f26e041	Pedido n┬║: 73	2025-01-31 13:22:58.684053	\N	aaa2ae61-b95b-472c-9426-61a3297c2904	\N	\N	38fb7db8-d759-48ad-8615-d800b6ae1199
e843fbb8-fb09-4138-a457-c4e27ff131e2	Pedido n┬║: 74	2025-01-31 17:59:40.408845	\N	aaa2ae61-b95b-472c-9426-61a3297c2904	2025-01-31 17:59:58.209959	aaa2ae61-b95b-472c-9426-61a3297c2904	e2e25c6c-84eb-4d64-9ca1-66fd633a93d8
96d013c2-1ced-4816-8af3-516d88028fd4	Pedido n┬║: 77	2025-01-31 18:14:59.486801	\N	aaa2ae61-b95b-472c-9426-61a3297c2904	2025-01-31 18:17:21.126374	aaa2ae61-b95b-472c-9426-61a3297c2904	b8255007-9755-4006-8414-1ed9264fe686
824d37aa-4074-4402-ae7e-5826e55e837d	Usu├írio Exclu├¡do - Guedinho	2025-02-01 16:59:43.225522	2025-02-01 17:04:03.624347	aaa2ae61-b95b-472c-9426-61a3297c2904	2025-02-01 17:04:03.624347	c4259495-7c66-4de0-b4a1-23309c8989fc	8a1b853c-f019-4cf7-9df4-5e81479b7500
14b33935-4ed9-43ab-a9c6-d6ce544d670c	Pedido n┬║: 80	2025-02-02 21:35:45.717803	\N	aaa2ae61-b95b-472c-9426-61a3297c2904	2025-02-02 21:37:31.226591	aaa2ae61-b95b-472c-9426-61a3297c2904	2e161bbd-0339-44b3-9824-289c342803be
7a8a9b46-a014-4276-a440-7148a64048e2	Pedido n┬║: 82	2025-02-04 22:17:12.648362	\N	aaa2ae61-b95b-472c-9426-61a3297c2904	\N	\N	8225b508-fecb-4b23-b774-304489d32fa2
a2ae725b-e755-41fd-958e-c65adda0849b	Pedido n┬║: 83	2025-02-04 22:21:23.314213	\N	aaa2ae61-b95b-472c-9426-61a3297c2904	\N	\N	ad248838-9ad6-477f-81b7-ae21f67dfa73
ebadb35f-6686-400d-8158-739b70297fb5	Pedido n┬║: 84	2025-02-04 22:39:29.298446	\N	aaa2ae61-b95b-472c-9426-61a3297c2904	2025-02-04 22:40:08.286654	aaa2ae61-b95b-472c-9426-61a3297c2904	3415dfa8-7ffb-4a15-af79-32de48e4b38c
8efe0223-7070-460d-a4b2-cd145774790a	Pedido n┬║: 85	2025-02-22 17:47:47.659158	\N	aaa2ae61-b95b-472c-9426-61a3297c2904	2025-02-22 17:50:01.219358	aaa2ae61-b95b-472c-9426-61a3297c2904	2771c0c3-1195-436e-8cdc-bd10744b5763
61479d2c-dbb0-403f-a9a8-dba04460e43d	Pedido n┬║: 86	2025-03-04 16:32:20.228399	\N	aaa2ae61-b95b-472c-9426-61a3297c2904	2025-03-04 16:33:11.90493	aaa2ae61-b95b-472c-9426-61a3297c2904	f74616e9-9dc9-4d48-abac-89470f3272b3
19ceaad8-864d-4d4e-8cf3-b14ba9df5758	Pedido n┬║: 91	2025-07-02 21:23:43.652537	\N	aaa2ae61-b95b-472c-9426-61a3297c2904	2025-07-02 21:23:45.575253	aaa2ae61-b95b-472c-9426-61a3297c2904	d28d89bd-f19e-4603-8aaf-7cb4074cb6b4
c4ceb661-03ea-4544-8fcb-e2cceef679b7	Pedido n┬║: 92	2025-07-02 23:37:20.135393	\N	aaa2ae61-b95b-472c-9426-61a3297c2904	\N	\N	bdbdff91-5827-4a20-8fcc-07e178c8b272
\.


--
-- Data for Name: chat_member; Type: TABLE DATA; Schema: communication; Owner: postgres
--

COPY communication.chat_member (chat_member_id, chat_id, user_id, created_at) FROM stdin;
fdc43872-12aa-4b0c-a9f5-6c549dc4659b	d6e8acaa-0170-41c9-8dfb-e310d2e2feeb	e92f9c8d-3665-49bb-a1a3-2658e9b9361e	2024-08-28 20:06:10.500437
980cd19f-2736-48ae-bd07-4aadd2375c87	d6e8acaa-0170-41c9-8dfb-e310d2e2feeb	b9e496b7-11e0-4350-98ef-7718b612993f	2024-08-28 20:06:10.500437
0b84445a-2aea-4c5d-b295-2434e41ff6b4	da41719d-10b0-4917-a4dd-859afccd8f71	e92f9c8d-3665-49bb-a1a3-2658e9b9361e	2024-09-12 14:30:28.935413
92852b5f-f647-4510-8636-536daca1005a	da41719d-10b0-4917-a4dd-859afccd8f71	f13796a3-7ad6-4e78-a2ee-787dbde5acd2	2024-09-12 14:30:28.935413
cf4c43d0-7843-49f3-95a8-f31f713be5b0	96ef063c-83cc-4c08-a732-52bd7529b2f5	ac506204-19fd-480b-a622-142d74f56538	2024-09-12 19:46:53.232883
436d81a0-9130-426f-9a5d-47b0552d0139	96ef063c-83cc-4c08-a732-52bd7529b2f5	b9e496b7-11e0-4350-98ef-7718b612993f	2024-09-12 19:46:53.232883
06986e5f-7c42-4253-b22e-3f5b3556776b	0649a90f-2b53-42bc-869e-bc67f18e4690	e92f9c8d-3665-49bb-a1a3-2658e9b9361e	2024-10-05 23:44:35.398448
8155c3f5-2b45-4f51-9181-669d383342ee	0649a90f-2b53-42bc-869e-bc67f18e4690	b70c1540-93bc-4e05-a67d-211752c2de20	2024-10-05 23:44:35.398448
d3bbee22-777c-4b15-944c-6f9b4fd9a281	01ed63fa-09b0-47f8-ba1e-1df8c7118cbd	82b00d87-8474-4cae-9974-36c7e4e22dea	2024-10-19 19:27:43.867162
2ece902c-b929-4296-b314-87baedee39c4	01ed63fa-09b0-47f8-ba1e-1df8c7118cbd	b70c1540-93bc-4e05-a67d-211752c2de20	2024-10-19 19:27:43.867162
75cae5d4-4fc2-43f3-9118-4763054f1bad	5e053da7-a4ff-4a3f-ac89-18c28b6311d3	82b00d87-8474-4cae-9974-36c7e4e22dea	2024-10-19 19:51:18.736025
c508aff8-18c1-408d-b433-1bc08b7525c5	5e053da7-a4ff-4a3f-ac89-18c28b6311d3	b70c1540-93bc-4e05-a67d-211752c2de20	2024-10-19 19:51:18.736025
3000e6a4-1d0c-438d-ae8d-b889ff3130c3	b041e2eb-c688-4ee7-aa29-563e9477fd34	e92f9c8d-3665-49bb-a1a3-2658e9b9361e	2025-01-24 17:59:32.25215
5bd508a9-ed08-4460-9274-361258b6e236	b041e2eb-c688-4ee7-aa29-563e9477fd34	aaa2ae61-b95b-472c-9426-61a3297c2904	2025-01-24 17:59:32.25215
f19b7f78-8010-4d46-a063-8bb6ab286d5f	93287493-2cfa-42d2-be05-8458edd060d0	ac506204-19fd-480b-a622-142d74f56538	2025-01-30 18:51:37.905007
04f261c2-b58c-4a61-867e-e3ab8dfdff64	93287493-2cfa-42d2-be05-8458edd060d0	aaa2ae61-b95b-472c-9426-61a3297c2904	2025-01-30 18:51:37.905007
6291c231-1de7-48d7-b1aa-7d955e3d1771	515a8ce7-3b8c-458c-aed6-8558d82440be	ac506204-19fd-480b-a622-142d74f56538	2025-01-30 18:54:47.453572
89a3c731-3248-4528-adc6-f18b987e4ce8	515a8ce7-3b8c-458c-aed6-8558d82440be	aaa2ae61-b95b-472c-9426-61a3297c2904	2025-01-30 18:54:47.453572
d5706450-69fa-4081-9758-18a9d3bde81b	d87e3367-f3fe-4c77-86a3-5ce29f26e041	ac506204-19fd-480b-a622-142d74f56538	2025-01-31 13:22:58.684053
267c6826-abee-4564-82bf-02aa8e980da5	d87e3367-f3fe-4c77-86a3-5ce29f26e041	aaa2ae61-b95b-472c-9426-61a3297c2904	2025-01-31 13:22:58.684053
02f21d4e-e713-4b63-99f8-3291c4ea1018	e843fbb8-fb09-4138-a457-c4e27ff131e2	ac506204-19fd-480b-a622-142d74f56538	2025-01-31 17:59:40.408845
e8968c62-e866-4ad2-af3f-bbaf416fc4bd	e843fbb8-fb09-4138-a457-c4e27ff131e2	aaa2ae61-b95b-472c-9426-61a3297c2904	2025-01-31 17:59:40.408845
8f681025-c552-4d85-91f6-4f97a0bb18b9	96d013c2-1ced-4816-8af3-516d88028fd4	c1303a50-8e09-4d41-b314-b78e0dfa0b43	2025-01-31 18:14:59.486801
d3c0b2be-11dc-4737-b21b-9a1bbe3fa1e5	96d013c2-1ced-4816-8af3-516d88028fd4	aaa2ae61-b95b-472c-9426-61a3297c2904	2025-01-31 18:14:59.486801
f3ef649e-a720-47f3-a8d6-3cefadbea422	824d37aa-4074-4402-ae7e-5826e55e837d	c4259495-7c66-4de0-b4a1-23309c8989fc	2025-02-01 16:59:43.225522
ae203417-39e0-4bf3-b70e-e1618f148f08	824d37aa-4074-4402-ae7e-5826e55e837d	aaa2ae61-b95b-472c-9426-61a3297c2904	2025-02-01 16:59:43.225522
5748556c-27f2-4bc5-8245-2ca26dd76805	14b33935-4ed9-43ab-a9c6-d6ce544d670c	c1303a50-8e09-4d41-b314-b78e0dfa0b43	2025-02-02 21:35:45.717803
ba0fc01c-ba91-480f-b5c3-27a0be538a27	14b33935-4ed9-43ab-a9c6-d6ce544d670c	aaa2ae61-b95b-472c-9426-61a3297c2904	2025-02-02 21:35:45.717803
d0441a9b-bd8b-4a63-97eb-5dcd5b64d1f8	7a8a9b46-a014-4276-a440-7148a64048e2	c1303a50-8e09-4d41-b314-b78e0dfa0b43	2025-02-04 22:17:12.648362
0b94b940-b1bf-4128-beca-5104988b4a88	7a8a9b46-a014-4276-a440-7148a64048e2	aaa2ae61-b95b-472c-9426-61a3297c2904	2025-02-04 22:17:12.648362
437588dc-2398-4447-af14-645b10cc1142	a2ae725b-e755-41fd-958e-c65adda0849b	ac506204-19fd-480b-a622-142d74f56538	2025-02-04 22:21:23.314213
9f2d56d9-14af-4a88-8aa8-04513a641f77	a2ae725b-e755-41fd-958e-c65adda0849b	aaa2ae61-b95b-472c-9426-61a3297c2904	2025-02-04 22:21:23.314213
1402b3a1-5175-4ff1-ac1f-dcd3463669ba	ebadb35f-6686-400d-8158-739b70297fb5	ac506204-19fd-480b-a622-142d74f56538	2025-02-04 22:39:29.298446
0a8bbfea-0baa-47ad-969b-f17dd35b28b0	ebadb35f-6686-400d-8158-739b70297fb5	aaa2ae61-b95b-472c-9426-61a3297c2904	2025-02-04 22:39:29.298446
d58380d2-2a50-4d70-8cf5-1ae11d4a9365	8efe0223-7070-460d-a4b2-cd145774790a	ac506204-19fd-480b-a622-142d74f56538	2025-02-22 17:47:47.659158
46a9c8e2-e54a-4fc0-82a4-6157968c657e	8efe0223-7070-460d-a4b2-cd145774790a	aaa2ae61-b95b-472c-9426-61a3297c2904	2025-02-22 17:47:47.659158
37fa6fef-5b57-4620-b70a-554a5680f375	61479d2c-dbb0-403f-a9a8-dba04460e43d	c1303a50-8e09-4d41-b314-b78e0dfa0b43	2025-03-04 16:32:20.228399
8b262a28-d5cc-49b3-930f-31406510f460	61479d2c-dbb0-403f-a9a8-dba04460e43d	aaa2ae61-b95b-472c-9426-61a3297c2904	2025-03-04 16:32:20.228399
e5fd794d-aff1-4cda-97fb-22d85e83f367	19ceaad8-864d-4d4e-8cf3-b14ba9df5758	ac506204-19fd-480b-a622-142d74f56538	2025-07-02 21:23:43.652537
67f69df1-d8da-44c9-9bf2-067ed64045f3	19ceaad8-864d-4d4e-8cf3-b14ba9df5758	aaa2ae61-b95b-472c-9426-61a3297c2904	2025-07-02 21:23:43.652537
e0b164ef-0d57-4bf0-923f-f44dbf70b684	c4ceb661-03ea-4544-8fcb-e2cceef679b7	ac506204-19fd-480b-a622-142d74f56538	2025-07-02 23:37:20.135393
ff4cc727-507a-440f-9eda-428db2be7b9d	c4ceb661-03ea-4544-8fcb-e2cceef679b7	aaa2ae61-b95b-472c-9426-61a3297c2904	2025-07-02 23:37:20.135393
\.


--
-- Data for Name: message; Type: TABLE DATA; Schema: communication; Owner: postgres
--

COPY communication.message (message_id, chat_id, created_by, sender_id, message_type, read_at, created_at, content) FROM stdin;
464b7590-6caf-4cc2-b41e-dac0c3cb4e4b	01ed63fa-09b0-47f8-ba1e-1df8c7118cbd	82b00d87-8474-4cae-9974-36c7e4e22dea	82b00d87-8474-4cae-9974-36c7e4e22dea	71d5f4a5-0951-4d29-810e-1debf76a4c85	2024-10-19 19:33:52.269	2024-10-19 19:28:58.043	Ok
5b741237-699d-4ddd-99c2-e33b314339b8	d6e8acaa-0170-41c9-8dfb-e310d2e2feeb	e92f9c8d-3665-49bb-a1a3-2658e9b9361e	e92f9c8d-3665-49bb-a1a3-2658e9b9361e	71d5f4a5-0951-4d29-810e-1debf76a4c85	2024-08-28 20:07:01.181	2024-08-28 20:07:06.035	Tudo bem? Em que posso ajudar? 
2506e739-622a-437a-999e-155b7b9267fb	d6e8acaa-0170-41c9-8dfb-e310d2e2feeb	e92f9c8d-3665-49bb-a1a3-2658e9b9361e	e92f9c8d-3665-49bb-a1a3-2658e9b9361e	71d5f4a5-0951-4d29-810e-1debf76a4c85	2024-08-28 20:07:01.182	2024-08-28 20:07:27.88	kkkkk
12355e01-4d05-4f88-b218-6072ce52a025	d6e8acaa-0170-41c9-8dfb-e310d2e2feeb	e92f9c8d-3665-49bb-a1a3-2658e9b9361e	e92f9c8d-3665-49bb-a1a3-2658e9b9361e	71d5f4a5-0951-4d29-810e-1debf76a4c85	2024-08-28 20:07:01.182	2024-08-28 20:07:37.396	Parece at├® o luis
f1ac25bd-29e9-41aa-ae64-81440119615c	d6e8acaa-0170-41c9-8dfb-e310d2e2feeb	e92f9c8d-3665-49bb-a1a3-2658e9b9361e	e92f9c8d-3665-49bb-a1a3-2658e9b9361e	71d5f4a5-0951-4d29-810e-1debf76a4c85	2024-08-28 20:07:01.181	2024-08-28 20:07:21.108	Que nada
f3348c43-8fa8-4d7b-af3c-0b5361768888	d6e8acaa-0170-41c9-8dfb-e310d2e2feeb	e92f9c8d-3665-49bb-a1a3-2658e9b9361e	e92f9c8d-3665-49bb-a1a3-2658e9b9361e	71d5f4a5-0951-4d29-810e-1debf76a4c85	2024-08-28 20:07:01.182	2024-08-28 20:07:32.707	Se vira
67c10f74-91f3-43aa-a907-24168effa13b	d6e8acaa-0170-41c9-8dfb-e310d2e2feeb	e92f9c8d-3665-49bb-a1a3-2658e9b9361e	e92f9c8d-3665-49bb-a1a3-2658e9b9361e	71d5f4a5-0951-4d29-810e-1debf76a4c85	2024-08-28 20:07:01.181	2024-08-28 20:07:25.885	seu paulista
0d904d0a-295f-4ce2-9da1-42903539a3e7	d6e8acaa-0170-41c9-8dfb-e310d2e2feeb	e92f9c8d-3665-49bb-a1a3-2658e9b9361e	e92f9c8d-3665-49bb-a1a3-2658e9b9361e	71d5f4a5-0951-4d29-810e-1debf76a4c85	2024-08-28 20:07:01.182	2024-08-28 20:07:47.001	kkkkkk
3378f3e6-d208-48e1-bf72-1bcd417f66bc	d6e8acaa-0170-41c9-8dfb-e310d2e2feeb	e92f9c8d-3665-49bb-a1a3-2658e9b9361e	e92f9c8d-3665-49bb-a1a3-2658e9b9361e	71d5f4a5-0951-4d29-810e-1debf76a4c85	2024-09-06 21:15:42.925	2024-08-28 20:08:30.052	To vendo
c4346d7a-d06b-486c-b7da-e513b1980287	d6e8acaa-0170-41c9-8dfb-e310d2e2feeb	e92f9c8d-3665-49bb-a1a3-2658e9b9361e	e92f9c8d-3665-49bb-a1a3-2658e9b9361e	71d5f4a5-0951-4d29-810e-1debf76a4c85	2024-09-06 21:15:42.925	2024-08-28 20:08:34.986	Tu ├® o bixo
79fb6976-f993-4fbd-bf92-41c50e86c203	d6e8acaa-0170-41c9-8dfb-e310d2e2feeb	e92f9c8d-3665-49bb-a1a3-2658e9b9361e	e92f9c8d-3665-49bb-a1a3-2658e9b9361e	71d5f4a5-0951-4d29-810e-1debf76a4c85	2024-09-06 21:15:42.925	2024-08-28 20:08:31.581	kkkkk
32777851-a7e6-4ed6-9380-46da903ce0eb	0649a90f-2b53-42bc-869e-bc67f18e4690	e92f9c8d-3665-49bb-a1a3-2658e9b9361e	e92f9c8d-3665-49bb-a1a3-2658e9b9361e	71d5f4a5-0951-4d29-810e-1debf76a4c85	\N	2025-01-22 13:52:32.302	Teste 2
88b86f96-06cd-4922-9504-20dd42f0ea51	d6e8acaa-0170-41c9-8dfb-e310d2e2feeb	e92f9c8d-3665-49bb-a1a3-2658e9b9361e	e92f9c8d-3665-49bb-a1a3-2658e9b9361e	71d5f4a5-0951-4d29-810e-1debf76a4c85	2024-09-18 19:58:28.567	2024-09-12 14:22:08.086	Salve tudo bem
324c823c-6530-40a1-b56a-bb5d7bbad6b3	d6e8acaa-0170-41c9-8dfb-e310d2e2feeb	e92f9c8d-3665-49bb-a1a3-2658e9b9361e	e92f9c8d-3665-49bb-a1a3-2658e9b9361e	71d5f4a5-0951-4d29-810e-1debf76a4c85	2024-09-18 19:58:28.567	2024-09-12 14:22:13.733	SignalR
68893984-c842-43c6-9882-273830848bd9	0649a90f-2b53-42bc-869e-bc67f18e4690	e92f9c8d-3665-49bb-a1a3-2658e9b9361e	e92f9c8d-3665-49bb-a1a3-2658e9b9361e	71d5f4a5-0951-4d29-810e-1debf76a4c85	2024-10-06 00:10:29.876	2024-10-05 23:48:08.714	Seja bem vindo
f2a3aac9-f190-4fba-8191-abedd8c70b3e	d6e8acaa-0170-41c9-8dfb-e310d2e2feeb	b9e496b7-11e0-4350-98ef-7718b612993f	\N	71d5f4a5-0951-4d29-810e-1debf76a4c85	2024-08-28 20:06:57.353	2024-08-28 20:06:15.68	Ol├í
cddfca6b-69dc-4031-ad1a-be912a5e7b54	d6e8acaa-0170-41c9-8dfb-e310d2e2feeb	b9e496b7-11e0-4350-98ef-7718b612993f	\N	71d5f4a5-0951-4d29-810e-1debf76a4c85	2024-09-06 21:10:27.042	2024-08-28 20:07:35.443	To de olho
7add61dc-45e4-4180-95a7-c889c1475a5d	d6e8acaa-0170-41c9-8dfb-e310d2e2feeb	b9e496b7-11e0-4350-98ef-7718b612993f	\N	71d5f4a5-0951-4d29-810e-1debf76a4c85	2024-09-06 21:10:27.041	2024-08-28 20:07:25.895	Necessito de ajuda
1acd3aab-767b-4e28-8578-1f8b0c83225b	d6e8acaa-0170-41c9-8dfb-e310d2e2feeb	b9e496b7-11e0-4350-98ef-7718b612993f	\N	71d5f4a5-0951-4d29-810e-1debf76a4c85	2024-09-12 14:22:02.859	2024-09-12 14:21:58.597	Oi pessoal
2cf04f9c-7895-44ba-9054-f77d696bdd40	d6e8acaa-0170-41c9-8dfb-e310d2e2feeb	b9e496b7-11e0-4350-98ef-7718b612993f	\N	71d5f4a5-0951-4d29-810e-1debf76a4c85	2024-10-05 23:47:54.024	2024-09-12 14:22:19.749	ok
1855ccb5-1a96-451f-b029-200e7b4a8542	0649a90f-2b53-42bc-869e-bc67f18e4690	e92f9c8d-3665-49bb-a1a3-2658e9b9361e	e92f9c8d-3665-49bb-a1a3-2658e9b9361e	71d5f4a5-0951-4d29-810e-1debf76a4c85	2024-10-17 00:30:09.366	2024-10-17 00:30:02.909	Ol├í
f29ed5bf-1589-4295-8df5-40f28fbe978c	01ed63fa-09b0-47f8-ba1e-1df8c7118cbd	82b00d87-8474-4cae-9974-36c7e4e22dea	82b00d87-8474-4cae-9974-36c7e4e22dea	71d5f4a5-0951-4d29-810e-1debf76a4c85	2024-10-19 19:28:24.247	2024-10-19 19:28:03.96	Ol├í
087693e5-11d2-4a7c-a1e0-267bad28e168	01ed63fa-09b0-47f8-ba1e-1df8c7118cbd	82b00d87-8474-4cae-9974-36c7e4e22dea	82b00d87-8474-4cae-9974-36c7e4e22dea	71d5f4a5-0951-4d29-810e-1debf76a4c85	2024-10-19 19:28:24.247	2024-10-19 19:28:13.389	A entrega est├í atrasada
2020dca5-b485-4c51-a49e-93526462e2f0	b041e2eb-c688-4ee7-aa29-563e9477fd34	aaa2ae61-b95b-472c-9426-61a3297c2904	aaa2ae61-b95b-472c-9426-61a3297c2904	71d5f4a5-0951-4d29-810e-1debf76a4c85	2025-01-24 18:00:11.608	2025-01-24 17:59:36.753	Opa
ef983ea9-3e01-4448-be09-94cbbf79d455	0649a90f-2b53-42bc-869e-bc67f18e4690	b70c1540-93bc-4e05-a67d-211752c2de20	\N	71d5f4a5-0951-4d29-810e-1debf76a4c85	2025-01-22 13:52:28.24	2025-01-22 13:52:21.379	TT
fa239d7c-d5ca-4888-9053-04a7c8d1ecca	0649a90f-2b53-42bc-869e-bc67f18e4690	b70c1540-93bc-4e05-a67d-211752c2de20	\N	71d5f4a5-0951-4d29-810e-1debf76a4c85	2024-10-17 00:30:00.208	2024-10-06 00:10:35.846	Obrigado
729a29cd-a52a-4cb9-b075-96fb0ab1b147	0649a90f-2b53-42bc-869e-bc67f18e4690	b70c1540-93bc-4e05-a67d-211752c2de20	\N	71d5f4a5-0951-4d29-810e-1debf76a4c85	2024-10-17 14:46:33.418	2024-10-17 12:25:39.816	ol├í
be2bfcbb-ca60-4b19-a77b-c9179e0cd12d	01ed63fa-09b0-47f8-ba1e-1df8c7118cbd	b70c1540-93bc-4e05-a67d-211752c2de20	\N	71d5f4a5-0951-4d29-810e-1debf76a4c85	2024-10-19 19:29:08.207	2024-10-19 19:28:54.46	Chegar├í em 3 dias!
adad5f66-f442-4d57-99a1-a59b5b60593f	01ed63fa-09b0-47f8-ba1e-1df8c7118cbd	b70c1540-93bc-4e05-a67d-211752c2de20	\N	71d5f4a5-0951-4d29-810e-1debf76a4c85	2024-10-19 19:29:08.206	2024-10-19 19:28:31.007	Ol├í!
c53f4230-0b25-404d-b281-47650afc8aba	515a8ce7-3b8c-458c-aed6-8558d82440be	aaa2ae61-b95b-472c-9426-61a3297c2904	aaa2ae61-b95b-472c-9426-61a3297c2904	71d5f4a5-0951-4d29-810e-1debf76a4c85	2025-01-30 18:55:23.586	2025-01-30 18:54:59.8	Opa eai
38b53604-300e-4943-993f-c805d8d3381d	b041e2eb-c688-4ee7-aa29-563e9477fd34	e92f9c8d-3665-49bb-a1a3-2658e9b9361e	e92f9c8d-3665-49bb-a1a3-2658e9b9361e	71d5f4a5-0951-4d29-810e-1debf76a4c85	2025-01-30 19:03:57.606	2025-01-30 19:03:51.843	?
5ffd2d69-ad0e-4f1a-80a4-df5f9becb9a2	b041e2eb-c688-4ee7-aa29-563e9477fd34	e92f9c8d-3665-49bb-a1a3-2658e9b9361e	e92f9c8d-3665-49bb-a1a3-2658e9b9361e	71d5f4a5-0951-4d29-810e-1debf76a4c85	2025-01-30 19:03:57.606	2025-01-30 19:03:43.323	Ei revendedor vc recusou um pedido sem justificativa
6e92ac09-40cc-4514-be77-ae8771981d1c	b041e2eb-c688-4ee7-aa29-563e9477fd34	aaa2ae61-b95b-472c-9426-61a3297c2904	aaa2ae61-b95b-472c-9426-61a3297c2904	71d5f4a5-0951-4d29-810e-1debf76a4c85	2025-01-30 19:06:08.663	2025-01-30 19:04:03.051	opa mals ai
e43daa76-3e22-4495-84c5-aa86a634745c	b041e2eb-c688-4ee7-aa29-563e9477fd34	aaa2ae61-b95b-472c-9426-61a3297c2904	aaa2ae61-b95b-472c-9426-61a3297c2904	71d5f4a5-0951-4d29-810e-1debf76a4c85	2025-01-31 02:32:12.988	2025-01-31 02:31:58.579	Eae Guedes
b445d4c2-0ec1-4aa3-ace1-4e5f68f5761a	515a8ce7-3b8c-458c-aed6-8558d82440be	ac506204-19fd-480b-a622-142d74f56538	ac506204-19fd-480b-a622-142d74f56538	71d5f4a5-0951-4d29-810e-1debf76a4c85	2025-01-31 02:32:31.708	2025-01-30 18:55:39.997	Tudo na paz
962b5d4d-3509-4512-9d9f-29cd7a03d2cb	b041e2eb-c688-4ee7-aa29-563e9477fd34	e92f9c8d-3665-49bb-a1a3-2658e9b9361e	e92f9c8d-3665-49bb-a1a3-2658e9b9361e	71d5f4a5-0951-4d29-810e-1debf76a4c85	2025-01-31 02:51:00.958	2025-01-31 02:32:16.091	opa
5b07c6d9-6e08-411f-8aa4-cb935190168f	d87e3367-f3fe-4c77-86a3-5ce29f26e041	ac506204-19fd-480b-a622-142d74f56538	ac506204-19fd-480b-a622-142d74f56538	71d5f4a5-0951-4d29-810e-1debf76a4c85	2025-01-31 13:23:26.54	2025-01-31 13:23:18.232	Ow ta demorando demais
ab13a919-74ae-4dba-87fd-987b2fbe7413	d87e3367-f3fe-4c77-86a3-5ce29f26e041	aaa2ae61-b95b-472c-9426-61a3297c2904	aaa2ae61-b95b-472c-9426-61a3297c2904	71d5f4a5-0951-4d29-810e-1debf76a4c85	\N	2025-01-31 13:23:35.166	ah ja chegou
808dc53e-d694-47e4-beb2-06231ccf069c	b041e2eb-c688-4ee7-aa29-563e9477fd34	e92f9c8d-3665-49bb-a1a3-2658e9b9361e	e92f9c8d-3665-49bb-a1a3-2658e9b9361e	71d5f4a5-0951-4d29-810e-1debf76a4c85	2025-01-31 17:58:43.27	2025-01-31 11:45:35.054	em que posso ajudar
d29fa133-dbcf-44a0-8736-05e4743b2a0b	96d013c2-1ced-4816-8af3-516d88028fd4	c1303a50-8e09-4d41-b314-b78e0dfa0b43	c1303a50-8e09-4d41-b314-b78e0dfa0b43	71d5f4a5-0951-4d29-810e-1debf76a4c85	2025-01-31 18:15:25.818	2025-01-31 18:15:16.548	Escuta meu filho, kd meu gas ?
5a68ef32-7051-4a75-a419-64bcdb083477	96d013c2-1ced-4816-8af3-516d88028fd4	aaa2ae61-b95b-472c-9426-61a3297c2904	aaa2ae61-b95b-472c-9426-61a3297c2904	71d5f4a5-0951-4d29-810e-1debf76a4c85	\N	2025-01-31 18:16:01.076	boa tarde, irei verificar s├│ um instante ! Ha.. e claro muito obrigado pela sua prefer├¬ncia ! :)
74a9dfe8-4aa6-4b92-bfb3-24ab80fc6ada	96d013c2-1ced-4816-8af3-516d88028fd4	c1303a50-8e09-4d41-b314-b78e0dfa0b43	c1303a50-8e09-4d41-b314-b78e0dfa0b43	71d5f4a5-0951-4d29-810e-1debf76a4c85	2025-01-31 18:16:49.471	2025-01-31 18:16:33.487	desculpa estou nervoso, estou terminando um churrasco
ecc29f0e-c144-4bc3-8ff4-288f07e3564e	96d013c2-1ced-4816-8af3-516d88028fd4	aaa2ae61-b95b-472c-9426-61a3297c2904	aaa2ae61-b95b-472c-9426-61a3297c2904	71d5f4a5-0951-4d29-810e-1debf76a4c85	\N	2025-01-31 18:17:01.23	o entregar est├í na rua.. obrigado pela prefer├¬ncia
fa502d2c-876e-478f-8284-513d8507ba26	b041e2eb-c688-4ee7-aa29-563e9477fd34	aaa2ae61-b95b-472c-9426-61a3297c2904	aaa2ae61-b95b-472c-9426-61a3297c2904	71d5f4a5-0951-4d29-810e-1debf76a4c85	2025-01-31 18:20:38.168	2025-01-31 11:45:43.529	 aplataforma est├í com lentid├úo
2116e262-436c-428e-89fd-8dd05dc05d49	b041e2eb-c688-4ee7-aa29-563e9477fd34	aaa2ae61-b95b-472c-9426-61a3297c2904	aaa2ae61-b95b-472c-9426-61a3297c2904	71d5f4a5-0951-4d29-810e-1debf76a4c85	2025-01-31 18:20:38.168	2025-01-31 11:45:24.403	bom dia
9a0b3d97-0617-4282-8c72-433367932c19	96d013c2-1ced-4816-8af3-516d88028fd4	c1303a50-8e09-4d41-b314-b78e0dfa0b43	c1303a50-8e09-4d41-b314-b78e0dfa0b43	71d5f4a5-0951-4d29-810e-1debf76a4c85	2025-01-31 18:24:19.056	2025-01-31 18:17:11.539	ha, perfeito, muito obrigado
8af481a3-fa2b-4d8e-b3f3-5f6e3248f073	b041e2eb-c688-4ee7-aa29-563e9477fd34	aaa2ae61-b95b-472c-9426-61a3297c2904	aaa2ae61-b95b-472c-9426-61a3297c2904	71d5f4a5-0951-4d29-810e-1debf76a4c85	2025-02-01 16:47:44.655	2025-02-01 16:47:39.478	oi
f858865a-c484-4b88-b57a-c228a4b69911	b041e2eb-c688-4ee7-aa29-563e9477fd34	e92f9c8d-3665-49bb-a1a3-2658e9b9361e	e92f9c8d-3665-49bb-a1a3-2658e9b9361e	71d5f4a5-0951-4d29-810e-1debf76a4c85	2025-02-01 17:05:15.92	2025-02-01 16:47:51.514	posso ajudar em algo ?
7c9f255e-69ff-4180-97cf-92648c9081eb	824d37aa-4074-4402-ae7e-5826e55e837d	aaa2ae61-b95b-472c-9426-61a3297c2904	aaa2ae61-b95b-472c-9426-61a3297c2904	71d5f4a5-0951-4d29-810e-1debf76a4c85	\N	2025-02-01 17:00:18.191	oi senhora
9e184839-12cd-4f5a-a203-f75c5d1c53a2	824d37aa-4074-4402-ae7e-5826e55e837d	c4259495-7c66-4de0-b4a1-23309c8989fc	\N	71d5f4a5-0951-4d29-810e-1debf76a4c85	2025-02-01 17:00:14.388	2025-02-01 17:00:07.028	escuta meu filho
5ab11528-a8d5-4170-b215-488f042a9b91	824d37aa-4074-4402-ae7e-5826e55e837d	c4259495-7c66-4de0-b4a1-23309c8989fc	\N	71d5f4a5-0951-4d29-810e-1debf76a4c85	\N	2025-02-01 17:00:26.521	vai demorar ?
4aa17adb-8470-4928-bfab-acb621f3be76	14b33935-4ed9-43ab-a9c6-d6ce544d670c	c1303a50-8e09-4d41-b314-b78e0dfa0b43	c1303a50-8e09-4d41-b314-b78e0dfa0b43	71d5f4a5-0951-4d29-810e-1debf76a4c85	2025-02-02 21:36:10.016	2025-02-01 22:50:21.181	onde est├í meu prduto ?
6c83b882-f51f-48d5-a08b-17d9e4e8f426	14b33935-4ed9-43ab-a9c6-d6ce544d670c	aaa2ae61-b95b-472c-9426-61a3297c2904	aaa2ae61-b95b-472c-9426-61a3297c2904	71d5f4a5-0951-4d29-810e-1debf76a4c85	\N	2025-02-02 21:36:16.924	s├│ um instante
901faea0-40b2-45a1-99cd-5676cbc4bee2	14b33935-4ed9-43ab-a9c6-d6ce544d670c	aaa2ae61-b95b-472c-9426-61a3297c2904	aaa2ae61-b95b-472c-9426-61a3297c2904	71d5f4a5-0951-4d29-810e-1debf76a4c85	\N	2025-02-02 21:37:10.64	j├í est├í na rua
623548b5-787b-4bfd-9373-9a925a66e6b7	14b33935-4ed9-43ab-a9c6-d6ce544d670c	c1303a50-8e09-4d41-b314-b78e0dfa0b43	c1303a50-8e09-4d41-b314-b78e0dfa0b43	71d5f4a5-0951-4d29-810e-1debf76a4c85	2025-06-09 00:00:31.931	2025-02-01 22:51:19.72	ok
5c3efb2b-3067-41cb-bf89-5d8b1353056f	14b33935-4ed9-43ab-a9c6-d6ce544d670c	c1303a50-8e09-4d41-b314-b78e0dfa0b43	c1303a50-8e09-4d41-b314-b78e0dfa0b43	71d5f4a5-0951-4d29-810e-1debf76a4c85	2025-06-09 00:00:31.931	2025-02-01 22:51:31.99	tudo bem
d56e8e4a-abd6-4664-93a3-c0d5982e2b36	b041e2eb-c688-4ee7-aa29-563e9477fd34	aaa2ae61-b95b-472c-9426-61a3297c2904	aaa2ae61-b95b-472c-9426-61a3297c2904	71d5f4a5-0951-4d29-810e-1debf76a4c85	2025-02-02 21:38:40.052	2025-02-01 16:47:58.308	pode sim meu amigo
ef0ad142-cbb2-4bf0-a1fd-159b9f5d01c9	b041e2eb-c688-4ee7-aa29-563e9477fd34	e92f9c8d-3665-49bb-a1a3-2658e9b9361e	e92f9c8d-3665-49bb-a1a3-2658e9b9361e	71d5f4a5-0951-4d29-810e-1debf76a4c85	2025-02-04 16:57:27.145	2025-02-02 21:38:49.874	s├│ um instante vamos verificar
f2cf66fc-1d02-47ed-87a8-54b5f7927f14	b041e2eb-c688-4ee7-aa29-563e9477fd34	aaa2ae61-b95b-472c-9426-61a3297c2904	aaa2ae61-b95b-472c-9426-61a3297c2904	71d5f4a5-0951-4d29-810e-1debf76a4c85	2025-02-04 16:57:36.148	2025-02-02 21:38:30.857	olha a plpataaforma est├í lenta
7fbdb927-6c3a-4dc0-bc0a-33c845f28e45	b041e2eb-c688-4ee7-aa29-563e9477fd34	aaa2ae61-b95b-472c-9426-61a3297c2904	aaa2ae61-b95b-472c-9426-61a3297c2904	71d5f4a5-0951-4d29-810e-1debf76a4c85	2025-02-04 22:10:11.375	2025-02-04 16:57:33.156	tudo bem ?
53cf49b0-1fd7-4507-8d7a-62e79bdfa5d0	a2ae725b-e755-41fd-958e-c65adda0849b	aaa2ae61-b95b-472c-9426-61a3297c2904	aaa2ae61-b95b-472c-9426-61a3297c2904	71d5f4a5-0951-4d29-810e-1debf76a4c85	2025-02-04 22:21:43.089	2025-02-04 22:21:46.198	n├úo estou te achando
6f60c078-7ad2-4fdc-aa10-88ab3675be98	a2ae725b-e755-41fd-958e-c65adda0849b	aaa2ae61-b95b-472c-9426-61a3297c2904	aaa2ae61-b95b-472c-9426-61a3297c2904	71d5f4a5-0951-4d29-810e-1debf76a4c85	2025-02-04 22:21:43.088	2025-02-04 22:21:42.07	Opa beleza
74766023-211a-45d6-9e8a-ba87339960fd	ebadb35f-6686-400d-8158-739b70297fb5	ac506204-19fd-480b-a622-142d74f56538	ac506204-19fd-480b-a622-142d74f56538	71d5f4a5-0951-4d29-810e-1debf76a4c85	2025-02-04 22:39:58.812	2025-02-04 22:39:44.535	Oi
36d692a6-7f05-46cc-8b3d-a2513b3ab712	ebadb35f-6686-400d-8158-739b70297fb5	aaa2ae61-b95b-472c-9426-61a3297c2904	aaa2ae61-b95b-472c-9426-61a3297c2904	71d5f4a5-0951-4d29-810e-1debf76a4c85	\N	2025-02-04 22:40:01.227	opa
54cec234-5507-4e6f-bebd-d185a780d50f	a2ae725b-e755-41fd-958e-c65adda0849b	ac506204-19fd-480b-a622-142d74f56538	ac506204-19fd-480b-a622-142d74f56538	71d5f4a5-0951-4d29-810e-1debf76a4c85	2025-02-22 17:48:43.432	2025-02-04 22:21:49.944	Rua 14
b65eeb7c-bba4-4f00-9836-68ffaf1463ed	a2ae725b-e755-41fd-958e-c65adda0849b	ac506204-19fd-480b-a622-142d74f56538	ac506204-19fd-480b-a622-142d74f56538	71d5f4a5-0951-4d29-810e-1debf76a4c85	2025-02-22 17:48:43.432	2025-02-04 22:21:55.934	Vai demorar
3ea3f07e-a3e3-4e73-b581-867f2411fcdd	8efe0223-7070-460d-a4b2-cd145774790a	aaa2ae61-b95b-472c-9426-61a3297c2904	aaa2ae61-b95b-472c-9426-61a3297c2904	71d5f4a5-0951-4d29-810e-1debf76a4c85	\N	2025-02-22 17:49:06.629	oi
41874f91-f21a-458f-b12a-30ee72277524	b041e2eb-c688-4ee7-aa29-563e9477fd34	e92f9c8d-3665-49bb-a1a3-2658e9b9361e	e92f9c8d-3665-49bb-a1a3-2658e9b9361e	71d5f4a5-0951-4d29-810e-1debf76a4c85	2025-02-22 18:02:35.754	2025-02-04 16:57:43.77	tudo
fd347ca0-a543-4e86-9525-12566e79896d	61479d2c-dbb0-403f-a9a8-dba04460e43d	c1303a50-8e09-4d41-b314-b78e0dfa0b43	c1303a50-8e09-4d41-b314-b78e0dfa0b43	71d5f4a5-0951-4d29-810e-1debf76a4c85	2025-03-04 16:32:36.993	2025-03-04 16:32:29.634	e ai ?
9245eea8-6b63-470f-b1fa-7fa185a5e7d4	61479d2c-dbb0-403f-a9a8-dba04460e43d	aaa2ae61-b95b-472c-9426-61a3297c2904	aaa2ae61-b95b-472c-9426-61a3297c2904	71d5f4a5-0951-4d29-810e-1debf76a4c85	\N	2025-03-04 16:32:41.105	pois n├úo senhor ?
e55c9dfd-b944-4650-9433-2221e678a9df	b041e2eb-c688-4ee7-aa29-563e9477fd34	aaa2ae61-b95b-472c-9426-61a3297c2904	aaa2ae61-b95b-472c-9426-61a3297c2904	71d5f4a5-0951-4d29-810e-1debf76a4c85	2025-03-14 13:46:48.404	2025-02-22 18:02:38.472	oi
9763f614-c34f-4fa9-9f1a-82473c00df2b	61479d2c-dbb0-403f-a9a8-dba04460e43d	c1303a50-8e09-4d41-b314-b78e0dfa0b43	c1303a50-8e09-4d41-b314-b78e0dfa0b43	71d5f4a5-0951-4d29-810e-1debf76a4c85	2025-06-06 19:36:03.339	2025-03-04 16:32:52.256	est├í chegando ?
c70b4240-6c2f-484c-a377-1e2d7850c071	b041e2eb-c688-4ee7-aa29-563e9477fd34	aaa2ae61-b95b-472c-9426-61a3297c2904	aaa2ae61-b95b-472c-9426-61a3297c2904	71d5f4a5-0951-4d29-810e-1debf76a4c85	2025-06-06 19:38:30.439	2025-06-06 19:36:18.794	├® o leon, o bot├úo nao funciona
33e571c2-80db-43a7-82a5-42c4dfe42194	b041e2eb-c688-4ee7-aa29-563e9477fd34	e92f9c8d-3665-49bb-a1a3-2658e9b9361e	e92f9c8d-3665-49bb-a1a3-2658e9b9361e	71d5f4a5-0951-4d29-810e-1debf76a4c85	2025-06-08 23:42:48.162	2025-06-06 19:38:35.177	funciona sim
cb4fd334-6b4f-4489-bda8-47f81cb3a0ce	b041e2eb-c688-4ee7-aa29-563e9477fd34	aaa2ae61-b95b-472c-9426-61a3297c2904	aaa2ae61-b95b-472c-9426-61a3297c2904	71d5f4a5-0951-4d29-810e-1debf76a4c85	2025-07-02 22:43:13.012	2025-06-08 23:43:16.098	teste edwy
be8ccc90-71a3-433f-970d-6b5b80d999ed	b041e2eb-c688-4ee7-aa29-563e9477fd34	aaa2ae61-b95b-472c-9426-61a3297c2904	aaa2ae61-b95b-472c-9426-61a3297c2904	71d5f4a5-0951-4d29-810e-1debf76a4c85	2025-07-02 23:13:36.763	2025-07-02 23:13:28.662	Olha to com problema
ce294b66-0c79-4558-98fb-3bde5c034906	b041e2eb-c688-4ee7-aa29-563e9477fd34	e92f9c8d-3665-49bb-a1a3-2658e9b9361e	e92f9c8d-3665-49bb-a1a3-2658e9b9361e	71d5f4a5-0951-4d29-810e-1debf76a4c85	2025-07-02 23:41:20.489	2025-07-02 23:13:42.038	qual problema
8010523f-2090-452f-aebd-f65a2f60c4a8	c4ceb661-03ea-4544-8fcb-e2cceef679b7	ac506204-19fd-480b-a622-142d74f56538	ac506204-19fd-480b-a622-142d74f56538	71d5f4a5-0951-4d29-810e-1debf76a4c85	2025-07-02 23:41:22.853	2025-07-02 23:39:12.44	Oi demora
6f80cefe-4811-480f-b323-8931c6cd9329	c4ceb661-03ea-4544-8fcb-e2cceef679b7	aaa2ae61-b95b-472c-9426-61a3297c2904	aaa2ae61-b95b-472c-9426-61a3297c2904	71d5f4a5-0951-4d29-810e-1debf76a4c85	\N	2025-07-02 23:41:30.524	o que quer dizer isso?
d5f4b3e6-56dc-49f9-98f3-2272ce30ec0d	c4ceb661-03ea-4544-8fcb-e2cceef679b7	ac506204-19fd-480b-a622-142d74f56538	ac506204-19fd-480b-a622-142d74f56538	71d5f4a5-0951-4d29-810e-1debf76a4c85	\N	2025-07-02 23:39:46.452	Menos um cliente
940596e5-a06a-4765-be10-49c1c09ed389	b041e2eb-c688-4ee7-aa29-563e9477fd34	e92f9c8d-3665-49bb-a1a3-2658e9b9361e	e92f9c8d-3665-49bb-a1a3-2658e9b9361e	71d5f4a5-0951-4d29-810e-1debf76a4c85	\N	2025-10-31 12:39:38.543	oi
\.


--
-- Data for Name: message_type; Type: TABLE DATA; Schema: communication; Owner: postgres
--

COPY communication.message_type (message_type_id, description, tag) FROM stdin;
71d5f4a5-0951-4d29-810e-1debf76a4c85	Text	TEXT
32a7585e-c2ef-4920-89f3-ca339578c7b3	Image	IMG
\.


--
-- Data for Name: notification; Type: TABLE DATA; Schema: communication; Owner: postgres
--

COPY communication.notification (notification_id, title, description, read_at, user_id, type, aux_content, created_at) FROM stdin;
4ab3c2fc-5678-46d7-b586-d799697d4aa9	Joel Cosmeticos enviou uma mensagem.	Ola	\N	fbb0c2f7-46e5-4f40-bca0-4b8000844ba1	chat_message	7f3437d3-74be-4725-9151-fcfce0f26276	2023-10-10 22:22:46.83027
75a71eaf-9950-499e-915b-fe694e18c048	Joel Cosmeticos enviou uma mensagem.	nao estou achando sua rua	\N	fbb0c2f7-46e5-4f40-bca0-4b8000844ba1	chat_message	7f3437d3-74be-4725-9151-fcfce0f26276	2023-10-10 22:22:50.149227
9e4109ee-6b6f-4546-845a-7d351c8c4c80	Joel enviou uma mensagem.	Ok, pr├│ximo a unip	2023-10-11 19:39:31.47702	a0b2b979-529f-44a8-8c0d-08b23e8196a0	chat_message	7f3437d3-74be-4725-9151-fcfce0f26276	2023-10-10 22:23:42.79344
4c11e501-8438-41d8-9ee8-f8ac671c92a2	Keila Amada enviou uma mensagem.	oi	2023-10-16 20:49:16.118057	e92f9c8d-3665-49bb-a1a3-2658e9b9361e	chat_message	0eff82c7-dd1d-4348-bcc2-6e60bab38268	2023-09-06 20:51:23.714376
c55cb68b-44f7-413d-b503-35fadd29fe8d	Emmanuel Menezes enviou uma mensagem.	o erro ├® x	2023-10-16 21:15:47.311584	e593a574-16a8-4b6d-be04-dac62360c99c	chat_message	bd21c046-08fe-412c-8058-fe9a71449423	2023-10-10 21:56:29.601758
d400e279-0d39-4056-bd6e-e0f4ac6ed47f	Parceiro Piloto enviou uma mensagem.	Ol├í	2024-08-28 20:06:57.209669	e92f9c8d-3665-49bb-a1a3-2658e9b9361e	chat_message	d6e8acaa-0170-41c9-8dfb-e310d2e2feeb	2024-08-28 20:06:15.778315
be69dd20-97d3-4eb0-8642-96f643dcbc11	Emmanuel Menezes enviou uma mensagem.	Parece at├® o luis	2024-08-28 20:07:50.249192	b9e496b7-11e0-4350-98ef-7718b612993f	chat_message	d6e8acaa-0170-41c9-8dfb-e310d2e2feeb	2024-08-28 20:07:36.654036
799c4fcf-5a6a-420f-9614-f288b1584fcf	Emmanuel Menezes enviou uma mensagem.	kkkkk	2024-08-28 20:07:50.259643	b9e496b7-11e0-4350-98ef-7718b612993f	chat_message	d6e8acaa-0170-41c9-8dfb-e310d2e2feeb	2024-08-28 20:07:27.137685
5a01de60-cf60-466f-920e-d303ce452c2f	Emmanuel Menezes enviou uma mensagem.	Tudo bem? Em que posso ajudar? 	2024-08-28 20:07:50.272199	b9e496b7-11e0-4350-98ef-7718b612993f	chat_message	d6e8acaa-0170-41c9-8dfb-e310d2e2feeb	2024-08-28 20:07:06.106256
7b261e9f-a613-4692-96f2-39d76f87625d	Emmanuel Menezes enviou uma mensagem.	Que nada	2024-08-28 20:07:50.373222	b9e496b7-11e0-4350-98ef-7718b612993f	chat_message	d6e8acaa-0170-41c9-8dfb-e310d2e2feeb	2024-08-28 20:07:20.370031
2665bc6f-6328-4e9f-a9c1-68ec8fcd21e8	Emmanuel Menezes enviou uma mensagem.	seu paulista	2024-08-28 20:07:50.37324	b9e496b7-11e0-4350-98ef-7718b612993f	chat_message	d6e8acaa-0170-41c9-8dfb-e310d2e2feeb	2024-08-28 20:07:25.167654
cbb55edd-5ba9-4244-b095-e632b5aa526d	Emmanuel Menezes enviou uma mensagem.	Se vira	2024-08-28 20:07:50.375422	b9e496b7-11e0-4350-98ef-7718b612993f	chat_message	d6e8acaa-0170-41c9-8dfb-e310d2e2feeb	2024-08-28 20:07:31.965495
1fc9c336-2957-4b69-9346-199480c5f470	Emmanuel Menezes enviou uma mensagem.	To vendo	2024-09-06 21:15:38.686937	b9e496b7-11e0-4350-98ef-7718b612993f	chat_message	d6e8acaa-0170-41c9-8dfb-e310d2e2feeb	2024-08-28 20:08:30.122381
46c6a7a2-9ff2-42fa-bb13-623ca70280c7	Emmanuel Menezes enviou uma mensagem.	kkkkk	2024-09-06 21:15:38.687215	b9e496b7-11e0-4350-98ef-7718b612993f	chat_message	d6e8acaa-0170-41c9-8dfb-e310d2e2feeb	2024-08-28 20:08:31.652007
fa540584-e0d2-4481-8954-4f18257762a2	Emmanuel Menezes enviou uma mensagem.	Tu ├® o bixo	2024-09-06 21:15:38.78933	b9e496b7-11e0-4350-98ef-7718b612993f	chat_message	d6e8acaa-0170-41c9-8dfb-e310d2e2feeb	2024-08-28 20:08:35.055916
9f880ed4-7e94-4f99-b1b9-e1e85b2c44cf	Emmanuel Menezes enviou uma mensagem.	kkkkkk	2024-09-06 21:15:38.791697	b9e496b7-11e0-4350-98ef-7718b612993f	chat_message	d6e8acaa-0170-41c9-8dfb-e310d2e2feeb	2024-08-28 20:07:47.071139
26ae4fe5-7eb7-4b83-931e-c754f8e30b6b	Emmanuel Menezes enviou uma mensagem.	SignalR	2024-10-03 14:27:21.40972	b9e496b7-11e0-4350-98ef-7718b612993f	chat_message	d6e8acaa-0170-41c9-8dfb-e310d2e2feeb	2024-09-12 14:22:05.814532
471cb261-af27-4667-95f5-a26c126c9718	Emmanuel Menezes enviou uma mensagem.	Salve tudo bem	2024-10-03 14:27:21.421196	b9e496b7-11e0-4350-98ef-7718b612993f	chat_message	d6e8acaa-0170-41c9-8dfb-e310d2e2feeb	2024-09-12 14:22:00.169022
85c9d161-1fff-43cc-a92d-57ec6c0fba8f	Parceiro Piloto enviou uma mensagem.	To de olho	2024-10-05 23:48:02.97472	e92f9c8d-3665-49bb-a1a3-2658e9b9361e	chat_message	d6e8acaa-0170-41c9-8dfb-e310d2e2feeb	2024-08-28 20:08:24.925822
9820393a-e688-458d-9c6b-e5d488152c5a	Parceiro Piloto enviou uma mensagem.	ok	2024-10-05 23:48:02.975753	e92f9c8d-3665-49bb-a1a3-2658e9b9361e	chat_message	d6e8acaa-0170-41c9-8dfb-e310d2e2feeb	2024-09-12 14:22:11.830843
b53f334b-972b-424e-95ad-10d6b4ab8387	Parceiro Piloto enviou uma mensagem.	Necessito de ajuda	2024-10-05 23:48:02.978459	e92f9c8d-3665-49bb-a1a3-2658e9b9361e	chat_message	d6e8acaa-0170-41c9-8dfb-e310d2e2feeb	2024-08-28 20:07:25.963577
f0cd8a26-7939-4507-b60e-0aefb17850cc	Parceiro Piloto enviou uma mensagem.	Oi pessoal	2024-10-05 23:48:02.989511	e92f9c8d-3665-49bb-a1a3-2658e9b9361e	chat_message	d6e8acaa-0170-41c9-8dfb-e310d2e2feeb	2024-09-12 14:21:50.679966
42a871a8-5d2f-46c9-a635-fe189153224a	Emmanuel Menezes enviou uma mensagem.	Seja bem vindo	2024-10-06 00:10:38.701809	b70c1540-93bc-4e05-a67d-211752c2de20	chat_message	0649a90f-2b53-42bc-869e-bc67f18e4690	2024-10-05 23:48:17.922582
52cc0e9e-2cde-4b14-bc93-cf0b676cf938	Tiago Sargiani enviou uma mensagem.	Ol├í	2024-10-17 00:30:08.988807	b70c1540-93bc-4e05-a67d-211752c2de20	chat_message	0649a90f-2b53-42bc-869e-bc67f18e4690	2024-10-17 00:30:03.142765
70614345-d828-432a-9028-64fcc1a95451	Distribuidora Le Maroli Ltda enviou uma mensagem.	ol├í	2024-10-17 12:25:48.452485	e92f9c8d-3665-49bb-a1a3-2658e9b9361e	chat_message	0649a90f-2b53-42bc-869e-bc67f18e4690	2024-10-17 12:25:39.951143
7f9e2ea0-358a-4e08-bb5c-0f8ae1329b53	Distribuidora Le Maroli Ltda enviou uma mensagem.	Obrigado	2024-10-17 12:25:48.461428	e92f9c8d-3665-49bb-a1a3-2658e9b9361e	chat_message	0649a90f-2b53-42bc-869e-bc67f18e4690	2024-10-06 00:10:45.044507
38560cb5-0e5c-4c50-83b7-76074b451781	Distribuidora Le Maroli Ltda enviou uma mensagem.	Ol├í!	\N	82b00d87-8474-4cae-9974-36c7e4e22dea	chat_message	01ed63fa-09b0-47f8-ba1e-1df8c7118cbd	2024-10-19 19:28:31.015089
45f0097e-104b-4c93-83ae-2f73d728ea20	Distribuidora Le Maroli Ltda enviou uma mensagem.	Chegar├í em 3 dias!	\N	82b00d87-8474-4cae-9974-36c7e4e22dea	chat_message	01ed63fa-09b0-47f8-ba1e-1df8c7118cbd	2024-10-19 19:28:54.469173
670149d4-400e-4092-919b-35df7356ae84	Tiago Sargiani enviou uma mensagem.	A entrega est├í atrasada	2024-10-19 19:33:51.859792	b70c1540-93bc-4e05-a67d-211752c2de20	chat_message	01ed63fa-09b0-47f8-ba1e-1df8c7118cbd	2024-10-19 19:28:18.117412
47afdac2-4ad5-458e-9597-8d30e782b8a4	Tiago Sargiani enviou uma mensagem.	Ol├í	2024-10-19 19:33:51.862139	b70c1540-93bc-4e05-a67d-211752c2de20	chat_message	01ed63fa-09b0-47f8-ba1e-1df8c7118cbd	2024-10-19 19:28:08.656757
e9713f11-6584-4491-8b2c-00f9f2f6b5b9	Tiago Sargiani enviou uma mensagem.	Ok	2024-10-19 19:33:51.864085	b70c1540-93bc-4e05-a67d-211752c2de20	chat_message	01ed63fa-09b0-47f8-ba1e-1df8c7118cbd	2024-10-19 19:29:02.725963
001c0941-71ca-4af4-a424-6c9a6d5062e4	Administrador enviou uma mensagem.	Teste 2	\N	b70c1540-93bc-4e05-a67d-211752c2de20	chat_message	0649a90f-2b53-42bc-869e-bc67f18e4690	2025-01-22 13:52:31.785456
f9a52a31-69d4-4f10-b48a-6f9eefac8c6b	Revis├úo de pre├ºo.	As taxas de servi├ºo foram atualizadas, revise o valor dos produtos.	2025-01-24 18:00:28.65093	e92f9c8d-3665-49bb-a1a3-2658e9b9361e	INFO		2024-10-08 11:54:42.111135
ea40a4a9-6cee-4498-ab16-dea540df48af	Revis├úo de pre├ºo.	As taxas de servi├ºo foram atualizadas, revise o valor dos produtos.	2025-01-24 18:00:28.650961	e92f9c8d-3665-49bb-a1a3-2658e9b9361e	INFO		2024-10-14 15:56:29.744607
f4d25c62-7686-4696-a856-64854b036e85	Distribuidora Le Maroli Ltda enviou uma mensagem.	TT	2025-01-24 18:00:28.662452	e92f9c8d-3665-49bb-a1a3-2658e9b9361e	chat_message	0649a90f-2b53-42bc-869e-bc67f18e4690	2025-01-22 13:52:20.896602
972688e6-fde1-43c5-878c-224325a0fda6	Emmanuel Menezes enviou uma mensagem.	Opa	2025-01-24 18:00:28.663022	e92f9c8d-3665-49bb-a1a3-2658e9b9361e	chat_message	b041e2eb-c688-4ee7-aa29-563e9477fd34	2025-01-24 17:59:37.179483
637b2ad4-2414-423c-bf6d-f2e41bd1b248	Revis├úo de pre├ºo.	As taxas de servi├ºo foram atualizadas, revise o valor dos produtos.	2025-01-24 18:00:28.663593	e92f9c8d-3665-49bb-a1a3-2658e9b9361e	INFO		2024-10-02 20:37:43.383799
f6c509b9-3c4c-4a58-989c-6443222cdd67	Emmanuel Menezes enviou uma mensagem.	Opa eai	\N	ac506204-19fd-480b-a622-142d74f56538	chat_message	515a8ce7-3b8c-458c-aed6-8558d82440be	2025-01-30 18:54:57.322265
b5bf2700-e088-444a-9fbb-baf5df095bc4	Administrador enviou uma mensagem.	?	2025-01-30 19:03:54.743142	aaa2ae61-b95b-472c-9426-61a3297c2904	chat_message	b041e2eb-c688-4ee7-aa29-563e9477fd34	2025-01-30 19:03:49.344149
8783cbcf-ede7-417b-822d-8658bfa1e674	Administrador enviou uma mensagem.	Ei revendedor vc recusou um pedido sem justificativa	2025-01-30 19:03:54.745819	aaa2ae61-b95b-472c-9426-61a3297c2904	chat_message	b041e2eb-c688-4ee7-aa29-563e9477fd34	2025-01-30 19:03:40.823615
7be3d1cf-ea43-42cd-8241-fc3d070a63d9	Emmanuel Menezes enviou uma mensagem.	opa mals ai	2025-01-30 19:06:05.968207	e92f9c8d-3665-49bb-a1a3-2658e9b9361e	chat_message	b041e2eb-c688-4ee7-aa29-563e9477fd34	2025-01-30 19:04:00.550071
dda82082-3a67-45b0-acff-eba637597c7a	Emmanuel Menezes enviou uma mensagem.	Eae Guedes	2025-01-31 02:32:10.404033	e92f9c8d-3665-49bb-a1a3-2658e9b9361e	chat_message	b041e2eb-c688-4ee7-aa29-563e9477fd34	2025-01-31 02:31:56.224882
17e190f7-beb2-4158-b2f4-b0059937eb0d	Emmanuel menezes enviou uma mensagem.	Tudo na paz	2025-01-31 17:57:49.841421	aaa2ae61-b95b-472c-9426-61a3297c2904	chat_message	515a8ce7-3b8c-458c-aed6-8558d82440be	2025-01-30 18:55:39.997884
bba5f195-a5cd-4f44-b153-215979a22715	Emmanuel menezes enviou uma mensagem.	Ow ta demorando demais	2025-01-31 13:23:23.989256	aaa2ae61-b95b-472c-9426-61a3297c2904	chat_message	d87e3367-f3fe-4c77-86a3-5ce29f26e041	2025-01-31 13:23:17.840462
bfaa39aa-862d-4086-a295-9f7e0fd4cb5b	Emmanuel Menezes enviou uma mensagem.	ah ja chegou	\N	ac506204-19fd-480b-a622-142d74f56538	chat_message	d87e3367-f3fe-4c77-86a3-5ce29f26e041	2025-01-31 13:23:33.015864
270764af-675b-48c7-be1f-bf0b99d8ec26	Administrador enviou uma mensagem.	opa	2025-01-31 17:57:49.844418	aaa2ae61-b95b-472c-9426-61a3297c2904	chat_message	b041e2eb-c688-4ee7-aa29-563e9477fd34	2025-01-31 02:32:13.739151
e3799ba3-c78d-4ada-a5a8-954308dc7257	Administrador enviou uma mensagem.	em que posso ajudar	2025-01-31 17:57:49.846808	aaa2ae61-b95b-472c-9426-61a3297c2904	chat_message	b041e2eb-c688-4ee7-aa29-563e9477fd34	2025-01-31 11:45:35.232095
3e2e8ddd-e4d3-444e-b6c2-c37796b37f23	Thiago Pereira Silva Guedes enviou uma mensagem.	Escuta meu filho, kd meu gas ?	2025-01-31 18:15:24.885873	aaa2ae61-b95b-472c-9426-61a3297c2904	chat_message	96d013c2-1ced-4816-8af3-516d88028fd4	2025-01-31 18:15:16.778832
d06f47e3-730d-40f9-a525-490ef2f4f2e1	Emmanuel Menezes enviou uma mensagem.	boa tarde, irei verificar s├│ um instante ! Ha.. e claro muito obrigado pela sua prefer├¬ncia ! :)	\N	c1303a50-8e09-4d41-b314-b78e0dfa0b43	chat_message	96d013c2-1ced-4816-8af3-516d88028fd4	2025-01-31 18:16:01.258877
03a86496-9edb-477e-9806-902dff353ec1	Thiago Pereira Silva Guedes enviou uma mensagem.	desculpa estou nervoso, estou terminando um churrasco	2025-01-31 18:16:48.687365	aaa2ae61-b95b-472c-9426-61a3297c2904	chat_message	96d013c2-1ced-4816-8af3-516d88028fd4	2025-01-31 18:16:33.715846
0389be0e-a784-4392-a7bd-90a1fe7b1ef4	Emmanuel Menezes enviou uma mensagem.	o entregar est├í na rua.. obrigado pela prefer├¬ncia	\N	c1303a50-8e09-4d41-b314-b78e0dfa0b43	chat_message	96d013c2-1ced-4816-8af3-516d88028fd4	2025-01-31 18:17:01.418804
c55389cf-4f47-452f-93ff-c3830115c158	Thiago Pereira Silva Guedes enviou uma mensagem.	ha, perfeito, muito obrigado	2025-01-31 18:24:18.24866	aaa2ae61-b95b-472c-9426-61a3297c2904	chat_message	96d013c2-1ced-4816-8af3-516d88028fd4	2025-01-31 18:17:11.767519
1be7850a-fbef-4dcd-a967-a0e7d6a1695e	Emmanuel Menezes enviou uma mensagem.	oi	2025-02-01 16:47:44.752723	e92f9c8d-3665-49bb-a1a3-2658e9b9361e	chat_message	b041e2eb-c688-4ee7-aa29-563e9477fd34	2025-02-01 16:47:39.72983
5464d181-cb50-4e6e-9616-9a095c1967d6	Emmanuel Menezes enviou uma mensagem.	bom dia	2025-02-01 16:47:44.757534	e92f9c8d-3665-49bb-a1a3-2658e9b9361e	chat_message	b041e2eb-c688-4ee7-aa29-563e9477fd34	2025-01-31 11:45:24.581116
66c513ae-2efd-4677-972d-a5e40eb8d9ca	Emmanuel Menezes enviou uma mensagem.	 aplataforma est├í com lentid├úo	2025-02-01 16:47:44.758283	e92f9c8d-3665-49bb-a1a3-2658e9b9361e	chat_message	b041e2eb-c688-4ee7-aa29-563e9477fd34	2025-01-31 11:45:43.727643
ea21e19d-6233-4f46-9848-e4fd327e1f89	Guedinho enviou uma mensagem.	escuta meu filho	2025-02-01 17:00:13.479647	aaa2ae61-b95b-472c-9426-61a3297c2904	chat_message	824d37aa-4074-4402-ae7e-5826e55e837d	2025-02-01 17:00:07.209933
424cded6-a294-4828-aa44-12e8e4bb5dd7	Emmanuel Menezes enviou uma mensagem.	oi senhora	\N	c4259495-7c66-4de0-b4a1-23309c8989fc	chat_message	824d37aa-4074-4402-ae7e-5826e55e837d	2025-02-01 17:00:18.49355
3370cebd-9840-41ca-a3b5-5aefca71d0fc	Guedinho enviou uma mensagem.	vai demorar ?	2025-02-02 21:31:31.65535	aaa2ae61-b95b-472c-9426-61a3297c2904	chat_message	824d37aa-4074-4402-ae7e-5826e55e837d	2025-02-01 17:00:26.701055
ba200a9e-dc7b-41b0-b465-d37211df251b	Thiago Pereira Silva Guedes enviou uma mensagem.	onde est├í meu prduto ?	2025-02-02 21:36:08.870791	aaa2ae61-b95b-472c-9426-61a3297c2904	chat_message	14b33935-4ed9-43ab-a9c6-d6ce544d670c	2025-02-02 21:36:04.485434
f251b76c-47ac-40a1-a1c1-253c64b1ae41	Emmanuel Menezes enviou uma mensagem.	s├│ um instante	\N	c1303a50-8e09-4d41-b314-b78e0dfa0b43	chat_message	14b33935-4ed9-43ab-a9c6-d6ce544d670c	2025-02-02 21:36:17.000126
51ee996d-7655-41d3-ba18-e5352757d508	Emmanuel Menezes enviou uma mensagem.	j├í est├í na rua	\N	c1303a50-8e09-4d41-b314-b78e0dfa0b43	chat_message	14b33935-4ed9-43ab-a9c6-d6ce544d670c	2025-02-02 21:37:10.715247
a64113c9-e455-4605-abd9-9e55029d2b72	Emmanuel Menezes enviou uma mensagem.	pode sim meu amigo	2025-02-02 21:38:35.110295	e92f9c8d-3665-49bb-a1a3-2658e9b9361e	chat_message	b041e2eb-c688-4ee7-aa29-563e9477fd34	2025-02-01 16:47:58.564098
7cd62c94-558b-4f30-87e4-78327052902a	Emmanuel Menezes enviou uma mensagem.	olha a plpataaforma est├í lenta	2025-02-02 21:38:35.121215	e92f9c8d-3665-49bb-a1a3-2658e9b9361e	chat_message	b041e2eb-c688-4ee7-aa29-563e9477fd34	2025-02-02 21:38:30.932082
610df975-d023-487f-8384-96bab8247595	Administrador enviou uma mensagem.	posso ajudar em algo ?	2025-02-02 21:54:27.366805	aaa2ae61-b95b-472c-9426-61a3297c2904	chat_message	b041e2eb-c688-4ee7-aa29-563e9477fd34	2025-02-01 16:47:51.767808
6071989b-60c3-4a75-888f-ee3894280b92	Thiago Pereira Silva Guedes enviou uma mensagem.	tudo bem	2025-02-02 21:54:27.363788	aaa2ae61-b95b-472c-9426-61a3297c2904	chat_message	14b33935-4ed9-43ab-a9c6-d6ce544d670c	2025-02-02 21:37:15.287794
d3daaf0a-f6c9-4606-8676-5d3f59116867	Thiago Pereira Silva Guedes enviou uma mensagem.	ok	2025-02-02 21:54:27.371867	aaa2ae61-b95b-472c-9426-61a3297c2904	chat_message	14b33935-4ed9-43ab-a9c6-d6ce544d670c	2025-02-02 21:37:03.018625
3a75c2ca-0777-4966-b225-b60628ec672f	Administrador enviou uma mensagem.	s├│ um instante vamos verificar	2025-02-02 21:54:27.370741	aaa2ae61-b95b-472c-9426-61a3297c2904	chat_message	b041e2eb-c688-4ee7-aa29-563e9477fd34	2025-02-02 21:38:49.952029
263fe492-ad24-4caf-8630-7abfe9562646	Administrador enviou uma mensagem.	tudo	\N	aaa2ae61-b95b-472c-9426-61a3297c2904	chat_message	b041e2eb-c688-4ee7-aa29-563e9477fd34	2025-02-04 16:57:43.992692
1519cc82-0d71-4ddb-b77a-ccd0fdf4811c	Emmanuel Menezes enviou uma mensagem.	Opa beleza	\N	ac506204-19fd-480b-a622-142d74f56538	chat_message	a2ae725b-e755-41fd-958e-c65adda0849b	2025-02-04 22:21:34.675245
46f1908d-47e9-4cab-a307-8140bac5c468	Emmanuel Menezes enviou uma mensagem.	n├úo estou te achando	\N	ac506204-19fd-480b-a622-142d74f56538	chat_message	a2ae725b-e755-41fd-958e-c65adda0849b	2025-02-04 22:21:38.796407
1c2d07bb-f493-480c-a1de-137f924df6ee	Emmanuel menezes enviou uma mensagem.	Rua 14	\N	aaa2ae61-b95b-472c-9426-61a3297c2904	chat_message	a2ae725b-e755-41fd-958e-c65adda0849b	2025-02-04 22:21:49.985255
87e946f2-9f30-455c-959f-08962af5012d	Emmanuel menezes enviou uma mensagem.	Vai demorar	\N	aaa2ae61-b95b-472c-9426-61a3297c2904	chat_message	a2ae725b-e755-41fd-958e-c65adda0849b	2025-02-04 22:21:55.974607
5deb08bd-7832-40c6-911f-c7298eb87054	Emmanuel menezes enviou uma mensagem.	Oi	2025-02-04 22:39:50.823315	aaa2ae61-b95b-472c-9426-61a3297c2904	chat_message	ebadb35f-6686-400d-8158-739b70297fb5	2025-02-04 22:39:44.55789
39ebf68a-a59d-4adf-b311-a2062aa5db9b	Emmanuel Menezes enviou uma mensagem.	opa	\N	ac506204-19fd-480b-a622-142d74f56538	chat_message	ebadb35f-6686-400d-8158-739b70297fb5	2025-02-04 22:39:53.833325
62c22c50-3079-4843-a6fa-81d6224376bd	Emmanuel Menezes enviou uma mensagem.	oi	\N	ac506204-19fd-480b-a622-142d74f56538	chat_message	8efe0223-7070-460d-a4b2-cd145774790a	2025-02-22 17:49:06.795425
3102f495-15b1-42e3-8ded-3f790fec74eb	Emmanuel Menezes enviou uma mensagem.	tudo bem ?	2025-02-22 18:02:44.189318	e92f9c8d-3665-49bb-a1a3-2658e9b9361e	chat_message	b041e2eb-c688-4ee7-aa29-563e9477fd34	2025-02-04 16:57:33.392208
122c8b4d-62b6-48c8-8989-93164103e52c	Emmanuel Menezes enviou uma mensagem.	pois n├úo senhor ?	\N	c1303a50-8e09-4d41-b314-b78e0dfa0b43	chat_message	61479d2c-dbb0-403f-a9a8-dba04460e43d	2025-03-04 16:32:41.196712
62e521c6-ed0a-4afc-8c5a-e831dd252ee6	Administrador enviou uma mensagem.	funciona sim	\N	aaa2ae61-b95b-472c-9426-61a3297c2904	chat_message	b041e2eb-c688-4ee7-aa29-563e9477fd34	2025-06-06 19:36:58.541172
9504ceff-cb35-42b6-a202-195f6a710d58	Emmanuel Menezes enviou uma mensagem.	├® o leon, o bot├úo nao funciona	2025-06-06 19:37:03.624911	e92f9c8d-3665-49bb-a1a3-2658e9b9361e	chat_message	b041e2eb-c688-4ee7-aa29-563e9477fd34	2025-06-06 19:34:42.215547
1e59d270-8355-41bd-8f12-454d5b6f38b5	Emmanuel Menezes enviou uma mensagem.	oi	2025-06-06 19:37:03.633621	e92f9c8d-3665-49bb-a1a3-2658e9b9361e	chat_message	b041e2eb-c688-4ee7-aa29-563e9477fd34	2025-02-22 18:02:38.586954
9cb4a7e1-3543-4a5f-95f3-46d134c0a70a	Emmanuel Menezes enviou uma mensagem.	teste edwy	\N	e92f9c8d-3665-49bb-a1a3-2658e9b9361e	chat_message	b041e2eb-c688-4ee7-aa29-563e9477fd34	2025-06-08 23:43:16.260536
e135dfe6-8767-4dfe-90e1-c28cf6e198d6	Thiago Pereira Silva Guedes enviou uma mensagem.	est├í chegando ?	2025-07-02 21:40:19.704475	aaa2ae61-b95b-472c-9426-61a3297c2904	chat_message	61479d2c-dbb0-403f-a9a8-dba04460e43d	2025-03-04 16:32:52.764315
28c6f6f1-105f-42f3-949e-277453bd1bd1	Thiago Pereira Silva Guedes enviou uma mensagem.	e ai ?	2025-07-02 21:40:19.718027	aaa2ae61-b95b-472c-9426-61a3297c2904	chat_message	61479d2c-dbb0-403f-a9a8-dba04460e43d	2025-03-04 16:32:29.822025
bc7eade7-0d6f-4937-bc37-e44fbad57d3e	Emmanuel Menezes enviou uma mensagem.	Olha to com problema	\N	e92f9c8d-3665-49bb-a1a3-2658e9b9361e	chat_message	b041e2eb-c688-4ee7-aa29-563e9477fd34	2025-07-02 23:11:31.161154
8bd76878-0703-4901-8a29-889ea8c7b40b	Administrador enviou uma mensagem.	qual problema	\N	aaa2ae61-b95b-472c-9426-61a3297c2904	chat_message	b041e2eb-c688-4ee7-aa29-563e9477fd34	2025-07-02 23:11:44.536596
d3ad5302-6e81-4d7f-a8a9-810be77a2330	Emmanuel menezes enviou uma mensagem.	Oi demora	\N	aaa2ae61-b95b-472c-9426-61a3297c2904	chat_message	c4ceb661-03ea-4544-8fcb-e2cceef679b7	2025-07-02 23:39:11.755048
082a867d-5d6d-4d90-84cb-03f42a771a6c	Emmanuel Menezes enviou uma mensagem.	o que quer dizer isso?	\N	ac506204-19fd-480b-a622-142d74f56538	chat_message	c4ceb661-03ea-4544-8fcb-e2cceef679b7	2025-07-02 23:39:33.030919
dc511ca9-9b17-4ea7-88a1-9868b9d9eafe	Emmanuel menezes enviou uma mensagem.	Menos um cliente	\N	aaa2ae61-b95b-472c-9426-61a3297c2904	chat_message	c4ceb661-03ea-4544-8fcb-e2cceef679b7	2025-07-02 23:39:45.757403
ecbf7782-f153-4e53-8687-46def6d75626	Administrador enviou uma mensagem.	oi	\N	aaa2ae61-b95b-472c-9426-61a3297c2904	chat_message	b041e2eb-c688-4ee7-aa29-563e9477fd34	2025-10-31 12:39:35.881135
\.


--
-- Data for Name: address; Type: TABLE DATA; Schema: consumer; Owner: postgres
--

COPY consumer.address (address_id, street, number, complement, district, city, state, zip_code, active, created_at, deleted_at, updated_at, latitude, longitude, consumer_id, description) FROM stdin;
d3c5a60e-3eb9-4b0b-9c5c-942d0892ed3b	Travessa K	53	N/A	S├úo Venancio	Itupeva	SP	13296366	t	2024-01-10 18:43:20.086197	\N	\N	-23.1558426	-47.0565393	f7a59c7a-d7f1-463e-b4fc-66c3305a81b0	Casa
4cdddd3d-00df-4471-8d60-0dc3dec4aa37	Estrada dos Galdinos	1177	N/A	Gramado	Cotia	SP	06710400	t	2024-09-12 14:57:39.438496	\N	\N	-23.6059252	-46.926502	7071c9e2-ce05-42c2-9ffc-73cb6d16148e	Cotia
f0db3b5f-9342-40a0-a94e-15d412bb2d26	Estrada Municipal Du├¡lio Sai	721	N/A	S├úo Venancio	Itupeva	SP	13296374	t	2024-10-08 16:26:29.119758	\N	\N	-23.1808723	-47.0477881	5af9a155-8d87-4d31-a1d2-552056257c26	Casa
cdcc74d2-9808-4b56-b9ae-5625c58602db	Avenida Central	200	N/A	Jardim da Gl├│ria	Cotia	SP	06711205	t	2024-10-18 20:12:06.1631	\N	\N	-23.6019491	-46.837047899999995	5714ee22-66e2-4fe0-8f0e-4be4652dcbed	Avenida Central
e15bad56-980d-42f5-abe7-745c82eaea8e	Estr. Mun. Du├¡lio Sai	1089	N/A	Da Lagoa	Itupeva	SP	13296374	t	2024-10-18 20:16:27.073061	\N	\N	-23.187242299999998	-47.048286499999996	5714ee22-66e2-4fe0-8f0e-4be4652dcbed	Estr. Mun. Du├¡lio Sai, 1089 - Da Lagoa, Itupeva - SP, 13296-374
8cec50b8-5cb5-40a2-802a-d4ba28c1c6f3	Rua Ant├┤nio Bermejo	183	N/A	Jardim Europa	Assis	SP	19815190	t	2025-01-24 18:32:44.027107	\N	\N	-22.6504898	-50.3997956	5714ee22-66e2-4fe0-8f0e-4be4652dcbed	Rua Ant├┤nio Bermejo
dcc614f5-1cbf-424d-93b4-92e2f26a8a0a	Estrada dos Galdinos	1160	casa 34	Granja Viana	Cotia	SP	06710400	t	2025-01-30 19:00:33.547674	\N	\N	-23.6022802	-46.8239933	31499eb0-4ec8-4fd8-a37a-af34abf07230	Casa
b3e27661-e1fc-4b6a-bf19-1d583d024285	Estrada dos galdinos	1160	N/A	Granja Viana	Cotia	SP	06710400	t	2025-01-31 21:50:07.025374	\N	\N	-23.6022802	-46.8239933	28a733c3-7e9f-43af-8432-9c88e6e22e61	Casa
b518eb18-48cf-42a2-a20f-3c1e793e9f37	Avenida Jose Alc├óntara	55	N/A	Cidade Universit├íria	Juazeiro do Norte	CE	63048245	t	2025-02-02 21:44:22.602601	\N	2025-02-02 21:52:41.614088	-7.262541400000001	-39.3101243	84713a3f-0af7-41ce-aae4-fc17f8be6bad	Juazeiro do norte
175d5fcf-033e-455e-b23b-3c85bdb0b16a	Rua S├úo Paulo	45	N/A	Cotia	S├úo Paulo	SP	06410700	t	2025-02-04 12:50:42.188922	\N	\N	-23.511150999999998	-46.4055537	84713a3f-0af7-41ce-aae4-fc17f8be6bad	Manu
15da4712-fcfd-414b-b7a0-ce52a493ead0	Av Jose alcantara	55	N/A	Cidade universit├íria	Juazeiro do Norte	CE	63048245	t	2025-02-04 17:06:15.331991	\N	\N	-7.262541400000001	-39.3101243	9883e2f8-b0f2-43d3-bdbe-d2d601180eb0	Av Jose alcantara
\.


--
-- Data for Name: card; Type: TABLE DATA; Schema: consumer; Owner: postgres
--

COPY consumer.card (card_id, consumer_id, number, validity, active, created_by, created_at, updated_by, updated_at, name, document, encrypted) FROM stdin;
b7542bca-c5f8-4811-a523-6b244278180a	5714ee22-66e2-4fe0-8f0e-4be4652dcbed	5459 6097 3918 6594	09/2025	t	2e61165e-7b59-4526-8911-d3817e307515	2024-10-18 21:20:19.83444	\N	\N	Otavio Brisolla	336.449.781-54	\N
ad4b4db9-9c49-4794-b7ec-656c2f4887a3	5af9a155-8d87-4d31-a1d2-552056257c26	2222 2222 2222 2222	01/2030	t	82b00d87-8474-4cae-9974-36c7e4e22dea	2024-10-19 19:48:20.337655	\N	\N	Eu mesmo 	272.427.238-25	\N
5e087efe-b0b0-41cb-9197-9fc1826f5776	84713a3f-0af7-41ce-aae4-fc17f8be6bad	1213 1231 2312 3123	02/2025	t	c1303a50-8e09-4d41-b314-b78e0dfa0b43	2025-02-02 21:45:36.679254	\N	\N	Thiago Guedes	324.441.231-23	\N
\.


--
-- Data for Name: consumer; Type: TABLE DATA; Schema: consumer; Owner: postgres
--

COPY consumer.consumer (consumer_id, legal_name, fantasy_name, document, email, phone_number, active, created_at, deleted_at, updated_at, user_id, default_address) FROM stdin;
30ff64d3-0b8d-434c-8b2c-7bc5dd04bf7a	Matheus 	Matheus 	49296055806	teteuzo2916@gmail.com	11950599018	t	2024-01-09 20:53:53.543129	\N	\N	0807c18b-c59d-4e03-8c27-3f00f106393d	\N
f7a59c7a-d7f1-463e-b4fc-66c3305a81b0	Henry Vaccari Sargiani	Henry Vaccari Sargiani	48081495835	henry.vaccari@esmenezes.com.br	11961768383	t	2024-01-08 20:32:08.459578	\N	2024-01-10 18:51:22.255642	6e08015e-4827-47d2-86e1-bd8e655b8aae	d3c5a60e-3eb9-4b0b-9c5c-942d0892ed3b
5af9a155-8d87-4d31-a1d2-552056257c26	Tiago Sargiani	Tiago Sargiani	27242723825	tiago.sargiani@gmail.com	11982084614	t	2024-10-08 10:13:23.794742	\N	2024-10-08 16:26:35.414648	82b00d87-8474-4cae-9974-36c7e4e22dea	f0db3b5f-9342-40a0-a94e-15d412bb2d26
5714ee22-66e2-4fe0-8f0e-4be4652dcbed	Ot├ívio Brisolla	Ot├ívio Brisolla	34498969898	otavio.polatto@gmail.com	11972340266	t	2024-10-18 20:03:34.497393	\N	2025-01-24 18:39:22.995273	2e61165e-7b59-4526-8911-d3817e307515	e15bad56-980d-42f5-abe7-745c82eaea8e
31499eb0-4ec8-4fd8-a37a-af34abf07230	Renato Gomes	Renato Gomes	18707398840	renatogomes@me.com	11947388308	t	2025-01-30 18:58:30.967983	\N	2025-01-30 19:00:36.842345	f5f1fae0-8fda-4e38-a8cf-43c48a354e06	dcc614f5-1cbf-424d-93b4-92e2f26a8a0a
9883e2f8-b0f2-43d3-bdbe-d2d601180eb0	Kelbe	Kelbe	34576156837	bizerrakelba@gmail.com	88998120086	t	2025-02-04 17:00:28.749376	\N	2025-02-04 17:06:22.55679	61aaf7cd-526d-4850-81e2-4bf1cd4f7eb5	15da4712-fcfd-414b-b7a0-ce52a493ead0
84713a3f-0af7-41ce-aae4-fc17f8be6bad	Thiago Pereira Silva Guedes	Thiago Pereira Silva Guedes	34576156837	thiago.router@gmail.com	11977338511	t	2025-01-31 16:09:05.158329	\N	2025-02-04 17:12:12.652859	c1303a50-8e09-4d41-b314-b78e0dfa0b43	b518eb18-48cf-42a2-a20f-3c1e793e9f37
8fcc957d-9269-443e-90df-a4073dd8f3f3	Ian Botelho da Motta 	Ian Botelho da Motta 	10206461798	ianb.motta@gmail.com	21997450503	t	2025-10-09 15:39:43.370174	\N	\N	f4818f3f-c988-4d5e-b27a-cf18f3832d96	\N
f4324555-ba16-43ef-8d2f-3f0c3e025e18	Paulo Rog├®rio Fernandes Buzzo	Paulo Rog├®rio Fernandes Buzzo	19261105874	paulobuzzo@hotmail.com	11982711050	t	2025-10-09 16:45:36.857397	\N	\N	459d61a4-6498-4c87-944c-5cc3d3083225	\N
7071c9e2-ce05-42c2-9ffc-73cb6d16148e	Emmanuel menezes	Emmanuel menezes	39745467820	emmanuel.s.menezes@gmail.com	11973892831	t	2024-09-12 14:53:48.187815	\N	2025-10-09 23:15:10.6916	ac506204-19fd-480b-a622-142d74f56538	4cdddd3d-00df-4471-8d60-0dc3dec4aa37
28a733c3-7e9f-43af-8432-9c88e6e22e61	Wagner 	Wagner 	03742374176	Wagner.jesus@esmenezes.com.br	61992015350	t	2025-01-31 21:32:23.39573	\N	2025-01-31 21:50:11.494515	08873f3f-42b8-4bc1-8156-c144d5c76542	b3e27661-e1fc-4b6a-bf19-1d583d024285
\.


--
-- Data for Name: style_consumer; Type: TABLE DATA; Schema: consumer; Owner: postgres
--

COPY consumer.style_consumer (style_consumer_id, "primary", text, primarybackground, secondary, black, gray, lightgray, white, background, shadow, shadowprimary, success, danger, warning, blue, shadowblue, gold, orange, light_italic, light, italic, regular, medium, bold, created_by, created_at, updated_by, updated_at, admin_id) FROM stdin;
8d98a246-74de-478c-a074-05b9bc0fbe49	#ffa500	#ff6d00	hsl(0, 0%, 90.9%)	#D5573B	#242424	#707070	hsl(0, 0%, 94.9%)	#fff	#fbfbfb	#00000020	#007EA715	#03ac13	#ca3433	#ffbb33	#007EA7	#007EA715	#fe7914	#FFA500	Poppins_300Light_Italic	Poppins_300Light	Poppins_400Regular_Italic	Poppins_400Regular	Poppins_500Medium	Poppins_700Bold	e92f9c8d-3665-49bb-a1a3-2658e9b9361e	2024-09-06 21:02:28.47701	e92f9c8d-3665-49bb-a1a3-2658e9b9361e	2025-11-01 12:43:02.812474	e92f9c8d-3665-49bb-a1a3-2658e9b9361e
\.


--
-- Data for Name: actuation_area; Type: TABLE DATA; Schema: logistics; Owner: postgres
--

COPY logistics.actuation_area (actuation_area_id, geometry, partner_id, created_by, created_at, updated_at, active, name, updated_by, branch_id) FROM stdin;
9d164d92-4f1f-4cf2-86d0-42292bbdaffb	0103000020E61000000100000006000000757C6D6B018547C0DFB4C28E508537C0F4762262E55A47C060297700737F37C0FFBDFA537D5547C0B84FFA4311A837C049A11981BD7147C08903B6879FAE37C06DDD2648AE8647C0B788B4DBCFA637C0757C6D6B018547C0DFB4C28E508537C0	ae565ea8-440c-4063-9885-3192863fd0b6	aaa2ae61-b95b-472c-9426-61a3297c2904	2025-01-29 18:44:35.636494	\N	t	Cotia - SP	\N	c1096081-fa43-4681-a242-c014a916914a
eb62f78a-89c8-43cf-a5f2-0cc9f5187138	0103000020E6100000010000000600000080B22AD4BD7247C076547ECE833037C05E9A2B82797147C07CAF8B10213037C02DED5E8BC87047C0509E483E563137C0E33B03505F7147C05F93143D853237C077EF9A97B47347C0AECAB9578C3237C080B22AD4BD7247C076547ECE833037C0	ae565ea8-440c-4063-9885-3192863fd0b6	aaa2ae61-b95b-472c-9426-61a3297c2904	2025-01-30 16:20:06.38854	\N	t	Jundia├¡	\N	c1096081-fa43-4681-a242-c014a916914a
0c00e501-b31c-400f-a9f0-a2a420908b7a	0103000020E6100000010000000700000093A0FE4BFDE643C08F27F401E2B618C0CD8FED877BA544C0A2171C08E4351EC0A40AAF42113044C0E89B4ADD7B7020C039DE3D9163AB42C079F8CB5D01911FC0C19404CCF3C342C074A8C6AF21C41AC080539628C04C43C06C5CF55E379918C093A0FE4BFDE643C08F27F401E2B618C0	ae565ea8-440c-4063-9885-3192863fd0b6	aaa2ae61-b95b-472c-9426-61a3297c2904	2025-02-04 17:02:15.3829	\N	t	Juazeiro do Norte	\N	c1096081-fa43-4681-a242-c014a916914a
c23b420c-ddb4-4b7d-b8c6-9998edc79845	0103000020E61000000100000007000000A96E21DD629145C094F6D18F8BE636C025D257D7449145C07D662AAE3FE536C055B07549978F45C0A638B80388E536C01DD616E4BB8E45C0851B619C97E736C024E41CE03F9045C0341558E791E936C0FC575A80E69145C002938032CEE836C0A96E21DD629145C094F6D18F8BE636C0	ae565ea8-440c-4063-9885-3192863fd0b6	aaa2ae61-b95b-472c-9426-61a3297c2904	2025-02-04 22:16:01.930803	\N	t	Boa Viagem 01	\N	fc51dc14-dc03-496e-8c95-d44cb7e35d21
6b2a498a-01ea-498e-b493-faefec2a23a6	0103000020E61000000100000007000000A8F63FDAE59045C06983A90EB8E736C0BD4B9523719045C0CCB14BE8E4E736C01D16B52AFA8F45C0C179176CA6E836C0DF543FE8C89045C0D7A5AEDD1EE936C0D20CEE27489145C013FE8E89F0E836C03B36453B279145C04AF514A919E836C0A8F63FDAE59045C06983A90EB8E736C0	ae565ea8-440c-4063-9885-3192863fd0b6	aaa2ae61-b95b-472c-9426-61a3297c2904	2025-02-22 18:09:09.294369	\N	t	Assist├¬ncia tecnica	\N	fc51dc14-dc03-496e-8c95-d44cb7e35d21
cde31cfb-4202-48bc-80c1-9f606ef919d5	0103000020E61000000100000006000000F1186FFB51A843C088AE7760BCEE1CC0F1180F2086AF43C0D2851B6D5A141DC0F1182FEBEAAA43C0299CA313682C1DC0F1186F61A99F43C09048217709211DC0F118AF28849F43C090803A355FF41CC0F1186FFB51A843C088AE7760BCEE1CC0	ae565ea8-440c-4063-9885-3192863fd0b6	aaa2ae61-b95b-472c-9426-61a3297c2904	2025-03-04 16:29:45.667671	\N	t	Cidades kariris	\N	3cb508e3-618d-4eed-ac11-7eee9484613c
67cfcc07-47d3-4dac-b9b9-8eaffda16d6f	0103000020E61000000100000008000000D883FF39746747C09A8BA865638637C0FA3982E5108347C05C8B9203CE8237C0D95F8DEA447C47C0554A66D93D6937C0F2F2C374816E47C04208C92E896237C062A131C2685C47C087977B22B86437C0155C5B7F3B6047C0697DBFAEFC7837C0AE2B7C387E6947C061816AF99B8537C0D883FF39746747C09A8BA865638637C0	ae565ea8-440c-4063-9885-3192863fd0b6	aaa2ae61-b95b-472c-9426-61a3297c2904	2025-03-14 13:59:44.504615	\N	t	Alphaville	\N	c1096081-fa43-4681-a242-c014a916914a
afaaa7f2-d339-45b6-8af1-17eb6cdf8bc2	0103000020E610000001000000070000002E231950DD6C47C0188A1897BD9737C0660D33F4C06847C0742BCD7DB19637C0C0D9CADB776647C0D4F2DD23729A37C0328492D6F96847C065276579939E37C003EB6F70E56C47C00CD786203A9E37C0530ACBF1056D47C085AD1157B39837C02E231950DD6C47C0188A1897BD9737C0	ae565ea8-440c-4063-9885-3192863fd0b6	aaa2ae61-b95b-472c-9426-61a3297c2904	2025-06-06 19:33:23.076119	\N	t	Leon	\N	c1096081-fa43-4681-a242-c014a916914a
d44615f5-c277-4c69-825e-b68199e905a7	0103000020E61000000100000007000000838ACFC6CC6A47C0CD069889809937C0539E74AF866947C0AF9B41E31A9937C07681239E776B47C0333B76C9049837C0BFE30499716C47C0AECDB5B1EE9937C05CF82B385F6A47C0D0119D5D129B37C0D3EEBEC98D6947C00B9143281D9937C0838ACFC6CC6A47C0CD069889809937C0	ae565ea8-440c-4063-9885-3192863fd0b6	aaa2ae61-b95b-472c-9426-61a3297c2904	2025-06-08 23:55:20.61457	\N	t	testeEdwy	\N	c1096081-fa43-4681-a242-c014a916914a
49bc24a5-cb6e-4fd6-ba0a-cae666608e83	0103000020E6100000010000000900000038143E43126447C0273D1981139237C01CCBBF04876247C0E168DB632B9237C0B5160A33DB6047C028B1D5E98E9237C06F0B6237736147C0F2CC9A92A59337C0A15E454C4E6147C01E025AED919637C0E6CB41C8416347C06FA4F365FD9637C0A31A9404816447C0C0976590439537C0CBB3ED49FC6247C0C7E6D343E59337C038143E43126447C0273D1981139237C0	ae565ea8-440c-4063-9885-3192863fd0b6	aaa2ae61-b95b-472c-9426-61a3297c2904	2025-07-02 22:59:18.953796	\N	t	teste 2	\N	c1096081-fa43-4681-a242-c014a916914a
e15e4fc0-acf3-40a2-9ba2-d00fa9c3d08c	0103000020E61000000100000006000000FC1C4E5FA46947C0C5EF86EE339837C09023890FB96B47C08AC3A785C09A37C08E61C34C696B47C02022A395A09D37C05D4167206D6647C0835FAF1FCA9E37C0EA151FE6D66747C065C3DD13539937C0FC1C4E5FA46947C0C5EF86EE339837C0	ae565ea8-440c-4063-9885-3192863fd0b6	aaa2ae61-b95b-472c-9426-61a3297c2904	2025-10-23 15:10:51.00708	\N	t	Revenda porto Alegre	\N	c1096081-fa43-4681-a242-c014a916914a
6720279f-4cbc-4b22-8ed1-35c5b83f1d9c	0103000020E6100000010000000800000027F0E0FC0A6B47C032AF6889BD9937C0F703DABBFF6A47C076B360D68A9837C0852F6B787B6947C081F92D6A8D9837C07435D1371D6947C04136895F759937C02BD346560C6947C0BE525AA2679A37C0B95ACA29E26947C06EC0ABD7049B37C03C9216282E6B47C03587C6AA369A37C027F0E0FC0A6B47C032AF6889BD9937C0	ae565ea8-440c-4063-9885-3192863fd0b6	aaa2ae61-b95b-472c-9426-61a3297c2904	2025-11-03 16:14:08.442894	\N	t	area 2	\N	c1096081-fa43-4681-a242-c014a916914a
\.


--
-- Data for Name: actuation_area_config; Type: TABLE DATA; Schema: logistics; Owner: postgres
--

COPY logistics.actuation_area_config (actuation_area_config_id, actuation_area_id, start_hour, end_hour, created_at, updated_at, created_by, updated_by) FROM stdin;
b7f87a76-31da-4d36-a881-62196a1721a8	9d164d92-4f1f-4cf2-86d0-42292bbdaffb	08:00	23:50	2025-01-29 19:16:24.162465	2025-02-01	aaa2ae61-b95b-472c-9426-61a3297c2904	aaa2ae61-b95b-472c-9426-61a3297c2904
32adb2d4-be8c-4edb-ba47-3767f8097e92	eb62f78a-89c8-43cf-a5f2-0cc9f5187138	08:00	20:00	2025-02-02 21:42:56.317538	\N	aaa2ae61-b95b-472c-9426-61a3297c2904	\N
d3f95221-0326-4dbd-9873-970e0878ee51	0c00e501-b31c-400f-a9f0-a2a420908b7a	08:00	22:00	2025-02-04 17:02:55.062485	\N	aaa2ae61-b95b-472c-9426-61a3297c2904	\N
c387b3c7-31f8-4e9f-8070-3274899a37a9	67cfcc07-47d3-4dac-b9b9-8eaffda16d6f	08:00	22:00	2025-03-14 14:00:09.864562	\N	aaa2ae61-b95b-472c-9426-61a3297c2904	\N
9afe3c2e-139d-466d-b8cc-add044b41397	afaaa7f2-d339-45b6-8af1-17eb6cdf8bc2	08:00	22:00	2025-06-06 19:34:12.025706	\N	aaa2ae61-b95b-472c-9426-61a3297c2904	\N
aa976a7c-b30c-4c29-9511-34b0a7c8676b	49bc24a5-cb6e-4fd6-ba0a-cae666608e83	07:00	18:00	2025-07-02 23:00:49.889812	\N	aaa2ae61-b95b-472c-9426-61a3297c2904	\N
\.


--
-- Data for Name: actuation_area_delivery_option; Type: TABLE DATA; Schema: logistics; Owner: postgres
--

COPY logistics.actuation_area_delivery_option (delivery_option_id, name, created_by, created_at, updated_by, updated_at, active) FROM stdin;
64355e35-3eda-41d4-a3e8-6fcb1d134adc	Uber eats	e92f9c8d-3665-49bb-a1a3-2658e9b9361e	2025-01-31 18:21:52.068341	\N	\N	t
deb02c5a-5468-408a-ae1d-4651bc38c76d	Moto frete 	e92f9c8d-3665-49bb-a1a3-2658e9b9361e	2023-08-28 22:45:58.06007	e92f9c8d-3665-49bb-a1a3-2658e9b9361e	2025-06-06 19:36:25.36326	f
bd9ca2e8-60d7-4011-8494-d63c358ab08b	99taxi	e92f9c8d-3665-49bb-a1a3-2658e9b9361e	2025-07-02 22:29:36.870506	\N	\N	t
1e19f164-c7bd-4fe3-a1d3-121db2df6dd7	Entrega gratis	e92f9c8d-3665-49bb-a1a3-2658e9b9361e	2025-07-02 22:30:14.520892	\N	\N	t
\.


--
-- Data for Name: actuation_area_payments; Type: TABLE DATA; Schema: logistics; Owner: postgres
--

COPY logistics.actuation_area_payments (actuation_area_payments_id, actuation_area_config_id, payment_options_id, active, created_by, created_at, updated_by, updated_at) FROM stdin;
08667bf4-9cb4-4f93-9b35-c3491958d27d	b7f87a76-31da-4d36-a881-62196a1721a8	17647417-2bfe-4e5d-96b8-53342dfe8443	t	aaa2ae61-b95b-472c-9426-61a3297c2904	2025-01-30 18:50:24.056703	aaa2ae61-b95b-472c-9426-61a3297c2904	2025-02-01 16:55:19.296203
feb4d45b-d535-4739-90f4-fe178796ef13	b7f87a76-31da-4d36-a881-62196a1721a8	8bfcd959-f9a6-4514-a164-e325de3970a4	t	aaa2ae61-b95b-472c-9426-61a3297c2904	2025-01-30 18:50:24.056703	aaa2ae61-b95b-472c-9426-61a3297c2904	2025-02-01 16:55:19.296203
ef2774f1-56fb-4b8e-87d8-c42495f3d946	32adb2d4-be8c-4edb-ba47-3767f8097e92	ec50fa62-d353-4cd9-8fad-b55ed491c2a5	t	aaa2ae61-b95b-472c-9426-61a3297c2904	2025-02-02 21:42:56.317538	\N	\N
8c856f86-e35f-46ce-8dde-1f1ab070a66c	32adb2d4-be8c-4edb-ba47-3767f8097e92	df0884de-ebf6-4eac-bda5-7d35eba0d6e5	t	aaa2ae61-b95b-472c-9426-61a3297c2904	2025-02-02 21:42:56.317538	\N	\N
892d971c-dcba-4950-9f2b-18bc5e8cbad5	d3f95221-0326-4dbd-9873-970e0878ee51	68e05062-eb22-42b1-bdba-b0de058de52e	t	aaa2ae61-b95b-472c-9426-61a3297c2904	2025-02-04 17:02:55.062485	\N	\N
4580950e-a759-4b36-be16-bbf27f30c511	d3f95221-0326-4dbd-9873-970e0878ee51	ec50fa62-d353-4cd9-8fad-b55ed491c2a5	t	aaa2ae61-b95b-472c-9426-61a3297c2904	2025-02-04 17:02:55.062485	\N	\N
2d937905-451a-4971-a069-f1dfa6e29a4b	d3f95221-0326-4dbd-9873-970e0878ee51	df0884de-ebf6-4eac-bda5-7d35eba0d6e5	t	aaa2ae61-b95b-472c-9426-61a3297c2904	2025-02-04 17:02:55.062485	\N	\N
7f1a911c-d4a5-4483-a052-d0558a57bebd	d3f95221-0326-4dbd-9873-970e0878ee51	8bfcd959-f9a6-4514-a164-e325de3970a4	t	aaa2ae61-b95b-472c-9426-61a3297c2904	2025-02-04 17:02:55.062485	\N	\N
a9d5c0b7-3fad-427e-aa03-d5d7ea90f6be	c387b3c7-31f8-4e9f-8070-3274899a37a9	df0884de-ebf6-4eac-bda5-7d35eba0d6e5	t	aaa2ae61-b95b-472c-9426-61a3297c2904	2025-03-14 14:00:09.864562	\N	\N
fdaa4460-32bb-4af1-9da9-748bbbe3995b	c387b3c7-31f8-4e9f-8070-3274899a37a9	17647417-2bfe-4e5d-96b8-53342dfe8443	t	aaa2ae61-b95b-472c-9426-61a3297c2904	2025-03-14 14:00:09.864562	\N	\N
f57efb29-ca27-4910-8095-fcb76d7b44cd	c387b3c7-31f8-4e9f-8070-3274899a37a9	8bfcd959-f9a6-4514-a164-e325de3970a4	t	aaa2ae61-b95b-472c-9426-61a3297c2904	2025-03-14 14:00:09.864562	\N	\N
e913c086-c565-439e-b249-f7b462de4711	9afe3c2e-139d-466d-b8cc-add044b41397	df0884de-ebf6-4eac-bda5-7d35eba0d6e5	t	aaa2ae61-b95b-472c-9426-61a3297c2904	2025-06-06 19:34:12.025706	\N	\N
00fd467d-0b4a-4ebd-8c69-84c586bd92d0	9afe3c2e-139d-466d-b8cc-add044b41397	17647417-2bfe-4e5d-96b8-53342dfe8443	t	aaa2ae61-b95b-472c-9426-61a3297c2904	2025-06-06 19:34:12.025706	\N	\N
e75b939b-0a67-4818-9adb-ad566a6c9fc1	9afe3c2e-139d-466d-b8cc-add044b41397	8bfcd959-f9a6-4514-a164-e325de3970a4	t	aaa2ae61-b95b-472c-9426-61a3297c2904	2025-06-06 19:34:12.025706	\N	\N
cdf53eea-9d6f-45b0-8b38-ae41c04fe2da	9afe3c2e-139d-466d-b8cc-add044b41397	a5a97723-1eb8-4f15-8672-36ba33c2e76e	t	aaa2ae61-b95b-472c-9426-61a3297c2904	2025-06-06 19:34:12.025706	\N	\N
53f15fd3-f7e5-47dc-9ced-6c1d69a2b457	aa976a7c-b30c-4c29-9511-34b0a7c8676b	0912edb5-2a41-4ac7-8ea5-c33cfbc58102	t	aaa2ae61-b95b-472c-9426-61a3297c2904	2025-07-02 23:00:49.889812	\N	\N
88de63c5-f009-40ec-8fcd-0961dc4dec4d	aa976a7c-b30c-4c29-9511-34b0a7c8676b	df0884de-ebf6-4eac-bda5-7d35eba0d6e5	t	aaa2ae61-b95b-472c-9426-61a3297c2904	2025-07-02 23:00:49.889812	\N	\N
c3765438-2e3f-48ad-8290-8705e6654d84	aa976a7c-b30c-4c29-9511-34b0a7c8676b	17647417-2bfe-4e5d-96b8-53342dfe8443	t	aaa2ae61-b95b-472c-9426-61a3297c2904	2025-07-02 23:00:49.889812	\N	\N
70fc37b3-45e4-4f0a-b77f-e1949b3f85b0	aa976a7c-b30c-4c29-9511-34b0a7c8676b	8bfcd959-f9a6-4514-a164-e325de3970a4	t	aaa2ae61-b95b-472c-9426-61a3297c2904	2025-07-02 23:00:49.889812	\N	\N
\.


--
-- Data for Name: actuation_area_shipping; Type: TABLE DATA; Schema: logistics; Owner: postgres
--

COPY logistics.actuation_area_shipping (actuation_area_shipping_id, actuation_area_config_id, delivery_option_id, created_by, created_at, updated_by, updated_at, value, active, shipping_free) FROM stdin;
86987757-e28f-4823-8a98-5a4d7eda0485	b7f87a76-31da-4d36-a881-62196a1721a8	deb02c5a-5468-408a-ae1d-4651bc38c76d	aaa2ae61-b95b-472c-9426-61a3297c2904	2025-01-29 19:16:24.162465	aaa2ae61-b95b-472c-9426-61a3297c2904	2025-02-01 16:55:19.296203	0	t	t
e10d710c-04d9-4332-9f5f-8b3efcb7556c	32adb2d4-be8c-4edb-ba47-3767f8097e92	deb02c5a-5468-408a-ae1d-4651bc38c76d	aaa2ae61-b95b-472c-9426-61a3297c2904	2025-02-02 21:42:56.317538	\N	\N	0	t	t
ea9c7a6d-9cfa-43c1-944f-2eb64ca6543b	d3f95221-0326-4dbd-9873-970e0878ee51	deb02c5a-5468-408a-ae1d-4651bc38c76d	aaa2ae61-b95b-472c-9426-61a3297c2904	2025-02-04 17:02:55.062485	\N	\N	0	t	t
7868e6f6-b3d0-4ead-bf7f-f99741c5efe9	c387b3c7-31f8-4e9f-8070-3274899a37a9	deb02c5a-5468-408a-ae1d-4651bc38c76d	aaa2ae61-b95b-472c-9426-61a3297c2904	2025-03-14 14:00:09.864562	\N	\N	0	t	t
628a7e49-9cd0-4812-8379-1fb0a297c5af	9afe3c2e-139d-466d-b8cc-add044b41397	deb02c5a-5468-408a-ae1d-4651bc38c76d	aaa2ae61-b95b-472c-9426-61a3297c2904	2025-06-06 19:34:12.025706	\N	\N	5	t	f
b4b4b69c-7452-4a27-8402-5d96856c4cce	aa976a7c-b30c-4c29-9511-34b0a7c8676b	1e19f164-c7bd-4fe3-a1d3-121db2df6dd7	aaa2ae61-b95b-472c-9426-61a3297c2904	2025-07-02 23:00:49.889812	\N	\N	0	t	t
\.


--
-- Data for Name: spatial_ref_sys; Type: TABLE DATA; Schema: logistics; Owner: postgres
--

COPY logistics.spatial_ref_sys (srid, auth_name, auth_srid, srtext, proj4text) FROM stdin;
\.


--
-- Data for Name: working_day; Type: TABLE DATA; Schema: logistics; Owner: postgres
--

COPY logistics.working_day (working_day_id, day_number, created_by, created_at, actuation_area_config_id, updated_by, updated_at) FROM stdin;
a281bea0-3447-4c70-a72e-380d642f7bca	1	aaa2ae61-b95b-472c-9426-61a3297c2904	2025-01-29 19:16:24.162465	b7f87a76-31da-4d36-a881-62196a1721a8	aaa2ae61-b95b-472c-9426-61a3297c2904	2025-02-01 16:55:19.296203
67908ffc-3e9c-4e7c-9486-0e951913b720	2	aaa2ae61-b95b-472c-9426-61a3297c2904	2025-01-29 19:16:24.162465	b7f87a76-31da-4d36-a881-62196a1721a8	aaa2ae61-b95b-472c-9426-61a3297c2904	2025-02-01 16:55:19.296203
9f114f3b-4004-4979-99e7-9c3b432fb851	3	aaa2ae61-b95b-472c-9426-61a3297c2904	2025-01-29 19:16:24.162465	b7f87a76-31da-4d36-a881-62196a1721a8	aaa2ae61-b95b-472c-9426-61a3297c2904	2025-02-01 16:55:19.296203
9fdc9a64-1277-43c7-a0cb-5b378d53a4ce	4	aaa2ae61-b95b-472c-9426-61a3297c2904	2025-01-29 19:16:24.162465	b7f87a76-31da-4d36-a881-62196a1721a8	aaa2ae61-b95b-472c-9426-61a3297c2904	2025-02-01 16:55:19.296203
705aeb44-dda6-4ea6-b163-fb8bf02c998a	5	aaa2ae61-b95b-472c-9426-61a3297c2904	2025-01-29 19:16:24.162465	b7f87a76-31da-4d36-a881-62196a1721a8	aaa2ae61-b95b-472c-9426-61a3297c2904	2025-02-01 16:55:19.296203
0d1b0d0c-4f4e-441a-bc05-60e0ffaecebf	0	aaa2ae61-b95b-472c-9426-61a3297c2904	2025-02-02 21:42:56.317538	32adb2d4-be8c-4edb-ba47-3767f8097e92	\N	\N
7ed0f128-edbf-423b-b39c-bb60c4f7d243	1	aaa2ae61-b95b-472c-9426-61a3297c2904	2025-02-02 21:42:56.317538	32adb2d4-be8c-4edb-ba47-3767f8097e92	\N	\N
f433958e-c55d-4014-bfe1-141daf542310	2	aaa2ae61-b95b-472c-9426-61a3297c2904	2025-02-02 21:42:56.317538	32adb2d4-be8c-4edb-ba47-3767f8097e92	\N	\N
3e131be8-16b9-478a-a82a-d7014e9fbcf7	3	aaa2ae61-b95b-472c-9426-61a3297c2904	2025-02-02 21:42:56.317538	32adb2d4-be8c-4edb-ba47-3767f8097e92	\N	\N
69f85f6e-5547-40f8-8757-47b22e878a26	4	aaa2ae61-b95b-472c-9426-61a3297c2904	2025-02-02 21:42:56.317538	32adb2d4-be8c-4edb-ba47-3767f8097e92	\N	\N
81106362-19e7-482c-8465-2a9147cd0bd2	5	aaa2ae61-b95b-472c-9426-61a3297c2904	2025-02-02 21:42:56.317538	32adb2d4-be8c-4edb-ba47-3767f8097e92	\N	\N
314cbf87-4e4f-46fa-8254-187015c753be	6	aaa2ae61-b95b-472c-9426-61a3297c2904	2025-02-02 21:42:56.317538	32adb2d4-be8c-4edb-ba47-3767f8097e92	\N	\N
50d28bd6-7008-44d7-9f4f-f1e9990e2601	0	aaa2ae61-b95b-472c-9426-61a3297c2904	2025-02-04 17:02:55.062485	d3f95221-0326-4dbd-9873-970e0878ee51	\N	\N
a302f5ed-925f-4d00-a445-d059914b9043	6	aaa2ae61-b95b-472c-9426-61a3297c2904	2025-02-01 16:55:19.296203	b7f87a76-31da-4d36-a881-62196a1721a8	\N	\N
b8684688-7ed8-4f43-9840-cd80e676408f	1	aaa2ae61-b95b-472c-9426-61a3297c2904	2025-02-04 17:02:55.062485	d3f95221-0326-4dbd-9873-970e0878ee51	\N	\N
2e045973-6f1b-40ce-bbd4-7392e183ec53	2	aaa2ae61-b95b-472c-9426-61a3297c2904	2025-02-04 17:02:55.062485	d3f95221-0326-4dbd-9873-970e0878ee51	\N	\N
5b8b1409-e5fe-4207-b6ce-58dc2b04bd20	3	aaa2ae61-b95b-472c-9426-61a3297c2904	2025-02-04 17:02:55.062485	d3f95221-0326-4dbd-9873-970e0878ee51	\N	\N
3c331918-a10d-4fea-8d10-537f070ed1f5	4	aaa2ae61-b95b-472c-9426-61a3297c2904	2025-02-04 17:02:55.062485	d3f95221-0326-4dbd-9873-970e0878ee51	\N	\N
afe8238e-41d3-41cc-a521-4893005474a9	5	aaa2ae61-b95b-472c-9426-61a3297c2904	2025-02-04 17:02:55.062485	d3f95221-0326-4dbd-9873-970e0878ee51	\N	\N
02b748ad-4943-4cfb-ba3e-75da62f7b8f4	6	aaa2ae61-b95b-472c-9426-61a3297c2904	2025-02-04 17:02:55.062485	d3f95221-0326-4dbd-9873-970e0878ee51	\N	\N
80cc4959-34c9-4ddf-84f4-3d2d47bb0668	1	aaa2ae61-b95b-472c-9426-61a3297c2904	2025-03-14 14:00:09.864562	c387b3c7-31f8-4e9f-8070-3274899a37a9	\N	\N
a35bd090-72c3-48f1-a132-e1f2d7b8dd2b	2	aaa2ae61-b95b-472c-9426-61a3297c2904	2025-03-14 14:00:09.864562	c387b3c7-31f8-4e9f-8070-3274899a37a9	\N	\N
afb7f71a-13d7-4e7d-b14b-e0c1a23f80fd	3	aaa2ae61-b95b-472c-9426-61a3297c2904	2025-03-14 14:00:09.864562	c387b3c7-31f8-4e9f-8070-3274899a37a9	\N	\N
2e207068-5653-42b4-afd0-dec06c409362	4	aaa2ae61-b95b-472c-9426-61a3297c2904	2025-03-14 14:00:09.864562	c387b3c7-31f8-4e9f-8070-3274899a37a9	\N	\N
d98d52fa-b48e-4270-b116-f9894b05f144	5	aaa2ae61-b95b-472c-9426-61a3297c2904	2025-03-14 14:00:09.864562	c387b3c7-31f8-4e9f-8070-3274899a37a9	\N	\N
aee48cf6-bde1-4ca9-8f73-87e6c4278816	0	aaa2ae61-b95b-472c-9426-61a3297c2904	2025-02-01 16:55:19.296203	b7f87a76-31da-4d36-a881-62196a1721a8	\N	\N
629eb48b-d16c-49ef-97d2-a1099c9f5c98	1	aaa2ae61-b95b-472c-9426-61a3297c2904	2025-06-06 19:34:12.025706	9afe3c2e-139d-466d-b8cc-add044b41397	\N	\N
4d4e7475-c9f8-4025-9dcc-ac238f03ee6b	2	aaa2ae61-b95b-472c-9426-61a3297c2904	2025-06-06 19:34:12.025706	9afe3c2e-139d-466d-b8cc-add044b41397	\N	\N
b575ed05-c61e-4f7f-a234-181a7f989e0f	3	aaa2ae61-b95b-472c-9426-61a3297c2904	2025-06-06 19:34:12.025706	9afe3c2e-139d-466d-b8cc-add044b41397	\N	\N
10471302-4cdd-4b6a-be40-db149839e666	4	aaa2ae61-b95b-472c-9426-61a3297c2904	2025-06-06 19:34:12.025706	9afe3c2e-139d-466d-b8cc-add044b41397	\N	\N
fa7af9b3-5352-424f-bf79-3481704ea0f5	5	aaa2ae61-b95b-472c-9426-61a3297c2904	2025-06-06 19:34:12.025706	9afe3c2e-139d-466d-b8cc-add044b41397	\N	\N
5646a55f-14e5-4fc6-af67-e839b6d23930	6	aaa2ae61-b95b-472c-9426-61a3297c2904	2025-06-06 19:34:12.025706	9afe3c2e-139d-466d-b8cc-add044b41397	\N	\N
beefe0bc-fff6-4608-ba31-1a2cd0126226	1	aaa2ae61-b95b-472c-9426-61a3297c2904	2025-07-02 23:00:49.889812	aa976a7c-b30c-4c29-9511-34b0a7c8676b	\N	\N
114dfc18-f5e5-46e4-91e3-5e385ffa8806	2	aaa2ae61-b95b-472c-9426-61a3297c2904	2025-07-02 23:00:49.889812	aa976a7c-b30c-4c29-9511-34b0a7c8676b	\N	\N
e9031155-7e24-4835-b860-9f6acc3ecf10	3	aaa2ae61-b95b-472c-9426-61a3297c2904	2025-07-02 23:00:49.889812	aa976a7c-b30c-4c29-9511-34b0a7c8676b	\N	\N
a0ae51e1-3f4f-4e0b-84f9-f233891437ab	4	aaa2ae61-b95b-472c-9426-61a3297c2904	2025-07-02 23:00:49.889812	aa976a7c-b30c-4c29-9511-34b0a7c8676b	\N	\N
e4d3c43a-db23-440f-88c9-75c1a89159f4	5	aaa2ae61-b95b-472c-9426-61a3297c2904	2025-07-02 23:00:49.889812	aa976a7c-b30c-4c29-9511-34b0a7c8676b	\N	\N
\.


--
-- Data for Name: address; Type: TABLE DATA; Schema: orders; Owner: postgres
--

COPY orders.address (address_id, street, number, complement, district, city, state, zip_code, active, created_at, updated_at, latitude, longitude) FROM stdin;
40cb3c30-9cc1-4e6f-93ae-fd856c3b85e9	Rua DDD	666	Casa 666	Vila Capetinha	S├úo Paulo	SP	03613666	t	2023-05-19 15:46:30.355	2023-05-19 17:44:12.107	-23.5503099	-46.6367758
\.


--
-- Data for Name: order_branch; Type: TABLE DATA; Schema: orders; Owner: postgres
--

COPY orders.order_branch (order_branch_id, order_id, branch_id, branch_name, document, partner_id, phone) FROM stdin;
63944841-eaf0-4cb5-bb73-5c010bbf367d	a4e080bd-d6c4-4b0b-b824-f4ff8dcbada3	5bbe9b68-0bc7-4728-99cf-6966f0e1c77c	Parceiro Piloto	30201563000109	f78a4a48-1be2-45aa-a486-84d31d0fd665	11998650135
c6d36be7-5743-45e0-88a6-3c79ac98901d	29a5bdf0-85b1-47be-acde-5e6b75eb9e15	5bbe9b68-0bc7-4728-99cf-6966f0e1c77c	Parceiro Piloto	30201563000109	f78a4a48-1be2-45aa-a486-84d31d0fd665	11998650135
f8384fec-24a7-4db6-a662-d141515af8eb	2e57fd30-7c82-45cc-94e3-1ddccd7680f5	5bbe9b68-0bc7-4728-99cf-6966f0e1c77c	Parceiro Piloto	30201563000109	f78a4a48-1be2-45aa-a486-84d31d0fd665	11998650135
980474b6-2869-458b-8ebf-1651ceb8bbcc	2b47442c-2ce6-4791-bf19-ac37930ecfeb	5bbe9b68-0bc7-4728-99cf-6966f0e1c77c	Parceiro Piloto	30201563000109	f78a4a48-1be2-45aa-a486-84d31d0fd665	11998650135
49a6dead-625a-473f-96dc-d0bfe538428e	aceb7022-aced-4e11-ba71-1c75fe8130f4	5bbe9b68-0bc7-4728-99cf-6966f0e1c77c	Parceiro Piloto	30201563000109	f78a4a48-1be2-45aa-a486-84d31d0fd665	11998650135
d77ee317-3435-4af6-9f15-626cc7ad0d27	c92da6c8-5181-4ee3-8062-98466d5b4348	5954cc99-9b55-41db-a90d-ef9808af5438	Distribuidora Le Maroli Ltda	46883298000126	35332c5f-17df-4909-ad5d-c9b3db146aa5	1122223333
bf893f36-ee3a-4662-a619-d58b9193aecc	22ba0fbd-1d80-418a-af70-9445425b205a	5954cc99-9b55-41db-a90d-ef9808af5438	Distribuidora Le Maroli Ltda	46883298000126	35332c5f-17df-4909-ad5d-c9b3db146aa5	1122223333
232912ca-b18b-492b-8be4-b6a823eea4c4	13e8c878-3b5d-4fe3-b7a3-822b994f5e08	5954cc99-9b55-41db-a90d-ef9808af5438	Distribuidora Le Maroli Ltda	46883298000126	35332c5f-17df-4909-ad5d-c9b3db146aa5	1122223333
bdaf2521-82e6-4a8c-8c60-9ebd1f024594	ac3539b1-40e8-40ed-8cce-f0675d071e59	5954cc99-9b55-41db-a90d-ef9808af5438	Distribuidora Le Maroli Ltda	46883298000126	35332c5f-17df-4909-ad5d-c9b3db146aa5	1122223333
6cd87c3f-7e8a-48a9-a5e2-09abbb334370	9c53f225-953e-4846-8fe7-ef65ebefa5d9	5954cc99-9b55-41db-a90d-ef9808af5438	Distribuidora Le Maroli Ltda	46883298000126	35332c5f-17df-4909-ad5d-c9b3db146aa5	1122223333
99919a44-4fb3-4b28-87aa-54faee3ad9cd	4b4e0425-e0fc-4563-bf8d-7ca2e76345fe	5954cc99-9b55-41db-a90d-ef9808af5438	Distribuidora Le Maroli Ltda	46883298000126	35332c5f-17df-4909-ad5d-c9b3db146aa5	1122223333
7596c181-7a17-40b4-81f5-3cf848f5e82c	b08a7f55-7fe7-4342-a400-85bdebbe2950	5954cc99-9b55-41db-a90d-ef9808af5438	Distribuidora Le Maroli Ltda	46883298000126	35332c5f-17df-4909-ad5d-c9b3db146aa5	1122223333
bb95eb56-485e-42fe-b9c7-eed6530c6a1b	25c50978-b904-49e4-b804-25874a26fd92	c1096081-fa43-4681-a242-c014a916914a	Emmanuel Menezes	35712298864	ae565ea8-440c-4063-9885-3192863fd0b6	11998650135
fffd5195-502b-4ada-961b-ff931f9ce4d3	6fcc0770-25b3-437d-b162-7959f2e3cda8	c1096081-fa43-4681-a242-c014a916914a	Emmanuel Menezes	35712298864	ae565ea8-440c-4063-9885-3192863fd0b6	11998650135
1b3cb5d6-24b3-4b98-83bd-93f539134bef	f3f89699-ef53-486f-9d8f-017769a583b8	c1096081-fa43-4681-a242-c014a916914a	Emmanuel Menezes	35712298864	ae565ea8-440c-4063-9885-3192863fd0b6	11998650135
cf3183d7-cddd-4095-b7d8-2f35cf874122	38fb7db8-d759-48ad-8615-d800b6ae1199	c1096081-fa43-4681-a242-c014a916914a	Emmanuel Menezes	35712298864	ae565ea8-440c-4063-9885-3192863fd0b6	11998650135
f78deccd-56df-4068-9d37-958afc8c208a	e2e25c6c-84eb-4d64-9ca1-66fd633a93d8	c1096081-fa43-4681-a242-c014a916914a	Emmanuel Menezes	35712298864	ae565ea8-440c-4063-9885-3192863fd0b6	11998650135
63b2a6ca-0be2-4128-98bb-bdc3f522f633	c6ba6696-f485-4a8c-b2e8-5c3ba7b5becb	c1096081-fa43-4681-a242-c014a916914a	Emmanuel Menezes	35712298864	ae565ea8-440c-4063-9885-3192863fd0b6	11998650135
6a2c0a9c-89f5-4f34-b8d6-0a46f602f151	e22b8380-0e1e-4cd0-bd59-612531377798	6982f252-6464-4500-87e8-7066e6e1ce8d	Cariri	35595184078	ae565ea8-440c-4063-9885-3192863fd0b6	11977338511
294e441d-05aa-40df-a271-3b2b8c5411f4	b8255007-9755-4006-8414-1ed9264fe686	6982f252-6464-4500-87e8-7066e6e1ce8d	Cariri	35595184078	ae565ea8-440c-4063-9885-3192863fd0b6	11977338511
ab0ea40c-82b2-4ff8-8ddd-f79f4f1735e3	8a1b853c-f019-4cf7-9df4-5e81479b7500	6982f252-6464-4500-87e8-7066e6e1ce8d	Cariri	35595184078	ae565ea8-440c-4063-9885-3192863fd0b6	11977338511
a491e3a4-6ff6-4a66-91a0-c34879e9a430	3a3dcf01-9ae9-41b1-a856-6213e5203ee2	6982f252-6464-4500-87e8-7066e6e1ce8d	Cariri	35595184078	ae565ea8-440c-4063-9885-3192863fd0b6	11977338511
a9b04805-e930-4110-ba4f-79f0f08fb6c5	2e161bbd-0339-44b3-9824-289c342803be	6982f252-6464-4500-87e8-7066e6e1ce8d	Cariri	35595184078	ae565ea8-440c-4063-9885-3192863fd0b6	11977338511
7a9f71c7-fde4-45af-a1e4-91211ae1356c	cd59c5bf-e966-497a-a404-7570e1ea8218	c1096081-fa43-4681-a242-c014a916914a	Emmanuel Menezes	35712298864	ae565ea8-440c-4063-9885-3192863fd0b6	11998650135
c700c86a-ffd9-455f-89db-2850191231a4	8225b508-fecb-4b23-b774-304489d32fa2	c1096081-fa43-4681-a242-c014a916914a	Emmanuel Menezes	35712298864	ae565ea8-440c-4063-9885-3192863fd0b6	11998650135
b2df39b3-8be2-45dc-8aa5-31b683bc9fb7	ad248838-9ad6-477f-81b7-ae21f67dfa73	c1096081-fa43-4681-a242-c014a916914a	Emmanuel Menezes	35712298864	ae565ea8-440c-4063-9885-3192863fd0b6	11998650135
61163aeb-53a5-401b-b050-a9df98786985	3415dfa8-7ffb-4a15-af79-32de48e4b38c	c1096081-fa43-4681-a242-c014a916914a	Emmanuel Menezes	35712298864	ae565ea8-440c-4063-9885-3192863fd0b6	11998650135
805556d5-6d2b-45a9-8747-718a599443ff	2771c0c3-1195-436e-8cdc-bd10744b5763	c1096081-fa43-4681-a242-c014a916914a	Emmanuel Menezes	35712298864	ae565ea8-440c-4063-9885-3192863fd0b6	11998650135
dd833ee9-010b-47d1-8437-08b68c6fff69	f74616e9-9dc9-4d48-abac-89470f3272b3	c1096081-fa43-4681-a242-c014a916914a	Emmanuel Menezes	35712298864	ae565ea8-440c-4063-9885-3192863fd0b6	11998650135
b90d1bf7-fbef-430e-8aa3-f0784eb3cad1	31fd2d1b-f1e6-4675-913d-d5281356d652	c1096081-fa43-4681-a242-c014a916914a	Emmanuel Menezes	35712298864	ae565ea8-440c-4063-9885-3192863fd0b6	11998650135
b70c669f-2cad-405d-9e73-1ecba993868b	7c9baa86-30d2-478f-ae53-8efa8df79e31	c1096081-fa43-4681-a242-c014a916914a	Emmanuel Menezes	35712298864	ae565ea8-440c-4063-9885-3192863fd0b6	11998650135
4d3a4c26-1d77-4e08-9203-ed1ce139d1a5	4510bfd1-7f06-4072-be52-3bd155b8bd90	c1096081-fa43-4681-a242-c014a916914a	Emmanuel Menezes	35712298864	ae565ea8-440c-4063-9885-3192863fd0b6	11998650135
68106f02-fe68-4d56-9008-de5c7d775009	8aec5427-18aa-46b7-ac79-cde5da3c9dd1	c1096081-fa43-4681-a242-c014a916914a	Emmanuel Menezes	35712298864	ae565ea8-440c-4063-9885-3192863fd0b6	11998650135
b6215a9a-579a-4992-a19b-2757c40e8814	d28d89bd-f19e-4603-8aaf-7cb4074cb6b4	c1096081-fa43-4681-a242-c014a916914a	Emmanuel Menezes	35712298864	ae565ea8-440c-4063-9885-3192863fd0b6	11998650135
11d432b1-fd7d-447a-9fac-f96a219534ad	bdbdff91-5827-4a20-8fcc-07e178c8b272	c1096081-fa43-4681-a242-c014a916914a	Emmanuel Menezes	35712298864	ae565ea8-440c-4063-9885-3192863fd0b6	11998650135
\.


--
-- Data for Name: order_consumer; Type: TABLE DATA; Schema: orders; Owner: postgres
--

COPY orders.order_consumer (order_address_id, order_id, address_id, street, number, complement, district, city, state, zip_code, latitude, longitude, consumer_id, legal_name, fantasy_name, document, email, phone_number) FROM stdin;
b449c11a-ec7d-49ff-9710-2810a4713e61	a4e080bd-d6c4-4b0b-b824-f4ff8dcbada3	\N	Rua das Andorinhas	80	N/A	Cidade Ariston	Carapicuiba	Rua das Andorinhas	06395370	-23.5411272	-46.8513734	7071c9e2-ce05-42c2-9ffc-73cb6d16148e	Emmanuel menezes	Emmanuel menezes	39745467820	emmanuel.s.menezes@gmail.com	11973892831
91508526-c00d-4bea-83c3-894092c0696c	29a5bdf0-85b1-47be-acde-5e6b75eb9e15	5062f47d-cab1-42a2-b8af-6d234f5f6deb	Rua das Andorinhas	80	N/A	Cidade Ariston	Carapicuiba	Rua das Andorinhas	06395370	-23.5411272	-46.8513734	7071c9e2-ce05-42c2-9ffc-73cb6d16148e	Emmanuel menezes	Emmanuel menezes	39745467820	emmanuel.s.menezes@gmail.com	11973892831
93f496a6-55fb-4cdc-a73d-cabb1fb43fb4	2e57fd30-7c82-45cc-94e3-1ddccd7680f5	\N	Rua das Andorinhas	80	N/A	Cidade Ariston	Carapicuiba	Rua das Andorinhas	06395370	-23.5411272	-46.8513734	7071c9e2-ce05-42c2-9ffc-73cb6d16148e	Emmanuel menezes	Emmanuel menezes	39745467820	emmanuel.s.menezes@gmail.com	11973892831
9b8a0e6f-7bf5-4d78-a5c0-f5cdbb812666	2b47442c-2ce6-4791-bf19-ac37930ecfeb	\N	Rua das Andorinhas	80	N/A	Cidade Ariston	Carapicuiba	Rua das Andorinhas	06395370	-23.5411272	-46.8513734	7071c9e2-ce05-42c2-9ffc-73cb6d16148e	Emmanuel menezes	Emmanuel menezes	39745467820	emmanuel.s.menezes@gmail.com	11973892831
bffc05fb-48c1-4143-9fa9-f0cb001f38eb	aceb7022-aced-4e11-ba71-1c75fe8130f4	5062f47d-cab1-42a2-b8af-6d234f5f6deb	Rua das Andorinhas	80	N/A	Cidade Ariston	Carapicuiba	Rua das Andorinhas	06395370	-23.5411272	-46.8513734	7071c9e2-ce05-42c2-9ffc-73cb6d16148e	Emmanuel menezes	Emmanuel menezes	39745467820	emmanuel.s.menezes@gmail.com	11973892831
f5b35337-287e-4096-967d-4c088f6e1a32	c92da6c8-5181-4ee3-8062-98466d5b4348	\N	Estr. Mun. Du├¡lio Sai	1089	N/A	Da Lagoa	Itupeva	Estr. Mun. Du├¡lio Sai	13296374	-23.187242299999998	-47.048286499999996	5714ee22-66e2-4fe0-8f0e-4be4652dcbed	Ot├ívio Brisolla	Ot├ívio Brisolla	34498969898	otavio.polatto@gmail.com	11972340266
0fd76ad6-cfdb-4e9c-a163-469ad35f4c39	22ba0fbd-1d80-418a-af70-9445425b205a	\N	Estr. Mun. Du├¡lio Sai	1089	N/A	Da Lagoa	Itupeva	Estr. Mun. Du├¡lio Sai	13296374	-23.187242299999998	-47.048286499999996	5714ee22-66e2-4fe0-8f0e-4be4652dcbed	Ot├ívio Brisolla	Ot├ívio Brisolla	34498969898	otavio.polatto@gmail.com	11972340266
85ae59ed-5546-43e7-bce0-3dade086eddb	13e8c878-3b5d-4fe3-b7a3-822b994f5e08	\N	Estr. Mun. Du├¡lio Sai	1089	N/A	Da Lagoa	Itupeva	Estr. Mun. Du├¡lio Sai	13296374	-23.187242299999998	-47.048286499999996	5714ee22-66e2-4fe0-8f0e-4be4652dcbed	Ot├ívio Brisolla	Ot├ívio Brisolla	34498969898	otavio.polatto@gmail.com	11972340266
a32feba2-517e-4550-924d-157ffea6fd9c	ac3539b1-40e8-40ed-8cce-f0675d071e59	\N	Estrada Municipal Du├¡lio Sai	721	N/A	S├úo Venancio	Itupeva	Estrada Municipal Du├¡lio Sai	13296374	-23.1808723	-47.0477881	5af9a155-8d87-4d31-a1d2-552056257c26	Tiago Sargiani	Tiago Sargiani	27242723825	tiago.sargiani@gmail.com	11982084614
b07f5338-8b98-4a21-8ecb-4b82554dd7ea	9c53f225-953e-4846-8fe7-ef65ebefa5d9	\N	Estrada Municipal Du├¡lio Sai	721	N/A	S├úo Venancio	Itupeva	Estrada Municipal Du├¡lio Sai	13296374	-23.1808723	-47.0477881	5af9a155-8d87-4d31-a1d2-552056257c26	Tiago Sargiani	Tiago Sargiani	27242723825	tiago.sargiani@gmail.com	11982084614
033e8c75-66df-4e2e-8a6a-9600638a7b0a	4b4e0425-e0fc-4563-bf8d-7ca2e76345fe	\N	Estrada Municipal Du├¡lio Sai	721	N/A	S├úo Venancio	Itupeva	Estrada Municipal Du├¡lio Sai	13296374	-23.1808723	-47.0477881	5af9a155-8d87-4d31-a1d2-552056257c26	Tiago Sargiani	Tiago Sargiani	27242723825	tiago.sargiani@gmail.com	11982084614
cd866587-fce3-45d6-b5d5-510ddf5b5963	b08a7f55-7fe7-4342-a400-85bdebbe2950	e15bad56-980d-42f5-abe7-745c82eaea8e	Estr. Mun. Du├¡lio Sai	1089	N/A	Da Lagoa	Itupeva	Estr. Mun. Du├¡lio Sai	13296374	-23.187242299999998	-47.048286499999996	5714ee22-66e2-4fe0-8f0e-4be4652dcbed	Ot├ívio Brisolla	Ot├ívio Brisolla	34498969898	otavio.polatto@gmail.com	11972340266
29674874-8bbc-4e53-8d63-9e79b9795d81	25c50978-b904-49e4-b804-25874a26fd92	4cdddd3d-00df-4471-8d60-0dc3dec4aa37	Estrada dos Galdinos	1177	N/A	Gramado	Cotia	Estrada dos Galdinos	06710400	-23.6059252	-46.926502	7071c9e2-ce05-42c2-9ffc-73cb6d16148e	Emmanuel menezes	Emmanuel menezes	39745467820	emmanuel.s.menezes@gmail.com	11973892831
4a7ffdb5-d842-481c-8695-736b8eef6d88	6fcc0770-25b3-437d-b162-7959f2e3cda8	\N	Estrada dos Galdinos	1177	N/A	Gramado	Cotia	Estrada dos Galdinos	06710400	-23.6059252	-46.926502	7071c9e2-ce05-42c2-9ffc-73cb6d16148e	Emmanuel menezes	Emmanuel menezes	39745467820	emmanuel.s.menezes@gmail.com	11973892831
52c010a3-ce71-4629-972d-2dc3d9f95459	f3f89699-ef53-486f-9d8f-017769a583b8	\N	Estrada dos Galdinos	1177	N/A	Gramado	Cotia	Estrada dos Galdinos	06710400	-23.6059252	-46.926502	7071c9e2-ce05-42c2-9ffc-73cb6d16148e	Emmanuel menezes	Emmanuel menezes	39745467820	emmanuel.s.menezes@gmail.com	11973892831
d56085f5-99e8-4ff9-9699-8c2a15bfa90d	38fb7db8-d759-48ad-8615-d800b6ae1199	\N	Estrada dos Galdinos	1177	N/A	Gramado	Cotia	Estrada dos Galdinos	06710400	-23.6059252	-46.926502	7071c9e2-ce05-42c2-9ffc-73cb6d16148e	Emmanuel menezes	Emmanuel menezes	39745467820	emmanuel.s.menezes@gmail.com	11973892831
878e70df-809f-42b2-ba0e-ab5eea415581	e2e25c6c-84eb-4d64-9ca1-66fd633a93d8	\N	Estrada dos Galdinos	1177	N/A	Gramado	Cotia	Estrada dos Galdinos	06710400	-23.6059252	-46.926502	7071c9e2-ce05-42c2-9ffc-73cb6d16148e	Emmanuel menezes	Emmanuel menezes	39745467820	emmanuel.s.menezes@gmail.com	11973892831
5922f2e6-18ef-4a65-b871-f6a72897cf99	c6ba6696-f485-4a8c-b2e8-5c3ba7b5becb	\N	Estrada dos Galdinos	1177	N/A	Gramado	Cotia	Estrada dos Galdinos	06710400	-23.6059252	-46.926502	7071c9e2-ce05-42c2-9ffc-73cb6d16148e	Emmanuel menezes	Emmanuel menezes	39745467820	emmanuel.s.menezes@gmail.com	11973892831
c0bdb1d4-f2d3-4fae-b152-7a94cbed9e2e	e22b8380-0e1e-4cd0-bd59-612531377798	3e567413-a3b4-41d5-a036-58409743e5fd	Av. Jos├® Cardoso de  Alc├óntara	55	N/A	Cidade universit├írio	Juazeiro do Norte	Av. Jos├® Cardoso de  Alc├óntara	63048245	-7.258149599999999	-39.310988099999996	84713a3f-0af7-41ce-aae4-fc17f8be6bad	Thiago Pereira Silva Guedes	Thiago Pereira Silva Guedes	34576156837	thiago.router@gmail.com	11977338511
70de1458-6539-4b61-aea2-3064c811133b	b8255007-9755-4006-8414-1ed9264fe686	3e567413-a3b4-41d5-a036-58409743e5fd	Av. Jos├® Cardoso de  Alc├óntara	55	N/A	Cidade universit├írio	Juazeiro do Norte	Av. Jos├® Cardoso de  Alc├óntara	63048245	-7.258149599999999	-39.310988099999996	84713a3f-0af7-41ce-aae4-fc17f8be6bad	Thiago Pereira Silva Guedes	Thiago Pereira Silva Guedes	34576156837	thiago.router@gmail.com	11977338511
860d8c2a-332b-4cb0-a806-6af1b71684a8	8a1b853c-f019-4cf7-9df4-5e81479b7500	\N	RUa Jose RIbiro da Cruz	110	N/A	Vila Alta	Crato	RUa Jose RIbiro da Cruz	63185230	-7.2254966	-39.4100645	6398c87e-08be-46c9-b3cb-02f1c6de27f8	Guedinho	Guedinho	34576156837	guedes@xtentgroup.com	11986503208
32a26fae-0868-419b-8e8c-dba72c66f95b	3a3dcf01-9ae9-41b1-a856-6213e5203ee2	\N	Av. Jos├® Cardoso de  Alc├óntara	55	N/A	Cidade universit├írio	Juazeiro do Norte	Av. Jos├® Cardoso de  Alc├óntara	63048245	-7.258149599999999	-39.310988099999996	84713a3f-0af7-41ce-aae4-fc17f8be6bad	Thiago Pereira Silva Guedes	Thiago Pereira Silva Guedes	34576156837	thiago.router@gmail.com	11977338511
fef69715-f4c6-4612-854b-34402ee9f5e9	2e161bbd-0339-44b3-9824-289c342803be	\N	Av. Jos├® Cardoso de  Alc├óntara	55	N/A	Cidade universit├írio	Juazeiro do Norte	Av. Jos├® Cardoso de  Alc├óntara	63048245	-7.258149599999999	-39.310988099999996	84713a3f-0af7-41ce-aae4-fc17f8be6bad	Thiago Pereira Silva Guedes	Thiago Pereira Silva Guedes	34576156837	thiago.router@gmail.com	11977338511
85fd679f-a911-4de1-99db-793b4fe8ea16	cd59c5bf-e966-497a-a404-7570e1ea8218	15da4712-fcfd-414b-b7a0-ce52a493ead0	Av Jose alcantara	55	N/A	Cidade universit├íria	Juazeiro do Norte	Av Jose alcantara	63048245	-7.262541400000001	-39.3101243	9883e2f8-b0f2-43d3-bdbe-d2d601180eb0	Kelbe	Kelbe	34576156837	bizerrakelba@gmail.com	88998120086
4b587d5c-64c1-4fc2-a7c1-d700c959d3e9	8225b508-fecb-4b23-b774-304489d32fa2	\N	Avenida Jose Alc├óntara	55	N/A	Cidade Universit├íria	Juazeiro do Norte	Avenida Jose Alc├óntara	63048245	-7.262541400000001	-39.3101243	84713a3f-0af7-41ce-aae4-fc17f8be6bad	Thiago Pereira Silva Guedes	Thiago Pereira Silva Guedes	34576156837	thiago.router@gmail.com	11977338511
90e7a55b-0a73-4a69-b919-3a9daaeda554	ad248838-9ad6-477f-81b7-ae21f67dfa73	\N	Estrada dos Galdinos	1177	N/A	Gramado	Cotia	Estrada dos Galdinos	06710400	-23.6059252	-46.926502	7071c9e2-ce05-42c2-9ffc-73cb6d16148e	Emmanuel menezes	Emmanuel menezes	39745467820	emmanuel.s.menezes@gmail.com	11973892831
2da6cb91-4d00-4ed6-8c9f-50fcd39d0b17	3415dfa8-7ffb-4a15-af79-32de48e4b38c	\N	Estrada dos Galdinos	1177	N/A	Gramado	Cotia	Estrada dos Galdinos	06710400	-23.6059252	-46.926502	7071c9e2-ce05-42c2-9ffc-73cb6d16148e	Emmanuel menezes	Emmanuel menezes	39745467820	emmanuel.s.menezes@gmail.com	11973892831
60494781-3428-47b9-8118-3e2ad1c37051	2771c0c3-1195-436e-8cdc-bd10744b5763	\N	Estrada dos Galdinos	1177	N/A	Gramado	Cotia	Estrada dos Galdinos	06710400	-23.6059252	-46.926502	7071c9e2-ce05-42c2-9ffc-73cb6d16148e	Emmanuel menezes	Emmanuel menezes	39745467820	emmanuel.s.menezes@gmail.com	11973892831
9d9bb9d3-e6fa-4b03-b64b-72919d28bc19	f74616e9-9dc9-4d48-abac-89470f3272b3	\N	Avenida Jose Alc├óntara	55	N/A	Cidade Universit├íria	Juazeiro do Norte	Avenida Jose Alc├óntara	63048245	-7.262541400000001	-39.3101243	84713a3f-0af7-41ce-aae4-fc17f8be6bad	Thiago Pereira Silva Guedes	Thiago Pereira Silva Guedes	34576156837	thiago.router@gmail.com	11977338511
818facf5-f799-4148-9311-6ace280bc14a	31fd2d1b-f1e6-4675-913d-d5281356d652	\N	Estrada dos Galdinos	1177	N/A	Gramado	Cotia	Estrada dos Galdinos	06710400	-23.6059252	-46.926502	7071c9e2-ce05-42c2-9ffc-73cb6d16148e	Emmanuel menezes	Emmanuel menezes	39745467820	emmanuel.s.menezes@gmail.com	11973892831
86fd60d4-0ae3-4783-bf37-3080ef9baed5	7c9baa86-30d2-478f-ae53-8efa8df79e31	\N	Estrada dos Galdinos	1177	N/A	Gramado	Cotia	Estrada dos Galdinos	06710400	-23.6059252	-46.926502	7071c9e2-ce05-42c2-9ffc-73cb6d16148e	Emmanuel menezes	Emmanuel menezes	39745467820	emmanuel.s.menezes@gmail.com	11973892831
6755e31e-0663-4680-a595-8d4a83515632	4510bfd1-7f06-4072-be52-3bd155b8bd90	\N	Estrada dos Galdinos	1177	N/A	Gramado	Cotia	Estrada dos Galdinos	06710400	-23.6059252	-46.926502	7071c9e2-ce05-42c2-9ffc-73cb6d16148e	Emmanuel menezes	Emmanuel menezes	39745467820	emmanuel.s.menezes@gmail.com	11973892831
cebd623c-892a-4208-8c1b-65fcb120813e	8aec5427-18aa-46b7-ac79-cde5da3c9dd1	\N	Estrada dos Galdinos	1177	N/A	Gramado	Cotia	Estrada dos Galdinos	06710400	-23.6059252	-46.926502	7071c9e2-ce05-42c2-9ffc-73cb6d16148e	Emmanuel menezes	Emmanuel menezes	39745467820	emmanuel.s.menezes@gmail.com	11973892831
995e88d5-63d6-4a64-9775-e139f271e3a2	d28d89bd-f19e-4603-8aaf-7cb4074cb6b4	\N	Estrada dos Galdinos	1177	N/A	Gramado	Cotia	Estrada dos Galdinos	06710400	-23.6059252	-46.926502	7071c9e2-ce05-42c2-9ffc-73cb6d16148e	Emmanuel menezes	Emmanuel menezes	39745467820	emmanuel.s.menezes@gmail.com	11973892831
0ef35fd4-920f-418c-8b20-14369f67767f	bdbdff91-5827-4a20-8fcc-07e178c8b272	\N	Estrada dos Galdinos	1177	N/A	Gramado	Cotia	Estrada dos Galdinos	06710400	-23.6059252	-46.926502	7071c9e2-ce05-42c2-9ffc-73cb6d16148e	Emmanuel menezes	Emmanuel menezes	39745467820	emmanuel.s.menezes@gmail.com	11973892831
\.


--
-- Data for Name: order_shipping; Type: TABLE DATA; Schema: orders; Owner: postgres
--

COPY orders.order_shipping (order_shipping_id, order_id, delivery_option_id, name, value, created_by, created_at, updated_by, updated_at, shipping_free) FROM stdin;
0dd4aab8-6b12-4c40-aa03-047fa71aaeb6	a4e080bd-d6c4-4b0b-b824-f4ff8dcbada3	03959cca-3f0a-4d40-b1b4-98e0005a9a80	Busca n├úo necess├íria	0	7071c9e2-ce05-42c2-9ffc-73cb6d16148e	2024-09-12 19:45:54.400324	\N	\N	f
bd7b1620-7b8c-4f63-94cd-fb60f95c9980	29a5bdf0-85b1-47be-acde-5e6b75eb9e15	5c225b09-be7b-4e7a-bdad-c4be8333edbe	Leva e tr├ís 	0	7071c9e2-ce05-42c2-9ffc-73cb6d16148e	2024-09-12 21:35:00.242535	\N	\N	f
a0f3a66b-8532-4b52-9e76-2986bedfa6dc	2e57fd30-7c82-45cc-94e3-1ddccd7680f5	03959cca-3f0a-4d40-b1b4-98e0005a9a80	Busca n├úo necess├íria	0	7071c9e2-ce05-42c2-9ffc-73cb6d16148e	2024-09-12 21:44:02.537781	\N	\N	f
019ef174-56e8-4673-80ad-53d5063da019	2b47442c-2ce6-4791-bf19-ac37930ecfeb	5c225b09-be7b-4e7a-bdad-c4be8333edbe	Leva e tr├ís 	0	7071c9e2-ce05-42c2-9ffc-73cb6d16148e	2024-09-25 14:12:13.555404	\N	\N	f
5fb393cc-1505-4e5f-9cc5-10cf90035f74	aceb7022-aced-4e11-ba71-1c75fe8130f4	03959cca-3f0a-4d40-b1b4-98e0005a9a80	Busca n├úo necess├íria	0	7071c9e2-ce05-42c2-9ffc-73cb6d16148e	2024-09-25 14:16:15.017824	\N	\N	f
2f220b18-e16b-424e-9071-94f47a06dad9	c92da6c8-5181-4ee3-8062-98466d5b4348	f00e0913-2293-4657-9255-da77bc1fa91b	Correios	0	5714ee22-66e2-4fe0-8f0e-4be4652dcbed	2024-10-18 21:20:51.483129	\N	\N	f
3feb8fff-5a08-4d7e-8c89-dc63dc32bca1	22ba0fbd-1d80-418a-af70-9445425b205a	f00e0913-2293-4657-9255-da77bc1fa91b	Correios	0	5714ee22-66e2-4fe0-8f0e-4be4652dcbed	2024-10-18 21:36:29.656406	\N	\N	f
ceb7a747-8dff-4bef-881d-a474581cbed0	13e8c878-3b5d-4fe3-b7a3-822b994f5e08	f00e0913-2293-4657-9255-da77bc1fa91b	Correios	0	5714ee22-66e2-4fe0-8f0e-4be4652dcbed	2024-10-18 21:39:18.299014	\N	\N	f
5c8b7459-87d7-4c42-a4ff-add4d5ffe924	ac3539b1-40e8-40ed-8cce-f0675d071e59	f00e0913-2293-4657-9255-da77bc1fa91b	Correios	0	5af9a155-8d87-4d31-a1d2-552056257c26	2024-10-19 19:26:34.076862	\N	\N	f
133c9ea8-8c47-47df-b014-24d8707ce185	9c53f225-953e-4846-8fe7-ef65ebefa5d9	f00e0913-2293-4657-9255-da77bc1fa91b	Correios	0	5af9a155-8d87-4d31-a1d2-552056257c26	2024-10-19 19:49:20.599307	\N	\N	f
74c14037-a390-4f47-aa5e-5d286b5789ec	4b4e0425-e0fc-4563-bf8d-7ca2e76345fe	f00e0913-2293-4657-9255-da77bc1fa91b	Correios	0	5af9a155-8d87-4d31-a1d2-552056257c26	2024-10-19 19:51:06.640438	\N	\N	f
685f1781-e19e-4fef-b56b-602b6149be88	b08a7f55-7fe7-4342-a400-85bdebbe2950	f00e0913-2293-4657-9255-da77bc1fa91b	Correios	0	5714ee22-66e2-4fe0-8f0e-4be4652dcbed	2025-01-24 18:40:03.077969	\N	\N	f
57af381b-6d2e-42bb-ad24-515e484b7486	25c50978-b904-49e4-b804-25874a26fd92	deb02c5a-5468-408a-ae1d-4651bc38c76d	Moto frete 	0	7071c9e2-ce05-42c2-9ffc-73cb6d16148e	2025-01-30 18:48:08.762523	\N	\N	f
b8b2158f-f4e4-4935-9e3f-2573a77412cb	6fcc0770-25b3-437d-b162-7959f2e3cda8	deb02c5a-5468-408a-ae1d-4651bc38c76d	Moto frete 	0	7071c9e2-ce05-42c2-9ffc-73cb6d16148e	2025-01-30 18:53:05.395234	\N	\N	f
83061f9f-e197-4119-a0e9-73f6b3294865	f3f89699-ef53-486f-9d8f-017769a583b8	deb02c5a-5468-408a-ae1d-4651bc38c76d	Moto frete 	0	7071c9e2-ce05-42c2-9ffc-73cb6d16148e	2025-01-31 02:45:54.515994	\N	\N	f
c5c8c235-f152-41d9-bafe-c589e3418bce	38fb7db8-d759-48ad-8615-d800b6ae1199	deb02c5a-5468-408a-ae1d-4651bc38c76d	Moto frete 	0	7071c9e2-ce05-42c2-9ffc-73cb6d16148e	2025-01-31 13:22:05.740519	\N	\N	f
b5d762ba-f661-493c-95d2-17294690ccc0	e2e25c6c-84eb-4d64-9ca1-66fd633a93d8	deb02c5a-5468-408a-ae1d-4651bc38c76d	Moto frete 	0	7071c9e2-ce05-42c2-9ffc-73cb6d16148e	2025-01-31 15:48:30.875101	\N	\N	f
110a5026-db68-48f9-be45-699604fcbf1f	c6ba6696-f485-4a8c-b2e8-5c3ba7b5becb	deb02c5a-5468-408a-ae1d-4651bc38c76d	Moto frete 	0	7071c9e2-ce05-42c2-9ffc-73cb6d16148e	2025-01-31 15:56:10.15344	\N	\N	f
a2330e72-454e-4518-95be-87c0d9d415d8	e22b8380-0e1e-4cd0-bd59-612531377798	deb02c5a-5468-408a-ae1d-4651bc38c76d	Moto frete 	0	84713a3f-0af7-41ce-aae4-fc17f8be6bad	2025-01-31 18:10:03.278937	84713a3f-0af7-41ce-aae4-fc17f8be6bad	2025-01-31 18:11:00.014253	f
d99d3e15-2f32-4fa2-9b8a-cc0817addba9	b8255007-9755-4006-8414-1ed9264fe686	deb02c5a-5468-408a-ae1d-4651bc38c76d	Moto frete 	0	84713a3f-0af7-41ce-aae4-fc17f8be6bad	2025-01-31 18:12:54.684338	\N	\N	f
62f5c34c-158f-416a-b2be-d5335ec833f8	8a1b853c-f019-4cf7-9df4-5e81479b7500	deb02c5a-5468-408a-ae1d-4651bc38c76d	Moto frete 	0	6398c87e-08be-46c9-b3cb-02f1c6de27f8	2025-02-01 16:58:33.139229	\N	\N	f
ce088f35-2925-4cd6-962b-1ad9eba891e2	3a3dcf01-9ae9-41b1-a856-6213e5203ee2	deb02c5a-5468-408a-ae1d-4651bc38c76d	Moto frete 	0	84713a3f-0af7-41ce-aae4-fc17f8be6bad	2025-02-01 17:24:08.690221	\N	\N	f
9127e40b-19c9-4ca8-9c80-d1f82eba9116	2e161bbd-0339-44b3-9824-289c342803be	deb02c5a-5468-408a-ae1d-4651bc38c76d	Moto frete 	0	84713a3f-0af7-41ce-aae4-fc17f8be6bad	2025-02-02 16:39:59.642332	\N	\N	f
45562160-6226-44ae-b22b-92171a7dc82b	cd59c5bf-e966-497a-a404-7570e1ea8218	deb02c5a-5468-408a-ae1d-4651bc38c76d	Moto frete 	0	9883e2f8-b0f2-43d3-bdbe-d2d601180eb0	2025-02-04 17:10:07.380651	\N	\N	f
51f163a5-35a4-463a-9df8-b35a8f2822e6	8225b508-fecb-4b23-b774-304489d32fa2	deb02c5a-5468-408a-ae1d-4651bc38c76d	Moto frete 	0	84713a3f-0af7-41ce-aae4-fc17f8be6bad	2025-02-04 17:12:40.906399	\N	\N	f
be5d5ab7-4282-4dde-9e26-1b78934a19d1	ad248838-9ad6-477f-81b7-ae21f67dfa73	deb02c5a-5468-408a-ae1d-4651bc38c76d	Moto frete 	0	7071c9e2-ce05-42c2-9ffc-73cb6d16148e	2025-02-04 22:20:54.983794	\N	\N	f
74ce8b84-4045-4f6a-95fc-6167abd00b64	3415dfa8-7ffb-4a15-af79-32de48e4b38c	deb02c5a-5468-408a-ae1d-4651bc38c76d	Moto frete 	0	7071c9e2-ce05-42c2-9ffc-73cb6d16148e	2025-02-04 22:38:40.493965	\N	\N	f
7ff25c00-397d-415f-9f32-5f34be5f0d31	2771c0c3-1195-436e-8cdc-bd10744b5763	deb02c5a-5468-408a-ae1d-4651bc38c76d	Moto frete 	0	7071c9e2-ce05-42c2-9ffc-73cb6d16148e	2025-02-22 17:44:51.534478	\N	\N	f
8cf5df19-dca6-4acd-95e6-c2307600cb4f	f74616e9-9dc9-4d48-abac-89470f3272b3	deb02c5a-5468-408a-ae1d-4651bc38c76d	Moto frete 	0	84713a3f-0af7-41ce-aae4-fc17f8be6bad	2025-03-04 16:31:37.84049	\N	\N	f
1bb031bf-b8bd-41a4-abc2-1cfb74be1e58	31fd2d1b-f1e6-4675-913d-d5281356d652	deb02c5a-5468-408a-ae1d-4651bc38c76d	Moto frete 	0	7071c9e2-ce05-42c2-9ffc-73cb6d16148e	2025-03-17 20:59:16.505155	\N	\N	f
a82997b6-a8c7-401d-af2c-d9397cb226ff	7c9baa86-30d2-478f-ae53-8efa8df79e31	deb02c5a-5468-408a-ae1d-4651bc38c76d	Moto frete 	0	7071c9e2-ce05-42c2-9ffc-73cb6d16148e	2025-03-17 21:30:59.873848	\N	\N	f
85be74a3-3e06-4b91-b598-1310472858a1	4510bfd1-7f06-4072-be52-3bd155b8bd90	deb02c5a-5468-408a-ae1d-4651bc38c76d	Moto frete 	0	7071c9e2-ce05-42c2-9ffc-73cb6d16148e	2025-03-17 21:31:01.30993	\N	\N	f
17f09a6d-9d11-4f5c-8110-005c2987956d	8aec5427-18aa-46b7-ac79-cde5da3c9dd1	deb02c5a-5468-408a-ae1d-4651bc38c76d	Moto frete 	0	7071c9e2-ce05-42c2-9ffc-73cb6d16148e	2025-06-08 23:48:57.606406	\N	\N	f
a32de9f3-791f-439b-a042-d0f434f05795	d28d89bd-f19e-4603-8aaf-7cb4074cb6b4	deb02c5a-5468-408a-ae1d-4651bc38c76d	Moto frete 	0	7071c9e2-ce05-42c2-9ffc-73cb6d16148e	2025-07-02 21:23:27.302963	\N	\N	f
998cf7ab-6136-4b0b-a133-47b3283514d4	bdbdff91-5827-4a20-8fcc-07e178c8b272	deb02c5a-5468-408a-ae1d-4651bc38c76d	Moto frete 	0	7071c9e2-ce05-42c2-9ffc-73cb6d16148e	2025-07-02 23:36:53.798824	\N	\N	f
\.


--
-- Data for Name: orders; Type: TABLE DATA; Schema: orders; Owner: postgres
--

COPY orders.orders (order_id, order_number, freight, amount, address_id, observation, created_at, shipping_company_id, order_status_id, updated_at, created_by, updated_by, branch_id, change, consumer_id, service_fee, card_fee) FROM stdin;
a4e080bd-d6c4-4b0b-b824-f4ff8dcbada3	58	0	80	\N		2024-09-12 19:45:54.400324	7e1386fa-c4d7-4c11-9489-a3068996bac0	e04621d0-3997-4c69-9054-a10257602a29	2024-09-12 19:46:55.940391	7071c9e2-ce05-42c2-9ffc-73cb6d16148e	f78a4a48-1be2-45aa-a486-84d31d0fd665	5bbe9b68-0bc7-4728-99cf-6966f0e1c77c	0	7071c9e2-ce05-42c2-9ffc-73cb6d16148e	0.15	0.03
29a5bdf0-85b1-47be-acde-5e6b75eb9e15	59	0	70	5062f47d-cab1-42a2-b8af-6d234f5f6deb		2024-09-12 21:35:00.242535	7e1386fa-c4d7-4c11-9489-a3068996bac0	0cff5cdc-6253-4e59-9753-6cde54a33e58	\N	7071c9e2-ce05-42c2-9ffc-73cb6d16148e	\N	5bbe9b68-0bc7-4728-99cf-6966f0e1c77c	0	7071c9e2-ce05-42c2-9ffc-73cb6d16148e	0.15	0.03
2e57fd30-7c82-45cc-94e3-1ddccd7680f5	60	0	70	\N		2024-09-12 21:44:02.537781	7e1386fa-c4d7-4c11-9489-a3068996bac0	d71cb62a-28dd-44a8-a008-9d7d7d1af810	\N	7071c9e2-ce05-42c2-9ffc-73cb6d16148e	\N	5bbe9b68-0bc7-4728-99cf-6966f0e1c77c	0	7071c9e2-ce05-42c2-9ffc-73cb6d16148e	0.15	0.03
2b47442c-2ce6-4791-bf19-ac37930ecfeb	61	0	70	\N		2024-09-25 14:12:13.555404	7e1386fa-c4d7-4c11-9489-a3068996bac0	0cff5cdc-6253-4e59-9753-6cde54a33e58	\N	7071c9e2-ce05-42c2-9ffc-73cb6d16148e	\N	5bbe9b68-0bc7-4728-99cf-6966f0e1c77c	0	7071c9e2-ce05-42c2-9ffc-73cb6d16148e	0.15	0.03
aceb7022-aced-4e11-ba71-1c75fe8130f4	62	0	150	5062f47d-cab1-42a2-b8af-6d234f5f6deb		2024-09-25 14:16:15.017824	7e1386fa-c4d7-4c11-9489-a3068996bac0	4840f990-fc9e-4048-97f3-19e105b9aec5	2024-09-25 14:16:26.305433	7071c9e2-ce05-42c2-9ffc-73cb6d16148e	ac506204-19fd-480b-a622-142d74f56538	5bbe9b68-0bc7-4728-99cf-6966f0e1c77c	0	7071c9e2-ce05-42c2-9ffc-73cb6d16148e	0.15	0.03
c92da6c8-5181-4ee3-8062-98466d5b4348	63	0	349.3	\N	Teste	2024-10-18 21:20:51.483129	7e1386fa-c4d7-4c11-9489-a3068996bac0	0cff5cdc-6253-4e59-9753-6cde54a33e58	\N	5714ee22-66e2-4fe0-8f0e-4be4652dcbed	\N	5954cc99-9b55-41db-a90d-ef9808af5438	0	5714ee22-66e2-4fe0-8f0e-4be4652dcbed	0.05	0.02
22ba0fbd-1d80-418a-af70-9445425b205a	64	0	607	\N		2024-10-18 21:36:29.656406	7e1386fa-c4d7-4c11-9489-a3068996bac0	d71cb62a-28dd-44a8-a008-9d7d7d1af810	\N	5714ee22-66e2-4fe0-8f0e-4be4652dcbed	\N	5954cc99-9b55-41db-a90d-ef9808af5438	0	5714ee22-66e2-4fe0-8f0e-4be4652dcbed	0.05	0.02
13e8c878-3b5d-4fe3-b7a3-822b994f5e08	65	0	199.6	\N		2024-10-18 21:39:18.299014	7e1386fa-c4d7-4c11-9489-a3068996bac0	0cff5cdc-6253-4e59-9753-6cde54a33e58	\N	5714ee22-66e2-4fe0-8f0e-4be4652dcbed	\N	5954cc99-9b55-41db-a90d-ef9808af5438	0	5714ee22-66e2-4fe0-8f0e-4be4652dcbed	0.05	0.02
ac3539b1-40e8-40ed-8cce-f0675d071e59	66	0	250.89999999999998	\N		2024-10-19 19:26:34.076862	7e1386fa-c4d7-4c11-9489-a3068996bac0	e04621d0-3997-4c69-9054-a10257602a29	2024-10-19 19:29:24.267301	5af9a155-8d87-4d31-a1d2-552056257c26	35332c5f-17df-4909-ad5d-c9b3db146aa5	5954cc99-9b55-41db-a90d-ef9808af5438	149.10000000000002	5af9a155-8d87-4d31-a1d2-552056257c26	0.05	0.02
4b4e0425-e0fc-4563-bf8d-7ca2e76345fe	68	0	1280	\N		2024-10-19 19:51:06.640438	7e1386fa-c4d7-4c11-9489-a3068996bac0	c0d9b129-b78b-4d7e-afad-cc378d374e5e	2024-10-19 19:51:21.202723	5af9a155-8d87-4d31-a1d2-552056257c26	35332c5f-17df-4909-ad5d-c9b3db146aa5	5954cc99-9b55-41db-a90d-ef9808af5438	0	5af9a155-8d87-4d31-a1d2-552056257c26	0.05	0.02
9c53f225-953e-4846-8fe7-ef65ebefa5d9	67	0	314.3	\N		2024-10-19 19:49:20.599307	7e1386fa-c4d7-4c11-9489-a3068996bac0	c1a38ac0-37d8-450a-aa91-d297e5c97be3	2024-10-19 19:51:53.941004	5af9a155-8d87-4d31-a1d2-552056257c26	35332c5f-17df-4909-ad5d-c9b3db146aa5	5954cc99-9b55-41db-a90d-ef9808af5438	0	5af9a155-8d87-4d31-a1d2-552056257c26	0.05	0.02
b08a7f55-7fe7-4342-a400-85bdebbe2950	69	0	162	e15bad56-980d-42f5-abe7-745c82eaea8e		2025-01-24 18:40:03.077969	7e1386fa-c4d7-4c11-9489-a3068996bac0	d71cb62a-28dd-44a8-a008-9d7d7d1af810	\N	5714ee22-66e2-4fe0-8f0e-4be4652dcbed	\N	5954cc99-9b55-41db-a90d-ef9808af5438	0	5714ee22-66e2-4fe0-8f0e-4be4652dcbed	0.05	0.02
b8255007-9755-4006-8414-1ed9264fe686	77	0	130	3e567413-a3b4-41d5-a036-58409743e5fd	Moro na beirada do cidades	2025-01-31 18:12:54.684338	7e1386fa-c4d7-4c11-9489-a3068996bac0	e04621d0-3997-4c69-9054-a10257602a29	2025-01-31 18:17:21.254908	84713a3f-0af7-41ce-aae4-fc17f8be6bad	ae565ea8-440c-4063-9885-3192863fd0b6	6982f252-6464-4500-87e8-7066e6e1ce8d	70	84713a3f-0af7-41ce-aae4-fc17f8be6bad	0.05	0.03
25c50978-b904-49e4-b804-25874a26fd92	70	0	155	4cdddd3d-00df-4471-8d60-0dc3dec4aa37	Renatao surulepi\n	2025-01-30 18:48:08.762523	7e1386fa-c4d7-4c11-9489-a3068996bac0	e04621d0-3997-4c69-9054-a10257602a29	2025-01-30 18:51:46.499547	7071c9e2-ce05-42c2-9ffc-73cb6d16148e	ae565ea8-440c-4063-9885-3192863fd0b6	c1096081-fa43-4681-a242-c014a916914a	0	7071c9e2-ce05-42c2-9ffc-73cb6d16148e	0.05	0.03
2771c0c3-1195-436e-8cdc-bd10744b5763	85	0	140	\N		2025-02-22 17:44:51.534478	7e1386fa-c4d7-4c11-9489-a3068996bac0	e04621d0-3997-4c69-9054-a10257602a29	2025-02-22 17:50:01.417866	7071c9e2-ce05-42c2-9ffc-73cb6d16148e	ae565ea8-440c-4063-9885-3192863fd0b6	c1096081-fa43-4681-a242-c014a916914a	0	7071c9e2-ce05-42c2-9ffc-73cb6d16148e	0.05	0.03
6fcc0770-25b3-437d-b162-7959f2e3cda8	71	0	140	\N		2025-01-30 18:53:05.395234	7e1386fa-c4d7-4c11-9489-a3068996bac0	c1a38ac0-37d8-450a-aa91-d297e5c97be3	2025-01-30 18:55:59.708682	7071c9e2-ce05-42c2-9ffc-73cb6d16148e	ae565ea8-440c-4063-9885-3192863fd0b6	c1096081-fa43-4681-a242-c014a916914a	60	7071c9e2-ce05-42c2-9ffc-73cb6d16148e	0.05	0.03
f3f89699-ef53-486f-9d8f-017769a583b8	72	0	295	\N	teste de pedido	2025-01-31 02:45:54.515994	7e1386fa-c4d7-4c11-9489-a3068996bac0	4840f990-fc9e-4048-97f3-19e105b9aec5	2025-01-31 02:49:34.126733	7071c9e2-ce05-42c2-9ffc-73cb6d16148e	ac506204-19fd-480b-a622-142d74f56538	c1096081-fa43-4681-a242-c014a916914a	5	7071c9e2-ce05-42c2-9ffc-73cb6d16148e	0.05	0.03
8a1b853c-f019-4cf7-9df4-5e81479b7500	78	0	260	\N		2025-02-01 16:58:33.139229	7e1386fa-c4d7-4c11-9489-a3068996bac0	e04621d0-3997-4c69-9054-a10257602a29	2025-02-01 17:00:46.10413	6398c87e-08be-46c9-b3cb-02f1c6de27f8	ae565ea8-440c-4063-9885-3192863fd0b6	6982f252-6464-4500-87e8-7066e6e1ce8d	0	6398c87e-08be-46c9-b3cb-02f1c6de27f8	0.05	0.03
38fb7db8-d759-48ad-8615-d800b6ae1199	73	0	15	\N	teste	2025-01-31 13:22:05.740519	7e1386fa-c4d7-4c11-9489-a3068996bac0	c1a38ac0-37d8-450a-aa91-d297e5c97be3	2025-01-31 13:24:24.642005	7071c9e2-ce05-42c2-9ffc-73cb6d16148e	ae565ea8-440c-4063-9885-3192863fd0b6	c1096081-fa43-4681-a242-c014a916914a	85	7071c9e2-ce05-42c2-9ffc-73cb6d16148e	0.05	0.03
c6ba6696-f485-4a8c-b2e8-5c3ba7b5becb	75	0	280	\N		2025-01-31 15:56:10.15344	7e1386fa-c4d7-4c11-9489-a3068996bac0	c0d9b129-b78b-4d7e-afad-cc378d374e5e	2025-01-31 17:59:34.005427	7071c9e2-ce05-42c2-9ffc-73cb6d16148e	ae565ea8-440c-4063-9885-3192863fd0b6	c1096081-fa43-4681-a242-c014a916914a	0	7071c9e2-ce05-42c2-9ffc-73cb6d16148e	0.05	0.03
3a3dcf01-9ae9-41b1-a856-6213e5203ee2	79	0	130	\N		2025-02-01 17:24:08.690221	7e1386fa-c4d7-4c11-9489-a3068996bac0	d71cb62a-28dd-44a8-a008-9d7d7d1af810	\N	84713a3f-0af7-41ce-aae4-fc17f8be6bad	\N	6982f252-6464-4500-87e8-7066e6e1ce8d	70	84713a3f-0af7-41ce-aae4-fc17f8be6bad	0.05	0.03
e2e25c6c-84eb-4d64-9ca1-66fd633a93d8	74	0	140	\N		2025-01-31 15:48:30.875101	7e1386fa-c4d7-4c11-9489-a3068996bac0	e04621d0-3997-4c69-9054-a10257602a29	2025-01-31 17:59:58.338284	7071c9e2-ce05-42c2-9ffc-73cb6d16148e	ae565ea8-440c-4063-9885-3192863fd0b6	c1096081-fa43-4681-a242-c014a916914a	0	7071c9e2-ce05-42c2-9ffc-73cb6d16148e	0.05	0.03
e22b8380-0e1e-4cd0-bd59-612531377798	76	0	10	3e567413-a3b4-41d5-a036-58409743e5fd	Moro perto da rua sem sa├¡da do cidades	2025-01-31 18:10:03.278937	7e1386fa-c4d7-4c11-9489-a3068996bac0	4840f990-fc9e-4048-97f3-19e105b9aec5	2025-01-31 18:12:09.559668	84713a3f-0af7-41ce-aae4-fc17f8be6bad	c1303a50-8e09-4d41-b314-b78e0dfa0b43	6982f252-6464-4500-87e8-7066e6e1ce8d	0	84713a3f-0af7-41ce-aae4-fc17f8be6bad	0.05	0.03
ad248838-9ad6-477f-81b7-ae21f67dfa73	83	0	140	\N		2025-02-04 22:20:54.983794	7e1386fa-c4d7-4c11-9489-a3068996bac0	c1a38ac0-37d8-450a-aa91-d297e5c97be3	2025-02-04 22:22:11.739635	7071c9e2-ce05-42c2-9ffc-73cb6d16148e	ae565ea8-440c-4063-9885-3192863fd0b6	c1096081-fa43-4681-a242-c014a916914a	860	7071c9e2-ce05-42c2-9ffc-73cb6d16148e	0.05	0.03
4510bfd1-7f06-4072-be52-3bd155b8bd90	89	0	140	\N		2025-03-17 21:31:01.30993	7e1386fa-c4d7-4c11-9489-a3068996bac0	c0d9b129-b78b-4d7e-afad-cc378d374e5e	2025-03-17 21:42:01.741236	7071c9e2-ce05-42c2-9ffc-73cb6d16148e	ae565ea8-440c-4063-9885-3192863fd0b6	c1096081-fa43-4681-a242-c014a916914a	0	7071c9e2-ce05-42c2-9ffc-73cb6d16148e	0.05	0.03
2e161bbd-0339-44b3-9824-289c342803be	80	0	390	\N		2025-02-02 16:39:59.642332	7e1386fa-c4d7-4c11-9489-a3068996bac0	e04621d0-3997-4c69-9054-a10257602a29	2025-02-02 21:37:31.325976	84713a3f-0af7-41ce-aae4-fc17f8be6bad	ae565ea8-440c-4063-9885-3192863fd0b6	6982f252-6464-4500-87e8-7066e6e1ce8d	10	84713a3f-0af7-41ce-aae4-fc17f8be6bad	0.05	0.03
cd59c5bf-e966-497a-a404-7570e1ea8218	81	0	140	15da4712-fcfd-414b-b7a0-ce52a493ead0		2025-02-04 17:10:07.380651	7e1386fa-c4d7-4c11-9489-a3068996bac0	0cff5cdc-6253-4e59-9753-6cde54a33e58	\N	9883e2f8-b0f2-43d3-bdbe-d2d601180eb0	\N	c1096081-fa43-4681-a242-c014a916914a	0	9883e2f8-b0f2-43d3-bdbe-d2d601180eb0	0.05	0.03
8aec5427-18aa-46b7-ac79-cde5da3c9dd1	90	0	140	\N		2025-06-08 23:48:57.606406	7e1386fa-c4d7-4c11-9489-a3068996bac0	d71cb62a-28dd-44a8-a008-9d7d7d1af810	\N	7071c9e2-ce05-42c2-9ffc-73cb6d16148e	\N	c1096081-fa43-4681-a242-c014a916914a	0	7071c9e2-ce05-42c2-9ffc-73cb6d16148e	0.05	0.03
f74616e9-9dc9-4d48-abac-89470f3272b3	86	0	140	\N		2025-03-04 16:31:37.84049	7e1386fa-c4d7-4c11-9489-a3068996bac0	e04621d0-3997-4c69-9054-a10257602a29	2025-03-04 16:33:12.004893	84713a3f-0af7-41ce-aae4-fc17f8be6bad	ae565ea8-440c-4063-9885-3192863fd0b6	c1096081-fa43-4681-a242-c014a916914a	60	84713a3f-0af7-41ce-aae4-fc17f8be6bad	0.05	0.03
8225b508-fecb-4b23-b774-304489d32fa2	82	0	140	\N		2025-02-04 17:12:40.906399	7e1386fa-c4d7-4c11-9489-a3068996bac0	c1a38ac0-37d8-450a-aa91-d297e5c97be3	2025-02-04 22:17:17.792158	84713a3f-0af7-41ce-aae4-fc17f8be6bad	ae565ea8-440c-4063-9885-3192863fd0b6	c1096081-fa43-4681-a242-c014a916914a	0	84713a3f-0af7-41ce-aae4-fc17f8be6bad	0.05	0.03
3415dfa8-7ffb-4a15-af79-32de48e4b38c	84	0	170	\N	 Casa64	2025-02-04 22:38:40.493965	7e1386fa-c4d7-4c11-9489-a3068996bac0	e04621d0-3997-4c69-9054-a10257602a29	2025-02-04 22:40:08.434585	7071c9e2-ce05-42c2-9ffc-73cb6d16148e	ae565ea8-440c-4063-9885-3192863fd0b6	c1096081-fa43-4681-a242-c014a916914a	30	7071c9e2-ce05-42c2-9ffc-73cb6d16148e	0.05	0.03
31fd2d1b-f1e6-4675-913d-d5281356d652	87	0	140	\N		2025-03-17 20:59:16.505155	7e1386fa-c4d7-4c11-9489-a3068996bac0	d71cb62a-28dd-44a8-a008-9d7d7d1af810	\N	7071c9e2-ce05-42c2-9ffc-73cb6d16148e	\N	c1096081-fa43-4681-a242-c014a916914a	0	7071c9e2-ce05-42c2-9ffc-73cb6d16148e	0.05	0.03
7c9baa86-30d2-478f-ae53-8efa8df79e31	88	0	140	\N		2025-03-17 21:30:59.873848	7e1386fa-c4d7-4c11-9489-a3068996bac0	d71cb62a-28dd-44a8-a008-9d7d7d1af810	\N	7071c9e2-ce05-42c2-9ffc-73cb6d16148e	\N	c1096081-fa43-4681-a242-c014a916914a	0	7071c9e2-ce05-42c2-9ffc-73cb6d16148e	0.05	0.03
d28d89bd-f19e-4603-8aaf-7cb4074cb6b4	91	0	15	\N		2025-07-02 21:23:27.302963	7e1386fa-c4d7-4c11-9489-a3068996bac0	e04621d0-3997-4c69-9054-a10257602a29	2025-07-02 21:23:45.71964	7071c9e2-ce05-42c2-9ffc-73cb6d16148e	ae565ea8-440c-4063-9885-3192863fd0b6	c1096081-fa43-4681-a242-c014a916914a	0	7071c9e2-ce05-42c2-9ffc-73cb6d16148e	0.05	0.03
bdbdff91-5827-4a20-8fcc-07e178c8b272	92	0	140	\N		2025-07-02 23:36:53.798824	7e1386fa-c4d7-4c11-9489-a3068996bac0	c1a38ac0-37d8-450a-aa91-d297e5c97be3	2025-07-02 23:40:22.988099	7071c9e2-ce05-42c2-9ffc-73cb6d16148e	ae565ea8-440c-4063-9885-3192863fd0b6	c1096081-fa43-4681-a242-c014a916914a	0	7071c9e2-ce05-42c2-9ffc-73cb6d16148e	0.05	0.03
\.


--
-- Data for Name: orders_itens; Type: TABLE DATA; Schema: orders; Owner: postgres
--

COPY orders.orders_itens (order_item_id, product_name, quantity, product_value, product_id, order_id) FROM stdin;
6485b458-2844-4113-a44a-ecb3e7f5e88b	Botij├úo de g├ís  P13	1	140	c3fdb35e-b0d6-4317-90e0-c54ac27c7e15	25c50978-b904-49e4-b804-25874a26fd92
46f03f11-0ce0-42a4-a8ee-c22e79433136	Gal├úo de ├ígua 20 L	1	15	22be1807-edbc-434e-8cb8-e3146fbb07d8	25c50978-b904-49e4-b804-25874a26fd92
47ec5f6b-6814-47b9-9476-1202d8b669fc	Botij├úo de g├ís  P13	1	140	c3fdb35e-b0d6-4317-90e0-c54ac27c7e15	6fcc0770-25b3-437d-b162-7959f2e3cda8
53221ef2-e563-44e2-9e69-7a742e54c41e	Gal├úo de ├ígua 20 L	1	15	22be1807-edbc-434e-8cb8-e3146fbb07d8	f3f89699-ef53-486f-9d8f-017769a583b8
f7312ff5-4aec-47a8-b503-1edf9189e6ed	Botij├úo de g├ís  P13	2	140	c3fdb35e-b0d6-4317-90e0-c54ac27c7e15	f3f89699-ef53-486f-9d8f-017769a583b8
d0d2d83b-7930-4c3f-ba94-284c4d253a7a	Gal├úo de ├ígua 20 L	1	15	22be1807-edbc-434e-8cb8-e3146fbb07d8	38fb7db8-d759-48ad-8615-d800b6ae1199
2a921647-875e-4fce-aaf5-8533ad45e909	Botij├úo de g├ís  P13	1	140	c3fdb35e-b0d6-4317-90e0-c54ac27c7e15	e2e25c6c-84eb-4d64-9ca1-66fd633a93d8
2ff376f2-9ac8-4909-8c2b-e322dfe676ec	Botij├úo de g├ís  P13	2	140	c3fdb35e-b0d6-4317-90e0-c54ac27c7e15	c6ba6696-f485-4a8c-b2e8-5c3ba7b5becb
3f818702-8a97-4ede-9d00-c7330e516045	Gal├úo de ├ígua 20 L	2	5	18408bd4-964c-4edb-b5c6-0ec22732900b	e22b8380-0e1e-4cd0-bd59-612531377798
60fac712-ef25-4a45-94db-5b919141031a	Botij├úo de g├ís  P20	1	130	84162830-b62b-4507-914f-002211db71d9	b8255007-9755-4006-8414-1ed9264fe686
2ecb24a0-b1d6-4b2b-b4ef-804ce44a90e7	Botij├úo de g├ís  P20	2	130	84162830-b62b-4507-914f-002211db71d9	8a1b853c-f019-4cf7-9df4-5e81479b7500
3b85bd79-54d2-4236-a319-984607095ca9	Botij├úo de g├ís  P20	1	130	84162830-b62b-4507-914f-002211db71d9	3a3dcf01-9ae9-41b1-a856-6213e5203ee2
7b836c42-eae4-45f6-85e4-f264e3b19579	Botij├úo de g├ís  P20	3	130	84162830-b62b-4507-914f-002211db71d9	2e161bbd-0339-44b3-9824-289c342803be
4d35b4d6-03bd-455a-a743-47ccdc0b1526	Botij├úo de g├ís  P13	1	140	c3fdb35e-b0d6-4317-90e0-c54ac27c7e15	cd59c5bf-e966-497a-a404-7570e1ea8218
15bf18e1-b9d5-4091-a9df-6d9e9fa6459f	Botij├úo de g├ís  P13	1	140	c3fdb35e-b0d6-4317-90e0-c54ac27c7e15	8225b508-fecb-4b23-b774-304489d32fa2
8b05b410-79dd-44da-ad35-ccce259fcdbb	Botij├úo de g├ís  P13	1	140	c3fdb35e-b0d6-4317-90e0-c54ac27c7e15	ad248838-9ad6-477f-81b7-ae21f67dfa73
beb30fe1-8b4a-4997-ad5a-fdf537203b50	Botij├úo de g├ís  P13	1	140	c3fdb35e-b0d6-4317-90e0-c54ac27c7e15	3415dfa8-7ffb-4a15-af79-32de48e4b38c
e65f30bd-ea2d-4859-bc89-a47c356ff6dd	Gal├úo de ├ígua 20 L	2	15	22be1807-edbc-434e-8cb8-e3146fbb07d8	3415dfa8-7ffb-4a15-af79-32de48e4b38c
a2d575d6-0322-468c-af74-c40560c5980b	Botij├úo de g├ís  P13	1	140	c3fdb35e-b0d6-4317-90e0-c54ac27c7e15	2771c0c3-1195-436e-8cdc-bd10744b5763
d7907203-9cd5-4c5f-b9a9-a4a4f1e40812	Botij├úo de g├ís  P13	1	140	c3fdb35e-b0d6-4317-90e0-c54ac27c7e15	f74616e9-9dc9-4d48-abac-89470f3272b3
a46dd2e4-b9ba-43cf-978a-2111313f54b4	Botij├úo de g├ís  P13	1	140	c3fdb35e-b0d6-4317-90e0-c54ac27c7e15	31fd2d1b-f1e6-4675-913d-d5281356d652
b19ca5b8-da72-4fbc-b469-0ef638ceb15d	Botij├úo de g├ís  P13	1	140	c3fdb35e-b0d6-4317-90e0-c54ac27c7e15	7c9baa86-30d2-478f-ae53-8efa8df79e31
d85bca7f-96e1-4f71-89ae-3ed29cabce8c	Botij├úo de g├ís  P13	1	140	c3fdb35e-b0d6-4317-90e0-c54ac27c7e15	4510bfd1-7f06-4072-be52-3bd155b8bd90
22004ac6-252b-425e-8ead-092adcb07bee	Botij├úo de g├ís  P13	1	140	c3fdb35e-b0d6-4317-90e0-c54ac27c7e15	8aec5427-18aa-46b7-ac79-cde5da3c9dd1
4ba66723-ce06-4e3d-84df-404106e29549	Gal├úo de ├ígua 20 L	1	15	22be1807-edbc-434e-8cb8-e3146fbb07d8	d28d89bd-f19e-4603-8aaf-7cb4074cb6b4
318b85e1-781e-47f1-b705-11c671d4fff7	Botij├úo de g├ís  P13	1	140	c3fdb35e-b0d6-4317-90e0-c54ac27c7e15	bdbdff91-5827-4a20-8fcc-07e178c8b272
\.


--
-- Data for Name: orders_status; Type: TABLE DATA; Schema: orders; Owner: postgres
--

COPY orders.orders_status (order_status_id, name, active, created_by, created_at, update_by, updated_at) FROM stdin;
d71cb62a-28dd-44a8-a008-9d7d7d1af810	Pendente	t	e92f9c8d-3665-49bb-a1a3-2658e9b9361e	2023-06-02 08:00:49.665149	\N	\N
c1a38ac0-37d8-450a-aa91-d297e5c97be3	Recusado	t	e92f9c8d-3665-49bb-a1a3-2658e9b9361e	2023-06-02 08:00:49.665149	\N	\N
c0d9b129-b78b-4d7e-afad-cc378d374e5e	Aceito	t	e92f9c8d-3665-49bb-a1a3-2658e9b9361e	2023-06-02 08:00:49.665149	\N	\N
332de128-06c2-46ba-8d98-ba1df57d88ad	Em andamento	t	e92f9c8d-3665-49bb-a1a3-2658e9b9361e	2023-06-02 08:00:49.665149	\N	\N
e04621d0-3997-4c69-9054-a10257602a29	Conclu├¡do	t	e92f9c8d-3665-49bb-a1a3-2658e9b9361e	2023-06-02 08:00:49.665149	\N	\N
4840f990-fc9e-4048-97f3-19e105b9aec5	Cancelado pelo cliente	t	e92f9c8d-3665-49bb-a1a3-2658e9b9361e	2023-06-02 08:00:49.665149	\N	\N
0cff5cdc-6253-4e59-9753-6cde54a33e58	Aguardando pagamento	t	e92f9c8d-3665-49bb-a1a3-2658e9b9361e	2023-08-17 08:34:54.268	\N	\N
36eebcfb-9758-4fdc-ad95-bcdf70703c4a	Pago	t	e92f9c8d-3665-49bb-a1a3-2658e9b9361e	2023-08-24 14:26:44.37	\N	\N
\.


--
-- Data for Name: orders_status_history; Type: TABLE DATA; Schema: orders; Owner: postgres
--

COPY orders.orders_status_history (order_status_history_id, order_id, order_status_id, created_by, created_at, updated_by, updated_at) FROM stdin;
05721042-3aca-434f-a0d0-4b832fd1d2b5	a4e080bd-d6c4-4b0b-b824-f4ff8dcbada3	d71cb62a-28dd-44a8-a008-9d7d7d1af810	7071c9e2-ce05-42c2-9ffc-73cb6d16148e	2024-09-12 19:45:54.400324	\N	\N
9255f3bf-d016-4de8-8498-d848cd5cfeed	a4e080bd-d6c4-4b0b-b824-f4ff8dcbada3	c0d9b129-b78b-4d7e-afad-cc378d374e5e	f78a4a48-1be2-45aa-a486-84d31d0fd665	2024-09-12 19:46:49.617686	\N	\N
e56561a2-b232-4fd5-84a5-3a57e9269f90	a4e080bd-d6c4-4b0b-b824-f4ff8dcbada3	332de128-06c2-46ba-8d98-ba1df57d88ad	f78a4a48-1be2-45aa-a486-84d31d0fd665	2024-09-12 19:46:53.367192	\N	\N
d6e02234-11bf-49e8-adbe-23218904d1d4	a4e080bd-d6c4-4b0b-b824-f4ff8dcbada3	e04621d0-3997-4c69-9054-a10257602a29	f78a4a48-1be2-45aa-a486-84d31d0fd665	2024-09-12 19:46:55.940391	\N	\N
96233d42-303d-4795-92ec-3846d9a3baa8	29a5bdf0-85b1-47be-acde-5e6b75eb9e15	0cff5cdc-6253-4e59-9753-6cde54a33e58	7071c9e2-ce05-42c2-9ffc-73cb6d16148e	2024-09-12 21:35:00.242535	\N	\N
ae091878-adf1-4bcd-b24c-43d8750f3de1	2e57fd30-7c82-45cc-94e3-1ddccd7680f5	d71cb62a-28dd-44a8-a008-9d7d7d1af810	7071c9e2-ce05-42c2-9ffc-73cb6d16148e	2024-09-12 21:44:02.537781	\N	\N
5169e3bb-d588-4e1a-a12e-07306b880373	2b47442c-2ce6-4791-bf19-ac37930ecfeb	0cff5cdc-6253-4e59-9753-6cde54a33e58	7071c9e2-ce05-42c2-9ffc-73cb6d16148e	2024-09-25 14:12:13.555404	\N	\N
a7a4869e-f014-495e-acd7-dcfdeeb0a1c4	aceb7022-aced-4e11-ba71-1c75fe8130f4	d71cb62a-28dd-44a8-a008-9d7d7d1af810	7071c9e2-ce05-42c2-9ffc-73cb6d16148e	2024-09-25 14:16:15.017824	\N	\N
c67ba21e-821e-4931-a0fb-62a9c3cc5e90	aceb7022-aced-4e11-ba71-1c75fe8130f4	4840f990-fc9e-4048-97f3-19e105b9aec5	ac506204-19fd-480b-a622-142d74f56538	2024-09-25 14:16:26.305433	\N	\N
2045e243-79bd-41d9-a4d0-9823a1fce989	c92da6c8-5181-4ee3-8062-98466d5b4348	0cff5cdc-6253-4e59-9753-6cde54a33e58	5714ee22-66e2-4fe0-8f0e-4be4652dcbed	2024-10-18 21:20:51.483129	\N	\N
edd136c4-073b-4347-8bb6-5ff9151560c9	22ba0fbd-1d80-418a-af70-9445425b205a	d71cb62a-28dd-44a8-a008-9d7d7d1af810	5714ee22-66e2-4fe0-8f0e-4be4652dcbed	2024-10-18 21:36:29.656406	\N	\N
3adddc43-7604-415b-ab92-7f29e834f28b	13e8c878-3b5d-4fe3-b7a3-822b994f5e08	0cff5cdc-6253-4e59-9753-6cde54a33e58	5714ee22-66e2-4fe0-8f0e-4be4652dcbed	2024-10-18 21:39:18.299014	\N	\N
cbebd258-31c2-460e-820b-308283efec37	ac3539b1-40e8-40ed-8cce-f0675d071e59	d71cb62a-28dd-44a8-a008-9d7d7d1af810	5af9a155-8d87-4d31-a1d2-552056257c26	2024-10-19 19:26:34.076862	\N	\N
cba694cc-fbe4-4ea1-b9b8-6258b2262075	ac3539b1-40e8-40ed-8cce-f0675d071e59	c0d9b129-b78b-4d7e-afad-cc378d374e5e	35332c5f-17df-4909-ad5d-c9b3db146aa5	2024-10-19 19:27:05.789862	\N	\N
1fe94033-6d06-4191-9b5f-7de4d30184ce	ac3539b1-40e8-40ed-8cce-f0675d071e59	332de128-06c2-46ba-8d98-ba1df57d88ad	35332c5f-17df-4909-ad5d-c9b3db146aa5	2024-10-19 19:27:44.076268	\N	\N
cbb19ff9-aa6d-4a48-ac91-de940a3c508c	ac3539b1-40e8-40ed-8cce-f0675d071e59	e04621d0-3997-4c69-9054-a10257602a29	35332c5f-17df-4909-ad5d-c9b3db146aa5	2024-10-19 19:29:24.267301	\N	\N
48835ab0-e890-4910-863f-4029db61a768	9c53f225-953e-4846-8fe7-ef65ebefa5d9	d71cb62a-28dd-44a8-a008-9d7d7d1af810	5af9a155-8d87-4d31-a1d2-552056257c26	2024-10-19 19:49:20.599307	\N	\N
b766814e-3bc7-41fd-a0ff-206b7aa0da11	9c53f225-953e-4846-8fe7-ef65ebefa5d9	c0d9b129-b78b-4d7e-afad-cc378d374e5e	35332c5f-17df-4909-ad5d-c9b3db146aa5	2024-10-19 19:50:02.056191	\N	\N
9e21e5ae-69bc-48e1-9499-80b2e08b1718	4b4e0425-e0fc-4563-bf8d-7ca2e76345fe	d71cb62a-28dd-44a8-a008-9d7d7d1af810	5af9a155-8d87-4d31-a1d2-552056257c26	2024-10-19 19:51:06.640438	\N	\N
76e1179e-cc53-4cc2-9475-258685ed9cb1	9c53f225-953e-4846-8fe7-ef65ebefa5d9	332de128-06c2-46ba-8d98-ba1df57d88ad	35332c5f-17df-4909-ad5d-c9b3db146aa5	2024-10-19 19:51:18.885579	\N	\N
0b3085da-026e-40be-8661-4d69d10e5122	4b4e0425-e0fc-4563-bf8d-7ca2e76345fe	c0d9b129-b78b-4d7e-afad-cc378d374e5e	35332c5f-17df-4909-ad5d-c9b3db146aa5	2024-10-19 19:51:21.202723	\N	\N
df02500d-c258-4881-94f6-42bb2cbec4e5	9c53f225-953e-4846-8fe7-ef65ebefa5d9	c1a38ac0-37d8-450a-aa91-d297e5c97be3	35332c5f-17df-4909-ad5d-c9b3db146aa5	2024-10-19 19:51:53.941004	\N	\N
a134e9e0-c296-4030-af23-79eb7caf63f0	b08a7f55-7fe7-4342-a400-85bdebbe2950	d71cb62a-28dd-44a8-a008-9d7d7d1af810	5714ee22-66e2-4fe0-8f0e-4be4652dcbed	2025-01-24 18:40:03.077969	\N	\N
825d3361-f2db-4366-85c8-afbf1c7fcf58	25c50978-b904-49e4-b804-25874a26fd92	d71cb62a-28dd-44a8-a008-9d7d7d1af810	7071c9e2-ce05-42c2-9ffc-73cb6d16148e	2025-01-30 18:48:08.762523	\N	\N
8f0f830d-cb36-40b0-a08d-dda7bd8ad1a6	25c50978-b904-49e4-b804-25874a26fd92	c0d9b129-b78b-4d7e-afad-cc378d374e5e	ae565ea8-440c-4063-9885-3192863fd0b6	2025-01-30 18:51:23.166269	\N	\N
21d49ef2-0b1c-4e0f-994f-4cde7f779faa	25c50978-b904-49e4-b804-25874a26fd92	332de128-06c2-46ba-8d98-ba1df57d88ad	ae565ea8-440c-4063-9885-3192863fd0b6	2025-01-30 18:51:38.09014	\N	\N
7fcaae40-87b0-4e83-9542-edac515b4109	25c50978-b904-49e4-b804-25874a26fd92	e04621d0-3997-4c69-9054-a10257602a29	ae565ea8-440c-4063-9885-3192863fd0b6	2025-01-30 18:51:46.499547	\N	\N
bd38ed1a-14d9-4fe3-97a5-e87752c3f058	6fcc0770-25b3-437d-b162-7959f2e3cda8	d71cb62a-28dd-44a8-a008-9d7d7d1af810	7071c9e2-ce05-42c2-9ffc-73cb6d16148e	2025-01-30 18:53:05.395234	\N	\N
a266e001-aba7-4141-82d9-1db2f0b01567	6fcc0770-25b3-437d-b162-7959f2e3cda8	c0d9b129-b78b-4d7e-afad-cc378d374e5e	ae565ea8-440c-4063-9885-3192863fd0b6	2025-01-30 18:53:19.582278	\N	\N
83650d27-43c5-48c5-b5c7-2a6a1b8ad90b	6fcc0770-25b3-437d-b162-7959f2e3cda8	332de128-06c2-46ba-8d98-ba1df57d88ad	ae565ea8-440c-4063-9885-3192863fd0b6	2025-01-30 18:54:47.60694	\N	\N
caef74c7-3485-4dfb-b42d-bb6ca56dbe85	6fcc0770-25b3-437d-b162-7959f2e3cda8	c1a38ac0-37d8-450a-aa91-d297e5c97be3	ae565ea8-440c-4063-9885-3192863fd0b6	2025-01-30 18:55:59.708682	\N	\N
eb41fc00-8b63-41da-a688-c4ae8e2485f3	f3f89699-ef53-486f-9d8f-017769a583b8	d71cb62a-28dd-44a8-a008-9d7d7d1af810	7071c9e2-ce05-42c2-9ffc-73cb6d16148e	2025-01-31 02:45:54.515994	\N	\N
13906044-8f44-470d-ad5b-5cec8a396ce8	f3f89699-ef53-486f-9d8f-017769a583b8	4840f990-fc9e-4048-97f3-19e105b9aec5	ac506204-19fd-480b-a622-142d74f56538	2025-01-31 02:49:34.126733	\N	\N
5e9c4021-a016-4e19-a7cf-c121581c4535	38fb7db8-d759-48ad-8615-d800b6ae1199	d71cb62a-28dd-44a8-a008-9d7d7d1af810	7071c9e2-ce05-42c2-9ffc-73cb6d16148e	2025-01-31 13:22:05.740519	\N	\N
e554c879-9bde-4335-8021-7c0c9fb380c6	38fb7db8-d759-48ad-8615-d800b6ae1199	c0d9b129-b78b-4d7e-afad-cc378d374e5e	ae565ea8-440c-4063-9885-3192863fd0b6	2025-01-31 13:22:41.535176	\N	\N
fb4ce3c5-1872-40a7-8a0d-7dacde37548f	38fb7db8-d759-48ad-8615-d800b6ae1199	332de128-06c2-46ba-8d98-ba1df57d88ad	ae565ea8-440c-4063-9885-3192863fd0b6	2025-01-31 13:22:58.843202	\N	\N
5aab3dc1-7f4a-4df2-b5f0-8b5feb82b7d3	38fb7db8-d759-48ad-8615-d800b6ae1199	c1a38ac0-37d8-450a-aa91-d297e5c97be3	ae565ea8-440c-4063-9885-3192863fd0b6	2025-01-31 13:24:24.642005	\N	\N
8dd86875-1888-4db8-aa7e-61d841ae74c1	e2e25c6c-84eb-4d64-9ca1-66fd633a93d8	d71cb62a-28dd-44a8-a008-9d7d7d1af810	7071c9e2-ce05-42c2-9ffc-73cb6d16148e	2025-01-31 15:48:30.875101	\N	\N
0ce681c5-339d-4c32-a04d-3e111ca1b00e	c6ba6696-f485-4a8c-b2e8-5c3ba7b5becb	d71cb62a-28dd-44a8-a008-9d7d7d1af810	7071c9e2-ce05-42c2-9ffc-73cb6d16148e	2025-01-31 15:56:10.15344	\N	\N
5cb4148e-0022-4d20-8995-fff44d146387	c6ba6696-f485-4a8c-b2e8-5c3ba7b5becb	c0d9b129-b78b-4d7e-afad-cc378d374e5e	ae565ea8-440c-4063-9885-3192863fd0b6	2025-01-31 17:59:34.005427	\N	\N
a3273c9e-1c6b-4b0a-8512-c49db4cbbb6e	e2e25c6c-84eb-4d64-9ca1-66fd633a93d8	332de128-06c2-46ba-8d98-ba1df57d88ad	ae565ea8-440c-4063-9885-3192863fd0b6	2025-01-31 17:59:40.572923	\N	\N
2fe7cb9b-fe8c-4bec-aa9a-627608ac6be2	e2e25c6c-84eb-4d64-9ca1-66fd633a93d8	e04621d0-3997-4c69-9054-a10257602a29	ae565ea8-440c-4063-9885-3192863fd0b6	2025-01-31 17:59:58.338284	\N	\N
4b8e9c09-fffa-4652-8670-657dd9e00a24	e22b8380-0e1e-4cd0-bd59-612531377798	0cff5cdc-6253-4e59-9753-6cde54a33e58	84713a3f-0af7-41ce-aae4-fc17f8be6bad	2025-01-31 18:10:03.278937	\N	\N
81d7900f-b263-4e97-bc36-7d8b2d7de8cb	e22b8380-0e1e-4cd0-bd59-612531377798	d71cb62a-28dd-44a8-a008-9d7d7d1af810	84713a3f-0af7-41ce-aae4-fc17f8be6bad	2025-01-31 18:11:00.014253	\N	\N
de9d062b-0e8f-4d09-8db3-5d2d537ae5dc	e22b8380-0e1e-4cd0-bd59-612531377798	4840f990-fc9e-4048-97f3-19e105b9aec5	c1303a50-8e09-4d41-b314-b78e0dfa0b43	2025-01-31 18:12:09.559668	\N	\N
f3c7e7f6-b111-48c7-b01e-8e71afc07eac	b8255007-9755-4006-8414-1ed9264fe686	d71cb62a-28dd-44a8-a008-9d7d7d1af810	84713a3f-0af7-41ce-aae4-fc17f8be6bad	2025-01-31 18:12:54.684338	\N	\N
2c091843-d968-4eef-aa05-aba7c1406e79	b8255007-9755-4006-8414-1ed9264fe686	c0d9b129-b78b-4d7e-afad-cc378d374e5e	ae565ea8-440c-4063-9885-3192863fd0b6	2025-01-31 18:14:37.545366	\N	\N
b19f499d-1eba-40d4-8de5-f63d3b86e084	b8255007-9755-4006-8414-1ed9264fe686	332de128-06c2-46ba-8d98-ba1df57d88ad	ae565ea8-440c-4063-9885-3192863fd0b6	2025-01-31 18:14:59.633606	\N	\N
fe116523-afb9-49c2-b5c0-3f6dc9f2b3e5	b8255007-9755-4006-8414-1ed9264fe686	e04621d0-3997-4c69-9054-a10257602a29	ae565ea8-440c-4063-9885-3192863fd0b6	2025-01-31 18:17:21.254908	\N	\N
ce75c077-2a87-44a6-830d-66198e2ff57d	8a1b853c-f019-4cf7-9df4-5e81479b7500	d71cb62a-28dd-44a8-a008-9d7d7d1af810	6398c87e-08be-46c9-b3cb-02f1c6de27f8	2025-02-01 16:58:33.139229	\N	\N
f6f045c9-c493-49b9-8aa4-723eee5a97f0	8a1b853c-f019-4cf7-9df4-5e81479b7500	c0d9b129-b78b-4d7e-afad-cc378d374e5e	ae565ea8-440c-4063-9885-3192863fd0b6	2025-02-01 16:59:23.90293	\N	\N
d9ffeb82-8ae3-4318-aa8f-78eff67eb956	8a1b853c-f019-4cf7-9df4-5e81479b7500	332de128-06c2-46ba-8d98-ba1df57d88ad	ae565ea8-440c-4063-9885-3192863fd0b6	2025-02-01 16:59:43.366136	\N	\N
4a7a8f3f-1233-4ddc-97dd-16d16b13ae05	8a1b853c-f019-4cf7-9df4-5e81479b7500	e04621d0-3997-4c69-9054-a10257602a29	ae565ea8-440c-4063-9885-3192863fd0b6	2025-02-01 17:00:46.10413	\N	\N
951f23cb-efa4-4fae-926f-a273c59e4bf9	3a3dcf01-9ae9-41b1-a856-6213e5203ee2	d71cb62a-28dd-44a8-a008-9d7d7d1af810	84713a3f-0af7-41ce-aae4-fc17f8be6bad	2025-02-01 17:24:08.690221	\N	\N
3d994567-7e00-4d6a-ae63-6f9378bbfbe6	2e161bbd-0339-44b3-9824-289c342803be	d71cb62a-28dd-44a8-a008-9d7d7d1af810	84713a3f-0af7-41ce-aae4-fc17f8be6bad	2025-02-02 16:39:59.642332	\N	\N
af2037a4-c8af-45ef-b106-ee10b83aa524	2e161bbd-0339-44b3-9824-289c342803be	c0d9b129-b78b-4d7e-afad-cc378d374e5e	ae565ea8-440c-4063-9885-3192863fd0b6	2025-02-02 21:35:27.897891	\N	\N
714792e3-c72a-45c9-b89e-9c0f100b75ce	2e161bbd-0339-44b3-9824-289c342803be	332de128-06c2-46ba-8d98-ba1df57d88ad	ae565ea8-440c-4063-9885-3192863fd0b6	2025-02-02 21:35:45.826496	\N	\N
7e1b7737-a9d6-4f81-9e59-1bc4914d2916	2e161bbd-0339-44b3-9824-289c342803be	e04621d0-3997-4c69-9054-a10257602a29	ae565ea8-440c-4063-9885-3192863fd0b6	2025-02-02 21:37:31.325976	\N	\N
e4af7088-2c23-4eb6-9e8b-234caf9068c4	cd59c5bf-e966-497a-a404-7570e1ea8218	0cff5cdc-6253-4e59-9753-6cde54a33e58	9883e2f8-b0f2-43d3-bdbe-d2d601180eb0	2025-02-04 17:10:07.380651	\N	\N
d4bda139-5cc9-45c9-ba82-048f03f95d17	8225b508-fecb-4b23-b774-304489d32fa2	d71cb62a-28dd-44a8-a008-9d7d7d1af810	84713a3f-0af7-41ce-aae4-fc17f8be6bad	2025-02-04 17:12:40.906399	\N	\N
3ab9f2ee-7342-4c40-97aa-c780becc7aff	8225b508-fecb-4b23-b774-304489d32fa2	c0d9b129-b78b-4d7e-afad-cc378d374e5e	ae565ea8-440c-4063-9885-3192863fd0b6	2025-02-04 17:12:55.293419	\N	\N
c851309d-9265-4944-9f6f-86a29ecccdba	8225b508-fecb-4b23-b774-304489d32fa2	332de128-06c2-46ba-8d98-ba1df57d88ad	ae565ea8-440c-4063-9885-3192863fd0b6	2025-02-04 22:17:12.805128	\N	\N
6a7d674c-2274-45c8-ade3-f1bfe52af7d3	8225b508-fecb-4b23-b774-304489d32fa2	c1a38ac0-37d8-450a-aa91-d297e5c97be3	ae565ea8-440c-4063-9885-3192863fd0b6	2025-02-04 22:17:17.792158	\N	\N
0313dcde-7855-4efe-a586-540e33c9d20c	ad248838-9ad6-477f-81b7-ae21f67dfa73	d71cb62a-28dd-44a8-a008-9d7d7d1af810	7071c9e2-ce05-42c2-9ffc-73cb6d16148e	2025-02-04 22:20:54.983794	\N	\N
8f3d5f7a-4b39-4a6d-85c6-3cfa6ccff244	ad248838-9ad6-477f-81b7-ae21f67dfa73	c0d9b129-b78b-4d7e-afad-cc378d374e5e	ae565ea8-440c-4063-9885-3192863fd0b6	2025-02-04 22:21:10.479609	\N	\N
59c3e0f0-4922-4cee-95cf-f2bd9983aa01	ad248838-9ad6-477f-81b7-ae21f67dfa73	332de128-06c2-46ba-8d98-ba1df57d88ad	ae565ea8-440c-4063-9885-3192863fd0b6	2025-02-04 22:21:23.467174	\N	\N
f189311b-b9f9-4080-b340-50acb98ca92b	ad248838-9ad6-477f-81b7-ae21f67dfa73	c1a38ac0-37d8-450a-aa91-d297e5c97be3	ae565ea8-440c-4063-9885-3192863fd0b6	2025-02-04 22:22:11.739635	\N	\N
cb3f87c7-5a7e-4de9-b855-dd6c5b916a0a	3415dfa8-7ffb-4a15-af79-32de48e4b38c	d71cb62a-28dd-44a8-a008-9d7d7d1af810	7071c9e2-ce05-42c2-9ffc-73cb6d16148e	2025-02-04 22:38:40.493965	\N	\N
5774f2e6-c907-4d21-b311-75c3dc1a71ce	3415dfa8-7ffb-4a15-af79-32de48e4b38c	c0d9b129-b78b-4d7e-afad-cc378d374e5e	ae565ea8-440c-4063-9885-3192863fd0b6	2025-02-04 22:39:03.536493	\N	\N
99707a53-9a69-47bd-88ae-2340078906ae	3415dfa8-7ffb-4a15-af79-32de48e4b38c	332de128-06c2-46ba-8d98-ba1df57d88ad	ae565ea8-440c-4063-9885-3192863fd0b6	2025-02-04 22:39:29.456363	\N	\N
880d1485-fc6d-40ff-ac16-b50de18945ee	3415dfa8-7ffb-4a15-af79-32de48e4b38c	e04621d0-3997-4c69-9054-a10257602a29	ae565ea8-440c-4063-9885-3192863fd0b6	2025-02-04 22:40:08.434585	\N	\N
2ad00b34-dcf9-4e14-ac73-378e6cc250d2	2771c0c3-1195-436e-8cdc-bd10744b5763	d71cb62a-28dd-44a8-a008-9d7d7d1af810	7071c9e2-ce05-42c2-9ffc-73cb6d16148e	2025-02-22 17:44:51.534478	\N	\N
2643a484-760c-4261-92ed-973a5b896c1e	2771c0c3-1195-436e-8cdc-bd10744b5763	c0d9b129-b78b-4d7e-afad-cc378d374e5e	ae565ea8-440c-4063-9885-3192863fd0b6	2025-02-22 17:47:27.750226	\N	\N
51a10c01-17f1-4423-bb2d-29e155a339e4	2771c0c3-1195-436e-8cdc-bd10744b5763	332de128-06c2-46ba-8d98-ba1df57d88ad	ae565ea8-440c-4063-9885-3192863fd0b6	2025-02-22 17:47:47.868197	\N	\N
e4677c4c-f9ee-4f7e-8af2-b375a1070e81	2771c0c3-1195-436e-8cdc-bd10744b5763	e04621d0-3997-4c69-9054-a10257602a29	ae565ea8-440c-4063-9885-3192863fd0b6	2025-02-22 17:50:01.417866	\N	\N
e7a11b36-f3b5-4334-8112-8e184c022988	f74616e9-9dc9-4d48-abac-89470f3272b3	d71cb62a-28dd-44a8-a008-9d7d7d1af810	84713a3f-0af7-41ce-aae4-fc17f8be6bad	2025-03-04 16:31:37.84049	\N	\N
e5c63a74-c845-4b41-9770-f6c34080244c	f74616e9-9dc9-4d48-abac-89470f3272b3	c0d9b129-b78b-4d7e-afad-cc378d374e5e	ae565ea8-440c-4063-9885-3192863fd0b6	2025-03-04 16:31:50.752673	\N	\N
d89b9bb3-2bb0-468b-aade-f0ac45c7f0a7	f74616e9-9dc9-4d48-abac-89470f3272b3	332de128-06c2-46ba-8d98-ba1df57d88ad	ae565ea8-440c-4063-9885-3192863fd0b6	2025-03-04 16:32:20.344858	\N	\N
1e237fa5-1082-4baf-95a2-5d55ac542872	f74616e9-9dc9-4d48-abac-89470f3272b3	e04621d0-3997-4c69-9054-a10257602a29	ae565ea8-440c-4063-9885-3192863fd0b6	2025-03-04 16:33:12.004893	\N	\N
b83ec5a3-fa8c-44ba-8818-3c21e8610293	31fd2d1b-f1e6-4675-913d-d5281356d652	d71cb62a-28dd-44a8-a008-9d7d7d1af810	7071c9e2-ce05-42c2-9ffc-73cb6d16148e	2025-03-17 20:59:16.505155	\N	\N
51c41fb5-4c96-4347-91cd-ef2bbd942221	7c9baa86-30d2-478f-ae53-8efa8df79e31	d71cb62a-28dd-44a8-a008-9d7d7d1af810	7071c9e2-ce05-42c2-9ffc-73cb6d16148e	2025-03-17 21:30:59.873848	\N	\N
e5d992cd-7f56-485e-85cf-e0ee45577551	4510bfd1-7f06-4072-be52-3bd155b8bd90	d71cb62a-28dd-44a8-a008-9d7d7d1af810	7071c9e2-ce05-42c2-9ffc-73cb6d16148e	2025-03-17 21:31:01.30993	\N	\N
dcf53cf8-70c9-4051-b03f-1bbd972c9b36	4510bfd1-7f06-4072-be52-3bd155b8bd90	c0d9b129-b78b-4d7e-afad-cc378d374e5e	ae565ea8-440c-4063-9885-3192863fd0b6	2025-03-17 21:42:01.741236	\N	\N
f5730da5-f8e6-428c-86bd-907945af21ee	8aec5427-18aa-46b7-ac79-cde5da3c9dd1	d71cb62a-28dd-44a8-a008-9d7d7d1af810	7071c9e2-ce05-42c2-9ffc-73cb6d16148e	2025-06-08 23:48:57.606406	\N	\N
f0b5f95a-251e-4d97-a349-3dfe92c52572	d28d89bd-f19e-4603-8aaf-7cb4074cb6b4	d71cb62a-28dd-44a8-a008-9d7d7d1af810	7071c9e2-ce05-42c2-9ffc-73cb6d16148e	2025-07-02 21:23:27.302963	\N	\N
4ad0c028-957f-4428-a30e-0f497b8ad910	d28d89bd-f19e-4603-8aaf-7cb4074cb6b4	c0d9b129-b78b-4d7e-afad-cc378d374e5e	ae565ea8-440c-4063-9885-3192863fd0b6	2025-07-02 21:23:41.685789	\N	\N
06ca20f2-6180-4dde-ae38-01f186d0d4d4	d28d89bd-f19e-4603-8aaf-7cb4074cb6b4	332de128-06c2-46ba-8d98-ba1df57d88ad	ae565ea8-440c-4063-9885-3192863fd0b6	2025-07-02 21:23:43.825524	\N	\N
ba33b031-dd8e-4e30-855d-b27dbf93c98a	d28d89bd-f19e-4603-8aaf-7cb4074cb6b4	e04621d0-3997-4c69-9054-a10257602a29	ae565ea8-440c-4063-9885-3192863fd0b6	2025-07-02 21:23:45.71964	\N	\N
c784559e-12b9-4782-a9ad-174e45e79a47	bdbdff91-5827-4a20-8fcc-07e178c8b272	d71cb62a-28dd-44a8-a008-9d7d7d1af810	7071c9e2-ce05-42c2-9ffc-73cb6d16148e	2025-07-02 23:36:53.798824	\N	\N
4e9a0bf9-ee7f-4ee5-b8a1-76c924fdf4bd	bdbdff91-5827-4a20-8fcc-07e178c8b272	c0d9b129-b78b-4d7e-afad-cc378d374e5e	ae565ea8-440c-4063-9885-3192863fd0b6	2025-07-02 23:37:03.181052	\N	\N
4975c0da-ced0-45ed-8f8a-3487f1030578	bdbdff91-5827-4a20-8fcc-07e178c8b272	332de128-06c2-46ba-8d98-ba1df57d88ad	ae565ea8-440c-4063-9885-3192863fd0b6	2025-07-02 23:37:20.29028	\N	\N
0ce5c746-09c1-4397-85e0-c7426d4bc8a1	bdbdff91-5827-4a20-8fcc-07e178c8b272	c1a38ac0-37d8-450a-aa91-d297e5c97be3	ae565ea8-440c-4063-9885-3192863fd0b6	2025-07-02 23:40:22.988099	\N	\N
\.


--
-- Data for Name: shipping_company; Type: TABLE DATA; Schema: orders; Owner: postgres
--

COPY orders.shipping_company (shipping_company_id, company_name, document, address_id) FROM stdin;
7e1386fa-c4d7-4c11-9489-a3068996bac0	transportadora mario atualizado	45312393000000	40cb3c30-9cc1-4e6f-93ae-fd856c3b85e9
\.


--
-- Data for Name: address; Type: TABLE DATA; Schema: partner; Owner: postgres
--

COPY partner.address (address_id, street, number, complement, district, city, state, zip_code, active, created_at, updated_at, latitude, longitude, branch_id, created_by, updated_by) FROM stdin;
ad85a213-d753-4a66-849f-09ce62c39060	Estrada dos Galdinos	1160	teste	Jardim Barbacena	Cotia	SP	06710-400	t	2024-12-13 19:45:44.482694	2025-01-30 18:22:10.528778	-23.6021568	-46.823858	c1096081-fa43-4681-a242-c014a916914a	e92f9c8d-3665-49bb-a1a3-2658e9b9361e	aaa2ae61-b95b-472c-9426-61a3297c2904
9b47bbde-77d3-4018-933a-759949621392	Rua Roberto Rowley Mendes	10		Boa Viagem	Niter├│i	RJ	24210310	t	2025-02-04 22:15:20.923009	\N	-22.9077759	-43.1301287	fc51dc14-dc03-496e-8c95-d44cb7e35d21	00000000-0000-0000-0000-000000000000	\N
451e07b3-ecbb-44b1-aabc-24adc47969c0	Avenida Jos├® Cardoso Alc├óntara	55		Cidade Universit├íria	Juazeiro do Norte	CE	63048245	t	2025-03-04 16:29:00.122362	\N	-7.262541400000001	-39.3101243	3cb508e3-618d-4eed-ac11-7eee9484613c	00000000-0000-0000-0000-000000000000	\N
\.


--
-- Data for Name: bank_details; Type: TABLE DATA; Schema: partner; Owner: postgres
--

COPY partner.bank_details (bank_details_id, partner_id, bank, agency, account_number, active, created_by, created_at, updated_by, updated_at, account_id) FROM stdin;
\.


--
-- Data for Name: branch; Type: TABLE DATA; Schema: partner; Owner: postgres
--

COPY partner.branch (branch_id, branch_name, document, partner_id, phone, created_by, created_at, updated_by, updated_at, active) FROM stdin;
c1096081-fa43-4681-a242-c014a916914a	Emmanuel Menezes	35712298864	ae565ea8-440c-4063-9885-3192863fd0b6	11998650135	e92f9c8d-3665-49bb-a1a3-2658e9b9361e	2024-12-13 19:45:44.482694	aaa2ae61-b95b-472c-9426-61a3297c2904	2025-01-30 18:22:10.528778	f
fc51dc14-dc03-496e-8c95-d44cb7e35d21	Boa viagem	75779676887	ae565ea8-440c-4063-9885-3192863fd0b6	11973892831	00000000-0000-0000-0000-000000000000	2025-02-04 22:15:20.923009	\N	\N	t
3cb508e3-618d-4eed-ac11-7eee9484613c	Nova Betania	34576156837	ae565ea8-440c-4063-9885-3192863fd0b6	11977338511	00000000-0000-0000-0000-000000000000	2025-03-04 16:29:00.122362	\N	\N	t
\.


--
-- Data for Name: partner; Type: TABLE DATA; Schema: partner; Owner: postgres
--

COPY partner.partner (partner_id, legal_name, fantasy_name, document, email, phone_number, active, created_at, updated_at, user_id, created_by, admin_id, updated_by, identifier, service_fee, card_fee) FROM stdin;
ae565ea8-440c-4063-9885-3192863fd0b6	Emmanuel Menezes	Emmanuel Menezes	35712298864	emmanuel.s.menezes+10@gmail.com	11998650135	t	2024-12-13 19:45:44.482694	\N	aaa2ae61-b95b-472c-9426-61a3297c2904	e92f9c8d-3665-49bb-a1a3-2658e9b9361e	e92f9c8d-3665-49bb-a1a3-2658e9b9361e	\N	27	0.05	0.03
\.


--
-- Data for Name: style_partner; Type: TABLE DATA; Schema: partner; Owner: postgres
--

COPY partner.style_partner (style_partner_id, admin_id, lighter, light, main, dark, darker, contrasttext, created_by, created_at, updated_by, updated_at, logo) FROM stdin;
7f88e4c3-446c-41cd-a5af-49d9eecf8cee	e92f9c8d-3665-49bb-a1a3-2658e9b9361e	#edd4a6	#ec7610	#ffa500	#ff6d00	#f9b979	#694504	e92f9c8d-3665-49bb-a1a3-2658e9b9361e	2024-09-06 21:02:28.472185	e92f9c8d-3665-49bb-a1a3-2658e9b9361e	2025-11-01 12:43:02.806092	https://minio.laveai.app:9000/logopartner/Group%2014.png?AWSAccessKeyId=minio&Expires=33263302128&Signature=mBTrZoPOUucjQ0suLqAI6koh6Us%3D
\.


--
-- Data for Name: report; Type: TABLE DATA; Schema: report; Owner: postgres
--

COPY report.report (report_id, name, created_by, created_at, updated_by, updated_at, active, description) FROM stdin;
\.


--
-- Data for Name: report_filter; Type: TABLE DATA; Schema: report; Owner: postgres
--

COPY report.report_filter (report_filter_id, filter_name, report_id, created_by, created_at, updated_by, updated_at) FROM stdin;
\.


--
-- Data for Name: branch_rating; Type: TABLE DATA; Schema: reputation; Owner: postgres
--

COPY reputation.branch_rating (branch_rating_id, rating_id, branch_id, created_by, created_at, updated_by, update_at) FROM stdin;
\.


--
-- Data for Name: rating; Type: TABLE DATA; Schema: reputation; Owner: postgres
--

COPY reputation.rating (rating_id, user_id, rating_type_id, rating_value, note, created_by, created_at, updated_by, updated_at) FROM stdin;
\.


--
-- Data for Name: rating_type; Type: TABLE DATA; Schema: reputation; Owner: postgres
--

COPY reputation.rating_type (rating_type_id, name, description, max_value, created_by, created_at, updated_by, updated_at, min_value) FROM stdin;
\.


--
-- Name: identifier_billing_payment_options; Type: SEQUENCE SET; Schema: billing; Owner: postgres
--

SELECT pg_catalog.setval('billing.identifier_billing_payment_options', 33, true);


--
-- Name: identifier_category; Type: SEQUENCE SET; Schema: catalog; Owner: postgres
--

SELECT pg_catalog.setval('catalog.identifier_category', 40, true);


--
-- Name: identifier_product; Type: SEQUENCE SET; Schema: catalog; Owner: postgres
--

SELECT pg_catalog.setval('catalog.identifier_product', 261, true);


--
-- Name: identifier_product_partner; Type: SEQUENCE SET; Schema: catalog; Owner: postgres
--

SELECT pg_catalog.setval('catalog.identifier_product_partner', 271, true);


--
-- Name: order_number; Type: SEQUENCE SET; Schema: orders; Owner: postgres
--

SELECT pg_catalog.setval('orders.order_number', 92, true);


--
-- Name: identifier_partner; Type: SEQUENCE SET; Schema: partner; Owner: postgres
--

SELECT pg_catalog.setval('partner.identifier_partner', 27, true);


--
-- Name: mysequence; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.mysequence', 100, false);


--
-- Name: administrator pk_administrator; Type: CONSTRAINT; Schema: administrator; Owner: postgres
--

ALTER TABLE ONLY administrator.administrator
    ADD CONSTRAINT pk_administrator PRIMARY KEY (admin_id);


--
-- Name: interest_rate_setting pk_interest_rate_setting_interest_rate_setting; Type: CONSTRAINT; Schema: administrator; Owner: postgres
--

ALTER TABLE ONLY administrator.interest_rate_setting
    ADD CONSTRAINT pk_interest_rate_setting_interest_rate_setting PRIMARY KEY (interest_rate_setting_id);


--
-- Name: collaborator collaborator_pkey; Type: CONSTRAINT; Schema: authentication; Owner: postgres
--

ALTER TABLE ONLY authentication.collaborator
    ADD CONSTRAINT collaborator_pkey PRIMARY KEY (collaborator_id);


--
-- Name: otp pk_otp; Type: CONSTRAINT; Schema: authentication; Owner: postgres
--

ALTER TABLE ONLY authentication.otp
    ADD CONSTRAINT pk_otp PRIMARY KEY (otp_id);


--
-- Name: profile profile_pkey; Type: CONSTRAINT; Schema: authentication; Owner: postgres
--

ALTER TABLE ONLY authentication.profile
    ADD CONSTRAINT profile_pkey PRIMARY KEY (profile_id);


--
-- Name: role role_pkey; Type: CONSTRAINT; Schema: authentication; Owner: postgres
--

ALTER TABLE ONLY authentication.role
    ADD CONSTRAINT role_pkey PRIMARY KEY (role_id);


--
-- Name: profile unq_profile_user_id; Type: CONSTRAINT; Schema: authentication; Owner: postgres
--

ALTER TABLE ONLY authentication.profile
    ADD CONSTRAINT unq_profile_user_id UNIQUE (user_id);


--
-- Name: user user_pkey; Type: CONSTRAINT; Schema: authentication; Owner: postgres
--

ALTER TABLE ONLY authentication."user"
    ADD CONSTRAINT user_pkey PRIMARY KEY (user_id);


--
-- Name: access_token_history access_token_history_pk; Type: CONSTRAINT; Schema: billing; Owner: postgres
--

ALTER TABLE ONLY billing.access_token_history
    ADD CONSTRAINT access_token_history_pk PRIMARY KEY (access_token_history_id);


--
-- Name: pagseguro_value_minimum pagseguro_value_minimum_pk; Type: CONSTRAINT; Schema: billing; Owner: postgres
--

ALTER TABLE ONLY billing.pagseguro_value_minimum
    ADD CONSTRAINT pagseguro_value_minimum_pk PRIMARY KEY (pagseguro_value_minimum_id);


--
-- Name: payment_history pk_pagseguro_pagseguro_id; Type: CONSTRAINT; Schema: billing; Owner: postgres
--

ALTER TABLE ONLY billing.payment_history
    ADD CONSTRAINT pk_pagseguro_pagseguro_id PRIMARY KEY (pagseguro_id);


--
-- Name: payment_local pk_payment_local_payment_local_id; Type: CONSTRAINT; Schema: billing; Owner: postgres
--

ALTER TABLE ONLY billing.payment_local
    ADD CONSTRAINT pk_payment_local_payment_local_id PRIMARY KEY (payment_local_id);


--
-- Name: payment_options_local pk_payment_options_local_payment_options_local_id; Type: CONSTRAINT; Schema: billing; Owner: postgres
--

ALTER TABLE ONLY billing.payment_options_local
    ADD CONSTRAINT pk_payment_options_local_payment_options_local_id PRIMARY KEY (payment_options_local_id);


--
-- Name: payment_options pk_payment_options_payment_options_id; Type: CONSTRAINT; Schema: billing; Owner: postgres
--

ALTER TABLE ONLY billing.payment_options
    ADD CONSTRAINT pk_payment_options_payment_options_id PRIMARY KEY (payment_options_id);


--
-- Name: payment_order pk_payment_payment_id; Type: CONSTRAINT; Schema: billing; Owner: postgres
--

ALTER TABLE ONLY billing.payment_order
    ADD CONSTRAINT pk_payment_payment_id PRIMARY KEY (payment_order_id);


--
-- Name: payment pk_payment_payment_id_0; Type: CONSTRAINT; Schema: billing; Owner: postgres
--

ALTER TABLE ONLY billing.payment
    ADD CONSTRAINT pk_payment_payment_id_0 PRIMARY KEY (payment_id);


--
-- Name: payment_situation pk_payment_situation_payment_situation_id; Type: CONSTRAINT; Schema: billing; Owner: postgres
--

ALTER TABLE ONLY billing.payment_situation
    ADD CONSTRAINT pk_payment_situation_payment_situation_id PRIMARY KEY (payment_situation_id);


--
-- Name: payment_options unq_payment_options_payment_options_id; Type: CONSTRAINT; Schema: billing; Owner: postgres
--

ALTER TABLE ONLY billing.payment_options
    ADD CONSTRAINT unq_payment_options_payment_options_id UNIQUE (payment_options_id);


--
-- Name: category category_pkey; Type: CONSTRAINT; Schema: catalog; Owner: postgres
--

ALTER TABLE ONLY catalog.category
    ADD CONSTRAINT category_pkey PRIMARY KEY (category_id);


--
-- Name: base_product pk_base_product; Type: CONSTRAINT; Schema: catalog; Owner: postgres
--

ALTER TABLE ONLY catalog.base_product
    ADD CONSTRAINT pk_base_product PRIMARY KEY (product_id);


--
-- Name: category_base_product pk_category_base_product; Type: CONSTRAINT; Schema: catalog; Owner: postgres
--

ALTER TABLE ONLY catalog.category_base_product
    ADD CONSTRAINT pk_category_base_product PRIMARY KEY (category_base_product_id);


--
-- Name: product pk_product; Type: CONSTRAINT; Schema: catalog; Owner: postgres
--

ALTER TABLE ONLY catalog.product
    ADD CONSTRAINT pk_product PRIMARY KEY (product_id);


--
-- Name: product_branch pk_product_branch_product_branch_id; Type: CONSTRAINT; Schema: catalog; Owner: postgres
--

ALTER TABLE ONLY catalog.product_branch
    ADD CONSTRAINT pk_product_branch_product_branch_id PRIMARY KEY (product_branch_id);


--
-- Name: product_image pk_product_image; Type: CONSTRAINT; Schema: catalog; Owner: postgres
--

ALTER TABLE ONLY catalog.product_image
    ADD CONSTRAINT pk_product_image PRIMARY KEY (product_image_id);


--
-- Name: product_image_product pk_product_image_product; Type: CONSTRAINT; Schema: catalog; Owner: postgres
--

ALTER TABLE ONLY catalog.product_image_product
    ADD CONSTRAINT pk_product_image_product PRIMARY KEY (product_image_product_id);


--
-- Name: input pk_tbl; Type: CONSTRAINT; Schema: catalog; Owner: postgres
--

ALTER TABLE ONLY catalog.input
    ADD CONSTRAINT pk_tbl PRIMARY KEY (input_id);


--
-- Name: product unq_product_image_default; Type: CONSTRAINT; Schema: catalog; Owner: postgres
--

ALTER TABLE ONLY catalog.product
    ADD CONSTRAINT unq_product_image_default UNIQUE (image_default);


--
-- Name: notification notification_pk; Type: CONSTRAINT; Schema: communication; Owner: postgres
--

ALTER TABLE ONLY communication.notification
    ADD CONSTRAINT notification_pk PRIMARY KEY (notification_id);


--
-- Name: chat_member pk_chat_members_chat_member_id; Type: CONSTRAINT; Schema: communication; Owner: postgres
--

ALTER TABLE ONLY communication.chat_member
    ADD CONSTRAINT pk_chat_members_chat_member_id PRIMARY KEY (chat_member_id);


--
-- Name: message pk_message_message_id; Type: CONSTRAINT; Schema: communication; Owner: postgres
--

ALTER TABLE ONLY communication.message
    ADD CONSTRAINT pk_message_message_id PRIMARY KEY (message_id);


--
-- Name: message_type pk_message_type_message_type_id; Type: CONSTRAINT; Schema: communication; Owner: postgres
--

ALTER TABLE ONLY communication.message_type
    ADD CONSTRAINT pk_message_type_message_type_id PRIMARY KEY (message_type_id);


--
-- Name: chat pk_table_chat_id; Type: CONSTRAINT; Schema: communication; Owner: postgres
--

ALTER TABLE ONLY communication.chat
    ADD CONSTRAINT pk_table_chat_id PRIMARY KEY (chat_id);


--
-- Name: address pk_adress; Type: CONSTRAINT; Schema: consumer; Owner: postgres
--

ALTER TABLE ONLY consumer.address
    ADD CONSTRAINT pk_adress PRIMARY KEY (address_id);


--
-- Name: card pk_card; Type: CONSTRAINT; Schema: consumer; Owner: postgres
--

ALTER TABLE ONLY consumer.card
    ADD CONSTRAINT pk_card PRIMARY KEY (card_id);


--
-- Name: consumer pk_consumer; Type: CONSTRAINT; Schema: consumer; Owner: postgres
--

ALTER TABLE ONLY consumer.consumer
    ADD CONSTRAINT pk_consumer PRIMARY KEY (consumer_id);


--
-- Name: style_consumer pk_style_consumer_style_consumer_id; Type: CONSTRAINT; Schema: consumer; Owner: postgres
--

ALTER TABLE ONLY consumer.style_consumer
    ADD CONSTRAINT pk_style_consumer_style_consumer_id PRIMARY KEY (style_consumer_id);


--
-- Name: actuation_area_shipping pk_actuation_are_shipping_actuation_are_shipping_id; Type: CONSTRAINT; Schema: logistics; Owner: postgres
--

ALTER TABLE ONLY logistics.actuation_area_shipping
    ADD CONSTRAINT pk_actuation_are_shipping_actuation_are_shipping_id PRIMARY KEY (actuation_area_shipping_id);


--
-- Name: actuation_area pk_actuation_area; Type: CONSTRAINT; Schema: logistics; Owner: postgres
--

ALTER TABLE ONLY logistics.actuation_area
    ADD CONSTRAINT pk_actuation_area PRIMARY KEY (actuation_area_id);


--
-- Name: actuation_area_config pk_actuation_area_config_actuation_area_config_id; Type: CONSTRAINT; Schema: logistics; Owner: postgres
--

ALTER TABLE ONLY logistics.actuation_area_config
    ADD CONSTRAINT pk_actuation_area_config_actuation_area_config_id PRIMARY KEY (actuation_area_config_id);


--
-- Name: actuation_area_payments pk_actuation_area_payments_actuation_area_payments_id; Type: CONSTRAINT; Schema: logistics; Owner: postgres
--

ALTER TABLE ONLY logistics.actuation_area_payments
    ADD CONSTRAINT pk_actuation_area_payments_actuation_area_payments_id PRIMARY KEY (actuation_area_payments_id);


--
-- Name: actuation_area_delivery_option pk_shipping_option_shipping_option_id; Type: CONSTRAINT; Schema: logistics; Owner: postgres
--

ALTER TABLE ONLY logistics.actuation_area_delivery_option
    ADD CONSTRAINT pk_shipping_option_shipping_option_id PRIMARY KEY (delivery_option_id);


--
-- Name: working_day pk_working_day_working_day_id; Type: CONSTRAINT; Schema: logistics; Owner: postgres
--

ALTER TABLE ONLY logistics.working_day
    ADD CONSTRAINT pk_working_day_working_day_id PRIMARY KEY (working_day_id);


--
-- Name: address pk_adress; Type: CONSTRAINT; Schema: orders; Owner: postgres
--

ALTER TABLE ONLY orders.address
    ADD CONSTRAINT pk_adress PRIMARY KEY (address_id);


--
-- Name: order_consumer pk_order_address_order_address_id; Type: CONSTRAINT; Schema: orders; Owner: postgres
--

ALTER TABLE ONLY orders.order_consumer
    ADD CONSTRAINT pk_order_address_order_address_id PRIMARY KEY (order_address_id);


--
-- Name: order_branch pk_order_branch_order_branch_id; Type: CONSTRAINT; Schema: orders; Owner: postgres
--

ALTER TABLE ONLY orders.order_branch
    ADD CONSTRAINT pk_order_branch_order_branch_id PRIMARY KEY (order_branch_id);


--
-- Name: order_shipping pk_order_shipping_order_shipping_id; Type: CONSTRAINT; Schema: orders; Owner: postgres
--

ALTER TABLE ONLY orders.order_shipping
    ADD CONSTRAINT pk_order_shipping_order_shipping_id PRIMARY KEY (order_shipping_id);


--
-- Name: orders_itens pk_orders_itens; Type: CONSTRAINT; Schema: orders; Owner: postgres
--

ALTER TABLE ONLY orders.orders_itens
    ADD CONSTRAINT pk_orders_itens PRIMARY KEY (order_item_id);


--
-- Name: orders_status_history pk_orders_status_history_order_status_history_id; Type: CONSTRAINT; Schema: orders; Owner: postgres
--

ALTER TABLE ONLY orders.orders_status_history
    ADD CONSTRAINT pk_orders_status_history_order_status_history_id PRIMARY KEY (order_status_history_id);


--
-- Name: orders_status pk_orders_status_ordes_status_id; Type: CONSTRAINT; Schema: orders; Owner: postgres
--

ALTER TABLE ONLY orders.orders_status
    ADD CONSTRAINT pk_orders_status_ordes_status_id PRIMARY KEY (order_status_id);


--
-- Name: shipping_company pk_shipping_company; Type: CONSTRAINT; Schema: orders; Owner: postgres
--

ALTER TABLE ONLY orders.shipping_company
    ADD CONSTRAINT pk_shipping_company PRIMARY KEY (shipping_company_id);


--
-- Name: orders pk_tbl; Type: CONSTRAINT; Schema: orders; Owner: postgres
--

ALTER TABLE ONLY orders.orders
    ADD CONSTRAINT pk_tbl PRIMARY KEY (order_id);


--
-- Name: orders_status unq_orders_status_ordes_status_id; Type: CONSTRAINT; Schema: orders; Owner: postgres
--

ALTER TABLE ONLY orders.orders_status
    ADD CONSTRAINT unq_orders_status_ordes_status_id UNIQUE (order_status_id);


--
-- Name: address pk_adress; Type: CONSTRAINT; Schema: partner; Owner: postgres
--

ALTER TABLE ONLY partner.address
    ADD CONSTRAINT pk_adress PRIMARY KEY (address_id);


--
-- Name: bank_details pk_bank_details_bank details_id; Type: CONSTRAINT; Schema: partner; Owner: postgres
--

ALTER TABLE ONLY partner.bank_details
    ADD CONSTRAINT "pk_bank_details_bank details_id" PRIMARY KEY (bank_details_id);


--
-- Name: branch pk_branch; Type: CONSTRAINT; Schema: partner; Owner: postgres
--

ALTER TABLE ONLY partner.branch
    ADD CONSTRAINT pk_branch PRIMARY KEY (branch_id);


--
-- Name: partner pk_partner; Type: CONSTRAINT; Schema: partner; Owner: postgres
--

ALTER TABLE ONLY partner.partner
    ADD CONSTRAINT pk_partner PRIMARY KEY (partner_id);


--
-- Name: style_partner pk_style_partner_style_partner_id; Type: CONSTRAINT; Schema: partner; Owner: postgres
--

ALTER TABLE ONLY partner.style_partner
    ADD CONSTRAINT pk_style_partner_style_partner_id PRIMARY KEY (style_partner_id);


--
-- Name: report_filter pk_report_filter_report_filter_id; Type: CONSTRAINT; Schema: report; Owner: postgres
--

ALTER TABLE ONLY report.report_filter
    ADD CONSTRAINT pk_report_filter_report_filter_id PRIMARY KEY (report_filter_id);


--
-- Name: report pk_table_report_id; Type: CONSTRAINT; Schema: report; Owner: postgres
--

ALTER TABLE ONLY report.report
    ADD CONSTRAINT pk_table_report_id PRIMARY KEY (report_id);


--
-- Name: branch_rating pk_partner_rating; Type: CONSTRAINT; Schema: reputation; Owner: postgres
--

ALTER TABLE ONLY reputation.branch_rating
    ADD CONSTRAINT pk_partner_rating PRIMARY KEY (branch_rating_id);


--
-- Name: rating pk_rating; Type: CONSTRAINT; Schema: reputation; Owner: postgres
--

ALTER TABLE ONLY reputation.rating
    ADD CONSTRAINT pk_rating PRIMARY KEY (rating_id);


--
-- Name: rating_type pk_research; Type: CONSTRAINT; Schema: reputation; Owner: postgres
--

ALTER TABLE ONLY reputation.rating_type
    ADD CONSTRAINT pk_research PRIMARY KEY (rating_type_id);


--
-- Name: interest_rate_setting fk_interest_rate_setting_administrator; Type: FK CONSTRAINT; Schema: administrator; Owner: postgres
--

ALTER TABLE ONLY administrator.interest_rate_setting
    ADD CONSTRAINT fk_interest_rate_setting_administrator FOREIGN KEY (admin_id) REFERENCES administrator.administrator(admin_id) ON UPDATE CASCADE ON DELETE CASCADE;


--
-- Name: collaborator fk_collaborator_sponsor_user; Type: FK CONSTRAINT; Schema: authentication; Owner: postgres
--

ALTER TABLE ONLY authentication.collaborator
    ADD CONSTRAINT fk_collaborator_sponsor_user FOREIGN KEY (sponsor_id) REFERENCES authentication."user"(user_id) ON UPDATE CASCADE ON DELETE CASCADE;


--
-- Name: collaborator fk_collaborator_user; Type: FK CONSTRAINT; Schema: authentication; Owner: postgres
--

ALTER TABLE ONLY authentication.collaborator
    ADD CONSTRAINT fk_collaborator_user FOREIGN KEY (user_id) REFERENCES authentication."user"(user_id) ON UPDATE CASCADE ON DELETE CASCADE;


--
-- Name: otp fk_otp_user_id; Type: FK CONSTRAINT; Schema: authentication; Owner: postgres
--

ALTER TABLE ONLY authentication.otp
    ADD CONSTRAINT fk_otp_user_id FOREIGN KEY (user_id) REFERENCES authentication."user"(user_id) ON UPDATE CASCADE ON DELETE CASCADE;


--
-- Name: profile fk_profile_user; Type: FK CONSTRAINT; Schema: authentication; Owner: postgres
--

ALTER TABLE ONLY authentication.profile
    ADD CONSTRAINT fk_profile_user FOREIGN KEY (user_id) REFERENCES authentication."user"(user_id) ON UPDATE CASCADE ON DELETE CASCADE;


--
-- Name: user fk_user_role; Type: FK CONSTRAINT; Schema: authentication; Owner: postgres
--

ALTER TABLE ONLY authentication."user"
    ADD CONSTRAINT fk_user_role FOREIGN KEY (role_id) REFERENCES authentication.role(role_id);


--
-- Name: access_token_history access_token_history_fk; Type: FK CONSTRAINT; Schema: billing; Owner: postgres
--

ALTER TABLE ONLY billing.access_token_history
    ADD CONSTRAINT access_token_history_fk FOREIGN KEY (partner_id) REFERENCES partner.partner(partner_id) ON UPDATE CASCADE ON DELETE CASCADE;


--
-- Name: payment_history fk_pagseguro_orders; Type: FK CONSTRAINT; Schema: billing; Owner: postgres
--

ALTER TABLE ONLY billing.payment_history
    ADD CONSTRAINT fk_pagseguro_orders FOREIGN KEY (order_id) REFERENCES orders.orders(order_id) ON UPDATE CASCADE ON DELETE CASCADE;


--
-- Name: payment_options_local fk_payment_options_local_payment_local; Type: FK CONSTRAINT; Schema: billing; Owner: postgres
--

ALTER TABLE ONLY billing.payment_options_local
    ADD CONSTRAINT fk_payment_options_local_payment_local FOREIGN KEY (payment_local_id) REFERENCES billing.payment_local(payment_local_id) ON UPDATE CASCADE ON DELETE CASCADE;


--
-- Name: payment_options_local fk_payment_options_local_payment_options; Type: FK CONSTRAINT; Schema: billing; Owner: postgres
--

ALTER TABLE ONLY billing.payment_options_local
    ADD CONSTRAINT fk_payment_options_local_payment_options FOREIGN KEY (payment_options_id) REFERENCES billing.payment_options(payment_options_id) ON UPDATE CASCADE ON DELETE CASCADE;


--
-- Name: payment fk_payment_orders; Type: FK CONSTRAINT; Schema: billing; Owner: postgres
--

ALTER TABLE ONLY billing.payment
    ADD CONSTRAINT fk_payment_orders FOREIGN KEY (order_id) REFERENCES orders.orders(order_id);


--
-- Name: payment fk_payment_payment_options; Type: FK CONSTRAINT; Schema: billing; Owner: postgres
--

ALTER TABLE ONLY billing.payment
    ADD CONSTRAINT fk_payment_payment_options FOREIGN KEY (payment_options_id) REFERENCES billing.payment_options(payment_options_id) ON UPDATE CASCADE ON DELETE CASCADE;


--
-- Name: payment fk_payment_payment_situation; Type: FK CONSTRAINT; Schema: billing; Owner: postgres
--

ALTER TABLE ONLY billing.payment
    ADD CONSTRAINT fk_payment_payment_situation FOREIGN KEY (payment_situation_id) REFERENCES billing.payment_situation(payment_situation_id);


--
-- Name: pagseguro_value_minimum pagseguro_value_minimum_fk; Type: FK CONSTRAINT; Schema: billing; Owner: postgres
--

ALTER TABLE ONLY billing.pagseguro_value_minimum
    ADD CONSTRAINT pagseguro_value_minimum_fk FOREIGN KEY (partner_id) REFERENCES partner.partner(partner_id) ON UPDATE CASCADE ON DELETE CASCADE;


--
-- Name: base_product fk_base_product_administrator; Type: FK CONSTRAINT; Schema: catalog; Owner: postgres
--

ALTER TABLE ONLY catalog.base_product
    ADD CONSTRAINT fk_base_product_administrator FOREIGN KEY (admin_id) REFERENCES administrator.administrator(admin_id);


--
-- Name: category_base_product fk_category_base_product; Type: FK CONSTRAINT; Schema: catalog; Owner: postgres
--

ALTER TABLE ONLY catalog.category_base_product
    ADD CONSTRAINT fk_category_base_product FOREIGN KEY (category_id) REFERENCES catalog.category(category_id) ON UPDATE CASCADE ON DELETE CASCADE;


--
-- Name: category_base_product fk_category_base_product_product; Type: FK CONSTRAINT; Schema: catalog; Owner: postgres
--

ALTER TABLE ONLY catalog.category_base_product
    ADD CONSTRAINT fk_category_base_product_product FOREIGN KEY (product_id) REFERENCES catalog.base_product(product_id) ON UPDATE CASCADE ON DELETE CASCADE;


--
-- Name: input fk_input_base_product; Type: FK CONSTRAINT; Schema: catalog; Owner: postgres
--

ALTER TABLE ONLY catalog.input
    ADD CONSTRAINT fk_input_base_product FOREIGN KEY (product_id) REFERENCES catalog.base_product(product_id) ON UPDATE CASCADE ON DELETE CASCADE;


--
-- Name: product_branch fk_product_branch_branch; Type: FK CONSTRAINT; Schema: catalog; Owner: postgres
--

ALTER TABLE ONLY catalog.product_branch
    ADD CONSTRAINT fk_product_branch_branch FOREIGN KEY (branch_id) REFERENCES partner.branch(branch_id) ON UPDATE CASCADE ON DELETE CASCADE;


--
-- Name: product_branch fk_product_branch_product; Type: FK CONSTRAINT; Schema: catalog; Owner: postgres
--

ALTER TABLE ONLY catalog.product_branch
    ADD CONSTRAINT fk_product_branch_product FOREIGN KEY (product_id) REFERENCES catalog.product(product_id) ON UPDATE CASCADE ON DELETE CASCADE;


--
-- Name: product fk_product_category; Type: FK CONSTRAINT; Schema: catalog; Owner: postgres
--

ALTER TABLE ONLY catalog.product
    ADD CONSTRAINT fk_product_category FOREIGN KEY (base_product_id) REFERENCES catalog.base_product(product_id) ON UPDATE CASCADE ON DELETE CASCADE;


--
-- Name: product_image_product fk_product_image_product_product; Type: FK CONSTRAINT; Schema: catalog; Owner: postgres
--

ALTER TABLE ONLY catalog.product_image_product
    ADD CONSTRAINT fk_product_image_product_product FOREIGN KEY (product_id) REFERENCES catalog.product(product_id) ON UPDATE CASCADE ON DELETE CASCADE;


--
-- Name: product_image_product fk_product_image_product_product_image; Type: FK CONSTRAINT; Schema: catalog; Owner: postgres
--

ALTER TABLE ONLY catalog.product_image_product
    ADD CONSTRAINT fk_product_image_product_product_image FOREIGN KEY (product_image_id) REFERENCES catalog.product_image(product_image_id) ON UPDATE CASCADE ON DELETE CASCADE;


--
-- Name: chat_member fk_chat_member_chat; Type: FK CONSTRAINT; Schema: communication; Owner: postgres
--

ALTER TABLE ONLY communication.chat_member
    ADD CONSTRAINT fk_chat_member_chat FOREIGN KEY (chat_id) REFERENCES communication.chat(chat_id) ON UPDATE CASCADE ON DELETE CASCADE;


--
-- Name: message fk_message_chat; Type: FK CONSTRAINT; Schema: communication; Owner: postgres
--

ALTER TABLE ONLY communication.message
    ADD CONSTRAINT fk_message_chat FOREIGN KEY (chat_id) REFERENCES communication.chat(chat_id) ON UPDATE CASCADE ON DELETE CASCADE;


--
-- Name: message fk_message_message_type; Type: FK CONSTRAINT; Schema: communication; Owner: postgres
--

ALTER TABLE ONLY communication.message
    ADD CONSTRAINT fk_message_message_type FOREIGN KEY (message_type) REFERENCES communication.message_type(message_type_id);


--
-- Name: message fk_message_user_sender; Type: FK CONSTRAINT; Schema: communication; Owner: postgres
--

ALTER TABLE ONLY communication.message
    ADD CONSTRAINT fk_message_user_sender FOREIGN KEY (sender_id) REFERENCES authentication."user"(user_id) ON UPDATE SET NULL ON DELETE SET NULL;


--
-- Name: address fk_address_consumer; Type: FK CONSTRAINT; Schema: consumer; Owner: postgres
--

ALTER TABLE ONLY consumer.address
    ADD CONSTRAINT fk_address_consumer FOREIGN KEY (consumer_id) REFERENCES consumer.consumer(consumer_id) ON UPDATE CASCADE ON DELETE CASCADE;


--
-- Name: card fk_card_consumer; Type: FK CONSTRAINT; Schema: consumer; Owner: postgres
--

ALTER TABLE ONLY consumer.card
    ADD CONSTRAINT fk_card_consumer FOREIGN KEY (consumer_id) REFERENCES consumer.consumer(consumer_id) ON UPDATE CASCADE ON DELETE CASCADE;


--
-- Name: consumer fk_consumer_address; Type: FK CONSTRAINT; Schema: consumer; Owner: postgres
--

ALTER TABLE ONLY consumer.consumer
    ADD CONSTRAINT fk_consumer_address FOREIGN KEY (default_address) REFERENCES consumer.address(address_id) ON UPDATE CASCADE ON DELETE SET NULL;


--
-- Name: consumer fk_consumer_user; Type: FK CONSTRAINT; Schema: consumer; Owner: postgres
--

ALTER TABLE ONLY consumer.consumer
    ADD CONSTRAINT fk_consumer_user FOREIGN KEY (user_id) REFERENCES authentication."user"(user_id) ON UPDATE CASCADE ON DELETE CASCADE;


--
-- Name: actuation_area_shipping fk_actuation_are_shipping_delivery_option; Type: FK CONSTRAINT; Schema: logistics; Owner: postgres
--

ALTER TABLE ONLY logistics.actuation_area_shipping
    ADD CONSTRAINT fk_actuation_are_shipping_delivery_option FOREIGN KEY (delivery_option_id) REFERENCES logistics.actuation_area_delivery_option(delivery_option_id);


--
-- Name: actuation_area fk_actuation_area_branch_id; Type: FK CONSTRAINT; Schema: logistics; Owner: postgres
--

ALTER TABLE ONLY logistics.actuation_area
    ADD CONSTRAINT fk_actuation_area_branch_id FOREIGN KEY (branch_id) REFERENCES partner.branch(branch_id) ON UPDATE CASCADE ON DELETE CASCADE;


--
-- Name: actuation_area_config fk_actuation_area_config; Type: FK CONSTRAINT; Schema: logistics; Owner: postgres
--

ALTER TABLE ONLY logistics.actuation_area_config
    ADD CONSTRAINT fk_actuation_area_config FOREIGN KEY (actuation_area_id) REFERENCES logistics.actuation_area(actuation_area_id) ON UPDATE CASCADE ON DELETE CASCADE;


--
-- Name: actuation_area fk_actuation_area_partner; Type: FK CONSTRAINT; Schema: logistics; Owner: postgres
--

ALTER TABLE ONLY logistics.actuation_area
    ADD CONSTRAINT fk_actuation_area_partner FOREIGN KEY (partner_id) REFERENCES partner.partner(partner_id) ON UPDATE CASCADE ON DELETE CASCADE;


--
-- Name: actuation_area_payments fk_actuation_area_payment_id; Type: FK CONSTRAINT; Schema: logistics; Owner: postgres
--

ALTER TABLE ONLY logistics.actuation_area_payments
    ADD CONSTRAINT fk_actuation_area_payment_id FOREIGN KEY (payment_options_id) REFERENCES billing.payment_options(payment_options_id);


--
-- Name: actuation_area_payments fk_actuation_area_payments; Type: FK CONSTRAINT; Schema: logistics; Owner: postgres
--

ALTER TABLE ONLY logistics.actuation_area_payments
    ADD CONSTRAINT fk_actuation_area_payments FOREIGN KEY (actuation_area_config_id) REFERENCES logistics.actuation_area_config(actuation_area_config_id) ON UPDATE CASCADE ON DELETE CASCADE;


--
-- Name: actuation_area_shipping fk_actuation_area_shipping_actuation_area_config; Type: FK CONSTRAINT; Schema: logistics; Owner: postgres
--

ALTER TABLE ONLY logistics.actuation_area_shipping
    ADD CONSTRAINT fk_actuation_area_shipping_actuation_area_config FOREIGN KEY (actuation_area_config_id) REFERENCES logistics.actuation_area_config(actuation_area_config_id) ON UPDATE CASCADE ON DELETE CASCADE;


--
-- Name: working_day fk_working_day; Type: FK CONSTRAINT; Schema: logistics; Owner: postgres
--

ALTER TABLE ONLY logistics.working_day
    ADD CONSTRAINT fk_working_day FOREIGN KEY (actuation_area_config_id) REFERENCES logistics.actuation_area_config(actuation_area_config_id) ON UPDATE CASCADE ON DELETE CASCADE;


--
-- Name: order_consumer fk_order_address_orders; Type: FK CONSTRAINT; Schema: orders; Owner: postgres
--

ALTER TABLE ONLY orders.order_consumer
    ADD CONSTRAINT fk_order_address_orders FOREIGN KEY (order_id) REFERENCES orders.orders(order_id) ON UPDATE CASCADE ON DELETE CASCADE;


--
-- Name: order_branch fk_order_branch_orders; Type: FK CONSTRAINT; Schema: orders; Owner: postgres
--

ALTER TABLE ONLY orders.order_branch
    ADD CONSTRAINT fk_order_branch_orders FOREIGN KEY (order_id) REFERENCES orders.orders(order_id) ON UPDATE CASCADE ON DELETE CASCADE;


--
-- Name: order_shipping fk_order_shipping_orders; Type: FK CONSTRAINT; Schema: orders; Owner: postgres
--

ALTER TABLE ONLY orders.order_shipping
    ADD CONSTRAINT fk_order_shipping_orders FOREIGN KEY (order_id) REFERENCES orders.orders(order_id) ON UPDATE CASCADE ON DELETE CASCADE;


--
-- Name: orders_itens fk_orders_itens_orders; Type: FK CONSTRAINT; Schema: orders; Owner: postgres
--

ALTER TABLE ONLY orders.orders_itens
    ADD CONSTRAINT fk_orders_itens_orders FOREIGN KEY (order_id) REFERENCES orders.orders(order_id) ON UPDATE CASCADE ON DELETE CASCADE;


--
-- Name: orders_itens fk_orders_itens_product; Type: FK CONSTRAINT; Schema: orders; Owner: postgres
--

ALTER TABLE ONLY orders.orders_itens
    ADD CONSTRAINT fk_orders_itens_product FOREIGN KEY (product_id) REFERENCES catalog.product(product_id) ON UPDATE CASCADE ON DELETE CASCADE;


--
-- Name: orders fk_orders_orders_status; Type: FK CONSTRAINT; Schema: orders; Owner: postgres
--

ALTER TABLE ONLY orders.orders
    ADD CONSTRAINT fk_orders_orders_status FOREIGN KEY (order_status_id) REFERENCES orders.orders_status(order_status_id);


--
-- Name: orders fk_orders_shipping_company; Type: FK CONSTRAINT; Schema: orders; Owner: postgres
--

ALTER TABLE ONLY orders.orders
    ADD CONSTRAINT fk_orders_shipping_company FOREIGN KEY (shipping_company_id) REFERENCES orders.shipping_company(shipping_company_id) ON UPDATE CASCADE ON DELETE CASCADE;


--
-- Name: orders_status_history fk_orders_status_history_orders; Type: FK CONSTRAINT; Schema: orders; Owner: postgres
--

ALTER TABLE ONLY orders.orders_status_history
    ADD CONSTRAINT fk_orders_status_history_orders FOREIGN KEY (order_id) REFERENCES orders.orders(order_id);


--
-- Name: orders_status_history fk_orders_status_history_orders_status; Type: FK CONSTRAINT; Schema: orders; Owner: postgres
--

ALTER TABLE ONLY orders.orders_status_history
    ADD CONSTRAINT fk_orders_status_history_orders_status FOREIGN KEY (order_status_id) REFERENCES orders.orders_status(order_status_id);


--
-- Name: shipping_company fk_shipping_company_address; Type: FK CONSTRAINT; Schema: orders; Owner: postgres
--

ALTER TABLE ONLY orders.shipping_company
    ADD CONSTRAINT fk_shipping_company_address FOREIGN KEY (address_id) REFERENCES orders.address(address_id) ON UPDATE CASCADE ON DELETE CASCADE;


--
-- Name: address fk_address_branch; Type: FK CONSTRAINT; Schema: partner; Owner: postgres
--

ALTER TABLE ONLY partner.address
    ADD CONSTRAINT fk_address_branch FOREIGN KEY (branch_id) REFERENCES partner.branch(branch_id) ON UPDATE CASCADE ON DELETE CASCADE;


--
-- Name: bank_details fk_bank_details_partner; Type: FK CONSTRAINT; Schema: partner; Owner: postgres
--

ALTER TABLE ONLY partner.bank_details
    ADD CONSTRAINT fk_bank_details_partner FOREIGN KEY (partner_id) REFERENCES partner.partner(partner_id) ON UPDATE CASCADE ON DELETE CASCADE;


--
-- Name: branch fk_branch_partner; Type: FK CONSTRAINT; Schema: partner; Owner: postgres
--

ALTER TABLE ONLY partner.branch
    ADD CONSTRAINT fk_branch_partner FOREIGN KEY (partner_id) REFERENCES partner.partner(partner_id) ON UPDATE CASCADE ON DELETE CASCADE;


--
-- Name: partner fk_partner_administrator; Type: FK CONSTRAINT; Schema: partner; Owner: postgres
--

ALTER TABLE ONLY partner.partner
    ADD CONSTRAINT fk_partner_administrator FOREIGN KEY (admin_id) REFERENCES administrator.administrator(admin_id);


--
-- Name: partner fk_partner_user; Type: FK CONSTRAINT; Schema: partner; Owner: postgres
--

ALTER TABLE ONLY partner.partner
    ADD CONSTRAINT fk_partner_user FOREIGN KEY (user_id) REFERENCES authentication."user"(user_id) ON UPDATE CASCADE ON DELETE CASCADE;


--
-- Name: style_partner fk_style_partner_administrator; Type: FK CONSTRAINT; Schema: partner; Owner: postgres
--

ALTER TABLE ONLY partner.style_partner
    ADD CONSTRAINT fk_style_partner_administrator FOREIGN KEY (admin_id) REFERENCES administrator.administrator(admin_id) ON UPDATE CASCADE ON DELETE CASCADE;


--
-- Name: report_filter fk_report_filter_report; Type: FK CONSTRAINT; Schema: report; Owner: postgres
--

ALTER TABLE ONLY report.report_filter
    ADD CONSTRAINT fk_report_filter_report FOREIGN KEY (report_id) REFERENCES report.report(report_id) ON UPDATE CASCADE ON DELETE CASCADE;


--
-- Name: branch_rating branch_rating_branch_fk; Type: FK CONSTRAINT; Schema: reputation; Owner: postgres
--

ALTER TABLE ONLY reputation.branch_rating
    ADD CONSTRAINT branch_rating_branch_fk FOREIGN KEY (branch_id) REFERENCES partner.branch(branch_id) ON UPDATE CASCADE ON DELETE CASCADE;


--
-- Name: rating fk_rating_rating_type; Type: FK CONSTRAINT; Schema: reputation; Owner: postgres
--

ALTER TABLE ONLY reputation.rating
    ADD CONSTRAINT fk_rating_rating_type FOREIGN KEY (rating_type_id) REFERENCES reputation.rating_type(rating_type_id) ON UPDATE CASCADE;


--
-- Name: rating fk_rating_user; Type: FK CONSTRAINT; Schema: reputation; Owner: postgres
--

ALTER TABLE ONLY reputation.rating
    ADD CONSTRAINT fk_rating_user FOREIGN KEY (user_id) REFERENCES authentication."user"(user_id) ON UPDATE CASCADE ON DELETE SET NULL;


--
-- Name: branch_rating rating_branch_rating_fk; Type: FK CONSTRAINT; Schema: reputation; Owner: postgres
--

ALTER TABLE ONLY reputation.branch_rating
    ADD CONSTRAINT rating_branch_rating_fk FOREIGN KEY (rating_id) REFERENCES reputation.rating(rating_id) ON UPDATE CASCADE ON DELETE CASCADE;


--
-- Name: SCHEMA public; Type: ACL; Schema: -; Owner: pg_database_owner
--

REVOKE USAGE ON SCHEMA public FROM PUBLIC;


--
-- PostgreSQL database dump complete
--

\unrestrict J7QbzAq3f0qaDRln72wN7VcjqBtxGZXXLZJ5pPowFBwnu0XDAVGJ2tciYwS2GZc



