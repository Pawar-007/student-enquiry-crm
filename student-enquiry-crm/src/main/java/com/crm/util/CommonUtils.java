package com.crm.util;

import org.springframework.beans.BeanUtils;
import org.springframework.beans.BeanWrapper;
import org.springframework.beans.BeanWrapperImpl;

import java.util.ArrayList;
import java.util.List;

public class CommonUtils {

    /**
     * Source object (jaise DTO) ke sirf NON-NULL fields ko target object 
     * (jaise existing Entity) mein copy karta hai.
     * Isse partial update ho jata hai - jo field client ne nahi bheja,
     * wo target mein waisa hi rahega jaisa pehle tha.
     */
    public static void copyNonNullProperties(Object source, Object target) {
        BeanUtils.copyProperties(source, target, getNullPropertyNames(source));
    }

    private static String[] getNullPropertyNames(Object source) {
        final BeanWrapper wrappedSource = new BeanWrapperImpl(source);
        List<String> nullProperties = new ArrayList<>();

        for (var pd : wrappedSource.getPropertyDescriptors()) {
            String propertyName = pd.getName();
            Object value = wrappedSource.getPropertyValue(propertyName);
            if (value == null) {
                nullProperties.add(propertyName);
            }
        }
        return nullProperties.toArray(new String[0]);
    }
}