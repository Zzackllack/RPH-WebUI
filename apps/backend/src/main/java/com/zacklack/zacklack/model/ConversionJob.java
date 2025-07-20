package com.zacklack.zacklack.model;

import java.time.LocalDateTime;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.ManyToOne;
import jakarta.persistence.Table;

@Entity
@Table(name = "conversion_jobs")
public class ConversionJob {
    @Id @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(optional=false)
    @JoinColumn(name="resource_pack_id")
    @com.fasterxml.jackson.annotation.JsonBackReference
    private ResourcePack resourcePack;

    @Column(name="target_version", nullable=false)
    private String targetVersion;

    @Column(nullable=false)
    private String status;  // PENDING, IN_PROGRESS, COMPLETED, FAILED

    @Column(name="created_at", nullable=false)
    private LocalDateTime createdAt = LocalDateTime.now();

    @Column(name="completed_at")
    private LocalDateTime completedAt;

    @Column(name="error_message")
    private String errorMessage;

    @Column(name="console_log", columnDefinition = "TEXT")
    private String consoleLog;

    public String getErrorMessage() {
        return errorMessage;
    }

    public void setErrorMessage(String errorMessage) {
        this.errorMessage = errorMessage;
    }

    public String getConsoleLog() {
        return consoleLog;
    }

    public void setConsoleLog(String consoleLog) {
        this.consoleLog = consoleLog;
    }

    public LocalDateTime getCompletedAt() {
        return completedAt;
    }

    public void setCompletedAt(LocalDateTime completedAt) {
        this.completedAt = completedAt;
    }

    public LocalDateTime getCreatedAt() {
        return createdAt;
    }

    public void setCreatedAt(LocalDateTime createdAt) {
        this.createdAt = createdAt;
    }

    public String getStatus() {
        return status;
    }

    public void setStatus(String status) {
        this.status = status;
    }

    public ResourcePack getResourcePack() {
        return resourcePack;
    }

    public void setResourcePack(ResourcePack resourcePack) {
        this.resourcePack = resourcePack;
    }

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public String getTargetVersion() {
        return targetVersion;
    }

    public void setTargetVersion(String targetVersion) {
        this.targetVersion = targetVersion;
    }

}
