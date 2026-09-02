package com.crm.dto.request;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Getter
@Setter
@AllArgsConstructor
@NoArgsConstructor
public class JwtUserDTO {

    private Integer userId;
    private String email;
    private String role;
	@Override
	public String toString() {
		return "JwtUserDTO [userId=" + userId + ", email=" + email + ", role=" + role + "]";
	}
    
    
}