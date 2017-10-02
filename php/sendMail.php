<?php
include_once 'function.php';

ini_set('display_errors', 0);
$result = array();
$post = $_POST;

$matches = checkDomain();
if($matches && isset($post["name"]) && isset($post["tel"]) && isset($post["mail"]) && isset($post["comment"])){

	$post = $_POST;

//文字コードの設定
mb_language("uni");
mb_internal_encoding("UTF-8");

$post = array();
$post = $_POST;
foreach($post as $key => $val){
$post[$key] = stripslashes($val);
}

//送信先のメールアドレス、タイトル、本文、ヘッダー(送信者のメールアドレス)
$send = "kickinfo@kick.co.jp";

$subject = "kiCkホームページ＿メールフォームより送信";

$header = "From:from@www.kick.co.jp";

$message = <<<Echo
ホームページから問合せがありました。
問い合わせの内容は以下になります。
────────────────────────────────

┃NAME
{$post['name']}

┃COMPANY
{$post['company']}

┃TEL
{$post['tel']}

┃MAIL
{$post['mail']}

┃COMMENT
{$post['comment']}


────────────────────────────────

Echo;

//メールの送信:管理者へ
$mailresult = mb_send_mail($send, $subject, $message, $header);
if($mailresult){
	$result["result"] = 1;
} else {
	$result["result"] = 0;
}
} else {
	$result["result"] = 0;
}
echo json_encode($result);


