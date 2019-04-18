package com.htkj.ota;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.ResponseBody;

import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpSession;

@Controller
@RequestMapping("/auth")
public class AuthCtrl {

    @Value("${auth.account}")
    private String authAccount;
    @Value("${auth.password}")
    private String authPassword;

    @RequestMapping("/login")
    public String login() {
        return "/login";
    }


    @RequestMapping("/auth")
    @ResponseBody
    public boolean auth(@RequestParam("account") String account,
                        @RequestParam("password") String password,
                        HttpServletRequest request) {
        if (account.equals(this.authAccount) && password.equals(this.authPassword)) {
            HttpSession session = request.getSession();
            session.setAttribute("auth", true);
            return true;
        }
        return false;
    }
}
