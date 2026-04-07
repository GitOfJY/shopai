package com.shopai.shopai.domain.product.entity;

import com.shopai.shopai.global.entity.BaseEntity;
import jakarta.persistence.*;
import lombok.*;

import java.math.BigDecimal;
import java.util.ArrayList;
import java.util.List;

@Entity
@Table(name = "products")
@Getter
@NoArgsConstructor(access = AccessLevel.PROTECTED)
@AllArgsConstructor
@Builder
public class Product extends BaseEntity {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false, length = 200)
    private String name;

    @Column(length = 100)
    private String category;

    @Column(nullable = false, precision = 10, scale = 2)
    private BigDecimal basePrice;

    @Column(columnDefinition = "TEXT")
    private String description;

    @Column(columnDefinition = "TEXT")
    private String aiDescription;

    @Column(length = 500)
    private String imageUrl;

    @Column(columnDefinition = "JSON")
    private String embeddingVector;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    @Builder.Default
    private ProductStatus status = ProductStatus.ACTIVE;

    @OneToMany(mappedBy = "product", cascade = CascadeType.ALL, orphanRemoval = true)
    @Builder.Default
    private List<ProductOptionGroup> optionGroups = new ArrayList<>();

    @OneToMany(mappedBy = "product", cascade = CascadeType.ALL, orphanRemoval = true)
    @Builder.Default
    private List<ProductVariant> variants = new ArrayList<>();

    public void update(String name, String category, BigDecimal basePrice, String description, String imageUrl) {
        this.name = name;
        this.category = category;
        this.basePrice = basePrice;
        this.description = description;
        this.imageUrl = imageUrl;
    }

    public void updateAiDescription(String aiDescription) {
        this.aiDescription = aiDescription;
    }

    public void updateStatus(ProductStatus status) {
        this.status = status;
    }
}