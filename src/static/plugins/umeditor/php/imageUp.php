<?php
    header("Content-Type:text/html;charset=utf-8");
    error_reporting( E_ERROR | E_WARNING );
    date_default_timezone_set("Asia/chongqing");
    require_once "Uploader.class.php";

    //上传配置
    $config = array(
        "savePath" => 'utile/html/umeditor1_2_3-utf8-php/Public/GoodsDesc/',//相对网站根目录的路径
        "maxSize" => 1000 ,                   //允许的文件最大尺寸，单位KB
        "allowFiles" => array( ".gif" , ".png" , ".jpg" , ".jpeg" , ".bmp" )  //允许的文件格式
    );

    //背景保存在临时目录中
    $up = new Uploader( "upfile" , $config );
    $type = $_REQUEST['type'];
    $callback=$_GET['callback'];
	
    $info = $up->getFileInfo();
    /**
     * 返回数据
     */
    if($callback) {
        echo '<script>'.$callback.'('.(json_encode($info)).');</script>';
    } else {
        echo json_encode($info);
    }
