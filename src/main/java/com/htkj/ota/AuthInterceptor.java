package com.htkj.ota;

import org.springframework.web.servlet.HandlerInterceptor;

import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
import javax.servlet.http.HttpSession;

public class AuthInterceptor implements HandlerInterceptor {

    @Override
    public boolean preHandle(HttpServletRequest request, HttpServletResponse response, Object handler) throws Exception {
        HttpSession session = request.getSession();
        Object obj = session.getAttribute("auth");
        if (obj != null) {
            boolean auth = (boolean) obj;
            if (auth) {
                return true;
            }
        }
        response.sendRedirect(request.getContextPath() + "/auth/login");
        return false;
    }
}
