package com.zacklack.zacklack.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import com.zacklack.zacklack.model.ResourcePack;

@Repository
public interface ResourcePackRepository extends JpaRepository<ResourcePack, Long> {
    List<ResourcePack> findByOriginalPackId(Long originalPackId);

    List<ResourcePack> findByConvertedFalse();
}

