package com.zacklack.zacklack.repository;

import com.zacklack.zacklack.model.ResourcePack;
import java.util.List;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface ResourcePackRepository
    extends JpaRepository<ResourcePack, Long> {
    List<ResourcePack> findByOriginalPackId(Long originalPackId);

    List<ResourcePack> findByConvertedFalse();
}
