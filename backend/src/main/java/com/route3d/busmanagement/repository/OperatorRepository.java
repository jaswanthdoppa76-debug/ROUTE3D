package com.route3d.busmanagement.repository;

import com.route3d.busmanagement.entity.Operator;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface OperatorRepository extends JpaRepository<Operator, Long> {
    Optional<Operator> findByCode(String code);
    Optional<Operator> findByName(String name);
}
