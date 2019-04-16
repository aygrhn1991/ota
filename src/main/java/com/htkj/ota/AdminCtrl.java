package com.htkj.ota;

import org.springframework.jdbc.core.JdbcTemplate;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.ResponseBody;

import javax.annotation.Resource;
import java.util.List;
import java.util.Map;

@Controller
@RequestMapping("/admin")
public class AdminCtrl {
    @Resource
    private JdbcTemplate jdbc;

    @RequestMapping("/index")
    public String index() {
        return "/index";
    }

    @RequestMapping("/products")
    public String products() {
        return "/products";
    }

    @RequestMapping("/devices")
    public String devices() {
        return "/devices";
    }

    @RequestMapping("/softwares")
    public String softwares() {
        return "/softwares";
    }

    @RequestMapping("/logs")
    public String logs() {
        return "/logs";
    }


    @RequestMapping(value = {"/getProducts/{pageIndex}/{pageSize}/{key}",
            "/getProducts/{pageIndex}/{pageSize}"})
    @ResponseBody
    public DataModel getProducts(@PathVariable("pageIndex") int pageIndex,
                                 @PathVariable("pageSize") int pageSize,
                                 @PathVariable(value = "key", required = false) String key) {
        String sql1 = "select count(*) from t_products where 1=1";
        String sql2 = "select * from t_products where 1=1";
        String where = "";
        if (key != null && !key.isEmpty()) {
            where = " and t_name like '%" + key + "%' ";
            sql1 += where;
            sql2 += where;
        }
        sql2 += " order by t_id desc ";
        sql2 += " limit " + (pageIndex - 1) * pageSize + "," + pageSize;
        int count = this.jdbc.queryForObject(sql1, Integer.class);
        List<Map<String, Object>> data = this.jdbc.queryForList(sql2);
        return new DataModel(count, data);
    }

}
