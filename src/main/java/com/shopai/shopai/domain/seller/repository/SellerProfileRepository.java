package com.shopai.shopai.domain.seller.repository;

import com.shopai.shopai.domain.seller.entity.SellerProfile;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.Optional;

public interface SellerProfileRepository extends JpaRepository<SellerProfile, Long> {
    Optional<SellerProfile> findByStoreSlug(String storeSlug);

    Optional<SellerProfile> findByMemberId(Long memberId);

    boolean existsByStoreSlug(String storeSlug);
}