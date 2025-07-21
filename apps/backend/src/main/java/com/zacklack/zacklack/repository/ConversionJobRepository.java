package com.zacklack.zacklack.repository;

import com.zacklack.zacklack.model.ConversionJob;
import org.springframework.data.jpa.repository.JpaRepository;

public interface ConversionJobRepository
    extends JpaRepository<ConversionJob, Long> {}
