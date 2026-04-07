package com.shopai.shopai.domain.product.service;

import com.shopai.shopai.domain.product.dto.*;
import com.shopai.shopai.domain.product.entity.*;
import com.shopai.shopai.domain.product.repository.ProductRepository;
import com.shopai.shopai.global.exception.BaseException;
import com.shopai.shopai.global.exception.ErrorCode;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.util.Map;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
@Transactional(readOnly = true)
public class ProductService {
    private final ProductRepository productRepository;

    public Page<ProductResponse> getProducts(String category, ProductStatus status, Pageable pageable) {
        Page<Product> products;

        if (category != null && status != null) {
            products = productRepository.findByCategoryAndStatus(category, status, pageable);
        } else if (category != null) {
            products = productRepository.findByCategory(category, pageable);
        } else if (status != null) {
            products = productRepository.findByStatus(status, pageable);
        } else {
            products = productRepository.findAll(pageable);
        }

        return products.map(ProductResponse::from);
    }

    public ProductResponse getProduct(Long id) {
        Product product = findProductById(id);
        return ProductResponse.from(product);
    }

    @Transactional
    public ProductResponse createProduct(ProductCreateRequest request) {
        Product product = Product.builder()
                .name(request.getName())
                .category(request.getCategory())
                .basePrice(request.getBasePrice())
                .description(request.getDescription())
                .imageUrl(request.getImageUrl())
                .build();

        // 옵션그룹 + 옵션값 조립
        if (request.getOptionGroups() != null) {
            for (OptionGroupCreateRequest groupReq : request.getOptionGroups()) {
                ProductOptionGroup group = ProductOptionGroup.builder()
                        .product(product)
                        .name(groupReq.getName())
                        .sortOrder(groupReq.getSortOrder() != null ? groupReq.getSortOrder() : 0)
                        .build();

                if (groupReq.getOptionValues() != null) {
                    for (OptionValueCreateRequest valueReq : groupReq.getOptionValues()) {
                        ProductOptionValue value = ProductOptionValue.builder()
                                .optionGroup(group)
                                .value(valueReq.getValue())
                                .sortOrder(valueReq.getSortOrder() != null ? valueReq.getSortOrder() : 0)
                                .build();
                        group.getOptionValues().add(value);
                    }
                }

                product.getOptionGroups().add(group);
            }
        }

        // variant 조립
        if (request.getVariants() != null) {
            // 옵션값 이름 → 엔티티 매핑
            Map<String, ProductOptionValue> optionValueMap = product.getOptionGroups().stream()
                    .flatMap(g -> g.getOptionValues().stream())
                    .collect(Collectors.toMap(ProductOptionValue::getValue, v -> v));

            for (VariantCreateRequest variantReq : request.getVariants()) {
                ProductVariant variant = ProductVariant.builder()
                        .product(product)
                        .sku(variantReq.getSku())
                        .additionalPrice(variantReq.getAdditionalPrice() != null ? variantReq.getAdditionalPrice() : BigDecimal.ZERO)
                        .stockQuantity(variantReq.getStockQuantity() != null ? variantReq.getStockQuantity() : 0)
                        .build();

                if (variantReq.getOptionValues() != null) {
                    for (String optionValueName : variantReq.getOptionValues()) {
                        ProductOptionValue optionValue = optionValueMap.get(optionValueName);
                        if (optionValue == null) {
                            throw new BaseException(ErrorCode.INVALID_INPUT_VALUE, "존재하지 않는 옵션값: " + optionValueName);
                        }
                        ProductVariantOption variantOption = ProductVariantOption.builder()
                                .variant(variant)
                                .optionValue(optionValue)
                                .build();
                        variant.getVariantOptions().add(variantOption);
                    }
                }

                product.getVariants().add(variant);
            }
        }

        Product saved = productRepository.save(product);
        return ProductResponse.from(saved);
    }

    @Transactional
    public ProductResponse updateProduct(Long id, ProductUpdateRequest request) {
        Product product = findProductById(id);
        product.update(
                request.getName(),
                request.getCategory(),
                request.getBasePrice(),
                request.getDescription(),
                request.getImageUrl()
        );
        return ProductResponse.from(product);
    }

    @Transactional
    public VariantResponse addVariant(Long productId, VariantCreateRequest request) {
        Product product = findProductById(productId);

        Map<String, ProductOptionValue> optionValueMap = product.getOptionGroups().stream()
                .flatMap(g -> g.getOptionValues().stream())
                .collect(Collectors.toMap(ProductOptionValue::getValue, v -> v));

        ProductVariant variant = ProductVariant.builder()
                .product(product)
                .sku(request.getSku())
                .additionalPrice(request.getAdditionalPrice() != null ? request.getAdditionalPrice() : BigDecimal.ZERO)
                .stockQuantity(request.getStockQuantity() != null ? request.getStockQuantity() : 0)
                .build();

        if (request.getOptionValues() != null) {
            for (String optionValueName : request.getOptionValues()) {
                ProductOptionValue optionValue = optionValueMap.get(optionValueName);
                if (optionValue == null) {
                    throw new BaseException(ErrorCode.INVALID_INPUT_VALUE, "존재하지 않는 옵션값: " + optionValueName);
                }
                variant.getVariantOptions().add(
                        ProductVariantOption.builder()
                                .variant(variant)
                                .optionValue(optionValue)
                                .build()
                );
            }
        }

        product.getVariants().add(variant);
        productRepository.save(product);
        return VariantResponse.from(variant);
    }

    @Transactional
    public VariantResponse updateVariant(Long productId, Long variantId, VariantUpdateRequest request) {
        Product product = findProductById(productId);
        ProductVariant variant = product.getVariants().stream()
                .filter(v -> v.getId().equals(variantId))
                .findFirst()
                .orElseThrow(() -> new BaseException(ErrorCode.PRODUCT_NOT_FOUND, "variant를 찾을 수 없습니다."));

        ProductStatus status = request.getStatus() != null ? ProductStatus.valueOf(request.getStatus()) : null;
        variant.update(request.getAdditionalPrice(), request.getStockQuantity(), status);
        return VariantResponse.from(variant);
    }

    @Transactional
    public void deleteVariant(Long productId, Long variantId) {
        Product product = findProductById(productId);
        product.getVariants().removeIf(v -> v.getId().equals(variantId));
    }

    @Transactional
    public void deleteProduct(Long id) {
        Product product = findProductById(id);
        productRepository.delete(product);
    }

    private Product findProductById(Long id) {
        return productRepository.findById(id)
                .orElseThrow(() -> new BaseException(ErrorCode.PRODUCT_NOT_FOUND));
    }
}