package com.shopai.shopai.domain.order.repository;

import com.shopai.shopai.domain.order.entity.Order;
import com.shopai.shopai.domain.order.entity.OrderStatus;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;

public interface OrderRepository extends JpaRepository<Order, Long> {
    Page<Order> findByMemberId(Long memberId, Pageable pageable);
    Page<Order> findByMemberIdAndStatus(Long memberId, OrderStatus status, Pageable pageable);
    Page<Order> findAll(Pageable pageable);
    Page<Order> findByOrderProducts_Variant_Product_SellerId(Long sellerId, Pageable pageable);
}