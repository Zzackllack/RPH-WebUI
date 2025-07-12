package com.zacklack.zacklack.repository;

import org.springframework.data.jpa.repository.JpaRepository;

import com.zacklack.zacklack.model.ConversionJob;

public interface ConversionJobRepository extends JpaRepository<ConversionJob, Long> { }
