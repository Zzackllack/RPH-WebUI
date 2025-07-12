package com.zacklack.zacklack.model;

import java.time.LocalDateTime;
import java.util.List;

import jakarta.persistence.CascadeType;
import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.ManyToOne;
import jakarta.persistence.OneToMany;
import jakarta.persistence.Table;


@Entity
@Table(name = "resource_packs")
public class ResourcePack {
    @Id @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(name="original_filename", nullable = false)
    private String originalFilename;

    @Column(name="storage_filename", nullable = false, unique = true)
    private String storageFilename;

    @Column(nullable = false)
    private Long size;

    @Column(name="file_hash", nullable = false, length = 64)
    private String fileHash;

    @Column(name="upload_date", nullable = false)
    private LocalDateTime uploadDate;

    // ← NEW FIELDS
    @Column(name="is_converted", nullable=false)
    private boolean converted = false;

    @Column(name="target_version")
    private String targetVersion;

    @ManyToOne
    @JoinColumn(name="original_pack_id")
    private ResourcePack originalPack;

    @OneToMany(mappedBy="originalPack", cascade=CascadeType.ALL)
    private List<ResourcePack> conversions;
    
    public ResourcePack() {}

    public ResourcePack(String originalFilename, String storageFilename, Long size, String fileHash, LocalDateTime uploadDate) {
        this.originalFilename = originalFilename;
        this.storageFilename = storageFilename;
        this.size = size;
        this.fileHash = fileHash;
        this.uploadDate = uploadDate;
    }

    // getters/setters...
    public String getFileHash() {
        return fileHash;
    }

    public void setFileHash(String fileHash) {
        this.fileHash = fileHash;
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

    public boolean isConverted() { return converted; }
    public void setConverted(boolean converted) { this.converted = converted; }

    public String getTargetVersion() { return targetVersion; }
    public void setTargetVersion(String targetVersion) { this.targetVersion = targetVersion; }

    public ResourcePack getOriginalPack() { return originalPack; }
    public void setOriginalPack(ResourcePack originalPack) { this.originalPack = originalPack; }

    public List<ResourcePack> getConversions() { return conversions; }
    public void setConversions(List<ResourcePack> conversions) { this.conversions = conversions; }
}

