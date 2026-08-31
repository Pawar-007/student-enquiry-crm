package com.crm.service.impl;

import com.crm.dto.request.UserRequestDTO;
import com.crm.dto.response.UserResponseDTO;
import com.crm.entity.User;
import com.crm.repository.UserRepository;
import com.crm.service.UserService;
import com.crm.util.CommonUtils;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;

@Service
public class UserServiceImpl implements UserService {

    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;

    @Autowired
    public UserServiceImpl(UserRepository userRepository, PasswordEncoder passwordEncoder) {
        this.userRepository = userRepository;
        this.passwordEncoder = passwordEncoder;
    }

    @Override
    public UserResponseDTO createUser(UserRequestDTO dto) {
        // Create ke liye jo fields mandatory hain, unka manual check yahan
        if (dto.getName() == null || dto.getName().isBlank())
            throw new IllegalArgumentException("Name is required");
        if (dto.getEmail() == null || dto.getEmail().isBlank())
            throw new IllegalArgumentException("Email is required");
        if (dto.getPassword() == null || dto.getPassword().isBlank())
            throw new IllegalArgumentException("Password is required");
        if (dto.getRole() == null)
            throw new IllegalArgumentException("Role is required");
        if (existsByEmail(dto.getEmail()))
            throw new IllegalArgumentException("Email already registered: " + dto.getEmail());

        User user = dto.toEntity();
        user.setPassword(passwordEncoder.encode(dto.getPassword()));

        User savedUser = userRepository.save(user);
        return UserResponseDTO.fromEntity(savedUser);
    }

    @Override
    public UserResponseDTO updateUser(Integer userId, UserRequestDTO dto) {
        User existingUser = userRepository.findById(userId)
                .orElseThrow(() -> new RuntimeException("User not found with id: " + userId));

        // Email change ho raha hai to duplicate check
        if (dto.getEmail() != null && !dto.getEmail().equals(existingUser.getEmail())
                && existsByEmail(dto.getEmail())) {
            throw new IllegalArgumentException("Email already in use: " + dto.getEmail());
        }

        // Password ko encode karna hai to update se pehle hi karo (raw password DTO mein tha)
        if (dto.getPassword() != null && !dto.getPassword().isBlank()) {
            dto.setPassword(passwordEncoder.encode(dto.getPassword()));
        } else {
            dto.setPassword(null); // ensure copyNonNullProperties ise skip kare
        }

        // Sirf non-null fields copy honge - baaki waise hi rahenge
        CommonUtils.copyNonNullProperties(dto, existingUser);

        User updatedUser = userRepository.save(existingUser);
        return UserResponseDTO.fromEntity(updatedUser);
    }

    @Override
    public void blockUser(Integer userId) {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new RuntimeException("User not found with id: " + userId));
        user.setStatus(User.UserStatus.Blocked);
        userRepository.save(user);
    }

    @Override
    public void unblockUser(Integer userId) {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new RuntimeException("User not found with id: " + userId));
        user.setStatus(User.UserStatus.Active);
        userRepository.save(user);
    }

    @Override
    public Optional<User> findByEmail(String email) {
        return userRepository.findByEmail(email);
    }

    @Override
    public UserResponseDTO getUserById(Integer userId) {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new RuntimeException("User not found with id: " + userId));
        return UserResponseDTO.fromEntity(user);
    }

    @Override
    public List<UserResponseDTO> getAllCounsellors() {
        return userRepository.findByRole(User.Role.Counsellor)
                .stream().map(UserResponseDTO::fromEntity).collect(Collectors.toList());
    }

    @Override
    public List<UserResponseDTO> getActiveCounsellors() {
        return userRepository.findByRoleAndStatus(User.Role.Counsellor, User.UserStatus.Active)
                .stream().map(UserResponseDTO::fromEntity).collect(Collectors.toList());
    }

    @Override
    public boolean existsByEmail(String email) {
        return userRepository.existsByEmail(email);
    }
}