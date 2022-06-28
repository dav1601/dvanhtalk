<?php

function text__err__request($name = "", $type)
{
    switch ($type) {
        case "string":
            return $name . " " . "phải là 1 chuỗi kí tự";
            break;
        case "required":
            return $name . " " . "không được để trống";
            break;
        case "email":
            return $name . " " . "chưa đúng định dạng";
            break;
        case "unique":
            return $name . " " . "đã tồn tại trong hệ thống";
            break;
        case "numeric":
            return $name . " " . "bắt buộc là chữ số";
            break;
        default:
            return "";
    }
}
