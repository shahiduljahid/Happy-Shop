/**
 * 严肃声明：
 * 开源版本请务必保留此注释头信息，若删除我方将保留所有法律责任追究！
 * 本系统已申请软件著作权，受国家版权局知识产权以及国家计算机软件著作权保护！
 * 可正常分享和学习源码，不得用于违法犯罪活动，违者必究！
 * Copyright (c) 2019-2020 十三 all rights reserved.
 * 版权所有，侵权必究！
 */
package ltd.newbee.mall.common;

/**
 * @author 13
 * @qq交流群 796794009
 * @email 2449207463@qq.com
 * @link https://github.com/newbee-ltd
 */
public enum ServiceResultEnum {
    ERROR("error"),

    SUCCESS("success"),

    DATA_NOT_EXIST("No record queried!"),

    SAME_CATEGORY_EXIST("A classification with the same name already exists!"),

    SAME_LOGIN_NAME_EXIST("Username already exists!"),

    LOGIN_NAME_NULL("Please enter your login name!"),

    LOGIN_PASSWORD_NULL("Please enter your password!"),

    LOGIN_VERIFY_CODE_NULL("Please enter the verification code!"),

    LOGIN_VERIFY_CODE_ERROR("Captcha error!"),

    SAME_INDEX_CONFIG_EXIST("The same homepage configuration item already exists!"),

    GOODS_CATEGORY_ERROR("Classification data anomalies!"),

    SAME_GOODS_EXIST("The same listing already exists!"),

    GOODS_NOT_EXIST("The product does not exist!"),

    GOODS_PUT_DOWN("Item has been removed!"),

    SHOPPING_CART_ITEM_LIMIT_NUMBER_ERROR("Exceeding the maximum number of purchases for a single item!"),

    SHOPPING_CART_ITEM_TOTAL_NUMBER_ERROR("Exceeded cart maximum capacity!"),

    LOGIN_ERROR("Login failed!"),

    LOGIN_USER_LOCKED("The user has been banned from logging in!"),

    ORDER_NOT_EXIST_ERROR("The order does not exist!"),

    ORDER_ITEM_NOT_EXIST_ERROR("The line item does not exist!"),

    NULL_ADDRESS_ERROR("Address cannot be empty!"),

    ORDER_PRICE_ERROR("The order price is abnormal!"),

    ORDER_GENERATE_ERROR("Generate order exception!"),

    SHOPPING_ITEM_ERROR("Shopping cart data is abnormal!"),

    SHOPPING_ITEM_COUNT_ERROR("Out of stock!"),

    ORDER_STATUS_ERROR("The order status is abnormal!"),

    CLOSE_ORDER_ERROR("Close order failed!"),

    OPERATE_ERROR("The operation failed!"),

    NO_PERMISSION_ERROR("No permissions!"),

    DB_ERROR("database error");

    private String result;

    ServiceResultEnum(String result) {
        this.result = result;
    }

    public String getResult() {
        return result;
    }

    public void setResult(String result) {
        this.result = result;
    }
}