package com.htkj.ota;

import com.htkj.ota.model.Device;
import com.htkj.ota.model.Product;
import com.htkj.ota.model.Software;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.jdbc.core.JdbcTemplate;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import javax.annotation.Resource;
import java.io.File;
import java.io.FileOutputStream;
import java.util.Date;
import java.util.List;
import java.util.Map;

@Controller
@RequestMapping("/admin")
public class AdminCtrl {
    @Resource
    private JdbcTemplate jdbc;

    @Value("${software.path}")
    private String softwarePath;

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
        String sql1 = "select count(*) from t_devices td where 1=1";
        String sql2 = "select td.*,tp.t_name product_name,ts.t_version software_version from t_devices td left join t_products tp on tp.t_id=td.t_product_id left join t_softwares ts on ts.t_id=td.t_software_id where 1=1";
        String where = "";
        if (key != null && !key.isEmpty()) {
            where = " and t_code like '%" + key + "%' ";
            sql1 += where;
            sql2 += where;
        }
        if (productId != 0) {
            where = " and td.t_product_id=" + productId + " ";
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
        String sql = "insert into t_devices(t_product_id, t_software_id, t_code, t_remarks, t_systime) values (?,?,?,?,?)";
        int count = this.jdbc.update(sql, new Object[]{model.t_product_id, model.t_software_id, model.t_code, model.t_remarks, new Date().getTime()});
        return count == 1;
    }

    @RequestMapping("/editDevice")
    @ResponseBody
    public boolean editDevice(@RequestBody Device model) {
        String sql = "update t_devices set t_product_id=?,t_software_id=?,t_code=?,t_remarks=? where t_id=?";
        int count = this.jdbc.update(sql, new Object[]{model.t_product_id, model.t_software_id, model.t_code, model.t_remarks, model.t_id});
        return count == 1;
    }

    @RequestMapping("/deleteDevice/{id}")
    @ResponseBody
    public boolean deleteDevice(@PathVariable("id") int id) {
        String sql = "delete from t_devices where t_id=?";
        int count = this.jdbc.update(sql, new Object[]{id});
        return count == 1;
    }

    @RequestMapping("/getSoftwaresForList/{productId}")
    @ResponseBody
    public DataModel getSoftwaresForList(@PathVariable("productId") int productId) {
        String sql = "select * from t_softwares where t_product_id=" + productId;
        sql += " order by t_id desc ";
        List<Map<String, Object>> data = this.jdbc.queryForList(sql);
        return new DataModel(data.size(), data);
    }

    @RequestMapping(value = {"/getSoftwares/{pageIndex}/{pageSize}/{productId}/{key}",
            "/getSoftwares/{pageIndex}/{pageSize}/{productId}"})
    @ResponseBody
    public DataModel getSoftwares(@PathVariable("pageIndex") int pageIndex,
                                  @PathVariable("pageSize") int pageSize,
                                  @PathVariable("productId") int productId,
                                  @PathVariable(value = "key", required = false) String key) {
        String sql1 = "select count(*) from t_softwares where 1=1";
        String sql2 = "select ts.*,tp.t_name product_name from t_softwares ts left join t_products tp on tp.t_id=ts.t_product_id where 1=1";
        String where = "";
        if (key != null && !key.isEmpty()) {
            where = " and t_version like '%" + key + "%' ";
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

    @RequestMapping("/addSoftware")
    @ResponseBody
    public int addSoftware(@RequestParam("t_product_id") int t_product_id,
                           @RequestParam("t_version") String t_version,
                           @RequestParam("t_remarks") String t_remarks,
                           @RequestParam("file") MultipartFile file) {
        String fileName = file.getOriginalFilename();
        fileName = new Date().getTime() + "_" + fileName;
        String filePath = this.softwarePath;
        File targetFile = new File(filePath);
        if (!targetFile.exists()) {
            targetFile.mkdirs();
        }
        FileOutputStream out = null;
        try {
            out = new FileOutputStream(filePath + fileName);
            out.write(file.getBytes());
            out.flush();
            out.close();
        } catch (Exception e) {
            e.printStackTrace();
            return -1;
        }
        String sql = "insert into t_softwares(t_product_id, t_file_name, t_file_size, t_version, t_remarks, t_systime) values (?,?,?,?,?,?)";
        int count = this.jdbc.update(sql, new Object[]{t_product_id, fileName, file.getSize(), t_version, t_remarks, new Date().getTime()});
        return count == 1 ? 1 : 0;
    }

    @RequestMapping("/editSoftware")
    @ResponseBody
    public boolean editSoftware(@RequestBody Software model) {
        String sql = "update t_softwares set t_product_id=?,t_version=?,t_remarks=? where t_id=?";
        int count = this.jdbc.update(sql, new Object[]{model.t_product_id, model.t_version, model.t_remarks, model.t_id});
        return count == 1;
    }

    @RequestMapping("/deleteSoftware/{id}")
    @ResponseBody
    public boolean deleteSoftware(@PathVariable("id") int id) {
        String sql = "delete from t_softwares where t_id=?";
        int count = this.jdbc.update(sql, new Object[]{id});
        return count == 1;
    }
}
