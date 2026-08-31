package com.crm.service;

import com.crm.dto.request.UserRequestDTO;
import com.crm.dto.response.UserResponseDTO;
import com.crm.entity.User;
import java.util.List;
import java.util.Optional;

public interface UserService {

    // Admin only (enforced at Controller via @PreAuthorize)
    UserResponseDTO createUser(UserRequestDTO user);

    // Admin only
    UserResponseDTO updateUser(Integer userId, UserRequestDTO user);

    // Admin only
    void blockUser(Integer userId);

    // Admin only
    void unblockUser(Integer userId);

    // INTERNAL USE ONLY — Spring Security login flow ke liye use hoga
    // Koi Controller endpoint iske liye mat banao, koi role-check bhi nahi
    Optional<User> findByEmail(String email);

    // Admin only
    UserResponseDTO getUserById(Integer userId);

    // Admin only
    List<UserResponseDTO> getAllCounsellors();

    // Admin only
    List<UserResponseDTO> getActiveCounsellors();

    // INTERNAL USE ONLY — createUser() ke andar duplicate check ke liye
    boolean existsByEmail(String email);
}