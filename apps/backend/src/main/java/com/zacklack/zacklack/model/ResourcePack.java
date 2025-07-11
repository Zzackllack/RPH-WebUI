package com.zacklack.zacklack.model;

import java.time.LocalDateTime;

import jakarta.persistence.*;

@Entity
@Table(name = "resource_packs")
public class ResourcePack {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(name="original_filename", nullable = false)
    private String originalFilename;

    @Column(name="storage_filename", nullable = false, unique = true)
    private String storageFilename;

    @Column(nullable = false)
    private Long size; // in bytes

    @Column(name="upload_date", nullable = false)
    private LocalDateTime uploadDate;

    public ResourcePack() {}

    public ResourcePack(String originalFilename, String storageFilename, Long size, LocalDateTime uploadDate) {
        this.originalFilename = originalFilename;
        this.storageFilename = storageFilename;
        this.size = size;
        this.uploadDate = uploadDate;
    }

    // --- Getters & Setters ---
    public Long getId() {
        return id;
    }

    public String getOriginalFilename() {
        return originalFilename;
    }

    public void setOriginalFilename(String originalFilename) {
        this.originalFilename = originalFilename;
    }

    public String getStorageFilename() {
        return storageFilename;
    }

    public void setStorageFilename(String storageFilename) {
        this.storageFilename = storageFilename;
    }

    public Long getSize() {
        return size;
    }

    public void setSize(Long size) {
        this.size = size;
    }

    public LocalDateTime getUploadDate() {
        return uploadDate;
    }

    public void setUploadDate(LocalDateTime uploadDate) {
        this.uploadDate = uploadDate;
    }
}
