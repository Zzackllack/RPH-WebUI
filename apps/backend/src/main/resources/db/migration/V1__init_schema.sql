-- V1__init_schema.sql
-- Erstes Schema: resource_packs & conversion_jobs

CREATE TABLE resource_packs (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    original_filename VARCHAR(255) NOT NULL,
    storage_filename  VARCHAR(255) NOT NULL UNIQUE,
    size              BIGINT      NOT NULL,
    file_hash         VARCHAR(64) NOT NULL,
    upload_date       TIMESTAMP   NOT NULL,
    pack_format       INT,
    mc_version        VARCHAR(255),
    is_converted      BOOLEAN     NOT NULL DEFAULT FALSE,
    target_version    VARCHAR(255),
    original_pack_id  BIGINT,
    CONSTRAINT fk_original_pack
      FOREIGN KEY (original_pack_id)
      REFERENCES resource_packs(id)
      ON DELETE SET NULL
);

CREATE TABLE conversion_jobs (
    id                 BIGINT AUTO_INCREMENT PRIMARY KEY,
    resource_pack_id   BIGINT      NOT NULL,
    target_version     VARCHAR(255) NOT NULL,
    status             VARCHAR(50)  NOT NULL,
    created_at         TIMESTAMP    NOT NULL,
    completed_at       TIMESTAMP    NULL,
    error_message      TEXT         NULL,
    console_log        TEXT         NULL,
    CONSTRAINT fk_conversion_pack
      FOREIGN KEY (resource_pack_id)
      REFERENCES resource_packs(id)
      ON DELETE CASCADE
);
