package com.crm.service;

import com.crm.entity.User;
import java.util.List;
import java.util.Optional;

public interface UserService {

    User createUser(User user);

    User updateUser(Integer userId, User user);

    void blockUser(Integer userId);

    void unblockUser(Integer userId);

    Optional<User> findByEmail(String email);

    User getUserById(Integer userId);

    List<User> getAllCounsellors();

    List<User> getActiveCounsellors();

    boolean existsByEmail(String email);
}