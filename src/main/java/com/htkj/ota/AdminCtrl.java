package com.htkj.ota;

import com.htkj.ota.model.Device;
import com.htkj.ota.model.Product;
import org.springframework.jdbc.core.JdbcTemplate;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.ResponseBody;

import javax.annotation.Resource;
import java.util.Date;
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


    @RequestMapping("/getProductsForList")
    @ResponseBody
    public DataModel getProductsForList() {
        String sql = "select * from t_products";
        sql += " order by t_id desc ";
        List<Map<String, Object>> data = this.jdbc.queryForList(sql);
        return new DataModel(data.size(), data);
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

    @RequestMapping("/addProduct")
    @ResponseBody
    public boolean addProduct(@RequestBody Product model) {
        String sql = "insert into t_products(t_name, t_remarks, t_systime) values (?,?,?)";
        int count = this.jdbc.update(sql, new Object[]{model.t_name, model.t_remarks, new Date().getTime()});
        return count == 1;
    }

    @RequestMapping("/editProduct")
    @ResponseBody
    public boolean editProduct(@RequestBody Product model) {
        String sql = "update t_products set t_name=?,t_remarks=? where t_id=?";
        int count = this.jdbc.update(sql, new Object[]{model.t_name, model.t_remarks, model.t_id});
        return count == 1;
    }

    @RequestMapping("/deleteProduct/{id}")
    @ResponseBody
    public boolean deleteProduct(@PathVariable("id") int id) {
        String sql = "delete from t_products where t_id=?";
        int count = this.jdbc.update(sql, new Object[]{id});
        return count == 1;
    }

    @RequestMapping(value = {"/getDevices/{pageIndex}/{pageSize}/{productId}/{key}",
            "/getDevices/{pageIndex}/{pageSize}/{productId}"})
    @ResponseBody
    public DataModel getDevices(@PathVariable("pageIndex") int pageIndex,
                                @PathVariable("pageSize") int pageSize,
                                @PathVariable("productId") int productId,
                                @PathVariable(value = "key", required = false) String key) {
        String sql1 = "select count(*) from t_devices where 1=1";
        String sql2 = "select td.*,tp.t_name product_name from t_devices td left join t_products tp on tp.t_id=td.t_product_id where 1=1";
        String where = "";
        if (key != null && !key.isEmpty()) {
            where = " and t_code like '%" + key + "%' ";
            sql1 += where;
            sql2 += where;
        }
        if (productId != 0) {
            where = " and t_product_id=" + productId + " ";
            sql1 += where;
            sql2 += where;
        }
        sql2 += " order by t_id desc ";
        sql2 += " limit " + (pageIndex - 1) * pageSize + "," + pageSize;
        int count = this.jdbc.queryForObject(sql1, Integer.class);
        List<Map<String, Object>> data = this.jdbc.queryForList(sql2);
        return new DataModel(count, data);
    }

    @RequestMapping("/addDevice")
    @ResponseBody
    public boolean addDevice(@RequestBody Device model) {
        String sql = "insert into t_devices(t_product_id, t_code, t_current_version, t_remarks, t_systime) values (?,?,?,?,?)";
        int count = this.jdbc.update(sql, new Object[]{model.t_product_id, model.t_code, model.t_current_version, model.t_remarks, new Date().getTime()});
        return count == 1;
    }

    @RequestMapping("/editDevice")
    @ResponseBody
    public boolean editDevice(@RequestBody Device model) {
        String sql = "update t_devices set t_product_id=?,t_code=?,t_current_version=?,t_remarks=? where t_id=?";
        int count = this.jdbc.update(sql, new Object[]{model.t_product_id, model.t_code, model.t_current_version, model.t_remarks, model.t_id});
        return count == 1;
    }

    @RequestMapping("/deleteDevice/{id}")
    @ResponseBody
    public boolean deleteDevice(@PathVariable("id") int id) {
        String sql = "delete from t_devices where t_id=?";
        int count = this.jdbc.update(sql, new Object[]{id});
        return count == 1;
    }
}
