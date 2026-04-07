package com.shopai.shopai.domain.product.service;

import com.shopai.shopai.domain.product.dto.ProductCreateRequest;
import com.shopai.shopai.domain.product.dto.ProductResponse;
import com.shopai.shopai.domain.product.dto.ProductUpdateRequest;
import com.shopai.shopai.domain.product.entity.Product;
import com.shopai.shopai.domain.product.entity.ProductStatus;
import com.shopai.shopai.domain.product.repository.ProductRepository;
import com.shopai.shopai.global.exception.BaseException;
import com.shopai.shopai.global.exception.ErrorCode;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

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
        Product product = request.toEntity();
        Product saved = productRepository.save(product);
        return ProductResponse.from(saved);
    }

    @Transactional
    public ProductResponse updateProduct(Long id, ProductUpdateRequest request) {
        Product product = findProductById(id);
        product.update(
                request.getName(),
                request.getCategory(),
                request.getPrice(),
                request.getDescription(),
                request.getImageUrl()
        );
        return ProductResponse.from(product);
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