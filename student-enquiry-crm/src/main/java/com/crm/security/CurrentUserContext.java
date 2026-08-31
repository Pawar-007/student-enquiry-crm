package com.crm.security;

import com.crm.dto.request.JwtUserDTO;

public class CurrentUserContext {

    private static final ThreadLocal<JwtUserDTO> currentUser = new ThreadLocal<>();

    public static void set(JwtUserDTO user) {
        currentUser.set(user);
    }

    public static JwtUserDTO get() {
        return currentUser.get();
    }

    public static void clear() {
        currentUser.remove();  // request khatam hone par saaf karna zaroori — memory leak se bachne ke liye
    }
}