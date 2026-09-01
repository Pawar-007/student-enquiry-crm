package com.crm.repository;

import com.crm.entity.User;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.Optional;

public interface UserRepository extends JpaRepository<User, Integer> {

    Optional<User> findByEmail(String email);

    boolean existsByEmail(String email);

    java.util.List<User> findByRole(User.Role role);

    java.util.List<User> findByRoleAndStatus(User.Role role, User.UserStatus status);
    
    long countByRole(User.Role role);
    long countByRoleAndStatus(User.Role role, User.UserStatus status);
}