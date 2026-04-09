package com.shopai.shopai.domain.product.repository;

import com.shopai.shopai.domain.product.entity.ProductVariant;
import org.springframework.data.jpa.repository.JpaRepository;

public interface ProductVariantRepository extends JpaRepository<ProductVariant, Long> {
}