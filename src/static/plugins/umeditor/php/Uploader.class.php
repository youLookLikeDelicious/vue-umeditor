<?php
/**
 * Created by JetBrains PhpStorm.
 * User: taoqili
 * Date: 12-7-18
 * Time: 上午11: 32
 * UEditor编辑器通用上传类
 */
class Uploader
{
    private $fileField;            //文件域名
    private $file;                 //文件上传对象
    private $config;               //配置信息
    private $oriName;              //原始文件名
    private $fileName = Array();             //新文件名
    private $fullName = Array();             //完整文件名,即从当前配置目录开始的URL
    private $fileSize;             //文件大小
    private $fileType;             //文件类型
    private $stateInfo;            //上传状态信息,
	private $upFail = Array();	   // 上传失败的信息
    private $stateMap = Array(    //上传状态映射表，国际化用户需考虑此处数据的国际化
        0 => "SUCCESS",          //上传成功标记，在UEditor中内不可改变，否则flash判断会出错
        1 => "文件大小超出 upload_max_filesize 限制" ,
        2 => "文件大小超出 MAX_FILE_SIZE 限制" ,
        3 => "文件未被完整上传",
        4 => "没有文件被上传",
        5 => "上传文件为空",
		6 => "部分上传成功",
		7 => "文件格式错误",
		8 => "部分文件格式错误",
		9 => "上传失败,无一张图片上传",
        "POST" => "文件大小超出 post_max_size 限制" ,
        "SIZE" => "文件大小超出网站限制",
        "TYPE" => "不允许的文件类型",
        "DIR" => "目录创建失败",
        "IO" => "输入输出错误",
        "UNKNOWN" => "未知错误",
        "MOVE" => "文件保存时出错",
        "DIR_ERROR" => "创建目录失败"
    );

    /**
     * 构造函数
     * @param string $fileField 表单名称
     * @param array $config  配置项
     * @param bool $base64  是否解析base64编码，可省略。若开启，则$fileField代表的是base64编码的字符串表单名
     */
    public function __construct( $fileField , $config , $base64 = false )
    {
        $this->fileField = $fileField;
        $this->config = $config;
		$this->config['rootPath'] = $_SERVER['DOCUMENT_ROOT'] . '/';
        $this->stateInfo = $this->stateMap[ 0 ];
        $this->upFile( $base64 );
    }

    /**
     * 上传文件的主处理方法
     * @param $base64
     * @return mixed
     */
    private function upFile( $base64 )
    {
		$rootPath = $this->config['rootPath'];
		
        //处理base64上传
        if ( "base64" == $base64 ) {
            $content = $_POST[ $this->fileField ];
            $this->base64ToImage( $content );
            return;
        }
        //处理普通上传
		$files = $this->file = $this->dealFiels($_FILES[ $this->fileField ]);
		
		foreach($files as $k => $file){		
			if ( !$file ) {
				$this->stateInfo = $this->getStateInfo( 'POST', $k );
				continue;
			}
			if ( $file[ 'error' ] != 0 ) {
				$this->stateInfo = $this->getStateInfo( $file[ 'error' ], $k );
				$this->upFail[] = $k;
				continue;
			}
			if ( !is_uploaded_file( $file[ 'tmp_name' ] ) ) {
				$this->stateInfo = $this->getStateInfo( "UNKNOWN", $k );
				continue;
			}

			$this->oriName = $file[ 'name' ];
			$this->fileSize = $file[ 'size' ];
			$this->fileType = $this->getFileExt($k);

			if ( !$this->checkSize() ) {
				$this->stateInfo = $this->getStateInfo( "SIZE", $k );
				continue;
			}
			if ( !$this->checkType() ) {
				$this->stateInfo = $this->getStateInfo( "TYPE", $k );
				continue;
			}

			$folder = $this->getFolder();

			if ( $folder === false ) {
				$this->stateInfo = $this->getStateInfo( "DIR_ERROR", $k );
				continue;
			}

			$fullName = $folder . '/' . $this->getName();
			
			// 上传成功
			if ( $this->stateInfo == $this->stateMap[ 0 ] ) {
				if ( !move_uploaded_file( $file[ "tmp_name" ] , $fullName )) {
					$this->stateInfo = $this->getStateInfo( "MOVE", $k );
				}
				$this->fullName[] = str_replace($rootPath, '/', $fullName);
			}
		}
    }
	
    /**
     * 处理base64编码的图片上传
     * @param $base64Data
     * @return mixed
     */
    private function base64ToImage( $base64Data )
    {
        $img = base64_decode( $base64Data );
        $this->fileName = time() . rand( 1 , 10000 ) . ".png";
        $this->fullName = $this->getFolder() . '/' . $this->fileName;
        if ( !file_put_contents( $this->fullName , $img ) ) {
            $this->stateInfo = $this->getStateInfo( "IO" );
            return;
        }
        $this->oriName = "";
        $this->fileSize = strlen( $img );
        $this->fileType = ".png";
    }
	
    /**
     * 获取当前上传成功文件的各项信息
     * @return array
     */
    public function getFileInfo()
    {
		$info = array(
//            "originalName" => $this->oriName ,
//            "name" => $this->fileName ,
            "url" => $this->fullName ,
//            "size" => $this->fileSize ,
//            "type" => $this->fileType ,
            "state" => $this->stateInfo
        );
		if(!empty($this->upFaild)){
			$info['upFail'] = $this->upFail;
			
			if(count($this->file) == count($this->upFail)){
				$info['state'] = $this->stateMap[9];
			} else{
				$info['state'] = $this->stateMap[6] . ',' . $info['state'];
			}
		}
		
		return $info;
    }

    /**
     * 上传错误检查
     * @param $errCode
     * @return string
     */
    private function getStateInfo( $errCode, $k = null )
    {
		if($k !== null)
			$this->upFail[] = $k;
        return !$this->stateMap[ $errCode ] ? $this->stateMap[ "UNKNOWN" ] : $this->stateMap[ $errCode ];
    }

    /**
     * 重命名文件
     * @return string
     */
    private function getName()
    {
        return $this->fileName = time() . rand( 1 , 10000 ) . $this->fileType;
    }

    /**
     * 文件类型检测
     * @return bool
     */
    private function checkType()
    {
        return in_array( $this->fileType , $this->config[ "allowFiles" ] );
    }

    /**
     * 文件大小检测
     * @return bool
     */
    private function  checkSize()
    {
        return $this->fileSize <= ( $this->config[ "maxSize" ] * 1024 );
    }

    /**
     * 获取文件扩展名
     * @return string
     */
    private function getFileExt($k)
    {
        return strtolower( strrchr( $this->file[$k][ "name" ] , '.' ) );
    }
	
	/**
	 * 转换上传文件数组为正确的方式
	 *@param array('name' => array()) | array('name' => string)
	 * return array $fileArr
	 */
	protected function dealFiels($files){
		$fileArr = Array();
		$tmp = Array();
		
		$len = is_array($files['name'])? count($files['name']) : 0;
		
		if( $len ){
			for($i = 0; $i < $len; $i++){
				foreach($files as $k => $v){
					$tmp[$k] = $v[$i];
				}
				
				$fileArr[] = $tmp;
			}
		} else{
			return array($files);
		}
		return $fileArr;
	}
    /**
     * 按照日期自动创建存储文件夹
     * @return string
     */
    private function getFolder()
    {
        $pathStr = $this->config['rootPath'] . $this->config[ "savePath" ];
        if ( strrchr( $pathStr , "/" ) != "/" ) {
            $pathStr .= "/";
        }
        $pathStr .= date( "Ymd" );
        if ( !file_exists( $pathStr ) ) {
            if ( !mkdir( $pathStr , 0777 , true ) ) {
                return false;
            }
        }
        return $pathStr;
    }
}