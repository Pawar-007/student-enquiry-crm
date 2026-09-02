package com.crm.security;

import com.crm.dto.request.JwtUserDTO;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import org.springframework.stereotype.Component;
import org.springframework.web.method.HandlerMethod;
import org.springframework.web.servlet.HandlerInterceptor;

@Component
public class RoleCheckInterceptor implements HandlerInterceptor {

    @Override
    public boolean preHandle(HttpServletRequest request, HttpServletResponse response, Object handler)
            throws Exception {

    	 System.out.println("ROLE INTERCEPTOR CALLED: " + request.getRequestURI());
    	 
        if (!(handler instanceof HandlerMethod handlerMethod)) {
            return true;
        }

        RequireRole requireRole = handlerMethod.getMethodAnnotation(RequireRole.class);
        System.out.println("RequireRole annotation: " + requireRole);
        if (requireRole == null) {
            return true;   // annotation nahi hai to koi restriction nahi
        }
        
        JwtUserDTO currentUser = CurrentUserContext.get();
        
        System.out.println("Current User: " + currentUser);
        System.out.println("JWT Role: " +
                (currentUser != null ? currentUser.getRole() : "NULL"));

        System.out.println("Required Role: " + requireRole.value());
        
        if (currentUser == null) {
            response.setStatus(HttpServletResponse.SC_UNAUTHORIZED);
            response.getWriter().write("Not authenticated");
            return false;
        }
        

        if (!currentUser.getRole().equalsIgnoreCase(requireRole.value())) {
            response.setStatus(HttpServletResponse.SC_FORBIDDEN);
            response.getWriter().write("Access denied: requires " + requireRole.value() + " role");
            return false;
        }

        return true;
    }
}